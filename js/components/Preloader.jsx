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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <!-- Main skull shape -->
  <path fill="#FFFFFF" d="M300,200 C300,290 240,350 200,350 C160,350 100,290 100,200 C100,110 160,50 200,50 C240,50 300,110 300,200 Z"/>
  
  <!-- Eyes -->
  <circle cx="150" cy="175" r="30" fill="black"/>
  <circle cx="250" cy="175" r="30" fill="black"/>
  <circle cx="150" cy="175" r="10" fill="white"/>
  <circle cx="250" cy="175" r="10" fill="white"/>
  
  <!-- Nose -->
  <path fill="black" d="M190,200 L210,200 L200,230 Z"/>
  
  <!-- Decorative patterns -->
  <path fill="none" stroke="black" stroke-width="3" d="M160,120 C180,100 220,100 240,120"/>
  <path fill="none" stroke="black" stroke-width="3" d="M160,280 C180,300 220,300 240,280"/>
  
  <!-- Floral patterns -->
  <g transform="translate(120,100) scale(0.5)">
    <path fill="black" d="M0,0 C20,-20 40,-20 60,0 C40,20 20,20 0,0 Z"/>
  </g>
  <g transform="translate(280,100) scale(0.5) rotate(180)">
    <path fill="black" d="M0,0 C20,-20 40,-20 60,0 C40,20 20,20 0,0 Z"/>
  </g>
  
  <!-- Swirls -->
  <path fill="none" stroke="black" stroke-width="2" d="M100,150 C110,140 120,140 130,150"/>
  <path fill="none" stroke="black" stroke-width="2" d="M270,150 C280,140 290,140 300,150"/>
  
  <!-- Lower decoration -->
  <path fill="none" stroke="black" stroke-width="3" d="M180,260 C190,270 210,270 220,260"/>
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
