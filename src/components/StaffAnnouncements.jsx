import React, { useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

const StaffAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const announcementsRef = collection(db, "announcements");

    const unsubscribe = onSnapshot(announcementsRef, (snapshot) => {
      const fetchedAnnouncements = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(fetchedAnnouncements);
    });

    return () => unsubscribe();
  }, []);

  const handlePostAnnouncement = async () => {
    try {
      if (!title || !message) return;

      await addDoc(collection(db, "announcements"), {
        title,
        message,
        timestamp: new Date(),
      });

      setTitle("");
      setMessage("");
      alert("Announcement posted!");
    } catch (error) {
      console.error("Error posting announcement:", error);
    }
  };

  return (
    <div className="mt-5">
      <h3>Post Announcements</h3>
      <div className="mb-3">
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Announcement Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-control mb-2"
          rows="4"
          placeholder="Announcement Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button className="btn btn-primary" onClick={handlePostAnnouncement}>
          Post Announcement
        </button>
      </div>
      <h3>Existing Announcements</h3>
      <div className="border rounded p-3 mb-3" style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {announcements.length > 0 ? (
          announcements.map((ann) => (
            <div key={ann.id} className="mb-2">
              <strong>{ann.title}</strong>
              <p>{ann.message}</p>
              <small className="text-muted">
                {new Date(ann.timestamp?.toDate()).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p>No announcements yet.</p>
        )}
      </div>
    </div>
  );
};

export default StaffAnnouncements;
