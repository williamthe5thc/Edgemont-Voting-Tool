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
            if (onLoadComplete) {
              onLoadComplete();
            }
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
  const overlayHeight = 524.22 * (progress / 100);
  const overlayY = 524.22 - overlayHeight;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#2C0735]">
      <div className="max-w-xl w-full px-6 text-center">
        <p className="text-white mb-8 text-lg">
          Loading the Edgemont 1st Ward Dia de Los Ancestros Cooking Competition Voting Tool...
        </p>
        
        <div className="relative w-96 h-96 mx-auto mb-8">
          <svg 
            viewBox="0 0 344.94 524.22"
            className="w-full h-full"
            aria-label="Sugar Skull Loading Animation"
          >
            {/* Sugar Skull Main Path */}
            <path 
              fill="#FFFFFF"
              d="M331.53,187.7c-1.39-29.44-8.29-58.85-19.73-86.09-11.5-27.39-28.47-51.21-54.42-67.06C217.97,10.48,169.9,4.03,125.29,16.68c-19.2,5.44-36.41,16.19-50.95,29.51C31.85,85.09,19.19,135.42,16.39,190.54c-.72,14.22-4.37,34.56,5.6,46.6,10.22,12.35,35.05,16.84,49.5,22.32,20.83,7.9,41.19,22.3,48.51,43.97,6.09,18.03,4.16,39.17,1.59,57.67-.79,5.7-1.76,11.38-2.82,17.04,8.47.41,17.34,1.74,24.52,1.61,11.94-.22,23.87-.3,35.81.19,11.45.47,22.8.25,34.25-.07,5.04-.14,11.01-.81,16.68-.5-.4-4.94-.76-9.88-1.08-14.82-1.56-24.54-7.82-54.76,8.01-75.48,12.6-16.48,31.72-25.38,49.16-35.72,12.01-7.12,27.39-14.39,35.57-25.52,8.6-11.7,10.5-26.05,9.84-40.15Z"
            />
            {/* Decorative Details - copied from your SVG */}
            <path d="M284.05,158.21c6.86-2.2,13.12-7.05,12.39-13.58-1.15-10.27-11.64-12.93-20.54-10.75,6.88-3.51,10.14-13.57,6.33-20.01-3.56-6.01-12.84-4.91-18.71-1.16,2.74-6.79.39-16.64-4.82-20.62-7.32-5.59-16.95-.23-20.05,7.17-.46-.66-.96-1.25-1.5-1.72-2.48-2.16-7.43-3.38-10.55-2.48-5.28,1.52-8.39,7.97-6.16,13.06-4.96-3.8-12.6-4.68-16.3.84-4.22,6.3.48,13.58,6.23,18.4-5.41-.6-12.74.44-14.18,4.12-3.11,7.93,5.17,11.89,11.31,13.82-2.75.22-5.61,1.03-7.76,1.94-3.55,1.5-7.1,4.08-7.04,8.02.07,5.02,4.39,8.42,9.26,9.48-1.3.58-2.5,1.26-3.5,1.99-3.76,2.75-7.4,6.79-6.75,11.4,1.02,7.25,8.88,9.3,15.47,7.8-2.26,1.7-4.19,4.12-5.26,5.89-2.58,4.29-5.05,9.9-2.87,14.56,3.22,6.89,11.7,7.66,17.6,4.15-1.75,5.87-.32,13.46,3.72,16.71,6.74,5.43,15.31,1.45,18.34-5.31.81,2.29,2.12,4.46,3.47,6.03,3.25,3.77,8.34,6.89,13.25,5.34,7.22-2.27,8.2-10.4,6.19-17.09,6.65,4.35,16.78,5.53,19.91-2.18,1.34-3.32.35-8.45-2.07-12.44,5.09,1.48,10.34,1.16,12.5-3.57,2.75-6.04-1.5-13.64-7.47-17.45,6.31-.78,11.82-4.34,11.43-11.43-.39-7.11-5.77-10.42-11.86-10.95Z"/>
            
            {/* Add the rest of the decorative paths from your SVG */}
            
            {/* Progress overlay - this will cover the skull from bottom to top */}
            <rect
              x="0"
              y={overlayY}
              width="344.94"
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
