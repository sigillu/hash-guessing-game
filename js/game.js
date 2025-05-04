// js/game.js
import { initializeGame } from './logic.js';

// Called when lesson partial loads
export function init_lesson() {
  const btn = document.getElementById('showGameBtn');
  if (btn) btn.addEventListener('click', () => location.hash = '#/game');
}
window.init_lesson = init_lesson;

// Called when game partial loads
export function init_game() {
  // Run the full initializeGame logic to populate UI
  initializeGame();
}
window.init_game = init_game;
