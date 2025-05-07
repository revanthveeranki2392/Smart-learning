const mongoose = require('mongoose');

const passedschema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  skills: { // Change skill to skills to indicate it's an array
    type: [], // Define it as an array of strings
    required: true,
  }
});

const passedtest = mongoose.model('SkillsNames', passedschema);

module.exports = passedtest;
