
// formUtils.js

import { APP_CONFIG } from './configUtils.js';

/**
 * Serializes form data into an object
 * @param {HTMLFormElement} form - Form to serialize
 * @returns {Object} Serialized form data
 */
export function serializeForm(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

/**
 * Resets a form with optional default values
 * @param {HTMLFormElement} form - Form to reset
 * @param {Object} defaultValues - Default values to set
 */
export function resetForm(form, defaultValues = {}) {
    form.reset();
    
    Object.entries(defaultValues).forEach(([key, value]) => {
        const element = form.elements[key];
        if (element) {
            element.value = value;
        }
    });
}

/**
 * Validates a form field
 * @param {HTMLInputElement} field - Field to validate
 * @param {Array} rules - Validation rules
 * @returns {Array} Array of error messages
 */
export function validateFormField(field, rules) {
    const errors = [];
    
    rules.forEach(rule => {
        if (!rule.test(field.value)) {
            errors.push(rule.message);
        }
    });
    
    return errors;
}

/**
 * Disables or enables a form
 * @param {HTMLFormElement} form - Form to toggle
 * @param {boolean} disabled - Whether to disable the form
 */
export function toggleFormDisabled(form, disabled) {
    Array.from(form.elements).forEach(element => {
        element.disabled = disabled;
    });
}
