import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import { useState } from "react";
import { FaExclamationCircle, FaUser } from 'react-icons/fa';
import './Signup.css'; // Import the updated CSS file

function Signup({ toggleLogin }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const password = watch("password");

  const [emailError, setEmailError] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillLevel, setSkillLevel] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const skillOptions = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "Python", label: "Python" },
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Java", label: "Java" },
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleAddSkill = () => {
    if (selectedSkill && skillLevel) {
      setSelectedSkills([...selectedSkills, { skill: selectedSkill.value, level: skillLevel }]);
      setSelectedSkill(null);
      setSkillLevel("");
    }
  };

  const handleRemoveSkill = (index) => setSelectedSkills(selectedSkills.filter((_, i) => i !== index));

  const onUserRegister = (data) => {
    data.skills = selectedSkills;

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email.toLowerCase());
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    formData.append("study", data.study);
    formData.append("college", data.college);
    formData.append("skills", JSON.stringify(data.skills));
    formData.append("gender", data.gender);
    if (imageFile) formData.append("profileImage", imageFile);

    axios.post("http://localhost:3001/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then((result) => {
      if (result.status === 201) navigate("/login");
    }).catch((err) => {
      if (err.response?.status === 400) setEmailError("Email already exists.");
    });
  };

  return (
    <div className="flash-card-container">
      <form onSubmit={handleSubmit(onUserRegister)} className="flash-card">
      
        <div className="image-preview-container">
        <h2 style={{ marginBottom: '20px', color: '#333' }}>
            <FaUser style={{ fontSize: '2.5rem', color: '#1e3c72' }} /> 
            Sign Up
          </h2>
          {imagePreview ? (
            <img src={imagePreview} alt="Profile Preview" className="profile-image-preview" />
          ) : (
            <div className="default-image-preview">Profile Image</div>
          )}
          <input type="file" name="profileImage" accept="image/*" onChange={handleImageChange} />
        </div>

        <input
          name="name"
          type="text"
          placeholder="Name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <input
          name="study"
          type="text"
          placeholder="Study (e.g., Btech 3rd Year - CSE)"
          {...register("study", { required: "Study is required" })}
        />
        {errors.study && <p className="error">{errors.study.message}</p>}

        <input
          name="college"
          type="text"
          placeholder="College"
          {...register("college", { required: "College is required" })}
        />
        {errors.college && <p className="error">{errors.college.message}</p>}

        <input
          name="phone"
          type="text"
          placeholder="Phone"
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Invalid phone number"
            }
          })}
        />
        {errors.phone && <p className="error">{errors.phone.message}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: "Invalid email address"
            }
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
        {emailError && <p className="error">{emailError}</p>}

        <input
          name="password"
          type="password"
          placeholder="Password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 8, message: "Password must be at least 8 characters long" }
          })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <input
          name="confirmpassword"
          type="password"
          placeholder="Confirm Password"
          {...register("confirmpassword", {
            validate: (value) => value === password || "Passwords do not match"
          })}
        />
        {errors.confirmpassword && <p className="error">{errors.confirmpassword.message}</p>}

        <Select
          value={selectedSkill}
          onChange={setSelectedSkill}
          options={skillOptions}
          placeholder="Search and select a skill"
        />

        <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
          <option value="">Select Level</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <button type="button" onClick={handleAddSkill}>
          Add Skill
        </button>

        {selectedSkills.length > 0 && (
          <ul className="skill-list">
            {selectedSkills.map((skill, index) => (
              <li key={index}>
                {skill.skill} - {skill.level} 
                <button onClick={() => handleRemoveSkill(index)}>Remove</button>
              </li>
            ))}
          </ul>
        )}

        <button type="submit" className="submit-btn">Register</button>
        <button
          type="button"
          onClick={ toggleLogin } // Add this line to trigger switching
          style={{
            marginTop: '20px',
            width: '100%',
            padding: '10px',
            fontSize: '1rem',
            backgroundColor: '#ccc',
            color: '#333',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Signup;