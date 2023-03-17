"use strict";
const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const latestScore = localStorage.getItem("latestScore");
finalScore.innerText = latestScore;
let highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_SCORE = 5;
const saveHighScore = (e) => {
    e.preventDefault();
    const score = {
        score: Math.floor(Math.random() * 100),
        name: username.value,
    };
    highScores.push(score);
    // sort based on the higher score
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(5);
    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("./");
};
username.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !username.value;
});
