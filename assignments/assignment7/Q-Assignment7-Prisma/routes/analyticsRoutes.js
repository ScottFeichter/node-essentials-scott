const express = require("express");
const router = express.Router();
const { getUserAnalytics, getUsersList, searchTasks } = require("../controllers/analyticsController");

router.get("/users/:id", getUserAnalytics);
router.get("/users", getUsersList);
router.get("/tasks/search", searchTasks);

module.exports = router;