// Master pool of all questions
const questionPool = [
    { question: "What is the capital of France?", answers: ["Paris", "London", "Berlin", "Rome"], correctAnswer: "Paris" },
    { question: "What is the chemical symbol for water?", answers: ["O2", "H2O", "CO2", "N2"], correctAnswer: "H2O" },
    { question: "Who was the first US president?", answers: ["Lincoln", "Washington", "Adams", "Jefferson"], correctAnswer: "Washington" },
    { question: "Largest planet?", answers: ["Earth", "Mars", "Jupiter", "Saturn"], correctAnswer: "Jupiter" },
    { question: "Land of the Rising Sun?", answers: ["China", "Japan", "India", "Korea"], correctAnswer: "Japan" },
    { question: "Fastest land animal?", answers: ["Lion", "Tiger", "Cheetah", "Leopard"], correctAnswer: "Cheetah" },
    { question: "2 + 2 * 2 = ?", answers: ["6", "8", "4", "10"], correctAnswer: "6" },
    { question: "Which gas do plants breathe in?", answers: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], correctAnswer: "Carbon Dioxide" },
];

let usedQuestions = [];
let currentSet = [];
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 30;

// 🎵 Sound elements
const correctSound = document.getElementById('correct-sound');
const wrongSound = document.getElementById('wrong-sound');

// Fisher-Yates shuffle
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateUniqueQuestions(count) {
    const unusedIndices = questionPool
        .map((_, index) => index)
        .filter(index => !usedQuestions.includes(index));
    
    if (unusedIndices.length < count) {
        alert("No more new questions available. Restarting from beginning.");
        usedQuestions = [];
        return generateUniqueQuestions(count);
    }

    shuffleArray(unusedIndices);
    const selectedIndices = unusedIndices.slice(0, count);
    usedQuestions.push(...selectedIndices);

    return selectedIndices.map(index => {
        const q = questionPool[index];
        return {
            question: q.question,
            answers: shuffleArray([...q.answers]),
            correctAnswer: q.correctAnswer
        };
    });
}

function startQuiz() {
    currentSet = generateUniqueQuestions(5);
    currentQuestionIndex = 0;
    score = 0;
    loadQuestion();
    startTimer();
    document.getElementById('next-button').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('result-container').style.display = 'none';
}

function loadQuestion() {
    const q = currentSet[currentQuestionIndex];
    document.getElementById('question').textContent = q.question;
    const answersEl = document.getElementById('answers');
    answersEl.innerHTML = '';
    q.answers.forEach(answer => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = answer;
        li.onclick = () => checkAnswer(answer, li);
        answersEl.appendChild(li);
    });
}

function checkAnswer(selectedAnswer, element) {
    const isCorrect = selectedAnswer === currentSet[currentQuestionIndex].correctAnswer;

    if (isCorrect) {
        score++;
        element.classList.add('list-group-item-success');
        correctSound.play();
    } else {
        element.classList.add('list-group-item-danger');
        wrongSound.play();
    }

    // Disable further clicks
    const allAnswers = document.querySelectorAll('#answers .list-group-item');
    allAnswers.forEach(item => item.onclick = null);

    clearInterval(timerInterval);
    document.getElementById('next-button').style.display = 'block';
}

function startTimer() {
    timeLeft = 30;
    document.getElementById('time').textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById('next-button').style.display = 'block';
        }
    }, 1000);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentSet.length) {
        loadQuestion();
        startTimer();
        document.getElementById('next-button').style.display = 'none';
    } else {
        endQuiz();
    }
}

function endQuiz() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    document.getElementById('score').textContent = `${score} / ${currentSet.length}`;
}

document.getElementById('next-button').onclick = nextQuestion;
document.getElementById('restart-button').onclick = startQuiz;

startQuiz();
