import React, { useState, useEffect } from 'react';
import { CATEGORIES, THEME } from './constants';
import { validateInput } from './utils/validationUtils';
import { showToast } from './utils/uiUtils';

const App = () => {
  const [votes, setVotes] = useState({});
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    // Fetch settings when component mounts
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/get-settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        console.error('Error loading settings:', error);
        // Use defaults if settings can't be loaded
        setSettings({
          dishesPerCategory: CATEGORIES.reduce((acc, category) => {
            acc[category] = {
              min: DEFAULT_MIN_DISH_COUNT,
              max: DEFAULT_MAX_DISH_COUNT
            };
            return acc;
          }, {})
        });
      }
    };

    loadSettings();
  }, []);

  const handleVoteChange = (category, index, value) => {
    const categoryVotes = votes[category] || ['', ''];
    const otherVotes = categoryVotes.filter((_, i) => i !== index);

    const validValue = validateInput(value, category, otherVotes, settings);
    
    setVotes(prev => ({
      ...prev,
      [category]: Object.assign([], categoryVotes, { [index]: validValue })
    }));
  };

  return (
    <div className="min-h-screen bg-[#2C0735] text-white p-4">
      <div id="toastContainer"></div>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-lobster text-[#E0144C] text-center mb-8">
          {THEME}
        </h1>

        {/* Instructions */}
        <div className="bg-white/10 rounded-lg border-2 border-[#FFD166] p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Voting Instructions</h2>
          <ul className="space-y-2">
            <li>For each category, select up to 2 of your favorite dishes.</li>
            <li>Enter the number associated with the dish in each category you want to vote for.</li>
            <li>You can select either one, two or no dishes per category.</li>
          </ul>
        </div>

        {/* Voting Forms */}
        <div className="space-y-6">
          {CATEGORIES.map((category) => (
            <div key={category} className="bg-white/10 rounded-lg border-2 border-[#FFD166] p-6">
              <h2 className="text-xl text-[#FFD166] font-bold mb-4">{category}</h2>
              <p className="mb-4">Enter the number of your favorite {category} dish (You can pick up to 2):</p>
              <div className="space-y-4">
                {[0, 1].map((index) => (
                  <input
                    key={`${category}-${index}`}
                    type="text"
                    value={(votes[category] || ['', ''])[index]}
                    onChange={(e) => handleVoteChange(category, index, e.target.value)}
                    className="vote-input w-full bg-[#4F1271] text-white border-2 border-[#FFD166] rounded-lg p-4 placeholder-[#D7C1FF]"
                    placeholder="e.g., 1"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={2}
                    data-category={category}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn-primary w-full bg-[#E0144C] text-white rounded-lg py-4 px-6 text-xl font-bold mt-8 hover:bg-[#FF1659] transition-colors"
          onClick={() => {/* Add submit handling */}}
        >
          Submit Your Votes
        </button>
      </div>
    </div>
  );
};

export default App;
