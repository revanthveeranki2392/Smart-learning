// routes/jobRoleRoutes.js
const express = require('express');
 // Assuming you have a JobRole model for MongoDB
const router = express.Router();
const JobRole = require('../model/JobRole');
// Get all job roles
router.get('/jobroles', async (req, res) => {
  try {
    const jobRoles = await JobRole.find();
    res.json(jobRoles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/jobroles/:id', async (req, res) => {
    const { id } = req.params;
    const { role, skills } = req.body;
  
    try {
      const updatedJobRole = await JobRole.findByIdAndUpdate(
        id,
        { role, skills },
        { new: true } // Return the updated document
      );
  
      if (!updatedJobRole) {
        return res.status(404).json({ message: 'Job role not found' });
      }
  
      res.json(updatedJobRole);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });


// Add a new job role
router.post('/jobroles', async (req, res) => {
  const { role, skills } = req.body;

  try {
    const newJobRole = new JobRole({ role, skills });
    await newJobRole.save();
    res.json(newJobRole);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a job role by ID
router.delete('/jobroles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await JobRole.findByIdAndDelete(id);
    res.json({ message: 'Job role deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
