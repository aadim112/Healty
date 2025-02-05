import './App.css';
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { database } from "./firebaseConfig";
import { ref, get } from "firebase/database";
import DoctorRegistration from './components/DoctorRegistration';
import DoctorPanel from './components/DoctorPanel';
import logo from '../src/assets/logo.png'
import PatientDetails from './components/PatientDetails';

function App() {
  return (
  <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<DoctorRegistration />} />
      <Route path="/doctor-panel" element={<DoctorPanel/>} />
    </Routes>
  );
}

function Home(){
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  
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
        let doctorDetails = null;
  
        // ✅ Check both username (Phone/Aadhar) and password
        Object.entries(doctors).forEach(([key, doctor]) => {
          if (
            (doctor.phoneNumber === loginData.username || doctor.aadharNumber === loginData.username) &&
            doctor.password === loginData.password
          ) {
            foundDoctor = { id: key, ...doctor }; // Store doctor data with ID
            doctorDetails = {
              id: key, ...doctor}
          }
        });
  
        if (foundDoctor) {
          localStorage.setItem("loggedInDoctor", JSON.stringify(foundDoctor));
          alert("Login Successful! Welcome, " + foundDoctor.fullName);
          navigate("/doctor-panel",doctorDetails);
        } else {
          alert("Invalid credentials! Please try again.");
        }
      } else {
        alert("No registered doctors found.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Something went wrong. Try again!");
    }
  };
  
  return(
    <>
    <Routes>
        <Route path="/register" element={<DoctorRegistration />} />
        <Route path="/patent" element={<PatientDetails/>} />
        <Route path="/doctor-panel" element={<DoctorPanel/>} />
      </Routes>
    <header>
      <div className='logo'>
      <img src={logo}></img>
        <p>Wellivia</p>
      </div>
      <div className='nav-bar'>
        <a href='/register'><p>Doctors Register</p></a>
        <a href=''><p>Check Profile</p></a>
        <a href=''><p>Contact Us</p></a>
        <a href=''><p>Patient Details</p></a>
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
          <span style={{marginLeft:'20px',fontFamily:'poppins'}}>No account yet?</span><span><a href='/register'style={{fontFamily:'poppins',textDecoration:'none',marginLeft:'5px'}}>Signup</a></span>
        </div>
      </div>
    </div>
    <PatientDetails/>
    </>
  )
}
export default App;
