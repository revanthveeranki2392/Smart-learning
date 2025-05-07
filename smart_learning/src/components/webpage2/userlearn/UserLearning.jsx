// Gallery.js
import React, { useEffect, useState } from 'react';
import './UserPanel.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp,faAngleDown, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
const UserLearning = () => {
  const [images, setImages] = useState([]);
  const [activeCard, setActiveCard] = useState(null); // To track the active card
  const [expandedTopics, setExpandedTopics] = useState({}); // To track expanded topics

  useEffect(() => {
    // Fetch skills from the backend when the component mounts
    const fetchSkills = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/skills');
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setImages(data); // Set the images array with skills
        } else {
          console.error('Failed to fetch skills:', data.error);
        }
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };

    fetchSkills();
  }, []);

  const handleButtonClick = (id) => {
    setActiveCard(id); // Set the active card to the clicked one
  };

  const handleGoBack = () => {
    setActiveCard(null); // Reset to show all cards
  };

  const toggleExpandTopic = (levelType, topic) => {
   
    setExpandedTopics((prev) => ({
      ...prev,
      [levelType + topic]: !prev[levelType + topic]
       // Toggle the specific topic
    }));
  };

  return (
    <div>
      <p></p>
      <h1>Courses Available</h1>
      <div className="display-cards" style={{ display: 'flex', flexWrap: 'wrap',background:'none' }}>
        {activeCard === null ? (
          // Show all cards if no card is active
          images.map((image, index) => (
            <div
              className='skill-form'
              key={image._id}
              style={{
                position: 'relative',
                margin: '10px',
                width: '350px',
                background:'linear-gradient(135deg, #343a40, #720404eb);'
              }}
            >
              <img
                src={image.image}
                alt={'Gallery Pic ${index}'}
                style={{ width: '250px', height: '250px', objectFit: 'cover' }}
              />
              <h2>{image.name}</h2>
              
              <button
                className="submit-button"
                onClick={() => handleButtonClick(image._id)}
              >
                Learn More
              </button>
            </div>
          ))
        ) : (
          // Show the details of the clicked card
          images
            .filter((image) => image._id === activeCard)
            .map((image) => (

              <div key={image._id} className="skill-details">
                <h1>Important Topics</h1>
                <img
                src={image.image}
                alt={"image not found"}
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
              />
                <h2>{image.name}</h2>
                <p>{image.description}</p>
              <div className='levels_display'>
                {/* Easy Level Section */}
                <h3 className='level'>Easy Level:</h3>
                <ul className="level-list">
                  {image.easyLevel.map((level, i) => (
                    <li key={i} className="level-item">
                      <div 
                        className="topic-title" 
                         onClick={() => toggleExpandTopic('easyLevel', level.topic)}
                        >
                        <strong><FontAwesomeIcon icon={faHandPointRight} />&nbsp;&nbsp;{level.topic}</strong>
                          <FontAwesomeIcon icon={expandedTopics['easyLevel' + level.topic] ? faAngleUp : faAngleDown} />
                    </div>
                      
                      {expandedTopics['easyLevel' + level.topic] && (
                        <div className="expanded-content">
                          <strong>Description:</strong> {level.descript}<br />
                          <strong>URL:</strong> <a href={level.url} target="_blank" rel="noopener noreferrer">{level.url}</a>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Medium Level Section */}
                <h3 className='level'>Medium Level:</h3>
                <ul className="level-list">
                  {image.mediumLevel.map((level, i) => (
                    <li key={i} className="level-item">
                      <div 
                        className="topic-title" 
                         onClick={() => toggleExpandTopic('mediumLevel', level.topic)}
                        >
                        <strong><FontAwesomeIcon icon={faHandPointRight} />&nbsp;&nbsp;{level.topic}</strong>
                          <FontAwesomeIcon icon={expandedTopics['mediumLevel' + level.topic] ? faAngleUp : faAngleDown} />
                    </div>
                      {expandedTopics['mediumLevel' + level.topic] && (
                        <div className="expanded-content">
                          <strong>Description:</strong> {level.descript}<br />
                          <strong>URL:</strong> <a href={level.url} target="_blank" rel="noopener noreferrer">{level.url}</a>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>

                {/* Hard Level Section */}
                <h3 className='level'>Hard Level:</h3>
                <ul className="level-list">
                  {image.hardLevel.map((level, i) => (
                    <li key={i} className="level-item">
                      <div 
                        className="topic-title" 
                         onClick={() => toggleExpandTopic('hardLevel', level.topic)}
                        >
                        <strong><FontAwesomeIcon icon={faHandPointRight} />&nbsp;&nbsp;{level.topic}</strong>
                          <FontAwesomeIcon icon={expandedTopics['hardLevel' + level.topic] ? faAngleUp : faAngleDown} />
                    </div>
                      {expandedTopics['hardLevel' + level.topic] && (
                        <div className="expanded-content">
                          <strong>Description:</strong> {level.descript}<br />
                          <strong>URL:</strong> <a href={level.url} target="_blank" rel="noopener noreferrer">{level.url}</a>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                </div>
                <button className="back-button" onClick={handleGoBack}>Go Back</button>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default UserLearning;