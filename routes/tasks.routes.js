const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const taskValidator = require('../validators/task.validator');
const taskController = require('../controllers/tasks.controller');
const tasksController = require('../controllers/tasks.controller');

const router = Router();

// Get all tasks '/api/tasks'
router.get('/', auth, taskController.getTasks);

// Update user tasks isDone proprty '/api/tasks' 
router.put('/',auth, taskValidator.validateDoneProp, taskController.updateDone);

// Delete single task '/api/tasks/:id'
router.delete('/:id', auth, tasksController.deleteTask);

// Create new task '/api/tasks'
router.post('/',auth, taskValidator.validateTask, tasksController.createTask);

// Toogle isDone property '/api/tasks/:id'
router.put('/:id',auth, taskValidator.validateDoneProp, tasksController.updateTasks);

// Edit single task '/api/tasks/:id'
router.patch('/:id', auth, taskValidator.validateTask, tasksController.editTask);

module.exports = router;