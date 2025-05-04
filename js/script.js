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
const hashToolSection = document.getElementById("hashTool");

// Ensure all views are correctly selected
const views = [mainMenu, lessonSection, gameSection, quizSection, summarySection, bonusGameSection, hashToolSection].filter(Boolean); // Filter out nulls if IDs are wrong
if (views.length !== 7) {
    console.warn("One or more view containers might be missing or have incorrect IDs!");
}

// Main Menu Elements
const mainMenuScoreDisplay = document.getElementById("mainMenuScoreDisplay");
const navLessonBtn = document.getElementById("navLesson");
const navGame1Btn = document.getElementById("navGame1");
const navGame2Btn = document.getElementById("navGame2");
const navQuizBtn = document.getElementById("navQuiz");
const navSummaryBtn = document.getElementById("navSummary");
const navHashToolBtn = document.getElementById("navHashTool");
const rateGameBtn = document.getElementById("rateGameBtn");

// Game 1 Elements
const hashDisplay = document.getElementById("hashDisplay");
const clueSpan = document.getElementById("clue");
const guessInput = document.getElementById("guessInput");
const submitGuessBtn = document.getElementById("submitGuessBtn");
const gameResultDiv = document.getElementById("gameResult");

// Quiz Elements
const quizQuestionElement = document.getElementById("quizQuestion");
const quizOptionsContainer = document.getElementById("quizOptions");
const quizResultDiv = document.getElementById("quizResult");
const quizCompletionProgressBar = document.getElementById("quizProgress");
const quizScoreProgressBar = document.getElementById("quizScoreBar");
const quizMainMenuBtn = quizSection?.querySelector('.main-menu-btn');

// Bonus Game Elements
const bonusTargetHashEl = document.getElementById("bonusTargetHash");
const bonusSelect = document.getElementById("bonusCountrySelect");
const bonusHashDisplay = document.getElementById("bonusHashDisplay");
const bonusResult = document.getElementById("bonusResult");

// Hash Tool Elements
const toolTextInput = document.getElementById("toolTextInput");
const generateHashesBtn = document.getElementById("generateHashesBtn");
const toolResultsDiv = document.getElementById("toolResults");

// --- Config ---
const wordCategories = { drinks: ["water", "juice", "latte", "cider", "mocha", "tonic", "shake", "pepsi", "lager"], };
const allQuizQuestions = [ /* ... (Keep original questions array) ... */ ];
const bonusCountries = ["Argentina", "Brazil", "Canada", "Colombia", "Peru"];
const bonusCorrectCountry = "Peru";

// --- State Variables ---
let wordList = [];
let categoryLabel = '';
let secretWord = "";
let targetHash = ""; // For Game 1
let attempts = 0;
let streak = 0;
let lastQuizScorePercent = -1;
let bonusTargetHashValue = ""; // For Game 2

// Quiz State
let currentQuizQuestions = [];
let quizIndex = 0;
let correctAnswers = 0;
let numQuestions = 0;

// --- Core Hashing Functions ---
// ... (Keep hashString and shaHash functions as they were - ensure they handle errors)
async function hashString(str) {
  try {
    const encoder = new TextEncoder(); const data = encoder.encode(str); const hashBuffer = await crypto.subtle.digest("SHA-256", data); const hashArray = Array.from(new Uint8Array(hashBuffer)); return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (error) { console.error("Error in hashString:", error); throw error; /* Re-throw error */ }
}
async function shaHash(input, algorithm) {
  try {
    const encoder = new TextEncoder(); const data = encoder.encode(input); const hashBuffer = await crypto.subtle.digest(algorithm, data); const hashArray = Array.from(new Uint8Array(hashBuffer)); return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) { console.error(`Error in shaHash (${algorithm}):`, error); throw error; /* Re-throw error */ }
}

// --- Navigation Functions ---
function hideAllViews() {
  console.log("Hiding all views...");
  views.forEach(view => {
    if (view && !view.classList.contains('hidden')) { // Only log if actually hiding
        console.log(` Hiding: ${view.id}`);
        view.classList.add('hidden');
    } else if (!view) {
        // This case should be caught by the filter at the top, but good to be safe
        // console.warn("Attempted to hide a non-existent view element.");
    }
  });
}

function showView(viewId) {
  console.log(`Attempting to show view: ${viewId}`);
  hideAllViews(); // Hide everything first
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.remove('hidden'); // Show the target view
    console.log(`Successfully showing view: ${viewId}`);
  } else {
    console.error(`View with ID ${viewId} not found!`);
  }
  window.scrollTo(0, 0);
}

function showMainMenu() {
  console.log("Showing Main Menu");
  showView('mainMenu'); // Use showView to handle hiding others
  updateMainMenuScoreDisplay();
}

// --- Main Menu Score Display ---
function updateMainMenuScoreDisplay() {
    // ... (Keep the function as it was in the previous version)
    if (!mainMenuScoreDisplay) return;
    console.log(`Updating score display. Last score: ${lastQuizScorePercent}%`);
    let scoreMessage = "Complete the Quick Quiz to see your score!";
    let scoreClass = "";
    if (lastQuizScorePercent >= 66) { scoreMessage = `🎉🏆✨ Your latest quiz score was: <strong>${lastQuizScorePercent}%</strong> ✨🏆🎉`; scoreClass = "score-highlight"; }
    else if (lastQuizScorePercent >= 0) { scoreMessage = `Your latest quiz score was: <strong>${lastQuizScorePercent}%</strong>`; }
    mainMenuScoreDisplay.innerHTML = `<p>${scoreMessage}</p>`;
    if (scoreClass) { mainMenuScoreDisplay.classList.add(scoreClass); }
    else { mainMenuScoreDisplay.classList.remove(scoreClass); }
}

// --- Game Initialization ---
async function initializeGame() {
  try { // Wrap initialization in try...catch to spot errors
    console.log("Initializing game (Alternative Version - Attempt 3)...");

    // --- Setup Event Listeners FIRST ---
    // FIX: Attach Dark Mode listener earlier and check element
    if (darkModeToggleBtn) {
        console.log("Attaching dark mode listener");
        darkModeToggleBtn.onclick = toggleDarkMode;
    } else {
        console.error("Dark Mode Toggle Button not found!");
    }

    // Main Menu Navigation Listeners
    if (navLessonBtn) { navLessonBtn.onclick = () => { console.log("Nav Lesson clicked"); showView('lesson'); }; } else { console.error("Nav Lesson Button not found"); }
    if (navGame1Btn) { navGame1Btn.onclick = () => { console.log("Nav Game 1 clicked"); showView('game'); prepareGame1(); }; } else { console.error("Nav Game 1 Button not found"); }
    if (navGame2Btn) { navGame2Btn.onclick = () => { console.log("Nav Game 2 clicked"); showView('bonusGame'); prepareBonusGame(); }; } else { console.error("Nav Game 2 Button not found"); }
    if (navQuizBtn) { navQuizBtn.onclick = () => { console.log("Nav Quiz clicked"); showView('quiz'); startQuiz(); }; } else { console.error("Nav Quiz Button not found"); }
    if (navSummaryBtn) { navSummaryBtn.onclick = () => { console.log("Nav Summary clicked"); showView('summary'); }; } else { console.error("Nav Summary Button not found"); }
    if (navHashToolBtn) { navHashToolBtn.onclick = () => { console.log("Nav Hash Tool clicked"); showView('hashTool'); prepareHashTool(); }; } else { console.error("Nav Hash Tool Button not found"); }

    // Footer Buttons
    if (rateGameBtn) { rateGameBtn.onclick = () => showToast('Rating feature coming soon!', true); } else { console.error("Rate Game Button not found"); }

    // "Main Menu" buttons within each section
    document.querySelectorAll('.main-menu-btn').forEach(button => {
        const parentSection = button.closest('.section');
        if (parentSection && parentSection.id === 'quiz') {
             // Special handling for quiz button assigned later
        } else if (parentSection) {
             console.log(`Attaching Main Menu listener to button in section: ${parentSection.id}`);
             button.onclick = showMainMenu;
        } else {
             console.warn("Found a main-menu-btn not inside a .section");
        }
    });

    // Quiz "Main Menu" Button Listener (with confirmation)
    if (quizMainMenuBtn) {
        console.log("Attaching listener to Quiz Main Menu button");
        quizMainMenuBtn.onclick = () => {
            console.log("Quiz Main Menu button clicked. Quiz in progress:", quizIsInProgress());
            if (quizIsInProgress()) {
                if (confirm("Are you sure you want to return to the Main Menu? Your current quiz progress will be lost.")) {
                    resetQuizState();
                    showMainMenu();
                } // else do nothing if cancelled
            } else {
                showMainMenu(); // Navigate directly if quiz not in progress
            }
        };
    } else {
         console.error("Quiz Main Menu button not found!");
    }

    // Game 1 Listeners
    if (submitGuessBtn) { submitGuessBtn.onclick = checkGuess; } else { console.error("Submit Guess Button not found"); }
    if (guessInput) {
        guessInput.addEventListener("keydown", function (event) { if (event.key === "Enter") { event.preventDefault(); checkGuess(); } });
    } else { console.error("Guess Input not found"); }

    // Bonus Game Listener
    if (bonusSelect) { bonusSelect.onchange = updateBonusHashDisplay; } else { console.error("Bonus Select not found"); }

    // Hash Tool Listener
    if (generateHashesBtn) { generateHashesBtn.onclick = showToolHashes; } else { console.error("Generate Hashes Button not found"); }
    if (toolTextInput) {
        toolTextInput.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); showToolHashes(); } });
    } else { console.error("Tool Text Input not found"); }


    // --- Initial Game State Setup ---
    // Apply Dark Mode from localStorage *after* listener is attached
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        if (darkModeToggleBtn) darkModeToggleBtn.textContent = '☀️';
    } else {
        if (darkModeToggleBtn) darkModeToggleBtn.textContent = '🌗';
    }

    categoryLabel = 'Drinks'; // Or from config
    wordList = wordCategories.drinks;
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    console.log("Initial secret word:", secretWord);
    targetHash = await hashString(secretWord); // Calculate initial hash
    console.log("Initial Target Hash (Game 1):", targetHash);

    // Calculate Bonus Game Hash
    bonusTargetHashValue = await hashString(bonusCorrectCountry);
    console.log("Bonus Target Hash (Game 2):", bonusTargetHashValue);
    if (bonusTargetHashEl) { bonusTargetHashEl.textContent = bonusTargetHashValue; }
    else { console.error("Bonus Target Hash element not found"); }


    // --- Initial View ---
    // Hide all views explicitly first BEFORE showing main menu
    hideAllViews();
    showMainMenu(); // Start by showing the main menu

    console.log("Initialization complete.");

  } catch (error) {
      console.error("Error during initializeGame:", error);
      // Display error to user?
      const body = document.querySelector('body');
      if (body) body.innerHTML = `<p style="color: red; font-weight: bold; padding: 2rem;">Error initializing the game. Please check the console (F12).</p>`;
  }
}

// --- Helper Functions ---
// ... (Keep shuffleArray, showToast, copyToClipboard, fallbackCopyToClipboard, showCopiedMessage)
function shuffleArray(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }
function showToast(message, isInfo = false) { if (!toast) return; toast.textContent = message; toast.className = 'toast'; if (isInfo) { toast.classList.add('info'); } toast.style.display = "block"; toast.style.opacity = 1; if (toast.timer) clearTimeout(toast.timer); toast.timer = setTimeout(() => { toast.style.opacity = 0; setTimeout(() => { toast.style.display = 'none'; }, 500); }, 2500); }
function copyToClipboard(elementId) { const codeBlock = document.getElementById(elementId); if (!codeBlock) return; const textToCopy = codeBlock.textContent; if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(textToCopy).then(() => { showToast("Copied to clipboard!"); showCopiedMessage(elementId); }).catch(err => { console.error("Async clipboard copy failed:", err); fallbackCopyToClipboard(textToCopy, elementId); }); } else { fallbackCopyToClipboard(textToCopy, elementId); } }
function fallbackCopyToClipboard(text, elementId) { const textArea = document.createElement("textarea"); textArea.value = text; textArea.style.position = "fixed"; textArea.style.top = "-9999px"; textArea.style.left = "-9999px"; document.body.appendChild(textArea); textArea.focus(); textArea.select(); try { const successful = document.execCommand("copy"); if (successful) { showToast("Copied to clipboard!"); showCopiedMessage(elementId); } else { showToast("Failed to copy", true); } } catch (err) { console.error("Fallback copy failed:", err); showToast("Failed to copy", true); } document.body.removeChild(textArea); }
function showCopiedMessage(elementId) { const messageId = `copied-${elementId}`; const messageEl = document.getElementById(messageId); if (messageEl) { messageEl.style.display = "inline"; setTimeout(() => { messageEl.style.display = "none"; }, 1500); } }

// --- Dark Mode ---
// ... (Keep toggleDarkMode function as previously corrected)
function toggleDarkMode() { const isDark = document.body.classList.toggle('dark-mode'); localStorage.setItem('darkMode', isDark); if (darkModeToggleBtn) darkModeToggleBtn.textContent = isDark ? '☀️' : '🌗'; console.log(`Dark mode toggled: ${isDark}`); }

// --- Game 1 (Guess the Word) Logic ---
async function prepareGame1() {
    console.log("Preparing Game 1...");
    secretWord = wordList[Math.floor(Math.random() * wordList.length)]; // Always pick a new word
    console.log("New secret word:", secretWord);
    try {
        targetHash = await hashString(secretWord);
        console.log("Target Hash:", targetHash);
        if (hashDisplay) hashDisplay.textContent = targetHash;
    } catch (e) {
        console.error("Failed to set target hash", e);
        if (hashDisplay) hashDisplay.textContent = "Error";
    }
    if (clueSpan) clueSpan.innerHTML = `It's a ${categoryLabel.toLowerCase()}, a ${secretWord.length}-letter word, lowercase only.`;
    attempts = 0;
    if (gameResultDiv) gameResultDiv.innerHTML = "";
    if (guessInput) { guessInput.value = ""; guessInput.disabled = false; guessInput.focus(); }
    if (submitGuessBtn) submitGuessBtn.disabled = false;
}
async function checkGuess() {
    // ... (Keep function as previously corrected, ensure targetHash and guessedHash are logged/correct)
    if (!guessInput || !gameResultDiv) return;
    guessInput.value = guessInput.value.toLowerCase().trim();
    const guess = guessInput.value;
    if (!guess) return;
    guessInput.value = "";

    let guessedHash = "Error";
    try {
        guessedHash = await hashString(guess);
        console.log("Guessed hash:", guessedHash);
    } catch (e) { console.error("Hash failed", e); }
    console.log("Target hash:", targetHash); // Verify target hash is still correct

    if (guess === secretWord) {
        streak++;
        gameResultDiv.innerHTML = `<div class='quiz-feedback correct fade-in'>✅ Correct! "${guess}" matches!<br/><span style='display: block; margin-top: 0.5rem; font-family: monospace;'>Hash:<br><mark style='background-color: #d6f5e6; color: #207544; word-break: break-word; display: inline-block;'>${guessedHash}</mark></span></div>`;
        if(guessInput) guessInput.disabled = true;
        if (submitGuessBtn) submitGuessBtn.disabled = true;
        gameResultDiv.innerHTML += `<button onclick="prepareGame1()" style="margin-left: 1rem; margin-top: 0.5rem;">Next Word</button>`;
    } else {
        streak = 0; attempts++;
        let hints = [ /* ... hints array ... */ ].filter(Boolean);
        let newHint = attempts - 1 < hints.length ? hints[attempts - 1] : `Try rearranging thoughts! 😉`;

        // FIX: Ensure hint display logic works
        if (clueSpan) {
            let hintDiv = clueSpan.querySelector(`.hint-highlight.hint-${attempts}`);
            if (!hintDiv) { hintDiv = document.createElement('div'); hintDiv.className = `hint-highlight hint-${attempts}`; clueSpan.appendChild(hintDiv); }
            hintDiv.innerHTML = `Hint ${attempts}: ${newHint}`;
        } else { console.error("Clue span missing for hint"); }

        // FIX: Ensure hashes are displayed
        gameResultDiv.innerHTML = `<div class='quiz-feedback incorrect fade-in'>❌ Nope. "${guess}"<br/>
<pre style='margin:0;padding:0;font-family:monospace;white-space:pre-wrap;word-wrap:break-word;line-height:1.2;'>
<span style='display:inline-block;margin-top:0.5rem;'>Your Hash:</span>
<mark style='background-color:#ffd6d6;color:#b22222;word-break:break-all;'>${guessedHash}</mark>
<span style='display:inline-block;margin-top:0.5rem;' class='target-hash-label'>Target Hash:</span>
<mark style='background-color:#f0f0f0;color:#333;word-break:break-all;' class='target-hash-value'>${targetHash}</mark>
</pre></div>`;
        if(guessInput) guessInput.focus();
    }
}


// --- Quiz Logic ---
// ... (Keep quizIsInProgress, resetQuizState, startQuiz, updateQuizProgressBars, showFinalQuizResults, showNextQuizQuestion as previously corrected)
function quizIsInProgress() { return numQuestions > 0 && quizIndex > 0 && quizIndex < numQuestions; }
function resetQuizState() { console.log("Resetting quiz state."); quizIndex = 0; correctAnswers = 0; numQuestions = 0; currentQuizQuestions = []; if(quizQuestionElement) quizQuestionElement.textContent = ""; if(quizOptionsContainer) quizOptionsContainer.innerHTML = ""; if(quizResultDiv) quizResultDiv.innerHTML = ""; if(quizCompletionProgressBar) { quizCompletionProgressBar.style.width = '0%'; quizCompletionProgressBar.textContent = '0% Complete'; } if(quizScoreProgressBar) { quizScoreProgressBar.style.width = '0%'; quizScoreProgressBar.textContent = '0% Score'; } }
function startQuiz() { console.log("Starting Quiz..."); quizIndex = 0; correctAnswers = 0; lastQuizScorePercent = -1; const shuffledQuestions = shuffleArray([...allQuizQuestions]); currentQuizQuestions = shuffledQuestions.slice(0, 4); numQuestions = currentQuizQuestions.length; if (!quizQuestionElement || !quizOptionsContainer || !quizResultDiv || !quizCompletionProgressBar || !quizScoreProgressBar) { console.error("Quiz elements missing!"); return; } updateQuizProgressBars(); showNextQuizQuestion(); }
function updateQuizProgressBars() { if (!quizCompletionProgressBar || !quizScoreProgressBar) return; const completionPercent = numQuestions > 0 ? Math.round(((quizIndex) / numQuestions) * 100) : 0; const scorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0; quizCompletionProgressBar.style.width = `${completionPercent}%`; quizCompletionProgressBar.textContent = `${completionPercent}% Complete`; quizScoreProgressBar.style.width = `${scorePercent}%`; quizScoreProgressBar.textContent = `${scorePercent}% Score`; }
function showFinalQuizResults() { console.log("Quiz finished."); const finalScorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0; lastQuizScorePercent = finalScorePercent; console.log("Stored lastQuizScorePercent:", lastQuizScorePercent); updateMainMenuScoreDisplay(); if (quizResultDiv) { quizResultDiv.innerHTML = `<div class='quiz-feedback ${finalScorePercent >= 66 ? "correct" : "incorrect"}'>Quiz Complete! Score: ${correctAnswers}/${numQuestions} (${finalScorePercent}%).</div>`; quizResultDiv.innerHTML += `<button onclick='startQuiz()' style="margin-left: 0.5rem; margin-top: 1rem;">Try Quiz Again</button>`; } }
function showNextQuizQuestion() { if (!quizQuestionElement || !quizOptionsContainer || !quizResultDiv) { console.error("Quiz elements missing for next question."); return; } console.log(`Showing quiz question ${quizIndex + 1}/${numQuestions}`); updateQuizProgressBars(); if (!currentQuizQuestions || quizIndex >= currentQuizQuestions.length) { console.error("Invalid quiz state."); if(quizResultDiv) quizResultDiv.innerHTML = "<p style='color:red;'>Error loading question.</p>"; return; } const current = currentQuizQuestions[quizIndex]; quizQuestionElement.textContent = `${quizIndex + 1}. ${current.question}`; quizOptionsContainer.innerHTML = ""; quizResultDiv.innerHTML = ""; current.options.sort(() => Math.random() - 0.5).forEach(option => { const div = document.createElement("div"); div.className = "quiz-option"; div.textContent = option.text; div.onclick = () => { console.log(`Answered Q${quizIndex + 1}`); const allOptions = quizOptionsContainer.querySelectorAll('.quiz-option'); allOptions.forEach(opt => { opt.style.pointerEvents = 'none'; opt.style.cursor = 'default'; if (opt !== div) opt.style.opacity = '0.6'; }); const isCorrect = option.value === current.correct; if (isCorrect) { div.style.backgroundColor = '#d1e7dd'; div.style.borderColor = '#badbcc'; div.style.color = '#0f5132'; div.style.fontWeight = 'bold'; correctAnswers++; } else { div.style.backgroundColor = '#f8d7da'; div.style.borderColor = '#f5c2c7'; div.style.color = '#842029'; div.style.fontWeight = 'bold'; allOptions.forEach(opt => { const originalOption = current.options.find(o => o.text === opt.textContent); if (originalOption && originalOption.value === current.correct) { opt.style.backgroundColor = '#d1e7dd'; opt.style.borderColor = '#badbcc'; opt.style.color = '#0f5132'; opt.style.opacity = '1'; } }); } quizIndex++; updateQuizProgressBars(); if (quizIndex >= numQuestions) { setTimeout(showFinalQuizResults, 1000); } else { setTimeout(() => { if (quizResultDiv) { const nextBtn = document.createElement("button"); nextBtn.textContent = "Next Question →"; nextBtn.style.marginTop = "1rem"; nextBtn.onclick = showNextQuizQuestion; quizResultDiv.innerHTML = ''; quizResultDiv.appendChild(nextBtn); } }, 1000); } }; quizOptionsContainer.appendChild(div); }); }

// --- Bonus Game Logic ---
// ... (Keep prepareBonusGame, updateBonusHashDisplay, checkBonusGuess as previously corrected)
function prepareBonusGame() { console.log("Preparing Bonus Game..."); if (bonusTargetHashEl) { bonusTargetHashEl.textContent = bonusTargetHashValue; } if (bonusSelect) bonusSelect.value = ""; if (bonusHashDisplay) bonusHashDisplay.innerHTML = '<code style="visibility: hidden;">Placeholder</code>'; if (bonusResult) bonusResult.innerHTML = ""; const guessOptions = document.querySelectorAll('#bonusGuessOptions .country-guess-option'); guessOptions.forEach(opt => { opt.disabled = false; opt.classList.remove('correct-guess', 'incorrect-guess'); }); }
async function updateBonusHashDisplay() { if (!bonusSelect || !bonusHashDisplay) return; const selectedCountry = bonusSelect.value; if (selectedCountry) { bonusHashDisplay.innerHTML = `<code>Calculating...</code>`; try { const selectedHash = await hashString(selectedCountry); console.log(`Hash for ${selectedCountry}: ${selectedHash}`); bonusHashDisplay.innerHTML = `<code>Hash for ${selectedCountry}:<br>${selectedHash}</code>`; } catch(e){ bonusHashDisplay.innerHTML = `<code>Error hashing</code>`; } } else { bonusHashDisplay.innerHTML = '<code style="visibility: hidden;">Placeholder</code>'; } }
function checkBonusGuess(guessedCountry, buttonElement) { if (!bonusResult || !buttonElement) return; console.log(`Bonus guess: ${guessedCountry}, Correct: ${bonusCorrectCountry}`); const allGuessOptions = document.querySelectorAll('#bonusGuessOptions .country-guess-option'); allGuessOptions.forEach(opt => { if (opt !== buttonElement) opt.classList.remove('incorrect-guess'); }); if (guessedCountry === bonusCorrectCountry) { buttonElement.classList.remove('incorrect-guess'); buttonElement.classList.add('correct-guess'); bonusResult.innerHTML = `<div class='quiz-feedback correct fade-in'>✅ Correct! Maria chose ${bonusCorrectCountry}.</div>`; allGuessOptions.forEach(opt => opt.disabled = true); } else { buttonElement.classList.add('incorrect-guess'); bonusResult.innerHTML = `<div class='quiz-feedback incorrect fade-in'>❌ Incorrect. Try again!</div>`; } }


// --- Hashing Tool Logic ---
// ... (Keep prepareHashTool, showToolHashes as previously corrected)
function prepareHashTool() { console.log("Preparing Hash Tool view..."); if (toolTextInput) { toolTextInput.value = ""; toolTextInput.focus(); } if (toolResultsDiv) toolResultsDiv.innerHTML = ""; }
async function showToolHashes() { if (!toolTextInput || !toolResultsDiv) return; const inputValue = toolTextInput.value; console.log("Generating tool hashes for:", inputValue); toolResultsDiv.innerHTML = "<p><em>Generating hashes...</em></p>"; let sha256 = "Error"; let sha512 = "Error"; try { sha256 = await shaHash(inputValue, "SHA-256"); sha512 = await shaHash(inputValue, "SHA-512"); console.log("Tool SHA-256:", sha256); console.log("Tool SHA-512:", sha512); toolResultsDiv.innerHTML = `<div><h3>SHA-256:</h3><code id="toolSha256" style="word-break: break-all;">${sha256}</code><button class='copy-btn' onclick="copyToClipboard('toolSha256')">Copy</button><span id="copied-toolSha256" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div> <div style="margin-top: 1rem;"><h3>SHA-512:</h3><code id="toolSha512" style="word-break: break-all;">${sha512}</code><button class='copy-btn' onclick="copyToClipboard('toolSha512')">Copy</button><span id="copied-toolSha512" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div>`; } catch (error) { console.error("Hashing error:", error); toolResultsDiv.innerHTML = "<p style='color: red;'>Error generating hashes.</p>"; } }

// --- Initialize ---
// FIX: Ensure event listener is correctly added
document.addEventListener('DOMContentLoaded', initializeGame);