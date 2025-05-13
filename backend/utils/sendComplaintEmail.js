import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendComplaintEmail = async ({ toUser, toDept, userName, deptName, complaintId, englishContent, hindiContent, address, phone }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.VOICEBOX_GMAIL_PASS
      }
    });

    // **Get the current date and time in a formal format**
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    // **Create the HTML template for the email**
    const htmlTemplate = `
      <div style="font-family: 'Times New Roman', serif; padding: 40px; background-color: #f4f4f4;">
        
        <!-- English Application Page -->
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; margin-bottom: 40px; page-break-after: always;">
          <div style="text-align: right; margin-bottom: 20px;">
            <strong>Date:</strong> ${formattedDate}<br/>
            <strong>Time:</strong> ${formattedTime}
          </div>

          <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">VoiceBox India</h2>
          <h3 style="text-align: center; color: #2c3e50; margin-bottom: 30px;">Complaint Application (English)</h3>

          <p><strong>Complaint ID:</strong> ${complaintId}</p>
          <p><strong>User Name:</strong> ${userName}</p>
          <p><strong>Department:</strong> ${deptName}</p>
          <p><strong>Address:</strong> ${address || 'N/A'}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <hr style="margin-bottom: 20px;" />

          <div style="white-space: pre-wrap; line-height: 1.6; margin-bottom: 30px;">
            ${englishContent}
          </div>

          <p style="text-align: center; color: gray;">You are receiving this email from VoiceBox India.</p>
        </div>
        
        <!-- Hindi Application Page -->
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
          <div style="text-align: right; margin-bottom: 20px;">
            <strong>तिथि:</strong> ${formattedDate}<br/>
            <strong>समय:</strong> ${formattedTime}
          </div>

          <h2 style="text-align: center; color: #2c3e50; margin-bottom: 20px;">वॉइसबॉक्स इंडिया</h2>
          <h3 style="text-align: center; color: #2c3e50; margin-bottom: 30px;">प्रार्थना पत्र (हिंदी)</h3>

          <p><strong>शिकायत ID:</strong> ${complaintId}</p>
          <p><strong>प्रयोक्ता का नाम:</strong> ${userName}</p>
          <p><strong>विभाग:</strong> ${deptName}</p>
          <p><strong>पता:</strong> ${address || 'N/A'}</p>
          <p><strong>फोन:</strong> ${phone || 'N/A'}</p>
          <hr style="margin-bottom: 20px;" />

          <div style="white-space: pre-wrap; line-height: 1.6; margin-bottom: 30px;">
            ${hindiContent}
          </div>

          <p style="text-align: center; color: gray;">आपको यह ईमेल वॉइसबॉक्स इंडिया से प्राप्त हो रहा है।</p>
        </div>

      </div>
    `;

    // **Send to User**
    await transporter.sendMail({
      from: `"VoiceBox India" <${process.env.EMAIL_USER}>`,
      to: toUser,
      subject: `✅ Complaint Registered - ID: ${complaintId}`,
      html: htmlTemplate
    });

    // **Send to Department**
    await transporter.sendMail({
      from: `"VoiceBox India" <${process.env.EMAIL_USER}>`,
      to: toDept,
      subject: `🚀 New Complaint Received - ID: ${complaintId}`,
      html: htmlTemplate
    });

    console.log("Emails sent successfully to user and department");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
