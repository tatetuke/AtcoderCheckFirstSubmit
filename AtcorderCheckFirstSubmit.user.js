// ==UserScript==
// @name         Atcorder Check First Submit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Check First submit Resolved in Contests
// @author       tatetuke
// @match        https://atcoder.jp/contests/*/tasks/*
// @match        https://atcoder.jp/contests/*/submissions
// @icon         https://atcoder.jp/*
// @grant        none
// @copyright    2023, tatetuke (https://tatetuke.github.io/)
// @license      MIT License; https://opensource.org/licenses/MIT
// ==/UserScript==

(function() {
    'use strict';

function get_URL(){
   var language = document.getElementsByClassName("select2-selection__rendered");
   language=Array.prototype.slice.call(language)[0].innerText;
   language=language.substr(0, language.indexOf(' ('));
   //特殊文字を変換
   language=language.replace( /\+/g,'%2B');
   language=language.replace( /#/g,'%23');
   var ret=location.href.substr(0,35)+'submissions?f.LanguageName='+language+'&f.Status=AC&.Task='+location.href.substr(41,8)+'&f.User=&orderBy=created'
    return ret
};


function get_submit_URL(){

    var submit_url=get_URL()
    // XMLHttpRequestオブジェクトの作成
    let request = new XMLHttpRequest();

  request.onreadystatechange = function(){
    if (request.readyState == 4){
      if (request.status == 200){
         var texl =request.responseText
         // console.log(texl)
         // var regexp=/詳細/g;
         //提出コードをURL取得
         var regexp_sub_url=/<a href="\/contests\/......\/submissions\/........">詳細<\/a>/g;
         const arr_url = [...texl.matchAll(regexp_sub_url)];
         //提出時間を取得（arr_urlと1対1対応）
         var regexp_sub_time=/<td class="no-break"><time class='fixtime fixtime-second'>........................<\/time><\/td>/g;
         const arr_time = [...texl.matchAll(regexp_sub_time)];
         //コンテスト時間を取得
         var regexp_contest_time=/<time class='fixtime fixtime-full'>........................<\/time>/g;
         const contest_time = [...texl.matchAll(regexp_contest_time)];
         //コンテスト開始/終了時間を取得
         var start_time=contest_time[0][0].substr(34,17);
         var end_time=contest_time[1][0].substr(34,17);

         if(arr_time.lenght==0){
             window.alert("not solved");
         }

         for ( i=0; i<arr_time.length ; i++) {
             var v_time=arr_time[i][0].substr(57,17)
             if(v_time>=start_time&&v_time<end_time){
                 var url=arr_url[i][0].substr(9,37)
                 // url='https://atcoder.jp'+url
                 window.open(url, '_blank'); // 新しいタブを開き、ページを表示
                 break;
             }else if(v_time>=end_time){
                 console.log('OK')
                 window.alert("not solved in contest");
                 var url2=arr_url[i][0].substr(9,37)
                 window.open(url2, '_blank');
                 break;
             }
             // 繰り返す処理を書く
             // console.log(arr_time.length)
         }

      }
    }
  }

  request.open('GET', submit_url, true);
  request.send(null);
};



function create_button() {
    var parent = document.getElementsByClassName("h2");
    var a = document.createElement("a");
    a.textContent = "Firstest Code";
    a.setAttribute("class", "btn btn-default btn-sm");//AtcoderのCopyボタンと同じCSSを適用
    parent[0].appendChild(a);
    a.addEventListener('mouseup', get_URL, false);
    a.addEventListener('mouseup', get_submit_URL, false);
};
create_button();


})();

