import '../css/ChatRoom.css';

import React, { useState, useEffect, useRef } from 'react';

import { FaRocketchat } from "react-icons/fa";
import { FiLogOut, FiSearch } from "react-icons/fi";
import { CgCloseR } from "react-icons/cg";

import { useAuth } from '../context/AuthProvider';

const ChatRoom = () => {
    const { authUser, setAuthUser, userLoggedIn, setUserLoggedIn } = useAuth();
    const [isToggled, setIsToggled] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const messagesEndRef = useRef(null);

    const imgurl = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/alluser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: authUser.email }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();
                console.log(data)
                setUsers(data.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchAllUsers();
    }, []);

    useEffect(() => {
        if (authUser && authUser.email) {
            setCurrentUser({ id: authUser.email, username: authUser.name });
        }
    }, [authUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (newMessage.trim() && selectedUser) {
            setMessages([...messages, { text: newMessage, isSent: true }]);
            setTimeout(() => {
                setMessages((prevMessages) => [...prevMessages, { text: 'This is response', isSent: false }]);
            }, 1000);
            setNewMessage('');
        }
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setMessages([]);
    };

    const handleLogout = () => {
        if (window.confirm("Are you sure you want to logout?")) {
            setUserLoggedIn(false);
            setAuthUser(null);
            localStorage.removeItem("message_app_token");
            window.location.reload();
        }
    };
    const disable = true

    return (
        <div className="outer-room">
            <div className="inner-room">
                <div className="room-header">
                    <h2><FaRocketchat color="blue" size={40} /> ChatApp</h2>
                    <div className="user-info">
                        <p>{currentUser ? currentUser.username : 'Guest'}</p>
                        <FiLogOut size={23} color="#333" cursor="pointer" onClick={handleLogout} />
                    </div>
                </div>

                <div className="chat-container">
                    <div className="user-area">
                        <div className="inputs">
                            <FiSearch size={20} color="#333" />
                            <input
                                type="text"
                                placeholder="search users"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <p className="active-user">
                            Show active users
                            <button
                                className={`toggle-button ${isToggled ? 'toggled' : ''}`}
                                onClick={() => setIsToggled(!isToggled)}
                            >
                                <div className={`toggle-circle ${isToggled ? 'circle-toggled' : ''}`}></div>
                            </button>
                        </p>

                        <div className="all-users">
                            {users
                                .filter((user) =>
                                    user.username.toLowerCase().includes(searchTerm.toLowerCase()) &&
                                    (isToggled ? user.activeuser : true)
                                )
                                .map((user, index) => (
                                    <div className="user" key={index} onClick={() => handleUserClick(user)}>
                                        <div className="profile">
                                            <img src={imgurl} alt="profile" />
                                        </div>
                                        <div className="details">
                                            <h3>{user.username}</h3>
                                            <p>{user.activeuser === 1 ? 'active' : 'offline'}</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    <div className="message-area">
                        <div className="message-area-nav">
                            {selectedUser ? (
                                <>
                                    <div className="active-chat-user">
                                        <img src={imgurl} alt="user" />
                                        <h3>{selectedUser.username}</h3>
                                    </div>
                                    <CgCloseR color='red' size={23} cursor="pointer" onClick={() => {
                                        setSelectedUser(null);
                                    }} />
                                </>
                            ) : (

                                <div className="active-chat-user">
                                    <img src={imgurl} alt="user" />
                                    <h3>No user</h3>
                                </div>

                            )}
                        </div>

                        <div className="messages">
                            {messages.map((message, index) => (
                                <div key={index} className={`message ${message.isSent ? 'sent' : 'received'}`}>
                                    {message.text}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>


                        <div className="message-input" >
                            < input
                                type="text"
                                placeholder="Type your message"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                disabled={!selectedUser}
                            />
                            <button onClick={handleSendMessage}
                                disabled={!selectedUser}>Send</button>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
