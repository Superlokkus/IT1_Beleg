'use strict';

$(function(){
    $('#btn_2').addClass('disabled');
    $('#btn_1').click(function(){
       console.log("Clicked");
       $('#btn_3').addClass('disabled');
    });
    console.log("I Ran");
});
