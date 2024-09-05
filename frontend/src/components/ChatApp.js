import React from 'react';
import Message from './Message';
import './styles/ChatApp.css';

const ChatApp = ({ messages }) => { // Receive messages as props
    return (
        <div className="chat-app">
            {messages.map((msg, index) => (
                <Message key={index} text={msg.text} sender={msg.sender} />
            ))}
        </div>
    );
}

export default ChatApp;
