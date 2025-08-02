const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

function generateInvoicePDF(invoice, items, customer, res) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `inline; filename=invoice_${invoice.invoice_number}.pdf`
  );
  doc.pipe(res);

  // Logo
  const logoPath = path.join(__dirname, '../assets/logo.png');
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 50 });
  }

  // Company Info
  doc
    .fontSize(10)
    .text('No.10, Porur', 110, 75)
    .text('Chennai, India', 110, 90)
    .text('Email: contact@mjsstore.com', 110, 105)
    .moveDown();

  // Invoice Info
  doc
    .fillColor('#000')
    .fontSize(12)
    .text(`Invoice #${invoice.invoice_number}`, { align: 'right' })
    .text(`Date: ${invoice.invoice_date}`, { align: 'right' })
    .text(`Due: ${invoice.due_date || '-'}`, { align: 'right' })
    .moveDown();

  // Customer Info
  doc
    .fontSize(12)
    .text('Billed To:', 50)
    .moveDown(0.5)
    .text(customer.name)
    .text(`Email: ${customer.email || '-'}`)
    .text(`Phone: ${customer.phone || '-'}`)
    .moveDown();

  // Table Header
  doc.moveDown().fontSize(12);
  const tableTop = doc.y;
  const rowHeight = 20;
  const colWidths = [160, 60, 80, 60, 80];
  const headers = ['Product', 'Qty', 'Unit Price', 'Tax %', 'Total'];

  headers.forEach((text, i) => {
    doc.text(text, 50 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop, {
      width: colWidths[i],
      align: 'left',
      underline: true,
    });
  });

  let currentY = tableTop + rowHeight;

  items.forEach((item) => {
    const total = item.total_price || (
      item.unit_price * item.quantity * (1 + (item.tax_percentage || 0) / 100)
    );

    if (currentY + rowHeight > doc.page.height - 150) {
      doc.addPage();
      currentY = 50;
    }

    doc.text(item.Product?.name || '-', 50, currentY, { width: colWidths[0] });
    doc.text(item.quantity, 50 + colWidths[0], currentY, { width: colWidths[1] });
    doc.text(`₹${(+item.unit_price).toFixed(2)}`, 50 + colWidths[0] + colWidths[1], currentY, { width: colWidths[2] });
    doc.text(`${item.tax_percentage ?? 0}%`, 50 + colWidths[0] + colWidths[1] + colWidths[2], currentY, { width: colWidths[3] });
    doc.text(`₹${(+total).toFixed(2)}`, 50 + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3], currentY, { width: colWidths[4] });

    currentY += rowHeight;
  });

  // Totals
  doc
    .moveDown()
    .moveTo(50, currentY + 10)
    .lineTo(550, currentY + 10)
    .stroke();

  doc
    .fontSize(12)
    .text(`Subtotal: ₹${invoice.total_amount}`, 350, currentY + 20, { align: 'right' })
    .text(`Tax: ₹${invoice.tax_total}`, 350, currentY + 40, { align: 'right' })
    .text(`Discount: ₹${invoice.discount_total}`, 350, currentY + 60, { align: 'right' })
    .text(`Grand Total: ₹${invoice.grand_total}`, 350, currentY + 80, { align: 'right' })
    .moveDown();

  // Payment Instructions
  doc
    .moveDown()
    .fontSize(12)
    .text('Payment Instructions:', 50, doc.y, { underline: true, align: 'left' })
    .text('UPI ID: mjsstore@upi', 50, doc.y, { align: 'left' })
    .text('Bank: MJS Bank | A/C: 1234567890 | IFSC: MJSB0000123', 50, doc.y, { align: 'left' })
    .moveDown();

  // QR Code
  const qrPath = path.join(__dirname, '../assets/qr.png');
  if (fs.existsSync(qrPath)) {
    doc.image(qrPath, 50, doc.y, { width: 100 });
  }

  // Signature
  doc
    .moveDown(4)
    .fontSize(12)
    .fillColor('#000000')
    .text('Authorized Signature:', 400, doc.y, { align: 'left' })
    .text('__________________', 400, doc.y + 10, { align: 'left' });

doc
  .moveDown(4)
  .fontSize(11)
  .fillColor('#333333')
  .text('Thank you for your business! Happy Shopping!', 200, doc.y, { align: 'centre' });

doc
  .moveDown(0.5)
  .fontSize(9)
  .fillColor('gray')
  .text(`© ${new Date().getFullYear()} MJS STORE | www.mjsstore.com`, 230, doc.y, { align: 'centre' });

doc.end();


}

module.exports = generateInvoicePDF;


