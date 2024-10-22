import React, { useState, useEffect } from 'react';

const Preloader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev < 100 ? prev + 1 : prev;
        if (newProgress === 100) {
          setTimeout(() => {
            setShowLoader(false);
            onLoadComplete?.();
          }, 500);
          clearInterval(timer);
        }
        return newProgress;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onLoadComplete]);

  if (!showLoader) return null;

  // Calculate height of black overlay based on progress
  const overlayHeight = 200 * (1 - progress / 100);
  const overlayY = 200 - overlayHeight;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
      <div className="max-w-xl w-full px-6 text-center">
        <p className="text-white mb-8 text-lg">
          Loading the Edgemont 1st Ward Dia de Los Ancestros Cooking Competition Voting Tool...
        </p>
        
        <div className="relative w-96 h-96 mx-auto mb-8">
          <svg 
            viewBox="0 0 200 200" 
            className="w-full h-full"
          >
            {/* Base skull shape */}
            <path 
              fill="#FFFFFF" 
              stroke="#333333" 
              strokeWidth="2" 
              d="M100 40 C65 40, 40 70, 40 110 C40 150, 65 170, 100 170 C135 170, 160 150, 160 110 C160 70, 135 40, 100 40 Z"
            />

            {/* Flower crown */}
            <path 
              fill="#FF69B4" 
              d="M70 45 C65 35, 75 35, 80 45 C85 35, 95 35, 90 45 Z"
            />
            <path 
              fill="#66CCFF" 
              d="M100 35 C95 25, 105 25, 110 35 C115 25, 125 25, 120 35 Z"
            />
            <path 
              fill="#FFD700" 
              d="M130 45 C125 35, 135 35, 140 45 C145 35, 155 35, 150 45 Z"
            />

            {/* Eyes */}
            <circle cx="75" cy="95" r="15" fill="#333333"/>
            <circle cx="125" cy="95" r="15" fill="#333333"/>
            
            {/* Decorative circles around eyes */}
            <circle cx="75" cy="95" r="20" fill="none" stroke="#FF69B4" strokeWidth="2"/>
            <circle cx="125" cy="95" r="20" fill="none" stroke="#66CCFF" strokeWidth="2"/>

            {/* Heart nose */}
            <path 
              fill="#FF69B4" 
              d="M100 115 L95 125 Q100 130, 105 125 Z"
            />

            {/* Stitched mouth */}
            <path 
              fill="none" 
              stroke="#333333" 
              strokeWidth="2" 
              strokeDasharray="4,4" 
              d="M75 135 Q100 150, 125 135"
            />

            {/* Decorative dots */}
            <circle cx="65" cy="70" r="3" fill="#FFD700"/>
            <circle cx="135" cy="70" r="3" fill="#FFD700"/>
            <circle cx="85" cy="155" r="3" fill="#66CCFF"/>
            <circle cx="115" cy="155" r="3" fill="#66CCFF"/>

            {/* Swirls */}
            <path 
              fill="none" 
              stroke="#FF69B4" 
              strokeWidth="2" 
              d="M60 110 Q55 105, 60 100 Q65 105, 60 110 M140 110 Q145 105, 140 100 Q135 105, 140 110"
            />

            {/* Loading overlay */}
            <rect
              x="0"
              y={overlayY}
              width="200"
              height={overlayHeight}
              fill="black"
              className="transition-all duration-300"
            />
          </svg>
        </div>

        <div className="bg-purple-900/50 border border-yellow-400 rounded-lg p-6 mb-6">
          <h2 className="text-xl text-white mb-4">Voting Instructions</h2>
          <ul className="text-white text-left space-y-2">
            <li>For each category, select up to 2 of your favorite dishes.</li>
            <li>Enter the number associated with the dish in each category you want to vote for.</li>
            <li>You can select either one, two or no dishes per category.</li>
          </ul>
        </div>

        <p className="text-white font-medium">{progress}%</p>
      </div>
    </div>
  );
};

export default Preloader;
