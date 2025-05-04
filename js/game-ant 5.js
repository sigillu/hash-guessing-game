// js/game.js
// Initialization for the lesson section
export function init_lesson() {
  const btn = document.getElementById('showGameBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      location.hash = '#/game1';
    });
  }
}
window.init_lesson = init_lesson;

// TODO: Paste your existing game logic (Game class, hashing functions, etc.) below.
