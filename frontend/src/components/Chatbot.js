import React, { useState, useEffect } from 'react';
import './styles/Chatbot.css';
import Navbar from './Navbar';
import ChatApp from './ChatApp';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        { text: "Hello, I'm FitBot! 👋 I'm your personal sport assistant. How can I help you?", sender: "bot" }
    ]);
    const [userInput, setUserInput] = useState("");
    const [dbName, setDbName] = useState(""); // Store the first input as dbName

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        if (userInput.trim() !== "") {
            setMessages([...messages, { text: userInput, sender: "user" }]);

            // Set dbName if it's the first message
            if (messages.length === 1) {
                setDbName(userInput);
                fetchInfo(userInput); // Fetch data when dbName is set
            }

            setUserInput("");
        }
    };

    const fetchInfo = async (dbName) => {
        try {
            const response = await fetch(`http://localhost:5000/getInfo/${dbName}`);
            const data = await response.json();
            // Add the fetched info to the chat
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "Here are the details from the database:", sender: "bot" },
                ...data.map(info => ({ text: `Show: ${info.showName}, Price: ${info.price}, Capacity: ${info.capacity}`, sender: "bot" }))
            ]);
        } catch (error) {
            console.error("Error fetching info:", error);
        }
    };

    return (
        <div className="chatbot-wrapper">
            <div className="chatbot-container">
                <Navbar />
                <ChatApp messages={messages} />
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
