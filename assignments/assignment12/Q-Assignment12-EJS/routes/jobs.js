const express = require('express');
const router = express.Router();
const { getAllJobs, showNewJob, createJob, showEditJob, updateJob, deleteJob } = require('../controllers/jobsController');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

router.get('/', getAllJobs);
router.get('/new', showNewJob);
router.post('/new', createJob);
router.get('/:id/edit', showEditJob);
router.post('/:id/edit', updateJob);
router.post('/:id/delete', deleteJob);

module.exports = router;