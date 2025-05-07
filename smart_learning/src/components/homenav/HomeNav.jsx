import React, { useState, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import { BsArrowRight } from 'react-icons/bs';
import Login from '../login/Login';
import Signup from '../signup/Signup'; 
import './HomeNav.css';
import logo from '../../assets/logos.jpg';

const HomeNav = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showLoginCard, setShowLoginCard] = useState(false);
  const [showSignupCard, setShowSignupCard] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const handleLoginClick = () => {
    setShowLoginCard(true);
    setShowSignupCard(false);
    document.body.classList.add('no-scroll');
  };

  const handleSignupClick = () => {
    setShowSignupCard(true);
    setShowLoginCard(false);
    document.body.classList.add('no-scroll');
  };

  const handleCloseFlashCard = () => {
    setShowLoginCard(false);
    setShowSignupCard(false);
    document.body.classList.remove('no-scroll');
  };

  return (
    <div>
      <nav className={`container-fluid ${sticky ? 'dark-nav' : ''}`}>
        <img src="src\assets\mainlogo.png" alt="Logo" className="logo" />
        <ul className={`navwid ${mobileMenu ? '' : 'hide-mobile-menu'}`}>
          <li>Home</li>
          <li onClick={handleLoginClick}>Login</li>
          <li onClick={handleSignupClick}>SignUp</li>
          <li>About</li>
          <li>
            <button className="btn" >
              Contact Us
            </button>
          </li>
        </ul>
        <FaBars size={28} className="menu-icon" onClick={toggleMenu} />
      </nav>

      {showLoginCard && (
        <div className="login-card-wrapper">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Login</h2>
              <span className="close-icon" onClick={handleCloseFlashCard}>&times;</span>
            </div>
            <Login toggleSignup={handleSignupClick} />
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
            <Signup toggleLogin={handleLoginClick} />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeNav;