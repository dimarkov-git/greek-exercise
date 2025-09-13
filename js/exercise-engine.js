/**
 * ExerciseEngine.exercises is an array of exercise objects.
 * Each exercise object in the exercise array must have the following structure:
 * {
 *   blockName: string,     // The main block name being practiced
 *   blockNameI18n: object, // Translations of the block name
 *   prompt: string,        // The question or prompt shown to the user
 *   promptI18n: string,    // Translation for the prompt
 *   correct: string,       // The correct answer the user should type (e.g., "είμαι", "εγώ")
 * }
 */
class ExerciseEngine {
    constructor(exerciseData, dataProcessor, language = 'en') {
        this.exerciseData = exerciseData;
        this.dataProcessor = dataProcessor;
        this.language = language; // Current language for translations
        this.exercises = [];
        this.currentIndex = 0;
        this.correctCount = 0;
        this.waitingForRetry = false;
        this.hasIncorrectAnswer = false;
        this.showingTranslation = false;

        // DOM elements will be initialized when setup is called
        this.elements = {};
    }

    // Get translation for the current language, fallback to English if not available
    getTranslation(i18nObject) {
        if (!i18nObject) return '';
        return i18nObject[this.language] || i18nObject['en'] || '';
    }

    // Shuffle array function
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Initialize DOM elements
    initElements() {
        this.elements = {
            exerciseContainer: document.getElementById('exerciseContainer'),
            currentBlockEl: document.getElementById('currentBlock'),
            promptEl: document.getElementById('prompt'),
            userInputEl: document.getElementById('userInput'),
            submitBtn: document.getElementById('submitBtn'),
            correctAnswerEl: document.getElementById('correctAnswer'),
            correctFormEl: document.getElementById('correctForm'),
            progressBar: document.getElementById('progressBar'),
            currentQuestionEl: document.getElementById('currentQuestion'),
            totalQuestionsEl: document.getElementById('totalQuestions'),
            correctCountEl: document.getElementById('correctCount')
        };
    }

    // Initialize exercise
    initExercise() {
        this.initElements();

        // Use the data processor to build an exercise list
        this.exercises = this.dataProcessor(this.exerciseData);
        this.exercises = this.shuffleArray(this.exercises);

        this.currentIndex = 0;
        this.correctCount = 0;

        // Update UI
        this.elements.totalQuestionsEl.textContent = this.exercises.length;
        this.elements.correctCountEl.textContent = 0;

        this.loadQuestion();
    }

    // Load current question
    loadQuestion() {
        if (this.currentIndex >= this.exercises.length) {
            this.showResults();
            return;
        }

        const current = this.exercises[this.currentIndex];

        // Update display based on the exercise type
        if (current.blockName) {
            const translation = this.getTranslation(current.blockNameI18n);
            this.elements.currentBlockEl.textContent = current.blockName;

            // Store original and translated text for toggling
            this.elements.currentBlockEl.dataset.original = current.blockName;
            this.elements.currentBlockEl.dataset.translation = translation;
            this.showingTranslation = false;
        }

        this.elements.promptEl.textContent = current.prompt;

        // Store original and translated text for prompt toggling
        if (current.promptI18n) {
            const promptTranslation = this.getTranslation(current.promptI18n);
            this.elements.promptEl.dataset.original = current.prompt;
            this.elements.promptEl.dataset.translation = promptTranslation;
        }
        this.elements.userInputEl.value = '';
        this.elements.userInputEl.disabled = false;
        this.elements.submitBtn.disabled = false;
        this.elements.submitBtn.textContent = 'Απάντηση'; // "Answer" in Greek
        this.elements.correctAnswerEl.classList.add('hidden');
        this.waitingForRetry = false;

        // Update progress
        this.elements.currentQuestionEl.textContent = this.currentIndex + 1;
        this.elements.progressBar.style.width = `${((this.currentIndex) / this.exercises.length) * 100}%`;

        // Remove all styling classes if present
        this.elements.userInputEl.classList.remove('incorrect', 'correct-pulse', 'incorrect-pulse');
        this.hasIncorrectAnswer = false;

        this.elements.userInputEl.focus();
    }

    // Check answer
    checkAnswer() {
        if (this.waitingForRetry) return;

        const userAnswer = this.elements.userInputEl.value.trim().toLowerCase();
        const current = this.exercises[this.currentIndex];
        const correctAnswer = current.correct.toLowerCase();

        if (userAnswer === correctAnswer) {
            this.elements.userInputEl.classList.remove('incorrect');
            this.elements.userInputEl.classList.add('correct-pulse');

            const correctMessages = ['Μπράβο! Είστε ο βασιλιάς!', 'Τέλεια! Ακόμη και ο Όμηρος θα ήταν περήφανος!', 'Εξαιρετικά! Μπορείτε να γίνετε καθηγητής!', 'Καταπληκτικά! Ακόμα και τα παιδάκια θα σας χειροκροτήσουν!', 'Συγχαρητήρια! Είστε σαν τον Σωκράτη, αλλά χωρίς τη φαρμακεία!'];
            const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
            this.elements.submitBtn.textContent = randomMessage;

            if (this.hasIncorrectAnswer) {
                // User corrected their answer
                // Don't increment the score for corrected answers
            } else {
                // First try to correct
                this.correctCount++;
                this.elements.correctCountEl.textContent = this.correctCount;
            }

            this.elements.userInputEl.disabled = true;
            this.elements.submitBtn.disabled = true;

            setTimeout(() => {
                this.currentIndex++;
                this.loadQuestion();
            }, 1500);
        } else {
            this.elements.userInputEl.classList.remove('correct-pulse', 'incorrect-pulse');
            // Force reflow to restart animation
            this.elements.userInputEl.offsetHeight;
            this.elements.userInputEl.classList.add('incorrect-pulse');

            const incorrectMessages = ['Κατανοώ... ακόμη και εγώ κάνω λάθη!', 'Δοκίμασε ξανά - η πρακτική κάνει τον δάσκαλο!', 'Σκέψου λίγο... ο εγκέφαλός σου δουλεύει!', 'Μη βιάζεσαι - καλύτερα αργά παρά ποτέ!', 'Προσπάθησε πάλι - και οι πιο σπουδαίοι έχουν αποτύχει!'];
            const randomMessage = incorrectMessages[Math.floor(Math.random() * incorrectMessages.length)];
            this.elements.submitBtn.textContent = randomMessage;

            // Show the correct answer
            this.elements.correctFormEl.textContent = current.correct;
            this.elements.correctAnswerEl.classList.remove('hidden');

            this.hasIncorrectAnswer = true;

            // Keep the input enabled so user can correct it
            this.elements.userInputEl.focus();
        }
    }

    // Handle input changes when there's an incorrect answer
    handleInputChange() {
        if (this.hasIncorrectAnswer) {
            // Remove red styling when user starts typing again
            this.elements.userInputEl.classList.remove('incorrect', 'incorrect-pulse');
            // Reset button text to default
            this.elements.submitBtn.textContent = 'Απάντηση';
            // Keep the correct answer visible so user can reference it
        }
    }

    // Show results
    showResults() {
        const percentage = Math.round((this.correctCount / this.exercises.length) * 100);

        if (this.elements.currentBlockEl && this.elements.currentBlockEl.parentElement) {
            this.elements.currentBlockEl.parentElement.style.display = 'none';
        }

        this.elements.promptEl.textContent = 'Μάθημα τελείωσε! Χερακιά και γειά σας!';

        document.querySelector('.input-section').innerHTML = `
            <h2>Τα αποτελέσματά σας: ${this.correctCount} από ${this.exercises.length} (${percentage}%)</h2>
            <p style="margin: 20px 0; color: #666666;">
                ${percentage >= 80 ? 'Φανταστικό! Είστε πραγματικός άσος! 🌟' : percentage >= 60 ? 'Μπράβο! Αλλά μη κοιμάστε, συνεχίστε! 💪' : 'Μη στενοχωριέστε! Ο καλύτερος τρόπος να μάθετε είναι να κάνετε λάθη! 😊'}
            </p>
            <button onclick="exerciseEngine.initExercise()" class="btn-primary">Δοκιμάστε ξανά (αν δεν φοβάστε!)</button>
            <button onclick="window.location.href='../index.html'" class="btn-primary" style="top: 10px;">Πίσω στην αρχική (για ξεκούραση)</button>
        `;

        this.elements.progressBar.style.width = '100%';
        this.elements.correctAnswerEl.classList.add('hidden');
    }

    // Setup event listeners
    setupEventListeners() {
        this.elements.submitBtn.addEventListener('click', () => this.checkAnswer());
        this.elements.userInputEl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.waitingForRetry) {
                this.checkAnswer();
            }
        });

        this.elements.userInputEl.addEventListener('input', () => this.handleInputChange());

        // Click to toggle translation for current block
        this.elements.currentBlockEl.addEventListener('click', () => {
            if (this.showingTranslation) {
                this.elements.currentBlockEl.textContent = this.elements.currentBlockEl.dataset.original;
                this.showingTranslation = false;
            } else {
                this.elements.currentBlockEl.textContent = this.elements.currentBlockEl.dataset.translation;
                this.showingTranslation = true;
            }
        });

        // Click to toggle translation for prompt
        this.elements.promptEl.addEventListener('click', () => {
            if (this.elements.promptEl.dataset.translation) {
                if (this.elements.promptEl.textContent === this.elements.promptEl.dataset.original) {
                    this.elements.promptEl.textContent = this.elements.promptEl.dataset.translation;
                } else {
                    this.elements.promptEl.textContent = this.elements.promptEl.dataset.original;
                }
            }
        });
    }

    // Start the exercise
    start() {
        this.initExercise();
        this.setupEventListeners();
    }
}
