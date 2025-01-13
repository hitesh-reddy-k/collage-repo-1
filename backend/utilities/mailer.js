const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    // Create transporter with SMTP settings
    let transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE, // e.g., 'Gmail'
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: message, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    return info.messageId;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { sendEmail };
