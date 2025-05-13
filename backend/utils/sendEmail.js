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
    from: `"VoiceBox India" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="
        font-family: Arial, sans-serif; 
        background-color: #f4f4f4; 
        padding: 30px;
        color: #333;
        width: 100%;
      ">
        <div style="
          max-width: 600px;
          background-color: #ffffff;
          margin: auto;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 15px rgba(0,0,0,0.1);
        ">
          <h1 style="color: #2c3e50; text-align: center;">VoiceBox India</h1>
          <hr style="border: none; border-top: 2px solid #2c3e50; margin: 20px 0;" />

          <h2 style="color: #555; font-size: 20px; text-align: center;">${subject}</h2>

          <p style="font-size: 16px; color: #333; line-height: 1.6;">
            ${message}
          </p>

          <p style="margin-top: 20px; font-size: 14px; color: #777; text-align: center;">
            - VoiceBox India Team
          </p>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />

          <p style="font-size: 12px; color: #aaa; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", to);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export default sendEmail;
