import { useState, useEffect } from 'react';
import { CATEGORIES, THEME } from './constants';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategories(CATEGORIES);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#2C0735] text-white p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-lobster text-[#E0144C] text-center mb-8">{THEME}</h1>
        
        <div className="bg-white/10 rounded-lg border-2 border-[#FFD166] p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Voting Instructions</h2>
          <ul className="space-y-2">
            <li>For each category, select up to 2 of your favorite dishes.</li>
            <li>Enter the number associated with the dish in each category you want to vote for.</li>
            <li>You can select either one, two or no dishes per category.</li>
          </ul>
        </div>

        {isLoading ? (
          <div id="loading-spinner" className="loading-spinner flex justify-center items-center py-8">
            <div className="spinner"></div>
          </div>
        ) : (
          <div id="categories" className="space-y-6">
            {categories.map((category) => (
              <div key={category} className="bg-white/10 rounded-lg border-2 border-[#FFD166] p-6">
                <h2 className="text-xl text-[#FFD166] font-bold mb-4">{category}</h2>
                <p className="mb-4">Enter the number of your favorite {category} dish (You can pick up to 2):</p>
                <div className="space-y-4">
                  {[1, 2].map((num) => (
                    // In your App.jsx where you have the input elements:
<input
  type="text"
  className="vote-input w-full bg-[#4F1271] text-white border-2 border-[#FFD166] rounded-lg p-4 placeholder-[#D7C1FF]"
  placeholder="e.g., 1"
  pattern="[0-9]*"
  inputMode="numeric"
  maxLength={2}
  data-category={category}
  onChange={(e) => {
    const validValue = validateInput(e.target.value, category, existingVotes);
    if (validValue !== undefined) {
      handleVoteChange(validValue);
    }
  }}
/>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <button id="submitVotes" className="btn-primary w-full bg-[#E0144C] text-white rounded-lg py-4 px-6 text-xl font-bold mt-8 hover:bg-[#FF1659] transition-colors">
          Submit Your Votes
        </button>
      </div>
      <div id="toastContainer"></div>
    </div>
  );
};

export default App;
