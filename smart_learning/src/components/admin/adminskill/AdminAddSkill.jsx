import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert, ListGroup, Spinner } from 'react-bootstrap';
import './AdminAddSkill.css'; // Import CSS for custom styling

const AdminAddSkill = () => {
  const [skill, setSkill] = useState('');
  const [skills, setSkills] = useState([]); // Array to store skills
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState(''); // For alert type (success or danger)
  const [loading, setLoading] = useState(false); // To show loading spinner during operations

  // Function to fetch skills from the server
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3001/skills'); // Fetch skills
      setSkills(response.data); // Store skills in the array
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch skills on component mount
  useEffect(() => {
    fetchSkills();
  }, []);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/adminskills', { skill });
      if (response.status === 201) {
        setMessage('Skill added successfully');
        setVariant('success');
        setSkill(''); // Clear the input field after success
        fetchSkills(); // Fetch updated skills after adding a new one
      }
    } catch (error) {
      console.error('Error adding skill:', error.response ? error.response.data : error.message);
      setMessage(error.response ? error.response.data.error : 'Error adding skill. Please try again.');
      setVariant('danger');
    }
  };

  // Function to handle skill deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/adminskills/${id}`);
      setMessage('Skill deleted successfully');
      setVariant('success');
      fetchSkills(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting skill:', error);
      setMessage('Error deleting skill. Please try again.');
      setVariant('danger');
    }
  };

  return (
    <Container className="admin-skill-container mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={6} className="admin-skill-col">
          <h3 className="text-center mb-4">Admin: Add New Skill</h3>
          <Form onSubmit={handleSubmit} className="admin-skill-form">
            <Form.Group controlId="formSkill">
              <Form.Label>Skill Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter skill name"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                required
                className="skill-input"
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100 add-skill-btn">
              Add Skill
            </Button>
          </Form>

          {message && (
            <Alert variant={variant} className="mt-3 text-center">
              {message}
            </Alert>
          )}

          <h4 className="mt-4">Added Skills:</h4>
          {loading ? (
            <Spinner animation="border" role="status" className="loading-spinner">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <ListGroup className="skill-list">
              {skills.map((s, index) => (
                <ListGroup.Item key={index} className="skill-item">
                  <span>{s.skill}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    className="deletes-btn"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default AdminAddSkill;
