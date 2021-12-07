'use strict'
var quizList = getJSON();
var quizIdx = 0;
var levelIdx = 0;
var userCorrectCnt = 0;
var selected;
var progressVal = 0;
var progressMax = 0;


/**
 * json形式でクイズを取得
 * @param 
 * @return
 */
function getQuiz() {
    var quiz = quizList["items"][levelIdx][quizIdx];
    quizIdx++;
    generateQestion(quiz);
    progressMax = quizList["items"][levelIdx].length;
    document.querySelector("#start").style.display = "none";
    document.querySelector("#progress").style.display = "block";
}

/**
 * レベルの切り替え
 * @param 
 * @return
 */
function changeLevel() {
    quizIdx = 0;
    levelIdx++;
}

/**
 * 問題を表示機能
 * @param {object} quiz 
 * @retunrn 
 */
function generateQestion(quiz) {
    document.querySelector("#idx").innerHTML = JSON.stringify(quiz["quiz_id"]);
    document.querySelector("#quiz-text").innerHTML = JSON.stringify(quiz["question"]["quiz_text"]);

    document.querySelector("#img1").setAttribute('src', quiz["question"]["img_path"][0]);
    document.querySelector("#img2").setAttribute('src', quiz["question"]["img_path"][1]);

    document.querySelector("#quiestion").style.display = "block";

}

/**
 * progressValのインクリメント
 * @param
 * @returns 
 */
function incrementProgress() {
    progressVal++;
}

/**
 * HTMLのprogressのvalue値の変更
 * @param
 * @returns 
 */
function setProgressVal() {
    document.getElementById("quiz-progress").value = progressVal;
    console.log("progressVal", progressVal)
}

/**
 * HTMLのprogressのmax値の変更
 * @param
 * @returns
 */
function setProgressMax() {

    document.querySelector("#quiz-progress").setAttribute('max', progressMax);
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
 * @param {object} selected
 * @return {list}
 */
function checkCorrect(selected) {
    var correct_num = quizList["items"][levelIdx][quizIdx - 1]["answer"]["correct_num"];
    if (selected == correct_num) {
        userCorrectCnt++;
        console.log(userCorrectCnt);
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
    
    incrementProgress();
    setProgressVal();

    selected = select
    var result_flag = checkCorrect(selected)
    console.log(result_flag);
    if (result_flag[0] == 1) {
        if (quizIdx >= quizList["items"][levelIdx].length && levelIdx == quizList["items"].length - 1) {
            document.querySelector("#next-btn").value = "最終結果を見る"
        }
        console.log("正解");
        document.querySelector("#quiestion").style.display = "none";
        document.querySelector("#result").style.display = "block";

        document.querySelector("#judged").innerText = "正解";
        document.querySelector("#correct-img").setAttribute('src', quizList["items"][levelIdx][quizIdx - 1]["question"]["img_path"][selected]);
        doConfetti();
    } else {
        if (quizIdx >= quizList["items"][levelIdx].length && levelIdx == quizList["items"].length - 1) {
            document.querySelector("#next-btn").value = "最終結果を見る"
        }
        console.log("不正解");
        document.querySelector("#quiestion").style.display = "none";
        document.querySelector("#result").style.display = "block";

        document.querySelector("#judged").innerText = "不正解";
        document.querySelector("#correct-img").setAttribute('src', quizList["items"][levelIdx][quizIdx - 1]["question"]["img_path"][selected]);
    }
}

/**
 * @params
 * @return
 */
function down() {
    if (selected == 0) {
        var value = 1
    } else {
        var value = 0
    }
    document.querySelector("#correct-img").setAttribute('src', quizList["items"][levelIdx][quizIdx - 1]["question"]["img_path"][value]);
}

/**
 * @params
 * @return
 */
function up() {
    var value = selected
    document.querySelector("#correct-img").setAttribute('src', quizList["items"][levelIdx][quizIdx - 1]["question"]["img_path"][value]);
}

/**
 * 次の問題への遷移
 * @param
 * @return
 */
function goNextQuestion() {
    if (quizIdx >= quizList["items"][levelIdx].length && levelIdx == quizList["items"].length - 1) {
        generateEndResult(userCorrectCnt)
        return
    }
    if (quizIdx >= quizList["items"][levelIdx].length) {
        // progressValの指定
        progressVal = 0;
        setProgressVal();

        changeLevel();

        // progressMaxの指定
        progressMax = quizList["items"][levelIdx].length;
        setProgressMax();
    }
    getQuiz();
    document.querySelector("#result").style.display = "none";
}

/**
 * 最終結果画面の生成
 * @pram
 * @return
 */
function generateEndResult(userCorrectCnt) {
    document.querySelector("#result").style.display = "none";
    document.querySelector("#end-result").style.display = "block";
    // circle;
    var amount = 0;
    for (var i = 0; i < quizList["items"].length; i++) {
        amount += quizList["items"][i].length;
    }
    var correctRate = userCorrectCnt/amount
    circle.animate(correctRate);

    document.querySelector("#correct-cnt").innerText = userCorrectCnt + "/" + amount + "問正解";
    var thanks = quizList["thanks"];
    if (userCorrectCnt < 1) {
        document.querySelector("#thanks").innerText = thanks["0"];
    } else if (userCorrectCnt > 0 && userCorrectCnt < 2) {
        document.querySelector("#thanks").innerText = thanks["1"];
    } else if (userCorrectCnt > 1 && userCorrectCnt < 3) {
        doConfetti();
        document.querySelector("#thanks").innerText = thanks["2"];
    } else {
        doConfetti();
        document.querySelector("#thanks").innerText = thanks["3"];
    }
}


var circle = new ProgressBar.Circle('#container', {
    color: '#FCB03C',
    duration: 3000,
    easing: 'easeInOut',
    trailColor: '#eee',
    trailWidth: 1,
});

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
