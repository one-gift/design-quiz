'use strict'
var quizObject = getJSON();
var quizIndex = 0;
var levelIndex = 0;
var userCorrectCount = 0;
var selected;
var progressValue = 0;
var progressMaxValue = 0;
const numberOfQuizzes = [1, 3, 7, 5];
const correctImg = `<div class="sign_correct"><img class="correct_sign" src="../image/icon_correct.svg" alt=""></div>`
const incorrectImg = `<div class="sign_uncorrect"><img class="uncorrect_sign" src="../image/icon_uncorrect.svg" alt=""></div>`
let quizzes = quizObject["quizzes"];

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
 * クイズのシャッフル
 * @param 
 */
function shuffle() {
    for (let numberOfQuizzesIdx = 0; numberOfQuizzesIdx < numberOfQuizzes.length; numberOfQuizzesIdx++) {
        for (let dividedQuizzesIdx = quizzes[numberOfQuizzesIdx].length; 1 < dividedQuizzesIdx; dividedQuizzesIdx--) {
            let randomNum = Math.floor(Math.random() * dividedQuizzesIdx);
            [quizzes[numberOfQuizzesIdx][randomNum], quizzes[numberOfQuizzesIdx][dividedQuizzesIdx - 1]] = [quizzes[numberOfQuizzesIdx][dividedQuizzesIdx - 1], quizzes[numberOfQuizzesIdx][randomNum]];
        }
    }
}

/**
 * #quiz-startクリックされた時の処理
 * @param
 */
document.getElementById('quiz-start').onclick = function quizStart() {
    // シャッフル
    shuffle();
    // クイズ制御
    quizController(quizIndex);
    // modal制御
    showModal();
    // 画面表示
    document.querySelector("#start").style.display = "none";
    document.querySelector("#progress").style.display = "block";
}

/**
 * クイズ取得から表示までのコントローラー
 * @param {number} quizIdx - quizのindex
 * @return
 */
function quizController(quizIdx) {
    let quiz = getQuiz();
    quizIndex = incrementCount(quizIdx);
    progressMaxValue = numberOfQuizzes[levelIndex];
    setProgressMaxValue(progressMaxValue);
    displayQestion(quiz);
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
 * 問題を表示機能
 * @param {object} quiz 
 */
function displayQestion(quiz) {
    document.querySelector("#quiz-index").innerHTML = quizIndex;
    document.querySelector("#progress-quiz-index").innerHTML = quizIndex;
    document.querySelector("#progress-level-quiz-amount").innerHTML = progressMaxValue;

    document.querySelector("#quiz-level").innerHTML = quiz["question"]["quiz_level"];
    document.querySelector("#choices-img1").setAttribute('src', quiz["question"]["img_path"][0]);
    document.querySelector("#choices-img2").setAttribute('src', quiz["question"]["img_path"][1]);

    document.querySelector("#quiestion").style.display = "block"
}

/**
 * 正誤判定画面の生成
 * @param {object} e
 * @return
 */
document.getElementById('quiz-choices').onclick = function generateResult(e) {
    let event = e || window.event;
    const choices_ids = [
        'choices-img1',
        'choices-img2'
    ]

    if (!(choices_ids.includes(event.target.id))) {
        return
    }

    selected = event.target.id == 'choices-img1' ? 0 : 1;
    let result = checkCorrect(selected);

    progressValue = incrementCount(progressValue);
    setProgressValue();
    displayResult(result)
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
 * 正誤判定画面の表示
 * @param {array} result
 */
function displayResult(result) {
    if (quizIndex >= numberOfQuizzes[levelIndex] && levelIndex == numberOfQuizzes.length - 1) {
        document.querySelector("#next-btn-text").value = "最終結果を見る"
    }
    document.querySelector("#quiestion").style.display = "none";
    document.querySelector("#result").style.display = "block";
    document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][selected]);
    document.querySelector("#explain").innerText = quizzes[levelIndex][quizIndex - 1]["answer"]["explain"];
    if (result[0] == 1) {
        document.getElementById("result-sign").innerHTML = correctImg;
        doConfetti();
    } else {
        document.getElementById("result-sign").innerHTML = incorrectImg;
    }
}

/**
 * 次の問題への遷移
 * @param
 * @return
 */
document.getElementById('next-btn').onclick = function goNextQuestion() {
    if (quizIndex >= numberOfQuizzes[levelIndex] && levelIndex == numberOfQuizzes.length - 1) {
        displayEndResult(userCorrectCount)
        return
    }
    if (quizIndex >= numberOfQuizzes[levelIndex]) {
        progressValue = initializeVariable(progressValue);
        setProgressValue();

        quizIndex = initializeVariable(quizIndex);
        levelIndex = incrementCount(levelIndex);

        progressMaxValue = numberOfQuizzes[levelIndex];
    }
    quizController(quizIndex);
    document.querySelector("#result").style.display = "none";
}

/**
 * 最終結果画面の生成
 * @pram
 */
function displayEndResult(userCorrectCount) {
    document.querySelector("#result").style.display = "none";
    document.querySelector("#progress").style.display = "none";
    document.querySelector("#end-result").style.display = "block";

    let amount = numberOfQuizzes.reduce((prev, current) => prev + current, 0);

    displayEndResultCircle(userCorrectCount, amount);

    document.querySelector("#correct-cnt").innerText = userCorrectCount;
    document.querySelector("#amount-cnt").innerText = amount;

    let thanks = quizObject["thanks"];

    if (userCorrectCount < 4) {
        document.querySelector("#thanks").innerText = thanks["0"];
        document.querySelector("#twitter-share").setAttribute('href', "https://twitter.com/intent/tweet?url=https://jugem.404design.dev&text=" + "あなたの点数は" + userCorrectCount + "点..." + "%0a" + thanks["0"]);
    } else if (userCorrectCount < 8) {
        document.querySelector("#thanks").innerText = thanks["1"];
        document.querySelector("#twitter-share").setAttribute('href', "https://twitter.com/intent/tweet?url=https://jugem.404design.dev&text=" + "あなたの点数は" + userCorrectCount + "点" + "%0a" + thanks["1"]);
    } else if (userCorrectCount < 12) {
        document.querySelector("#thanks").innerText = thanks["2"];
        document.querySelector("#twitter-share").setAttribute('href', "https://twitter.com/intent/tweet?url=https://jugem.404design.dev&text=" + "あなたの点数は" + userCorrectCount + "点！" + "%0a" + thanks["2"]);
    } else if (userCorrectCount < 16) {
        doConfetti();
        document.querySelector("#thanks").innerText = thanks["3"];
        document.querySelector("#twitter-share").setAttribute('href', "https://twitter.com/intent/tweet?url=https://jugem.404design.dev&text=" + "あなたの点数は" + userCorrectCount + "点！！" + "%0a" + thanks["3"]);
    } else {
        doConfetti();
        document.querySelector("#thanks").innerText = thanks["4"];
        document.querySelector("#twitter-share").setAttribute('href', "https://twitter.com/intent/tweet?url=https://jugem.404design.dev&text=" + "あなたの点数は" + userCorrectCount + "点！！！！！！！！！" + "%0a" + thanks["4"]);
    }
}

/**
 * 変数のカウントをインクリメントする
 * @param {number} count
 * @returns {number}
 */
function incrementCount(count) {
    count++;
    return count
}

/**
 * 変数の値を0にする
 * @param {number} value
 * @returns {number}
 */
function initializeVariable(value) {
    value = 0;
    return value;
}

/**
 * HTMLのprogressのvalue値の変更
 * @param
 */
function setProgressValue() {
    document.getElementById("quiz-progress").value = progressValue;
}

/**
 * HTMLのprogressのmax値の変更
 * @param {number} maxValue
 */
function setProgressMaxValue(maxValue) {
    document.querySelector("#quiz-progress").setAttribute('max', maxValue);
}

/**
 * デバイス判定機能
 * @param 
 * @return bool
 */
function isSmartPhone() {
    const touchPoints = navigator.maxTouchPoints;
    return touchPoints > 1 ? true : false;
}

/**
 * 比較機能（ボタン押下時）
 * @params
 */
const eventStart = isSmartPhone() ? 'touchstart' : 'mousedown';
document.getElementById("compare").addEventListener(eventStart, e => {
    let value = 1 - selected;
    document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][value]);
    displaySign();
});

/**
 * 比較機能（ボタン非押下時）
 * @params
 */
const eventEnd = isSmartPhone() ? 'touchend' : 'mouseup';
document.getElementById("compare").addEventListener(eventEnd, e => {
    let value = selected
    document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][value]);
    displaySign();
});

/**
 * compare時の正誤アイコン表示機能
 * @param
 */
function displaySign() {
    let signClassName = document.getElementById('result-sign').firstElementChild.className;
    let sign = signClassName == 'sign_correct' ? incorrectImg : correctImg;
    document.getElementById("result-sign").innerHTML = sign;
}

/**
 * 最終結果画面の円グラフ
 * @param {number} correctCount
 * @param {number} amount
 */
function displayEndResultCircle(correctCount, amount) {
    var endResultCircle = new ProgressBar.Circle('#end-result-circle', {
        color: '#FFDE2E',
        duration: 3000,
        easing: 'easeInOut',
        trailColor: 'rgba(218, 218, 218, 0.3)',
        trailWidth: 10,
        strokeWidth: 10,
    });
    endResultCircle.path.style.strokeLinecap = 'round';

    var correctRate = correctCount / amount;
    endResultCircle.animate(correctRate);
}

/**
 * 紙吹雪機能
 * @pram
 */
function doConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    })
}

/**
 * modal表示機能
 * @param 
 */
function showModal() {
    var modal = document.querySelector("#modal");
    modal.classList.add("show-modal");
    document.body.style.overflowY = "hidden";
}

/**
 * modal非表示機能
 * @param 
 */
document.querySelector("#close-button").onclick = function closeModal() {
    var modal = document.querySelector("#modal");
    modal.classList.remove("show-modal");
    document.body.style.overflowY = "visible";
}
