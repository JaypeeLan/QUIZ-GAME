const username = document.getElementById("username") as HTMLInputElement;
const saveScoreBtn = document.getElementById(
  "saveScoreBtn"
) as HTMLButtonElement;
const finalScore = document.getElementById("finalScore") as HTMLElement;

const latestScore = localStorage.getItem("latestScore");

finalScore.innerText = latestScore!;

let highScores = JSON.parse(localStorage.getItem("highScores")!) || [];

const MAX_SCORE = 5;

interface Score {
  score: number;
  name: string;
}

const saveHighScore = (e: Event) => {
  e.preventDefault();

  const score: Score = {
    score: Math.floor(Math.random() * 100),
    name: username.value,
  };

  highScores.push(score);

  // sort based on the higher score
  highScores.sort((a: Score, b: Score) => b.score - a.score);

  highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("./");
};

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});
