import React from 'react';
import './styles/Message.css';
import BotImage from "./images/Bot.png";

const Message = ({ text, sender }) => {
    return (
        <div className={`message-container ${sender === 'bot' ? 'bot-message' : 'user-message'}`}>
            {sender === 'bot' && (
                <img src={BotImage} alt="Bot Avatar" className="message-avatar" />
            )}
            <div className="message-content">
                {text}
            </div>
        </div>
    );
}

export default Message;
