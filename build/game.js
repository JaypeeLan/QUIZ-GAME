"use strict";
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;
// -----------------------------/
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
    .then((res) => {
    return res.json();
})
    .then((data) => {
    questions = data.results.map((question) => {
        // console.log(question);
        // we get question, correct answer and 3 incorrect answers
        const formattedQuestions = {
            question: question === null || question === void 0 ? void 0 : question.question,
        };
        // -----------------------------------------
        // create new array of incorrect answers
        const answerChoices = [...question === null || question === void 0 ? void 0 : question.incorrect_answers];
        // -----------------------------------------------
        // generate a random index/position for the correct answer
        formattedQuestions.answer = Math.floor(Math.random() * 3 + 1);
        // add the correct answer into the array of prev created incorrect answers
        answerChoices.splice(formattedQuestions.answer - 1, 0, question.correct_answer);
        // -------------------------
        answerChoices.forEach((choice, index) => {
            // choice1, choice2, choice3, choice4 (see line 95)
            formattedQuestions["choice" + (index + 1)] = choice;
        });
        return formattedQuestions;
    });
    startGame();
});
const startGame = () => {
    questionCounter = 0;
    score = 0;
    // to avoid mutating the questions array
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};
const getNewQuestion = () => {
    // redirect to end page
    if (availableQuestions.length == 0 || questionCounter > MAX_QUESTIONS) {
        return window.location.assign("./end.html");
    }
    // --------
    localStorage.setItem("latestScore", JSON.stringify(score));
    // -------------------------
    questionCounter++;
    // update the remaining questions left against the total
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    // pick a random question within the array
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    // inner text in the DOM is updated with the question
    question.innerText = currentQuestion.question;
    choices.forEach((choice) => {
        const number = choice.dataset["number"];
        choice.innerHTML = currentQuestion["choice" + number];
    });
    // remove question after answering it
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};
choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
        if (!acceptingAnswers)
            return;
        acceptingAnswers = false;
        const { target } = e;
        const selectedChoice = target;
        const selectedAnswer = selectedChoice.dataset["number"];
        // apply a green background to the option if the answer is correct
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        classToApply === "correct" ? incrementScore(CORRECT_BONUS) : " ";
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1500);
    });
});
const incrementScore = (num) => {
    score += num;
    scoreText.innerText = `${score}`;
};
