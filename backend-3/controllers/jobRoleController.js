const JobRole = require('../models/JobRole');

// Get all job roles
exports.getAllJobRoles = async (req, res) => {
  try {
    const jobRoles = await JobRole.find();
    res.json(jobRoles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new job role
exports.addJobRole = async (req, res) => {
  const { role, skills } = req.body;

  try {
    const newJobRole = new JobRole({ role, skills });
    await newJobRole.save();
    res.json(newJobRole);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a job role
exports.deleteJobRole = async (req, res) => {
  const { id } = req.params;

  try {
    await JobRole.findByIdAndDelete(id);
    res.json({ message: 'Job role deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
