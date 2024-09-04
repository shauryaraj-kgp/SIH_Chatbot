// src/components/ChatBot.js

import React, { useState } from 'react';
import './styles/Chatbot.css'; // Import CSS file for styling
import Navbar from './Navbar';
import ChatApp from './ChatApp';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello, I'm FitBot! 👋 I'm your personal sport assistant. How can I help you?", sender: "bot" }
    ]);

    const [userInput, setUserInput] = useState("");

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        if (userInput.trim() !== "") {
            setMessages([...messages, { text: userInput, sender: "user" }]);
            setUserInput("");
        }
    };

    return (
        <div className="chatbot-wrapper">
            <div className="chatbot-container">
                <Navbar />
                <ChatApp />
                <div className="chatbot-input">
                    <input
                        type="text"
                        value={userInput}
                        onChange={handleUserInput}
                        placeholder="Type a message..."
                    />
                    <button onClick={handleSend}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
