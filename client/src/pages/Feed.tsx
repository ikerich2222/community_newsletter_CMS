import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { announcementAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { renderMarkdown } from "../utils/markdown";
import "./Feed.css";

interface Announcement {
  _id: string;
  title: string;
  content: string;
  author: { name: string };
  publishedAt: string;
}

export default function Feed() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await announcementAPI.getPublished();
      setAnnouncements(response.data.announcements);
    } catch (err: any) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feed-container">
      <header className="feed-header">
        <div className="header-content">
          <h1>Community Announcements</h1>
          {user && (
            <button
              className="dashboard-link"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </header>

      <main className="feed-main">
        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="loading">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="empty">No announcements published yet</p>
        ) : (
          <div className="announcements-feed">
            {announcements.map((ann) => (
              <article key={ann._id} className="announcement-item">
                <div className="item-header">
                  <h2>{ann.title}</h2>
                  <p className="author">By {ann.author.name}</p>
                </div>
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(ann.content),
                  }}
                />
                <p className="date">
                  {new Date(ann.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
