// src/components/ChatBot.js

import React, { useState } from 'react';
import './styles/Chatbot.css';
import Navbar from './Navbar';
import ChatApp from './ChatApp';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        {
            text: "Hello, I'm ChatBot! 👋 I'm your personal assistant for today. Which museum would you like to visit?",
            sender: "bot"
        }
    ]);
    const [userInput, setUserInput] = useState("");
    const [dbName, setDbName] = useState("");
    const [conversationStep, setConversationStep] = useState(1);
    const [bookingDateTime, setBookingDateTime] = useState("");
    const [entryFee, setEntryFee] = useState(0);
    const [numTickets, setNumTickets] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [customerData, setCustomerData] = useState({});

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        if (userInput.trim() !== "") {
            setMessages([...messages, { text: userInput, sender: "user" }]);

            if (conversationStep === 1) {
                // Step 1: Get museum name
                setDbName(userInput);
                fetchInfo(userInput);
            } else if (conversationStep === 2) {
                // Step 2: Get booking date and time
                setBookingDateTime(userInput);
                setCustomerData(prevData => ({ ...prevData, bookingDateTime: userInput }));
                setConversationStep(3);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: `The entry fee is $${entryFee}. How many tickets would you like to purchase?`, sender: "bot" }
                ]);
            } else if (conversationStep === 3) {
                // Step 3: Get number of tickets
                const tickets = parseInt(userInput);
                setNumTickets(tickets);
                const total = tickets * entryFee;
                setTotalPrice(total);
                setCustomerData(prevData => ({
                    ...prevData,
                    numTickets: tickets,
                    totalPrice: total
                }));
                setConversationStep(4);
                setMessages(prevMessages => [
                    ...prevMessages,
                    { text: `The total price is $${total}. Would you like to proceed with the payment? (yes/no)`, sender: "bot" }
                ]);
            } else if (conversationStep === 4) {
                // Step 4: Confirm payment
                if (userInput.toLowerCase() === 'yes') {
                    saveCustomerData();
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: "Great! Your booking is confirmed.", sender: "bot" }
                    ]);
                } else {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: "No problem. Let me know if you need anything else.", sender: "bot" }
                    ]);
                }
                setConversationStep(1);
            }

            setUserInput("");
        }
    };

    const fetchInfo = async (dbName) => {
        try {
            const response = await fetch(`http://localhost:5000/getInfo/${dbName}`);
            const data = await response.json();

            if (data.length > 0) {
                const info = data[0];
                setEntryFee(info.adultPrice);
                setCustomerData(prevData => ({
                    ...prevData,
                    museumName: dbName,
                    entryFee: info.adultPrice
                }));
            }

            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Here are the details from the database:", sender: "bot" },
                ...data.map(info => ({
                    text: `Email: ${info.email}, Timings: ${info.timings}, Capacity: ${info.capacity}`,
                    sender: "bot"
                })),
                { text: "Please enter the date and time you'd like to visit.", sender: "bot" }
            ]);

            setConversationStep(2);
        } catch (error) {
            console.error("Error fetching info:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Sorry, I couldn't find that museum. Please try again.", sender: "bot" }
            ]);
        }
    };

    const saveCustomerData = async () => {
        try {
            const response = await fetch(`http://localhost:5000/saveBooking/${dbName}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });
            const data = await response.json();
            console.log("Booking saved:", data);
        } catch (error) {
            console.error("Error saving booking data:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "There was an error saving your booking. Please try again.", sender: "bot" }
            ]);
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
