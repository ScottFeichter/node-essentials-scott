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
        priority: value.priority || 'medium',
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Advanced filtering
  const where = { userId: global.user_id };
  
  if (req.query.status !== undefined) {
    where.isCompleted = req.query.status === 'true';
  }
  
  if (req.query.priority) {
    where.priority = req.query.priority;
  }
  
  if (req.query.search) {
    where.title = { contains: req.query.search, mode: 'insensitive' };
  }
  
  // Sorting
  const orderBy = {};
  const sortBy = req.query.sort_by || 'createdAt';
  const sortOrder = req.query.sort_order || 'desc';
  orderBy[sortBy] = sortOrder;

  try {
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        select: {
          id: true,
          title: true,
          isCompleted: true,
          priority: true,
          createdAt: true,
          userId: true
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.task.count({ where })
    ]);
    
    const pages = Math.ceil(total / limit);
    
    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext: page < pages,
        hasPrev: page > 1
      }
    });
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

const bulkCreate = async (req, res) => {
  const { tasks } = req.body;
  
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: "Tasks array is required" });
  }
  
  try {
    const tasksData = tasks.map(task => ({
      title: task.title,
      isCompleted: task.isCompleted || false,
      priority: task.priority || 'medium',
      userId: global.user_id
    }));
    
    const result = await prisma.task.createMany({
      data: tasksData
    });
    
    res.status(StatusCodes.CREATED).json({
      message: "Bulk task creation successful",
      tasksCreated: result.count,
      totalRequested: tasks.length
    });
  } catch (error) {
    console.error('Bulk create tasks error:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};

module.exports = { create, index, show, update, deleteTask, bulkCreate };