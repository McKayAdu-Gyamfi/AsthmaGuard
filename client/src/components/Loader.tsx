import React, { useEffect, useState } from 'react';
import './Loader.css';

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  useEffect(() => {
    // Total animation time: 
    // logoFadeIn (1s) + delay (0.2s) + shieldGrow (2s) + buffer (0.3s) = 3.5s
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="loader-container">
      <div className="shield-background"></div>
      
      <div className="loader-content">
        <img 
          src="/favicon.png" 
          alt="AsthmaGuard Favicon" 
          className="loader-logo"
        />
        <h1 className="loader-text">AsthmaGuard</h1>
      </div>
    </div>
  );
};

export default Loader;
