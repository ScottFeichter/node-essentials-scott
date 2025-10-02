const express = require('express');
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  deleteManyTasks
} = require('../controllers/taskController');
const {
  createTaskValidation,
  updateTaskValidation,
  taskIdValidation
} = require('../validation/taskValidation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

router.post('/', createTaskValidation, createTask);
router.get('/', getTasks);
router.get('/:id', taskIdValidation, getTask);
router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', taskIdValidation, deleteTask);
router.delete('/', deleteManyTasks);

module.exports = router;