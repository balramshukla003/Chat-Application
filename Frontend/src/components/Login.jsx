import '../css/Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { FaRocketchat } from "react-icons/fa";
import { useAuth } from '../context/AuthProvider';

const Login = () => {

    const { authUser, setAuthUser, userLoggedIn, setUserLoggedIn } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const Navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const imageURL = "https://static.vecteezy.com/system/resources/previews/023/122/551/non_2x/mobile-chat-app-tiny-people-chatting-in-mobile-smartphone-and-big-speech-bubbles-online-communication-social-networking-messages-modern-flat-cartoon-style-illustration-on-white-background-vector.jpg";

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        setLoading(true);

        e.preventDefault();

        const data = {
            emailOrPhone,
            password,
        };

        try {
            const response = await fetch('http://localhost:5001/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();
            setLoading(false);

            if (response.ok) {
                setUserLoggedIn(true);
                console.log(result.user);
                setAuthUser(result.user);
                Navigate('/');
                localStorage.setItem('message_app_token', result.token);
            } else if (response.status === 404) {
                setError(result.error || 'No user found');
            } else if (response.status === 401) {
                setError(result.error || 'Invalid password');
            } else {
                setError(result.error || 'Invalid');
            }

        } catch (error) {
            setLoading(false);
            console.log('Error during login:', error);
            setError('There was an error with the login request.');
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
                                placeholder='Phone, username, or email'
                                value={emailOrPhone}
                                onChange={(e) => setEmailOrPhone(e.target.value)}
                            />
                        </label>
                        {/* <label>
                            <select
                                required
                                name="role"
                                className='dropdown'
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="" >Select your role</option>
                                <option value="Teacher">Teacher</option>
                                <option value="Student">Student</option>
                                <option value="Institute">Institute</option>
                            </select>
                        </label> */}
                        <label className="password-container">
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                placeholder='Enter password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    <button type="submit"
                        disabled={loading}
                    >{loading ? 'logging...' : 'Log In'}</button>
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
                        Navigate('/registration')
                    }}>
                        <span>New User? Register yourself</span>
                    </button>
                    <button onClick={() => alert("working on it..")}>Forgot password?</button>
                </div>
            </div>
        </div>
    );
};

export default Login;
