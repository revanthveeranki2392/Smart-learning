const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
    unique: true, // Ensure each skill is unique
  },
  test: {
    type: Boolean,
    default: false, // Default value for 'test' is false
  },
  course: {
    type: Boolean,
    default: false, // Default value for 'course' is false
  }
});

const SkillModel = mongoose.model('SkillsNames', SkillSchema);

module.exports = SkillModel;
