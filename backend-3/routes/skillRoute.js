const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();


const Skill = require('../model/Learn'); // Adjust the path according to your project structure



router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find(); // Use the Mongoose model to find all skills
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle adding skills
router.post('/add-skill', async (req, res) => {
  const { name, description, image, easyLevel, mediumLevel, hardLevel } = req.body;

  try {
    // Check if a skill with the same name already exists
    const existingSkill = await Skill.findOne({ name: name });
    if (existingSkill) {
      return res.status(409).send({ message: "Skill name already exists" }); // 409 Conflict
    }

    // Prepare the new skill object with difficulty levels
    const newSkill = new Skill({ 
      name, 
      description, 
      image,      // This is the base64 encoded image string
      easyLevel,  // Array of topics with 'topic', 'descript', and 'url'
      mediumLevel, // Array of topics with 'topic', 'descript', and 'url'
      hardLevel   // Array of topics with 'topic', 'descript', and 'url'
    });

    // Save the new skill to the database
    const result = await newSkill.save();

    // Return a success response
    res.status(201).json({ message: 'Skill added successfully!', skillId: result._id });
  } catch (error) {
    console.error('Error adding skill:', error); 
    res.status(500).json({ error: 'Failed to add skill', message: error.message });
  }
});

router.put('/update-skill/:id', async (req, res) => {
  const skillId = req.params.id;
  const { name, description, image, easyLevel, mediumLevel, hardLevel } = req.body;

  try {
    // Use Mongoose's findByIdAndUpdate to update the skill
    const updatedSkill = await Skill.findByIdAndUpdate(
      skillId,
      {
        name,
        description,
        image,
        easyLevel,
        mediumLevel,
        hardLevel,
      },
      { new: true } // Returns the updated document
    );

    // Check if updatedSkill was found and updated
    if (!updatedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill updated successfully', updatedSkill });
  } catch (error) {
    console.error('Error updating skill:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error updating skill', error: error.message }); // Return a more detailed error message
  }
});


// DELETE image by id
router.delete('/delete-skill/:id', async (req, res) => {
  try {
    const skillId = req.params.id;
    
    const deletedSkill = await Skill.findByIdAndDelete(skillId); // Delete skill by ID
    if (!deletedSkill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;