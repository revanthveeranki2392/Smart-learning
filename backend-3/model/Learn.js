const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  descript: { type: String, required: true },
  url: { type: String, required: true }
}, { _id: false }); // Disable _id generation for subdocuments

const skillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true ,default:null},
  learnUrl: { type: String, default: "" },
  easyLevel: [levelSchema],
  mediumLevel: [levelSchema],
  hardLevel: [levelSchema]
});

const Skill = mongoose.model('learns', skillSchema);

module.exports = Skill;
