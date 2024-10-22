// File: src/components/VotingInterface.jsx
import React, { useState, useEffect } from 'react';
import { CATEGORIES, THEME } from '../constants';

// [Previous VotingInterface component code remains the same]

// File: src/App.jsx
import React from 'react';
import VotingInterface from './components/VotingInterface';

const App = () => {
  return <VotingInterface />;
};

export default App;

// File: src/constants.js (make sure this exists)
export const CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrées & Soups'
];

export const THEME = "Dia de Los Ancestros";
