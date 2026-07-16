import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const doc = new PDFDocument({
  margin: 50,
  size: "A4",
});

const outputDirFinal = "E:\\Anand_Vihar_Final";
const outputDirMaster = "E:\\Anand vihar";
const filename = "Anand_vihar_WWG.pdf";

const finalPath = path.join(outputDirFinal, filename);
const masterPath = path.join(outputDirMaster, filename);

const stream = fs.createWriteStream(finalPath);
doc.pipe(stream);

// Brand Colors
const DARK_GREEN = "#013E37";
const ORANGE = "#FF9248";
const CHARCOAL = "#2D3748";
const GRAY = "#4A5568";
const LIGHT_GRAY = "#718096";
const CREAM = "#FAF7F2";

// Helper function to draw page header & footer
const drawPageTemplate = () => {
  // Top Header Line
  doc.rect(50, 40, 495, 3).fill(DARK_GREEN);
  
  // Header Text
  doc.fillColor(DARK_GREEN)
     .font("Helvetica-Bold")
     .fontSize(8)
     .text("ANAND VIHAR RESTAURANT & SWEET SHOP  |  WWG DELIVERABLES", 50, 25);
     
  doc.fillColor(LIGHT_GRAY)
     .font("Helvetica")
     .fontSize(8)
     .text("PREPARED BY: ABHISHEK SINGH SAHIL", 50, 25, { align: "right" });
     
  // Bottom Footer Line
  doc.rect(50, 790, 495, 1).fill("#E2E8F0");
  
  // Footer Text
  doc.fillColor(LIGHT_GRAY)
     .font("Helvetica")
     .fontSize(8)
     .text("Confidential Specification Document - All Rights Reserved", 50, 800);
     
  doc.fillColor(LIGHT_GRAY)
     .font("Helvetica-Bold")
     .fontSize(8)
     .text("ANAND VIHAR", 50, 800, { align: "right" });
};

// ==========================================
// PAGE 1: TITLE PAGE
// ==========================================
// Draw cover bg decoration
doc.rect(0, 0, 595, 250).fill(DARK_GREEN);
doc.rect(0, 248, 595, 10).fill(ORANGE);

doc.fillColor("#FFFFFF")
   .font("Helvetica-Bold")
   .fontSize(24)
   .text("ANAND VIHAR RESTAURANT & SWEET SHOP", 50, 75, { lineGap: 8 });

doc.fillColor("#FFFFFF")
   .font("Helvetica")
   .fontSize(13)
   .text("Website Features Specification & Project Deliverables", 50, 140);
   
doc.fillColor(ORANGE)
   .font("Helvetica-Bold")
   .fontSize(14)
   .text("WHAT WE ARE GIVING (WWG) DOCUMENT", 50, 190);

// Client & Creator Metadata
doc.fillColor(CHARCOAL)
   .font("Helvetica-Bold")
   .fontSize(14)
   .text("CLIENT & PROJECT DETAILS", 50, 290);
doc.rect(50, 310, 495, 1).fill("#E2E8F0");

const clientY = 325;
doc.fillColor(GRAY).font("Helvetica-Bold").fontSize(10).text("Client Name:", 50, clientY);
doc.fillColor(CHARCOAL).font("Helvetica").fontSize(10).text("Anand Vihar Restaurant & Sweet Shop", 140, clientY);

doc.fillColor(GRAY).font("Helvetica-Bold").fontSize(10).text("Client Address:", 50, clientY + 20);
doc.fillColor(CHARCOAL).font("Helvetica").fontSize(10).text("Near HDFC Bank, Jhanda Chowk, Jhumri Telaiya, Jharkhand - 825409", 140, clientY + 20);

doc.fillColor(GRAY).font("Helvetica-Bold").fontSize(10).text("Prepared By:", 50, clientY + 40);
doc.fillColor(CHARCOAL).font("Helvetica").fontSize(10).text("Abhishek Singh Sahil", 140, clientY + 40);

doc.fillColor(GRAY).font("Helvetica-Bold").fontSize(10).text("Developer Contact:", 50, clientY + 60);
doc.fillColor(CHARCOAL).font("Helvetica").fontSize(10).text("+91 62046 35073", 140, clientY + 60);

doc.fillColor(GRAY).font("Helvetica-Bold").fontSize(10).text("Document Version:", 50, clientY + 80);
doc.fillColor(CHARCOAL).font("Helvetica").fontSize(10).text("1.2 (Final Commercial Release)", 140, clientY + 80);

doc.fillColor(GRAY).font("Helvetica-Bold").fontSize(10).text("Date of Delivery:", 50, clientY + 100);
doc.fillColor(CHARCOAL).font("Helvetica").fontSize(10).text("July 15, 2026", 140, clientY + 100);

// Brief overview card
doc.rect(50, 470, 495, 120).fill(CREAM);
doc.rect(50, 470, 4, 120).fill(DARK_GREEN);

doc.fillColor(DARK_GREEN)
   .font("Helvetica-Bold")
   .fontSize(11)
   .text("PROJECT SCOPE OVERVIEW", 70, 485);
   
doc.fillColor(CHARCOAL)
   .font("Helvetica")
   .fontSize(9.5)
   .text("This document describes the exact features, components, configurations, and structures provided for the Anand Vihar platform. The website has been customized as a premium branding, review-sharing, and table reservation site. As requested, all online ordering, checkout carts, and payment processors are disabled/hidden by default but remain toggleable from the Admin Panel setting switches.", 70, 505, { width: 455, align: "justify", lineGap: 4 });

// Footer of Title Page
doc.rect(50, 740, 495, 1).fill("#E2E8F0");
doc.fillColor(LIGHT_GRAY)
   .font("Helvetica")
   .fontSize(8.5)
   .text("Anand Vihar Premium Web Platform Deliverables Document © 2026", 50, 755, { align: "center" });

// ==========================================
// PAGE 2: CORE VISUAL & DESIGN SYSTEM
// ==========================================
doc.addPage();
drawPageTemplate();

doc.fillColor(DARK_GREEN)
   .font("Helvetica-Bold")
   .fontSize(16)
   .text("1. PREMIUM VISUAL INTERFACE & RESPONSIVENESS", 50, 60);
doc.rect(50, 80, 495, 1.5).fill(ORANGE);

doc.fillColor(CHARCOAL)
   .font("Helvetica")
   .fontSize(10)
   .text("The website is built with a bespoke styling structure utilizing premium colors, dynamic animations, and robust layouts optimized for all viewport breakpoints (Mobile, Tablet, Desktop).", 50, 95, { width: 495 });

// Key highlights
const highlights = [
  {
    title: "Vibrant Brand Identity Styling",
    desc: "Uses a tailored forest-green (#013e37) and traditional orange-gold (#ff9248) color system representing Indian hospitality and confectionery culture. Default native components are customized with glassmorphic cards and subtle gradient backdrops."
  },
  {
    title: "Sticky Auto-Collapsing Header Navigation",
    desc: "The main navigation header sticks to the top during scroll. It features a smart collapse listener that dynamically slides away the top announcement bar to maximize screen real estate when scrolling, leaving only the primary menu links visible."
  },
  {
    title: "Responsive Typography & Mobile Layouts",
    desc: "Home page headers, descriptions, and grid panels adapt seamlessly to small screens. Mobile font resizing guards prevent text clipping or overlapping, ensuring a professional appearance on smartphones."
  },
  {
    title: "Custom Brand Favicon & Slogan",
    desc: "Features a beautiful custom Sweet Shop Favicon SVG containing a stylized plate, traditional Ladoo, and diamond Kaju Katli with varq silver leaf layers. The navbar features the custom slogan: 'Enjoyment hua band ? ...toh khao Kalakand!' in an animated gradient clip."
  }
];

let itemY = 145;
highlights.forEach((hl) => {
  doc.circle(55, itemY + 4, 3).fill(DARK_GREEN);
  doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(11).text(hl.title, 70, itemY);
  doc.fillColor(CHARCOAL).font("Helvetica").fontSize(9.5).text(hl.desc, 70, itemY + 16, { width: 475, align: "justify", lineGap: 2 });
  itemY += 60;
});

// ==========================================
// PAGE 3: ADMIN STORE CONTROLS & TESTIMONIALS
// ==========================================
doc.addPage();
drawPageTemplate();

doc.fillColor(DARK_GREEN)
   .font("Helvetica-Bold")
   .fontSize(16)
   .text("2. DYNAMIC OPERATIONS CONTROL & REVIEW PLATFORM", 50, 60);
doc.rect(50, 80, 495, 1.5).fill(ORANGE);

// Section 2.1
doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(12).text("2.1 Admin Store Controls Settings", 50, 95);
doc.fillColor(CHARCOAL)
   .font("Helvetica")
   .fontSize(9.5)
   .text("Allows the store manager to dynamically start/stop restaurant reservation systems and online shopping cart functionalities directly from the Admin Panel dashboard switches.", 50, 112, { width: 495 });

const settingsBulletins = [
  "Table Reservations Toggle: Disabling this switch hides all 'Book Table' actions, CTA blocks, footer links, and reservation forms across the site. It also hides the restaurant specials section from the landing page.",
  "Online Ordering Toggle: Disabling this switch hides the shopping cart drawer, badges, and hides all 'Add to Cart' options from menu items, replacing them with static Available / Sold Out labels for in-store purchases."
];

let settingY = 150;
settingsBulletins.forEach((bullet) => {
  doc.rect(50, settingY, 5, 25).fill(ORANGE);
  doc.fillColor(CHARCOAL).font("Helvetica").fontSize(9.5).text(bullet, 65, settingY, { width: 480, align: "justify" });
  settingY += 35;
});

// Section 2.2
doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(12).text("2.2 Testimonials & Community Reviews System", 50, 240);
doc.fillColor(CHARCOAL)
   .font("Helvetica")
   .fontSize(9.5)
   .text("A fully interactive reviews portal that allows guests to upload feedback and share community ratings directly.", 50, 257, { width: 495 });

const reviewHighlights = [
  { title: "Media Attachments", desc: "Allows clients to upload up to 3 review images and short videos (under 15s) with their feedback." },
  { title: "Engagement Reactions", desc: "Supports anonymous likes and multiple reactions (Heart, Laugh, Clap) with IP/Device tracking to prevent spam." },
  { title: "Community Comments", desc: "Enables visitors to comment and reply in threaded structures to review entries, creating a lively customer community." },
  { title: "Admin Moderation Approval", desc: "All testimonials are held in a pending state until approved by the admin. Features bulk moderation actions." }
];

let reviewY = 295;
reviewHighlights.forEach((hl) => {
  doc.circle(55, reviewY + 4, 3).fill(DARK_GREEN);
  doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(10.5).text(hl.title, 70, reviewY);
  doc.fillColor(CHARCOAL).font("Helvetica").fontSize(9.5).text(hl.desc, 180, reviewY, { width: 365, align: "justify" });
  reviewY += 30;
});

// ==========================================
// PAGE 4: RESERVATIONS, BLOGS, GALLERY & TECH
// ==========================================
doc.addPage();
drawPageTemplate();

doc.fillColor(DARK_GREEN)
   .font("Helvetica-Bold")
   .fontSize(16)
   .text("3. ADDITIONAL CORE CAPABILITIES", 50, 60);
doc.rect(50, 80, 495, 1.5).fill(ORANGE);

// Interactive Table Reservation
doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(11).text("3.1 Table Reservations Booking System", 50, 95);
doc.fillColor(CHARCOAL)
   .font("Helvetica")
   .fontSize(9.5)
   .text("Includes an interactive booking slot submission form. When a slot is requested, the system runs validation checks and fires an automated email confirmation to the client and an instant email alert to the admin.", 50, 112, { width: 495, align: "justify" });

// Food Chronicles Blog
doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(11).text("3.2 Public Blog Chronicles (Recipes & Culture)", 50, 160);
doc.fillColor(CHARCOAL)
   .font("Helvetica")
   .fontSize(9.5)
   .text("Allows all logged-in users (not just admins) to write, edit, and publish blog articles about sweets and culture. Standard users are restricted from editing or deleting posts written by others, while administrators maintain overriding moderation rights.", 50, 177, { width: 495, align: "justify" });

// Gallery merging
doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(11).text("3.3 Testimonial Media Gallery Integration", 50, 225);
doc.fillColor(CHARCOAL)
   .font("Helvetica")
   .fontSize(9.5)
   .text("The public Gallery page dynamically aggregates media from two sources: manual admin uploads, and approved testimonial images and videos submitted by customers, automatically sorting them by date.", 50, 242, { width: 495, align: "justify" });

// Tech Stack Table
doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(12).text("4. TECHNICAL ARCHITECTURE & STACK", 50, 290);
doc.rect(50, 305, 495, 1).fill("#E2E8F0");

const tableHeaders = ["Layer", "Technologies Used", "Core Functions"];
const tableRows = [
  ["Frontend", "React.js, Tailwind CSS, Framer Motion", "Interactive UI, glassmorphic styles, responsive web screens"],
  ["Backend", "Node.js (Express), ES Modules", "Secure REST APIs, email routing, validation controllers"],
  ["Database", "MongoDB (Mongoose ODM)", "Data schema persistence, Settings collection state model"],
  ["Storage", "Cloudinary SDK, Multer", "On-the-fly media compression (50-80% savings), secure image streams"],
  ["Security", "JWT (HttpOnly Cookies), bcryptjs", "Rotate refresh tokens, password OTP recovery, secure login guards"]
];

let cellY = 320;
// Draw Table Header
doc.rect(50, cellY, 495, 18).fill(DARK_GREEN);
doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(9);
doc.text(tableHeaders[0], 60, cellY + 5);
doc.text(tableHeaders[1], 160, cellY + 5);
doc.text(tableHeaders[2], 310, cellY + 5);

cellY += 18;
doc.font("Helvetica").fontSize(8.5);
tableRows.forEach((row) => {
  doc.rect(50, cellY, 495, 20).fill(cellY % 40 === 0 ? CREAM : "#FFFFFF");
  doc.fillColor(CHARCOAL);
  doc.text(row[0], 60, cellY + 6);
  doc.text(row[1], 160, cellY + 6);
  doc.text(row[2], 310, cellY + 6, { width: 230 });
  cellY += 20;
});

// ==========================================
// PAGE 5: FINANCIAL TERMS & MAINTENANCE
// ==========================================
doc.addPage();
drawPageTemplate();

doc.fillColor(DARK_GREEN)
   .font("Helvetica-Bold")
   .fontSize(16)
   .text("5. COMMERCIAL TERMS & ANNUAL CONTRACT", 50, 60);
doc.rect(50, 80, 495, 1.5).fill(ORANGE);

doc.fillColor(CHARCOAL)
   .font("Helvetica")
   .fontSize(9.5)
   .text("The financial arrangements, support terms, and operational boundaries agreed upon for the Anand Vihar project are detailed below.", 50, 95, { width: 495 });

// Commercial Table (Costings)
const costHeaders = ["Item Description", "Amount", "Billing Frequency"];
const costRows = [
  ["Total Web Development & Custom Systems Installation", "INR 21,000", "One-Time (50% on 16th July | 50% till 20th July)"],
  ["Annual Technical Maintenance & Security Plan", "INR 4,000", "Yearly Maintenance Charge (Post 1st year)"],
  ["Domain Name Registration, Hosting Server, SMTP Email Accounts", "At Cost", "Paid directly by Client (Anand Vihar) in future"]
];

let costY = 125;
// Draw Commercial Header
doc.rect(50, costY, 495, 18).fill(DARK_GREEN);
doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(9);
doc.text(costHeaders[0], 60, costY + 5);
doc.text(costHeaders[1], 280, costY + 5);
doc.text(costHeaders[2], 380, costY + 5);

costY += 18;
doc.font("Helvetica").fontSize(8.5);
costRows.forEach((row) => {
  doc.rect(50, costY, 495, 20).fill(costY % 40 === 0 ? CREAM : "#FFFFFF");
  doc.fillColor(CHARCOAL);
  doc.text(row[0], 60, costY + 6, { width: 210 });
  doc.text(row[1], 280, costY + 6);
  doc.text(row[2], 380, costY + 6, { width: 160 });
  costY += 20;
});

// Agreement Bulletins
const agreementPoints = [
  {
    title: "milestone Payments (Development Cost)",
    desc: "The total project cost is locked at INR 21,000 as discussed. The payment schedule is split as follows: 50% (INR 10,500) will be paid on 16th July, 2026, and the remaining 50% (INR 10,500) will be settled by 20th July, 2026."
  },
  {
    title: "Domain, Hosting, and Third-Party Costs",
    desc: "Anand Vihar is solely responsible for payment of all future domain registration renewals, web hosting subscription services, professional email servers, or any external API charges (e.g. Cloudinary premium tiers). These costs are not included in the development fee."
  },
  {
    title: "Technical Support SLA & Glitch Resolution",
    desc: "We will provide complete technical support for any software glitches, database connection crashes, email dispatch failures, or functional bugs. Bug troubleshooting and system crashes under typical load are covered."
  },
  {
    title: "Annual Maintenance Charge (AMC)",
    desc: "A maintenance charge of INR 4,000 per year will apply after the initial development launch. This charge covers routine server health optimization audits, weekly database backups security management, and minor content update configurations (such as menu price adjustments)."
  }
];

let bulletY = 225;
agreementPoints.forEach((pt) => {
  doc.circle(55, bulletY + 4, 3).fill(ORANGE);
  doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(10).text(pt.title, 70, bulletY);
  doc.fillColor(CHARCOAL).font("Helvetica").fontSize(9).text(pt.desc, 70, bulletY + 14, { width: 475, align: "justify", lineGap: 2 });
  bulletY += 60;
});

// Final signature box
doc.rect(50, 485, 495, 110).fill("#F7FAFC").stroke("#E2E8F0");
doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(11).text("DELIVERY & SIGN OFF", 65, 500);
doc.fillColor(CHARCOAL).font("Helvetica").fontSize(8.5).text("The platform has been configured to build cleanly and is optimized for launch. This deliverables checklist stands verified under our final production guidelines. For future scaling (such as activating payment gateways or online checkouts), the underlying architectural structures are already fully built in.", 65, 518, { width: 465, align: "justify", lineGap: 2.5 });

doc.fillColor(GRAY).font("Helvetica-Bold").fontSize(9.5).text("Authorized Signature (Developer):", 65, 570);
doc.fillColor(DARK_GREEN).font("Helvetica-Bold").fontSize(10).text("Abhishek Singh Sahil", 230, 570);

doc.end();

stream.on("finish", () => {
  console.log("PDF generated successfully!");
  
  // Also copy to the master workspace
  fs.copyFileSync(finalPath, masterPath);
  console.log("PDF copied to master path successfully!");
});
