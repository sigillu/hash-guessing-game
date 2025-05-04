// js/game.js
import { initializeGame } from './logic.js';

// Initialization for the lesson section
export function init_lesson() {
  const btn = document.getElementById('showGameBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      location.hash = '#/game';
    });
  }
}
window.init_lesson = init_lesson;

// Initialization for the game section
export function init_game() {
  // Populate hash, clues, and set up game logic
  initializeGame();
}
window.init_game = init_game;
