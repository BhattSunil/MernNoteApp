import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./NotesApp.css"; // Import CSS file

const socket = io("http://localhost:3000");

export default function NotesApp() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");

  // Active Users
  useEffect(() => {
    socket.on("activeUsers", (count) => setActiveUsers(count));
    return () => socket.off("activeUsers");
  }, []);

  // Fetch notes
  useEffect(() => {
    fetch("http://localhost:3000/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.log(err));
  }, []);

  // Socket events
  useEffect(() => {
    socket.on("noteCreated", (note) => setNotes((prev) => [...prev, note]));
    socket.on("noteUpdated", (updated) =>
      setNotes((prev) => prev.map((n) => (n._id === updated._id ? updated : n)))
    );
    socket.on("noteDeleted", (id) =>
      setNotes((prev) => prev.filter((n) => n._id !== id))
    );

    return () => {
      socket.off("noteCreated");
      socket.off("noteUpdated");
      socket.off("noteDeleted");
    };
  }, []);

  // Add note
  const addNote = async () => {
    if (!title.trim() || !content.trim()) return;
    await fetch("http://localhost:3000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    setTitle("");
    setContent("");
  };

  // Delete note
  const deleteNote = async (id) => {
    await fetch(`http://localhost:3000/notes/${id}`, { method: "DELETE" });
  };

  // Edit note
  const startEditing = (id, currentTitle, currentContent) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
    setEditingContent(currentContent);
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim() || !editingContent.trim()) return;
    await fetch(`http://localhost:3000/notes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editingTitle, content: editingContent }),
    });
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  return (
    <div className="notes-container">
      <h1 className="title">My Notes App</h1>

      {/* Active Users */}
      <div className="active-users">Active Users: {activeUsers}</div>

      {/* Add Note Section */}
      <div className="note-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Write Content Here"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
        />
        <button onClick={addNote}>Add Note</button>
      </div>

      {/* Notes List */}
      <ul className="notes-list">
        {notes.map((note) => (
          <li key={note._id} className="note-item">
       {editingId === note._id ? (
         <>
         <input
        value={editingTitle}
       onChange={(e) => setEditingTitle(e.target.value)}
        />
        <textarea
        value={editingContent}
         onChange={(e) => setEditingContent(e.target.value)}
         rows={3}
         />
      <button onClick={() => saveEdit(note._id)}>Save</button>
      <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
       <h3>{note.title}</h3>
        <p>{note.content}</p>
         <button
         onClick={() =>
       startEditing(note._id, note.title, note.content)
        }
         >
       Edit
      </button>
    <button onClick={() => deleteNote(note._id)}>Delete</button>
      </>
    )}
     </li>
     ))}
    </ul>
  </div>
  );
}
