"use strict";
const highScoresList = document.getElementById("highScoresList");
let newHighScores = JSON.parse(localStorage.getItem("highScores")) || [];
highScoresList.innerHTML = newHighScores
    .map((score) => {
    return `<li class="high-score"> ${score.name} - ${score.score} </li>`;
})
    .join(" ");
