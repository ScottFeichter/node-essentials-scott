const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.render('jobs', { jobs });
  } catch (error) {
    req.flash('error', 'Failed to fetch jobs');
    res.render('jobs', { jobs: [] });
  }
};

const showNewJob = (req, res) => {
  res.render('job-form', { job: null });
};

const createJob = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    await Job.create(req.body);
    req.flash('info', 'Job created successfully!');
    res.redirect('/jobs');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/jobs/new');
  }
};

const showEditJob = async (req, res) => {
  try {
    const job = await Job.findOne({ _id: req.params.id, createdBy: req.user._id });
    if (!job) {
      req.flash('error', 'Job not found');
      return res.redirect('/jobs');
    }
    res.render('job-form', { job });
  } catch (error) {
    req.flash('error', 'Job not found');
    res.redirect('/jobs');
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!job) {
      req.flash('error', 'Job not found');
      return res.redirect('/jobs');
    }
    req.flash('info', 'Job updated successfully!');
    res.redirect('/jobs');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect(`/jobs/${req.params.id}/edit`);
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    if (!job) {
      req.flash('error', 'Job not found');
      return res.redirect('/jobs');
    }
    req.flash('info', 'Job deleted successfully!');
    res.redirect('/jobs');
  } catch (error) {
    req.flash('error', 'Failed to delete job');
    res.redirect('/jobs');
  }
};

module.exports = { getAllJobs, showNewJob, createJob, showEditJob, updateJob, deleteJob };