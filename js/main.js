import { initializeGame, toggleDarkMode } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeGame();
    const toggleBtn = document.getElementById('darkModeToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleDarkMode);
    }
});
