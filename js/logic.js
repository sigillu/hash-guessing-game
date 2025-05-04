// js/logic.js
// Core game logic, with dynamic DOM queries performed inside functions

// --- Game Configuration ---
export const wordCategories = {
  drinks: ["water", "juice", "latte", "cider", "mocha", "tonic", "shake", "pepsi", "lager"],
};

// --- Full Quiz Question Pool ---
export const allQuizQuestions = [ /* ... your quiz data ... */ ];

// --- Bonus Game Config ---
export const bonusCountries = ["Argentina", "Brazil", "Canada", "Colombia", "Peru"];
export const bonusCorrectCountry = "Peru";

// --- Core Hashing Function ---
export async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// --- Helper to hide all sections ---
export function hideAllSections() {
  document.querySelectorAll(".section").forEach(el => el.classList.add("hidden"));
}

// --- Initialization (Lesson Page) ---
export function init_lesson() {
  const btn = document.getElementById("showGameBtn");
  if (btn) btn.addEventListener("click", () => location.hash = "#/game");
}

// --- Show Game Section ---
export async function showGame() {
  hideAllSections();
  const gameSection = document.getElementById("game");
  const container = document.getElementById("gameContainer");
  if (gameSection) gameSection.classList.remove("hidden");
  if (container) container.classList.remove("hidden");

  // Pick a secret word
  const words = wordCategories.drinks;
  const secretWord = words[Math.floor(Math.random() * words.length)];
  // Compute hash
  const targetHash = await hashString(secretWord);
  // Display in UI
  document.getElementById("hashDisplay").textContent = targetHash;
  document.getElementById("clue").textContent = `It's a drink, ${secretWord.length}-letter, lowercase.`;

  // Wire up guess button
  const input = document.getElementById("guessInput");
  const guessBtn = document.getElementById("submitGuessBtn");
  if (guessBtn && input) {
    guessBtn.onclick = async () => {
      const guess = input.value.trim().toLowerCase();
      if (!guess) return;
      const guessedHash = await hashString(guess);
      const resultDiv = document.getElementById("result");
      if (guess === secretWord) {
        resultDiv.innerHTML = `<div class='quiz-feedback correct'>✅ Correct! You found the word.</div>`;
      } else {
        resultDiv.innerHTML = `<div class='quiz-feedback incorrect'>❌ Nope. Try again.</div>`;
      }
    };
  }
}

// You can similarly export init_quiz, showQuiz, etc.
