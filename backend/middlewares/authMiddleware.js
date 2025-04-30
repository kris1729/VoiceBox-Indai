import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Department from '../models/Department.js'; // ✅ You forgot this import

// User Authentication
export const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // safer
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

// Department Authentication
export const authenticateDepartment = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.department = await Department.findById(decoded.id).select('-password'); // safer
    if (!req.department) return res.status(401).json({ message: 'Department not found' });
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};
