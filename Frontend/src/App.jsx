import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { useAuth } from './context/AuthProvider.jsx';
import Login from './components/Login.jsx';
import Registration from './components/Registration.jsx';
import ChatRoom from './components/ChatRoom.jsx';
import Loader from './components/Loader.jsx';

function App() {

  const { userLoggedIn } = useAuth();

  useEffect(() => {
    if (!userLoggedIn) {
      setHome(<Login />);
    } else {
      setHome(<ChatRoom />);
    }
  }, [userLoggedIn]);

  const [home, setHome] = useState(<Login />);

  return (

    <Router>
      <Routes>
        <Route path="/" element={home} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </Router>

  );
}

export default App;
