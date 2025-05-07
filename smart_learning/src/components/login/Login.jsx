import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaExclamationCircle, FaUser } from 'react-icons/fa';
import { useAuth } from '../../AuthContext';

function Login({ toggleSignup }) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");

  const onUserSignin = async (data) => {
    try {
      const { email, password } = data;
      const endpoint = "http://localhost:3001/login";
      const result = await axios.post(endpoint, { email, password });

      if (result.status === 200) {
        const user = result.data.user;
        login(user);
        user.role === 'admin' ? navigate("/adminhome") : navigate("/webhome");
      } else {
        console.log("Login failed:", result.data.error || "Unknown error");
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setLoginError("Invalid email or password.");
      } else {
        console.error("Login error:", err);
        setLoginError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div style={cardWrapperStyle}>
      <div style={cardStyle}>
        <h2 style={headerStyle}>
          <FaUser style={iconStyle} /> Sign In
        </h2>

        <form onSubmit={handleSubmit(onUserSignin)} style={{ width: '100%' }}>
          <div style={{ marginBottom: '15px' }}>
            <input
              type="email"
              placeholder="Your Email *"
              style={inputStyle}
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <span style={errorStyle}><FaExclamationCircle /> {errors.email.message}</span>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <input
              type="password"
              placeholder="Password *"
              style={inputStyle}
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && <span style={errorStyle}><FaExclamationCircle /> {errors.password.message}</span>}
          </div>

          {loginError && <div style={errorStyle}>{loginError}</div>}

          <button type="submit" style={submitButtonStyle}>Sign In</button>
        </form>

        <button onClick={toggleSignup} style={switchButtonStyle}>Sign Up</button>
      </div>
    </div>
  );
}

const cardWrapperStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30px', backgroundColor: '#f4f4f4' };
const cardStyle = { display: 'flex', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', padding: '40px', width: '350px', flexDirection: 'column', textAlign: 'center', margin: '20px' };
const headerStyle = { marginBottom: '20px', color: '#333' };
const iconStyle = { fontSize: '2.5rem', color: '#1e3c72' };
const inputStyle = { width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '5px' };
const errorStyle = { color: 'red', fontSize: '0.85rem', marginBottom: '15px' };
const submitButtonStyle = { width: '100%', padding: '12px', fontSize: '1.1rem', backgroundColor: '#1e3c72', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const switchButtonStyle = { marginTop: '20px', width: '100%', padding: '10px', fontSize: '1rem', backgroundColor: '#ccc', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default Login;