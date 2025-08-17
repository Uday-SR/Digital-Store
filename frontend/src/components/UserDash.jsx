import { useState, useEffect, useRef } from 'react';
import profileIcon from '../assets/profileIcon.png';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UserDash() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState('');
  const [purchases, setPurchases] = useState([]);
  const [availableContent, setAvailableContent] = useState([]);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleAuth = () => {
    navigate("/AuthForum");
  };

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

  // Fetch purchases
  useEffect(() => {
    const fetchPurchases = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/AuthForum");
        return;
      }
      try {
        const res = await axios.get("http://localhost:3000/api/v1/user/purchases", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPurchases(res.data || []);
      } catch (err) {
        console.error("Error fetching purchases:", err);
        navigate("/AuthForum");
      }
    };
    fetchPurchases();
  }, [navigate]);

  // Fetch all available content
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/content/preview");
        setAvailableContent(res.data.content || []);
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };
    fetchContent();
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
                  <p onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/AuthForum");
                  }}>🚪 Logout</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className='main'>
        {/* 🔹 Replaced intro-box with content preview */}
        <div className="content-preview">
          <h2>Available Content</h2>
          <div className="product-grid">
            {availableContent.length > 0 ? (
              availableContent.map((item) => (
                <div key={item._id} className="product-card glow-hover">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt={item.title} className="product-img" />
                  )}
                  <h4>{item.title}</h4>
                  <p>{item.description}</p>
                  <p style={{ fontWeight: "bold" }}>₹{item.price}</p>
                  <button
                    className="buy-btn"
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      if (!token) {
                        navigate("/AuthForum");
                        return;
                      }
                      axios.post("http://localhost:3000/api/v1/content/purchase", {
                        contentId: item._id
                      }, {
                        headers: { Authorization: `Bearer ${token}` }
                      })
                        .then(() => alert("Purchase successful!"))
                        .catch(() => alert("Purchase failed."));
                    }}
                  >
                    Buy Now
                  </button>
                </div>
              ))
            ) : (
              <p>No content available.</p>
            )}
          </div>
        </div>

        <div className="content-preview">
          <h2>Your Purchases</h2>
          <div className="product-grid">
            {purchases.length > 0 ? (
              purchases.map((item) => (
                <div key={item._id} className="product-card glow-hover">
                  <img src={item.cover} alt={item.title} className="product-img" />
                  <h4>{item.title}</h4>
                </div>
              ))
            ) : (
              <p>You haven't purchased anything yet.</p>
            )}
          </div>
        </div>
      </main>

      <footer className='footer'>
        <p>© 2025 Your Site</p>
      </footer>
    </div>
  );
}

export default UserDash;
