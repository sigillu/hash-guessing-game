// js/game.js
import { init_lesson, showGame } from './logic.js';

// Called when lesson partial loads
export function init_lesson_wrapper() {
  init_lesson();
}
window.init_lesson = init_lesson_wrapper;

// Called when game partial loads
export function init_game() {
  showGame();
}
window.init_game = init_game;
