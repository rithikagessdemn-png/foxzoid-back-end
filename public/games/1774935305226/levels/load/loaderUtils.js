// Utility function to show betweenloader during navigation
function navigateWithLoader(targetPage) {
    const loaderPath = getLoaderPath();
    // Use href here to keep the source page in history (so back button works)
    window.location.href = `${loaderPath}?redirect=${encodeURIComponent(targetPage)}`;
}

// Helper function to get the correct path to betweenloader based on current location
function getLoaderPath() {
    const path = window.location.pathname;
    
    // If in levels folder (level1, level2, etc.)
    if (path.includes('/levels/level')) {
        return '../load/betweenloader.html';
    }
    // If in home_page or level_page
    else if (path.includes('/levels/home_page') || path.includes('/levels/level_page')) {
        return '../load/betweenloader.html';
    }
    // If in load folder
    else if (path.includes('/levels/load')) {
        return 'betweenloader.html';
    }
    // Default (from root)
    else {
        return 'levels/load/betweenloader.html';
    }
}

// Example usage:
// Instead of: window.location.href = "page.html";
// Use: navigateWithLoader("page.html");
