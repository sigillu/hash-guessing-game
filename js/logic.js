// js/logic.js
// Core game initialization function extracted from original code
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

// Export the initializeGame function
export { initializeGame };
