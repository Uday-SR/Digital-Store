import { useState, useEffect, useRef } from "react";
import axios from "axios";
import profileIcon from "../assets/profileIcon.png";
import "../App.css";
import { useNavigate } from "react-router-dom";

function AdminDash() {
  const [content, setContent] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [query, setQuery] = useState("");
  const [newContent, setNewContent] = useState({
    title: "",
    description: "",
    imageUrl: "",
    price: "",
  });
  const [editContent, setEditContent] = useState(null);

  const navigate = useNavigate();

  const fetchContent = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/AuthForum");
      return;
    }

    try {
      const res = await axios.get("http://localhost:3000/api/v1/admin/content/bulk", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContent(res.data.content || []);
    } catch (err) {
      console.error("Error fetching content:", err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

 
  const handleCreateContent = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/AuthForum");

    try {
      await axios.post("http://localhost:3000/api/v1/admin/content", {
        ...newContent,
        price: Number(newContent.price)
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Content created!");
      setNewContent({ title: "", description: "", imageUrl: "", price: "" });
      fetchContent();
    } catch (err) {
      console.error(err);
      alert("Error creating content!");
    }
  };


  const handleUpdateContent = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/AuthForum");

    try {
      await axios.put(
        "http://localhost:3000/api/v1/admin/content",
        { ...editContent, courseId: editContent._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Content updated!");
      setEditContent(null);
      fetchContent();
    } catch (err) {
      console.error(err);
      alert("Error updating content!");
    }
  };


  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/AuthForum");

    try {
      await axios.delete(`http://localhost:3000/api/v1/admin/content/:${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Content deleted!");
      fetchContent();
    } catch (err) {
      console.error(err);
      alert("Error deleting content!");
    }
  };

 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <div className="inheader">
          <div className="rightNav">
            <p>DigiStore</p>
          </div>

          <div className="leftNav">
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
                  <p
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/AuthForum");
                    }}
                  >
                    🚪 Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="main">
        {/* Form */}
        <div className="intro-box">
          <h2>{editContent ? "Update Content" : "Create New Content"}</h2>

          <input
            className="form-input"
            type="text"
            placeholder="Enter title"
            value={editContent ? editContent.title : newContent.title}
            onChange={(e) =>
              editContent
                ? setEditContent({ ...editContent, title: e.target.value })
                : setNewContent({ ...newContent, title: e.target.value })
            }
          />

          <textarea
            className="form-input"
            placeholder="Enter description"
            value={editContent ? editContent.description : newContent.description}
            onChange={(e) =>
              editContent
                ? setEditContent({
                    ...editContent,
                    description: e.target.value,
                  })
                : setNewContent({
                    ...newContent,
                    description: e.target.value,
                  })
            }
          />

          <input
            className="form-input"
            type="text"
            placeholder="Enter image URL"
            value={editContent ? editContent.imageUrl : newContent.imageUrl}
            onChange={(e) =>
              editContent
                ? setEditContent({ ...editContent, imageUrl: e.target.value })
                : setNewContent({ ...newContent, imageUrl: e.target.value })
            }
          />

          <input
            className="form-input"
            type="number"
            placeholder="Enter price"
            value={editContent ? editContent.price : newContent.price}
            onChange={(e) =>
              editContent
                ? setEditContent({ ...editContent, price: e.target.value })
                : setNewContent({ ...newContent, price: e.target.value })
            }
          />

          {editContent ? (
            <button className="form-button" onClick={handleUpdateContent}>
              Update
            </button>
          ) : (
            <button className="form-button" onClick={handleCreateContent}>
              Create
            </button>
          )}
        </div>

        {/* Content Preview */}
        <div className="content-preview">
          <h2>Your Content</h2>
          <div className="product-grid">
            {content.length > 0 ? (
              content.map((item) => (
                <div key={item._id} className="product-card">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: "100%", borderRadius: "6px" }}
                  />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p>
                    <strong>₹{item.price}</strong>
                  </p>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className="form-button secondary"
                      onClick={() => setEditContent(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="form-button"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No content available.</p>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2025 DigiStore</p>
      </footer>
    </div>
  );
}

export default AdminDash;
