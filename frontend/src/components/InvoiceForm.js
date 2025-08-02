import React, { useEffect, useState } from 'react';

const InvoiceForm = () => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [invoice, setInvoice] = useState({
    invoice_number: '',
    invoice_date: '',
    due_date: '',
    customer_id: '',
  });

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    product_id: '',
    quantity: 1,
    unit_price: '',
    tax_percentage: 0,
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/customers')
      .then((res) => res.json())
      .then(setCustomers)
      .catch(console.error);

    fetch('/api/products')
      .then((res) => res.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  const handleInvoiceChange = (e) => {
    setInvoice({ ...invoice, [e.target.name]: e.target.value });
  };

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const addItem = () => {
    const product = products.find(p => p.id === parseInt(newItem.product_id));
    if (!product) return;

    const unitPrice = parseFloat(product.price);
    const quantity = parseInt(newItem.quantity);
    const tax = parseFloat(product.tax_percentage || 0);

    const total = unitPrice * quantity * (1 + tax / 100);

    setItems([...items, {
      ...newItem,
      unit_price: unitPrice,
      tax_percentage: tax,
      total,
    }]);

    setNewItem({ product_id: '', quantity: 1, unit_price: '', tax_percentage: 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...invoice, items }),
      });

      if (res.ok) {
        setMessage('✅ Invoice created successfully!');
        setInvoice({ invoice_number: '', invoice_date: '', due_date: '', customer_id: '' });
        setItems([]);
      } else {
        const errData = await res.json();
        setMessage(`❌ ${errData.error}`);
      }
    } catch (err) {
      setMessage('❌ Network error');
    }
  };

  return (
    <div className="mt-5">
      <h3>Create Invoice</h3>
      {message && <div className="alert alert-info">{message}</div>}

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Invoice Number</label>
          <input type="text" className="form-control" name="invoice_number" value={invoice.invoice_number} onChange={handleInvoiceChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Invoice Date</label>
          <input type="date" className="form-control" name="invoice_date" value={invoice.invoice_date} onChange={handleInvoiceChange} required />
        </div>
        <div className="col-md-4">
          <label className="form-label">Due Date</label>
          <input type="date" className="form-control" name="due_date" value={invoice.due_date} onChange={handleInvoiceChange} required />
        </div>
        <div className="col-md-6">
          <label className="form-label">Customer</label>
          <select className="form-select" name="customer_id" value={invoice.customer_id} onChange={handleInvoiceChange} required>
            <option value="">Select</option>
            {customers.map((cust) => (
              <option key={cust.id} value={cust.id}>{cust.name}</option>
            ))}
          </select>
        </div>
      </form>

      <hr />
      <h5>Add Items</h5>
      <div className="row g-3">
        <div className="col-md-4">
          <select className="form-select" name="product_id" value={newItem.product_id} onChange={handleItemChange}>
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <input type="number" className="form-control" name="quantity" value={newItem.quantity} min="1" onChange={handleItemChange} />
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-success" onClick={addItem}>➕ Add Item</button>
        </div>
      </div>

      {/* Invoice Items Table */}
      {items.length > 0 && (
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Tax %</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => {
              const prod = products.find(p => p.id === parseInt(it.product_id));
              return (
                <tr key={idx}>
                  <td>{prod?.name}</td>
                  <td>{it.quantity}</td>
                  <td>{it.unit_price}</td>
                  <td>{it.tax_percentage}</td>
                  <td>{it.total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="mt-3">
        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>🧾 Submit Invoice</button>
      </div>
    </div>
  );
};

export default InvoiceForm;
