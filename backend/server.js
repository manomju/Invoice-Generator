const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');
const invoiceRoutes = require('./routes/invoices');
const invoiceItemRoutes = require('./routes/invoiceItems');

require('dotenv').config();

const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Invoice = require('./models/Invoice');
const InvoiceItem = require('./models/InvoiceItem');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/invoice-items', invoiceItemRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('MJS STORE Invoice API (SQL)');
});

// Connect to DB, sync models, and start server
sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to SQL database');

    // Sync models only after DB connection is confirmed
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('🗃️ Models synced with DB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err);
  });

