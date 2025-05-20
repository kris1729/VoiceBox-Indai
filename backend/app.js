import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import standardizeResponse from './middlewares/responseMiddleware.js';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import contactRouter from './routes/contact.js';

const app = express();

// Middleware
dotenv.config();


// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'https://voiceboxindia.onrender.com',
//   credentials: true,
// }));

app.use(cors({
    origin: "https://voiceboxindia.onrender.com",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Allow sending cookies and authorization headers
    allowedHeaders: "Content-Type,Authorization",
}));



app.use(express.json()); // For parsing application/json
app.use(standardizeResponse); // Add response standardization middleware

// Routes
app.use('/api/user', userRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/complaint', complaintRoutes);

app.use('/api', contactRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

export default app;
