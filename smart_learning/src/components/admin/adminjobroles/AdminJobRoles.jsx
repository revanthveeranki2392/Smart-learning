import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Table } from 'react-bootstrap';
import './AdminJobRoles.css'; // Import custom CSS

const AdminJobRoles = () => {
  const [jobRoles, setJobRoles] = useState([]);
  const [newRole, setNewRole] = useState('');
  const [newSkills, setNewSkills] = useState('');
  const [editRoleId, setEditRoleId] = useState(null); // State to track which job role is being edited

  // Fetch existing job roles from the database
  useEffect(() => {
    axios.get('http://localhost:3001/api/jobroles')
      .then((response) => {
        setJobRoles(response.data);
      })
      .catch((error) => {
        console.error('Error fetching job roles:', error);
      });
  }, []);

  // Add or update job role
  const handleAddOrUpdateJobRole = () => {
    const roleData = {
      role: newRole,
      skills: newSkills.split(',').map((skill) => skill.trim()), // Convert CSV skills to an array
    };

    if (editRoleId) {
      // If we're editing an existing job role, send a PUT request to update it
      axios.put(`http://localhost:3001/api/jobroles/${editRoleId}`, roleData)
        .then((response) => {
          setJobRoles(jobRoles.map((role) => (role._id === editRoleId ? response.data : role)));
          setNewRole('');
          setNewSkills('');
          setEditRoleId(null); // Clear the edit state
        })
        .catch((error) => {
          console.error('Error updating job role:', error);
        });
    } else {
      // If not editing, send a POST request to add a new job role
      axios.post('http://localhost:3001/api/jobroles', roleData)
        .then((response) => {
          setJobRoles([...jobRoles, response.data]);
          setNewRole('');
          setNewSkills('');
        })
        .catch((error) => {
          console.error('Error adding job role:', error);
        });
    }
  };

  // Delete a job role
  const handleDeleteJobRole = (roleId) => {
    axios.delete(`http://localhost:3001/api/jobroles/${roleId}`)
      .then(() => {
        setJobRoles(jobRoles.filter((role) => role._id !== roleId));
      })
      .catch((error) => {
        console.error('Error deleting job role:', error);
      });
  };

  // Handle editing a job role
  const handleEditJobRole = (role) => {
    setNewRole(role.role);
    setNewSkills(role.skills.join(', '));
    setEditRoleId(role._id); // Set the ID of the job role being edited
  };

  return (
    <div className="admin-jobroles-container">
      <h2 className="text-center mb-4">Admin Panel - Manage Job Roles</h2>
      
      <Form className="jobrole-form">
        <Form.Group>
          <Form.Label>Job Role</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter job role (e.g., Developer)" 
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="custom-input"
          />
        </Form.Group>
        
        <Form.Group>
          <Form.Label>Skills (comma separated)</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter skills (e.g., JavaScript, HTML, CSS)" 
            value={newSkills}
            onChange={(e) => setNewSkills(e.target.value)}
            className="custom-input"
          />
        </Form.Group>
        
        <Button variant="primary" onClick={handleAddOrUpdateJobRole} className="custom-btn w-100">
          {editRoleId ? 'Update Job Role' : 'Add Job Role'}
        </Button>
      </Form>

      <Table striped bordered hover className="jobrole-table mt-4">
        <thead>
          <tr>
            <th>Job Role</th>
            <th>Skills</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobRoles.map((role) => (
            <tr key={role._id}>
              <td>{role.role}</td>
              <td>{role.skills.join(', ')}</td>
              <td>
                <div className="btn-group">
                  <Button 
                    variant="warning" 
                    className="custom-btn w-50 mr-2" 
                    onClick={() => handleEditJobRole(role)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    className="deletes-btn w-50" 
                    onClick={() => handleDeleteJobRole(role._id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default AdminJobRoles;
