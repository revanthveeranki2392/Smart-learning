import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from '../../../AuthContext';
import { FaTrashAlt } from 'react-icons/fa';
import './WebHome.css';

function WebHome() {
    const { user } = useAuth();
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [skillLevel, setSkillLevel] = useState('');
    const [skills, setSkills] = useState([]);
    const [skillOptions, setSkillOptions] = useState([]);
    const [jobRole, setJobRole] = useState([]);
    const [jobRoles, setJobRoles] = useState('');
    const [suggestedCourses, setSuggestedCourses] = useState([]);
    const [showAddSkill, setShowAddSkill] = useState(false);
    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:3001/skills');
            const formattedSkills = response.data.map(skill => ({
                value: skill.skill,
                label: skill.skill
            }));
            setSkillOptions(formattedSkills);
        } catch (error) {
            console.error('Error fetching skills:', error.response?.data?.error || error.message);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    useEffect(() => {
        const fetchUserSkills = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/get-skills?email=${user.email}`);
                setSkills(response.data.skills);
            } catch (error) {
                console.error('Failed to fetch skills:', error.response?.data?.error || error.message);
            }
        };

        fetchUserSkills();
    }, [user.email]);

    const fetchJobRole = async () => {
        try {
            const response = await axios.post('http://localhost:3001/job-role', { skills });
            setJobRole(response.data.jobRole);
        } catch (error) {
            console.error('Failed to fetch job role:', error.response?.data?.error || error.message);
        }
    };

    useEffect(() => {
        if (skills.length > 0) {
            fetchJobRole();
        }
    }, [skills]);

    const fetchSuggestedCourses = async (role) => {
      try {
          const response = await axios.post('http://localhost:3001/suggest-courses', { jobRole: role });
          if (response.status === 200) {
              setSuggestedCourses(response.data.courses);
              // Randomly select one course from the suggestions
              const randomIndex = Math.floor(Math.random() * response.data.courses.length);
              setRandomCourse(response.data.courses[randomIndex]);
          } else {
              console.error('No courses found.');
          }
      } catch (error) {
          console.error('Failed to fetch courses:', error.response?.data?.error || error.message);
      }
  };

  const handleSearchJobRole = () => {
      fetchSuggestedCourses(jobRoles);
  };

    const handleAddSkill = async () => {
        const newSkill = {
            skill: selectedSkill?.value,
            level: skillLevel,
        };

        try {
            const response = await axios.put('http://localhost:3001/update-skills', {
                email: user.email,
                skills: [...skills, newSkill],
            });

            if (response.status === 200) {
                setSkills(prevSkills => [...prevSkills, newSkill]);
                setSelectedSkill(null);
                setSkillLevel('');
                setShowAddSkill(false);
            }
        } catch (error) {
            console.error('Failed to update skills:', error.response?.data?.error || error.message);
        }
    };

    const handleRemoveSkill = async (skillToRemove) => {
        try {
            const updatedSkills = skills.filter(skill => skill._id !== skillToRemove._id);
            const response = await axios.put('http://localhost:3001/update-skills', {
                email: user.email,
                skills: updatedSkills,
            });

            if (response.status === 200) {
                setSkills(updatedSkills);
            }
        } catch (error) {
            console.error('Failed to remove skill:', error.response?.data?.error || error.message);
        }
    };

    const getSkillLevelPercentage = (level) => {
        switch (level) {
            case 'Beginner':
                return 33;
            case 'Intermediate':
                return 66;
            case 'Advanced':
                return 100;
            default:
                return 0;
        }
    };

    return (
        <div className="webhome">
            <div className="profile-section">
            <div className="profile-info">
                        <img
                            src="src\assets\pic.jpg"
                            alt={`${user.name}'s profile`}
                        />
                </div>
                <div>
                    <h3>{user.name}</h3>
                    <h3>{user.study}</h3>
                    <h3>Student at {user.college}</h3>
                </div>
            </div>

            <div className="skills-section">
                <h3>Your Current Skills:</h3>
                <ul>
                    {skills.map((skill) => (
                        <li key={skill._id}>
                            <div className="skill-container">
                                <span>{skill.skill} - {skill.level}</span>
                                <button onClick={() => handleRemoveSkill(skill)} className="trash-icon">
                                    <FaTrashAlt />
                                </button>
                            </div>
                            <div className="progress-bar">
                                <div
                                    className="progress"
                                    style={{ width: `${getSkillLevelPercentage(skill.level)}%` }}
                                ></div>
                            </div>
                        </li>
                    ))}
                </ul>
                <button className="add-skill-button" onClick={() => setShowAddSkill(true)}>
                    Add Skill
                </button>

                {showAddSkill && (
                    <div className="add-skill-popup">
                        <Select
                            value={selectedSkill}
                            onChange={setSelectedSkill}
                            options={skillOptions}
                            placeholder="Select a skill"
                        />
                        <select
                            className="level-select"
                            value={skillLevel}
                            onChange={(e) => setSkillLevel(e.target.value)}
                        >
                            <option value="">Select Level</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                        <div className="popup-buttons">
                        <button onClick={() => setShowAddSkill(false)}>Close</button>
                            <button onClick={handleAddSkill}>Add Skill</button>
                        </div>
                    </div>
                )}
            </div>

            <div className="job-role-section">
                {jobRole ? (
                    <>
                        <h3>Job Roles For Your Skills: </h3>
                        {jobRole.length > 0 ? (
                    <ul>
                        {jobRole.map((role, index) => (
                            <li key={index}><p>{role}</p></li>
                        ))}
                    </ul>
                ) : (
                    <p>No Job Roles Found</p>
                )}
                    </>
                ) : (
                    <h3>No Job Role Found</h3>
                )}
            </div>

            {/* <div className="job-role-search">
                <input
                    type="text"
                    value={jobRoles}
                    onChange={(e) => setJobRoles(e.target.value)}
                    placeholder="Enter Job Role"
                />
                <button onClick={handleSearchJobRole}>Search</button>
                {suggestedCourses.length > 0 && (
                    <>
                        <h3>Suggested Courses for {jobRole}:</h3>
                        <div className="suggested-skills">
                            {suggestedCourses.map((course, index) => (
                                <div className="skill-card" key={index}>
                                    {course}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div> */}
        </div>
    );
}

export default WebHome;
