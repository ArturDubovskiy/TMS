const { check, validationResult } = require('express-validator');

const VALIDATION_ERROR_MSG = 'Validation error';
const EMPTY_ISDONE_MSG = 'Empty flag value';
const EMPTY_TITLE_MSG = 'Empty title value';
const EMPTY_DESC_MSG = 'Empty description value';
const EMPTY_DATE_MSG = 'Empty priority value';
const EMPTY_PRIORITY_MSG = 'Empty dueDate value';

const errorRes = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json({ message: VALIDATION_ERROR_MSG, errors });
    next();
};

const validateDoneProp = [
    check('isDone', EMPTY_ISDONE_MSG).notEmpty(),
    errorRes
];

const validateTask = [
    check('title', EMPTY_TITLE_MSG).notEmpty(),
    check('description', EMPTY_DESC_MSG).notEmpty(),
    check('priority', EMPTY_PRIORITY_MSG).notEmpty(),
    check('dueDate', EMPTY_DATE_MSG).notEmpty(),
    errorRes
];

module.exports = { validateDoneProp, validateTask };