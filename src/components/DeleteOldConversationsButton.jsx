// src/components/DeleteOldConversationsButton.jsx
import React, { useState } from "react";
import { collection, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const DeleteOldConversationsButton = ({ days, label }) => {
  const [statusMessage, setStatusMessage] = useState(""); // To display feedback

  const deleteConversations = async () => {
    // Display a confirmation dialog before proceeding
    if (!window.confirm(`Are you sure you want to delete conversations older than ${days} days?`)) {
      setStatusMessage("Operation cancelled.");
      return;
    }

    try {
      setStatusMessage("Deleting conversations..."); // Set loading status

      // Calculate the timestamp limit
      const now = new Date();
      const timestampLimit = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      console.log(`Deleting conversations older than ${timestampLimit.toISOString()}`);

      // Query Firestore to find conversations older than the given timestamp
      const convQuery = query(
        collection(db, "conversations"),
        where("timestamp", "<", timestampLimit)
      );
      const querySnapshot = await getDocs(convQuery);

      if (querySnapshot.empty) {
        setStatusMessage("No conversations found to delete.");
        console.log("No conversations found to delete.");
        return;
      }

      // Delete each conversation found
      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "conversations", docSnap.id))
      );
      await Promise.all(deletePromises);

      setStatusMessage(`Conversations older than ${days} days deleted successfully!`);
      console.log(`Conversations older than ${days} days deleted successfully!`);
    } catch (error) {
      console.error("Error deleting old conversations:", error);
      setStatusMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div style={{ margin: "10px 0" }}>
      <button
        onClick={deleteConversations}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          margin: "5px",
        }}
      >
        {label}
      </button>
      {/* Status Message */}
      {statusMessage && (
        <div
          style={{
            marginTop: "10px",
            color: statusMessage.includes("successfully") ? "green" : "red",
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default DeleteOldConversationsButton;
