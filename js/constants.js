/**
 * constants.js
 * 
 * This file defines constant values used throughout the application.
 * Centralizing these constants ensures consistency across the application
 * and makes it easier to update competition details in the future.
 */
console.log("constants.js loading");

/**
 * CATEGORIES
 * 
 * An array of competition categories.
 * These categories are used to structure the voting process and results display.
 * Modifying this array will affect the entire application, including:
 * - The voting form structure
 * - The results calculation and display
 * - The admin settings interface
 */
export const CATEGORIES = [
    'Bread',
    'Appetizers',
    'Dessert',
    'Entrées & Soups'
];

export const DEFAULT_MIN_DISH_COUNT = 1;
export const DEFAULT_MAX_DISH_COUNT = 50;


/**
 * THEME
 * 
 * The theme of the cooking competition.
 * This constant is used in various places to display the competition name.
 * Changing this value will update the theme across the entire application.
 */
export const THEME = "Dia de Los Ancestros";
console.log("constants.js loaded");
