import { useState, useEffect, useRef } from 'react';
import bgimage from '../assets/bgimg.jpg';
import profileIcon from '../assets/profileIcon.png';
import searchIcon from '../assets/searchIcon.png';
import '../App.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthForum from './AuthForum'

function SignIn() {
  const [ firstName, setFirstName ] = useState("");
  const [ lastName, setLastName ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ role, setRole ] = useState("");
  const [ message, setMessage ] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!role) {
      setMessage("Please select a role.")
      return;
    }

    try {
      const endpoint = 
        role === "admin" ? "http://localhost:3000/api/v1/admin/signin"
                         : "http://localhost:3000/api/v1/user/signin";

        const res = await axios.post(endpoint, {
          email,
          password,
          firstName,
          lastName
        }, {
          headers: {
            "Content-Type": "application/json"
          }
        });
        
        setMessage(res.data.msg || "Sign in successful");

        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          navigate(role === "admin" ? "/AdminDash" : "/UserDash"); 
        } else {
          setMessage("Login failed: No token received.");
        };

    } catch (e) {
        setMessage(e.response?.data?.msg || "Signin failed. Please try again.");
    }
  };

  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/AuthForum")
  }

  return (
    <div className='container'>
      <img src="/bgimg.jpg" className="bg-img" alt="background" />
      <header className='header'>
        <div className='inheader'>
        <div className='rightNav'>
          <p>DigiStore</p>
        </div>

        <div className='leftNav'>
          <h3>About</h3>
          <h3>Contact</h3>
        </div>
        </div>
      </header>

      <main className='main auth-form'>
        <div className='form-box'>
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="First Name" className="form-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="text" placeholder="Last Name" className="form-input" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
            <input type="email" placeholder="Email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />

            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className="form-button">Sign In</button>
          </form>

          {message && <p style={{ marginTop: "10px" }}>{message}</p>}

          <h3>Don't have an account?</h3>
          <button className="form-button secondary" onClick={handleSignUp}>Sign Up</button>
        </div>
      </main>  

      <footer className='footer'>
        <p>© 2025 Your Site</p>
      </footer>    
    </div>
  );
}

export default SignIn;
