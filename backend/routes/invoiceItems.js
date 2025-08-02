const express = require('express');
const router = express.Router();
const InvoiceItem = require('../models/InvoiceItem');
const Product = require('../models/Product');

// GET all invoice items (optionally with product info)
router.get('/', async (req, res) => {
  try {
    const items = await InvoiceItem.findAll({ include: [Product] });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoice items' });
  }
});

// GET single invoice item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await InvoiceItem.findByPk(req.params.id, { include: [Product] });
    if (!item) return res.status(404).json({ error: 'Invoice item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch invoice item' });
  }
});

// POST create invoice item
router.post('/', async (req, res) => {
  try {
    const item = await InvoiceItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create invoice item' });
  }
});

// PUT update invoice item
router.put('/:id', async (req, res) => {
  try {
    const updated = await InvoiceItem.update(req.body, {
      where: { id: req.params.id },
    });
    res.json({ message: 'Invoice item updated', result: updated });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update invoice item' });
  }
});

// DELETE invoice item
router.delete('/:id', async (req, res) => {
  try {
    await InvoiceItem.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Invoice item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete invoice item' });
  }
});

module.exports = router;
