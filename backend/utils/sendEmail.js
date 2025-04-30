import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.VOICEBOX_GMAIL_PASS,
  },
});

const sendEmail = async (to, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <h2 style="color: #333;">${subject}</h2>
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">${message}</p>
        <p style="margin-top: 20px; font-size: 12px;">- VoiceBox India Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
