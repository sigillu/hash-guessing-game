// --- DOM Element References ---
const darkModeToggleBtn = document.getElementById("darkModeToggle");
const toast = document.getElementById("toast");

// View Containers
const mainMenu = document.getElementById("mainMenu");
const lessonSection = document.getElementById("lesson");
const gameSection = document.getElementById("game");
const quizSection = document.getElementById("quiz");
const summarySection = document.getElementById("summary");
const bonusGameSection = document.getElementById("bonusGame");
const hashToolSection = document.getElementById("hashTool"); // New

// Main Menu Elements
const mainMenuScoreDisplay = document.getElementById("mainMenuScoreDisplay");
const navLessonBtn = document.getElementById("navLesson");
const navGame1Btn = document.getElementById("navGame1");
const navGame2Btn = document.getElementById("navGame2");
const navQuizBtn = document.getElementById("navQuiz");
const navSummaryBtn = document.getElementById("navSummary");
const navHashToolBtn = document.getElementById("navHashTool");
const rateGameBtn = document.getElementById("rateGameBtn");
// cryptoMallLink is an <a> tag, no specific JS interaction needed unless tracked

// Lesson Elements (If needed, e.g., if dynamic content added later)
// ...

// Game 1 Elements
const hashDisplay = document.getElementById("hashDisplay");
const clueSpan = document.getElementById("clue");
const guessInput = document.getElementById("guessInput");
const submitGuessBtn = document.getElementById("submitGuessBtn");
const gameResultDiv = document.getElementById("result"); // Renamed to avoid conflict

// Quiz Elements
const quizQuestionElement = document.getElementById("quizQuestion");
const quizOptionsContainer = document.getElementById("quizOptions");
const quizResultDiv = document.getElementById("quizResult");
const quizCompletionProgressBar = document.getElementById("quizProgress");
const quizScoreProgressBar = document.getElementById("quizScoreBar");
const quizMainMenuBtn = quizSection?.querySelector('.main-menu-btn'); // Get button inside quiz section

// Summary Elements (If needed)
// ...

// Bonus Game Elements
const bonusTargetHashEl = document.getElementById("bonusTargetHash");
const bonusSelect = document.getElementById("bonusCountrySelect");
const bonusHashDisplay = document.getElementById("bonusHashDisplay");
const bonusResult = document.getElementById("bonusResult");
// Bonus guess options have inline onclick handlers for now

// Hash Tool Elements
const toolTextInput = document.getElementById("toolTextInput");
const generateHashesBtn = document.getElementById("generateHashesBtn");
const toolResultsDiv = document.getElementById("toolResults");


// --- Config ---
const wordCategories = {
  drinks: ["water", "juice", "latte", "cider", "mocha", "tonic", "shake", "pepsi", "lager"],
};
const allQuizQuestions = [ /* ... (Keep original questions array) ... */ ];
const bonusCountries = ["Argentina", "Brazil", "Canada", "Colombia", "Peru"];
const bonusCorrectCountry = "Peru";

// --- State Variables ---
let wordList = [];
let categoryLabel = '';
let secretWord = "";
let targetHash = "";
let attempts = 0;
// let score = 0; // Word guessing score - seems unused now? Consider removing if not displayed/used.
let streak = 0;
let lastQuizScorePercent = -1; // Stores the result of the last completed quiz
let bonusTargetHashValue = "";

// Quiz State (needed for confirmation logic)
let currentQuizQuestions = [];
let quizIndex = 0;
let correctAnswers = 0;
let numQuestions = 0; // Will be set in startQuiz

// --- Core Hashing Function ---
async function hashString(str) { /* ... (Keep original function) ... */ }
async function shaHash(input, algorithm) { /* ... (Keep original function) ... */ }

// --- Navigation Functions ---
const views = [mainMenu, lessonSection, gameSection, quizSection, summarySection, bonusGameSection, hashToolSection];

function hideAllViews() {
  console.log("Hiding all views...");
  views.forEach(view => {
    if (view) view.classList.add('hidden');
  });
}

function showView(viewId) {
  hideAllViews();
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.remove('hidden');
    console.log(`Showing view: ${viewId}`);
  } else {
    console.error(`View with ID ${viewId} not found!`);
  }
  window.scrollTo(0, 0);
}

function showMainMenu() {
  showView('mainMenu');
  updateMainMenuScoreDisplay(); // Update score when returning to main menu
}

// --- Main Menu Score Display ---
function updateMainMenuScoreDisplay() {
    if (!mainMenuScoreDisplay) return;

    let scoreMessage = "Complete the Quick Quiz to see your score!";
    let scoreClass = "";

    if (lastQuizScorePercent >= 66) {
        scoreMessage = `🎉🏆✨ Your latest quiz score was: <strong>${lastQuizScorePercent}%</strong> ✨🏆🎉`;
        scoreClass = "score-highlight"; // Add class for animation
    } else if (lastQuizScorePercent >= 0) {
        scoreMessage = `Your latest quiz score was: <strong>${lastQuizScorePercent}%</strong>`;
    } // Else: Use the default initial message

    mainMenuScoreDisplay.innerHTML = `<p>${scoreMessage}</p>`;
    // Apply/remove highlight class
    if (scoreClass) {
        mainMenuScoreDisplay.classList.add(scoreClass);
    } else {
        mainMenuScoreDisplay.classList.remove(scoreClass);
    }
}


// --- Game Initialization ---
async function initializeGame() {
  console.log("Initializing game (Alternative Version)...");
  // Basic Setup
  categoryLabel = 'Drinks';
  wordList = wordCategories.drinks;
  secretWord = wordList[Math.floor(Math.random() * wordList.length)];
  console.log("Secret word:", secretWord);

  // Calculate Bonus Hash
  bonusTargetHashValue = await hashString(bonusCorrectCountry);
  if (bonusTargetHashEl) bonusTargetHashEl.textContent = bonusTargetHashValue;

  // Dark Mode Init
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (darkModeToggleBtn) darkModeToggleBtn.textContent = '☀️';
  } else {
    if (darkModeToggleBtn) darkModeToggleBtn.textContent = '🌗';
  }

  // --- Setup Event Listeners ---

  // Dark Mode Toggle
  if (darkModeToggleBtn) darkModeToggleBtn.onclick = toggleDarkMode;

  // Main Menu Navigation
  if (navLessonBtn) navLessonBtn.onclick = () => showView('lesson');
  if (navGame1Btn) navGame1Btn.onclick = () => { showView('game'); prepareGame1(); }; // Prepare game when shown
  if (navGame2Btn) navGame2Btn.onclick = () => { showView('bonusGame'); prepareBonusGame(); }; // Prepare bonus game
  if (navQuizBtn) navQuizBtn.onclick = () => { showView('quiz'); startQuiz(); }; // Start quiz when shown
  if (navSummaryBtn) navSummaryBtn.onclick = () => showView('summary');
  if (navHashToolBtn) navHashToolBtn.onclick = () => { showView('hashTool'); prepareHashTool(); }; // Prepare tool

  // Footer Buttons
  if (rateGameBtn) rateGameBtn.onclick = () => showToast('Rating feature coming soon!', true);

  // "Main Menu" buttons within each section
  document.querySelectorAll('.main-menu-btn').forEach(button => {
      // Special handling for quiz button later
      if (!button.closest('#quiz')) {
           button.onclick = showMainMenu;
      }
  });

  // Game 1 Listeners
  if (submitGuessBtn) submitGuessBtn.onclick = checkGuess;
  if (guessInput) {
    guessInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") { event.preventDefault(); checkGuess(); }
    });
  }

  // Bonus Game Listener
  if (bonusSelect) bonusSelect.onchange = updateBonusHashDisplay;
  // Note: Bonus country guess buttons use inline onclick

  // Hash Tool Listener
  if (generateHashesBtn) generateHashesBtn.onclick = showToolHashes; // Use new function name potentially
   if (toolTextInput) {
       toolTextInput.addEventListener("keydown", function (e) {
         if (e.key === "Enter") { e.preventDefault(); showToolHashes(); }
       });
   }

  // Quiz "Main Menu" Button Listener (with confirmation)
  if (quizMainMenuBtn) {
      quizMainMenuBtn.addEventListener('click', () => {
          // Check if quiz is currently in progress
          if (quizIsInProgress()) {
              if (confirm("Are you sure you want to return to the Main Menu? Your current quiz progress will be lost.")) {
                  resetQuizState(); // Reset quiz variables
                  showMainMenu();
              } // else do nothing if cancelled
          } else {
              // Quiz is finished or wasn't started, navigate directly
              showMainMenu();
          }
      });
  }

  // --- Initial View ---
  showMainMenu(); // Start by showing the main menu
  console.log("Initialization complete.");
}

// --- Helper Functions ---
function shuffleArray(array) { /* ... (Keep original function) ... */ }
function showToast(message, isInfo = false) { /* ... (Keep original function, ensure toast element exists) ... */ }
function copyToClipboard(elementId) { /* ... (Keep original, ensure it works with new toolResultsDiv IDs if changed) ... */ }
function fallbackCopyToClipboard(text, elementId) { /* ... (Keep original) ... */ }
function showCopiedMessage(elementId) { /* ... (Keep original) ... */ }

// --- Dark Mode ---
function toggleDarkMode() { /* ... (Keep original function) ... */ }

// --- Game 1 (Guess the Word) Logic ---
async function prepareGame1() {
    // Prepare game state when showing the section
    console.log("Preparing Game 1...");
    targetHash = await hashString(secretWord);
    if (hashDisplay) hashDisplay.textContent = targetHash;
    if (clueSpan) {
        clueSpan.innerHTML = `It's a drink, a ${secretWord.length}-letter word, lowercase only.`; // Reset hints
    }
    attempts = 0;
    streak = 0; // Reset streak for the game session
    if (gameResultDiv) gameResultDiv.innerHTML = "";
    if (guessInput) {
        guessInput.value = "";
        guessInput.disabled = false;
        guessInput.focus();
    }
    if (submitGuessBtn) submitGuessBtn.disabled = false;
    // Removed nextStep logic
}
async function checkGuess() { /* ... (Keep original logic BUT remove navigation buttons like goToQuizBtn/nextStep) ... */
    const input = document.getElementById("guessInput");
    if (!input) return;
    input.value = input.value.toLowerCase().trim();
    const guess = input.value;
    if (!guess) return;

    input.value = ""; // Clear input field after guess
    const guessedHash = await hashString(guess); // Hash the guess
    const resultDiv = document.getElementById("result"); // Use gameResultDiv if renamed
    if (!resultDiv) return;
    const clueSpanRef = document.getElementById("clue"); // Use clueSpan if renamed

    if (guess === secretWord) {
        console.log("Guess CORRECT");
        streak++;
        resultDiv.innerHTML = `<div class='quiz-feedback correct fade-in'>✅ Correct! "${guess}" matches the secret word!<br/><span style='display: block; margin-top: 0.5rem; font-family: monospace;'>Hash:<br><mark style='background-color: #d6f5e6; color: #207544; word-break: break-word; display: inline-block;'>${guessedHash}</mark></span><br/>It matches the target hash. Hashes are one-way: you can calculate a hash from a word, but not the other way around. The only way to discover the word is by guessing and comparing.</div>`;
        // Removed nextStep showing
        input.disabled = true;
        if (submitGuessBtn) submitGuessBtn.disabled = true;
        // Maybe pick a new word automatically or prompt user? For now, just stops.
        // Consider adding a "Play Again" button within this section or rely on Main Menu nav.
        // Let's pick a new word automatically for seamless play
        secretWord = wordList[Math.floor(Math.random() * wordList.length)];
        console.log("New secret word selected:", secretWord);
        // Add a small delay then enable input for next round? Or add a button?
        // Adding a simple "Next Word" button is clearer.
        resultDiv.innerHTML += `<button onclick="prepareGame1()" style="margin-left: 1rem;">Next Word</button>`;


    } else {
        console.log("Guess INCORRECT");
        streak = 0;
        attempts++;
        // Provide hints based on the number of attempts
        let hints = [ /* ... keep hints array ... */ ].filter(Boolean);
        let newHint = attempts - 1 < hints.length ? hints[attempts - 1] : `Try rearranging your thoughts! 😉`;

        if (clueSpanRef) { /* ... keep hint display logic ... */ }

        resultDiv.innerHTML = `<div class='quiz-feedback incorrect fade-in'>❌ Nope. You entered: "${guess}"<br/>
<pre style='margin: 0; padding: 0; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; line-height: 1.2;'>
<span style='display: inline-block; margin-top: 0.5rem;'>Your Hash:</span>
<mark style='background-color: #ffd6d6; color: #b22222; word-break: break-all;'>${guessedHash}</mark>
<span style='display: inline-block; margin-top: 0.5rem;' class='target-hash-label'>Target Hash:</span>
<mark style='background-color: #f0f0f0; color: #333; word-break: break-all;' class='target-hash-value'>${targetHash}</mark>
</pre>
<p style="font-weight: normal; margin-top: 0.75rem; font-size: 0.9em;">See how different your hash is? That's the one-way nature of hashing! Keep guessing to find the match.</p>
</div>`;
        input.focus();
    }
}

// --- Quiz Logic ---
function quizIsInProgress() {
    // Quiz is in progress if it has started (quizIndex > 0) but not yet finished (quizIndex < numQuestions)
    // Also check numQuestions > 0 to avoid issues before quiz starts
    const inProgress = numQuestions > 0 && quizIndex > 0 && quizIndex < numQuestions;
    console.log(`Quiz in progress check: ${inProgress} (Index: ${quizIndex}, NumQ: ${numQuestions})`);
    return inProgress;
}

function resetQuizState() {
    console.log("Resetting quiz state.");
    quizIndex = 0;
    correctAnswers = 0;
    numQuestions = 0;
    currentQuizQuestions = [];
    lastQuizScorePercent = -1; // Reset score until next completion
     // Also clear UI elements if needed
     if(quizQuestionElement) quizQuestionElement.textContent = "";
     if(quizOptionsContainer) quizOptionsContainer.innerHTML = "";
     if(quizResultDiv) quizResultDiv.innerHTML = "";
     // Reset progress bars visually (startQuiz will handle setting them initially)
     if(quizCompletionProgressBar) { quizCompletionProgressBar.style.width = '0%'; quizCompletionProgressBar.textContent = '0% Complete'; }
     if(quizScoreProgressBar) { quizScoreProgressBar.style.width = '0%'; quizScoreProgressBar.textContent = '0% Score'; }
}

function startQuiz() {
  console.log("Starting Quiz...");
  // Reset state variables for a fresh quiz attempt
  quizIndex = 0;
  correctAnswers = 0;
  lastQuizScorePercent = -1; // Reset global score until this quiz attempt is finished

  // Select 4 random questions
  const shuffledQuestions = shuffleArray([...allQuizQuestions]);
  currentQuizQuestions = shuffledQuestions.slice(0, 4); // Use global quiz state var
  numQuestions = currentQuizQuestions.length; // Use global quiz state var
  console.log("Selected Questions:", currentQuizQuestions.map(q => q.question));

  // Ensure elements exist
  if (!quizQuestionElement || !quizOptionsContainer || !quizResultDiv || !quizCompletionProgressBar || !quizScoreProgressBar) {
    console.error("Quiz elements not found!");
    return;
  }

  // Reset progress bars for new quiz
  updateQuizProgressBars();
  showNextQuizQuestion(); // Show the first question
}

function updateQuizProgressBars() {
  const completionPercent = numQuestions > 0 ? Math.round(((quizIndex) / numQuestions) * 100) : 0;
  // Score percent should reflect current progress, not total questions until the end?
  // Let's calculate score based on questions *answered so far* for the score bar
  // const scorePercent = quizIndex > 0 ? Math.round((correctAnswers / quizIndex) * 100) : 0; // Score based on answered
   const scorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0; // Score based on total - keep this simpler

  if (quizCompletionProgressBar) {
      quizCompletionProgressBar.style.width = `${completionPercent}%`;
      quizCompletionProgressBar.textContent = `${completionPercent}% Complete`;
  }
  if (quizScoreProgressBar) {
      quizScoreProgressBar.style.width = `${scorePercent}%`;
      quizScoreProgressBar.textContent = `${scorePercent}% Score`;
  }
}

function showFinalQuizResults() {
  console.log("Quiz finished. Showing final results.");
  const finalScorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0;
  lastQuizScorePercent = finalScorePercent; // *** STORE the final percentage globally ***
  console.log("Stored lastQuizScorePercent:", lastQuizScorePercent);
  updateMainMenuScoreDisplay(); // Update main menu score immediately

  if (quizResultDiv) {
      quizResultDiv.innerHTML = `<div class='quiz-feedback ${finalScorePercent >= 66 ? "correct" : "incorrect"}'>Quiz Complete! You scored ${correctAnswers} out of ${numQuestions} (${finalScorePercent}%).</div>`;
      // Removed "Continue to Summary" button - use Main Menu button
       quizResultDiv.innerHTML += `<button onclick='startQuiz()' style="margin-left: 0.5rem;">Try Quiz Again</button>`; // Keep Try Again
  }
   // Ensure Main Menu button is fully active now (remove any disabled state if used)
   // quizMainMenuBtn.disabled = false; // Example if it was disabled during quiz
}

function showNextQuizQuestion() {
  console.log(`Showing quiz question ${quizIndex + 1} of ${numQuestions}`);
  updateQuizProgressBars(); // Update bars before showing question

  const current = currentQuizQuestions[quizIndex];
  if (quizQuestionElement) quizQuestionElement.textContent = `${quizIndex + 1}. ${current.question}`;
  if (quizOptionsContainer) quizOptionsContainer.innerHTML = "";
  if (quizResultDiv) quizResultDiv.innerHTML = ""; // Clear previous result/next button

  // Shuffle and display options
  current.options.sort(() => Math.random() - 0.5).forEach(option => {
    const div = document.createElement("div");
    div.className = "quiz-option";
    div.textContent = option.text;
    div.onclick = () => { // Arrow function for 'this' context if needed, though not used here
      console.log(`Answered question ${quizIndex + 1}`);
      // Disable options
      const allOptions = quizOptionsContainer.querySelectorAll('.quiz-option');
      allOptions.forEach(opt => { opt.style.pointerEvents = 'none'; opt.style.cursor = 'default'; if (opt !== div) opt.style.opacity = '0.6'; });

      // Check answer
      const isCorrect = option.value === current.correct;
      if (isCorrect) {
        div.style.backgroundColor = '#d1e7dd'; div.style.borderColor = '#badbcc'; div.style.color = '#0f5132'; div.style.fontWeight = 'bold';
        correctAnswers++;
        console.log("Correct! Quiz correctAnswers:", correctAnswers);
      } else {
        div.style.backgroundColor = '#f8d7da'; div.style.borderColor = '#f5c2c7'; div.style.color = '#842029'; div.style.fontWeight = 'bold';
        // Highlight correct answer
         allOptions.forEach(opt => {
             const originalOption = currentQuizQuestions[quizIndex]?.options.find(o => o.text === opt.textContent);
             if (originalOption && originalOption.value === current.correct) {
                opt.style.backgroundColor = '#d1e7dd'; opt.style.borderColor = '#badbcc'; opt.style.color = '#0f5132'; opt.style.opacity = '1';
             }
         });
        console.log("Incorrect. Quiz correctAnswers:", correctAnswers);
      }

      quizIndex++; // Move to next question index *after* checking answer
      updateQuizProgressBars(); // Update progress bars *after* score/index change

      // Check if quiz is over
      if (quizIndex >= numQuestions) {
         // If it's the end, show final results
         setTimeout(() => { showFinalQuizResults(); }, 1000); // Delay
      } else {
         // Otherwise, show 'Next' button
         setTimeout(() => {
             if (quizResultDiv) {
                 const nextBtn = document.createElement("button");
                 nextBtn.textContent = "Next Question →";
                 nextBtn.onclick = showNextQuizQuestion;
                 quizResultDiv.innerHTML = ''; // Clear feedback
                 quizResultDiv.appendChild(nextBtn);
             }
         }, 1000); // Delay
      }
    }; // end div.onclick
    if (quizOptionsContainer) quizOptionsContainer.appendChild(div);
  }); // end forEach option
}

// --- Bonus Game Logic ---
function prepareBonusGame() {
     console.log("Preparing Bonus Game...");
     // Reset bonus game state if needed when showing the section
     if (bonusSelect) bonusSelect.value = "";
     if (bonusHashDisplay) bonusHashDisplay.innerHTML = '<code style="visibility: hidden;">Placeholder</code>';
     if (bonusResult) bonusResult.innerHTML = "";
     const guessOptions = document.querySelectorAll('#bonusGuessOptions .country-guess-option');
     guessOptions.forEach(opt => {
         opt.disabled = false;
         opt.classList.remove('correct-guess', 'incorrect-guess');
     });
 }
async function updateBonusHashDisplay() { /* ... (Keep original function) ... */ }
function checkBonusGuess(guessedCountry, buttonElement) { /* ... (Keep original function) ... */ }

// --- Hashing Tool Logic (Adapted from Modal) ---
function prepareHashTool() {
    console.log("Preparing Hash Tool view...");
    if (toolTextInput) {
        toolTextInput.value = ""; // Clear input
        toolTextInput.focus();
    }
    if (toolResultsDiv) toolResultsDiv.innerHTML = ""; // Clear results
}
async function showToolHashes() { // Renamed from showHashes to avoid conflicts if original existed elsewhere
  if (!toolTextInput || !toolResultsDiv) return;

  const inputValue = toolTextInput.value;
  console.log("Generating tool hashes for:", inputValue);
  if (!inputValue && inputValue !== "") { // Allow hashing empty string
    toolResultsDiv.innerHTML = "<p style='color: red;'>Please enter text to hash.</p>";
    return;
  }
  toolResultsDiv.innerHTML = "<p><em>Generating hashes...</em></p>";
  try {
    const sha256 = await shaHash(inputValue, "SHA-256");
    const sha512 = await shaHash(inputValue, "SHA-512");
    toolResultsDiv.innerHTML = `
      <div><h3>SHA-256:</h3><code id="toolSha256" style="word-break: break-all;">${sha256}</code><button class='copy-btn' onclick="copyToClipboard('toolSha256')">Copy</button><span id="copied-toolSha256" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div>
      <div style="margin-top: 1rem;"><h3>SHA-512:</h3><code id="toolSha512" style="word-break: break-all;">${sha512}</code><button class='copy-btn' onclick="copyToClipboard('toolSha512')">Copy</button><span id="copied-toolSha512" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div>
    `;
    // Ensure copy buttons within this dynamic content work
    // Re-attaching listeners might be needed if innerHTML overwrites them,
    // but inline onclick should be fine here.
  } catch (error) {
    console.error("Hashing error:", error);
    toolResultsDiv.innerHTML = "<p style='color: red;'>Error generating hashes. See console.</p>";
  }
}


// --- Initialize ---
document.addEventListener('DOMContentLoaded', initializeGame);
