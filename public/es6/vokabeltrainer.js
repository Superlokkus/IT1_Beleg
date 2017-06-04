'use strict';

$(function(){
    $('#btn_2').addClass('disabled');
    $('#btn_1').click(function(){
       console.log("Clicked");
       $('#btn_3').addClass('disabled');
    });
    $('#stats_menu').click(function () {
        $('#stats_page').removeClass('hidden');
        $('#lesson_choice_page').addClass('hidden');
        $('#setup_page').addClass('hidden');
    })
    $('#lesson_menu').click(function () {
        $('#lesson_choice_page').removeClass('hidden');
        $('#stats_page').addClass('hidden');
        $('#setup_page').addClass('hidden');
    })
    $('#setup_menu').click(function () {
        $('#setup_page').removeClass('hidden');
        $('#stats_page').addClass('hidden');
        $('#lesson_choice_page').addClass('hidden');
    })



    console.log("I Ran");
});

