// ==UserScript==
// @name         Bestchoice Injector2.0
// @namespace    http://tampermonkey.net/
// @version      2024-12-06
// @description  Help you to get 100%
// @author       pu6uyun
// @run-at       document-idle
// @match        https://www.bestchoice.net.nz/*
// ==/UserScript==
console.log("script loaded")

const interval = setInterval(() => {
    if (!unsafeWindow.location.href.includes("&p=")) {
        console.log("URL does not contain '&p=', clearing interval.");
        return;
    }
    if (unsafeWindow.bcp) {
        try{
        unsafeWindow.bcp.pp.forEach(pp => {
            if (pp && typeof pp.markQuestion === 'function') {
                // 修改 markQuestion 方法
                pp.markQuestion = function() {
                    var o = this.userScore; // 用户得分对象

                    // 如果不满足运行条件，直接返回 false
                    if (!bcp || (bcp.isTest && !bcp.testMarking) ||
                        (!bcp.settingUp && bcp.totalPages > 1 && !bc.ccid)) {
                        return false;
                    }

                    // 设置满分逻辑
                    o.zeroMarks(); // 清空分数（初始化）
                    o.totalmarks = this.ppTotalMarks; // 设置总分为满分
                    o.firstrightmarks = this.ppTotalMarks; // 设置首次正确分数为满分
                    o.giveupmarks = 0; // 放弃分数为0

                    // 更新所有答案状态为正确
                    this.callFunctionOnAllAnswers(function() {
                        this.isAnswered = true;
                        this.isCorrect = true;
                        this.saveAnswer("r"); // 保存状态为 "正确"
                    });

                    this.allUserAnswersCorrect = true; // 标记所有答案正确
                    this.userScore.correct = true; // 标记用户为正确

                    // 更新用户分数（如果存在）
                    if (!bc.isAdminPreview && bc.user && bc.user.scores) {
                        if (!bc.user.scores.pp[this.ppid] || !bc.user.scores.pp[this.ppid].isLocked) {
                            bc.user.scores.pp[this.ppid] = new bc.Marks();
                            bc.user.scores.pp[this.ppid].addMarksObj(o);
                            bc.user.scores.pp[this.ppid].answerStates = o.answerStates;
                            bc.user.scores.pp[this.ppid].enddate = new Date();
                            bc.user.scores.pp[this.ppid].isLocked = true; // 锁定分数
                        }
                    }

                    // 显示分数和调整布局
                    if (!bcp.isTest) {
                        this.displayQuestionScore();
                    }

                    this.changedSinceMarked = false; // 重置标记状态
                    bcp.rePosition(); // 调整布局
                    $("div").promise().done(function() {
                        bcp.rePosition();
                    });

                    if (!bcp.settingUp) {
                        bcp.moveMarkingToBottom();
                    }
                };
            }
        });} catch (e) {console.log("not in question page");}
        console.log("markQuestion methods have been updated to always return full marks.");
        try{
            unsafeWindow.bcp.markAllQuestions();
        } catch(e){
            console.log("dont need to mark");
        }
        // 模拟点击 class 为 goto-nex tpage 的按钮
        const nextButton = document.querySelector('.goto-nextpage');
        if (nextButton) {
            console.log("Found next page button. Clicking it.");
            nextButton.click();
        } else {
            console.log("Next page button not found.");
        }
    }
}, 500);
