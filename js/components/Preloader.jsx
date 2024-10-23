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
  const overlayHeight = 524.22 * (progress / 100);  // This reveals from bottom up
  const overlayY = 524.22 - overlayHeight;          // This positions the reveal from the bottom

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#2C0735]">
      <div className="max-w-xl w-full px-6 text-center">
        <p className="text-white mb-8 text-lg">
          Loading the Edgemont 1st Ward Dia de Los Ancestros Cooking Competition Voting Tool...
        </p>
        
        <div className="relative w-96 h-96 mx-auto mb-8">
        <svg 
  xmlns="http://www.w3.org/2000/svg" 
  viewBox="0 0 344.94 524.22"
  className="w-full h-full"
>
  {/* 1. Dark gray base layer first */}
  <g>
    <path fill="#423837" d="M225.09.04c54.91-1.09,121.49,22.44,164,56.88,73.36,59.44,83.61,150.41,58.73,237.5-1.66,5.82-11.63,28.13-11.82,31.03-.23,3.53,8.83,20.93,9.6,28.07,4.78,44.11-41.45,56.68-75.72,62.42l-1.85,1.85c-1.52,25.56-3.15,55.49-26.23,71.29-44.66,30.57-172.12,29.55-218.67,2.95-28.22-16.13-29.25-44.73-31.4-74.24l-1.85-1.85c-35.61-5.46-82.33-19.86-74.98-65.38.94-5.81,8.97-22.33,8.86-25.12-.06-1.71-5.05-10.64-5.91-13.3C-9.09,229.07-11.43,140.28,52.59,73.54,93.76,30.62,165.72,1.22,225.09.04Z"/>
    <path fill="#423837" d="M228.78,302.92c5.24-.96,26.95,32.97,29.18,38.78,12.58,32.85-4.62,53.91-27.7,19.58-2.48-.26-21.1,31.52-30.66,12.19-10.53-21.3,15.07-55.7,29.18-70.55Z"/>
    <path fill="#423837" d="M127.57,175.86c84.1-7.39,89.99,123.4,11.08,132.23-98.98,11.08-97.92-124.6-11.08-132.23Z"/>
    <path fill="#423837" d="M319.64,175.86c85.06-8.35,108.38,122.48,22.9,132.23-94.34,10.76-103.61-124.31-22.9-132.23Z"/>
  </g>

  {/* 2. White reveal mask in the middle */}
  <defs>
    <clipPath id="mask-reveal">
      <rect x="0" y={overlayY} width="344.94" height={overlayHeight} />
    </clipPath>
  </defs>

  <g clipPath="url(#mask-reveal)">
    <path fill="white" d="M225.09.04c54.91-1.09,121.49,22.44,164,56.88,73.36,59.44,83.61,150.41,58.73,237.5-1.66,5.82-11.63,28.13-11.82,31.03-.23,3.53,8.83,20.93,9.6,28.07,4.78,44.11-41.45,56.68-75.72,62.42l-1.85,1.85c-1.52,25.56-3.15,55.49-26.23,71.29-44.66,30.57-172.12,29.55-218.67,2.95-28.22-16.13-29.25-44.73-31.4-74.24l-1.85-1.85c-35.61-5.46-82.33-19.86-74.98-65.38.94-5.81,8.97-22.33,8.86-25.12-.06-1.71-5.05-10.64-5.91-13.3C-9.09,229.07-11.43,140.28,52.59,73.54,93.76,30.62,165.72,1.22,225.09.04Z"/>
    <path fill="white" d="M228.78,302.92c5.24-.96,26.95,32.97,29.18,38.78,12.58,32.85-4.62,53.91-27.7,19.58-2.48-.26-21.1,31.52-30.66,12.19-10.53-21.3,15.07-55.7,29.18-70.55Z"/>
    <path fill="white" d="M127.57,175.86c84.1-7.39,89.99,123.4,11.08,132.23-98.98,11.08-97.92-124.6-11.08-132.23Z"/>
    <path fill="white" d="M319.64,175.86c85.06-8.35,108.38,122.48,22.9,132.23-94.34,10.76-103.61-124.31-22.9-132.23Z"/>
  </g>

  {/* 3. Colored decorative elements on top */}
  <g>
    {/* Orange elements */}
    <path fill="#faa631" d="M403.49,80.56c.95,1.01,1.98,1.87,2.95,2.95-12.44,23.35,6.6,52.57,32.5,50.97,3.23,7.87,5.99,15.38,8.13,23.64-4.6,24.8-39.56,20.92-34.72-6.28.31-1.75,7.18-18.36,6.28-18.84-4.96,2.34-6.66,9.99-9.97,13.67-15.16,16.83-40.14-.61-28.81-20.68,4.42-7.84,14.84-10.17,21.42-15.51-10.94-.33-32.35,5.72-36.94-8.86-8.27-26.33,22.71-25.53,39.15-21.05Z"/>
    <path fill="#faa631" d="M400.54,77.6c-10.24-3.23-28.78-7.84-25.12-22.16,9.4,6.92,16.95,13.9,25.12,22.16Z"/>
    <path fill="#faa631" d="M82.88,56.92c2.53,15.08-13.82,15.84-22.9,20.68,5.76-8.65,14.77-14.53,22.9-20.68Z"/>

    {/* Blue elements */}
    <path fill="#5ebec1" d="M433.04,121.93c-13.76,2.67-24.43-16.76-17.73-28.07,7.1,9.2,12.48,17.71,17.73,28.07Z"/>
    <path fill="#5ebec1" d="M26.74,121.93c5.5-10.87,10.9-19.31,18.47-28.81,5.71,11.46-5.1,31.58-18.47,28.81Z"/>
    <path fill="#5ebec1" d="M146.78,98.29c18.07-2.49,28.5,18.08,33.61,32.13.74,2.04,4.99,12.95,3.32,13.67-15.47-2.74-48.15-6.64-50.6-26.23-1.07-8.58,4.73-18.35,13.67-19.58Z"/>
    <path fill="#5ebec1" d="M306.35,98.29c17.05-1.99,25.64,14.5,16.62,28.44-7.3,11.28-34.24,15.13-46.91,17.36-1.55-.68.68-6.33,1.11-7.76,3.66-12.3,14.64-36.35,29.18-38.04Z"/>

    {/* Red elements */}
    <path fill="#f04f63" d="M211.79,138.18c8.03-.74,15.09,10.27,16.99,16.99,1.48.65,11.07-24.17,24.38-14.77,17.16,12.11-12.62,45.96-22.9,54.67-9.88-10.23-34.87-33.58-28.44-49.13.71-1.71,7.82-7.56,9.97-7.76Z"/>
    <path fill="#f04f63" d="M407.55,346.5c8.96-2.13,15.51,5.58,14.41,14.41-.46,3.65-10.76,20.33-13.67,21.05s-17.82-4.69-20.68-6.65c-17.83-12.21-.01-35.16,12.56-17.73.83-.12,1.79-9.75,7.39-11.08Z"/>
  </g>
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
