import React, { useState, useEffect } from 'react';

const Preloader = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSequence = async () => {
      // Add your actual loading steps here
      const steps = [
        () => import('../constants.js'),
        () => import('../utils/apiUtils.js'),
        () => import('../utils/uiUtils.js'),
        () => import('../utils/storageUtils.js'),
        () => import('../utils/validationUtils.js')
      ];

      const totalSteps = steps.length;
      
      for (let i = 0; i < steps.length; i++) {
        try {
          await steps[i]();
          setProgress(((i + 1) / totalSteps) * 100);
        } catch (error) {
          console.error('Loading error:', error);
        }
      }
      
      // Ensure minimum display time of 1.5s
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
      
      // Call the onLoadComplete callback
      if (onLoadComplete) {
        onLoadComplete();
      }
    };

    loadSequence();
  }, [onLoadComplete]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(44,7,53,0.9)] flex flex-col items-center justify-center z-50">
      <div className="w-[150px] h-[150px] animate-float">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="fillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset={`${100-progress}%`} style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
              <stop offset={`${100-progress}%`} style={{stopColor: '#FFFFFF', stopOpacity: 0.3}} />
            </linearGradient>
          </defs>

          {/* Skull base */}
          <path 
            d="M100 30 C40 30 30 90 30 120 C30 150 60 180 100 180 C140 180 170 150 170 120 C170 90 160 30 100 30" 
            stroke="#FFFFFF" 
            strokeWidth="3" 
            fill="url(#fillGradient)" 
          />
          
          {/* Eyes */}
          <path d="M70 90 C70 80 80 80 85 90 C90 80 100 80 100 90 C100 100 85 105 85 90 C85 105 70 100 70 90" fill="#FFD166" />
          <path d="M100 90 C100 80 110 80 115 90 C120 80 130 80 130 90 C130 100 115 105 115 90 C115 105 100 100 100 90" fill="#FFD166" />
          
          {/* Nose */}
          <path d="M95 110 L105 110 L100 120 Z" fill="#FFD166" />
          
          {/* Decorative patterns */}
          <circle cx="70" cy="70" r="10" fill="#E0144C" opacity={progress > 20 ? 1 : 0} />
          <circle cx="130" cy="70" r="10" fill="#E0144C" opacity={progress > 40 ? 1 : 0} />
          <circle cx="100" cy="140" r="8" fill="#E0144C" opacity={progress > 60 ? 1 : 0} />
          
          {/* Smile */}
          <path 
            d="M85 140 Q100 160 115 140" 
            fill="none" 
            stroke="#FFD166" 
            strokeWidth="3"
            opacity={progress > 80 ? 1 : 0}
          />
        </svg>
      </div>
      <div className="mt-5 font-lobster text-2xl text-white animate-pulse">
        Loading categories... {Math.round(progress)}%
      </div>
    </div>
  );
};

export default Preloader;