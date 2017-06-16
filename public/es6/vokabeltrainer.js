"use strict";

const lessonEndpoint = "https://www2.htw-dresden.de/~s70357/vokabel.php/";
const statsEndpoint = "https://www2.htw-dresden.de/~s70357/vokabel_stats.php/";

const overallResult = function(lessonName,correctCount,count){
    $("#continue_btn").off("click");
    $("#send_results").button("reset");
    $("#send_results").click( function () {
        $(this).button("loading");
        let stats = {"lesson_name": lessonName, "correct_count": correctCount, "answered_count": count};
        let statsCall = $.ajax(statsEndpoint,{contentType: "application/json; charset=UTF-8", method: "PUT",
            processData: false, data: JSON.stringify(stats)});
        statsCall.fail((jqXHR, status, error) => {
            console.log(status);
            console.log(error);
            alert("Sending stat failed with " + status + " and error " + error);
            $("#send_results").button("reset");
        });

        statsCall.done((data,status) => {
            console.log("Sending stats succeded with " + status);
            callStatsPage();
        });
    });
    $("#overall_lesson").text(lessonName);
    $("#overall_result").text(correctCount + " von " + count);
    $("#lesson_page").addClass("hidden");
    $("#overall_page").removeClass("hidden");
};


const askQuestion = function(lesson, nextQuestion, btoa,correctCount) {
    let entries = Object.entries(lesson.translations);
    if(nextQuestion >= entries.length){
        console.log(correctCount,"/",nextQuestion);
        return overallResult(lesson.name,correctCount,nextQuestion);
    }
    $("#ab").off("click");
    $("#ba").off("click");
    $("#ab").click(() => {
        askQuestion(lesson,nextQuestion,false,correctCount);
        $("#ab").addClass("active");
        $("#ba").removeClass("active");
    });
    $("#ba").click(() => {
        askQuestion(lesson,nextQuestion,true,correctCount);
        $("#ba").addClass("active");
        $("#ab").removeClass("active");
    });
    if (btoa) {
        entries = Object.keys(lesson.translations)
            .reduce((obj, key) => Object.assign({}, obj, { [lesson.translations[key]]: key }), {});
        entries = Object.entries(entries);
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

    $("#stats_group").empty();

    let statsCall = $.ajax(statsEndpoint,{dataType: "json"});
    statsCall.fail((jqXHR, status, error) => {
        console.log(status);
        console.log(error);
        alert("Getting the stats failed with " + status + " and error" + error);
    });

    statsCall.done((data,status) => {
        console.log(status);
        for (let i in data){
            let stat = data[i];
            let statEntry = $('<li class="list-group-item"> <span class="badge"> '
                + stat.correct_count + "/" + stat.answered_count
                + "</span>" +  stat.lesson_name  +"</li>");
            $("#stats_group").append(statEntry);
        }
    });
};

const callLessonPage = function() {
    $("#lesson_choice_page").removeClass("hidden");
    $("#stats_page").addClass("hidden");
    $("#setup_page").addClass("hidden");
    $("#lesson_page").addClass("hidden");
    $("#lesson_result").addClass("hidden");
    $("#overall_page").addClass("hidden");

    let lessonCall = $.ajax(lessonEndpoint,{dataType: "json"});
    lessonCall.fail((jqXHR, status, error) => {
        console.log(status);
        console.log(error);
        alert("Getting lessons failed with " + status + " and error " + error);
    });

    lessonCall.done((data,status) => {
        $("#lesson_list_div").empty();
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
};

$(function(){
    $("#stats_menu").click(callStatsPage);

    $("#lesson_menu").click(callLessonPage);
    $("#setup_menu").click(function () {
        $("#setup_page").removeClass("hidden");
        $("#stats_page").addClass("hidden");
        $("#lesson_choice_page").addClass("hidden");
        $("#lesson_page").addClass("hidden");
        $("#lesson_result").addClass("hidden");
        $("#overall_page").addClass("hidden");
    });

    callLessonPage();
});


