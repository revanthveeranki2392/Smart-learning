const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true // Ensure unique emails for admins
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin' // Default role
  },
  createdAt: {
    type: Date,
    default: Date.now // Automatically set created date
  }
});

const AdminModel = mongoose.model('Admin', AdminSchema);

module.exports = AdminModel;
