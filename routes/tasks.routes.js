const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth.middleware');

const router = Router();
const PAGE_SIZE = 10;

// Messages
const SERVER_ERROR_MSG = 'Something went wrong, try again later';
const VALIDATION_ERROR_MSG = 'Validation error';
const TASK_NOT_FOUND_MSG = 'Task not found';
const EMPTY_ISDONE_MSG = 'Empty flag value';
const EMPTY_TITLE_MSG = 'Empty title value';
const EMPTY_DESC_MSG = 'Empty description value';
const EMPTY_DATE_MSG = 'Empty priority value';
const EMPTY_PRIORITY_MSG = 'Empty dueDate value';


const getSearchParams = (id) => {
    switch (id) {
        case 1: return { isDone: 1 };
        case 2: return { isDone: -1 };
        case 3: return { dueDate: -1 };
        case 4: return { priority: -1 };
        default:
            return { isDone: 1 };
    }
}

// Get all tasks '/api/tasks'
router.get('/', auth, async (req, res) => {
    try {
        const sortBy = getSearchParams(parseInt(req.query.sortBy));
        const page = req.query.page;
        let skip = 0;
        if (page)
            skip = (parseInt(page) - 1) * PAGE_SIZE;
        const tasks = await Task.find({ owner: req.user.userId, archivedAt: null }).sort(sortBy)
            .skip(skip).limit(PAGE_SIZE);
        const tasksCount = await Task.countDocuments({ archivedAt: null, owner: req.user.userId });
        res.json({ tasks, totalPages: Math.ceil(tasksCount / PAGE_SIZE), page });
    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
})

// Update user tasks isDone proprty '/api/tasks' 
router.put('/',
    auth,
    [
        check('isDone', EMPTY_ISDONE_MSG).notEmpty(),
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: VALIDATION_ERROR_MSG
                });
            }
            let { isDone } = req.body;
            const updated = await Task.updateMany({
                owner: req.user.userId,
                archivedAt: null,
                isDone: !isDone
            }, { "$set": { isDone } });
            res.json(updated);
        } catch (e) {
            res.status(500).json({ message: SERVER_ERROR_MSG });
        }
    }
)

// Delete single task '/api/tasks/:id'
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: TASK_NOT_FOUND_MSG });
        }
        task.archivedAt = new Date();
        await task.save();
        res.status(200).json(task);
    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    }
})

// Create new task '/api/tasks'
router.post(
    '/',
    auth,
    [
        check('title', EMPTY_TITLE_MSG).notEmpty(),
        check('description', EMPTY_DESC_MSG).notEmpty(),
        check('priority', EMPTY_PRIORITY_MSG).notEmpty(),
        check('dueDate', EMPTY_DATE_MSG).notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: VALIDATION_ERROR_MSG
                });
            }
            const { title, description, priority, dueDate } = req.body;
            const task = new Task({ title, description, priority, dueDate, owner: req.user.userId });
            await task.save();
            return res.status(201).json(task);
        } catch (e) {
            res.status(500).json({ message: SERVER_ERROR_MSG });
        }
    }
)

// Toogle isDone property '/api/tasks/:id'
router.put(
    '/:id',
    auth,
    [
        check('isDone', EMPTY_ISDONE_MSG).notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: VALIDATION_ERROR_MSG
                });
            }
            const result = await Task.findByIdAndUpdate(req.params.id, { isDone: req.body.isDone });
            res.status(200).json(result);
        } catch (e) {
            res.status(500).json({ message: SERVER_ERROR_MSG });
        }
    })

// Edit single task '/api/tasks/:id'
router.patch(
    '/:id',
    auth,
    [
        check('title', EMPTY_TITLE_MSG).notEmpty(),
        check('description', EMPTY_DESC_MSG).notEmpty(),
        check('priority', EMPTY_PRIORITY_MSG).notEmpty(),
        check('dueDate', EMPTY_DATE_MSG).notEmpty()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: VALIDATION_ERROR_MSG
                });
            }
            const { title, description, priority, dueDate } = req.body;
            const result = await Task.findByIdAndUpdate(req.params.id, { title, description, priority, dueDate });
            res.status(200).json(result)
        } catch (e) {
            res.status(500).json({ message: SERVER_ERROR_MSG });
        }
    }
)

module.exports = router;