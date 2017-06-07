"use strict";

$(function(){
    $("#stats_menu").click(function () {
        $("#stats_page").removeClass("hidden");
        $("#lesson_choice_page").addClass("hidden");
        $("#setup_page").addClass("hidden");
    });
    $("#lesson_menu").click(function () {
        $("#lesson_choice_page").removeClass("hidden");
        $("#stats_page").addClass("hidden");
        $("#setup_page").addClass("hidden");
    });
    $("#setup_menu").click(function () {
        $("#setup_page").removeClass("hidden");
        $("#stats_page").addClass("hidden");
        $("#lesson_choice_page").addClass("hidden");
    });

    let lesson_btn = $('<button type="button" id="btn_1" class="btn">Apple</button>');
    $("#lesson_list_div").append(lesson_btn);

});

