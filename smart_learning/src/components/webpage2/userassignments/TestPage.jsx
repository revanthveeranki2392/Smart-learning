import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext'; // Custom AuthContext to get user data
import './TestPage.css';

function TestPage() {
  const { state } = useLocation(); // Get the test details passed via state
  const { user } = useAuth(); // Get user data from AuthContext
  const [quiz, setQuiz] = useState([]); // Store quiz questions
  const [userAnswers, setUserAnswers] = useState([]); // Store user's answers to quiz questions
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Index of the current question being displayed
  const [testResult, setTestResult] = useState(null); // Store test result
  const [instructionsVisible, setInstructionsVisible] = useState(true); // Toggle to show instructions
  const navigate = useNavigate(); // For navigating back after test

  // Fetch quiz questions based on skill and level
  useEffect(() => {
    const fetchQuiz = async () => {
      if (state && state.test) {
        const { skill, level } = state.test;
        try {
          const response = await axios.get(`http://localhost:3001/get-test?skill=${skill.toLowerCase()}&level=${level.toLowerCase()}`);
          const questions = response.data.questions;

          // Shuffle the questions randomly and select 20 questions for the test
          const randomQuestions = questions.sort(() => Math.random() - 0.5).slice(0, 20);
          setQuiz(randomQuestions); // Set the quiz questions
          setUserAnswers(new Array(randomQuestions.length).fill('')); // Initialize userAnswers array with empty strings
        } catch (error) {
          console.error('Failed to load test questions:', error);
        }
      }
    };

    fetchQuiz();
  }, [state]);

  // Handle navigation to the previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle navigation to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle the selection of an answer
  const handleAnswerChange = (option) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentQuestionIndex] = option; // Update the current question's answer
    setUserAnswers(updatedAnswers); // Update state with the new answers array
  };

  // Calculate the test results
  const handleTestCompletion = async () => {
    let correctAnswersCount = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;
    let unansweredCount = 0;
    let incorrectAnswersCount = 0;

    // Iterate over the quiz array to calculate results
    quiz.forEach((q, index) => {
      totalMarks += q.marks; // Accumulate total marks for all questions

      // Check if the user answered the question
      if (userAnswers[index] === '') {
        unansweredCount++; // Count unanswered questions
      } else if (q.correctAnswer === userAnswers[index]) {
        // Correct answer
        correctAnswersCount++;
        obtainedMarks += q.marks; // Add marks for correct answers
      } else {
        // Incorrect answer
        incorrectAnswersCount++;
      }
    });

    const totalQuestions = quiz.length;
    const totalIncorrect = incorrectAnswersCount + unansweredCount; // Total incorrect = incorrect + unanswered
    const percentage = (obtainedMarks / totalMarks) * 100; // Calculate percentage
    const result = percentage >= 75 ? 'pass' : 'fail'; // Pass if percentage is 75% or more, else fail
   
    if(result=='pass')
    {
      const level=state.test.level;
      if(level!=="beginner"){
        const passdata={
          email:user.email,
          skill:state.test.skill
        }
        try {
          await axios.post('http://localhost:3001/save-passedtest-result', passdata);
        } catch (error) {
          console.error('Failed to save test result:', error);
        }
      }
    }
    const resultData = {
      email: user.email,
      skill: state.test.skill,
      level: state.test.level,
      percentage: percentage.toFixed(2),
      obtainedMarks,
      totalMarks,
      date: new Date().toISOString(), // Add timestamp for when the test was completed
    };
    
    // Store test result in the backend
    try {
      await axios.post('http://localhost:3001/save-test-result', resultData);
    } catch (error) {
      console.error('Failed to save test result:', error);
    }

    setTestResult({
      ...resultData,
      status: result, // 'pass' or 'fail'
      correct: correctAnswersCount,
      incorrect: totalIncorrect,
      unanswered: unansweredCount,
    });
  };

  // Submit the test for evaluation
  const handleSubmit = () => {
    handleTestCompletion(); // Calculate and store the test results
  };

  // Start test by hiding instructions
  const startTest = () => {
    setInstructionsVisible(false);
  };

  return (
    <div className="test-page">
      {testResult ? (
        <div className="test-result">
          <h3>Test Completed</h3>
          <p>Percentage: {testResult.percentage}%</p>
          <p>Marks: {testResult.obtainedMarks}/{testResult.totalMarks}</p>
          <p>Status: {testResult.status === 'pass' ? 'Pass' : 'Fail'}</p>
          <p>Correct Answers: {testResult.correct}</p>
          <p>Incorrect Answers: {testResult.incorrect}</p>
          <p>Unanswered Questions: {testResult.unanswered}</p>
          <button onClick={() => navigate('/assignments')}>Back to Assignments</button>
        </div>
      ) : instructionsVisible ? (
        <div className="test-instructions">
          <h3>Instructions</h3>
          <p>Please read the following instructions carefully before starting the test:</p>
          <ul>
            <li>There are 20 questions in total.</li>
            <li>You need to score at least 75% to pass.</li>
            <li>Each question is worth varying marks.</li>
            <li>Make sure to answer all questions to the best of your ability.</li>
            <li>You can navigate between questions using the Previous and Next buttons.</li>
            <li>Once you submit the test, you will receive your results immediately.</li>
          </ul>
          <button onClick={startTest}>Start Test</button>
        </div>
      ) : quiz.length === 0 ? (
        <p>Loading questions...</p>
      ) : (
        <div className="test-fullscreen">
          <h4>{state.test.skill} - {state.test.level} Test</h4>
          <p>Question {currentQuestionIndex + 1} of {quiz.length}</p>
          <div>
            <p dangerouslySetInnerHTML={{ __html: quiz[currentQuestionIndex].text }}></p>
            <div className="options-list">
              {quiz[currentQuestionIndex].options.map((option, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={`question-${currentQuestionIndex}`}
                    value={option}
                    checked={userAnswers[currentQuestionIndex] === option}
                    onChange={() => handleAnswerChange(option)}
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="navigation-buttons">
              <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0}>Previous</button>
              {currentQuestionIndex < quiz.length - 1 ? (
                <button onClick={handleNextQuestion}>Next</button>
              ) : (
                <button onClick={handleSubmit}>Submit Test</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestPage;
