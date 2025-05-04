// js/questions.js

// Word categories for Game 1
const wordCategories = {
      drinks: ["water", "juice", "latte", "cider", "mocha", "tonic", "shake", "pepsi", "lager"],
    };

// Full Quiz Question Pool
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

// Bonus Game Countries for Game 2
const bonusCountries = ["Argentina", "Brazil", "Canada", "Colombia", "Peru"];

// Export constants
export { wordCategories, allQuizQuestions, bonusCountries };
