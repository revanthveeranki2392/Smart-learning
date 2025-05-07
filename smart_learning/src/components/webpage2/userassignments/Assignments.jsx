import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../AuthContext'; // Custom AuthContext to get user data
import { useNavigate } from 'react-router-dom'; // For navigation to test page
import './Assignments.css';

function Assignments() {
  const { user } = useAuth(); // Get user data from AuthContext
  const [assessments, setAssessments] = useState([]); // Store user assessments
  const [error, setError] = useState(''); // Error message state
  const [testAttempts, setTestAttempts] = useState([]); // Store user's past test attempts
  const [showPastAttempts, setShowPastAttempts] = useState(false); // State to control visibility of past attempts
  const navigate = useNavigate(); // For navigating to the test page

  // Fetch user skills from the backend
  useEffect(() => {
    const fetchSkills = async () => {
      if (user && user.email) {
        try {
          const response = await axios.get(`http://localhost:3001/get-skills?email=${user.email}`);
          setAssessments(response.data.skills); // Set the skills/assessments from the backend
        } catch (error) {
          console.error('Failed to fetch skills:', error);
          setError('Unable to load skills. Please try again later.');
        }
      }
    };
    fetchSkills();
  }, [user]);

  const fetchUserTestAttempts = async (test) => {
    if (!test || !test.skill || !test.level) {
      console.error('Invalid test object:', test);
      return; // Exit if test is undefined or lacks required properties
    }
    try {
      const response = await axios.get(`http://localhost:3001/get-test-attempts?email=${user.email}&skill=${test.skill}&level=${test.level}`);
      setTestAttempts(response.data.attempts[0].attempts); 
    } catch (error) {
      console.error('Failed to load test attempts:', error);
    }
  };

  // Update handleShowPastAttempts to ensure it calls fetchUserTestAttempts with the correct test
  const handleShowPastAttempts = async (test) => {
    if (test) { // Ensure test is defined
      setShowPastAttempts((prev) => !prev); // Toggle visibility of past attempts

      if (!showPastAttempts) {
        await fetchUserTestAttempts(test); // Fetch attempts if not already displayed
      }
    } else {
      console.error('No test selected to show past attempts');
    }
  };

  // Navigate to the test conducting page
  const handleTestClick = (test) => {
    if (testAttempts.length >= 5) {
      setError('You have reached the maximum number of attempts for this test.');
      return; // Prevent further attempts if 5 attempts have been made
    }

    // Navigate to the test page, passing the selected test details via state
    navigate('/test', { state: { test } });
  };

  return (
    <div className="assignments">
      {error && <p className="error-message">{error}</p>} {/* Display error message if any */}

      {/* Display list of assessments when no test is currently selected */}
      <h3>Your Skill Assessments</h3>
<ul className="assessment-list">
  {assessments.map((test, index) => (
    <li key={index} className="assessment-item">
      <span className="assessment-title">{test.skill} - {test.level} Test</span>
      <div className="assessment-buttons">
        <button 
          onClick={() => handleTestClick(test)} 
          disabled={testAttempts.length >= 5} // Disable if 5 or more attempts
          className="start-test-button"
        >Start Test</button>&nbsp;
        <button 
          onClick={() => handleShowPastAttempts(test)} 
          className="show-attempts-button"
        >Show Past Attempts</button>
      </div>
    </li>
  ))}
</ul>

      {showPastAttempts && (
  <div className="past-attempts">
    <h4>Past Attempts</h4>
    {testAttempts.length === 0 ? (
      <p>No past attempts found.</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Score (%)</th>
            <th>Marks Obtained</th>
            <th>Total Marks</th>
          </tr>
        </thead>
        <tbody>
          {testAttempts.map((attempt, index) => (
            <tr key={index}>
              <td>{new Date(attempt.date).toLocaleDateString()}</td>
              <td>{attempt.percentage}</td>
              <td>{attempt.obtainedMarks}</td>
              <td>{attempt.totalMarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
    <button  onClick={() => setShowPastAttempts(false)}>Close</button>
  </div>
)}

    </div>
  );
}

export default Assignments;
