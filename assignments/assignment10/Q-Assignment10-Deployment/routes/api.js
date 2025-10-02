const express = require('express');
const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');
const router = express.Router();

// Sample data store
let tasks = [
  { id: 1, title: 'Sample Task', completed: false, createdAt: new Date() }
];

// Get all tasks
router.get('/tasks', (req, res) => {
  logger.info('Fetching all tasks');
  res.json({ tasks, count: tasks.length });
});

// Create task
router.post('/tasks', [
  body('title').notEmpty().withMessage('Title is required'),
  body('title').isLength({ min: 3 }).withMessage('Title must be at least 3 characters')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const task = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false,
    createdAt: new Date()
  };

  tasks.push(task);
  logger.info('Task created', { taskId: task.id });
  res.status(201).json(task);
});

// Update task
router.put('/tasks/:id', [
  body('title').optional().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('completed').optional().isBoolean().withMessage('Completed must be boolean')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  if (req.body.title) task.title = req.body.title;
  if (req.body.completed !== undefined) task.completed = req.body.completed;
  task.updatedAt = new Date();

  logger.info('Task updated', { taskId });
  res.json(task);
});

// Delete task
router.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  logger.info('Task deleted', { taskId });
  res.status(204).send();
});

// Metrics endpoint
router.get('/metrics', (req, res) => {
  res.json({
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.completed).length,
    pendingTasks: tasks.filter(t => !t.completed).length,
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  });
});

module.exports = router;