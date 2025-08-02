import React, { useEffect, useState } from 'react';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  useEffect(() => {
    fetch('/api/invoices')
      .then((res) => res.json())
      .then((data) => setInvoices(data))
      .catch((err) => console.error('Error fetching invoices:', err));
  }, []);

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        const res = await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setInvoices(invoices.filter((inv) => inv.id !== id));
          if (selectedInvoice?.id === id) setSelectedInvoice(null);
        } else {
          alert('❌ Failed to delete invoice');
        }
      } catch (err) {
        console.error('Delete error:', err);
        alert('❌ Server error');
      }
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (key) => {
    if (sortConfig.key !== key) return '';
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  };

  const downloadPDF = async (invoiceId) => {
    try {
      const response = await fetch(`/api/invoices/${invoiceId}/pdf`);
      if (!response.ok) throw new Error('PDF not found');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Invoice-${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('❌ Failed to download PDF: ' + err.message);
    }
  };

  const filteredInvoices = invoices
    .filter((inv) =>
      inv.invoice_number?.toLowerCase().includes(search.toLowerCase()) ||
      inv.Customer?.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

  return (
    <div className="mt-5">
      <h2>Invoices</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by invoice number or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="table table-bordered mt-3">
          <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
            <tr>
              <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>
                ID{getSortArrow('id')}
              </th>
              <th onClick={() => handleSort('invoice_number')} style={{ cursor: 'pointer' }}>
                Invoice #{getSortArrow('invoice_number')}
              </th>
              <th onClick={() => handleSort('invoice_date')} style={{ cursor: 'pointer' }}>
                Date{getSortArrow('invoice_date')}
              </th>
              <th onClick={() => handleSort('customer_name')} style={{ cursor: 'pointer' }}>
                Customer{getSortArrow('customer_name')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No invoices found.</td>
              </tr>
            ) : (
              filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.invoice_number}</td>
                  <td>{invoice.invoice_date || '-'}</td>
                  <td>{invoice.Customer?.name || '-'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleViewDetails(invoice)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => downloadPDF(invoice.id)}
                    >
                      🧾 PDF
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedInvoice && (
        <div className="mt-4">
          <h4>Invoice Details - {selectedInvoice.invoice_number}</h4>
          <p><strong>Customer:</strong> {selectedInvoice.Customer?.name}</p>
          <p><strong>Date:</strong> {selectedInvoice.invoice_date}</p>
          <p><strong>Due Date:</strong> {selectedInvoice.due_date}</p>

          <table className="table table-sm table-bordered mt-3">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Tax (%)</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.InvoiceItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.Product?.name}</td>
                  <td>{item.quantity}</td>
                  <td>₹{parseFloat(item.unit_price).toFixed(2)}</td>
                  <td>{item.tax_percentage ?? 0}%</td>
                  <td>₹{parseFloat(item.total_price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div className="mt-3">
            {(() => {
              const subtotal = selectedInvoice.InvoiceItems.reduce(
                (sum, item) => sum + item.unit_price * item.quantity,
                0
              );
              const totalTax = selectedInvoice.InvoiceItems.reduce(
                (sum, item) =>
                  sum + (item.unit_price * item.quantity * (item.tax_percentage || 0)) / 100,
                0
              );
              const grandTotal = subtotal + totalTax;

              return (
                <>
                  <p><strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}</p>
                  <p><strong>Total Tax:</strong> ₹{totalTax.toFixed(2)}</p>
                  <p><strong>Grand Total:</strong> ₹{grandTotal.toFixed(2)}</p>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceList;




