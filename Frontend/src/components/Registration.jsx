import '../css/Registration.css';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRocketchat } from "react-icons/fa";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { useAuth } from '../context/AuthProvider';

const Registration = () => {
    const { userLoggedIn } = useAuth();
    const [error, setError] = useState("");
    const Navigate = useNavigate();

    if (userLoggedIn) {
        Navigate('/');
    }

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        roleType: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const imageURL = "https://static.vecteezy.com/system/resources/previews/023/122/546/non_2x/mobile-chat-app-tiny-people-using-laptop-for-chatting-online-communication-social-networking-messages-speech-bubbles-modern-flat-cartoon-style-illustration-on-white-background-vector.jpg";

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            if (response.ok) {
                setError('Registration successful');
                navigate('/');
            } else {
                setError(data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="container">
            <div className="content">

                <div className="imageCont">
                    <FaRocketchat size={50} color="blue" />
                    <h1>Chat Application </h1>
                </div>
                <form className="content__form" onSubmit={handleSubmit}>
                    <div className="content__inputs">

                        <label>
                            <input
                                required
                                type="text"
                                name="username"  
                                placeholder="Enter your name"
                                value={formData.username}
                                onChange={handleInputChange}
                            />
                        </label>

                        <label>
                            <input
                                required
                                type="email"
                                name="email"
                                placeholder="Enter your email ID"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </label>

                        <label>
                            <input
                                required
                                type="tel"
                                name="phone"
                                placeholder="Enter your phone number"
                                value={formData.phone}
                                onChange={handleInputChange}
                            />
                        </label>

                        {/* <label>
                            <select
                                required
                                name="roleType"  
                                className='dropdown'
                                value={formData.roleType}
                                onChange={handleInputChange}
                            >
                                <option value="">Select your role</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>
                            </select>
                        </label> */}

                        <label className="password-container">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <p
                                type="button"
                                className="show-password-btn"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <IoEyeOutline /> : <IoEyeOffOutline />}
                            </p>
                        </label>

                    </div>
                    <button type="submit">Register</button>
                </form>
                <div className="error-div">
                    <p>{error}</p>
                </div>

                <div className="content__or-text">
                    <span></span>
                    <span>OR</span>
                    <span></span>
                </div>

                <div className="content__forgot-buttons">
                    <button onClick={() => {
                        navigate('/');
                    }}>
                        <span>Existing User? Login</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Registration;
