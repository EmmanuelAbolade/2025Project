// src/components/SelectUserToChat.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const SelectUserToChat = ({ currentUserId, onConversationStart }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList.filter((user) => user.id !== currentUserId)); // Exclude current user
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const handleStartConversation = async () => {
    if (!selectedUser) return;

    const members = [currentUserId, selectedUser]; // Add both users to conversation
    const conversationName = `Conversation-${currentUserId}-${selectedUser}`; // Unique name
    try {
      await addDoc(collection(db, "conversations"), {
        name: conversationName,
        members: members,
        lastMessage: "No messages yet...",
        timestamp: serverTimestamp(),
      });
      console.log("Conversation created successfully!");
      onConversationStart(); // Notify parent component
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div>
      <h3 class= "text-start">Start a Conversation</h3>
      <select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
      >
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>
      <button onClick={handleStartConversation}>Start Conversation</button>
    </div>
  );
};

export default SelectUserToChat;
