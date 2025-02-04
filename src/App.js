import './App.css';
import React, { useState } from "react";
import { database } from "./firebaseConfig";
import { ref, get } from "firebase/database";
import DoctorRegistration from './components/DoctorRegistration';

function App() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      const doctorsRef = ref(database, "doctors/");
      const snapshot = await get(doctorsRef);

      if (snapshot.exists()) {
        const doctors = snapshot.val();
        let foundDoctor = null;

        // Check if the entered username (phone number/Aadhar) matches any doctor
        Object.values(doctors).forEach((doctor) => {
          if (doctor.phoneNumber === loginData.username || doctor.aadharNumber === loginData.username) {
            foundDoctor = doctor;
          }
        });

        if (foundDoctor) {
          alert("Login Successful! Welcome, " + foundDoctor.fullName);
        } else {
          alert("Doctor not found! Please check your details.");
        }
      } else {
        alert("No registered doctors found.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Something went wrong. Try again!");
    }
  };


  return (
  <>
  <header>
    <div className='logo'>
      <p>Healty</p>
      <i className="fa-solid fa-leaf fa-lg" style={{color:'white'}}></i>
    </div>
    <div className='nav-bar'>
      <p>Doctors Login</p>
      <p>Check Profile</p>
      <p>Contact Us</p>
    </div>
  </header>
  <div className='hero-section'>
    <div className='headings'>
      <p className='top-heading'>No-worries to keep maintain your doctors prescription and appointment date. </p>
      <p className='extra-info'> keep your appointment and medicine information online. No need to carry your medication all around.</p>
      <p className='extra-info'>Get all the information all over the world.</p>
    </div>
    <div className='doctor-login'>
      <div className='doctor-login-form'>
        <h2>Doctor's Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input type='text' name="username" placeholder='username' value={loginData.username} onChange={handleChange} required></input>
          <label>Password</label>
          <input type='password' name="password" placeholder='Password' value={loginData.password} onChange={handleChange} required></input>
          {error && <p className="error">{error}</p>}
          <button type='submit'>login</button>
        </form>
        <br></br>
        <span style={{marginLeft:'20px',fontFamily:'poppins'}}>No account yet?</span><span><a href='#'style={{fontFamily:'poppins',textDecoration:'none',marginLeft:'5px'}}>Signup</a></span>
      </div>
    </div>
  </div>
  <DoctorRegistration/>
  </>
  );
}

export default App;
