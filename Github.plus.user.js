// ==UserScript==
// @name         Github+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://github.com/*/*/edit/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    window.onkeydown = function(e){
        if(e.ctrlKey && e.keyCode == 'S'.charCodeAt(0)){
            e.preventDefault();
            document.querySelector('button[data-edit-text="Commit changes"]').click()
            //your saving code
        }
    }
    // Your code here...
})();
