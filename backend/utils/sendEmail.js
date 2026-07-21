const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // Force IPv4
});

transporter.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("SMTP server is ready.");
  }
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"PosterHaus" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;