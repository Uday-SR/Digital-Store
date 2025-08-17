import { useState, useEffect, useRef } from 'react';
import bgimage from '../assets/bgimg.jpg';
import profileIcon from '../assets/profileIcon.png';
import searchIcon from '../assets/searchIcon.png';
import AuthForum from './AuthForum';
import '../App.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [query, setQuery] = useState('');

  const handleSearch = () => {
    alert(`Searching for: ${query}`);
  };

  const navigate = useNavigate();
  const handleAuth = () => {
    navigate("/AuthForum")
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className='container'>
      <img src="/bgimg.jpg" className="bg-img" alt="background" />
      <header className='header'>
        <div className='inheader'>
        <div className='rightNav'>
          <p>DigiStore</p>
        </div>

        <div className='leftNav'>

          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            
          </div>

          <h3>About</h3>
          <h3>Contact</h3>

          <div className="profile-section" ref={dropdownRef}>
            <img
              alt="Profile"
              className="profile-pic"
              onClick={() => setShowDropdown(!showDropdown)}
              src={profileIcon}
            />

            {showDropdown && (
              <div className="dropdown">
                <p>👤 Profile</p>
                <p>⚙️ Settings</p>
                <p>🚪 Logout</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </header>

      <main className='main'>
        <div className='intro-box'>
          <h1>Welcome to DigiStore</h1>
          <p>Your one-stop destination for digital courses, presets, and software.</p>
          <button className="explore-btn" onClick={handleAuth}>Explore</button>
        </div>

        <div className="content-preview">
          <h2>Popular Products</h2>
          <div className="product-grid">
            <div className="product-card">Course: React Basics</div>
            <div className="product-card">Preset Pack: Cinematic LUTs</div>
            <div className="product-card">Tool: SEO Analyzer</div>
          </div>
        </div>
      </main>  

      <footer className='footer'>
        <p>© 2025 Your Site</p>
      </footer>   
    </div>
  );
}

export default Home;
