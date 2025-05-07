import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminsHome.css'; // Import your CSS file for styling
function AdminsHome() {
  const [stats, setStats] = useState({ users: 0, courses: 0, tests: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activity, setActivity] = useState([]); // State for activity data

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch counts
        const statsResponse = await axios.get('http://localhost:3001/admin/stats', { withCredentials: true });
        setStats(statsResponse.data);

        // Fetch users
        const usersResponse = await axios.get('http://localhost:3001/admin/users', { withCredentials: true });
        setUsers(usersResponse.data);

      } catch (err) {
        setError('Error loading data. Please try again.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:3001/admin/users/${userId}`, { withCredentials: true });
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  if (error) {
    return <div className="admin-error">{error}</div>;
  }

  return (
    <div className="admin-home-container">
      <h1>Welcome, Admin</h1>

      {/* Dashboard Statistics */}
      <div className="admin-stats">
        <h2>Dashboard Overview</h2>
        <p className="admin-description">
      This dashboard provides a quick overview of your system's performance. Here you can see 
      the total users, courses, and tests available. You can also manage user accounts directly 
      from this interface. 
    </p>
        <div className="stats-grid">
          <StatItem className="card-overview" label="Total Users" value={stats.users} />
          <StatItem className="card-overview" label="Total Courses" value={stats.courses} />
          <StatItem className="card-overview" label="Total Tests" value={stats.tests} />
        </div>
      </div>

        

      {/* User List */}
      <div className="admin-users">
        <h2>Registered Users</h2>
        {users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </div>
  );
}

// Reusable StatItem component for dashboard statistics
function StatItem({ label, value }) {
  return (
    <div className="stat-item">
      <h3>{label}</h3>
      <p>{value}</p>
    </div>
  );
}

export default AdminsHome;
