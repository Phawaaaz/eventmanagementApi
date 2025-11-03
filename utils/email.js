const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  // For Gmail, use secure: true and port 465, or use port 587 with secure: false
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: parseInt(process.env.EMAIL_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // For development/testing with Mailtrap
    ...(process.env.EMAIL_HOST.includes('mailtrap') && {
      tls: {
        rejectUnauthorized: false,
      },
    }),
  });

  // 2) Define the email options
  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'Event Management'} <${process.env.EMAIL_FROM || process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

