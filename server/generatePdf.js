import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

// Output path
const outputPath = path.resolve('../Anand_vihar_WWG.pdf');
const doc = new PDFDocument({ margin: 50, size: 'A4' });

doc.pipe(fs.createWriteStream(outputPath));

// Define Color Scheme (Emerald Green and Deep Orange)
const primaryColor = '#013e37';
const secondaryColor = '#ff6b1a';
const darkTextColor = '#2d3748';
const lightTextColor = '#718096';
const backgroundColor = '#f7fafc';
const gridBorderColor = '#e2e8f0';

// ================= HEADER SECTION =================
doc.rect(0, 0, 595, 120).fill(primaryColor);

// Title
doc.fillColor('#ffffff')
   .font('Helvetica-Bold')
   .fontSize(22)
   .text('ANAND VIHAR SWEET SHOP', 50, 40);

doc.fontSize(11)
   .font('Helvetica-Oblique')
   .fillColor('#ffefb3')
   .text('✦ Enjoyment hua band... toh khao Kalakand! ✦', 50, 68);

// Subtitle / Document Type
doc.fillColor('#ffffff')
   .font('Helvetica-Bold')
   .fontSize(13)
   .text('PROJECT PROPOSAL & QUOTATION', 350, 43, { align: 'right', width: 200 });

doc.fillColor('#ffefb3')
   .font('Helvetica')
   .fontSize(9)
   .text('Document ID: AV-WWG-2026', 350, 68, { align: 'right', width: 200 });

doc.moveDown(4.5);

// ================= INFORMATION GRID =================
// Draw background panel for metadata
doc.rect(50, 140, 495, 110).fill(backgroundColor);
doc.rect(50, 140, 495, 110).stroke(gridBorderColor);

doc.fillColor(primaryColor)
   .font('Helvetica-Bold')
   .fontSize(10)
   .text('PREPARED BY (DEVELOPER)', 65, 155);

doc.fillColor(darkTextColor)
   .font('Helvetica-Bold')
   .fontSize(12)
   .text('Abhishek Singh Sahil', 65, 175);

doc.fillColor(lightTextColor)
   .font('Helvetica')
   .fontSize(9.5)
   .text('Phone: +91 62046 35073\nEmail: developer@anandvihar.com\nJharkhand, India', 65, 195);

doc.fillColor(primaryColor)
   .font('Helvetica-Bold')
   .fontSize(10)
   .text('PREPARED FOR (CLIENT)', 330, 155);

doc.fillColor(darkTextColor)
   .font('Helvetica-Bold')
   .fontSize(12)
   .text('Anand Vihar Sweet Shop', 330, 175);

doc.fillColor(lightTextColor)
   .font('Helvetica')
   .fontSize(9.5)
   .text('Address: Near HDFC Bank, Jhanda Chowk,\nJhumri Telaiya, Koderma, Jharkhand\nPIN Code: 825409', 330, 195);

doc.moveDown(6);

// ================= DELIVERABLES (WHAT WE ARE GIVING) =================
doc.fillColor(primaryColor)
   .font('Helvetica-Bold')
   .fontSize(14)
   .text('1. DELIVERABLES (WHAT WE ARE GIVING)', 50, 275);

doc.rect(50, 292, 120, 2.5).fill(secondaryColor);
doc.moveDown(1.5);

const deliverables = [
  {
    title: 'PostgreSQL & Prisma 7 Sweet Shop Architecture',
    desc: 'Fully migrated state-of-the-art database layer from MongoDB to PostgreSQL using Prisma ORM. Eliminates NoSQL bottlenecks and brings robust relational transactional safety for client checkouts.'
  },
  {
    title: 'E-Commerce Cart & Ordering Module',
    desc: 'Fully interactive, client-side shopping cart. Supports dynamic item counter badges, coupon code discounts validation, flexible delivery address profiles, and secure checkouts.'
  },
  {
    title: 'WhatsApp Redirect Checkout & COD Options',
    desc: 'Allows users to place orders using standard Cash on Delivery (COD) or auto-generate prefilled order summaries redirected directly to the owner\'s WhatsApp (+91 9934190109).'
  },
  {
    title: 'Dynamic Web Administration Dashboard',
    desc: 'Enables owner to toggle settings in real-time (online ordering switches), manage categories, products, stock listings, view sales analytics reports, and update dispatch order statuses.'
  },
  {
    title: 'Multi-User Blog & Verified Testimonials',
    desc: 'Allows all logged-in users to share community posts (blogs) and submit verified ratings. Seamlessly integrates user testimonies and images directly into the public media gallery.'
  },
  {
    title: 'Responsive & Stickied UI/UX Layouts',
    desc: 'Designed with sleek mobile-first aesthetics. Sticky navbar keeps navigation reachable. Custom map features pointing exactly to Jhanda Chowk store location.'
  }
];

let currentY = 305;
deliverables.forEach((item) => {
  doc.circle(60, currentY + 6, 3).fill(secondaryColor);
  
  doc.fillColor(darkTextColor)
     .font('Helvetica-Bold')
     .fontSize(11)
     .text(item.title, 72, currentY);
     
  doc.fillColor(lightTextColor)
     .font('Helvetica')
     .fontSize(9.5)
     .text(item.desc, 72, currentY + 16, { width: 470, align: 'justify' });
     
  currentY += 50;
});

// Add Page Number and Footer
doc.fillColor(lightTextColor)
   .font('Helvetica')
   .fontSize(8)
   .text('Page 1 of 2', 50, 750, { align: 'center', width: 495 });

// Start Page 2
doc.addPage();

// Header bar on Page 2
doc.rect(0, 0, 595, 45).fill(primaryColor);
doc.fillColor('#ffffff')
   .font('Helvetica-Bold')
   .fontSize(12)
   .text('ANAND VIHAR SWEET SHOP — QUOTATION TERMS', 50, 18);

// ================= PROJECT ESTIMATE & MILESTONES =================
doc.fillColor(primaryColor)
   .font('Helvetica-Bold')
   .fontSize(14)
   .text('2. PROJECT COST & PAYMENT MILESTONES', 50, 75);

doc.rect(50, 92, 120, 2.5).fill(secondaryColor);
doc.moveDown(1.5);

// Estimate Table Header
doc.rect(50, 110, 495, 25).fill(backgroundColor);
doc.rect(50, 110, 495, 25).stroke(gridBorderColor);

doc.fillColor(darkTextColor)
   .font('Helvetica-Bold')
   .fontSize(9.5)
   .text('Item Description', 65, 118);

doc.text('Payment Milestones', 260, 118);
doc.text('Amount (INR)', 450, 118, { align: 'right', width: 80 });

// Row 1
doc.rect(50, 135, 495, 30).stroke(gridBorderColor);
doc.fillColor(darkTextColor)
   .font('Helvetica')
   .fontSize(9.5)
   .text('Initial Project Deposit (50%)', 65, 145);
doc.text('Paid on 16th July 2026', 260, 145);
doc.font('Helvetica-Bold').text('₹10,500', 450, 145, { align: 'right', width: 80 });

// Row 2
doc.rect(50, 165, 495, 30).stroke(gridBorderColor);
doc.font('Helvetica')
   .text('Final Project Completion (50%)', 65, 175);
doc.text('Paid on 20th July 2026', 260, 175);
doc.font('Helvetica-Bold').text('₹10,500', 450, 175, { align: 'right', width: 80 });

// Row 3 (Total)
doc.rect(50, 195, 495, 30).fill(primaryColor);
doc.fillColor('#ffffff')
   .font('Helvetica-Bold')
   .text('Total Project Cost', 65, 205);
doc.text('Fixed Scope', 260, 205);
doc.text('₹21,000', 450, 205, { align: 'right', width: 80 });

doc.moveDown(5);

// ================= YEARLY MAINTENANCE & SUPPORT =================
doc.fillColor(primaryColor)
   .font('Helvetica-Bold')
   .fontSize(14)
   .text('3. YEARLY MAINTENANCE & HOSTING AGREEMENT', 50, 260);

doc.rect(50, 277, 120, 2.5).fill(secondaryColor);
doc.moveDown(1.5);

const agreementPoints = [
  {
    bold: 'Yearly Support Fee: ',
    normal: 'A flat maintenance fee of ₹4,000 per year will be charged for developer support starting from completion date.'
  },
  {
    bold: 'Technical Assistance: ',
    normal: 'Includes instant technical glitch fixes, database backups, performance monitoring, and server debugging support.'
  },
  {
    bold: 'Hosting & Domain Costs: ',
    normal: 'Hosting services, domain registration, SSL certificates, or any email SMTP API costings will be paid directly by the client (Anand Vihar) in the future. The developer bears no hosting liability.'
  },
  {
    bold: 'Performance Upgrades: ',
    normal: 'Minor text corrections, sweet menu updates, and regular package version checks are included as part of maintenance.'
  }
];

let pointY = 295;
agreementPoints.forEach((point) => {
  doc.circle(60, pointY + 6, 3).fill(secondaryColor);
  
  doc.fillColor(darkTextColor)
     .font('Helvetica-Bold')
     .fontSize(10.5)
     .text(point.bold, 72, pointY);
     
  const textOffset = doc.widthOfString(point.bold) + 75;
  doc.fillColor(lightTextColor)
     .font('Helvetica')
     .fontSize(10)
     .text(point.normal, 72, pointY + 15, { width: 470 });
     
  pointY += 45;
});

doc.moveDown(4.5);

// ================= SIGNATURE BLOCK =================
doc.rect(50, 490, 495, 110).stroke(gridBorderColor);

doc.fillColor(primaryColor)
   .font('Helvetica-Bold')
   .fontSize(11)
   .text('DEVELOPER SIGNATURE', 70, 505);

doc.fillColor(lightTextColor)
   .font('Helvetica')
   .fontSize(9.5)
   .text('Abhishek Singh Sahil\nDate: 18th July 2026', 70, 530);

doc.fillColor(primaryColor)
   .font('Helvetica-Bold')
   .fontSize(11)
   .text('CLIENT SIGNATURE', 330, 505);

doc.fillColor(lightTextColor)
   .font('Helvetica')
   .fontSize(9.5)
   .text('Authorized Representative\nAnand Vihar Sweet Shop', 330, 530);

// Add Page Number and Footer
doc.fillColor(lightTextColor)
   .font('Helvetica')
   .fontSize(8)
   .text('Page 2 of 2', 50, 750, { align: 'center', width: 495 });

doc.end();
console.log('✔ Anand_vihar_WWG.pdf successfully generated at root folder.');
