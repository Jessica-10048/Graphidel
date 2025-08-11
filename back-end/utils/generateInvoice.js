const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoice = (order) => {
  const invoicesDir = path.join(__dirname, '../invoices');
  fs.mkdirSync(invoicesDir, { recursive: true });

  const filePath = path.join(invoicesDir, `invoice-${order._id}.pdf`);

  const doc = new PDFDocument({ margin: 50 });

  doc.pipe(fs.createWriteStream(filePath));

  // Font
  const fontPath = path.join(__dirname, 'fonts', 'Roboto-Regular.ttf');
  doc.registerFont('Roboto', fontPath);
  doc.font('Roboto');

  // === HEADER ===
  doc
    .fontSize(22)
    .fillColor('#333')
    .text('Graphidel', { align: 'left' })
    .fontSize(10)
    .text('www.graphidel.fr')
    .text('4 Allée Louis Tillet, 91250', { align: 'left' })
    .moveDown(1);

  doc
    .fontSize(24)
    .fillColor('#000')
    .text('INVOICE', { align: 'center' })
    .moveDown();

  // === INFOS CLIENT + COMMANDE ===
  const createdAt = new Date(order.createdAt).toLocaleString();

  doc
    .fontSize(12)
    .fillColor('#000')
    .text(`Invoice Date: ${createdAt}`)
    .text(`Invoice #: ${order._id}`)
    .text(`Customer: ${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`)
    .text(`Email: ${order.email}`)
    .text(`Address: ${order.customer?.address || ''}`)
    .text(`Postal Code: ${order.customer?.postalCode || ''}`)
    .text(`Phone: ${order.customer?.phone || ''}`)
    .moveDown(1);

  // === TABLE HEADER ===
  doc
    .fontSize(13)
    .fillColor('#444')
    .text('Item', 50, doc.y, { continued: true })
    .text('Qty', 300, doc.y, { continued: true })
    .text('Price', 350, doc.y, { continued: true })
    .text('Total', 420, doc.y);

  doc.moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .strokeColor('#ccc')
    .stroke();

  // === TABLE ROWS ===
  const items = order.orders || order.products || [];
  let totalAmount = 0;

  items.forEach(p => {
    const itemTotal = p.price * p.quantity;
    totalAmount += itemTotal;

    doc
      .fontSize(12)
      .fillColor('#000')
      .text(p.name, 50, doc.y + 5, { width: 240, continued: true })
      .text(p.quantity.toString(), 300, doc.y, { continued: true })
      .text(`${p.price.toFixed(2)} €`, 350, doc.y, { continued: true })
      .text(`${itemTotal.toFixed(2)} €`, 420, doc.y);
  });

  doc.moveDown(2);

  // === TOTAL ===
  doc
    .fontSize(14)
    .fillColor('green')
    .text(`Total: ${totalAmount.toFixed(2)} €`, { align: 'right' });

  doc.moveDown(3);

  // === FOOTER ===
  doc
    .fontSize(10)
    .fillColor('gray')
    .text('Thank you for your purchase!', { align: 'center' })
    .text('Graphidel – www.graphidel.fr', { align: 'center' });

  doc.end();
  return filePath;
};

module.exports = generateInvoice;
