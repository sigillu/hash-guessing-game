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
const views = [mainMenu, lessonSection, gameSection, quizSection, summarySection, bonusGameSection, hashToolSection].filter(Boolean);
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
const allQuizQuestions = [
    { question: "Why are hashes useful in blockchain?", options: [ { text: "To make data easier to read", value: "A" }, { text: "To reverse-engineer original data", value: "B" }, { text: "To verify that no one has changed the data", value: "C" }, { text: "To compress large files", value: "D" } ], correct: "C" },
    { question: "What happens to the hash if the input changes slightly (e.g., changing \"apple\" to \"Apple\")?", options: [ { text: "It changes slightly", value: "A" }, { text: "It stays the same", value: "B" }, { text: "It changes completely", value: "C" }, { text: "It becomes unreadable", value: "D" } ], correct: "C" },
    { question: "Which of the following best describes a cryptographic hash function like SHA-256?", options: [ { text: "It compresses a file to save space", value: "A" }, { text: "It encrypts data with a secret key", value: "B" }, { text: "It transforms input into a fixed-length, irreversible string", value: "C" }, { text: "It sorts data alphabetically", value: "D" } ], correct: "C" },
    { question: "What is \"one-way\" functionality in hashing?", options: [ { text: "You can easily recover the original input from the hash", value: "A" }, { text: "Once hashed, the input cannot be easily reversed", value: "B" }, { text: "Hashing only works on text, not numbers", value: "C" }, { text: "The hash output is always the same, regardless of input", value: "D" } ], correct: "B" },
    { question: "What is a key characteristic of the output (the hash value) produced by a specific cryptographic hash function like SHA-256?", options: [ { text: "Its length varies depending on the input size.", value: "A" }, { text: "It always has the same, fixed length, regardless of the input size.", value: "B" }, { text: "It's always shorter than the original input.", value: "C" }, { text: "It contains a copy of the original input.", value: "D" } ], correct: "B" },
    { question: "If you hash the exact same word, like \"banana\", twice using the SHA-256 algorithm, what will the resulting hashes be?", options: [ { text: "They will be completely different each time.", value: "A" }, { text: "They will be identical.", value: "B" }, { text: "They will be similar but not identical.", value: "C" }, { text: "The second hash will be shorter than the first.", value: "D" } ], correct: "B" },
    { question: "\"Collision resistance\" in hashing means it is computationally difficult to...", options: [ { text: "Find the original input data from its hash.", value: "A" }, { text: "Calculate the hash of a given input quickly.", value: "B" }, { text: "Find two *different* inputs that produce the exact same hash output.", value: "C" }, { text: "Create a hash that is exactly 256 bits long.", value: "D" } ], correct: "C" },
    { question: "How can hashing be used to verify that a downloaded file hasn't been corrupted or tampered with?", options: [ { text: "By encrypting the file with the hash.", value: "A" }, { text: "By comparing the hash of the downloaded file with a known, trusted hash provided by the source.", value: "B" }, { text: "By trying to reverse the hash to see the original file content.", value: "C" }, { text: "By checking if the hash is longer than the filename.", value: "D" } ], correct: "B" },
    { question: "Why is it more secure for websites to store hashes of user passwords instead of the passwords themselves?", options: [ { text: "Hashes take up less storage space.", value: "A" }, { text: "If the database is breached, attackers get the hashes, which are hard to reverse, instead of the plain passwords.", value: "B" }, { text: "Hashing makes passwords easier for users to type.", value: "C" }, { text: "Hashes allow the website owner to read user passwords if needed.", value: "D" } ], correct: "B" },
    { question: "SHA-256 is a specific type of cryptographic hash function. What does the \"256\" typically refer to?", options: [ { text: "The maximum number of characters in the input.", value: "A" }, { text: "The time in seconds it takes to compute the hash.", value: "B" }, { text: "The fixed length of the hash output in bits.", value: "C" }, { text: "The version number of the algorithm.", value: "D" } ], correct: "C" }
];
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
async function hashString(str) {
  try {
    const encoder = new TextEncoder(); const data = encoder.encode(str); const hashBuffer = await crypto.subtle.digest("SHA-256", data); const hashArray = Array.from(new Uint8Array(hashBuffer)); return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (error) { console.error("Error in hashString:", error); throw error; }
}
async function shaHash(input, algorithm) {
  try {
    const encoder = new TextEncoder(); const data = encoder.encode(input); const hashBuffer = await crypto.subtle.digest(algorithm, data); const hashArray = Array.from(new Uint8Array(hashBuffer)); return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) { console.error(`Error in shaHash (${algorithm}):`, error); throw error; }
}

// --- Navigation Functions ---
function hideAllViews() {
  // console.log("Hiding all views..."); // Less verbose logging
  views.forEach(view => {
    if (view && !view.classList.contains('hidden')) {
        view.classList.add('hidden');
    }
  });
}

function showView(viewId) {
  console.log(`Attempting to show view: ${viewId}`);
  hideAllViews();
  const view = document.getElementById(viewId);
  if (view) {
    view.classList.remove('hidden');
    console.log(`Successfully showing view: ${viewId}`);
  } else {
    console.error(`View with ID ${viewId} not found!`);
  }
  window.scrollTo(0, 0);
}

function showMainMenu() {
  console.log("Showing Main Menu");
  showView('mainMenu');
  updateMainMenuScoreDisplay();
}

// --- Main Menu Score Display (CORRECTED) ---
function updateMainMenuScoreDisplay() {
    if (!mainMenuScoreDisplay) { console.error("mainMenuScoreDisplay element not found"); return; }
    // console.log(`Updating score display. Last score: ${lastQuizScorePercent}%`); // Less verbose logging

    let scoreMessage = "Complete the Quick Quiz to see your score!";
    const highlightClassName = "score-highlight"; // The specific class name we manage
    let shouldHaveHighlight = false; // Flag to determine if the class should be present

    if (lastQuizScorePercent >= 66) {
        scoreMessage = `🎉🏆✨ Your latest quiz score was: <strong>${lastQuizScorePercent}%</strong> ✨🏆🎉`;
        shouldHaveHighlight = true; // Should have the highlight class
    } else if (lastQuizScorePercent >= 0) {
        scoreMessage = `Your latest quiz score was: <strong>${lastQuizScorePercent}%</strong>`;
        // shouldHaveHighlight remains false
    } // Else: Initial state, shouldHaveHighlight remains false

    mainMenuScoreDisplay.innerHTML = `<p>${scoreMessage}</p>`;

    // FIX: Explicitly add or remove the specific class name 'score-highlight'
    if (shouldHaveHighlight) {
        if (!mainMenuScoreDisplay.classList.contains(highlightClassName)) {
             // console.log("Adding score highlight class"); // Less verbose logging
             mainMenuScoreDisplay.classList.add(highlightClassName);
        }
    } else {
        if (mainMenuScoreDisplay.classList.contains(highlightClassName)) {
            // console.log("Removing score highlight class"); // Less verbose logging
            mainMenuScoreDisplay.classList.remove(highlightClassName);
        }
    }
}


// --- Game Initialization ---
async function initializeGame() {
  try {
    console.log("Initializing game (Alternative Version - Attempt 6)...");

    // --- Setup Event Listeners FIRST ---
    if (darkModeToggleBtn) { console.log("Attaching dark mode listener"); darkModeToggleBtn.onclick = toggleDarkMode; } else { console.error("Dark Mode Toggle Button not found!"); }
    if (navLessonBtn) { navLessonBtn.onclick = () => { console.log("Nav Lesson clicked"); showView('lesson'); }; } else { console.error("Nav Lesson Button not found"); }
    if (navGame1Btn) { navGame1Btn.onclick = () => { console.log("Nav Game 1 clicked"); showView('game'); prepareGame1(); }; } else { console.error("Nav Game 1 Button not found"); }
    if (navGame2Btn) { navGame2Btn.onclick = () => { console.log("Nav Game 2 clicked"); showView('bonusGame'); prepareBonusGame(); }; } else { console.error("Nav Game 2 Button not found"); }
    if (navQuizBtn) { navQuizBtn.onclick = () => { console.log("Nav Quiz clicked"); showView('quiz'); startQuiz(); }; } else { console.error("Nav Quiz Button not found"); }
    if (navSummaryBtn) { navSummaryBtn.onclick = () => { console.log("Nav Summary clicked"); showView('summary'); }; } else { console.error("Nav Summary Button not found"); }
    if (navHashToolBtn) { navHashToolBtn.onclick = () => { console.log("Nav Hash Tool clicked"); showView('hashTool'); prepareHashTool(); }; } else { console.error("Nav Hash Tool Button not found"); }
    if (rateGameBtn) { rateGameBtn.onclick = () => showToast('Rating feature coming soon!', true); } else { console.error("Rate Game Button not found"); }

    document.querySelectorAll('.main-menu-btn').forEach(button => {
        const parentSection = button.closest('.section');
        if (parentSection && parentSection.id === 'quiz') { /* Handled below */ }
        else if (parentSection) { button.onclick = showMainMenu; }
        else { console.warn("Found a main-menu-btn not inside a .section"); }
    });

    if (quizMainMenuBtn) {
        console.log("Attaching listener to Quiz Main Menu button");
        quizMainMenuBtn.onclick = () => {
            console.log("Quiz Main Menu button clicked. Quiz in progress:", quizIsInProgress());
            if (quizIsInProgress()) {
                if (confirm("Are you sure you want to return to the Main Menu? Your current quiz progress will be lost.")) {
                    resetQuizState(); showMainMenu();
                }
            } else { showMainMenu(); }
        };
    } else { console.error("Quiz Main Menu button not found!"); }

    if (submitGuessBtn) { submitGuessBtn.onclick = checkGuess; } else { console.error("Submit Guess Button not found"); }
    if (guessInput) { guessInput.addEventListener("keydown", function (event) { if (event.key === "Enter") { event.preventDefault(); checkGuess(); } }); } else { console.error("Guess Input not found"); }
    if (bonusSelect) { bonusSelect.onchange = updateBonusHashDisplay; } else { console.error("Bonus Select not found"); }
    if (generateHashesBtn) { generateHashesBtn.onclick = showToolHashes; } else { console.error("Generate Hashes Button not found"); }
    if (toolTextInput) { toolTextInput.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); showToolHashes(); } }); } else { console.error("Tool Text Input not found"); }

    // --- Initial Game State Setup ---
    if (localStorage.getItem('darkMode') === 'true') { document.body.classList.add('dark-mode'); if (darkModeToggleBtn) darkModeToggleBtn.textContent = '☀️'; }
    else { if (darkModeToggleBtn) darkModeToggleBtn.textContent = '🌗'; }

    categoryLabel = 'Drinks'; wordList = wordCategories.drinks; secretWord = wordList[Math.floor(Math.random() * wordList.length)]; console.log("Initial secret word:", secretWord);
    targetHash = await hashString(secretWord); console.log("Initial Target Hash (Game 1):", targetHash);
    bonusTargetHashValue = await hashString(bonusCorrectCountry); console.log("Bonus Target Hash (Game 2):", bonusTargetHashValue);
    if (bonusTargetHashEl) { bonusTargetHashEl.textContent = bonusTargetHashValue; } else { console.error("Bonus Target Hash element not found for initial display"); }

    // --- Initial View ---
    hideAllViews();
    showMainMenu();

    console.log("Initialization complete.");
  } catch (error) {
      console.error("Error during initializeGame:", error);
      const body = document.querySelector('body');
      if (body) body.innerHTML = `<p style="color: red; font-weight: bold; padding: 2rem;">Error initializing the game. Please check the console (F12) for details like "${error.message}".</p>`;
  }
}

// --- Helper Functions ---
function shuffleArray(array) { if (!Array.isArray(array)) { console.error("ERROR in shuffleArray: Input is not an array!", array); return undefined; } const arrayCopy = [...array]; try { for (let i = arrayCopy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]]; } return arrayCopy; } catch (error) { console.error("ERROR during shuffleArray execution:", error); return undefined; } }
function showToast(message, isInfo = false) { if (!toast) return; toast.textContent = message; toast.className = 'toast'; if (isInfo) { toast.classList.add('info'); } toast.style.display = "block"; toast.style.opacity = 1; if (toast.timer) clearTimeout(toast.timer); toast.timer = setTimeout(() => { toast.style.opacity = 0; setTimeout(() => { toast.style.display = 'none'; }, 500); }, 2500); }
function copyToClipboard(elementId) { const codeBlock = document.getElementById(elementId); if (!codeBlock) return; const textToCopy = codeBlock.textContent; if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(textToCopy).then(() => { showToast("Copied to clipboard!"); showCopiedMessage(elementId); }).catch(err => { console.error("Async clipboard copy failed:", err); fallbackCopyToClipboard(textToCopy, elementId); }); } else { fallbackCopyToClipboard(textToCopy, elementId); } }
function fallbackCopyToClipboard(text, elementId) { const textArea = document.createElement("textarea"); textArea.value = text; textArea.style.position = "fixed"; textArea.style.top = "-9999px"; textArea.style.left = "-9999px"; document.body.appendChild(textArea); textArea.focus(); textArea.select(); try { const successful = document.execCommand("copy"); if (successful) { showToast("Copied to clipboard!"); showCopiedMessage(elementId); } else { showToast("Failed to copy", true); } } catch (err) { console.error("Fallback copy failed:", err); showToast("Failed to copy", true); } document.body.removeChild(textArea); }
function showCopiedMessage(elementId) { const messageId = `copied-${elementId}`; const messageEl = document.getElementById(messageId); if (messageEl) { messageEl.style.display = "inline"; setTimeout(() => { messageEl.style.display = "none"; }, 1500); } }

// --- Dark Mode ---
function toggleDarkMode() { const isDark = document.body.classList.toggle('dark-mode'); localStorage.setItem('darkMode', isDark); if (darkModeToggleBtn) darkModeToggleBtn.textContent = isDark ? '☀️' : '🌗'; console.log(`Dark mode toggled: ${isDark}`); }

// --- Game 1 (Guess the Word) Logic ---
async function prepareGame1() { console.log("Preparing Game 1..."); secretWord = wordList[Math.floor(Math.random() * wordList.length)]; console.log("New secret word:", secretWord); try { targetHash = await hashString(secretWord); console.log("Target Hash:", targetHash); if (hashDisplay) hashDisplay.textContent = targetHash; } catch (e) { console.error("Failed to set target hash", e); if (hashDisplay) hashDisplay.textContent = "Error"; } if (clueSpan) clueSpan.innerHTML = `It's a ${categoryLabel.toLowerCase()}, a ${secretWord.length}-letter word, lowercase only.`; attempts = 0; if (gameResultDiv) gameResultDiv.innerHTML = ""; if (guessInput) { guessInput.value = ""; guessInput.disabled = false; guessInput.focus(); } if (submitGuessBtn) submitGuessBtn.disabled = false; }
async function checkGuess() { if (!guessInput || !gameResultDiv) return; guessInput.value = guessInput.value.toLowerCase().trim(); const guess = guessInput.value; if (!guess) return; guessInput.value = ""; let guessedHash = "Error"; try { guessedHash = await hashString(guess); console.log("Guessed hash:", guessedHash); } catch (e) { console.error("Hash failed", e); } console.log("Target hash:", targetHash); if (guess === secretWord) { streak++; gameResultDiv.innerHTML = `<div class='quiz-feedback correct fade-in'>✅ Correct! "${guess}" matches!<br/><span style='display: block; margin-top: 0.5rem; font-family: monospace;'>Hash:<br><mark style='background-color: #d6f5e6; color: #207544; word-break: break-word; display: inline-block;'>${guessedHash}</mark></span></div>`; if(guessInput) guessInput.disabled = true; if (submitGuessBtn) submitGuessBtn.disabled = true; gameResultDiv.innerHTML += `<button onclick="prepareGame1()" style="margin-left: 1rem; margin-top: 0.5rem;">Next Word</button>`; } else { streak = 0; attempts++; let hints = [ `Starts with '${secretWord.charAt(0)}'.`, `Second letter is '${secretWord.charAt(1)}'.`, `Ends with '${secretWord.charAt(secretWord.length - 1)}'.`, secretWord.length > 3 ? `Third is '${secretWord.charAt(2)}'.` : '', secretWord.length > 4 ? `Fourth is '${secretWord.charAt(3)}'.` : '', secretWord.length > 5 ? `Fifth is '${secretWord.charAt(4)}'.` : '' ].filter(Boolean); let newHint = attempts - 1 < hints.length ? hints[attempts - 1] : `Try rearranging thoughts! 😉`; if (clueSpan) { let hintDiv = clueSpan.querySelector(`.hint-highlight.hint-${attempts}`); if (!hintDiv) { hintDiv = document.createElement('div'); hintDiv.className = `hint-highlight hint-${attempts}`; clueSpan.appendChild(hintDiv); } hintDiv.innerHTML = `Hint ${attempts}: ${newHint}`; } else { console.error("Clue span missing for hint"); } gameResultDiv.innerHTML = `<div class='quiz-feedback incorrect fade-in'>❌ Nope. "${guess}"<br/><pre style='margin:0;padding:0;font-family:monospace;white-space:pre-wrap;word-wrap:break-word;line-height:1.2;'><span style='display:inline-block;margin-top:0.5rem;'>Your Hash:</span><mark style='background-color:#ffd6d6;color:#b22222;word-break:break-all;'>${guessedHash}</mark><span style='display:inline-block;margin-top:0.5rem;' class='target-hash-label'>Target Hash:</span><mark style='background-color:#f0f0f0;color:#333;word-break:break-all;' class='target-hash-value'>${targetHash}</mark></pre></div>`; if(guessInput) guessInput.focus(); } }

// --- Quiz Logic ---
function quizIsInProgress() { return numQuestions > 0 && quizIndex > 0 && quizIndex < numQuestions; }
function resetQuizState() { console.log("Resetting quiz state."); quizIndex = 0; correctAnswers = 0; numQuestions = 0; currentQuizQuestions = []; if(quizQuestionElement) quizQuestionElement.textContent = ""; if(quizOptionsContainer) quizOptionsContainer.innerHTML = ""; if(quizResultDiv) quizResultDiv.innerHTML = ""; if(quizCompletionProgressBar) { quizCompletionProgressBar.style.width = '0%'; quizCompletionProgressBar.textContent = '0% Complete'; } if(quizScoreProgressBar) { quizScoreProgressBar.style.width = '0%'; quizScoreProgressBar.textContent = '0% Score'; } }
// ** startQuiz with checks **
function startQuiz() {
    console.log("Executing startQuiz()...");
    quizIndex = 0;
    correctAnswers = 0;
    lastQuizScorePercent = -1;

    if (!Array.isArray(allQuizQuestions) || allQuizQuestions.length === 0) {
         console.error("ERROR: allQuizQuestions is not a valid array or is empty!");
          if(quizResultDiv) quizResultDiv.innerHTML = "<p style='color:red;'>Error: Quiz questions could not be loaded.</p>";
         return;
    }

    console.log("DEBUG: Calling shuffleArray with allQuizQuestions...");
    const shuffledQuestions = shuffleArray(allQuizQuestions);

    if (!Array.isArray(shuffledQuestions)) {
        console.error("ERROR: shuffleArray did not return a valid array! Got:", shuffledQuestions);
         if(quizResultDiv) quizResultDiv.innerHTML = "<p style='color:red;'>Error: Failed to shuffle quiz questions.</p>";
        return;
    }
    console.log("DEBUG: shuffleArray returned successfully. Length:", shuffledQuestions.length);

    currentQuizQuestions = shuffledQuestions.slice(0, 4);
    numQuestions = currentQuizQuestions.length;
    console.log("Number of questions selected:", currentQuizQuestions.length);

    if (!quizQuestionElement || !quizOptionsContainer || !quizResultDiv || !quizCompletionProgressBar || !quizScoreProgressBar) {
        console.error("Quiz elements missing!");
        return;
    }
    updateQuizProgressBars();
    console.log("Calling showNextQuizQuestion() from startQuiz...");
    showNextQuizQuestion();
}
function updateQuizProgressBars() { if (!quizCompletionProgressBar || !quizScoreProgressBar) return; const completionPercent = numQuestions > 0 ? Math.round(((quizIndex) / numQuestions) * 100) : 0; const scorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0; quizCompletionProgressBar.style.width = `${completionPercent}%`; quizCompletionProgressBar.textContent = `${completionPercent}% Complete`; quizScoreProgressBar.style.width = `${scorePercent}%`; quizScoreProgressBar.textContent = `${scorePercent}% Score`; }
function showFinalQuizResults() { console.log("Quiz finished."); const finalScorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0; lastQuizScorePercent = finalScorePercent; console.log("Stored lastQuizScorePercent:", lastQuizScorePercent); updateMainMenuScoreDisplay(); if (quizResultDiv) { quizResultDiv.innerHTML = `<div class='quiz-feedback ${finalScorePercent >= 66 ? "correct" : "incorrect"}'>Quiz Complete! Score: ${correctAnswers}/${numQuestions} (${finalScorePercent}%).</div>`; quizResultDiv.innerHTML += `<button onclick='startQuiz()' style="margin-left: 0.5rem; margin-top: 1rem;">Try Quiz Again</button>`; } }
// ** showNextQuizQuestion with DEBUG logs **
function showNextQuizQuestion() {
    if (!quizQuestionElement || !quizOptionsContainer || !quizResultDiv) { console.error("ERROR: Quiz elements missing for next question."); return; }
    console.log(`DEBUG: Showing quiz question ${quizIndex + 1} of ${numQuestions}`);
    updateQuizProgressBars();
    if (!currentQuizQuestions || currentQuizQuestions.length === 0 || quizIndex >= currentQuizQuestions.length) { console.error("ERROR: Invalid quiz questions data or index out of bounds.", "Index:", quizIndex, "Questions:", currentQuizQuestions); if(quizResultDiv) quizResultDiv.innerHTML = "<p style='color:red;'>Error loading quiz question data.</p>"; return; }
    const current = currentQuizQuestions[quizIndex];
    console.log("DEBUG: Current question object:", current);
    if (!current || !current.question || !current.options) { console.error("ERROR: Current question object is malformed:", current); if(quizResultDiv) quizResultDiv.innerHTML = "<p style='color:red;'>Error: Question data is incomplete.</p>"; return; }
    quizQuestionElement.textContent = `${quizIndex + 1}. ${current.question}`;
    console.log("DEBUG: Question text set to:", quizQuestionElement.textContent);
    quizOptionsContainer.innerHTML = ""; quizResultDiv.innerHTML = ""; console.log("DEBUG: Cleared previous options and results.");
    console.log("DEBUG: Looping through options for current question...");
    if (!Array.isArray(current.options)) { console.error("ERROR: current.options is not an array!", current.options); return; }
    current.options.sort(() => Math.random() - 0.5).forEach((option, index) => {
        if (!option || typeof option.text === 'undefined' || typeof option.value === 'undefined') { console.warn(`DEBUG: Skipping invalid option at index ${index}:`, option); return; }
        console.log(`DEBUG: Creating div for option: ${option.text}`);
        const div = document.createElement("div"); div.className = "quiz-option"; div.textContent = option.text;
        div.onclick = () => {
            console.log(`DEBUG: Answered Q${quizIndex + 1} with: ${option.text}`);
            const allOptions = quizOptionsContainer.querySelectorAll('.quiz-option');
            allOptions.forEach(opt => { opt.style.pointerEvents = 'none'; opt.style.cursor = 'default'; if (opt !== div) opt.style.opacity = '0.6'; });
            const isCorrect = option.value === current.correct;
            if (isCorrect) { div.style.backgroundColor = '#d1e7dd'; div.style.borderColor = '#badbcc'; div.style.color = '#0f5132'; div.style.fontWeight = 'bold'; correctAnswers++;
            } else { div.style.backgroundColor = '#f8d7da'; div.style.borderColor = '#f5c2c7'; div.style.color = '#842029'; div.style.fontWeight = 'bold';
                allOptions.forEach(opt => { const originalOption = current.options.find(o => o && o.text === opt.textContent); if (originalOption && originalOption.value === current.correct) { opt.style.backgroundColor = '#d1e7dd'; opt.style.borderColor = '#badbcc'; opt.style.color = '#0f5132'; opt.style.opacity = '1'; } });
            }
            console.log("DEBUG: Current Score:", correctAnswers, "out of", quizIndex + 1);
            quizIndex++; updateQuizProgressBars();
            if (quizIndex >= numQuestions) { setTimeout(showFinalQuizResults, 1000);
            } else { setTimeout(() => { if (quizResultDiv) { const nextBtn = document.createElement("button"); nextBtn.textContent = "Next Question →"; nextBtn.style.marginTop = "1rem"; nextBtn.onclick = showNextQuizQuestion; quizResultDiv.innerHTML = ''; quizResultDiv.appendChild(nextBtn); console.log("DEBUG: Added 'Next Question' button."); } }, 1000); }
        }; // end div.onclick
        try { quizOptionsContainer.appendChild(div); console.log(`DEBUG: Successfully appended option: ${option.text}`);
        } catch (error) { console.error("ERROR: Failed to append option div:", error, "Option:", option); }
    }); // end forEach option
    console.log("DEBUG: Finished processing options for question", quizIndex + 1);
}


// --- Bonus Game Logic ---
function prepareBonusGame() { console.log("Preparing Bonus Game..."); if (bonusTargetHashEl) { bonusTargetHashEl.textContent = bonusTargetHashValue; } if (bonusSelect) bonusSelect.value = ""; if (bonusHashDisplay) bonusHashDisplay.innerHTML = '<code style="visibility: hidden;">Placeholder</code>'; if (bonusResult) bonusResult.innerHTML = ""; const guessOptions = document.querySelectorAll('#bonusGuessOptions .country-guess-option'); guessOptions.forEach(opt => { opt.disabled = false; opt.classList.remove('correct-guess', 'incorrect-guess'); }); }
async function updateBonusHashDisplay() { if (!bonusSelect || !bonusHashDisplay) return; const selectedCountry = bonusSelect.value; if (selectedCountry) { bonusHashDisplay.innerHTML = `<code>Calculating...</code>`; try { const selectedHash = await hashString(selectedCountry); console.log(`Hash for ${selectedCountry}: ${selectedHash}`); bonusHashDisplay.innerHTML = `<code>Hash for ${selectedCountry}:<br>${selectedHash}</code>`; } catch(e){ bonusHashDisplay.innerHTML = `<code>Error hashing</code>`; } } else { bonusHashDisplay.innerHTML = '<code style="visibility: hidden;">Placeholder</code>'; } }
function checkBonusGuess(guessedCountry, buttonElement) { if (!bonusResult || !buttonElement) return; console.log(`Bonus guess: ${guessedCountry}, Correct: ${bonusCorrectCountry}`); const allGuessOptions = document.querySelectorAll('#bonusGuessOptions .country-guess-option'); allGuessOptions.forEach(opt => { if (opt !== buttonElement) opt.classList.remove('incorrect-guess'); }); if (guessedCountry === bonusCorrectCountry) { buttonElement.classList.remove('incorrect-guess'); buttonElement.classList.add('correct-guess'); bonusResult.innerHTML = `<div class='quiz-feedback correct fade-in'>✅ Correct! Maria chose ${bonusCorrectCountry}.</div>`; allGuessOptions.forEach(opt => opt.disabled = true); } else { buttonElement.classList.add('incorrect-guess'); bonusResult.innerHTML = `<div class='quiz-feedback incorrect fade-in'>❌ Incorrect. Try again!</div>`; } }


// --- Hashing Tool Logic ---
function prepareHashTool() { console.log("Preparing Hash Tool view..."); if (toolTextInput) { toolTextInput.value = ""; toolTextInput.focus(); } if (toolResultsDiv) toolResultsDiv.innerHTML = ""; }
async function showToolHashes() { if (!toolTextInput || !toolResultsDiv) return; const inputValue = toolTextInput.value; console.log("Generating tool hashes for:", inputValue); toolResultsDiv.innerHTML = "<p><em>Generating hashes...</em></p>"; let sha256 = "Error"; let sha512 = "Error"; try { sha256 = await shaHash(inputValue, "SHA-256"); sha512 = await shaHash(inputValue, "SHA-512"); console.log("Tool SHA-256:", sha256); console.log("Tool SHA-512:", sha512); toolResultsDiv.innerHTML = `<div><h3>SHA-256:</h3><code id="toolSha256" style="word-break: break-all;">${sha256}</code><button class='copy-btn' onclick="copyToClipboard('toolSha256')">Copy</button><span id="copied-toolSha256" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div> <div style="margin-top: 1rem;"><h3>SHA-512:</h3><code id="toolSha512" style="word-break: break-all;">${sha512}</code><button class='copy-btn' onclick="copyToClipboard('toolSha512')">Copy</button><span id="copied-toolSha512" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div>`; } catch (error) { console.error("Hashing error:", error); toolResultsDiv.innerHTML = "<p style='color: red;'>Error generating hashes.</p>"; } }


// --- Initialize ---
document.addEventListener('DOMContentLoaded', initializeGame);