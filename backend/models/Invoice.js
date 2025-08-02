const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./Customer');
const InvoiceItem = require('./InvoiceItem');
const Product = require('./Product');

const Invoice = sequelize.define('Invoice', {
  invoice_number: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  invoice_date: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  due_date: {
    type: DataTypes.DATEONLY,
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Unpaid', 'Overdue'),
    defaultValue: 'Unpaid',
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  tax_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  discount_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  grand_total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
  },
  notes: {
    type: DataTypes.TEXT,
  }
}, {
  timestamps: true,
});

// Relationships
Invoice.belongsTo(Customer, { foreignKey: 'customer_id' });
Customer.hasMany(Invoice, { foreignKey: 'customer_id' });

Invoice.hasMany(InvoiceItem, { foreignKey: 'invoice_id', onDelete: 'CASCADE', hooks: true });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoice_id', onDelete: 'CASCADE' });

InvoiceItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(InvoiceItem, { foreignKey: 'product_id' });

module.exports = Invoice;
