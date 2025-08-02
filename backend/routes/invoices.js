const express = require('express');
const router = express.Router();
const generateInvoicePDF = require('../utils/generateInvoicePDF');

const Invoice = require('../models/Invoice');
const InvoiceItem = require('../models/InvoiceItem');
const Customer = require('../models/Customer');
const Product = require('../models/Product');

// GET all invoices with customer and items
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        { model: Customer },
        {
          model: InvoiceItem,
          include: [Product],
        },
      ],
    });
    res.json(invoices);
  } catch (err) {
    console.error('❌ Invoice fetch error:', err);
    res.status(400).json({ error: err.message });
  }
});

// POST: Create invoice with items
router.post('/', async (req, res) => {
  const { invoice_number, invoice_date, due_date, customer_id, items } = req.body;

  try {
    const invoice = await Invoice.create({
      invoice_number,
      invoice_date,
      due_date,
      customer_id,
    });

    const createdItems = await Promise.all(
      items.map(async (item) => {
        const total =
          item.unit_price * item.quantity * (1 + (item.tax_percentage || 0) / 100);

        return await InvoiceItem.create({
          invoice_id: invoice.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          tax_percentage: item.tax_percentage || 0,
          total_price: total,
        });
      })
    );

    res.status(201).json({ invoice, items: createdItems });
  } catch (err) {
    console.error('❌ Invoice creation error:', err);
    res.status(400).json({ error: err.message, details: err });
  }
});

// DELETE: Delete invoice and its items
router.delete('/:id', async (req, res) => {
  const invoiceId = req.params.id;

  try {
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await invoice.destroy(); // Cascade will auto-delete InvoiceItems if set in model
    res.json({ message: 'Invoice deleted successfully' });
  } catch (err) {
    console.error('❌ Invoice deletion error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/invoices/:id/pdf — Generate and stream PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Customer },
        { model: InvoiceItem, include: [Product] },
      ],
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const customer = invoice.Customer;
    const items = invoice.InvoiceItems;

    // 🧮 Calculate totals
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach(item => {
      const base = item.unit_price * item.quantity;
      const tax = base * (item.tax_percentage || 0) / 100;
      subtotal += base;
      taxTotal += tax;
    });

    const discount = 0; // Set based on your business logic if applicable
    const grandTotal = subtotal + taxTotal - discount;

    // Attach calculated totals to the invoice object
    invoice.total_amount = parseFloat(subtotal.toFixed(2));
    invoice.tax_total = parseFloat(taxTotal.toFixed(2));
    invoice.discount_total = parseFloat(discount.toFixed(2));
    invoice.grand_total = parseFloat(grandTotal.toFixed(2));

    // ✅ Call PDF generator
    generateInvoicePDF(invoice, items, customer, res);
  } catch (err) {
    console.error('❌ PDF generation error:', err);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

module.exports = router;


