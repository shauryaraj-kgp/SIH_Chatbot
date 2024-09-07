import React from 'react';
import Message from './Message';
import './styles/ChatApp.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ChatApp = ({ messages, showDatePicker, bookingDate, handleDateChange, bookingTime, handleTimeChange, handleDateSelection }) => {
    return (
        <div className="chat-app">
            {messages.map((msg, index) => (
                <Message key={index} text={msg.text} sender={msg.sender} />
            ))}
            {showDatePicker && (
                <div className="bot-message">
                    <div className="bot-message-interactive">
                        <div className="bot-message-interactive-contents">
                            <DatePicker
                                selected={bookingDate}
                                onChange={handleDateChange}
                                placeholderText="Select a date"
                                className="datepicker-input"
                            />
                            <select value={bookingTime} onChange={handleTimeChange} className="time-dropdown">
                                <option value="" disabled>Select a time</option>
                                {["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"].map((time, index) => (
                                    <option key={index} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                        <button onClick={handleDateSelection}>Submit</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatApp;
