// src/components/GuestMessages.jsx
import React from "react";
import ChatWindow from "./ChatWindow";

const GuestMessages = ({ currentUserId, senderLabel }) => {
  return (
    <ChatWindow currentUserId={currentUserId} 
    senderLabel={senderLabel} />
    //senderLabel="Guest" />
  );
};

export default GuestMessages;
