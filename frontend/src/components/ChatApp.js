// src/components/ChatApp.js

import React, { useState } from 'react';
import Message from './Message';
import './styles/ChatApp.css';

const ChatApp = () => {
    const [messages, setMessages] = useState([
        { text: "Hello, I’m FitBot! 👋 I’m your personal sport assistant. How can I help you?", sender: 'bot' },
        { text: "Book me a visit in a gym", sender: 'user' },
        { text: "Show me other options", sender: 'user' },
        { text: "Ok, how about these?", sender: 'bot' }
    ]);

    return (
        <div className="chat-app">
            {messages.map((msg, index) => (
                <Message key={index} text={msg.text} sender={msg.sender} />
            ))}
        </div>
    );
}

export default ChatApp;
