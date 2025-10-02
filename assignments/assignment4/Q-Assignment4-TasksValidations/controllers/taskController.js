const { StatusCodes } = require("http-status-codes");
const { getLoggedOnUser } = require("../util/memoryStore");
const { taskSchema, patchTaskSchema } = require("../validation/taskSchema");

const taskCounter = (() => {
  let lastTaskNumber = 0;
  return () => {
    lastTaskNumber += 1;
    return lastTaskNumber;
  };
})();

const create = (req, res) => {
  if (!req.body) req.body = {};
  
  const { error, value } = taskSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
  
  const loggedOnUser = getLoggedOnUser();
  if (loggedOnUser.tasklist === undefined) {
    loggedOnUser.tasklist = [];
  }
  
  value.id = taskCounter();
  const newTask = { ...value };
  loggedOnUser.tasklist.push(newTask);
  res.status(StatusCodes.CREATED).json(newTask);
};

const index = (req, res) => {
  const loggedOnUser = getLoggedOnUser();
  if (!loggedOnUser.tasklist || loggedOnUser.tasklist.length === 0) {
    return res.status(StatusCodes.NOT_FOUND).json({ message: "No tasks found" });
  }
  res.json(loggedOnUser.tasklist);
};

const show = (req, res) => {
  const taskToFind = parseInt(req.params.id);
  const loggedOnUser = getLoggedOnUser();
  
  if (loggedOnUser.tasklist) {
    const task = loggedOnUser.tasklist.find(task => task.id === taskToFind);
    if (task) {
      return res.json(task);
    }
  }
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const update = (req, res) => {
  if (!req.body) req.body = {};
  
  const { error, value } = patchTaskSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
  
  const taskToFind = parseInt(req.params.id);
  const loggedOnUser = getLoggedOnUser();
  
  if (loggedOnUser.tasklist) {
    const taskIndex = loggedOnUser.tasklist.findIndex(task => task.id === taskToFind);
    if (taskIndex !== -1) {
      Object.assign(loggedOnUser.tasklist[taskIndex], value);
      return res.json(loggedOnUser.tasklist[taskIndex]);
    }
  }
  res.sendStatus(StatusCodes.NOT_FOUND);
};

const deleteTask = (req, res) => {
  const taskToFind = parseInt(req.params.id);
  const loggedOnUser = getLoggedOnUser();
  
  if (loggedOnUser.tasklist) {
    const taskIndex = loggedOnUser.tasklist.findIndex(task => task.id === taskToFind);
    if (taskIndex !== -1) {
      const task = loggedOnUser.tasklist[taskIndex];
      loggedOnUser.tasklist.splice(taskIndex, 1);
      return res.json(task);
    }
  }
  res.sendStatus(StatusCodes.NOT_FOUND);
};

module.exports = { create, index, show, update, deleteTask };