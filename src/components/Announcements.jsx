import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const announcementsRef = collection(db, "announcements");
    const unsubscribe = onSnapshot(announcementsRef, (snapshot) => {
      const updates = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(updates);
    });

    return () => unsubscribe();
  }, []);

  const filteredAnnouncements = announcements.filter((announcement) =>
    announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mt-5">
      <h3 class= "text-start">Announcements</h3>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search announcements..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredAnnouncements.length > 0 ? (
        <ul className="list-group">
          {filteredAnnouncements.map((announcement) => (
            <li key={announcement.id} className="list-group-item">
              <strong>{announcement.title}</strong>
              <p>{announcement.message}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No announcements found.</p>
      )}
    </div>
  );
};

export default Announcements;
