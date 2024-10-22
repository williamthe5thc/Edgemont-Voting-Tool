import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : prev));
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-900">
      <div className="mb-8 p-6 rounded-lg border border-yellow-400 bg-purple-900/50 text-white max-w-xl">
        <h2 className="text-xl mb-4">Voting Instructions</h2>
        <ul className="space-y-2">
          <li>For each category, select up to 2 of your favorite dishes.</li>
          <li>Enter the number associated with the dish in each category you want to vote for.</li>
          <li>You can select either one, two or no dishes per category.</li>
        </ul>
      </div>

      <div className="text-center">
        <div className="mb-4">
          <svg viewBox="0 0 100 100" className="w-32 h-32">
            {/* Base skull */}
            <circle cx="50" cy="50" r="45" fill="#f5f5f5" stroke="#FF4B6E" strokeWidth="2"/>
            
            {/* Decorative forehead pattern */}
            <path 
              d="M30 25 Q50 15 70 25" 
              fill="none" 
              stroke="#FF4B6E" 
              strokeWidth="2"
            />
            <circle cx="50" cy="22" r="3" fill="#FFD700"/>
            <circle cx="40" cy="24" r="2" fill="#FFD700"/>
            <circle cx="60" cy="24" r="2" fill="#FFD700"/>
            
            {/* Floral patterns */}
            <path 
              d="M20 40 Q25 35 20 30 Q25 35 30 30" 
              fill="none" 
              stroke="#FF4B6E" 
              strokeWidth="1.5"
            />
            <path 
              d="M80 40 Q75 35 80 30 Q75 35 70 30" 
              fill="none" 
              stroke="#FF4B6E" 
              strokeWidth="1.5"
            />
            
            {/* Eyes */}
            <path d="M35 45 L45 40 L45 50 Z" fill="#FF4B6E"/>
            <path d="M65 45 L55 40 L55 50 Z" fill="#FF4B6E"/>
            
            {/* Nose */}
            <path d="M47 50 L53 50 L50 55 Z" fill="#FFD700"/>
            
            {/* Smile with decorative teeth */}
            <path 
              d="M35 60 Q50 70 65 60" 
              fill="none" 
              stroke="#FF4B6E" 
              strokeWidth="2"
            />
            <rect x="43" y="59" width="4" height="4" fill="#FFD700"/>
            <rect x="48" y="60" width="4" height="4" fill="#FFD700"/>
            <rect x="53" y="59" width="4" height="4" fill="#FFD700"/>
            
            {/* Loading fill overlay */}
            <rect
              x="20"
              y={70 - (progress * 0.5)}
              width="60"
              height="60"
              fill="#purple-900"
              opacity="0.95"
            />
          </svg>
        </div>
        <div className="text-white font-medium">
          <p className="mb-2">Loading Categories...</p>
          <p>{progress}%</p>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
