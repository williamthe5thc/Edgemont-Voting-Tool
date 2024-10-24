// categoryLoader.js
export async function loadCategoriesProgressively(preloader) {
    console.log("Starting to load categories");
    if (categoriesLoaded) {
        console.log("Categories already loaded, skipping");
        return;
    }

    const categoriesContainer = document.getElementById('categories');
    
    if (!categoriesContainer) {
        console.error('Categories container not found');
        showToast('Error: Categories container not found', 'error');
        return;
    }

    categoriesContainer.innerHTML = '';

    try {
        console.log("Categories to load:", CATEGORIES);
        const totalCategories = CATEGORIES.length;
        
        for (let i = 0; i < CATEGORIES.length; i++) {
            const category = CATEGORIES[i];
            console.log(`Loading category: ${category}`);
            
            const categoryDiv = document.createElement('div');
            categoryDiv.classList.add('category');
            categoryDiv.innerHTML = `
                <h2>${category}</h2>
                <p>Enter the number of your favorite ${category} dish (You can pick up to 2):</p>
                ${Array(2).fill().map(() => `
                    <input type="text" 
                        class="vote-input" 
                        data-category="${category}" 
                        placeholder="e.g., 1" 
                        pattern="[0-9]*" 
                        inputmode="numeric"
                        maxlength="2">
                `).join('')}
                <div id="toastContainer-${category}" class="toast-container category-toast"></div>
            `;
            
            categoriesContainer.appendChild(categoryDiv);
            
            // Calculate and update progress
            const progress = ((i + 1) / totalCategories) * 100;
            if (preloader) {
                preloader.updateProgress(progress);
            }
            
            // Add a small delay between each category
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log("All categories loaded");
        categoriesLoaded = true;
    } catch (error) {
        console.error('Error loading categories:', error);
        showToast('Failed to load categories. Please refresh the page.', 'error');
    }
}
