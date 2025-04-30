import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendComplaintEmail = async ({ toUser, toDept, userName, deptName, complaintId, problem, address, phone }) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "voiceboxindia.24x7@gmail.com",
      pass: process.env.VOICEBOX_GMAIL_PASS
    }
  });

  const htmlTemplate = `
    <div style="font-family:sans-serif;padding:20px;">
      <h2 style="color:#2c3e50;">New Complaint Registered</h2>
      <p><strong>Complaint ID:</strong> ${complaintId}</p>
      <p><strong>User Name:</strong> ${userName}</p>
      <p><strong>Department:</strong> ${deptName}</p>
      <p><strong>Problem:</strong> ${problem}</p>
      <p><strong>Address:</strong> ${address || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <hr />
      <p style="color:gray;">You are receiving this email from VoiceBox India.</p>
    </div>
  `;

  const mailOptions = [
    {
      from: '"VoiceBox India" <voiceboxindia.24x7@gmail.com>',
      to: toUser,
      subject: `Complaint Registered - ID: ${complaintId}`,
      html: htmlTemplate
    },
    {
      from: '"VoiceBox India" <voiceboxindia.24x7@gmail.com>',
      to: toDept,
      subject: `New Complaint from ${userName}`,
      html: htmlTemplate
    }
  ];

  for (const mail of mailOptions) {
    await transporter.sendMail(mail);
  }
};
