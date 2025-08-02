# 🧾 MJS STORE - Invoice Generator

An end-to-end invoice management system built with the **MERN stack** and **MySQL** as the database. This project lets users manage products, customers, and invoices—with the ability to generate professionally styled PDF invoices.

## 🚀 Features

- Add, view, and manage Products
- Add Customers
- Generate Invoices
- Download invoices as beautifully formatted PDF
- Automatically calculates:
  - Subtotal
  - Tax
  - Grand total
- Custom PDF layout with:
  - Company logo
  - Payment instructions
  - Signature section
  - QR code
  - Thank you message and footer
- Responsive Bootstrap UI

## 🛠️ Tech Stack

- **Frontend:** React, Bootstrap, Fetch API
- **Backend:** Express.js, Sequelize ORM
- **Database:** MySQL
- **PDF Generation:** PDFKit
- **Other:** VS Code REST Client for testing

## 🧱 Project Structure

```
mjs-invoice-generator/
├── backend/
│   ├── models/         # Sequelize models
│   ├── routes/         # Express routes (Invoices, Customers, Products)
│   ├── utils/          # PDF generation logic
│   └── config/         # Database config
├── frontend/
│   ├── components/     # React components (ProductForm, InvoiceForm, etc.)
│   └── App.js          # Main entry point
└── README.md
```

## 🖥️ How to Run Locally

### Prerequisites

- Node.js
- MySQL
- Git

### Backend Setup

```bash
cd backend
npm install
# Configure your MySQL credentials in config/db.js
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

> Make sure backend is running on port `5000` for proxying to work.

## 📸 Screenshots
![SS-1](image.png)
![SS-2](image-1.png)
![SS-3](image-2.png)


## 📂 Sample Invoice PDF
[PDF](Sample.pdf)


## 🧹 Database Schema

Entities:
- **Customer**
- **Product**
- **Invoice**
- **InvoiceItem**

(Relations handled via Sequelize)

## 💡 Future Improvements

- Authentication (Admin login)
- Email invoice to customers
- PDF customization via settings
- Export to CSV/Excel

## 📬 Contact

Created by **Manoj Padmanaabhan S**
