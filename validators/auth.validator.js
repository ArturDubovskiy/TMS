const { check, validationResult } = require('express-validator');

const EMPTY_EMAIL_ERR = 'Empty email field';
const INCORRECT_EMAIL_ERR = 'Incorrect email';
const EMPTY_TOKEN_ERR = 'Token cant be blank';
const VALIDATION_ERROR_MSG = 'Validation error';
const EMPTY_PASSWORD_ERR = 'Empty password field';
const PASSWORD_LENGTH_ERR = 'Cant be less then 6 characters';

const errorRes = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ message: VALIDATION_ERROR_MSG, errors });
    next();
};

const validateLogin =  [
    check('email', EMPTY_EMAIL_ERR).notEmpty(),
    check('password', EMPTY_PASSWORD_ERR).notEmpty(),
    errorRes
];

const validateEmail = [
    check('token', EMPTY_TOKEN_ERR).notEmpty(),
    errorRes
];

const validateRegister = [
    check('email', INCORRECT_EMAIL_ERR).isEmail(),
    check('password', PASSWORD_LENGTH_ERR).isLength({ min: 6 }),
    check('email', EMPTY_EMAIL_ERR).notEmpty(),
    check('password', EMPTY_PASSWORD_ERR).notEmpty(),
    errorRes
];

module.exports = { validateRegister, validateLogin, validateEmail };