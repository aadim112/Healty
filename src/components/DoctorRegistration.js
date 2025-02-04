import React, { useState } from "react";
import { database } from "../firebaseConfig"; // Import Firebase database
import { ref, push } from "firebase/database";
import '../App.css';

function DoctorRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    phoneNumber: "",
    aadharNumber: "",
    education: "",
    password: "",
    confirmPassword: "", // ✅ Added confirmPassword field
    degreeFileName: "", // Store file path only
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const fileName = e.target.files[0]?.name;
    if (fileName) {
      setFormData({ ...formData, degreeFileName: `/assets/${fileName}` });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Password Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Save form data to Firebase
      await push(ref(database, "doctors/"), formData);

      alert("Doctor Registered Successfully!");

      // Reset form
      setFormData({
        fullName: "",
        age: "",
        phoneNumber: "",
        aadharNumber: "",
        education: "",
        password: "",
        confirmPassword: "", 
        degreeFileName: "",
      });

      document.getElementById("fileInput").value = ""; 
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="doctor-registration">
      <p>Create Doctor Profile</p>
      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input type="text" name="fullName" placeholder="Full name" value={formData.fullName} onChange={handleChange} required />

        <label>Age</label>
        <input type="text" name="age" placeholder="Age" value={formData.age} onChange={handleChange} required />

        <label>Phone Number</label>
        <input type="text" name="phoneNumber" placeholder="Contact" value={formData.phoneNumber} onChange={handleChange} required />

        <label>Aadhar Card Number</label>
        <input type="text" name="aadharNumber" placeholder="Aadhar Number" value={formData.aadharNumber} onChange={handleChange} required />

        <label>Education</label>
        <input type="text" name="education" placeholder="Education" value={formData.education} onChange={handleChange} required />

        <label>Upload your Degree (Save file manually in src/assets)</label>
        <input type="file" id="fileInput" className="file" onChange={handleFileChange} required />

        <label>Password</label>
        <input type="text" name="password" placeholder="password" value={formData.password} onChange={handleChange} required />

        <label>Confirm Password</label>
        <input type="text" name="confirmPassword" placeholder=" Confirm password" value={formData.confirmPassword} onChange={handleChange} required />
        <br></br>
        <button type="submit">Register Doctor</button>
      </form>
    </div>
  );
}

export default DoctorRegistration;
