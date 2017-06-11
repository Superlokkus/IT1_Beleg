"use strict";

const lessonEndpoint = "https://www2.htw-dresden.de/~s70357/vokabel.php/";

const lessonStart = function(lesson) {
    $("#lesson_title").text(lesson.name);

    $("#lesson_choice_page").addClass("hidden");
    $("#lesson_page").removeClass("hidden");


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


