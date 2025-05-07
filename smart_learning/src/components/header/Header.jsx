import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { FaHome, FaUser, FaUserPlus, FaInfoCircle, FaUserCircle, FaBars, FaSearch } from 'react-icons/fa';
import { Dropdown, Offcanvas, Form, InputGroup, Button } from 'react-bootstrap';
import axios from 'axios';
import './Header.css';

function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // State to manage Offcanvas visibility
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Offcanvas toggle
  const toggleOffcanvas = () => setShowOffcanvas(!showOffcanvas);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/logout', {}, { withCredentials: true });
      logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };
  const isSmallScreen = window.innerWidth <= 768;
  return (
    <>
      {/* Render navbar based on authentication state */}
      <nav className={`navbar navbar-expand-lg ${isAuthenticated ? 'navbar-light text-light' : 'bg-black text-dark'} shadow-sm`}>
        <div className="container-fluid">
        <a 
  className={`navbar-brand ${isAuthenticated ? 'text-dark' : 'text-light'}`} 
  href="/" 
  style={isAuthenticated&&!isSmallScreen? { marginLeft: '300px' } : {marginLeft:'80px'}}
>
  Smart Learning
</a>

          {/* Toggle button for small screens */}
          {!isAuthenticated && (
            <button className="navbar-toggler" type="button" onClick={toggleOffcanvas}>
              <FaBars size={28} />
            </button>
          )}

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {isAuthenticated ? (
                <>
                
                  {/* Search bar */}
                  <Form className="search-bar d-flex" onSubmit={handleSearch}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Search keywords..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="me-2"
                      />
                      <Button type="submit" variant="outline-light">
                        <FaSearch />
                      </Button>
                    </InputGroup>
                  </Form>

                  <Dropdown className="ms-3">
                    <Dropdown.Toggle variant="link" id="userDropdown">
                      <FaUserCircle size={28} className="me-2" />
                      {user?.name}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => navigate('/webhome')}>Profile</Dropdown.Item>
                      <Dropdown.Item onClick={() => navigate('/forgot-password')}>Change Password</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <a className="nav-link text-light" onClick={() => navigate('/home')}>
                      <FaHome /> Home
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link text-light" onClick={() => navigate('/login')}>
                      <FaUser /> Login
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link text-light" onClick={() => navigate('/signup')}>
                      <FaUserPlus /> Sign Up
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link text-light" onClick={() => navigate('/about')}>
                      <FaInfoCircle /> About Us
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Offcanvas for small screens, only show for unauthenticated users */}
      {!isAuthenticated && (
        <Offcanvas show={showOffcanvas} onHide={toggleOffcanvas} placement="start" className="offcanvas-custom">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Smart-Learning</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ backgroundColor: 'rgba(15, 15, 15, 0.833)', color: 'white' }}>
            <ul className="nav flex-column">
              <li className="nav-item" onClick={() => navigate('/home')} style={{ color: 'white' }}>Home</li>
              <li className="nav-item" onClick={() => navigate('/login')} style={{ color: 'white' }}>Login</li>
              <li className="nav-item" onClick={() => navigate('/signup')} style={{ color: 'white' }}>Sign Up</li>
              <li className="nav-item" onClick={() => navigate('/about')} style={{ color: 'white' }}>About Us</li>
            </ul>
          </Offcanvas.Body>
        </Offcanvas>
      )}

      {/* Overlay when Offcanvas is open */}
      {showOffcanvas && <div className="sidebar-overlay" onClick={toggleOffcanvas}></div>}
    </>
  );
}

export default Header;