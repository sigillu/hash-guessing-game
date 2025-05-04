// js/game.js
// Initialization for the lesson section
export function init_lesson() {
  console.log('init_lesson called');
  const btn = document.getElementById('showGameBtn');
  if (btn) {
    console.log('showGameBtn found, attaching click handler');
    btn.addEventListener('click', () => {
      console.log('Start Game clicked, navigating to game section');
      location.hash = '#/game';
    });
  } else {
    console.warn('showGameBtn not found in lesson');
  }
}
window.init_lesson = init_lesson;

// TODO: Paste your existing game logic (Game class, hashing, etc.) below.
// For demonstration, also an init_game stub:
export function init_game() {
  console.log('init_game called');
  // Insert existing setup for game UI
}
window.init_game = init_game;
