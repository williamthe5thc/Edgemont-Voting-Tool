// File: js/components/Category.jsx

import React from 'react';

const Category = ({ category, votes, handleVoteChange }) => {
  return (
    <div className="category bg-white/10 rounded-lg border-2 border-[#FFD166] p-6">
      <h2 className="text-xl text-[#FFD166] font-bold mb-4">{category}</h2>
      <p className="mb-4">Enter up to two dish numbers that were your favorite:</p>
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
        {/* Toast messages will appear here */}
      </div>
    </div>
  );
};

export default Category;
