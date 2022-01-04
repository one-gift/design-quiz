'use strict'
var quizObject = getJSON();
var quizIndex = 0;
var levelIndex = 0;
var userCorrectCount = 0;
var selected;
var progressValue = 0;
var progressMaxValue = 0;

const quizzes = quizObject["quizzes"];

/**
 * jsonファイルを読み込む
 * @param 
 * @return {object} quizObject - json形式のクイズ一覧
 */
function getJSON() {
    let req = new XMLHttpRequest();
    req.open("GET", "../data/quiz.json", false);
    req.send(null);
    let object = JSON.parse(req.responseText);
    return object;
}

/**
 * #quiz-startクリックされた時の処理
 * @param
 * @return 
 */
document.getElementById('quiz-start').onclick = function quizStart() {
    quizController(quizIndex);
    document.querySelector("#start").style.display = "none";
    document.querySelector("#progress").style.display = "block";
}

/**
 * quizObjectからjson形式でクイズを取得
 * @param 
 * @return {object}  - json形式のクイズ1問分
 */
function getQuiz() {
    let quiz = quizzes[levelIndex][quizIndex];
    return quiz;
}

/**
 * クイズ取得から表示までのコントローラー
 * @param {number} quizIdx - quizのindex
 * @return
 */
function quizController(quizIdx) {
    let quiz = getQuiz();
    quizIndex = incrementCount(quizIdx);
    progressMaxValue = quizzes[levelIndex].length;
    setProgressMaxValue(progressMaxValue);
    displayQestion(quiz);
}

/**
 * レベルの切り替え
 * @param 
 * @return
 */
function changeLevel() {
    quizIndex = 0;
    levelIndex++;
}

/**
 * 問題を表示機能
 * @param {object} quiz 
 * @retunrn 
 */
function displayQestion(quiz) {
    document.querySelector("#quiz-index").innerHTML = quizIndex;
    document.querySelector("#progress-quiz-index").innerHTML = quizIndex;
    document.querySelector("#progress-level-quiz-amount").innerHTML = progressMaxValue;

    document.querySelector("#quiz-text").innerHTML = JSON.stringify(quiz["question"]["quiz_text"]);
    document.querySelector("#choices-img1").setAttribute('src', quiz["question"]["img_path"][0]);
    document.querySelector("#choices-img2").setAttribute('src', quiz["question"]["img_path"][1]);

    document.querySelector("#quiestion").style.display = "block"
}

/**
 * 変数のカウントをインクリメントする
 * @param {number} count
 * @returns 
 */
function incrementCount(count) {
    count++;
    return count
}

/**
 * HTMLのprogressのvalue値の変更
 * @param
 * @returns 
 */
function setProgressValueue() {
    document.getElementById("quiz-progress").value = progressValue;
}

/**
 * HTMLのprogressのmax値の変更
 * @param
 * @return
 */
function setProgressMaxValue(maxValue) {
    document.querySelector("#quiz-progress").setAttribute('max', maxValue);
}

/**
 * 正誤判定機能
 * @param {object} selected
 * @return {array}
 */
function checkCorrect(selected) {
    let correct_num = quizzes[levelIndex][quizIndex - 1]["answer"]["correct_num"];
    if (selected == correct_num) {
        userCorrectCount++;
        return [1, correct_num];
    } else {
        return [0, correct_num]
    }
}

/**
 * 正誤判定画面の生成
 * @param {object} e
 * @return
 */
document.getElementById('quiz-choices').onclick = function generateResult(e) {
    e = e || window.event;
    e = e.target;
    selected = e.id == 'choices-img1' ? 0 : 1;
    let result = checkCorrect(selected);

    progressValue = incrementCount(progressValue);
    setProgressValueue();
    displayResult(result)
}

/**
 * 正誤判定画面の表示
 * @param {array} result
 * @return
 */
function displayResult(result) {
    if (result[0] == 1) {
        if (quizIndex >= quizzes[levelIndex].length && levelIndex == quizzes.length - 1) {
            document.querySelector("#next-btn").value = "最終結果を見る"
        }
        document.querySelector("#quiestion").style.display = "none";
        document.querySelector("#result").style.display = "block";

        document.querySelector("#judged").innerText = "正解";
        document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][selected]);
        doConfetti();
    } else {
        if (quizIndex >= quizzes[levelIndex].length && levelIndex == quizzes.length - 1) {
            document.querySelector("#next-btn").value = "最終結果を見る"
        }
        document.querySelector("#quiestion").style.display = "none";
        document.querySelector("#result").style.display = "block";

        document.querySelector("#judged").innerText = "不正解";
        document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][selected]);
    }
}

/**
 * 比較機能（ボタン押下時）
 * @params
 * @return
 */
function displayComparison() {
    let value = selected == 0 ? 1 : 0;
    document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][value]);
}

/**
 * 比較機能（ボタン非押下時）
 * @params
 * @return
 */
function undisplayComparison() {
    let value = selected
    document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][value]);
}

/**
 * 次の問題への遷移
 * @param
 * @return
 */
document.getElementById('next-btn').onclick = function goNextQuestion() {
    if (quizIndex >= quizzes[levelIndex].length && levelIndex == quizzes.length - 1) {
        displayEndResult(userCorrectCount)
        return
    }
    if (quizIndex >= quizzes[levelIndex].length) {
        progressValue = 0;
        setProgressValueue();

        changeLevel();

        progressMaxValue = quizzes[levelIndex].length;
    }
    quizController(quizIndex);
    document.querySelector("#result").style.display = "none";
}

/**
 * 最終結果画面の生成
 * @pram
 * @return
 */
function displayEndResult(userCorrectCount) {
    document.querySelector("#result").style.display = "none";
    document.querySelector("#progress").style.display = "none";
    document.querySelector("#end-result").style.display = "block";

    let amount = 0;
    for (let i = 0; i < quizzes.length; i++) {
        amount += quizObject["quizzes"][i].length;
    }

    displayEndResultCircle(userCorrectCount, amount);

    document.querySelector("#correct-cnt").innerText = userCorrectCount + "/" + amount + "問正解";
    let thanks = quizObject["thanks"];
    if (userCorrectCount < 1) {
        document.querySelector("#thanks").innerText = thanks["0"];
    } else if (userCorrectCount > 0 && userCorrectCount < 2) {
        document.querySelector("#thanks").innerText = thanks["1"];
    } else if (userCorrectCount > 1 && userCorrectCount < 3) {
        doConfetti();
        document.querySelector("#thanks").innerText = thanks["2"];
    } else {
        doConfetti();
        document.querySelector("#thanks").innerText = thanks["3"];
    }
}

/**
 * 最終結果画面の円グラフ
 * @params
 * @return 
 */
function displayEndResultCircle(correctCount, amount) {
    var endResultCircle = new ProgressBar.Circle('#end-result-circle', {
        color: '#FCB03C',
        duration: 3000,
        easing: 'easeInOut',
        trailColor: '#eee',
        trailWidth: 1,
    });

    var correctRate = correctCount / amount;
    endResultCircle.animate(correctRate);
}

/**
 * 紙吹雪機能
 * @pram
 * @return
 */
function doConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    })
}
