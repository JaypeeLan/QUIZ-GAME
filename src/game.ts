const question = document.getElementById("question") as HTMLElement;
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText") as HTMLElement;
const scoreText = document.getElementById("score") as HTMLElement;
const progressBarFull = document.getElementById(
  "progressBarFull"
) as HTMLElement;
const loader = document.getElementById("loader") as HTMLElement;
const game = document.getElementById("game") as HTMLElement;

// -----------------------/
interface QuestionArray {
  category?: string;
  correct_answer?: string;
  difficulty: string;
  incorrect_answers?: any;
  question?: string;
  type?: string;
}

interface CurrentQuestion {
  [key: string]: string;
}

interface QuestionsArray {
  answer?: number;
  choice1?: string;
  choice2?: string;
  choice3?: string;
  choice4?: string;
  question?: string;
}

interface FormattedQuestionsObject {
  [key: string]: string | number;
}

// CONSTANTS
const CORRECT_BONUS: number = 10;
const MAX_QUESTIONS: number = 10;
// -----------------------------/
let currentQuestion: QuestionsArray = {};
let acceptingAnswers: boolean = false;
let score: number = 0;
let questionCounter: number = 0;
let availableQuestions: QuestionsArray[] = [];
let questions: QuestionArray[] = [];

fetch(
  "https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    questions = data.results.map((question: QuestionArray) => {
      // console.log(question);

      // we get question, correct answer and 3 incorrect answers

      const formattedQuestions: FormattedQuestionsObject = {
        question: question?.question!,
      };

      // -----------------------------------------
      // create new array of incorrect answers
      const answerChoices = [...question?.incorrect_answers];
      // -----------------------------------------------
      // generate a random index/position for the correct answer
      formattedQuestions.answer = Math.floor(Math.random() * 3 + 1);

      // add the correct answer into the array of prev created incorrect answers
      answerChoices.splice(
        formattedQuestions.answer - 1,
        0,
        question.correct_answer
      );
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
  question.innerText = currentQuestion.question!;

  choices.forEach((choice) => {
    const number = (choice as HTMLElement).dataset["number"];
    choice.innerHTML = (currentQuestion as CurrentQuestion)["choice" + number];
  });

  // remove question after answering it
  availableQuestions.splice(questionIndex, 1);

  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e: Event) => {
    if (!acceptingAnswers) return;
    acceptingAnswers = false;
    const { target } = e;
    const selectedChoice = target as HTMLParagraphElement;
    const selectedAnswer = (selectedChoice! as HTMLElement).dataset["number"];

    // apply a green background to the option if the answer is correct
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    classToApply === "correct" ? incrementScore(CORRECT_BONUS) : " ";

    selectedChoice.parentElement!.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement!.classList.remove(classToApply);
      getNewQuestion();
    }, 1500);
  });
});

const incrementScore = (num: number) => {
  score += num;
  scoreText.innerText = `${score}`;
};
