// Get the theme toggle button
const toggleButton = document.getElementById('theme-toggle');

// Check localStorage for the saved theme preference
const savedTheme = localStorage.getItem('theme');

// If a theme is saved, apply it
if (savedTheme) {
    document.body.classList.add(savedTheme);  // Add saved theme class to body
    toggleButton.textContent = savedTheme === 'dark-mode' ? '☾' : '☀';
} else {
    // Default to light mode if no theme is saved
    localStorage.setItem('theme', 'light-mode');
}

// Add click event listener to the toggle button
toggleButton.addEventListener('click', () => {
    // Toggle the dark-mode class on the body
    document.body.classList.toggle('dark-mode');

    // Check if dark mode is enabled
    if (document.body.classList.contains('dark-mode')) {
        toggleButton.textContent = '☾';
        // Save the theme in localStorage
        localStorage.setItem('theme', 'dark-mode');
    } else {
        toggleButton.textContent = '☀';
        // Save the theme in localStorage
        localStorage.setItem('theme', 'light-mode');
    }
});
