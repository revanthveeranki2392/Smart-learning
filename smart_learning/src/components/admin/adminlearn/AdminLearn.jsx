      import React, { useEffect, useState } from 'react';
      import axios from 'axios';
      import './AdminLearn.css';

      const AdminLearn = () => {
        const [name, setName] = useState('');
        const [description, setDescription] = useState('');
        const [image, setImage] = useState(null); // Base64 image
        const [learnUrl, setLearnUrl] = useState('');
        const [easyLevel, setEasyLevel] = useState([{ topic: '', descript: '', url: '' }]);
        const [mediumLevel, setMediumLevel] = useState([{ topic: '', descript: '', url: '' }]);
        const [hardLevel, setHardLevel] = useState([{ topic: '', descript: '', url: '' }]);
        const [images, setImages] = useState([]); // Existing skills
        const [selectedSkill, setSelectedSkill] = useState(null); // For editing skills

        // Fetch skills on component mount
        useEffect(() => {
          const fetchSkills = async () => {
            try {
              const response = await fetch('http://localhost:3001/api/skills');
              const data = await response.json();
              if (response.ok) {
                setImages(data); // Set existing skills
              } else {
                console.error('Failed to fetch images:', data.error);
              }
            } catch (error) {
              console.error('Error fetching images:', error);
            }
          };
          fetchSkills();
        }, []);

        // Handle image upload and convert to Base64
        const handleFileChange = (e) => {
          const file = e.target.files[0]; // Get the selected file
        
          if (file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            // When the file reading is completed
            reader.onloadend = () => {
              setImage(reader.result); // Base64 encoded image
              console.log(reader.result); // Log the Base64 string here
            };
        
            // Handle file reading errors
            reader.onerror = () => {
              console.error('File reading error');
            };
          } else {
            console.error('No file selected');
          }
        };
        

        // Handle adding topics dynamically for each level
        const handleAddLevelItem = (level, setLevel) => {
          setLevel([...level, { topic: '', descript: '', url: '' }]);
        };

        const handleChangeLevel = (index, field, value, level, setLevel) => {
          const newLevel = [...level];
          newLevel[index][field] = value;
          setLevel(newLevel);
        };

        // Handle form submit for add/edit skill
        const handleSubmit = async (e) => {
          e.preventDefault();

          const data = {
            name,
            description,
            image, // base64 encoded image
            easyLevel,
            mediumLevel,
            hardLevel,
          };

          try {
            // Check if we're editing an existing skill or adding a new one
            const url = selectedSkill
              ? `http://localhost:3001/api/update-skill/${selectedSkill._id}` // PUT request URL for editing
              : 'http://localhost:3001/api/add-skill'; // POST request URL for adding

            const method = selectedSkill ? 'PUT' : 'POST'; // Use PUT for editing, POST for adding

            const res = await fetch(url, {
              method: method,
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            const result = await res.json(); // Always get the result for better handling

            if (!res.ok) {
              throw new Error(`${selectedSkill ? 'Failed to update' : 'Failed to add'} skill: ${result.message}`);
            }

            alert(result.message); // Notify the user of the success message
            resetForm(); // Reset the form on successful update/add
          } catch (error) {
            console.error(`${selectedSkill ? 'Error updating' : 'Error adding'} skill:`, error);
            alert(`${selectedSkill ? 'Error updating' : 'Error adding'} skill: ${error.message}`); // Show the error message
          }
        };

        // Reset form after submission or when editing is cancelled
        const resetForm = () => {
          setName('');
          setDescription('');
          setImage(null);
          setLearnUrl('');
          setEasyLevel([{ topic: '', descript: '', url: '' }]);
          setMediumLevel([{ topic: '', descript: '', url: '' }]);
          setHardLevel([{ topic: '', descript: '', url: '' }]);
          setSelectedSkill(null); // Clear selected skill for editing
        };

        // Delete a skill
        const handleDelete = async (imageId, indexToDelete) => {
          const userConfirmed = window.confirm('Are you sure you want to delete this skill?');
          if (userConfirmed) {
            try {
              await axios.delete(`http://localhost:3001/api/delete-skill/${imageId}`);
              const updatedImages = images.filter((_, index) => index !== indexToDelete);
              setImages(updatedImages);
            } catch (error) {
              console.error('Error deleting skill:', error);
              alert('Failed to delete the skill');
            }
          }
        };

        // Edit a skill (populate form with existing data)
        const handleEdit = (skill) => {
          setSelectedSkill(skill); // Set skill to be edited
          setName(skill.name);
          setDescription(skill.description);
          setLearnUrl(skill.learnUrl);
          setEasyLevel(skill.easyLevel);
          setMediumLevel(skill.mediumLevel);
          setHardLevel(skill.hardLevel);
        };

        return (
          <div>
            {/* Add/Edit Skill Form */}
            <div className="Learn-container">
              <form className="Learnskill-form" onSubmit={handleSubmit}>
                <h2>{selectedSkill ? 'Edit Course' : 'Add New Course'}</h2>
                <div className="Learnform-group">
                  <label>Skill Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Skill Name"
                    required
                  />
                </div>
                <div className="Learnform-group">
                  <label>Skill Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Skill Description"
                    rows="4"
                    required
                  />
                </div>
                <div className="Learnform-group">
                  <label>Skill Image</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} required={!selectedSkill} />
                </div>

                {/* Easy Level Inputs */}
                <h3>Easy Level Topics</h3>
                {easyLevel.map((item, index) => (
                  <div key={index} className="Learnform-group">
                    <input
                      type="text"
                      value={item.topic}
                      onChange={(e) => handleChangeLevel(index, 'topic', e.target.value, easyLevel, setEasyLevel)}
                      placeholder="Easy Level Topic"
                      required
                    />
                    <input
                      type="text"
                      value={item.descript}
                      onChange={(e) => handleChangeLevel(index, 'descript', e.target.value, easyLevel, setEasyLevel)}
                      placeholder="Description"
                      required
                    />
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => handleChangeLevel(index, 'url', e.target.value, easyLevel, setEasyLevel)}
                      placeholder="URL"
                      required
                    />
                  </div>
                ))}
                <button type="button" onClick={() => handleAddLevelItem(easyLevel, setEasyLevel)}>
                  Add Easy Level Topic
                </button>

                {/* Medium Level Inputs */}
                <h3>Medium Level Topics</h3>
                {mediumLevel.map((item, index) => (
                  <div key={index} className="Learnform-group">
                    <input
                      type="text"
                      value={item.topic}
                      onChange={(e) => handleChangeLevel(index, 'topic', e.target.value, mediumLevel, setMediumLevel)}
                      placeholder="Medium Level Topic"
                      required
                    />
                    <input
                      type="text"
                      value={item.descript}
                      onChange={(e) => handleChangeLevel(index, 'descript', e.target.value, mediumLevel, setMediumLevel)}
                      placeholder="Description"
                      required
                    />
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => handleChangeLevel(index, 'url', e.target.value, mediumLevel, setMediumLevel)}
                      placeholder="URL"
                      required
                    />
                  </div>
                ))}
                <button type="button" onClick={() => handleAddLevelItem(mediumLevel, setMediumLevel)}>
                  Add Medium Level Topic
                </button>

                {/* Hard Level Inputs */}
                <h3>Hard Level Topics</h3>
                {hardLevel.map((item, index) => (
                  <div key={index} className="Learnform-group">
                    <input
                      type="text"
                      value={item.topic}
                      onChange={(e) => handleChangeLevel(index, 'topic', e.target.value, hardLevel, setHardLevel)}
                      placeholder="Hard Level Topic"
                      required
                    />
                    <input
                      type="text"
                      value={item.descript}
                      onChange={(e) => handleChangeLevel(index, 'descript', e.target.value, hardLevel, setHardLevel)}
                      placeholder="Description"
                      required
                    />
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => handleChangeLevel(index, 'url', e.target.value, hardLevel, setHardLevel)}
                      placeholder="URL"
                      required
                    />
                  </div>
                ))}
                <button type="button" onClick={() => handleAddLevelItem(hardLevel, setHardLevel)}>
                  Add Hard Level Topic
                </button>

                <button type="submit" className="submit-button">
                  {selectedSkill ? 'Update Skill' : 'Add Skill'}
                </button>
              </form>
            </div>

            {/* Display existing skills */}
            <div className="existing-skills-container">
              <h2>Existing Skills</h2>
              {images.map((img, index) => (
                <div key={img._id} className="skill-card">
                  <img src={img.image} alt={img.name} />
                  <div className="skill-info">
                    <h3>{img.name}</h3>
                    <p>{img.description}</p>
                    <button onClick={() => handleEdit(img)}>Edit</button>
                    <button onClick={() => handleDelete(img._id, index)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      };

      export default AdminLearn;
