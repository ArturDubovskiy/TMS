const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('config');
const User = require('../models/User');
const EmailToken = require('../models/EmailToken');

const USER_DO_NOT_EXISTS = 'User do not exist';
const USER_VERIFIED_MSG = 'User already verified';
const EMAIL_EXIST_MSG = 'Email already registrated';
const EMAIL_UNCONFIRMED_MSG = 'Email not confirmed';
const EXPIRED_TOKEN_ERR = 'Not valid or expired token';
const USERNAME_EXIXST_MSG = 'Username already registred';
const NO_USER_MSG = 'Unable find user for current token';
const CREDENTIALS_ERROR_MSG = 'Incorrect password or email';
const VERIFIED_USER_MSG = 'This user has already been verified';
const SERVER_ERROR_MSG = 'Something went wrong, try again later';
const VERIFY_MSG = 'The account has been verified. Please log in';

const VERIFY_TYPE = 'verified';
const NO_USER_TYPE = 'no-user';
const NOT_VERIFIED_TYPE = 'not-verified';
const VERIFIED_TYPE = 'already-verified';

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const emailCheck = await User.findOne({ email });
        const usernameCheck = await User.findOne({ username });
        if (emailCheck) {
            return res.status(400).json({ message: EMAIL_EXIST_MSG });
        } else if (usernameCheck) {
            return res.status(400).json({ message: USERNAME_EXIXST_MSG });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        const token = new EmailToken({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });
        await token.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: config.get('mailCredentials')
        })
        const mailOptions = {
            from: config.get('mailCredentials').user,
            to: user.email,
            subject: 'Account Verification',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \n'
                + req.headers.origin + '\/confirmation\/' + token.token
        }
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).json({ message: err });
            }
            res.status(200).json({ userEmail: user.email });
        })
    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    };
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.findOne({ username: email });
        }
        if (!user) {
            return res.status(400).json({ message: CREDENTIALS_ERROR_MSG });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: CREDENTIALS_ERROR_MSG });
        }
        if (!user.isVerified) {
            return res.status(401).json({
                message: EMAIL_UNCONFIRMED_MSG,
                type: NOT_VERIFIED_TYPE
            });
        }
        const token = jwt.sign(
            { userId: user.id },
            config.get('jwtSecret')
        )
        res.json({ token, userId: user.id });
    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    };
};

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const emailToken = await EmailToken.findOne({ token });
        if (!emailToken) {
            return res.status(400).json({ type: NOT_VERIFIED_TYPE, message: EXPIRED_TOKEN_ERR });
        }
        const user = await User.findOne({ _id: emailToken._userId });
        if (!user) {
            return res.status(400).json({ type: NO_USER_TYPE, message: NO_USER_MSG });
        }
        if (user.isVerified) {
            return res.status(400).json({ type: VERIFIED_TYPE, message: VERIFIED_USER_MSG });
        }
        user.isVerified = true;
        await user.save();
        res.status(200).json({ type: VERIFY_TYPE, message: VERIFY_MSG });

    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    };
};

const resendToken = async (req, res) => {
    try {
        let { email } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: USER_DO_NOT_EXISTS });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: USER_VERIFIED_MSG });
        }
        const token = new EmailToken({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });
        await token.save();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: config.get('mailCredentials')
        });
        const mailOptions = {
            from: 'no.replay.tms.app@gmail.com',
            to: user.email,
            subject: 'Account Verification',
            text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \n'
                + req.headers.origin + '\/confirmation\/' + token.token
        }
        transporter.sendMail(mailOptions, (err) => {
            if (err) {
                return res.status(500).json({ message: err })
            }
            res.status(200).json({ userEmail: user.email })
        });

    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    };
};

module.exports = {
    registerUser,
    loginUser,
    confirmEmail,
    resendToken
};