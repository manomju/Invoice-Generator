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

<img width="1919" height="727" alt="Screenshot 2025-08-03 040125" src="https://github.com/user-attachments/assets/b7df2291-ba19-42fa-883f-57d660657e24" />

<img width="1914" height="980" alt="Screenshot 2025-08-03 040224" src="https://github.com/user-attachments/assets/070ed30f-9719-4a1e-9dc2-4fca3d84ca64" />

<img width="1910" height="789" alt="Screenshot 2025-08-03 040310" src="https://github.com/user-attachments/assets/2367ca55-f60c-4eda-b86b-ccb274fb5e2d" />

<img width="780" height="434" alt="Screenshot 2025-08-02 231804" src="https://github.com/user-attachments/assets/c790b06a-a5ff-4f1e-947e-50be2f09197f" />


## 📂 Sample Invoice PDF
[Sample.pdf](https://github.com/user-attachments/files/24089212/Sample.pdf)



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
