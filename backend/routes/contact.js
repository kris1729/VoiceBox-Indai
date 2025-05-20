// contact.js (backend route for contact form)
import express from 'express';
import sendEmail from '../utils/sendEmail.js';

const router = express.Router();

// Contact form route
router.post('/contact', async (req, res) => {
  const { name, email,  message } = req.body;

  // Validate form data
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Compose the message content
    const emailMessage = `
      <div style="
        font-family: Arial, sans-serif;
        color: #333;
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        margin-bottom: 20px;
      ">
        <h2 style="color: #2c3e50; text-align: center;">New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
      
        <p><strong>Message:</strong><br>${message}</p>
      </div>
    `;

    // Send the email
    await sendEmail(process.env.EMAIL_USER, `New Contact Message from ${name}`, emailMessage);
    res.status(200).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

export default router;
