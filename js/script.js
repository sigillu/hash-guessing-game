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

const views = [mainMenu, lessonSection, gameSection, quizSection, summarySection, bonusGameSection, hashToolSection];

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
const quizMainMenuBtn = quizSection?.querySelector('.main-menu-btn'); // Use optional chaining

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
const wordCategories = {
  drinks: ["water", "juice", "latte", "cider", "mocha", "tonic", "shake", "pepsi", "lager"],
};
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
let targetHash = "";
let attempts = 0;
let streak = 0;
let lastQuizScorePercent = -1;
let bonusTargetHashValue = "";

// Quiz State
let currentQuizQuestions = [];
let quizIndex = 0;
let correctAnswers = 0;
let numQuestions = 0;

// --- Core Hashing Functions ---
async function hashString(str) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  } catch (error) {
      console.error("Error in hashString:", error);
      return "Error hashing"; // Return an error string
  }
}

async function shaHash(input, algorithm) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
      console.error(`Error in shaHash (${algorithm}):`, error);
      return `Error hashing (${algorithm})`;
  }
}

// --- Navigation Functions ---
function hideAllViews() {
  console.log("Hiding all views...");
  views.forEach(view => {
    if (view) view.classList.add('hidden');
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

// --- Main Menu Score Display ---
function updateMainMenuScoreDisplay() {
    if (!mainMenuScoreDisplay) return;
    console.log(`Updating score display. Last score: ${lastQuizScorePercent}%`);

    let scoreMessage = "Complete the Quick Quiz to see your score!";
    let scoreClass = "";

    if (lastQuizScorePercent >= 66) {
        scoreMessage = `🎉🏆✨ Your latest quiz score was: <strong>${lastQuizScorePercent}%</strong> ✨🏆🎉`;
        scoreClass = "score-highlight";
    } else if (lastQuizScorePercent >= 0) {
        scoreMessage = `Your latest quiz score was: <strong>${lastQuizScorePercent}%</strong>`;
    }

    mainMenuScoreDisplay.innerHTML = `<p>${scoreMessage}</p>`;

    if (scoreClass) {
        mainMenuScoreDisplay.classList.add(scoreClass);
    } else {
        mainMenuScoreDisplay.classList.remove(scoreClass);
    }
}

// --- Game Initialization ---
async function initializeGame() {
  console.log("Initializing game (Alternative Version)...");

  // Dark Mode Init
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    if (darkModeToggleBtn) darkModeToggleBtn.textContent = '☀️';
  } else {
    if (darkModeToggleBtn) darkModeToggleBtn.textContent = '🌗';
  }
  if (darkModeToggleBtn) darkModeToggleBtn.onclick = toggleDarkMode; // FIX: Attach listener

  // Initial Game Setup (Can be deferred until game start if preferred)
  categoryLabel = 'Drinks';
  wordList = wordCategories.drinks;
  secretWord = wordList[Math.floor(Math.random() * wordList.length)];
  console.log("Initial secret word:", secretWord);
  // Calculate initial targetHash for Game 1 (will be recalculated if they play again)
  targetHash = await hashString(secretWord); // Ensure targetHash is ready early
  console.log("Initial Target Hash (Game 1):", targetHash);

  // Calculate Bonus Game Hash
  try {
      bonusTargetHashValue = await hashString(bonusCorrectCountry);
      console.log("Bonus Target Hash (Game 2):", bonusTargetHashValue);
      if (bonusTargetHashEl) {
          bonusTargetHashEl.textContent = bonusTargetHashValue; // FIX: Ensure element exists before update
      } else {
           console.error("Bonus Target Hash element not found");
      }
  } catch (e) {
      console.error("Failed to calculate bonus hash", e);
      if (bonusTargetHashEl) bonusTargetHashEl.textContent = "Error";
  }


  // --- Setup Event Listeners ---

  // Main Menu Navigation
  if (navLessonBtn) navLessonBtn.onclick = () => showView('lesson');
  if (navGame1Btn) navGame1Btn.onclick = () => { showView('game'); prepareGame1(); };
  if (navGame2Btn) navGame2Btn.onclick = () => { showView('bonusGame'); prepareBonusGame(); };
  if (navQuizBtn) navQuizBtn.onclick = () => { showView('quiz'); startQuiz(); };
  if (navSummaryBtn) navSummaryBtn.onclick = () => showView('summary');
  if (navHashToolBtn) navHashToolBtn.onclick = () => { showView('hashTool'); prepareHashTool(); };

  // Footer Buttons
  if (rateGameBtn) rateGameBtn.onclick = () => showToast('Rating feature coming soon!', true);

  // "Main Menu" buttons within each section
  document.querySelectorAll('.main-menu-btn').forEach(button => {
      const parentSection = button.closest('.section'); // Find parent section
      if (parentSection && parentSection.id === 'quiz') {
          // Special handling for quiz button handled separately below
      } else {
           button.onclick = showMainMenu; // Assign directly for non-quiz sections
      }
  });

  // Quiz "Main Menu" Button Listener (with confirmation) - FIX: Ensure it's correctly set up
  if (quizMainMenuBtn) {
      console.log("Attaching listener to Quiz Main Menu button");
      quizMainMenuBtn.onclick = () => { // Use onclick directly for simplicity here
          console.log("Quiz Main Menu button clicked");
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
  if (submitGuessBtn) submitGuessBtn.onclick = checkGuess;
  if (guessInput) {
    guessInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") { event.preventDefault(); checkGuess(); }
    });
  }

  // Bonus Game Listener
  if (bonusSelect) {
     bonusSelect.onchange = updateBonusHashDisplay;
  } else {
      console.error("Bonus Country Select element not found");
  }

  // Hash Tool Listener
  if (generateHashesBtn) {
      generateHashesBtn.onclick = showToolHashes;
  } else {
       console.error("Generate Hashes button not found");
  }
   if (toolTextInput) {
       toolTextInput.addEventListener("keydown", function (e) {
         if (e.key === "Enter") { e.preventDefault(); showToolHashes(); }
       });
   } else {
        console.error("Tool Text Input element not found");
   }

  // --- Initial View ---
  showMainMenu(); // Start by showing the main menu
  console.log("Initialization complete.");
}

// --- Helper Functions ---
function shuffleArray(array) { /* ... (Keep original) ... */ }
function showToast(message, isInfo = false) { /* ... (Keep original) ... */ }
function copyToClipboard(elementId) { /* ... (Keep original, adapt if IDs changed) ... */ }
function fallbackCopyToClipboard(text, elementId) { /* ... (Keep original) ... */ }
function showCopiedMessage(elementId) { /* ... (Keep original) ... */ }

// --- Dark Mode ---
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark);
  if (darkModeToggleBtn) darkModeToggleBtn.textContent = isDark ? '☀️' : '🌗';
  console.log(`Dark mode toggled: ${isDark}`);
  // showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', true); // Optional toast
}

// --- Game 1 (Guess the Word) Logic ---
async function prepareGame1() {
    console.log("Preparing Game 1...");
    // Ensure secret word is selected if not already done (e.g., after winning)
    if (!secretWord) { // Select a new word if needed
         secretWord = wordList[Math.floor(Math.random() * wordList.length)];
         console.log("New secret word selected:", secretWord);
    }
    // Calculate target hash for the *current* secret word
    try {
        targetHash = await hashString(secretWord); // Recalculate
        console.log("Target Hash for Game 1:", targetHash);
        if (hashDisplay) {
            hashDisplay.textContent = targetHash; // FIX: Update UI after await
        } else {
            console.error("Hash Display element not found");
        }
    } catch (e) {
        console.error("Failed to calculate target hash for game 1", e);
        if (hashDisplay) hashDisplay.textContent = "Error";
    }


    // Reset hints and attempts
    if (clueSpan) {
        clueSpan.innerHTML = `It's a ${categoryLabel.toLowerCase()}, a ${secretWord.length}-letter word, lowercase only.`; // Clear old hints
    } else {
        console.error("Clue span element not found");
    }
    attempts = 0;
    // streak = 0; // Don't reset streak here, only on incorrect guess

    // Reset UI elements
    if (gameResultDiv) gameResultDiv.innerHTML = "";
    if (guessInput) {
        guessInput.value = "";
        guessInput.disabled = false;
        guessInput.focus();
    }
    if (submitGuessBtn) submitGuessBtn.disabled = false;
}

async function checkGuess() {
    if (!guessInput || !gameResultDiv) {
        console.error("Guess input or result div missing");
        return;
    }
    guessInput.value = guessInput.value.toLowerCase().trim();
    const guess = guessInput.value;
    console.log("Checking guess:", guess);
    if (!guess) return;

    guessInput.value = ""; // Clear input field

    let guessedHash = "Error"; // Default
    try {
        guessedHash = await hashString(guess); // Hash the guess
        console.log("Guessed hash:", guessedHash); // FIX: Log result
    } catch (e) {
        console.error("Failed to calculate guessed hash", e);
    }

    console.log("Comparing with Target hash:", targetHash); // FIX: Log target hash

    if (guess === secretWord) {
        console.log("Guess CORRECT");
        streak++;
        gameResultDiv.innerHTML = `<div class='quiz-feedback correct fade-in'>✅ Correct! "${guess}" matches the secret word!<br/><span style='display: block; margin-top: 0.5rem; font-family: monospace;'>Hash:<br><mark style='background-color: #d6f5e6; color: #207544; word-break: break-word; display: inline-block;'>${guessedHash}</mark></span><br/>It matches the target hash.</div>`; // FIX: Display correct hash
        guessInput.disabled = true;
        if (submitGuessBtn) submitGuessBtn.disabled = true;

        // Prepare for next word
        secretWord = ""; // Clear secret word so prepareGame1 selects a new one
        gameResultDiv.innerHTML += `<button onclick="prepareGame1()" style="margin-left: 1rem; margin-top: 0.5rem;">Next Word</button>`;

    } else {
        console.log("Guess INCORRECT");
        streak = 0;
        attempts++;

        let hints = [
          `The word starts with '${secretWord.charAt(0)}'.`,
          `The second letter is '${secretWord.charAt(1)}'.`,
          `The word ends with '${secretWord.charAt(secretWord.length - 1)}'.`,
          secretWord.length > 3 ? `The third letter is '${secretWord.charAt(2)}'.` : '',
          secretWord.length > 4 ? `The fourth letter is '${secretWord.charAt(3)}'.` : '',
          secretWord.length > 5 ? `The fifth letter is '${secretWord.charAt(4)}'.` : ''
        ].filter(Boolean);

        let newHint = attempts - 1 < hints.length ? hints[attempts - 1] : `Try rearranging your thoughts! 😉`;
        console.log("Hint:", newHint);

        // FIX: Ensure hints are displayed
        if (clueSpan) {
            let hintDiv = clueSpan.querySelector(`.hint-highlight.hint-${attempts}`);
            if (!hintDiv) {
                hintDiv = document.createElement('div');
                hintDiv.className = `hint-highlight hint-${attempts}`;
                clueSpan.appendChild(hintDiv);
                console.log("Appended new hint div");
            } else {
                 console.log("Found existing hint div");
            }
            hintDiv.innerHTML = `Hint ${attempts}: ${newHint}`;
        } else {
             console.error("Clue span element not found for hint");
        }

        // FIX: Display correct hashes in feedback
        gameResultDiv.innerHTML = `<div class='quiz-feedback incorrect fade-in'>❌ Nope. You entered: "${guess}"<br/>
<pre style='margin: 0; padding: 0; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; line-height: 1.2;'>
<span style='display: inline-block; margin-top: 0.5rem;'>Your Hash:</span>
<mark style='background-color: #ffd6d6; color: #b22222; word-break: break-all;'>${guessedHash}</mark>
<span style='display: inline-block; margin-top: 0.5rem;' class='target-hash-label'>Target Hash:</span>
<mark style='background-color: #f0f0f0; color: #333; word-break: break-all;' class='target-hash-value'>${targetHash}</mark>
</pre>
<p style="font-weight: normal; margin-top: 0.75rem; font-size: 0.9em;">See how different your hash is? Keep guessing!</p>
</div>`;
        guessInput.focus();
    }
}

// --- Quiz Logic ---
function quizIsInProgress() {
    const inProgress = numQuestions > 0 && quizIndex > 0 && quizIndex < numQuestions;
    // console.log(`Quiz in progress check: ${inProgress} (Index: ${quizIndex}, NumQ: ${numQuestions})`);
    return inProgress;
}

function resetQuizState() {
    console.log("Resetting quiz state.");
    quizIndex = 0;
    correctAnswers = 0;
    numQuestions = 0;
    currentQuizQuestions = [];
    // Don't reset lastQuizScorePercent here, only when starting a *new* quiz attempt
     if(quizQuestionElement) quizQuestionElement.textContent = "";
     if(quizOptionsContainer) quizOptionsContainer.innerHTML = "";
     if(quizResultDiv) quizResultDiv.innerHTML = "";
     if(quizCompletionProgressBar) { quizCompletionProgressBar.style.width = '0%'; quizCompletionProgressBar.textContent = '0% Complete'; }
     if(quizScoreProgressBar) { quizScoreProgressBar.style.width = '0%'; quizScoreProgressBar.textContent = '0% Score'; }
}

function startQuiz() {
  console.log("Starting Quiz...");
  // Reset state variables for a fresh quiz attempt
  quizIndex = 0;
  correctAnswers = 0;
  // lastQuizScorePercent = -1; // Reset only when quiz *completes* or is abandoned mid-way? Let's reset here for safety.
  lastQuizScorePercent = -1;

  const shuffledQuestions = shuffleArray([...allQuizQuestions]);
  currentQuizQuestions = shuffledQuestions.slice(0, 4);
  numQuestions = currentQuizQuestions.length;
  console.log("Selected Questions:", currentQuizQuestions.map(q => q.question));

  if (!quizQuestionElement || !quizOptionsContainer || !quizResultDiv || !quizCompletionProgressBar || !quizScoreProgressBar) {
    console.error("Quiz elements not found!");
    return; // Exit if essential elements are missing
  }

  updateQuizProgressBars(); // Set initial progress (0%)
  showNextQuizQuestion();
}

function updateQuizProgressBars() {
  // Ensure elements exist before updating
  if (!quizCompletionProgressBar || !quizScoreProgressBar) return;

  const completionPercent = numQuestions > 0 ? Math.round(((quizIndex) / numQuestions) * 100) : 0;
  const scorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0;

  quizCompletionProgressBar.style.width = `${completionPercent}%`;
  quizCompletionProgressBar.textContent = `${completionPercent}% Complete`;
  quizScoreProgressBar.style.width = `${scorePercent}%`;
  quizScoreProgressBar.textContent = `${scorePercent}% Score`;
}

function showFinalQuizResults() {
  console.log("Quiz finished. Showing final results.");
  const finalScorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0;
  lastQuizScorePercent = finalScorePercent; // Store final score
  console.log("Stored lastQuizScorePercent:", lastQuizScorePercent);
  updateMainMenuScoreDisplay(); // Update main menu display

  if (quizResultDiv) {
      quizResultDiv.innerHTML = `<div class='quiz-feedback ${finalScorePercent >= 66 ? "correct" : "incorrect"}'>Quiz Complete! You scored ${correctAnswers} out of ${numQuestions} (${finalScorePercent}%).</div>`;
      quizResultDiv.innerHTML += `<button onclick='startQuiz()' style="margin-left: 0.5rem; margin-top: 1rem;">Try Quiz Again</button>`; // Add margin-top
  }
  // Quiz is now considered finished
  // Make sure quizIsInProgress() returns false now
}

function showNextQuizQuestion() {
    // Ensure elements exist
    if (!quizQuestionElement || !quizOptionsContainer || !quizResultDiv) {
         console.error("Cannot show next quiz question - elements missing.");
         return;
    }
  console.log(`Showing quiz question ${quizIndex + 1} of ${numQuestions}`);
  updateQuizProgressBars();

  // FIX: Ensure currentQuizQuestions has data
  if (!currentQuizQuestions || currentQuizQuestions.length === 0 || quizIndex >= currentQuizQuestions.length) {
      console.error("Quiz questions data is invalid or index out of bounds.");
      // Potentially show an error message or reset quiz?
      if (quizResultDiv) quizResultDiv.innerHTML = "<p style='color: red;'>Error loading quiz question.</p>";
      return;
  }

  const current = currentQuizQuestions[quizIndex];
  quizQuestionElement.textContent = `${quizIndex + 1}. ${current.question}`;
  quizOptionsContainer.innerHTML = ""; // Clear previous options
  quizResultDiv.innerHTML = "";    // Clear previous result/button

  // FIX: Ensure options are displayed
  current.options.sort(() => Math.random() - 0.5).forEach(option => {
    const div = document.createElement("div");
    div.className = "quiz-option";
    div.textContent = option.text;
    console.log('Adding option:', option.text); // Debug log
    div.onclick = () => {
      console.log(`Answered question ${quizIndex + 1}`);
      const allOptions = quizOptionsContainer.querySelectorAll('.quiz-option');
      allOptions.forEach(opt => { opt.style.pointerEvents = 'none'; opt.style.cursor = 'default'; if (opt !== div) opt.style.opacity = '0.6'; });

      const isCorrect = option.value === current.correct;
      if (isCorrect) {
        div.style.backgroundColor = '#d1e7dd'; div.style.borderColor = '#badbcc'; div.style.color = '#0f5132'; div.style.fontWeight = 'bold';
        correctAnswers++;
      } else {
        div.style.backgroundColor = '#f8d7da'; div.style.borderColor = '#f5c2c7'; div.style.color = '#842029'; div.style.fontWeight = 'bold';
         allOptions.forEach(opt => {
             const originalOption = current.options.find(o => o.text === opt.textContent);
             if (originalOption && originalOption.value === current.correct) {
                opt.style.backgroundColor = '#d1e7dd'; opt.style.borderColor = '#badbcc'; opt.style.color = '#0f5132'; opt.style.opacity = '1';
             }
         });
      }
      console.log("Current Score:", correctAnswers, "out of", quizIndex + 1);

      quizIndex++;
      updateQuizProgressBars();

      if (quizIndex >= numQuestions) {
         setTimeout(() => { showFinalQuizResults(); }, 1000);
      } else {
         setTimeout(() => {
             if (quizResultDiv) {
                 const nextBtn = document.createElement("button");
                 nextBtn.textContent = "Next Question →";
                 nextBtn.style.marginTop = "1rem"; // Add spacing
                 nextBtn.onclick = showNextQuizQuestion;
                 quizResultDiv.innerHTML = '';
                 quizResultDiv.appendChild(nextBtn);
             }
         }, 1000);
      }
    }; // end div.onclick
    quizOptionsContainer.appendChild(div); // Add the option div
  }); // end forEach option
   console.log("Finished adding options for question", quizIndex + 1);
}


// --- Bonus Game Logic ---
function prepareBonusGame() {
     console.log("Preparing Bonus Game...");
     if (!bonusTargetHashValue && bonusTargetHashEl) { // Recalculate if missing (e.g., initial error)
         hashString(bonusCorrectCountry).then(hash => {
             bonusTargetHashValue = hash;
             bonusTargetHashEl.textContent = bonusTargetHashValue;
         }).catch(e => console.error("Failed to recalc bonus hash"));
     } else if (bonusTargetHashEl) {
         bonusTargetHashEl.textContent = bonusTargetHashValue; // Ensure it's displayed
     }

     if (bonusSelect) bonusSelect.value = "";
     if (bonusHashDisplay) bonusHashDisplay.innerHTML = '<code style="visibility: hidden;">Placeholder</code>';
     if (bonusResult) bonusResult.innerHTML = "";
     const guessOptions = document.querySelectorAll('#bonusGuessOptions .country-guess-option');
     guessOptions.forEach(opt => {
         opt.disabled = false;
         opt.classList.remove('correct-guess', 'incorrect-guess');
     });
 }
async function updateBonusHashDisplay() {
    // FIX: Ensure function works correctly
    if (!bonusSelect || !bonusHashDisplay) return;
    const selectedCountry = bonusSelect.value;
    if (selectedCountry) {
        bonusHashDisplay.innerHTML = `<code>Calculating hash for ${selectedCountry}...</code>`;
        try {
            const selectedHash = await hashString(selectedCountry);
            console.log(`Hash for ${selectedCountry}: ${selectedHash}`); // Debug
            bonusHashDisplay.innerHTML = `<code>Hash for ${selectedCountry}:<br>${selectedHash}</code>`;
        } catch(e) {
             console.error("Failed to hash selected country", e);
             bonusHashDisplay.innerHTML = `<code>Error getting hash</code>`;
        }
    } else {
        bonusHashDisplay.innerHTML = '<code style="visibility: hidden;">Placeholder</code>';
    }
 }
function checkBonusGuess(guessedCountry, buttonElement) {
    // FIX: Ensure function works correctly
    if (!bonusResult || !buttonElement) return;
    console.log(`Bonus guess: ${guessedCountry}, Correct: ${bonusCorrectCountry}, Target Hash: ${bonusTargetHashValue}`);

    const allGuessOptions = document.querySelectorAll('#bonusGuessOptions .country-guess-option');
    // Clear previous incorrect styles *except* on the button just clicked
    allGuessOptions.forEach(opt => {
      if (opt !== buttonElement) opt.classList.remove('incorrect-guess');
    });

    if (guessedCountry === bonusCorrectCountry) {
      buttonElement.classList.remove('incorrect-guess'); // Just in case
      buttonElement.classList.add('correct-guess');
      bonusResult.innerHTML = `<div class='quiz-feedback correct fade-in'>✅ Correct! Maria chose ${bonusCorrectCountry}.</div>`;
      allGuessOptions.forEach(opt => opt.disabled = true);
      console.log("Bonus Correct!");
    } else {
      buttonElement.classList.add('incorrect-guess');
      bonusResult.innerHTML = `<div class='quiz-feedback incorrect fade-in'>❌ Incorrect. Try checking the hashes again!</div>`;
      console.log("Bonus Incorrect.");
      // Keep buttons enabled
    }
}

// --- Hashing Tool Logic ---
function prepareHashTool() {
    console.log("Preparing Hash Tool view...");
    if (toolTextInput) { toolTextInput.value = ""; toolTextInput.focus(); }
    if (toolResultsDiv) toolResultsDiv.innerHTML = "";
}
async function showToolHashes() {
  if (!toolTextInput || !toolResultsDiv) return;
  const inputValue = toolTextInput.value;
  console.log("Generating tool hashes for:", inputValue);

  toolResultsDiv.innerHTML = "<p><em>Generating hashes...</em></p>";
  let sha256 = "Error"; let sha512 = "Error"; // Defaults
  try {
     // FIX: Ensure await completes and results are stored
     sha256 = await shaHash(inputValue, "SHA-256");
     sha512 = await shaHash(inputValue, "SHA-512");
     console.log("Tool SHA-256:", sha256);
     console.log("Tool SHA-512:", sha512);

     // FIX: Update innerHTML *after* awaits complete
     toolResultsDiv.innerHTML = `
       <div><h3>SHA-256:</h3><code id="toolSha256" style="word-break: break-all;">${sha256}</code><button class='copy-btn' onclick="copyToClipboard('toolSha256')">Copy</button><span id="copied-toolSha256" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div>
       <div style="margin-top: 1rem;"><h3>SHA-512:</h3><code id="toolSha512" style="word-break: break-all;">${sha512}</code><button class='copy-btn' onclick="copyToClipboard('toolSha512')">Copy</button><span id="copied-toolSha512" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div>
     `;
  } catch (error) {
    console.error("Hashing error:", error);
    toolResultsDiv.innerHTML = "<p style='color: red;'>Error generating hashes. See console.</p>";
  }
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', initializeGame);