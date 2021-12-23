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
    var req = new XMLHttpRequest();
    req.open("GET", "../data/quiz.json", false);
    req.send(null);
    var object = JSON.parse(req.responseText);
    return object;
}


/**
 * quizObjectからjson形式でクイズを取得
 * @param 
 * @return
 */
function getQuiz() {
    var quiz = quizzes[levelIndex][quizIndex];
    quizIndex++;
    progressMaxValue = quizzes[levelIndex].length;
    setProgressMaxValue(progressMaxValue);
    displayQestion(quiz);

    document.querySelector("#start").style.display = "none";
    document.querySelector("#progress").style.display = "block";
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
    document.querySelector("#img1").setAttribute('src', quiz["question"]["img_path"][0]);
    document.querySelector("#img2").setAttribute('src', quiz["question"]["img_path"][1]);
    
    document.querySelector("#quiestion").style.display = "block"
}

/**
 * 変数のカウントをインクリメントする
 * @param {integer} count
 * @returns 
 */
function incrementCount(count) {
    count++;
    return count
}
// function incrementProgress() {
//     progressValue++;
// }

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
 * @returns
 */
function setProgressMaxValue(maxValue) {
    document.querySelector("#quiz-progress").setAttribute('max',maxValue);
}



/**
 * 正誤判定機能
 * @param {object} selected
 * @return {list}
 */
function checkCorrect(selected) {
    var correct_num = quizzes[levelIndex][quizIndex - 1]["answer"]["correct_num"];
    if (selected == correct_num) {
        userCorrectCount++;
        return [1, correct_num];
    } else {
        return [0, correct_num]
    }
}

/**
 * 正誤判定画面の生成
 * @param {object} select
 * @return
 */
function generateResult(select) {
    // ここでいい？
    selected = select
    var result = checkCorrect(selected)
    
    progressValue = incrementCount(progressValue);
    setProgressValueue();
    displayResult(result)
}

/**
 * 正誤判定画面の生成
 * @param {array} result
 * @return
 */
function displayResult(result) {
    if (result[0] == 1) {
        if (quizIndex >= quizzes[levelIndex].length && levelIndex == quizzes.length - 1) {
            document.querySelector("#next-btn").value = "最終結果を見る"
        }
        console.log("正解");
        document.querySelector("#quiestion").style.display = "none";
        document.querySelector("#result").style.display = "block";

        document.querySelector("#judged").innerText = "正解";
        document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][selected]);
        doConfetti();
    } else {
        if (quizIndex >= quizzes[levelIndex].length && levelIndex == quizzes.length - 1) {
            document.querySelector("#next-btn").value = "最終結果を見る"
        }
        console.log("不正解");
        document.querySelector("#quiestion").style.display = "none";
        document.querySelector("#result").style.display = "block";

        document.querySelector("#judged").innerText = "不正解";
        document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][selected]);
    }
}

/**
 * @params
 * @return
 */
function displayComparison() {
    var value = selected == 0 ? 1 : 0;
    document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][value]);
}

/**
 * @params
 * @return
 */
function undisplayComparison() {
    var value = selected
    document.querySelector("#correct-img").setAttribute('src', quizzes[levelIndex][quizIndex - 1]["question"]["img_path"][value]);
}

/**
 * 次の問題への遷移
 * @param
 * @return
 */
function goNextQuestion() {
    if (quizIndex >= quizzes[levelIndex].length && levelIndex == quizzes.length - 1) {
        displayEndResult(userCorrectCount)
        return
    }
    if (quizIndex >= quizzes[levelIndex].length) {
        // progressValueの指定
        progressValue = 0;
        setProgressValueue();

        changeLevel();

        // progressMaxValueの指定
        progressMaxValue = quizzes[levelIndex].length;
    }
    getQuiz();
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

    displayEndResultCircle();

    document.querySelector("#correct-cnt").innerText = userCorrectCount + "/" + amount + "問正解";
    var thanks = quizObject["thanks"];
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
 *@params
 *@return 
 */
function displayEndResultCircle() {
    var endResultCircle = new ProgressBar.Circle('#end-result-circle', {
        color: '#FCB03C',
        duration: 3000,
        easing: 'easeInOut',
        trailColor: '#eee',
        trailWidth: 1,
    });

    var amount = 0;
    for (var i = 0; i < quizzes.length; i++) {
        amount += quizObject["quizzes"][i].length;
    }
    var correctRate = userCorrectCount / amount;
    endResultCircle.animate(correctRate);
}


/**
 * 紙吹雪機能
 * @pram
 * @return
 */
function doConfetti(){
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    })
}
