import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { announcementAPI } from "../services/api";
import "./Dashboard.css";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  status: "draft" | "published";
  createdAt: string;
}

export default function Dashboard() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementAPI.getAll();
      setAnnouncements(response.data.announcements);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch announcements");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await announcementAPI.delete(id);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>{user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <button className="create-btn" onClick={() => navigate("/editor")}>
          + New Announcement
        </button>

        {error && <p className="error">{error}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : announcements.length === 0 ? (
          <p className="empty">No announcements yet</p>
        ) : (
          <div className="announcements-list">
            {announcements.map((ann) => (
              <div key={ann._id} className="announcement-card">
                <div className="card-header">
                  <h3>{ann.title}</h3>
                  <span className={`status ${ann.status}`}>{ann.status}</span>
                </div>
                <p className="preview">{ann.content.substring(0, 100)}...</p>
                <p className="date">
                  {new Date(ann.createdAt).toLocaleDateString()}
                </p>
                <div className="card-actions">
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/editor/${ann._id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(ann._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
