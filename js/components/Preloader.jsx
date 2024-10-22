import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../constants.js';
import { getSettings } from '../categoryLoader';
import { setDishesPerCategory } from '../voteSubmitter';

const Preloader = ({ onLoadComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('');

  useEffect(() => {
    const loadSequence = async () => {
      try {
        // Calculate progress increment per category
        const progressPerCategory = 100 / (CATEGORIES.length + 1); // +1 for initial settings load
        
        // Load settings first
        setCurrentCategory('Settings');
        console.log("Fetching settings");
        const settings = await getSettings();
        if (settings && settings.dishesPerCategory) {
          setDishesPerCategory(settings.dishesPerCategory);
        }
        setLoadingProgress(progressPerCategory);

        // Load categories progressively
        const categoriesContainer = document.getElementById('categories');
        if (!categoriesContainer) {
          throw new Error('Categories container not found');
        }
        
        categoriesContainer.innerHTML = '';

        // Load each category and update progress
        for (let i = 0; i < CATEGORIES.length; i++) {
          const category = CATEGORIES[i];
          setCurrentCategory(category);
          console.log(`Loading category: ${category}`);

          // Create category element
          const categoryDiv = document.createElement('div');
          categoryDiv.classList.add('category');
          categoryDiv.innerHTML = `
            <h2>${category}</h2>
            <p>Enter the number of your favorite ${category} dish (You can pick up to 2):</p>
            <div class="vote-inputs">
                ${Array(2).fill().map(() => `
                    <input type="text" 
                        class="vote-input" 
                        data-category="${category}" 
                        placeholder="e.g., 1" 
                        pattern="[0-9]*" 
                        inputmode="numeric"
                        maxlength="2">
                `).join('')}
            </div>
            <div id="toastContainer-${category}" class="toast-container category-toast"></div>
          `;
          
          categoriesContainer.appendChild(categoryDiv);
          
          // Update progress
          const currentProgress = (i + 2) * progressPerCategory;
          setLoadingProgress(currentProgress);
          
          // Add small delay for visual effect
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Ensure we reach 100%
        setLoadingProgress(100);
        
        // Small delay at 100% for visual completion
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setIsLoading(false);
        if (onLoadComplete) {
          onLoadComplete();
        }
      } catch (error) {
        console.error('Loading error:', error);
        setCurrentCategory('Error loading categories');
      }
    };

    loadSequence();
  }, [onLoadComplete]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(44,7,53,0.9)] flex flex-col items-center justify-center z-50">
      <div className={`w-[150px] h-[150px] ${loadingProgress === 0 ? 'animate-float' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="fillGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset={`${100-loadingProgress}%`} 
                    style={{stopColor: '#FFFFFF', stopOpacity: 1}} />
              <stop offset={`${100-loadingProgress}%`} 
                    style={{stopColor: '#FFFFFF', stopOpacity: 0.3}} />
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
          <path d="M70 90 C70 80 80 80 85 90 C90 80 100 80 100 90 C100 100 85 105 85 90 C85 105 70 100 70 90" 
                fill="#FFD166" opacity={loadingProgress > 20 ? 1 : 0} />
          <path d="M100 90 C100 80 110 80 115 90 C120 80 130 80 130 90 C130 100 115 105 115 90 C115 105 100 100 100 90" 
                fill="#FFD166" opacity={loadingProgress > 40 ? 1 : 0} />
          
          {/* Nose */}
          <path d="M95 110 L105 110 L100 120 Z" 
                fill="#FFD166" opacity={loadingProgress > 60 ? 1 : 0} />
          
          {/* Decorative patterns */}
          <circle cx="70" cy="70" r="10" 
                  fill="#E0144C" opacity={loadingProgress > 20 ? 1 : 0} />
          <circle cx="130" cy="70" r="10" 
                  fill="#E0144C" opacity={loadingProgress > 40 ? 1 : 0} />
          <circle cx="100" cy="140" r="8" 
                  fill="#E0144C" opacity={loadingProgress > 60 ? 1 : 0} />
          
          {/* Smile */}
          <path 
            d="M85 140 Q100 160 115 140" 
            fill="none" 
            stroke="#FFD166" 
            strokeWidth="3"
            opacity={loadingProgress > 80 ? 1 : 0}
          />
        </svg>
      </div>
      <div className="mt-5 font-lobster text-2xl text-white animate-pulse">
        Loading {currentCategory}... {Math.round(loadingProgress)}%
      </div>
    </div>
  );
};

export default Preloader;
