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

  // Calculate height and position of white overlay based on progress
  const overlayHeight = 200 * (progress / 100);
  const overlayY = 200 - overlayHeight;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#2C0735' }}>
      <div className="max-w-xl w-full px-6 text-center">
        <p className="text-white mb-8 text-lg">
          Loading the Edgemont 1st Ward Dia de Los Ancestros Cooking Competition Voting Tool...
        </p>
        
        <div className="relative w-96 h-96 mx-auto mb-8">
          <svg 
            viewBox="0 0 400 400" 
            className="w-full h-full"
          >
            <path 
              fill="#FFFFFF"
              d="M100 40C65 40 40 70 40 110C40 150 65 170 100 170C135 170 160 150 160 110C160 70 135 40 100 40ZM75 95C75 88.5 80.5 83 87 83C93.5 83 99 88.5 99 95C99 101.5 93.5 107 87 107C80.5 107 75 101.5 75 95ZM113 95C113 88.5 118.5 83 125 83C131.5 83 137 88.5 137 95C137 101.5 131.5 107 125 107C118.5 107 113 101.5 113 95ZM100 140C91.5 140 84.5 135 84.5 130C84.5 125 91.5 120 100 120C108.5 120 115.5 125 115.5 130C115.5 135 108.5 140 100 140Z"
            />
            <g fill="none" stroke="#FFD700" strokeWidth="2">
              <path d="M70 80C65 70 75 70 80 80" />
              <path d="M120 80C115 70 125 70 130 80" />
              <path d="M95 130Q100 140 105 130" />
            </g>
            <rect
              x="0"
              y={overlayY}
              width="400"
              height={overlayHeight}
              fill="white"
              className="transition-all duration-300"
            />
          </svg>
        </div>
        <p className="text-white font-medium">{progress}%</p>

        <div className="bg-purple-900/50 border border-yellow-400 rounded-lg p-6 mb-6">
          <h2 className="text-xl text-white mb-4">Voting Instructions</h2>
          <ul className="text-white text-left space-y-2">
            <li>For each category, select up to 2 of your favorite dishes.</li>
            <li>Enter the number associated with the dish in each category you want to vote for.</li>
            <li>You can select either one, two or no dishes per category.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
