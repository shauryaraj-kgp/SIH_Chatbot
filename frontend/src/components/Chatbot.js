import React, { useState } from 'react';
import './styles/Chatbot.css';
import Navbar from './Navbar';
import ChatApp from './ChatApp';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
    const [bookingDate, setBookingDate] = useState(null); // For storing selected date
    const [bookingTime, setBookingTime] = useState(""); // For storing selected time
    const [entryFee, setEntryFee] = useState(0);
    const [numTickets, setNumTickets] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [customerData, setCustomerData] = useState({});

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        if (userInput.trim() !== "" && conversationStep !== 2) {
            setMessages([...messages, { text: userInput, sender: "user" }]);

            if (conversationStep === 1) {
                // Step 1: Get museum name
                setDbName(userInput.toLowerCase().replace(/\s+/g, '_'));
                fetchInfo(userInput.toLowerCase().replace(/\s+/g, '_'));
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
                        { text: "Great! Your booking is confirmed. Redirecting to payment gateway...", sender: "bot" }
                    ]);
            
                    // Redirect to the Razorpay payment gateway link
                    window.location.href = "https://razorpay.me/@nandani3570";
                } else {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: "No problem. Let me know if you need anything else.", sender: "bot" }
                    ]);
                }
                setConversationStep(1); // Reset to the initial state
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

            // Ask for date and time selection
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Please select the date and time you'd like to visit:", sender: "bot" }
            ]);

            setConversationStep(2); // Step for date and time selection
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

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleDateSelection = () => {
        // Make sure both date and time are selected
        if (bookingDate && bookingTime) {
            // Update messages with selected date and time
            setMessages(prevMessages => [
                ...prevMessages,
                { text: `${bookingDate.toLocaleDateString()} at ${bookingTime}.`, sender: "user" }
            ]);
            setCustomerData(prevData => ({
                ...prevData,
                bookingDateTime: `${bookingDate.toLocaleDateString()} ${bookingTime}`
            }));
            setConversationStep(3); // Move to ticket purchase step
            setMessages(prevMessages => [
                ...prevMessages,
                { text: `The entry fee is $${entryFee}. How many tickets would you like to purchase?`, sender: "bot" }
            ]);
        } else {
            // Show a message prompting the user to select both
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Please select both a date and a time.", sender: "bot" }
            ]);
        }
    };

    // Time options for dropdown
    const timeOptions = [
        "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
    ];

    const handleDateChange = (date) => {
        setBookingDate(date);
    };

    const handleTimeChange = (e) => {
        setBookingTime(e.target.value);
    };

    return (
        <div className="chatbot-wrapper">
            <div className="chatbot-container">
                <Navbar />
                <ChatApp messages={messages} />
                <div className="chatbot-input">
                    {/* Conditionally render the date picker and time dropdown in the chat */}
                    {conversationStep === 2 ? (
                        <div className="bot-message">
                            <DatePicker
                                selected={bookingDate}
                                onChange={handleDateChange}
                                placeholderText="Select a date"
                                className="datepicker-input"
                            />
                            <select value={bookingTime} onChange={handleTimeChange} className="time-dropdown">
                                <option value="" disabled>Select a time</option>
                                {timeOptions.map((time, index) => (
                                    <option key={index} value={time}>{time}</option>
                                ))}
                            </select>
                            <button onClick={handleDateSelection}>Submit</button>
                        </div>

                    ) : (
                        <>
                            <input
                                type="text"
                                value={userInput}
                                onChange={handleUserInput}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
                                disabled={conversationStep === 2} // Disable input when in step 2
                            />
                            <button onClick={handleSend}>Send</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
