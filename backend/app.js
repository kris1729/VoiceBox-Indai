import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes
import userRoutes from './routes/userRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
const app = express();

// Middleware
dotenv.config();
app.use(cors());
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/user', userRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/comment', commentRoutes);

app.use('/api/complaint', complaintRoutes);

export default app;
