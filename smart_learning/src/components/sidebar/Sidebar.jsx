import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { FaHome, FaBook, FaNewspaper, FaSignOutAlt, FaUserShield, FaTasks, FaBriefcase } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const confirmation = window.confirm("Are you sure you want to logout?");
    if (confirmation) {
      console.log("Logging out...");
      logout();
      navigate('/');
    } else {
      console.log("Logout cancelled.");
    }
  };

  return (
    <div className="sidebar">
      <ul className="nav flex-column">
        <div className="navbar-logo"><img src="src\assets\mainlogo.png" alt="image not displayed" /></div>
        {user.role === 'admin' ? (
          <div className="admin">
            <>
            <li className="nav-item" onClick={() => navigate('/adminhome')}>
                <FaHome /> {/* Icon for Admin Home */}
                <span className="nav-text">Home</span>
                
              </li>

              <li className="nav-item" onClick={() => navigate('/adminskills')}>
                <FaTasks /> {/* Icon for Admin Skills */}
                <span className="nav-text">Manage Skills</span>
              </li>


              <li className="nav-item" onClick={() => navigate('/adminlearn')}>
                <FaBook /> {/* Icon for Admin Learn */}
                <span className="nav-text">Manage Course</span>
              </li>

              <li className="nav-item" onClick={() => navigate('/adminjobrole')}>
                <FaBriefcase /> {/* Icon for JobRoles */}
                <span className="nav-text">Manage JobRoles</span>
              </li>

              <li className="nav-item" onClick={() => navigate('/admintest')}>
                <FaTasks /> {/* Icon for Tests */}
                <span className="nav-text">Manage Tests</span>
              </li>

              <li className="nav-item" onClick={handleLogout}>
                <FaSignOutAlt />
                <span className="nav-text">Logout</span>
              </li>
            </>
          </div>
        ) : (
          <>
            <li className="nav-item" onClick={() => navigate('/webhome')}>
              <FaHome />
              <span className="nav-text">Web Home</span>
            </li>

            <li className="nav-item" onClick={() => navigate('/userlearn')}>
              <FaBook />
              <span className="nav-text">Learn</span>
            </li>

            <li className="nav-item" onClick={() => navigate('/technews')}>
              <FaNewspaper />
              <span className="nav-text">Tech News</span>
            </li>

            <li className="nav-item" onClick={() => navigate('/assignments')}>
              <FaTasks />
              <span className="nav-text">Assignments</span>
            </li>

            <li className="nav-item" onClick={handleLogout}>
              <FaSignOutAlt />
              <span className="nav-text">Logout</span>
            </li>
          </>
        )}
      </ul>
    </div>
  );
}

export default Sidebar;
