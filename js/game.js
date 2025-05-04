// js/game.js
// Initialization for the lesson section
export function init_lesson() {
  const btn = document.getElementById('showGameBtn');
  if (btn) {
    btn.addEventListener('click', () => location.hash = '#/game');
  }
}
window.init_lesson = init_lesson;

// Initialization for the game section
export function init_game() {
  // Inserted game logic from original index.html

    // --- DOM Element References ---
    const lessonSection = document.getElementById("lesson");
    const gameSection = document.getElementById("game");
    const quizSection = document.getElementById("quiz");
    const summarySection = document.getElementById("summary");
    const bonusGameSection = document.getElementById("bonusGame"); // New Bonus Game Section
    const exitSection = document.getElementById("exitScreen"); // Exit section reference
    const gameContainer = document.getElementById("gameContainer"); // Container for main game elements
    const darkModeToggleBtn = document.getElementById("darkModeToggle"); // Dark mode button

    // --- Game Configuration ---
    const wordCategories = {
      drinks: ["water", "juice", "latte", "cider", "mocha", "tonic", "shake", "pepsi", "lager"],
    };

    // --- Full Quiz Question Pool ---
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

    // --- Bonus Game Config ---
    const bonusCountries = ["Argentina", "Brazil", "Canada", "Colombia", "Peru"];
    const bonusCorrectCountry = "Peru";
    let bonusTargetHashValue = ""; // Will be calculated on init

    // --- Game State Variables ---
    let wordList = [];
    let categoryLabel = '';
    let secretWord = "";
    let targetHash = "";
    let attempts = 0;
    let score = 0; // Score for word guessing game
    let streak = 0;
    let lastQuizScorePercent = -1; // Variable to store the last quiz score percentage

    // --- Core Hashing Function ---
    async function hashString(str) {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    // --- Game Initialization (Called on page load) ---
    async function initializeGame() { // Made async to await hash calculation
        console.log("Initializing game..."); // Debug log
        categoryLabel = 'Drinks';
        wordList = wordCategories.drinks;
        secretWord = wordList[Math.floor(Math.random() * wordList.length)];
        console.log("Secret word:", secretWord); // Debug log

        // Calculate and store the target hash for the bonus game
        bonusTargetHashValue = await hashString(bonusCorrectCountry);
        console.log("Bonus Target Hash (Peru):", bonusTargetHashValue);
        const bonusTargetHashEl = document.getElementById("bonusTargetHash");
        if (bonusTargetHashEl) bonusTargetHashEl.textContent = bonusTargetHashValue;


        // Apply dark mode if needed
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            if (darkModeToggleBtn) darkModeToggleBtn.textContent = '☀️';
        } else {
             if (darkModeToggleBtn) darkModeToggleBtn.textContent = '🌗';
        }

        // Setup event listeners (check if elements exist)
        const showGameBtn = document.getElementById("showGameBtn");
        if (showGameBtn) showGameBtn.onclick = showGame;
        const submitGuessBtn = document.getElementById("submitGuessBtn");
        if (submitGuessBtn) submitGuessBtn.onclick = checkGuess;
        const goToQuizBtn = document.getElementById("goToQuizBtn"); // Button in nextStep div
        if (goToQuizBtn) goToQuizBtn.onclick = goToQuiz;
        const skipToQuizBtn = document.getElementById("skipToQuizBtn"); // New skip button
        if (skipToQuizBtn) skipToQuizBtn.onclick = goToQuiz; // Also calls goToQuiz
        const guessInput = document.getElementById("guessInput");
        if (guessInput) {
            guessInput.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    checkGuess();
                }
            });
        }
        // Back button listener
        const backBtn = document.getElementById("backToLessonBtn");
        if (backBtn) backBtn.onclick = goBackToLesson;
        // Bonus Game button listener
        const showBonusBtn = document.getElementById("showBonusGameBtn");
        if (showBonusBtn) showBonusBtn.onclick = showBonusGame;
        // Bonus Game dropdown listener
        const bonusSelect = document.getElementById("bonusCountrySelect");
        if (bonusSelect) bonusSelect.onchange = updateBonusHashDisplay;


        // Show only the lesson initially
        hideAllSections(); // Make sure all sections are hidden first
        if (lessonSection) lessonSection.classList.remove("hidden"); // Show lesson
        if (gameContainer) gameContainer.classList.remove("hidden"); // Ensure main container is visible
        window.scrollTo(0, 0); // Scroll to top on initial load
        console.log("Initialization complete. Lesson should be visible."); // Debug log
    }

    // --- Helper function to hide all main sections AND game container ---
    function hideAllSections() {
        console.log("Hiding all sections..."); // Debug log
        // Ensure elements exist before adding class
        if (lessonSection) lessonSection.classList.add("hidden");
        if (gameSection) gameSection.classList.add("hidden");
        if (quizSection) quizSection.classList.add("hidden");
        if (summarySection) summarySection.classList.add("hidden");
        if (bonusGameSection) bonusGameSection.classList.add("hidden"); // Hide bonus game
        if (exitSection) exitSection.classList.add("hidden"); // Also hide exit screen initially
        if (gameContainer) gameContainer.classList.add("hidden"); // Hide main game container
        console.log("Sections hidden."); // Debug log
    }


    // --- Start the Actual Guessing Game ---
    async function showGame() {
      console.log("Showing game section..."); // Debug log
      window.scrollTo(0, 0); // Scroll to top
      hideAllSections(); // Hide everything first
      if (gameSection) gameSection.classList.remove("hidden"); // Show game section
      if (gameContainer) gameContainer.classList.remove("hidden"); // Show main container

      // Ensure hash is generated before displaying
      targetHash = await hashString(secretWord);
      console.log("Target hash:", targetHash); // Debug log
      if (document.getElementById("hashDisplay")) document.getElementById("hashDisplay").textContent = targetHash;
      if (document.getElementById("clue")) document.getElementById("clue").innerHTML = `It's a drink, a ${secretWord.length}-letter word, lowercase only.`;

      // Reset game state for the round
      attempts = 0;
      if (document.getElementById("result")) document.getElementById("result").innerHTML = "";
      const guessInput = document.getElementById("guessInput");
      if (guessInput) {
          guessInput.value = "";
          guessInput.disabled = false; // Re-enable input
          guessInput.focus();
      }
       if (document.getElementById("submitGuessBtn")) document.getElementById("submitGuessBtn").disabled = false; // Re-enable button
       if (document.getElementById("nextStep")) document.getElementById("nextStep").classList.add("hidden");
       // Score display update removed
       console.log("Game section ready."); // Debug log
    }

    // --- Check User's Guess ---
    async function checkGuess() {
      const input = document.getElementById("guessInput");
      if (!input) return; // Exit if input not found
      input.value = input.value.toLowerCase().trim();
      const guess = input.value;
      console.log("Checking guess:", guess); // Debug log
      if (!guess) return;

      input.value = ""; // Clear input field after guess
      const guessedHash = await hashString(guess); // Hash the guess
      console.log("Guessed hash:", guessedHash); // Debug log
      const resultDiv = document.getElementById("result");
      if (!resultDiv) return; // Exit if result div not found
      const clueSpan = document.getElementById("clue"); // Reference to the clue span

      if (guess === secretWord) {
        // --- Correct Guess ---
        console.log("Guess CORRECT"); // Debug log
        score++; // This is the WORD GUESSING score
        console.log("Word guessing score incremented to:", score);
        streak++;
        resultDiv.innerHTML = `<div class='quiz-feedback correct fade-in'>✅ Correct! "${guess}" matches the secret word!<br/><span style='display: block; margin-top: 0.5rem; font-family: monospace;'>Hash:<br><mark style='background-color: #d6f5e6; color: #207544; word-break: break-word; display: inline-block;'>${guessedHash}</mark></span><br/>It matches the target hash. Hashes are one-way: you can calculate a hash from a word, but not the other way around. The only way to discover the word is by guessing and comparing.</div>`;
        if (document.getElementById("nextStep")) document.getElementById("nextStep").classList.remove("hidden"); // Show button to go to quiz
        input.disabled = true; // Disable input after correct guess
        if (document.getElementById("submitGuessBtn")) document.getElementById("submitGuessBtn").disabled = true; // Disable button after correct guess

      } else {
        // --- Incorrect Guess ---
         console.log("Guess INCORRECT"); // Debug log
        streak = 0; // Reset streak
        attempts++;

        // Provide hints based on the number of attempts
        let hints = [
          `The word starts with '${secretWord.charAt(0)}'.`,
          `The second letter is '${secretWord.charAt(1)}'.`,
          `The word ends with '${secretWord.charAt(secretWord.length - 1)}'.`,
          secretWord.length > 3 ? `The third letter is '${secretWord.charAt(2)}'.` : '',
          secretWord.length > 4 ? `The fourth letter is '${secretWord.charAt(3)}'.` : '',
          secretWord.length > 5 ? `The fifth letter is '${secretWord.charAt(4)}'.` : ''
        ].filter(Boolean); // Filter out empty hints (for short words)

        let newHint = attempts - 1 < hints.length ? hints[attempts - 1] : `Try rearranging your thoughts! 😉`;
        console.log("Hint:", newHint); // Debug log

        // Add hint to clue area if it exists
        if (clueSpan) {
            let hintDiv = clueSpan.querySelector(`.hint-highlight.hint-${attempts}`);
            if (!hintDiv) {
                hintDiv = document.createElement('div');
                hintDiv.className = `hint-highlight hint-${attempts}`; // Add class to identify specific hint
                clueSpan.appendChild(hintDiv);
            }
            hintDiv.innerHTML = `Hint ${attempts}: ${newHint}`; // Update or set hint text
        }

        // Incorrect feedback message - Added explanation
        resultDiv.innerHTML = `<div class='quiz-feedback incorrect fade-in'>❌ Nope. You entered: "${guess}"<br/>
<pre style='margin: 0; padding: 0; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; line-height: 1.2;'>
<span style='display: inline-block; margin-top: 0.5rem;'>Your Hash:</span>
<mark style='background-color: #ffd6d6; color: #b22222; word-break: break-all;'>${guessedHash}</mark>
<span style='display: inline-block; margin-top: 0.5rem;' class='target-hash-label'>Target Hash:</span>
<mark style='background-color: #f0f0f0; color: #333; word-break: break-all;' class='target-hash-value'>${targetHash}</mark>
</pre>
<p style="font-weight: normal; margin-top: 0.75rem; font-size: 0.9em;">See how different your hash is? That's the one-way nature of hashing! Keep guessing to find the match.</p>
</div>`;
        input.focus(); // Refocus input field
      }
      // Score display update removed
    }

    // --- Navigation Functions ---
    function goToQuiz() {
      console.log("Navigating to Quiz section..."); // Debug log
      hideAllSections();
      if (quizSection) quizSection.classList.remove("hidden");
      if (gameContainer) gameContainer.classList.remove("hidden"); // Ensure main container is visible
      window.scrollTo(0, 0); // Scroll to top
      startQuiz();
    }

    function showSummary() {
      console.log("Navigating to Summary section..."); // Debug log
      hideAllSections();
      if (summarySection) summarySection.classList.remove("hidden");
      if (gameContainer) gameContainer.classList.remove("hidden"); // Ensure main container is visible
       window.scrollTo(0, 0); // Scroll to top
    }

    // --- New function to go back to Lesson from Game ---
    function goBackToLesson() {
        console.log("Going back to Lesson from Game..."); // Debug log
        if (gameSection) gameSection.classList.add("hidden");
        if (lessonSection) lessonSection.classList.remove("hidden");
        window.scrollTo(0, 0); // Scroll to top
        // No need to hide gameContainer as both are inside it
    }

    function restartGame() {
      console.log("Restarting game..."); // Debug log
      // Reset scores and pick a new word, then go back to lesson
      score = 0; // Reset word guessing score
      lastQuizScorePercent = -1; // Reset last quiz score
      console.log("Word score reset to 0, Quiz score reset to -1");
      streak = 0;
      secretWord = wordList[Math.floor(Math.random() * wordList.length)]; // Pick new word
      console.log("New secret word:", secretWord); // Debug log
      hideAllSections();
      if (lessonSection) lessonSection.classList.remove("hidden"); // Start from lesson
      if (gameContainer) gameContainer.classList.remove("hidden"); // Ensure main container is visible
      window.scrollTo(0, 0); // Scroll to top
    }

    // --- Updated Exit Game Function ---
    function exitGame() {
        console.log("Entering exitGame function"); // Debug log
        console.log("Word Guessing Score at exit:", score);
        console.log("Last Quiz Score % at exit:", lastQuizScorePercent);
        hideAllSections(); // Hides gameContainer and all sections inside + exitSection initially

        // Determine the score message
        let scoreMessage = "";
        let scoreClass = ""; // Class for animation
        if (lastQuizScorePercent >= 66) {
            // Passed the quiz
            scoreMessage = `<p>🎉🏆✨ Your final quiz score was: ${lastQuizScorePercent}% ✨🏆🎉</p>`;
            scoreClass = "score-highlight"; // Add class for animation
        } else if (lastQuizScorePercent >= 0) {
            // Took quiz but didn't pass
            scoreMessage = `<p>Your final quiz score was: ${lastQuizScorePercent}%</p>`;
        } else {
            // Didn't take quiz
             scoreMessage = `<p>You didn't complete the quiz this session.</p>`;
        }


        // Populate the exit screen content
        if (exitSection) {
            exitSection.innerHTML = `
                <h2>👋 Thanks for playing!</h2>
                <div class="${scoreClass}">${scoreMessage}</div>
                <p>What would you like to do next?</p>
                <div>
                    <button onclick="restartGame()">🔁 Play Again</button>
                    <button onclick="goToQuizFromExit()">❓ Re-take Quiz</button>
                    <button onclick="openModal()">🧪 Try Hashing Tool</button>
                    <a href="https://www.cryptomall.com" target="_blank" class="button-link">📚 Learn More</a>
                    <button onclick="showToast('Rating feature coming soon!', true)">⭐ Rate this Game</button>
                </div>
            `;
            console.log("Exit section populated. Making visible."); // Debug log
            exitSection.classList.remove("hidden"); // Show the exit screen
            window.scrollTo(0, 0); // Scroll to top
            console.log("Exit section should be visible now."); // Debug log
        } else {
            console.error("exitSection element not found!"); // Error log
        }
    }

    // --- New function to navigate from Exit screen back to Quiz ---
    function goToQuizFromExit() {
        console.log("Navigating from Exit/Summary to Quiz..."); // Debug log
        hideAllSections();
        if (quizSection) quizSection.classList.remove("hidden");
        if (gameContainer) gameContainer.classList.remove("hidden"); // Show main container again
        window.scrollTo(0, 0); // Scroll to top
        startQuiz(); // Restart the quiz
    }

    // --- Fisher-Yates Shuffle function ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }

    // --- Quiz Logic (Updated for Random Questions) ---
    function startQuiz() {
      console.log("Starting Quiz..."); // Debug log

      // --- Select 4 random questions ---
      const shuffledQuestions = shuffleArray([...allQuizQuestions]); // Shuffle a copy of the full pool
      const currentQuizQuestions = shuffledQuestions.slice(0, 4); // Take the first 4
      const numQuestions = currentQuizQuestions.length; // Should always be 4
      console.log("Selected Questions for this round:", currentQuizQuestions.map(q => q.question));

      let quizIndex = 0;
      let correctAnswers = 0; // This score is local to the quiz attempt
      const questionElement = document.getElementById("quizQuestion");
      const optionsContainer = document.getElementById("quizOptions");
      const resultDiv = document.getElementById("quizResult");
      const completionProgressBar = document.getElementById("quizProgress"); // Existing bar
      const scoreProgressBar = document.getElementById("quizScoreBar"); // New score bar

      // Ensure elements exist before proceeding
      if (!questionElement || !optionsContainer || !resultDiv || !completionProgressBar || !scoreProgressBar) {
          console.error("Quiz elements (including progress bars) not found!");
          return;
      }

      // --- Function to update both progress bars ---
      function updateProgressBars() {
          // Use numQuestions (which is 4) for calculations
          const completionPercent = numQuestions > 0 ? Math.round(((quizIndex) / numQuestions) * 100) : 0;
          const scorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0;

          // Update Completion Bar
          completionProgressBar.style.width = `${completionPercent}%`;
          completionProgressBar.textContent = `${completionPercent}% Complete`;

          // Update Score Bar
          scoreProgressBar.style.width = `${scorePercent}%`;
          scoreProgressBar.textContent = `${scorePercent}% Score`;
      }

      // --- Function to display final results ---
      function showFinalResults() {
          console.log("Quiz finished. Showing final results."); // Debug log
          const finalScorePercent = numQuestions > 0 ? Math.round((correctAnswers / numQuestions) * 100) : 0;
          lastQuizScorePercent = finalScorePercent; // *** STORE the final percentage globally ***
          console.log("Stored lastQuizScorePercent:", lastQuizScorePercent);

          resultDiv.innerHTML = `<div class='quiz-feedback ${finalScorePercent >= 66 ? "correct" : "incorrect"}'>Quiz Complete! You scored ${correctAnswers} out of ${numQuestions} (${finalScorePercent}%).</div>`;
          resultDiv.innerHTML += `<button style="margin-left: 0.5rem;" onclick='showSummary()'>Continue to Summary</button>`;
          if (finalScorePercent < 66) {
              resultDiv.innerHTML += `<button onclick='startQuiz()'>Try Quiz Again</button>`;
          }
      }

      // --- Function to display the next question ---
      function showNextQuestion() {
          console.log(`Showing quiz question ${quizIndex + 1} of ${numQuestions}`); // Debug log
          // Update progress bars *before* displaying question
          updateProgressBars();

          // --- Display Current Question ---
          const current = currentQuizQuestions[quizIndex]; // Use the selected questions
          questionElement.textContent = `${quizIndex + 1}. ${current.question}`;
          optionsContainer.innerHTML = "";
          resultDiv.innerHTML = ""; // Clear previous result/next button

          // Shuffle and display options for the current question
          current.options.sort(() => Math.random() - 0.5).forEach(option => {
              const div = document.createElement("div");
              div.className = "quiz-option";
              div.textContent = option.text;
              div.onclick = () => {
                  console.log(`Answered question ${quizIndex + 1}`); // Debug log
                  // Disable options
                  const allOptions = optionsContainer.querySelectorAll('.quiz-option');
                  allOptions.forEach(opt => { opt.style.pointerEvents = 'none'; opt.style.cursor = 'default'; if (opt !== div) opt.style.opacity = '0.6'; });

                  // Check answer and update score
                  const isCorrect = option.value === current.correct;
                  if (isCorrect) {
                      div.style.backgroundColor = '#d1e7dd'; div.style.borderColor = '#badbcc'; div.style.color = '#0f5132'; div.style.fontWeight = 'bold';
                      correctAnswers++; // Increment score only if correct
                      console.log("Correct! Quiz correctAnswers:", correctAnswers);
                  } else {
                      div.style.backgroundColor = '#f8d7da'; div.style.borderColor = '#f5c2c7'; div.style.color = '#842029'; div.style.fontWeight = 'bold';
                      // Highlight correct answer
                      allOptions.forEach(opt => {
                          // Find the original option object corresponding to the clicked div's text
                          const originalOption = currentQuizQuestions[quizIndex].options.find(o => o.text === opt.textContent);
                          if (originalOption && originalOption.value === current.correct) {
                             opt.style.backgroundColor = '#d1e7dd'; opt.style.borderColor = '#badbcc'; opt.style.color = '#0f5132'; opt.style.opacity = '1';
                          }
                      });
                      console.log("Incorrect. Quiz correctAnswers:", correctAnswers);
                  }

                  quizIndex++; // Move to next question index *after* checking answer

                  // Update progress bars *after* score might have changed and index incremented
                  updateProgressBars();

                  // Check if quiz is over AFTER incrementing index
                  if (quizIndex >= numQuestions) { // Use numQuestions (which is 4)
                      // If it's the end, show final results immediately
                      setTimeout(() => { // Optional delay to let user see feedback
                          showFinalResults();
                      }, 1000); // 1 second delay
                  } else {
                      // Otherwise, show 'Next' button after a delay
                      setTimeout(() => {
                          const nextBtn = document.createElement("button");
                          nextBtn.textContent = "Next Question →";
                          nextBtn.onclick = showNextQuestion;
                          resultDiv.innerHTML = ''; // Clear feedback before adding button
                          resultDiv.appendChild(nextBtn);
                      }, 1000); // 1 second delay
                  }
              };
              optionsContainer.appendChild(div);
          });
      }

      // Initialize quiz state and bars
      quizIndex = 0;
      correctAnswers = 0; // Reset score for this attempt
      lastQuizScorePercent = -1; // Reset global score before quiz starts
      updateProgressBars(); // Set initial state (0%)
      showNextQuestion(); // Show the first question
    }

    // --- Bonus Game Functions ---
    function showBonusGame() {
        console.log("Showing Bonus Game...");
        window.scrollTo(0, 0); // Scroll to top
        hideAllSections(); // Hide other sections
        // Reset bonus game state
        const bonusSelect = document.getElementById("bonusCountrySelect");
        if (bonusSelect) bonusSelect.value = "";
        const bonusHashDisplay = document.getElementById("bonusHashDisplay");
        if (bonusHashDisplay) bonusHashDisplay.innerHTML = '<code style="visibility: hidden;">Placeholder</code>'; // Clear hash display
        const bonusResult = document.getElementById("bonusResult");
        if (bonusResult) bonusResult.innerHTML = ""; // Clear previous result
        // Enable guess options and remove result classes
        const guessOptions = document.querySelectorAll('#bonusGuessOptions .country-guess-option');
        guessOptions.forEach(opt => {
            opt.disabled = false;
            opt.classList.remove('correct-guess', 'incorrect-guess');
        });

        if (bonusGameSection) bonusGameSection.classList.remove("hidden"); // Show bonus game
    }

    async function updateBonusHashDisplay() {
        const bonusSelect = document.getElementById("bonusCountrySelect");
        const bonusHashDisplay = document.getElementById("bonusHashDisplay");
        if (!bonusSelect || !bonusHashDisplay) return;

        const selectedCountry = bonusSelect.value;
        if (selectedCountry) {
            bonusHashDisplay.innerHTML = `<code>Calculating hash for ${selectedCountry}...</code>`;
            const selectedHash = await hashString(selectedCountry);
            bonusHashDisplay.innerHTML = `<code>Hash for ${selectedCountry}:<br>${selectedHash}</code>`;
        } else {
            bonusHashDisplay.innerHTML = '<code style="visibility: hidden;">Placeholder</code>'; // Clear if default option selected
        }
    }

    // --- Updated Bonus Game Check Function ---
    function checkBonusGuess(guessedCountry, buttonElement) {
        const bonusResult = document.getElementById("bonusResult");
        if (!bonusResult || !buttonElement) return;

        console.log(`Bonus guess: ${guessedCountry}, Correct: ${bonusCorrectCountry}`);

        // Remove previous incorrect guess class from other buttons
        const allGuessOptions = document.querySelectorAll('#bonusGuessOptions .country-guess-option');
        allGuessOptions.forEach(opt => {
            if (opt !== buttonElement) {
                opt.classList.remove('incorrect-guess');
            }
        });


        if (guessedCountry === bonusCorrectCountry) {
            // Correct guess: Show green feedback, add green class, disable all buttons
            buttonElement.classList.remove('incorrect-guess'); // Remove red if it was there
            buttonElement.classList.add('correct-guess'); // Add green class
            bonusResult.innerHTML = `<div class='quiz-feedback correct fade-in'>✅ Correct! Maria chose ${bonusCorrectCountry}. You found the match by hashing the countries!</div>`;
            allGuessOptions.forEach(opt => opt.disabled = true); // Disable all after correct guess
        } else {
            // Incorrect guess: Show red feedback, add red class to clicked button only
            buttonElement.classList.add('incorrect-guess');
            bonusResult.innerHTML = `<div class='quiz-feedback incorrect fade-in'>❌ Incorrect. That's not the country Maria chose. Try checking the hashes again!</div>`;
            // DO NOT disable buttons here, allow further guesses
        }
    }

    function returnToSummary() {
        console.log("Returning to Summary from Bonus Game...");
        window.scrollTo(0, 0); // Scroll to top
        if (bonusGameSection) bonusGameSection.classList.add("hidden");
        if (summarySection) summarySection.classList.remove("hidden");
        if (gameContainer) gameContainer.classList.remove("hidden");
    }


    // --- Dark Mode ---
    function toggleDarkMode() {
      const isDark = document.body.classList.toggle('dark-mode');
      localStorage.setItem('darkMode', isDark);
      if (darkModeToggleBtn) darkModeToggleBtn.textContent = isDark ? '☀️' : '🌗';
      console.log(`Dark mode toggled: ${isDark}`); // Debug log
      showToast(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', true);
    }

    // --- Modal (Hashing Tool) Logic ---
    function openModal() {
      console.log("Opening hashing tool modal..."); // Debug log
      const modal = document.getElementById("hashModal");
      const input = document.getElementById("modalTextInput");
      const results = document.getElementById("modalResults");
      if (modal) modal.style.display = "block";
      if (input) {
          input.value = "";
          input.focus();
      }
      if (results) results.innerHTML = "";
    }

    function closeModal() {
      console.log("Closing hashing tool modal."); // Debug log
      const modal = document.getElementById("hashModal");
      if (modal) modal.style.display = "none";
    }

    window.onclick = function(event) {
      const modal = document.getElementById("hashModal");
      if (event.target === modal) {
        closeModal();
      }
    }

    async function shaHash(input, algorithm) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    async function showHashes() {
      const input = document.getElementById("modalTextInput");
      const resultsDiv = document.getElementById("modalResults");
      if (!input || !resultsDiv) return; // Exit if elements not found

      const inputValue = input.value;
      console.log("Generating hashes for:", inputValue); // Debug log
      if (!inputValue && inputValue !== "") { // Allow hashing empty string
          resultsDiv.innerHTML = "<p style='color: red;'>Please enter text to hash.</p>";
          return;
      }
      resultsDiv.innerHTML = "<p><em>Generating hashes...</em></p>";
      try {
          const sha256 = await shaHash(inputValue, "SHA-256");
          const sha512 = await shaHash(inputValue, "SHA-512");
          console.log("SHA-256:", sha256); // Debug log
          console.log("SHA-512:", sha512); // Debug log
          resultsDiv.innerHTML = `
            <div><h3>SHA-256:</h3><code id="modalSha256" style="word-break: break-all;">${sha256}</code><button class='copy-btn' onclick="copyToClipboard('modalSha256')">Copy</button><span id="copied-modalSha256" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div>
            <div style="margin-top: 1rem;"><h3>SHA-512:</h3><code id="modalSha512" style="word-break: break-all;">${sha512}</code><button class='copy-btn' onclick="copyToClipboard('modalSha512')">Copy</button><span id="copied-modalSha512" class="copied-message" style="display: none; color: green; font-size: 0.85rem; margin-left: 0.5rem;">✔ Copied!</span></div>
          `;
      } catch (error) {
          console.error("Hashing error:", error);
          resultsDiv.innerHTML = "<p style='color: red;'>Error generating hashes. See console for details.</p>";
      }
    }

    function copyToClipboard(elementId) {
      const codeBlock = document.getElementById(elementId);
      if (!codeBlock) return;
      const textToCopy = codeBlock.textContent;
      console.log("Attempting to copy:", textToCopy); // Debug log
      if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(textToCopy).then(() => {
              console.log("Clipboard API copy successful."); // Debug log
              showToast("Copied to clipboard!"); showCopiedMessage(elementId);
          }).catch(err => {
              console.error("Async clipboard copy failed:", err); fallbackCopyToClipboard(textToCopy, elementId);
          });
      } else {
          console.warn("Using fallback copy method."); // Debug log
          fallbackCopyToClipboard(textToCopy, elementId);
      }
    }

    function fallbackCopyToClipboard(text, elementId) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; textArea.style.top = "-9999px"; textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus(); textArea.select();
        try {
            const successful = document.execCommand("copy");
            if (successful) {
                console.log("Fallback copy successful."); // Debug log
                showToast("Copied to clipboard!"); showCopiedMessage(elementId);
            } else {
                console.error("Fallback copy command failed."); // Debug log
                showToast("Failed to copy (execCommand failed)", true);
            }
        } catch (err) {
            console.error("Fallback copy failed with error:", err);
            showToast("Failed to copy", true);
        }
        document.body.removeChild(textArea);
    }

    function showCopiedMessage(elementId) {
        const messageId = `copied-${elementId}`;
        const messageEl = document.getElementById(messageId);
        if (messageEl) {
            messageEl.style.display = "inline";
            setTimeout(() => { messageEl.style.display = "none"; }, 1500);
        }
    }

    // Add event listener safely
    const modalTextInput = document.getElementById("modalTextInput");
    if (modalTextInput) {
        modalTextInput.addEventListener("keydown", function (e) {
          if (e.key === "Enter") { e.preventDefault(); showHashes(); }
        });
    }


    function showToast(message, isInfo = false) {
      const toast = document.getElementById("toast");
      if (!toast) return;
      console.log(`Showing toast: "${message}" (Info: ${isInfo})`); // Debug log
      toast.textContent = message;
      toast.className = 'toast'; // Reset class
      if (isInfo) {
          toast.classList.add('info');
      }
      toast.style.display = "block";
      toast.style.opacity = 1;
      if (toast.timer) clearTimeout(toast.timer);
      toast.timer = setTimeout(() => {
          toast.style.opacity = 0;
          setTimeout(() => { toast.style.display = 'none'; }, 500);
      }, 2500);
    }

    // --- Initialize the game when the DOM is fully loaded ---
    document.addEventListener('DOMContentLoaded', initializeGame);

  
}
window.init_game = init_game;
