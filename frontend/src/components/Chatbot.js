import React, { useState } from 'react';
import './styles/Chatbot.css';
import Navbar from './Navbar';
import ChatApp from './ChatApp';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ChatBot = () => {
    const [messages, setMessages] = useState([
        {
            text: "👋 Hey there! Ready to explore some art? Which museum is calling your name today?",
            sender: "bot"
        }
    ]);
    const [userInput, setUserInput] = useState("");
    const [dbName, setDbName] = useState("");
    const [conversationStep, setConversationStep] = useState(1);
    const [bookingDate, setBookingDate] = useState(null);
    const [bookingTime, setBookingTime] = useState("");
    const [entryFee, setEntryFee] = useState(0);
    const [numTickets, setNumTickets] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [customerData, setCustomerData] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const suffix = day % 10 === 1 && day !== 11 ? 'st' :
                       day % 10 === 2 && day !== 12 ? 'nd' :
                       day % 10 === 3 && day !== 13 ? 'rd' : 'th';

        const formattedDate = `${day}${suffix} ${month}`;
        const formattedTime = `${hours % 12 || 12}:${minutes < 10 ? '0' : ''}${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
        return `${formattedDate}, ${formattedTime}`;
    };

    const handleUserInput = (e) => {
        setUserInput(e.target.value);
    };

    const handleSend = () => {
        if (userInput.trim() !== "" && conversationStep !== 2) {
            setMessages([...messages, { text: userInput, sender: "user" }]);

            if (conversationStep === 1) {
                setDbName(userInput.toLowerCase().replace(/\s+/g, '_'));
                fetchInfo(userInput.toLowerCase().replace(/\s+/g, '_'));
            } else if (conversationStep === 3) {
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
                    { text: `Awesome! That's $${total} for ${tickets} tickets. Ready to confirm and lock this in? (yes/no)`, sender: "bot" }
                ]);
            } else if (conversationStep === 4) {
                if (userInput.toLowerCase() === 'yes') {
                    saveCustomerData();
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: "✨ Fantastic! Your booking is confirmed. Get ready to explore some amazing art. Redirecting to payment...", sender: "bot" }
                    ]);
                    window.location.href = "https://razorpay.me/@nandani3570";
                } else {
                    setMessages(prevMessages => [
                        ...prevMessages,
                        { text: "No worries! I'm here if you need anything else. 😊", sender: "bot" }
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
                { text: "🗓️ Sweet! Let's pick a date and time for your visit:", sender: "bot", type: "interactive" }
            ]);

            setShowDatePicker(true);
            setConversationStep(2);
        } catch (error) {
            console.error("Error fetching info:", error);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Oops! I couldn't find that museum. Maybe try another one?", sender: "bot" }
            ]);
        }
    };

    const handleDateSelection = () => {
        if (bookingDate && bookingTime) {
            const formattedDate = formatDate(new Date(`${bookingDate.toDateString()} ${bookingTime}`));

            setMessages(prevMessages => [
                ...prevMessages,
                { text: `${formattedDate}.`, sender: "user" },
                { text: `You've selected ${formattedDate}. Great choice!`, sender: "bot" }
            ]);

            setCustomerData(prevData => ({
                ...prevData,
                bookingDateTime: formattedDate
            }));

            setShowDatePicker(false);
            setConversationStep(3);
            setMessages(prevMessages => [
                ...prevMessages,
                { text: `The entry fee is $${entryFee}. How many tickets are we grabbing today? 🎟️`, sender: "bot" }
            ]);
        } else {
            setMessages(prevMessages => [
                ...prevMessages,
                { text: "Don't forget to pick both a date and time!", sender: "bot" }
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
                { text: "Hmm, something went wrong while saving your booking. Let's try again.", sender: "bot" }
            ]);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

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
                <ChatApp
                    messages={messages}
                    showDatePicker={showDatePicker}
                    bookingDate={bookingDate}
                    handleDateChange={handleDateChange}
                    bookingTime={bookingTime}
                    handleTimeChange={handleTimeChange}
                    handleDateSelection={handleDateSelection}
                />
                <div className="chatbot-input">
                    {conversationStep !== 2 && (
                        <>
                            <input
                                type="text"
                                value={userInput}
                                onChange={handleUserInput}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message..."
                                disabled={conversationStep === 2}
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
