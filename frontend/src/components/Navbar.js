import './styles//Navbar.css';
import React from 'react';
import BotImage from "./images/Bot.png"

const Navbar = () => {

    return (
        <div className="chatbot-header">
            <div className="navbar-left">
                <img src={BotImage} alt="" />
            </div>
            <div className="navbar-middle">
                <h2>Museum ChatBot</h2>
                <p>
                    <span className="online-dot"></span>
                    Always active
                </p>
            </div>
        </div>
    );
}

export default Navbar;