const mongoose = require('mongoose');

// Define the Attempt schema
const attemptSchema = new mongoose.Schema({
  percentage: { 
    type: Number, 
    required: true 
  },
  obtainedMarks: { 
    type: Number, 
    required: true 
  },
  totalMarks: { 
    type: Number, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

// Define the TestAttempt schema
const testAttemptSchema = new mongoose.Schema({
  skill: { 
    type: String, 
    required: true 
  },
  level: { 
    type: String, 
    enum: ['Beginner', 'Intermediate', 'Advanced'], 
    required: true 
  },
  attempts: [attemptSchema] // Use the Attempt schema for attempts
});

// Define the User schema
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: { 
    type: String, 
    required: true, 
    unique: true 
  },
  pswd: { 
    type: String, 
    required: true 
  },
  skills: [
    {
      skill: { 
        type: String, 
        required: true 
      },
      level: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced'], 
        required: true 
      }
    }
  ],
  study: { 
    type: String, 
    required: true 
  },
  college: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String,  
    default: null 
  },
  testAttempts: [testAttemptSchema] // Use the TestAttempt schema
});

// Create the model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
