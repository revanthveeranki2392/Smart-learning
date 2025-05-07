const mongoose = require('mongoose');

const JobRoleSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    unique: true,
  },
  skills: {
    type: [String],
    required: true,
  },
});

const JobRole = mongoose.model('JobRole', JobRoleSchema);
module.exports = JobRole;
