// js/main.js
import './game.js';           // ensure init_lesson and other initializers are registered
import { initRouting } from './router.js';

// Dark mode toggle
const btn = document.getElementById('darkModeToggle');
btn?.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark);
  btn.textContent = isDark ? '☀️' : '🌗';
});

// On DOMContentLoaded: restore dark mode and start routing
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    btn.textContent = '☀️';
  }
  console.log('DOM loaded, initializing routing');
  initRouting();
});
