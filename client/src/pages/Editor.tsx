import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { announcementAPI } from "../services/api";
import { renderMarkdown } from "../utils/markdown";
import "./Editor.css";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (id) {
      fetchAnnouncement();
    }
  }, [id]);

  const previewHtml = renderMarkdown(content);

  const fetchAnnouncement = async () => {
    try {
      const response = await announcementAPI.getOne(id!);
      const { title, content, status } = response.data.announcement;
      setTitle(title);
      setContent(content);
      setStatus(status);
    } catch {
      setError("Failed to load announcement");
    }
  };

  const insertMarkdownSnippet = (
    prefix: string,
    suffix = "",
    placeholder = "text",
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end) || placeholder;
    const insertion = `${prefix}${selectedText}${suffix}`;
    const nextContent = `${content.slice(0, start)}${insertion}${content.slice(end)}`;

    setContent(nextContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorStart = start + prefix.length;
      const cursorEnd = cursorStart + selectedText.length;
      textarea.setSelectionRange(cursorStart, cursorEnd);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (id) {
        await announcementAPI.update(id, title, content, status);
      } else {
        await announcementAPI.create(title, content, status);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-container">
      <header className="editor-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Back
        </button>
        <h1>{id ? "Edit Announcement" : "Create Announcement"}</h1>
      </header>

      <main className="editor-main">
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              placeholder="Announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <div className="editor-toolbar">
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdownSnippet("**", "**", "bold")}
              >
                Bold
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdownSnippet("*", "*", "italic")}
              >
                Italic
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdownSnippet("# ", "", "Heading")}
              >
                Heading
              </button>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => insertMarkdownSnippet("- ", "", "item")}
              >
                Bullet
              </button>
            </div>
            <textarea
              id="content"
              ref={textareaRef}
              placeholder="Write your announcement here using Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={15}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div className="form-group">
            <label>Preview</label>
            <div
              className="markdown-preview"
              dangerouslySetInnerHTML={{
                __html:
                  previewHtml ||
                  "<p>Start typing to preview your announcement.</p>",
              }}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? "Saving..." : "Save Announcement"}
          </button>
        </form>
      </main>
    </div>
  );
}
