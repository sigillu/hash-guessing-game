// js/main.js
import './game.js';
import { initRouting } from './router.js';

// Dark mode toggle
const btn = document.getElementById('darkModeToggle');
btn?.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark);
  btn.textContent = isDark ? '☀️' : '🌗';
});

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    btn.textContent = '☀️';
  }
  initRouting();
});
