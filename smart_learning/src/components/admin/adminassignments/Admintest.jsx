import React, { useState, useEffect } from 'react';
import Select from "react-select";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap import
import './Admintest.css'; // Import custom CSS for styling

function Admintest() {
  const [skill, setSkill] = useState('');
  const [level, setLevel] = useState('');
  const [questions, setQuestions] = useState([{ text: '', correctAnswer: '', options: ['', '', '', ''], marks: '', description: '' }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null); // Updated to handle single selected skill
  const [skills, setSkills] = useState([]);

  // Function to fetch skills with test: false
  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:3001/adminskills'); // Fetch filtered skills from the server
      // Convert the response to the format: { value: "skill_name", label: "skill_name" }
      const formattedSkills = response.data.map(skil => ({
        value: skil.skill,
        label: skil.skill
      }));
      setSkills(formattedSkills); // Store skills in the state
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  // Fetch skills on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Handle input change for questions and options
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  // Add a new question input field
  const addQuestion = () => {
    setQuestions([...questions, { text: '', correctAnswer: '', options: ['', '', '', ''], marks: '', description: '' }]);
  };

  // Remove a question input field
  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:3001/add-test', {
        skill: selectedSkill.value, // Use the selected skill's value
        level,
        questions,
      });

      setSuccess('Test added successfully!');
      // Reset form fields
      setSkill('');
      setLevel('');
      setQuestions([{ text: '', correctAnswer: '', options: ['', '', '', ''], marks: '', description: '' }]);
      setSelectedSkill(null); // Reset selected skill
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Display an error message if the test already exists
        setError('A test for this skill and level already exists.');
      } else {
        // Display a generic error message for other errors
        setError('Failed to add test. Please try again later.');
      }
    }
  };

  return (
    <div className="containersadmin my-5">
      <h3 className="text-center">Add New Test</h3>
      {error && <p className="alert alert-danger">{error}</p>}
      {success && <p className="alert alert-success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="skill-input-container mb-4">
          <Select
            value={selectedSkill}
            onChange={setSelectedSkill} // Use the state setter for the selected skill
            options={skills}
            placeholder="Search and select a skill"
            className="select-skill"
          />
        </div>

        <div className="skill-level-and-button mb-4">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="form-select"
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        <div className="mb-4">
          <h4>Questions</h4>
          {questions.map((question, index) => (
            <div key={index} className="border p-3 mb-3 rounded shadow">
              <div className="mb-3">
                <label className="form-label">Question {index + 1}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Question"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                  required
                />
              </div>
              <div className="row mb-3">
                {question.options.map((option, optIndex) => (
                  <div className="col-md-6 mb-3" key={optIndex}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Option ${optIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <label className="form-label">Correct Answer</label>
                <select
                  className="form-select"
                  value={question.correctAnswer}
                  onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                  required
                >
                  <option value="">Select Correct Answer</option>
                  {question.options.map((option, optIndex) => (
                    <option key={optIndex} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Marks</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Marks"
                  value={question.marks}
                  onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  placeholder="Description"
                  value={question.description}
                  onChange={(e) => handleQuestionChange(index, 'description', e.target.value)}
                  rows={2}
                />
              </div>
              <button type="button" className="btn btn-danger" onClick={() => removeQuestion(index)}>
                Remove Question
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-primary" onClick={addQuestion}>
            Add Question
          </button>
        </div>
        <button type="submit" className="btn btn-success">Add Test</button>
      </form>
    </div>
  );
}

export default Admintest;
