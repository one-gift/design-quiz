'use strict'

var quizList = getJSON();
var quizIdx = 0;

/**
 * json形式でクイズを取得
 * @param 
 * @return
 */
function getQuiz() {
    var quiz = quizList["items"][quizIdx];
    document.querySelector("#idx").innerHTML = JSON.stringify(quiz["quiz_id"]);
    document.querySelector("#jst").innerHTML = JSON.stringify(quiz["question"]["quiz_text"]);
    document.querySelector("#img1").setAttribute('src', JSON.stringify(quiz["question"]["correct_img_path"]));
    document.querySelector("#img2").setAttribute('src', JSON.stringify(quiz["question"]["wrong_img_path"]));
    document.querySelector("#result").style.display = "block";
    quizIdx++;
}

/**
 * jsonファイルを読み込む
 * @param 
 * @return {object} quizList - json形式のクイズ一覧
 */
function getJSON() {
    var req = new XMLHttpRequest();
    req.open("GET", "../data/quiz.json", false);
    req.send(null);
    quizList = JSON.parse(req.responseText);
    return quizList;
}

/**
 * 
 */
function checkCorrect(selected, answer){

}