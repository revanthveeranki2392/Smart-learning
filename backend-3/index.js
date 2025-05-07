const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const multer = require('multer');
const path = require('path');
const UserModel = require('./model/User'); // Ensure User schema is defined
const AdminModel = require('./model/Admin');
const SkillModel = require('./model/Skill');
const JobRole =require('./model/JobRole');
const LearnModel=require('./model/Learn');

// Load environment variables
dotenv.config();
const app = express();

// CORS Setup for frontend connection
app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow requests from frontend
  credentials: true // Allow credentials (like cookies) to be sent
}));

// Middleware for JSON parsing
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URL }),
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production' // Set to true in production for HTTPS
  }
}));

// Increase the payload size limit
app.use(express.json({ limit: '50mb' })); // Allow up to 50 MB of JSON payload
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory for file uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});

const upload = multer({ storage });

// Routes

// Signup Route
app.post("/signup", upload.single('profileImage'), async (req, res) => {
  try {
    console.log(req.body); // Log request body
    console.log(req.file); // Log file

    const { name, email, phone, password, skills, study, college,profileImage } = req.body;
    const imageFilePath = req.file ? req.file.path : null;

    // Check if the email already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance with the image path
    const newUser = new UserModel({
      name,
      email,
      phone,
      pswd: hashedPassword,
      skills: JSON.parse(skills), // Parse the skills JSON string
      study,
      college,
      image:profileImage // Store the file path
    });

    // Save the user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ error: error.message });
  }
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));




// Login Route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check in the Admins collection first
    let user = await AdminModel.findOne({ email });
    let isAdmin = false; // Flag to check if the user is admin

    if (user) {
      isAdmin = true;
    } else {
      // If not found in Admins, check in Users collection
      user = await UserModel.findOne({ email });
    }
    if (!user) {
      return res.status(404).json({ error: 'Email does not exist' });
    }
    if (user) {
      // Use the correct password field based on admin or user login
      const isPasswordValid = isAdmin 
        ? await bcrypt.compare(password, user.password) 
        : await bcrypt.compare(password, user.pswd);

      if (isPasswordValid) {
        let fullImageUrl = null;
        if (!isAdmin && user.image) {
          fullImageUrl = `http://localhost:5000/${user.image}`;
        }

        // Prepare session data for both admin and user
        req.session.user = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: isAdmin ? 'admin' : 'user',
          skills: !isAdmin ? user.skills : null,
          study: !isAdmin ? user.study : null,
          college: !isAdmin ? user.college : null,
          image: fullImageUrl
        };

        // Prepare response data similarly
        const responseUser = {
          id: user._id,
          name: user.name,
          email: user.email,
          role: isAdmin ? 'admin' : 'user',
          skills: !isAdmin ? user.skills : null,
          study: !isAdmin ? user.study : null,
          college: !isAdmin ? user.college : null,
          image: fullImageUrl
        };

        return res.status(200).json({ user: responseUser });
      } else {
        return res.status(401).json({ error: "Password does not match" });
      }
    } else {
      return res.status(401).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset Password Route
app.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find the user by email
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Email does not exist' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.pswd = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout Route
app.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ error: 'Failed to destroy session' });
      } else {
        res.clearCookie('connect.sid', { path: '/' }); // Clear cookie
        return res.status(200).json({ message: 'Logout successful' });
      }
    });
  } else {
    return res.status(400).json({ error: 'No session found' });
  }
});

// User Session Check Route
app.get('/user', (req, res) => {
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ error: "Not Authorized" });
  }
});

// Get skills route
app.get('/get-skills', async (req, res) => {
  const { email } = req.query; // Get the email from the query parameters

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ skills: user.skills });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update skills route
app.put("/update-skills", async (req, res) => {
  try {
    const { email, skills } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'Email does not exist' });
    }

    user.skills = skills; // Directly set to new skills array
    await user.save();

    res.status(200).json({ message: 'Skills updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



// Admin Route to Add a New Skill
app.post("/adminskills", async (req, res) => {
  try {
    console.log("Received skill:", req.body); // Debugging line
    const { skill } = req.body;

    // Check if the skill already exists in the collection
    const existingSkill = await SkillModel.findOne({ skill });
    console.log("Existing Skill:", existingSkill); // Debugging line

    if (existingSkill) {
      return res.status(400).json({ error: "Skill already exists" });
    }

    // Create a new skill entry in the database
    const newSkill = new SkillModel({
      skill
    });

    await newSkill.save();

    res.status(201).json({ message: "Skill added successfully", newSkill });
  } catch (error) {
    console.error("Error adding skill:", error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Delete skill by ID
app.delete('adminskills/:id', async (req, res) => {
  try {
    const skillId = req.params.id;
    
    // Find and delete the skill by ID
    const deletedSkill = await SkillModel.findByIdAndDelete(skillId);
    
    if (!deletedSkill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    res.status(200).json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Fetch All Skills Route
app.get('/skills', async (req, res) => {
  try {
    // Fetch all skills from the SkillModel
    const skills = await SkillModel.find({});
    
    // Respond with the skills array
    res.status(200).json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to fetch skills without a test
app.get('/adminskills', async (req, res) => {
  try {
    const skillsWithoutTest = await SkillModel.find({ test: false }); // Find skills where test is false
    res.json(skillsWithoutTest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});


// Define Test Schema
const testSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
  },
  level: String,
  questions: [
    {
      text: String,
      correctAnswer: String,
      options: [String],
      marks: Number,
      description: String,
    },
  ],
});

const Test = mongoose.model('Test', testSchema);

app.post('/add-test', async (req, res) => {
  const { skill, level, questions } = req.body;

  // Validate input
  if (!skill || !level || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Invalid data provided.' });
  }

  // Normalize skill and level values
  const skillNormalized = skill.trim().toLowerCase();
  const levelNormalized = level.trim().toLowerCase();

      // Check if all levels of tests are available for this skill
      const tests = await Test.find({ skill: skillNormalized }); // Corrected the query
  const levelsAvailable = new Set(tests.map(test => test.level)); // Ensure you're mapping the `level`, not `levelNormalized`
  console.log(levelsAvailable);

  if (levelsAvailable.size>=2) {
      await SkillModel.findOneAndUpdate(
          { skill: skill }, // Normalize skill in the query
          { test: true },
          { new: true }
      );
  }

  // Check if a test already exists for this skill and level
  const existingTest = await Test.findOne({ skill: skillNormalized, level: levelNormalized });
  if (existingTest) {
      return res.status(400).json({ message: 'A test for this skill and level already exists.' });
  }

  const newTest = new Test({ skill: skillNormalized, level: levelNormalized, questions });

  try {
      await newTest.save();
      res.status(201).json({ message: 'Test added successfully!' });
  } catch (error) {
      console.error('Error adding test:', error.message); // Log the error message
      res.status(500).json({ message: 'Failed to add test', error: error.message });
  }
});


// Assuming you already have a route set up to fetch test data
app.get('/get-test', async (req, res) => {
  const { skill, level } = req.query;
  const skillNormalized = skill.trim().toLowerCase();
  const levelNormalized = level.trim().toLowerCase();

  try {
    // Update query to use `skill` and `level`
    const test = await Test.findOne({ skill: skillNormalized, level: levelNormalized });
    
    if (test) {
      res.json(test);
    } else {
      res.status(404).json({ error: 'Test not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch test data' });
  }
});


app.post('/save-test-result', async (req, res) => {
  const { email, skill, level, percentage, obtainedMarks, totalMarks, date } = req.body;

  // Validate the request body
  if (!email || !skill || !level || percentage === undefined || obtainedMarks === undefined || totalMarks === undefined || !date) {
    return res.status(400).send({ message: 'All fields are required.' });
  }
  console.log(email,skill,level,percentage,obtainedMarks,totalMarks,date);
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      console.log("Arrived");

      // Find the test attempt for the specific skill and level
      const testAttempt = user.testAttempts.find(attempt => attempt.skill === skill && attempt.level === level);

      // Check if the maximum number of attempts has been reached
      if (testAttempt && testAttempt.attempts.length >= 5) {
        return res.status(400).send({ message: 'Maximum number of attempts reached for this skill and level.' });
      }

      // Prepare the new attempt data
      const newAttempt = {
        percentage:percentage,
        obtainedMarks:obtainedMarks,
        totalMarks:totalMarks,
        date:date
      };

      // If the testAttempt exists, add the new attempt; otherwise, create a new testAttempt entry
      if (testAttempt) {
        testAttempt.attempts.push(newAttempt);
        console.log("arrived");
      } else {
        console.log("arrived");
        user.testAttempts.push({
          skill:skill,
          level:level,
          attempts: [newAttempt]
        });
      }

      // Save the updated user document
      await user.save();
      res.send({ message: 'Test result saved successfully.' });
    } else {
      res.status(404).send({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error saving test result:', error.message);
    res.status(500).send({ message: 'Failed to save test result.', error: error.message });
  }
});

app.get('/get-test-attempts', async (req, res) => {
  const { email, skill, level } = req.query;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      console.log("arrived");
      const testAttempts = user.testAttempts.filter(attempt => attempt.skill === skill && attempt.level === level);
      console.log(testAttempts);
      res.send({ attempts: testAttempts });
    } else {
      res.status(404).send({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Error retrieving test attempts:', error);
    res.status(500).send({ message: 'Failed to retrieve test attempts.' });
  }
});

const jobRoleRoutes = require('./routes/jobRoleRoutes');

app.use('/api', jobRoleRoutes);

app.use(express.json()); 
const skillroute=require('./routes/skillRoute')

app.use('/api',skillroute);

const determineJobRole = async (skills) => {
  const skillNames = skills.map(skill => skill.skill.toLowerCase());
  let matchedRoles = [];

  const jobRoles = await JobRole.find();
  
  // Create job roles mapping (role -> required skills)
  const jobRolesMapping = jobRoles.reduce((acc, role) => {
    acc[role.role] = role.skills; // Assuming role.skills is an array of skill names
    return acc;
  }, {});

  console.log(jobRolesMapping);

  // Check for matching roles based on skills
  for (const [role, requiredSkills] of Object.entries(jobRolesMapping)) {
    const hasAllSkills = requiredSkills.every(skill => skillNames.includes(skill));
    if (hasAllSkills) {
      matchedRoles.push(role);
    }
  }

  return matchedRoles; // Returning an array of matched roles
};

app.post('/job-role', async (req, res) => { // Add async here
  const { skills } = req.body;

  try {
    const jobRole = await determineJobRole(skills); // Await the promise
    console.log(jobRole); // Now this will log the resolved value
    res.status(200).json({ jobRole }); // Send the jobRole in the response
  } catch (error) {
    console.error('Error determining job role:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


const coursesMapping = {
  Developer: [
    'JavaScript Fundamentals',
    'React for Beginners',
    'Node.js Crash Course',
  ],
  DataScientist: [
    'Python for Data Science',
    'Introduction to Machine Learning',
    'Data Analysis with Pandas',
  ],
  DevOpsEngineer: [
    'Docker Essentials',
    'Kubernetes for Beginners',
    'AWS Certified Solutions Architect',
  ],
  WebDesigner: [
    'Web Design for Beginners',
    'Figma Basics',
    'Adobe XD Essentials',
  ],
  FullStackDeveloper: [
    'Full Stack Web Development Bootcamp',
    'MERN Stack: Front to Back',
    'Advanced JavaScript',
  ],
  // Add more mappings as needed
};

function suggestCoursesForRole(jobRole) {
  return coursesMapping[jobRole] || [];
}


// const passedtest =require('./model/UserPassed');

// app.post('/save-passedtest', async (req, res) => {
//   const { email, skill } = req.body;

//   try {
//     // Find user by email
//     const user = await passedtest.findOne({ email });

//     if (user) {
//       // User found, push the skill to the skills array if it's not already present
//       if (!user.skills.includes(skill)) {
//         user.skills.push(skill);
//         await user.save(); // Save the updated user document
//         return res.status(200).json({ message: 'Skill added successfully', user });
//       } else {
//         return res.status(400).json({ message: 'Skill already exists for this user' });
//       }
//     } else {
//       // User not found, create a new user
//       const newUser = new passedtest({
//         email,
//         skills: [skill] // Initialize skills array with the provided skill
//       });

//       await newUser.save(); // Save the new user document
//       return res.status(201).json({ message: 'User created successfully', user: newUser });
//     }
//   } catch (error) {
//     console.error('Error saving passed test:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// });



app.post('/suggest-courses', async (req, res) => {
    const { jobRole } = req.body;
    console.log('Received job role:', jobRole); // Check what job role is being received

    const courses = await suggestCoursesForRole(jobRole);
    console.log(courses); // Custom function to fetch courses
    if (courses.length > 0) {
        res.status(200).json({ courses });
    } else {
        res.status(404).json({ error: 'No courses found for the given job role.' });
    }
});



app.get('/admin/stats', async (req, res) => {
  try {
    const usersCount = await UserModel.countDocuments();
     const coursesCount = await LearnModel.countDocuments();
     const testsCount = await Test.countDocuments();
     console.log(usersCount,coursesCount,testsCount);
    res.json({
      users: usersCount,
      courses: coursesCount,
       tests: testsCount,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).send('Server error');
  }
});

app.get('/admin/users', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

app.delete('/admin/users/:id', async (req, res) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Server error');
  }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});