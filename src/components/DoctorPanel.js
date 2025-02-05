import '../App.css';
import { database } from "../firebaseConfig";
import { ref, set, get } from "firebase/database";
import { useState } from 'react';
import doctor from "../assets/doctor.png"

function DoctorPanel(doctorDetails){
    console.log(doctorDetails)
    const [patientData, setPatientData] = useState({
        patientName: "",
        patientAadhar: "",
        phoneNumber: "",
        age: "",
        address: "",
    });

    const [searchAadhar, setSearchAadhar] = useState("");
    const [searchedPatient, setSearchedPatient] = useState(null);
    const [error, setError] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });
    };

    // Handle patient registration
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!patientData.patientName) {
            alert("Patient Name is required!");
            return;
        }

        // Prepare patient data format
        const patientRecord = {
            name : patientData.name,
            age: patientData.age,
            contact: [patientData.address, patientData.phoneNumber],
            aadharNumber: patientData.patientAadhar,
            appointments: {}, // Empty initially, appointments will be added later
        };

        try {
            // Save to Firebase
            await set(ref(database, `Patients/${patientData.patientAadhar}`), patientRecord);
            alert("Patient Registered Successfully!");

            // Reset Form
            setPatientData({
                patientName: "",
                patientAadhar: "",
                phoneNumber: "",
                age: "",
                address: "",
            });
        } catch (error) {
            console.error("Error saving data:", error);
            alert("Error registering patient.");
        }
    };

    // Handle patient search
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchAadhar) {
            alert("Please enter an Aadhar number to search.");
            return;
        }

        try {
            const patientRef = ref(database, `Patients/${searchAadhar}`);
            const snapshot = await get(patientRef);

            if (snapshot.exists()) {
                setSearchedPatient(snapshot.val());
                setError("");
            } else {
                setSearchedPatient(null);
                setError("Patient not found.");
            }
        } catch (error) {
            console.error("Error searching patient:", error);
            setError("Error retrieving patient data.");
        }
    };

  return (
    <div className='doctor-info'>
        <div className='doc-container'>
            <div className='doc-image'>
                <img src={doctor} ></img>
            </div>
            <br></br>
            <p>Doctors Name</p>
            <p>Age</p>
            <p>Aadhar Number</p>
            <p>phone Number</p>
        </div>
        <div className='search-patience'>
            <div className='search-bar'>
                <form onSubmit={handleSearch}>
                <input type='text' placeholder='Enter Details' value={searchAadhar} onChange={(e) => setSearchAadhar(e.target.value)} required></input>
                <button type='submit'>Check</button>
                </form>
            </div>
            <div className='add-p'>
                
                <form onSubmit={handleSubmit}>
                    <label>Patient Name:</label>
                    <input type='text' placeholder='Name' name="patientName" value={patientData.patientName} onChange={handleChange} required ></input>
                    <label>Patient Aadhar:</label>
                    <input type='text'  name="patientAadhar"placeholder='Adhar' value={patientData.patientAadhar} onChange={handleChange}></input>
                    <label>Patient Mob Number:</label>
                    <input type='text' name="phoneNumber" placeholder='Phone number' value={patientData.phoneNumber} onChange={handleChange} required></input>
                    <label>Patient Age:</label>
                    <input type='text' name="age" placeholder='Age' value={patientData.age} onChange={handleChange} required ></input>
                    <label>Patient Contact:</label>
                    <input type='text' name="address" placeholder='Address' value={patientData.address} onChange={handleChange} required></input>
    
                    <button type='submit'>Register Patient</button>
                </form>
            </div>
        </div>
    </div>
  )
}

export default DoctorPanel