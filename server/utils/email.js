import nodemailer from "nodemailer";

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_PORT === "465",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const wrapEmailTemplate = (title, content) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #FDFCFA;
            margin: 0;
            padding: 0;
            color: #333333;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
            border: 1px solid #FAF5EF;
          }
          .header {
            background-color: #013e37;
            padding: 30px;
            text-align: center;
          }
          .header h1 {
            color: #ff9248;
            margin: 0;
            font-size: 26px;
            letter-spacing: 1px;
          }
          .header p {
            color: #ffefb3;
            margin: 5px 0 0 0;
            font-size: 14px;
          }
          .content {
            padding: 40px 30px;
            line-height: 1.6;
            font-size: 16px;
          }
          .footer {
            background-color: #efe6dd;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
            border-top: 1px solid #FAF5EF;
          }
          .btn {
            display: inline-block;
            background-color: #ff9248;
            color: #ffffff !important;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin-top: 20px;
          }
          .otp-code {
            background-color: #FAF5EF;
            border: 1px dashed #ff9248;
            color: #013e37;
            font-size: 32px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 5px;
            padding: 15px;
            margin: 25px 0;
            border-radius: 8px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Anand Vihar</h1>
            <p>Restaurant & Sweet Shop</p>
          </div>
          <div class="content">
            <h2>${title}</h2>
            ${content}
          </div>
          <div class="footer">
            <p>Anand Vihar Complex, Near Jhanda Chowk, Ranchi Patna Road, Jhumri Telaiya, Jharkhand - 825409</p>
            <p>&copy; ${new Date().getFullYear()} Anand Vihar. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

export const sendVerificationEmail = async (email, name, otp) => {
  try {
    const transporter = getTransporter();
    const htmlContent = wrapEmailTemplate(
      "Verify Your Email Address",
      `
        <p>Hello ${name},</p>
        <p>Thank you for signing up at Anand Vihar. Please use the following 6-digit One Time Password (OTP) to verify your account. This code is valid for 10 minutes.</p>
        <div class="otp-code">${otp}</div>
        <p>If you did not initiate this registration, please disregard this email.</p>
      `
    );

    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || 'Anand Vihar'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Anand Vihar - Verify Your Account",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = getTransporter();
    const htmlContent = wrapEmailTemplate(
      "Welcome to Anand Vihar!",
      `
        <p>Hello ${name},</p>
        <p>Your email has been verified successfully. Welcome to the Anand Vihar family! We are excited to serve you our premium sweets and delicious delicacies.</p>
        <p>You can now book table reservations, share your review on our testimonials board, and stay updated with our latest blogs and offers.</p>
        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" class="btn">Explore Website</a>
      `
    );

    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || 'Anand Vihar'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Anand Vihar!",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
};

export const sendForgotPasswordEmail = async (email, name, otp) => {
  try {
    const transporter = getTransporter();
    const htmlContent = wrapEmailTemplate(
      "Password Reset Requested",
      `
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. Use the following 6-digit OTP code to verify your request and reset your password. This code will expire in 10 minutes.</p>
        <div class="otp-code">${otp}</div>
        <p>If you did not request this, please change your password or contact support immediately.</p>
      `
    );

    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || 'Anand Vihar'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Anand Vihar - Password Reset Code",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending forgot password email:", error);
  }
};

export const sendPasswordChangedEmail = async (email, name) => {
  try {
    const transporter = getTransporter();
    const htmlContent = wrapEmailTemplate(
      "Password Changed Successfully",
      `
        <p>Hello ${name},</p>
        <p>This is to confirm that the password for your account has been successfully changed.</p>
        <p>If you did not make this change, please contact our support team immediately.</p>
      `
    );

    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || 'Anand Vihar'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Anand Vihar - Password Changed Alert",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending password changed email:", error);
  }
};

export const sendReservationConfirmationEmail = async (email, reservation) => {
  try {
    const transporter = getTransporter();
    const htmlContent = wrapEmailTemplate(
      "Reservation Request Received",
      `
        <p>Hello ${reservation.name},</p>
        <p>We have received your table reservation request. Below are the details:</p>
        <ul>
          <li><strong>Reservation ID:</strong> ${reservation._id}</li>
          <li><strong>Date:</strong> ${reservation.date}</li>
          <li><strong>Time:</strong> ${reservation.time}</li>
          <li><strong>Number of Guests:</strong> ${reservation.guests}</li>
          <li><strong>Special Requests:</strong> ${reservation.specialRequest || "None"}</li>
        </ul>
        <p>Your status is currently <strong>PENDING</strong>. We will notify you once it is approved.</p>
      `
    );

    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || 'Anand Vihar'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Anand Vihar - Reservation Request Received",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending reservation confirmation email:", error);
  }
};

export const sendReservationStatusEmail = async (email, reservation) => {
  try {
    const transporter = getTransporter();
    const statusText = reservation.status.toUpperCase();
    const isApproved = reservation.status === "approved";
    
    const htmlContent = wrapEmailTemplate(
      `Reservation ${statusText}`,
      `
        <p>Hello ${reservation.name},</p>
        <p>Your table reservation status has been updated to: <strong>${statusText}</strong>.</p>
        <p>Below are your reservation details:</p>
        <ul>
          <li><strong>Reservation ID:</strong> ${reservation._id}</li>
          <li><strong>Date:</strong> ${reservation.date}</li>
          <li><strong>Time:</strong> ${reservation.time}</li>
          <li><strong>Number of Guests:</strong> ${reservation.guests}</li>
        </ul>
        ${isApproved ? `<p>We look forward to serving you! Please arrive 10 minutes prior to your booking.</p>` : `<p>We apologize for the inconvenience. If you have questions, please reach out to us.</p>`}
      `
    );

    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || 'Anand Vihar'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Anand Vihar - Reservation ${statusText}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending reservation status email:", error);
  }
};

export const sendNewsletterConfirmationEmail = async (email) => {
  try {
    const transporter = getTransporter();
    const htmlContent = wrapEmailTemplate(
      "Newsletter Subscription Confirmed",
      `
        <p>Hello,</p>
        <p>Thank you for subscribing to the Anand Vihar Newsletter! You will now receive exclusive updates about our seasonal sweets, traditional meals, and special discounts directly in your inbox.</p>
      `
    );

    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || 'Anand Vihar'}" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Anand Vihar - Newsletter Subscription Confirmed",
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending newsletter confirmation email:", error);
  }
};

export const sendAdminNotificationEmail = async (subject, textContent) => {
  try {
    const transporter = getTransporter();
    const htmlContent = wrapEmailTemplate(
      "Admin Alert Notification",
      `
        <p>Hello Admin,</p>
        <p>${textContent}</p>
      `
    );

    await transporter.sendMail({
      from: `"${process.env.EMAIL_SENDER_NAME || 'Anand Vihar Service'}" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_ALERT_EMAIL || process.env.EMAIL_USER,
      subject: `Anand Vihar Admin - ${subject}`,
      html: htmlContent,
    });
  } catch (error) {
    console.error("Error sending admin notification email:", error);
  }
};
