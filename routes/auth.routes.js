const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('config');
const User = require('../models/User');
const EmailToken = require('../models/EmailToken');
const authValidator = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');

const router = Router();

// Messages

// Register user '/api/auth/register'
router.post('/register', authValidator.validateRegister, authController.registerUser);

// Login user '/api/auth/login'
router.post('/login', authValidator.validateLogin, authController.loginUser);

// Confirm email adress '/api/auth/confirmation'
router.get('/confirmation/:token', authValidator.validateEmail, authController.confirmEmail)

// Resend email with Token '/api/auth/resend'
router.post('/resend', authValidator.validateEmail, authController.resendToken)

module.exports = router;