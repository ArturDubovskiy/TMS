const Task = require('../models/Task');

const PAGE_SIZE = 10;

const TASK_NOT_FOUND_MSG = 'Task not found';
const SERVER_ERROR_MSG = 'Something went wrong, try again later';

const getSearchParams = (id) => {
    switch (id) {
        case 1: return { isDone: 1 };
        case 2: return { isDone: -1 };
        case 3: return { dueDate: 1 };
        case 4: return { priority: -1 };
        default:
            return { isDone: 1 };
    };
};

const getTasks = async (req, res) => {
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
    };
};

const updateDone = async (req, res) => {
    try {
        let { isDone } = req.body;
        const updated = await Task.updateMany({
            owner: req.user.userId,
            archivedAt: null,
            isDone: !isDone
        }, { "$set": { isDone } });
        res.json(updated);
    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    };
};

const deleteTask = async (req, res) => {
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
    };
};

const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        const task = new Task({ title, description, priority, dueDate, owner: req.user.userId });
        await task.save();
        return res.status(201).json(task);
    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    };
};

const updateTasks = async (req, res) => {
    try {
        const result = await Task.findByIdAndUpdate(req.params.id, { isDone: req.body.isDone });
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    };
};

const editTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        const result = await Task.findByIdAndUpdate(req.params.id, { title, description, priority, dueDate });
        res.status(200).json(result)
    } catch (e) {
        res.status(500).json({ message: SERVER_ERROR_MSG });
    };
};

module.exports = {
    getTasks,
    updateDone,
    deleteTask,
    createTask,
    updateTasks,
    editTask
};