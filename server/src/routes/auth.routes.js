import express from 'express';
import { body } from 'express-validator';
import { login, register, forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

// Login route
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest
], login);

// Register route
router.post('/register', [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isIn(['Admin', 'Employee', 'HR'])
    .withMessage('Role must be either Admin, Employee, or HR'),
  validateRequest
], register);

// Forgot password route
router.post('/forgot-password', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address'),
  validateRequest
], forgotPassword);

// Reset password route
router.post('/reset-password/:token', [
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  validateRequest
], resetPassword);

export default router;