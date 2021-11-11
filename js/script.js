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
    generateQestion(quiz);
    quizIdx++;
}

/**
 * 問題を表示機能
 * @param {object} quiz 
 * @retunrn 
 */
function generateQestion(quiz) {
    document.querySelector("#idx").innerHTML = JSON.stringify(quiz["quiz_id"]);
    document.querySelector("#jst").innerHTML = JSON.stringify(quiz["question"]["quiz_text"]);

    document.querySelector("#img1").setAttribute('src', quiz["question"]["img_path"][0]);
    document.querySelector("#img2").setAttribute('src', quiz["question"]["img_path"][1]);

    document.querySelector("#quiestion").style.display = "block";
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
 * 正誤判定機能
 * @param selected int
 * @return 
 */
function checkCorrect(selected) {
    var correct_num = quizList["items"][quizIdx - 1]["answer"]["correct_num"];
    if (selected == correct_num) {
        return [1, correct_num];
    } else {
        return [0, correct_num]
    }
}

// 
function generateResult(selected) {
    var result_flag = checkCorrect(selected)
    console.log(result_flag);
    if (result_flag[0] == 1) {
        if (quizIdx >= quizList["items"].length) {
            document.querySelector("#next-btn").value = "最終結果を見る"
        }
        console.log("正解");
        document.querySelector("#quiestion").style.display = "none";
        document.querySelector("#result").style.display = "block";

        document.querySelector("#judged").innerText = "正解";
        document.querySelector("#correct-img").setAttribute('src', quizList["items"][quizIdx - 1]["question"]["img_path"][result_flag[1]]);
    } else {
        if (quizIdx >= quizList["items"].length) {
            document.querySelector("#next-btn").value = "最終結果を見る"
        }
        console.log("不正解");
        document.querySelector("#quiestion").style.display = "none";
        document.querySelector("#result").style.display = "block";

        document.querySelector("#judged").innerText = "不正解";
        document.querySelector("#correct-img").setAttribute('src', quizList["items"][quizIdx - 1]["question"]["img_path"][result_flag[1]]);
    }
}

function goNextQuestion() {
    if (quizIdx < quizList["items"].length) {
        getQuiz();
        document.querySelector("#result").style.display = "none";
    } else {
        console.log("最終結果を見る");
        document.querySelector("#result").style.display = "none";
    }
}
