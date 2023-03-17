const highScoresList = document.getElementById(
  "highScoresList"
) as HTMLUListElement;
let newHighScores = JSON.parse(localStorage.getItem("highScores")!) || [];

highScoresList.innerHTML = newHighScores
  .map((score: Score) => {
    return `<li class="high-score"> ${score.name} - ${score.score} </li>`;
  })
  .join(" ");
