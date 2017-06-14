"use strict";

const lessonEndpoint = "https://www2.htw-dresden.de/~s70357/vokabel.php/";

const overallResult = function(lessonName,correctCount,count){
    $("#continue_btn").off("click");
    $("#send_results").click( function () {
        $(this).button("loading");
        callStatsPage();
    });
    $("#overall_lesson").text(lessonName);
    $("#overall_result").text(correctCount + " von " + count);
    $("#lesson_page").addClass("hidden");
    $("#overall_page").removeClass("hidden");
};


const askQuestion = function(lesson, nextQuestion, btoa,correctCount) {
    const entries = Object.entries(lesson.translations);
    if(nextQuestion >= entries.length){
        console.log(correctCount,"/",nextQuestion);
        return overallResult(lesson.name,correctCount,nextQuestion);
    }
    $("#vokabel_text").text(entries[nextQuestion][0]);
    $("#pronounce_text").text("");
    $("#pronounce_text").text(lesson.pronunciations[entries[nextQuestion][0]]);
    $("#lesson_page_answers").empty();
    const choiceCount = Math.min(5,entries.length);
    const rightAnswerPos = Math.floor(Math.random() * 10 % choiceCount);
    for (let i = 0; i < choiceCount; ++i){
        let answer;
        if (i == rightAnswerPos){
            answer = entries[nextQuestion][1];
        } else {
            let alternative;
            do {
                alternative = Math.floor(Math.random() * 10 % entries.length);
                answer = entries[alternative][1];
            } while (alternative == rightAnswerPos);
        }
        $("#lesson_page_answers").append('<div class="radio"> <label> <input type="radio" name="optionsAnswers" value="'
            + answer
            + '">'
            + answer +"</label> </div> ");
    }

    $("#log_answer_btn").off("click");
    $("#log_answer_btn").click(()=> {
        const choosen = $("#lesson_page_answers input:radio:checked").val();
        resultSite(choosen,entries[nextQuestion][1],()=>{
            $("#lesson_page").removeClass("hidden");
            $("#lesson_result").addClass("hidden");
            if (choosen == entries[nextQuestion][1]){
                ++correctCount;
            }
            askQuestion(lesson, ++nextQuestion, btoa,correctCount);
        });
    });

};

const lessonStart = function(lesson) {
    if (lesson.translations.length <= 0){
        alert("No translations in lesson " + lesson.name);
        return;
    }
    $("#lesson_title").text(lesson.name);
    $("#ab").addClass("active");
    $("#ba").removeClass("active");
    $("#lesson_choice_page").addClass("hidden");
    $("#lesson_page").removeClass("hidden");

    askQuestion(lesson,0,false,0);

};

const resultSite = function(choosen,expected,callback){
    $("#lesson_page").addClass("hidden");
    $("#lesson_result").removeClass("hidden");
    if (choosen != expected) {
        $("#lesson_result_well").css("background-color","red");
        $("#lesson_result_text").text("Falsch");
    } else {
        $("#lesson_result_well").css("background-color","green");
        $("#lesson_result_text").text("Richtig");
    }
    $("#lesson_result_choosen").text(choosen);
    $("#lesson_result_expected").text(expected);
    $("#continue_btn").off("click");
    $("#continue_btn").click(()=> {
        callback();
    });

};

const callStatsPage = function () {
    $("#stats_page").removeClass("hidden");
    $("#lesson_choice_page").addClass("hidden");
    $("#setup_page").addClass("hidden");
    $("#lesson_page").addClass("hidden");
    $("#lesson_result").addClass("hidden");
};

$(function(){
    $("#stats_menu").click(callStatsPage);

    $("#lesson_menu").click(function () {
        $("#lesson_choice_page").removeClass("hidden");
        $("#stats_page").addClass("hidden");
        $("#setup_page").addClass("hidden");
        $("#lesson_page").addClass("hidden");
        $("#lesson_result").addClass("hidden");
        $("#overall_page").addClass("hidden");
    });
    $("#setup_menu").click(function () {
        $("#setup_page").removeClass("hidden");
        $("#stats_page").addClass("hidden");
        $("#lesson_choice_page").addClass("hidden");
        $("#lesson_page").addClass("hidden");
        $("#lesson_result").addClass("hidden");
        $("#overall_page").addClass("hidden");
    });

    let lessonCall = $.ajax(lessonEndpoint,{dataType: "json"});
    lessonCall.fail((jqXHR, status, error) => {
        console.log(status);
        console.log(error);
    });

    lessonCall.done((data,status) => {
        console.log(status);
        for (let i in data){
            let lesson = data[i];
            let lesson_btn = $('<button type="button" id="btn_lesson_' + i + '" class="btn btn-default">'
                + lesson.name + "</button>");
            $("#lesson_list_div").append(lesson_btn);
            $("#btn_lesson_" + i).click(function(){
                console.log("Clicked lesson " + i);
                lessonStart(lesson);
            });
        }
    });
    console.log($("#vokabel_text").text());

});


