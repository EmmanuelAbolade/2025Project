// File: src/components/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import { Container, ListGroup, Card, Form, Button, Spinner } from "react-bootstrap";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  getDocs,
  updateDoc, 
  getDoc 
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const ChatWindow = ({ currentUserId, senderLabel }) => {
  // State variables
  const [conversations, setConversations] = useState([]); // List of conversations for the user
  const [selectedConv, setSelectedConv] = useState(null); // Currently selected conversation
  const [messages, setMessages] = useState([]); // Messages in the selected conversation
  const [newMessage, setNewMessage] = useState(""); // Message input field value
  const [users, setUsers] = useState([]); // List of users for starting a conversation
  const [selectedUser, setSelectedUser] = useState(""); // Selected user to start a conversation with
  const [loadingMessages, setLoadingMessages] = useState(false); // Show a spinner while loading messages
  const messagesEndRef = useRef(null); // Auto-scroll reference for the chat window
  const [anonymousMode, setAnonymousMode] = useState(false); // Track anonymous mode state
  const [invisibleMode, setInvisibleMode] = useState(false); // Track Invisible Mode state
  const [currentUserProfilePic, setCurrentUserProfilePic] = useState(""); // State for profile picture
  const [unreadConversations, setUnreadConversations] = useState([]);


  // FETCH & FILTER CONVERSATIONS
  useEffect(() => {
    const convQuery = query(
      collection(db, "conversations"),
      where("members", "array-contains", currentUserId)
    );

    const unsubscribe = onSnapshot(convQuery, (snapshot) => {
      try {
        // Map the snapshot to an array of conversation objects
        const convList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("All Conversations:", convList);

        // Filter conversations that have a non-empty name
        const filteredConversations = convList.filter((conv) => {
          return conv.name && conv.name.trim() !== "";
        });
        console.log("Filtered Conversations:", filteredConversations);

        setConversations(filteredConversations);
      } catch (error) {
        console.error("Error processing conversations:", error);
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [currentUserId]);

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (selectedConv) {
      setLoadingMessages(true); // Show a spinner while loading
      const messagesRef = collection(db, "conversations", selectedConv.id, "messages");
      const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
      const unsubscribeMsgs = onSnapshot(messagesQuery, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs); // Update messages state
        setLoadingMessages(false); // Hide the spinner
      });
      return () => unsubscribeMsgs(); // Clean up Firestore listener when conversation changes
    } else {
      setMessages([]); // Clear messages if no conversation is selected
    }
  }, [selectedConv]);

  // Fetch all users for starting new conversations
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const userList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(userList.filter((user) => user.id !== currentUserId)); // Exclude the current user from the list
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  // Fetch the profile picture
  useEffect(() => {
    const fetchCurrentUserProfilePic = async () => {
      try {
        const userRef = doc(db, "users", currentUserId); // Reference to current user document
        const userSnap = await getDoc(userRef); // Fetch user data
        if (userSnap.exists()) {
          setCurrentUserProfilePic(userSnap.data().profilePic || "default-profile.png"); // Update state
        } else {
          console.error("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user profile picture:", error);
      }
    };
    fetchCurrentUserProfilePic(); 
  }, [currentUserId]);

  // Scroll to the bottom of the chat window when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);


  // Fetch unread conversations
  useEffect(() => {
    const unreadConvQuery = query(
      collection(db, "conversations"),
      where(`unread.${currentUserId}`, "==", true) // Check unread for the current user
    );
  
    const unsubscribeUnread = onSnapshot(unreadConvQuery, (snapshot) => {
      const unreadConvs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Unread Conversations:", unreadConvs);
  
      // Save the unread conversations in state
      setUnreadConversations(unreadConvs);
    });
  
    return () => unsubscribeUnread(); // Cleanup listener on unmount
  }, [currentUserId]);
  



  // Persist invisible mode
  useEffect(() => {
    const fetchInvisibleMode = async () => {
      try {
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setInvisibleMode(userSnap.data().isInvisible || false);
        }
      } catch (error) {
        console.error("Error fetching Invisible Mode:", error);
      }
    };
    fetchInvisibleMode();
  }, [currentUserId]);

  // START A NEW CONVERSATION
  const startConversation = async () => {
    if (!selectedUser) {
      console.error("No user selected for the conversation.");
      return;
    }
  
    try {
      // Query Firestore to find existing conversations
      const convQuery = query(
        collection(db, "conversations"),
        where("members", "array-contains", currentUserId)
      );
      const querySnapshot = await getDocs(convQuery);
  
      // Check if a conversation already exists
      const existingConversation = querySnapshot.docs.find((doc) => {
        const members = doc.data().members;
        return members.includes(selectedUser) && members.includes(currentUserId);
      });
  
      if (existingConversation) {
        console.log("Conversation already exists!");
        setSelectedConv({ id: existingConversation.id, ...existingConversation.data() });
        return;
      }
  
      // Fetch recipient's data
      const selectedUserData = users.find((user) => user.id === selectedUser);
      if (!selectedUserData) {
        console.error("Selected user not found in users list.");
        return;
      }
      // If no conversation exists, create a new one
      const members = [currentUserId, selectedUser];
      const conversationName = selectedUserData.name || "Unknown User";
  
      // Create a new conversation
      const newConversationRef = await addDoc(collection(db, "conversations"), {
        name: conversationName,
        members,
        profilePic: selectedUserData.profilePic || "default-profile.png",
        lastMessage: "",
        timestamp: serverTimestamp(),
      });
  
      console.log("Conversation created successfully!");
  
      // Update local state
      setSelectedConv({ id: newConversationRef.id, name: conversationName, members });
      setSelectedUser("");
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  
  //getting specific id for sender and receiver 
  const getSenderAndRecipient = (members, senderId) => {
    const senderIndex = members.indexOf(senderId);
    if (senderIndex === -1) {
      console.error("Sender ID not found in members array");
      return null;
    }
    const recipientIndex = senderIndex === 0 ? 1 : 0;
    return {
      senderId: members[senderIndex],
      recipientId: members[recipientIndex],
    };
  };
  

  // Toggle Anonymous Mode
  const handleToggleAnonymous = () => {
    setAnonymousMode((prevMode) => !prevMode); // Toggle anonymous mode
  };

  // Toggle Invisible Mode and update Firestore
  const handleToggleInvisible = async () => {
    const newMode = !invisibleMode; // Toggle Invisible Mode state
    setInvisibleMode(newMode);
    await updateInvisibleMode(newMode); // Persist the state in Firestore
  };

  // Update Invisible Mode in Firestore
  const updateInvisibleMode = async (newMode) => {
    const userRef = doc(db, "users", currentUserId);
    try {
      await updateDoc(userRef, { isInvisible: newMode });
      console.log(`Invisible Mode updated to: ${newMode}`);
    } catch (error) {
      console.error("Error updating Invisible Mode:", error);
    }
  };


  //handling send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
  
    // Validate: Ensure there’s a message to send and a selected conversation
    if (!newMessage.trim() || !selectedConv) return;
  
    const messagesRef = collection(db, "conversations", selectedConv.id, "messages");
  
    try {
      // Dynamically resolve sender and recipient
      const { senderId, recipientId } = getSenderAndRecipient(selectedConv.members, currentUserId);
  
      // Fetch sender and recipient details
      const senderDetails = users.find((user) => user.id === senderId);
      const recipientDetails = users.find((user) => user.id === recipientId);
  
      // Add the new message to the messages subcollection
      await addDoc(messagesRef, {
        senderId: invisibleMode ? null : currentUserId, // Omit senderId if Invisible Mode is active
        senderName: invisibleMode ? "Anonymous" : senderDetails?.name || "Unknown User", // Use resolved sender's name
        senderProfilePic: invisibleMode ? "default-profile.png" : senderDetails?.profilePic || "default-profile.png", // Use resolved sender's profile picture
        content: newMessage, // The actual message content
        timestamp: serverTimestamp(), // Timestamp of when the message is sent
      });
  
      // Update the conversation document: mark as unread for the recipient and set last message
      const convRef = doc(db, "conversations", selectedConv.id);
      await updateDoc(convRef, {
        [`unread.${recipientId}`]: true, // Mark the conversation as unread for the recipient
        lastMessage: newMessage, // Update the lastMessage field with the latest message
        timestamp: serverTimestamp(), // Update the conversation's timestamp
      });
  
      // Clear the input field
      setNewMessage("");
  
      console.log("Message sent and conversation updated successfully.");
    } catch (error) {
      console.error("Error sending message or updating conversation:", error);
    }
  };
  
  // Delete a message from the conversation
  const handleDeleteMessage = async (messageId) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        const messageRef = doc(db, "conversations", selectedConv.id, "messages", messageId);
        const messageDoc = await getDoc(messageRef); // Fetch the message document
        if (messageDoc.exists() && messageDoc.data().senderId === currentUserId) {
          await deleteDoc(messageRef);
          console.log("Message deleted successfully.");
        } else {
          alert("You can only delete your own messages.");
        }
      } catch (err) {
        console.error("Error deleting message:", err);
      }
    }
  };

  // Close chat
  const handleCloseChat = () => {
    setSelectedConv(null); // Deselect the conversation
  };

// to handle selection of conversation
const handleSelectConversation = async (conv) => {
  setSelectedConv(conv); // Set the selected conversation

  // Mark as read
  const convRef = doc(db, "conversations", conv.id);
  try {
    await updateDoc(convRef, {
      [`unread.${currentUserId}`]: false, // Mark as read for the current user
    });
    console.log(`Marked conversation ${conv.id} as read.`);
  } catch (error) {
    console.error("Error marking conversation as read:", error);
  }
};

  // UI Rendering
  return (
    <Container fluid className="mt-4">
      <h2 className="text-start fw-bold text-primary">💬 Messaging</h2>
  
      {/* Mode Toggles */}
      <div className="d-flex justify-content-between mb-5 mt-5">
        <Button variant="outline-warning fw-bold" onClick={handleToggleAnonymous}>
          {anonymousMode ? "🔓 Disable Anonymous Mode" : "🔒 Enable Anonymous Mode"}
        </Button>
        <Button variant="outline-warning fw-bold" onClick={handleToggleInvisible}>
          {invisibleMode ? "👁 Disable Invisible Mode" : "👤 Enable Invisible Mode"}
        </Button>
      </div>
  
      {/* Start a Conversation */}
      <Card className="shadow-lg border border-4 border-dark rounded p-4">
        <h3 className="fw-bold">🗨 Start a Conversation</h3>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="form-select mb-3"
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
        <Button variant="primary fw-bold" onClick={startConversation} className="w-100">
          Start 🚀
        </Button>
      </Card>
  
      {/* Unread Conversations */}
      <Card className="mt-4 shadow-lg border border-3 border-dark rounded p-4">
        <h3 className="fw-bold text-danger">🔔 Unread Conversations</h3>
        <ListGroup>
          {unreadConversations.map((conv) => (
            <ListGroup.Item key={conv.id} action onClick={() => handleSelectConversation(conv)}>
              <strong>{conv.name}</strong> <span className="badge bg-warning text-dark">Unread</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
  
      {/* Conversations List */}
      <Card className="mt-4 shadow-lg border border-3 border-dark rounded p-4">
        <h3 className="fw-bold text-success">📜 Conversations</h3>
        <ListGroup>
          {conversations.map((conv) => {
            const { recipientId } = getSenderAndRecipient(conv.members, currentUserId);
            const recipientDetails = users.find((user) => user.id === recipientId);
  
            return (
              <ListGroup.Item
                key={conv.id}
                action
                active={selectedConv && conv.id === selectedConv.id}
                onClick={() => handleSelectConversation(conv)}
              >
                <strong>{conv.name || recipientDetails?.name || "Unknown User"}</strong>
                {conv.unread?.[currentUserId] && <span className="badge bg-danger ms-2">Unread</span>}
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </Card>
  
      {/* Messages Section */}
      <Card className="mt-4 shadow-lg border border-3 border-dark rounded p-4">
        {selectedConv ? (
          <>
            <h4 className="fw-bold text-primary">💬 Chat with {selectedConv.name}</h4>
            <Button variant="secondary fw-bold mb-2" onClick={handleCloseChat}>❌ Close Chat</Button>
  
            {/* Chat Window */}
            <div className="chat-window p-3 bg-light rounded" style={{ height: "400px", overflowY: "auto" }}>
              {loadingMessages ? (
                <Spinner animation="border" variant="primary" />
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="chat-message mb-3 p-2 rounded bg-white shadow-sm">
                    <div className="d-flex align-items-center mb-2">
                      <img
                        src={msg.senderProfilePic || "default-profile.png"}
                        alt={`${msg.senderName}'s profile`}
                        className="rounded-circle me-2"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div>
                        <div className="fw-bold">{msg.sender || "Unknown User"}</div>
                        <div className="small text-muted">{msg.timestamp?.toDate ? new Date(msg.timestamp.toDate()).toLocaleString() : ""}</div>
                      </div>
                    </div>
                    <div>{msg.content}</div>
                    {msg.senderId === currentUserId && (
                      <Button variant="danger btn-sm mt-2" onClick={() => handleDeleteMessage(msg.id)}>🗑 Delete</Button>
                    )}
                  </div>
                ))
              )}
            </div>
  
            {/* Send Message Input */}
            <Form onSubmit={handleSendMessage} className="mt-3 d-flex">
              <Form.Control
                type="text"
                placeholder="✍️ Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <Button variant="primary fw-bold ms-2" type="submit">📩 Send</Button>
            </Form>
          </>
        ) : (
          <div className="text-center text-muted mt-5">
            <h4>👆 Select a conversation to start messaging.</h4>
          </div>
        )}
      </Card>
    </Container>
  );
};
  export default ChatWindow;