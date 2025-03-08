import React, { useEffect } from 'react';
import '../css/Loader.css';

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="bouncing-loader">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>

            <style jsx>{`
            .loader-container {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
            }
    
            .bouncing-loader {
              display: flex;
              justify-content: center;
              gap: 10px;
            }
    
            .dot {
              width: 20px;
              height: 20px;
              border-radius: 50%;
              background-color:rgb(238, 162, 10);
              animation: bounce 0.6s infinite alternate;
            }
    
            .dot:nth-child(3) {
              animation-delay: 0.2s;
            }
    
            .dot:nth-child(4) {
              animation-delay: 0.4s;
            }
    
            @keyframes bounce {
              0% {
                transform: translateY(0);
              }
              100% {
                transform: translateY(-20px);
              }
            }
          `}</style>
        </div>
    );
};

export default Loader;
