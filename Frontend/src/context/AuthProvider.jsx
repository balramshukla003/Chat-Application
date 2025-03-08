import React, { useState, createContext, useContext, useEffect } from 'react';
import Loader from '../components/Loader.jsx'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);
    const [authUser, setAuthUser] = useState({ email: "", name: "" });
    const [userLoggedIn, setUserLoggedIn] = useState(false);


    const token = localStorage.getItem("message_app_token");

    async function callProtectedEndpoint() {
        if (!token) {
            console.log("No token");
            return;
        }

        const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
        setLoading(true);

        try {
            const response = await fetch(`${backendURL}/api/protected`, {
                method: "POST",
                headers: {
                    "alg": "HS256",
                    "typ": "JWT",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.log(`Error: ${response.statusText}`);
                throw new Error(`Error: ${response.statusText}`);
            }

            const result = await response.json();

            if (result?.data) {
                const { name, email, phone } = result.data;
                setUserLoggedIn(true);
                console.log(`Token Data :  ${name} ${email} ${phone}`)
                setAuthUser({ name, email, phone });
            } else {
                console.log(result.message);
            }
        } catch (error) {
            console.error("Error calling protected endpoint:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log("CallProtectedEndPoint");
        callProtectedEndpoint();
    }, [userLoggedIn]);

    const Auth = {
        authUser,
        setAuthUser,
        userLoggedIn,
        setUserLoggedIn
    };


    if (loading) {
        return <Loader />;
    }


    return (
        <AuthContext.Provider value={Auth}>
            {children}
        </AuthContext.Provider>
    );
};


const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, useAuth };
