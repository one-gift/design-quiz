'use strict'

var quizList = getJSON();
var quizIdx = 0;

function getQuiz() {
    var quiz = quizList["items"][quizIdx];
    document.querySelector("#jst").innerHTML = JSON.stringify(quiz);
    document.querySelector("#result").style.display = "block";
    quizIdx++;
}

function getJSON() {
    var req = new XMLHttpRequest();
    req.open("GET", "../data/quiz.json", false);
    req.send(null);
    quizList = JSON.parse(req.responseText);
    return quizList;
}
