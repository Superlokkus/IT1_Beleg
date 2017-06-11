"use strict";

const lessonEndpoint = "https://www2.htw-dresden.de/~s70357/vokabel.php/";


const askQuestion = function(lesson, nextQuestion, btoa) {
    const entries = Object.entries(lesson.translations);
    if(nextQuestion >= entries.length){
        return;//TODO Goto stats
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

    askQuestion(lesson,0,false);

};

$(function(){
    $("#stats_menu").click(function () {
        $("#stats_page").removeClass("hidden");
        $("#lesson_choice_page").addClass("hidden");
        $("#setup_page").addClass("hidden");
        $("#lesson_page").addClass("hidden");
    });
    $("#lesson_menu").click(function () {
        $("#lesson_choice_page").removeClass("hidden");
        $("#stats_page").addClass("hidden");
        $("#setup_page").addClass("hidden");
        $("#lesson_page").addClass("hidden");
    });
    $("#setup_menu").click(function () {
        $("#setup_page").removeClass("hidden");
        $("#stats_page").addClass("hidden");
        $("#lesson_choice_page").addClass("hidden");
        $("#lesson_page").addClass("hidden");
    });

    $("#log_answer_btn").click(()=> {
        console.log($("#lesson_page_answers input:radio:checked").val());
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


