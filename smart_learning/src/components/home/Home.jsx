import React, { useState } from 'react';
import { BsArrowRight } from 'react-icons/bs';
import Login from '../login/Login'; // Ensure correct import of Login component
import Signup from '../signup/Signup'; // Ensure correct import of Signup component
import learn from '../../assets/learn.jpg';
import quizz from '../../assets/quizz.jpg';
import job from '../../assets/job.jpg';
import ui from '../../assets/ui.jpg';
import tech from '../../assets/tech_news.jpg';
import self from '../../assets/self_asses.jpg'
import './Home.css';

const Home = () => {
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showSignupCard, setShowSignupCard] = useState(false);

  const questions = [
    { id: 1, question: "What are self-assessing skills?", answer: "Self-assessing skills are the abilities to evaluate your own performance and capabilities, helping you identify strengths and areas for improvement." },
    { id: 2, question: "How can conducting quizzes improve learning?", answer: "Conducting quizzes reinforces knowledge, helps identify gaps in understanding, and enhances retention of information." },
    { id: 3, question: "Why is staying updated with technical news important?", answer: "Staying updated with technical news helps you keep pace with industry trends, new technologies, and best practices that can enhance your skills." },
    { id: 4, question: "What factors should I consider for job suggestions?", answer: "Consider your skills, interests, market demand, and career goals when looking for job suggestions." },
    { id: 5, question: "How can I create an effective learning path?", answer: "An effective learning path should include setting clear goals, selecting appropriate resources, and regularly assessing progress." },
    { id: 6, question: "What is the importance of interactive learning?", answer: "Interactive learning encourages engagement, enhances retention, and allows for practical application of concepts." },
    { id: 7, question: "How can self-assessment tools help in personal development?", answer: "Self-assessment tools provide structured feedback, helping you identify skills and areas for improvement, guiding your personal development journey." },
    { id: 8, question: "What types of quizzes can I conduct to assess my learning?", answer: "You can conduct formative quizzes for ongoing assessments, summative quizzes for comprehensive evaluations, and practice quizzes for preparation." },
    // Add more questions as needed
  ];
  
  

    const scrollLeft = () => {
      const container = document.querySelector('.card-container');
      container.scrollBy({ left: -200, behavior: 'smooth' });
    };
  
    const scrollRight = () => {
      const container = document.querySelector('.card-container');
      container.scrollBy({ left: 200, behavior: 'smooth' });
    };

  const handleLoginClick = () => {
    setShowLoginCard(true);
    setShowSignupCard(false); // Ensure only login card is shown
    document.body.classList.add('no-scroll');
  };

  const handleSignupClick = () => {
    setShowSignupCard(true);
    setShowLoginCard(false); // Ensure only signup card is shown
    document.body.classList.add('no-scroll');
  };

  const handleCloseFlashCard = () => {
    setShowLoginCard(false);
    setShowSignupCard(false);
    document.body.classList.remove('no-scroll');
  };

  return (
    <div className="">
      <div className="hero">
        <div className="text-light container">
          <h1 className="text-light">We Ensure better education for a better world</h1>
          <p>
          Studying smart involves using effective techniques and strategies that enhance understanding and retention, allowing you to grasp concepts more deeply in less time. By prioritizing quality over quantity, you can achieve your academic goals with less stress and more confidence.</p>
          <button className="btn" onClick={handleLoginClick}>
            Explore More <BsArrowRight />
          </button>
        </div>
      </div>

      <div className="container-fluid mt-5 mb-5">
  <h1 style={{ textAlign: 'center' }}>Why You Choose Us</h1>
  <div className="d-flex flex-wrap justify-content-around">
    {/* Card for Self-Assessing Skills */}
    <div className="card mt-4" style={{ width: '20rem' }}>
      <img className="card-img-top" src={self} alt="Self-Assessing Skills" />
      <div className="card-body">
        <h5 className="card-title">Self-Assessing Skills</h5>
        <p className="card-text">Self-assessing skills involves evaluating your own abilities, strengths, and areas for improvement. It helps individuals identify what they excel at and where they may need further development.</p>
        <a href="#" className="btn btn-primary">Learn More</a>
      </div>
    </div>

    {/* Card for Conducting Quizzes */}
    <div className="card mt-4" style={{ width: '20rem' }}>
      <img className="card-img-top" src={quizz} alt="Conducting Quizzes" />
      <div className="card-body">
        <h5 className="card-title">Conducting Quizzes</h5>
        <p className="card-text">Conducting quizzes is an interactive method of assessing knowledge, skills, or understanding in a particular subject, reinforcing learning and identifying knowledge gaps.</p>
        <a href="#" className="btn btn-primary">Learn More</a>
      </div>
    </div>

    {/* Card for Technical News */}
    <div className="card mt-4" style={{ width: '20rem' }}>
      <img className="card-img-top" src={tech} alt="Technical News" />
      <div className="card-body">
        <h5 className="card-title">Technical News</h5>
        <p className="card-text">Technical news includes updates and advancements in technology, helping professionals stay informed about industry trends, new software, and hardware innovations.</p>
        <a href="#"  className="btn btn-primary">Learn More</a>
      </div>
    </div>

    {/* Card for Job Suggestions */}
    <div className="card mt-4" style={{ width: '20rem' }}>
      <img className="card-img-top" src={job} alt="Job Suggestions" />
      <div className="card-body">
        <h5 className="card-title">Job Suggestions</h5>
        <p className="card-text">Job suggestions provide tailored recommendations for potential career opportunities based on individual skills and interests, helping job seekers navigate their career paths effectively.</p>
        <a href="#" className="btn btn-primary">Learn More</a>
      </div>
    </div>

    {/* Card for Learning Path */}
    <div className="card mt-4" style={{ width: '20rem' }}>
      <img className="card-img-top" src={learn} alt="Learning Path" />
      <div className="card-body">
        <h5 className="card-title">Learning Path</h5>
        <p className="card-text">A learning path is a structured sequence of educational resources designed to help individuals achieve specific learning goals and acquire new knowledge or skills.</p>
        <a href="#" className="btn btn-primary">Learn More</a>
      </div>
    </div>

    {/* Card for Easy Interact */}
    <div className="card mt-4" style={{ width: '20rem' }}>
      <img className="card-img-top" src={ui} alt="Easy Interact" />
      <div className="card-body">
        <h5 className="card-title">Easy Interact</h5>
        <p className="card-text">Easy Interact refers to user-friendly platforms or tools that facilitate seamless communication and engagement among users, promoting collaboration and interaction.</p>
        <a href="#" className="btn btn-primary">Learn More</a>
      </div>
    </div>
  </div>
</div>


      {showLoginCard && (
        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Login</h2>
              <span className="close-icon" onClick={handleCloseFlashCard}>&times;</span>
            </div>
            <Login toggleSignup={handleSignupClick} /> {/* Pass toggle function */}
          </div>
        </div>
      )}
      {showSignupCard && (
        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Sign Up</h2>
              <span className="close-icon" onClick={handleCloseFlashCard}>&times;</span>
            </div>
            <Signup toggleLogin={handleLoginClick} /> {/* Pass toggle function */}
          </div>
        </div>
      )}
       <h2>Frequently Asked Questions</h2>
       <div className="question-cards">
       
      <button className="scroll-btn left" onClick={scrollLeft}>
        &lt;
      </button>

      <div className="card-container">
        {questions.map((q) => (
          <div className="card" key={q.id}>
            <h3>{q.question}</h3>
            <p>{q.answer}</p>
          </div>
        ))}
      </div>

      <button className="scroll-btn right" onClick={scrollRight}>
        &gt;
      </button>
    </div>
    </div>
  );
};

export default Home;