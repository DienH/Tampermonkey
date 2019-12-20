// ==UserScript==
// @name         MEVA+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Help with MEVA
// @author       You
// @match        http*://meva/*
// @require      https://code.jquery.com/jquery.min.js
// require      https://rawgit.com/DienH/Tampermonkey/master/Dien.js
// require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.16.2/math.js
// @grant        unsafeWindow
// ==/UserScript==


(function() {
    var µ = unsafeWindow
    if (!$) {var $ = µ.$}
    if (location.href.search("initSSS")+1){
        window.addEventListener('mousemove', clickLogin)
        setInterval(()=>{if (document.querySelector("#div-quitteSession")){document.querySelector("#div-quitteSession div").click()}}, 500)
        console.log($)
    }
    if (location.href.search("popupContents.jsp")+1){
        let dateScript = document.createElement('script'), hourScript = document.createElement('script'), hourCSS = document.createElement('link')
        dateScript.src = "https://cdn.jsdelivr.net/npm/litepicker/dist/js/main.js"
        hourScript.src = "https://cdn.jsdelivr.net/npm/nj-timepicker/dist/njtimepicker.min.js"
        hourCSS.type = "text/css"
        hourCSS.rel = "stylesheet"
        hourCSS.href = "https://cdn.jsdelivr.net/npm/nj-timepicker/dist/njtimepicker.min.css"
        document.head.append(hourCSS)
        document.head.append(hourScript)
        document.head.append(dateScript)
        window.addEventListener('mousemove', permPicker)
        //document.querySelector('input[name="Datebox"]').type="date"
        //document.querySelector('input[name="Datebox0"]').type="date"
    }
    window.addEventListener('keydown', ev=>{
        if (ev.key=="²"){setTimeout(()=>{
            let iframeDoc = document.querySelector('#SSSFrame').contentDocument
            if (iframeDoc.querySelector("input[name='j_username']")){iframeDoc.querySelector("input[name='j_username']").value="AHARRY"}
            if (iframeDoc.querySelector("input[type='password']")){iframeDoc.querySelector("input[type='password']").value="LDT9jmRum"}
            if (iframeDoc.querySelector("button.GKJG3BODOY")){iframeDoc.querySelector("button.GKJG3BODOY").click()}
            if (iframeDoc.querySelector("button[tabindex='4']")) iframeDoc.querySelector("button[tabindex='4']").click()
        },10)}
    })
})();


function permPicker(ev){
    if (typeof datePicker != "undefined"){
        window.removeEventListener('mousemove', permPicker)
        return
    }
    if (typeof Litepicker != 'undefined'){
        let dateScriptInit = document.createElement('script')
        dateScriptInit.innerHTML = `
var today = new Date()
var datePicker = new Litepicker({
 element: document.querySelector('input[name="Datebox"]'),
 elementEnd: document.querySelector('input[name="Datebox0"]'),
 format: "DD/MM/YYYY",
 lang:"fr-FR",
 numberOfMonths: 2,
 numberOfColumns: 2,
 singleMode: false,
 autoApply: true,
 minDate: today.setDate(today.getDate()-2),
 maxDays: 2,
 selectForward: true,
 onSelect: (d1, d2)=> {
  datePicker.hide()
  if ((d2-d1) == 0){
   let today = new Date()
   if ((today - d1) == 0){
    sortiePerm.hours[14].click()
   } else {
    sortiePerm.hours[9].click()
   }
   retourPerm.hours[18].click()
  } else if ((d2-d1) == 86400000){
   if ((today - d1) == 0){
    sortiePerm.hours[14].click()
   } else {
    sortiePerm.hours[9].click()
   }
   retourPerm.hours[18].click()
  } else {
   if ((today - d1) == 0){
    sortiePerm.hours[18].click()
   } else {
    sortiePerm.hours[9].click()
   }
  }
  sortiePerm.days =  (d2-d1) == 0 ? 0 : ((d2-d1) == 86400000 ? 1 : 2)
  sortiePerm.show()
 }
});

var sortiePerm = new NJTimePicker({
    targetEl: document.querySelector('input[name="Heurebox"]'),
    disabledHours: [0, 1, 2, 3, 4, 5, 6, 21, 22, 23],
    minutes: [0,30],
    texts: {
        header: 'Heure de départ en permission',
        hours: 'Heure',
        minutes: 'Minutes'
        },
    format: '24'
  });

sortiePerm.buttons.save = sortiePerm.buttons.element.children[0]
sortiePerm.buttons.clear = sortiePerm.buttons.element.children[1]
sortiePerm.buttons.close = sortiePerm.buttons.element.children[2]
for (var i = 0 ; i < 24 ; i++){sortiePerm.hours[i] = sortiePerm.hours.element.lastChild.children[i]}
sortiePerm.minutes[0]=sortiePerm.minutes.element.lastChild.children[0]
sortiePerm.minutes[30]=sortiePerm.minutes.element.lastChild.children[1]

var retourPerm = new NJTimePicker({
    targetEl: document.querySelector('input[name="Heurebox0"]'),
    disabledHours: [0, 1, 2, 3, 4, 5, 6, 21, 22, 23],
    minutes: [0,30],
    texts: {
        header: 'Heure de retour de permission',
        hours: 'Heure',
        minutes: 'Minutes'
        },
    format: '24'
  });

retourPerm.buttons.save = retourPerm.buttons.element.children[0]
retourPerm.buttons.clear = retourPerm.buttons.element.children[1]
retourPerm.buttons.close = retourPerm.buttons.element.children[2]
for (var i = 0 ; i < 24 ; i++){retourPerm.hours[i] = retourPerm.hours.element.lastChild.children[i]}
retourPerm.minutes[0]=retourPerm.minutes.element.lastChild.children[0]
retourPerm.minutes[30]=retourPerm.minutes.element.lastChild.children[1]

//console.log(sortiePerm)

var currentHour = (new Date()).getHours() + 1
sortiePerm.minutes[0].click()
retourPerm.minutes[0].click()
//console.log(sortiePerm.hours[currentHour > 23 ? 1 : currentHour].disabled ? sortiePerm.hours[9].click() : sortiePerm.hours[currentHour > 23 ? 9 : currentHour].click())
//retourPerm.hours[currentHour+4 > 23 ? 1 : currentHour+4].disabled ? retourPerm.hours[18].click() : retourPerm.hours[currentHour+4 > 23 ? 18 : currentHour+4].click()

sortiePerm.hours.lastValue = sortiePerm.hours.currentValue
sortiePerm.hours.element.onclick = (ev)=> {
 if (ev.target.classList.contains('selected') || (sortiePerm.hours.lastValue != sortiePerm.hours.currentValue))
 {
  sortiePerm.hours.lastValue = sortiePerm.hours.currentValue
  sortiePerm.buttons.element.querySelector('div.nj-action-button.nj-action-save').click()
 }
}

retourPerm.hours.lastValue = sortiePerm.hours.currentValue
retourPerm.hours.element.onclick = (ev)=> {
 if (ev.target.classList.contains('selected') || (retourPerm.hours.lastValue != retourPerm.hours.currentValue))
 {
  retourPerm.hours.lastValue = retourPerm.hours.currentValue
  retourPerm.buttons.save.click()
 }
}

var buttonssortiePerm = sortiePerm.container.lastChild, buttonsretourPerm = retourPerm.container.lastChild
sortiePerm.buttons.save.innerText = "Heure retour"
sortiePerm.buttons.clear.innerText = "Retour"
sortiePerm.buttons.clear.onclick = ()=>{sortiePerm.hide();datePicker.show()}

sortiePerm.buttons.close.innerText = retourPerm.buttons.close.innerText = "Fermer"

retourPerm.buttons.save.innerText = "Valider"

retourPerm.buttons.clear.innerText = "Retour"
retourPerm.buttons.clear.onclick = ()=>{retourPerm.hide();sortiePerm.show()}

sortiePerm.on('save', data=>{retourPerm.show()})

datePicker.show()
document.body.sortiePerm = sortiePerm
document.body.retourPerm = retourPerm
document.body.datePicker = datePicker
`
        document.body.append(dateScriptInit)
    }
}


function clickLogin(ev){
    if (document.querySelector("input[name='password']")){
        document.querySelector("input[name='password']").addEventListener('focus', ev=>{
            document.querySelector("input[name='password']").value="LDT9jmRum"
        })
        window.removeEventListener('mousemove', clickLogin)
    }
    if (document.querySelector("div.GKJG3BODITB")){
        document.querySelector("div.GKJG3BODITB").addEventListener('click', ev=>{
            if (document.querySelector("input[name='j_username']")) document.querySelector("input[name='j_username']").value="AHARRY"
            if (document.querySelector("input[type='password']")) document.querySelector("input[type='password']").value="LDT9jmRum"
            if (document.querySelector("button.GKJG3BODOY")) document.querySelector("button.GKJG3BODOY").click()
            if (document.querySelector("button[tabindex='4']")) document.querySelector("button[tabindex='4']").click()
        })
        window.removeEventListener('mousemove', clickLogin)
    }
}