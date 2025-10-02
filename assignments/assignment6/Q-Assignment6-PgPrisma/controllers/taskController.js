const { StatusCodes } = require("http-status-codes");
const prisma = require("../prisma/db");
const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

const create = async (req, res) => {
  if (!req.body) req.body = {};
  
  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
  
  try {
    const newTask = await prisma.task.create({
      data: {
        title: value.title,
        isCompleted: value.isCompleted || false,
        userId: global.user_id
      }
    });
    
    res.status(StatusCodes.CREATED).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const index = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { userId: global.user_id }
    });
    
    if (tasks.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "No tasks found" });
    }
    
    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const show = async (req, res) => {
  const taskId = parseInt(req.params.id);
  
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: global.user_id
      }
    });
    
    if (!task) {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }
    
    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const update = async (req, res) => {
  if (!req.body) req.body = {};
  
  const { error, value } = patchTaskSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
  
  const taskId = parseInt(req.params.id);
  
  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
        userId: global.user_id
      },
      data: value
    });
    
    res.json(updatedTask);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }
    console.error('Update task error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

const deleteTask = async (req, res) => {
  const taskId = parseInt(req.params.id);
  
  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id: taskId,
        userId: global.user_id
      }
    });
    
    res.json(deletedTask);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.sendStatus(StatusCodes.NOT_FOUND);
    }
    console.error('Delete task error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

module.exports = { create, index, show, update, deleteTask };