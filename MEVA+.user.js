// ==UserScript==
// @name         MEVA+
// @namespace    http://tampermonkey.net/
// @version      0.2.11
// @description  Help with MEVA
// @author       Me
// @match        http*://meva/*
// @downloadURL  https://github.com/DienH/Tampermonkey/raw/master/MEVA%2B.user.js
// @require      https://code.jquery.com/jquery.min.js
// require      https://rawgit.com/DienH/Tampermonkey/master/Dien.js
// require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.16.2/math.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==


(function() {

    var µ = unsafeWindow
    if (!$ || !$.fn) {var $ = window.jQuery || unsafeWindow.jQuery || window.parent.jQuery};
    if (!GM_getValue('Meva', false)){GM_setValue('Meva', {user:"",password:""})}
    let dateScript = document.createElement('script'), hourScript = document.createElement('script'), hourCSS = document.createElement('link'), title = ""
    dateScript.src = "https://cdn.jsdelivr.net/npm/litepicker/dist/js/main.js"
    hourScript.src = "https://cdn.jsdelivr.net/npm/nj-timepicker/dist/njtimepicker.min.js"
    hourCSS.type = "text/css"
    hourCSS.rel = "stylesheet"
    hourCSS.href = "https://cdn.jsdelivr.net/npm/nj-timepicker/dist/njtimepicker.min.css"



    if (location.pathname == "/m-eva/"){
        $('#SSSFrame').load((ev)=>{
            let SSSFrame_win = ev.target.contentWindow.name == "SSSFrame" ? ev.target.contentWindow : document.getElementById('SSSFrame').contentWindow
            let SSSFrame_wait = setInterval(()=>{
                let $CS_Anest = $(`.GDKHHE1PTB-fr-mckesson-meva-application-web-gwt-preferredapplications-client-ressources-RessourcesCommunCss-carousel  div.carousel_enabled_item:contains("Consultation d'anesthésie")`, SSSFrame_win.document)
                if ($CS_Anest.length){
                    SSSFrame_win.dispatchEvent(new Event('resize'))
                    clearInterval(SSSFrame_wait)
                }
            }, 500)
            $(SSSFrame_win).resize((ev)=>{
                let SSSFrame_win = ev.target.name == "SSSFrame" ? ev.target : document.getElementById('SSSFrame').contentWindow
                setTimeout(()=>{
                    if (!SSSFrame_win.document.getElementById('SSSFrame_MevaStyle')){
                        let cssStyle = document.createElement('style');cssStyle.id = "SSSFrame_MevaStyle"
                        cssStyle.innerText = `
#HEO_POPUP.GD42JS-DKXB .dialogMiddleCenter {background:#F5F5F5;}
`
                        SSSFrame_win.document.body.append(cssStyle)
                    }
                    if (!SSSFrame_win.document.getElementById('SSSFrame_Script')){
                        let script = document.createElement('script')
                        script.id = "SSSFrame_Script"
                        script.innerHTML = `
$.expr[":"].containsI = function (a, i, m) {return (a.textContent || a.innerText || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(m[3].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))>=0;};

output_Selector = function(sel, checkExists = false){
 let output = document.heoPane_output || window.parent.document.heoPane_output
 if (!sel){sel = "Retourner"}
 let filterString = ""
 if (typeof sel == "string" && sel.search(" ")+1){
  sel = sel.split(" ")
  for (let i = 0; i < sel.length ; i++){
   filterString += ":containsI("+sel[i]+")"
  }
 }
 sel = 'a'+(typeof sel == "string" ? ':contains('+sel+')' : (typeof sel == "number" ? '[onclick*='+sel+']' : filterString))
 if (checkExists){
  return ($(sel, output.document.body).length > 0 ? true : false)
 }else{
  setTimeout((selector, out)=>$(selector, out.document).each((i,el)=>{if (!i){setTimeout((el)=>{console.log(el);el.click()},500, el)}}), 500, sel, output)
 }
}
`
                        SSSFrame_win.document.body.append(script)
                    }
                    $(`.GDKHHE1PTB-fr-mckesson-meva-application-web-gwt-preferredapplications-client-ressources-RessourcesCommunCss-carousel  div.carousel_enabled_item:contains("Consultation d'anesthésie")`, SSSFrame_win.document).remove()
                }, 500)
            })
        })
        window.frameWait = setInterval(()=>{
            let $frames = $('iframe', $('#SSSFrame')[0].contentDocument)
            if ($frames.is("#fr\\.mckesson\\.clinique\\.application\\.web\\.portlet\\.gwt\\.ClinicalGWTPortal")){
                $frames.filter('#fr\\.mckesson\\.clinique\\.application\\.web\\.portlet\\.gwt\\.ClinicalGWTPortal').each(
                    (i, el)=>{
                        if (el.contentWindow.NZb) clearInterval(window.frameWait)
                    }
                )
            }
        }, 500)
        window.mevaWait = setInterval(()=>{
            let SSSFrame = document.getElementById('SSSFrame')
            if (SSSFrame){
                SSSFrame.onload = ()=>{
                    SSSFrame.contentWindow.removeEventListener('click', monitorClick)
                    SSSFrame.contentWindow.addEventListener('click', monitorClick)
                }
            }
        },500)

    }else if (location.href.search("initSSS")+1){
        if (!window.monitorMouseMove) window.addEventListener('mousemove', clickLogin)
        //setInterval(()=>{if (document.querySelector("#div-quitteSession")){document.querySelector("#div-quitteSession div").click()}}, 500)

        //$('.GOAX34LJRB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBodyGroupLine').remove()

    } else if ((location.href.search('heoOutput.jsp')+1)){
        switch($('div.outlineTitle').text().trim()){
            case "Prescriptions Usuelles de Psychiatrie Adulte" :
                $('a:contains("Consignes")').contextmenu(ev=>{ev.preventDefault();})
                break;
        }
    } else if ((location.href.search("popupContents.jsp")+1)){
        let styleEl = document.createElement('style')
        styleEl.innerHTML = `
.outOf2DaysRange {background:coral;}
.nj-picker .outOf2DaysRange.nj-item:hover {background:antiquewhite;}
body {background-color:#F5F5F5;}
`
        document.head.append(styleEl)

        if (title = document.head.querySelector('title')){
            switch(title.innerText){
                case "SORTIETEMPO":
                    document.head.append(hourCSS)
                    document.head.append(hourScript)
                    document.head.append(dateScript)
                    setTimeout(permPicker, 250)
                    break;
                case "Examen Tomodensitométrique":
                    break;
                default:
                    break;
            }
        } else {
            if ($('h1').text()=="Information"){
                if (document.body.innerText.search('date de début est située dans le passé')){
                    $('#HEO_POPUP #ZonePopupBoutons span.GD42JS-DP5:contains("OK")', window.parent.document)[0].click()
                }
            }
        }
    } else if (location.href.search("/heoclient-application-web/heoPrompt.jsp")+1){
        if (document.getElementById('preHeaderMarkup')){
            let promptTitle = document.getElementById('preHeaderMarkup').innerText
            if ((promptTitle == "Saisissez une date et heure de début") || (promptTitle.search("(avec une date et heure de fin optionnelle)")+1) ||
                promptTitle == "Date/time of BMT:" || promptTitle == "Quand la prescription doit-être arrêtée ?" ||
                promptTitle == "Quand la prescription doit-elle être reprise ?" || promptTitle == "Date de Dernière Prise:"){
                document.head.append(hourCSS)
                document.head.append(hourScript)
                document.head.append(dateScript)
                setTimeout(dateHourPres, 500)
            }
        }
    }
})();

function addAutoPrescriptor(ev){
    let SSSFrame_win = ev.view.document.name == "SSSFrame" ? ev.view.document : document.getElementById('SSSFrame').contentWindow, $ = SSSFrame_win.$
    if($('#HEO_INPUT', SSSFrame_win.document).each((i,el)=>{if (!el.keydown){el.keydown = el.onkeydown}; el.onkeydown = (ev)=>{
        if(ev.keyCode==13){
            let pres = ev.target.value.split(" ")
            console.log(pres)
            if (typeof pres == "object"){
                if(pres.length == 3){
                    if (typeof pres[0] == "string" && typeof pres[1] =="string" && typeof pres[2] == "string"){
                        pres.poso = pres[2].split("-").map(t=>Number(t));
                        if((pres.poso.length >= 3 && pres.poso.length <= 5) && !isNaN(pres.poso[0]) && !isNaN(pres.poso[1]) && !isNaN(pres.poso[2])){
                            if (!isNaN(pres[1])){pres.poso=pres.poso.map(t=>t*Number(pres[1]));pres[1]="cp";}
                            ev.target.value=pres[0]+" "+pres[1]
                            SSSFrame_win.autoEnhancedPres = pres
                            SSSFrame_win.autoEnhancedPresWaiter = setInterval((presc)=>{
                                if (SSSFrame_win.output_Selector(presc[0] + " "+presc[1], true)){
                                    SSSFrame_win.output_Selector(presc[0] + " "+presc[1])
                                    clearInterval(SSSFrame_win.autoEnhancedPresWaiter)
                                }
                            },500, pres)
                            //setTimeout((ev)=>
                            ev.target.keydown(ev)
                            //, 250, ev)
                            return false
                        }
                    }
                } else if (pres.length == 4){
                    if (typeof pres[0] == "string" && typeof pres[3] == "string" && ((!isNaN(pres[2]) && typeof pres[1] == "string") ||(!isNaN(pres[1]) && typeof pres[2] == "string"))){
                        pres.poso = pres[3].split("-");
                        if((pres.poso.length >= 3 && pres.poso.length <= 5) && !isNaN(pres.poso[0]) && !isNaN(pres.poso[1]) && !isNaN(pres.poso[2])){
                            ev.target.value=""
                            return false;
                        }
                    }
                }
            }
            ev.target.keydown(ev)
        }
    }}).length == 0){setTimeout(addAutoPrescriptor, 500, ev)}
}

function dateHourPres(ev){
    if (typeof datePresPicker != "undefined"){
        window.removeEventListener('mousemove', dateHourPres)
        return
    }

    let styleEl = document.createElement('style')
    styleEl.innerHTML = `
.nj-picker .nj-item {padding:0.2em!important;}
.nj-picker-container {font-size: small!important;max-width: 300px!important;min-width: 150px!important;right: 100px; bottom:3px; overflow:hidden; position: fixed;}
.nj-picker .nj-hours-wrapper, .nj-picker .nj-minutes-wrapper {gap: 0.25em!important;}
.nj-picker .nj-minutes-wrapper {grid-template-columns: repeat(1,1fr)!important;}
.nj-picker .nj-minutes-container, .nj-picker .nj-hours-container {padding: .5em;display: table-cell;position: static;}
.nj-picker .nj-hours-container {width:400px;}
.nj-action-container {grid-template-columns: repeat(2,1fr)!important;}
.nj-overlay {display:none!important}
`
    document.head.append(styleEl)

    if (typeof Litepicker != 'undefined' && typeof NJTimePicker != "undefined"){
        let dateHourScriptInit = document.createElement('script')
        dateHourScriptInit.innerHTML = `
if (!$) {var $ = $ || window.parent.jQuery}
var today = new Date(), textHourEl = document.createElement('input'), textDateEl = document.createElement('input'), HEO_input = window.parent.document.getElementById('HEO_INPUT')
textDateEl.type = textHourEl.type = "text"
textDateEl.name = textHourEl.name = "dateHourPres"
textDateEl.style.display = textHourEl.style.display = "none"
document.body.append(textHourEl)
document.body.append(textDateEl)
var datePresPicker = new Litepicker({
 //element: window.parent.document.getElementById('HEO_INPUT'),
 element: textDateEl,
 format: "DD/MM/YYYY",
 lang:"fr-FR",
 autoApply: true,
 startDate:Date.now(),
 minDate: today.setDate(today.getDate()-2),
 selectForward: true,
 onHide: ()=>{HEO_input.value = textDateEl.value; hourPresPicker.show();},
 onShow: ()=>{$(datePresPicker.picker).css({top: "",left: "",right: 100,bottom: 0, overflow:"hidden"})}
});
var hourPresPicker = new NJTimePicker({
    targetEl: textHourEl,
    //disabledHours: [0, 1, 2, 3, 4, 5, 23],
    minutes: [0, 15, 30, 45],
    texts: {
        header: 'Heure de prescription',
        hours: 'Heure',
        minutes: 'Minutes'
        },
    format: '24'
  });
hourPresPicker.buttons.save = hourPresPicker.buttons.element.children[0]
hourPresPicker.buttons.clear = hourPresPicker.buttons.element.children[1]
hourPresPicker.buttons.close = hourPresPicker.buttons.element.children[2]
for (var i = 0 ; i < 24 ; i++){hourPresPicker.hours[i] = hourPresPicker.hours.element.lastChild.children[i]}
hourPresPicker.minutes[0]=hourPresPicker.minutes.element.lastChild.children[0]
hourPresPicker.minutes[15]=hourPresPicker.minutes.element.lastChild.children[1]
hourPresPicker.minutes[30]=hourPresPicker.minutes.element.lastChild.children[2]
hourPresPicker.minutes[45]=hourPresPicker.minutes.element.lastChild.children[3]
hourPresPicker.minutes[0].click()
hourPresPicker.hours[8].click()
hourPresPicker.hours.lastValue = hourPresPicker.hours.currentValue
hourPresPicker.hours.element.onclick = (ev)=> {
 if (ev.target.classList.contains('selected') || (hourPresPicker.hours.lastValue != hourPresPicker.hours.currentValue))
 {
  hourPresPicker.hours.lastValue = hourPresPicker.hours.currentValue
  HEO_input.value = textDateEl.value + " " + hourPresPicker.getValue('fullResult')
  //hourPresPicker.buttons.save.click()
 }
}
hourPresPicker.buttons.save.innerText = "Valider"
hourPresPicker.buttons.clear.innerText = "Retour"
hourPresPicker.buttons.clear.onclick = ()=>{
 hourPresPicker.hide();
 datePresPicker.show()}
hourPresPicker.buttons.close.style.display = "none"
hourPresPicker.on('save', data=>{
 HEO_input.value = textDateEl.value + " " + hourPresPicker.getValue('fullResult')
 const ke = new KeyboardEvent("keydown", {
    bubbles: true, cancelable: true, keyCode: 13
 });
 HEO_input.dispatchEvent(ke);
})
datePresPicker.show()
$(datePresPicker.picker).css({top: "",left: "",right: 100,bottom: 0, overflow:"hidden"})
`
        document.head.append(dateHourScriptInit)
    } else {
        setTimeout(dateHourPres, 250)
    }
}

function permPicker(ev){
    if (typeof datePicker != "undefined"){
        window.removeEventListener('mousemove', permPicker)
        return
    }
    if (typeof Litepicker != 'undefined'){
        let dateScriptInit = document.createElement('script')
        dateScriptInit.innerHTML = `
if (!$) {var $ = $ || window.parent.jQuery}
var today = new Date(Date.now()), today_min2 = new Date(Date.now()), today_plus2 = new Date(Date.now())
today_min2.setDate(today.getDate()-2)
today_plus2.setDate(today.getDate()+2)
var datePicker = new Litepicker({
 element: document.querySelector('input[name="Datebox"]'),
 elementEnd: document.querySelector('input[name="Datebox0"]'),
 format: "DD/MM/YYYY",
 lang:"fr-FR",
 numberOfMonths: 2,
 numberOfColumns: 2,
 singleMode: false,
 startDate:today,
 endDate:today,
 minDate: today_min2,
 scrollToDate:true,
 //autoApply: true,
 selectForward: true,
 onShow: ()=>{$(datePicker.picker).css({transform:"scale(1.1)", 'font-size':"1em", top:200})},
 onSelect: (d1, d2)=> {
  datePicker.hide()
  if ((d2.getDate()-d1.getDate()) == 0){
   let today = new Date()
   if ((today.getDate() - d1.getDate()) == 0){
    sortiePerm.setValue({hours:14})
   } else {
    sortiePerm.setValue({hours:9})
   }
   retourPerm.setValue({hours:18})
  } else if ((d2-d1) == 86400000){
   if ((today - d1) == 0){
    sortiePerm.setValue({hours:14})
   } else {
    sortiePerm.setValue({hours:9})
   }
  } else {
   if ((today.getDate() - d1.getDate()) == 0){
    sortiePerm.setValue({hours:18})
   } else {
    sortiePerm.setValue({hours:9})
   }
  }
  retourPerm.hide()
  sortiePerm.days =  (d2-d1) / 86400000
  sortiePerm.show()
 }
})

if (!window.parent.autoExtendPerm){
 let script = window.parent.document.getElementById('autoPermScript')
 if (script) {script.remove()}
 script = document.createElement('script')
 script.id = "autoPermScript"
 script.innerHTML = "autoExtendPerm = function(){"+
   "document.heoPane_output.frameElement.onload=function(ev){"+
    "ev.path[0].onload=function(ev){"+
     "ev.path[0].onload=function(ev){ev.path[0].onload='';output_Selector()};"+
     "output_Selector(1)};"+
    "output_Selector(2)};"+
   "output_Selector()};"+
  "quitPermPres = function(){document.heoPane_output.frameElement.onload=function(ev){"+
    "output_Selector();ev.path[0].onload=''}}"
 window.parent.document.body.append(script)
}

if (window.parent.datePermRestante){
 let dateRestante = window.parent.datePermRestante
 if (dateRestante.hours > 48){
  document.getElementById('Datebox').value = dateRestante.start.toLocaleDateString()
  document.getElementById('Heurebox').value = dateRestante.start.toLocaleTimeString([], {timeStyle: 'short'})
  dateRestante.start = new Date(dateRestante.start+172800000)
  dateRestante.hours = dateRestante.hours-48
  document.getElementById('Datebox0').value = dateRestante.start.toLocaleDateString()
  document.getElementById('Heurebox0').value =document.getElementById('Heurebox').value
  window.parent.datePermRestante = dateRestante
  document.getElementById('btPrescrire').click()
 } else {
  document.getElementById('Datebox').value = dateRestante.start.toLocaleDateString()
  document.getElementById('Heurebox').value = dateRestante.start.toLocaleTimeString([], {timeStyle: 'short'})
  document.getElementById('Datebox0').value = dateRestante.end.toLocaleDateString()
  document.getElementById('Heurebox0').value = dateRestante.end.toLocaleTimeString([], {timeStyle: 'short'})
  window.parent.datePermRestante = null
  document.getElementById('btPrescrire').click()
 }
} else {
var sortiePerm = new NJTimePicker({
    targetEl: document.querySelector('input[name="Heurebox"]'),
    disabledHours: [0, 1, 2, 3, 4, 5, 6, 22, 23],
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
    disabledHours: [0, 1, 2, 3, 4, 5, 6, 22, 23],
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
sortiePerm.setValue({hours:'9',minutes:'0'})
retourPerm.setValue({hours:'18',minutes:'0'})
//sortiePerm.minutes[0].click()
//retourPerm.minutes[0].click()
sortiePerm.hours.lastValue = sortiePerm.hours.currentValue
sortiePerm.hours.element.onclick = (ev)=> {
 if (ev.target.classList.contains('selected') || (sortiePerm.hours.lastValue != sortiePerm.hours.currentValue))
 {
  sortiePerm.hours.lastValue = sortiePerm.hours.currentValue
  sortiePerm.buttons.save.click()
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
sortiePerm.buttons.clear.onclick = ()=>{
 sortiePerm.hide();
 datePicker.show()}
sortiePerm.buttons.close.innerText = retourPerm.buttons.close.innerText = "Fermer"
retourPerm.buttons.save.innerText = "Valider"
retourPerm.buttons.clear.innerText = "Retour"
retourPerm.buttons.clear.onclick = ()=>{retourPerm.hide();sortiePerm.show()}
retourPerm.on('show', ()=>{
 if(sortiePerm.days >= 2){
  let i = 7
  while(i< 22){
   if ((sortiePerm.days > 2) || (sortiePerm.days == 2 && i > Number(sortiePerm.hours.currentValue))){
    retourPerm.hours[i].classList.add('outOf2DaysRange')
    retourPerm.hours[i].title = "Durée supérieure à 48h."
   } else {
    retourPerm.hours[i].classList.remove('outOf2DaysRange')
    retourPerm.hours[i].title = ""
   }
  i++
  }
 } else {
  for (let i = 7 ; i < 22 ; i++){
   retourPerm.hours[i].classList.remove('outOf2DaysRange')
   retourPerm.hours[i++].title = ""
  }
 }
})
sortiePerm.on('save', data=>{
 if(sortiePerm.days == 2){
  retourPerm.setValue({hours:sortiePerm.hours.currentValue})
 }
 retourPerm.show()
})
retourPerm.on('save', data=>{
 let datePerm = {start:datePicker.getStartDate().setHours(sortiePerm.hours.currentValue), end:new Date(datePicker.getEndDate().setHours(retourPerm.hours.currentValue)),
  hours:sortiePerm.days*24+(Number(retourPerm.hours.currentValue)-Number(sortiePerm.hours.currentValue))}
 datePicker.datePicked = datePerm
 if (datePerm.hours > 48){
  datePerm.start = new Date(datePerm.start+172800000)
  datePerm.hours = datePerm.hours-48
  document.getElementById('Datebox0').value = datePerm.start.toLocaleString().split(" ")[0]
  document.getElementById('Heurebox0').value =document.getElementById('Heurebox').value
  window.parent.datePermRestante = datePerm
  document.body.onunload = window.parent.autoExtendPerm
 } else {
  window.parent.quitPermPres()
 }
 document.getElementById('btPrescrire').click()
})
datePicker.show()
document.body.sortiePerm = sortiePerm
document.body.retourPerm = retourPerm
document.body.datePicker = datePicker
}
`
        document.body.append(dateScriptInit)
    }
}

function monitorClick(ev){
    if (!$ || !$.fn) {var $ = window.jQuery || unsafeWindow.jQuery || window.parent.jQuery};

    let Meva = GM_getValue('Meva',{"user":"", "password":""})
    window.monitorClickEnabled = true
    console.log(ev.target)
    if (ev.target.classList.contains('GOAX34LOXB-fr-mckesson-incubator-gwt-widgets-client-resources-FuzzyDateCss-field_without_error')){
        ev.target.parentElement.nextElementSibling.click()
        ev.target.lastValue = ev.target.value
        ev.target.dateWaiterStart = Date.now()
        ev.target.dateWaiter = setInterval((el)=>{
            if ((Date.now() - el.dateWaiterStart) > 15000){
                clearInterval(el.dateWaiter)
            }else if (el.lastValue != el.value){
                clearInterval(el.dateWaiter)
                ev.view.document.querySelector('button.GOAX34LH3-fr-mckesson-framework-gwt-widgets-client-resources-ButtonFamilyCss-fw-Button').click()
            }
        },250,ev.target)
    } else if (ev.target.title == "HEO - Prescrire"){
        addAutoPrescriptor(ev)
    } else if (ev.target.innerText == "AHARRY"){
        ev.view.document.querySelector("input[name='mevaLockSessionWindowPwField']").value=Meva.password
        ev.view.document.querySelector("span.GDKHHE1MCB-fr-mckesson-framework-gwt-widgets-client-resources-IconsCss-icon_accept").click()
    } else if (ev.target.classList.contains('stackItemMiddleCenterInner') && !ev.target.classList.contains('CleanGroupsButton') && ev.target.innerText == "Groupé par"){
        ev.target.classList.add('CleanGroupsButton')
        $('label:contains("Plannings"):eq(0)', ev.view.document).parent().after($('<div><button id="CleanGroupsByButton" style="margin-left:50px;background:#528fff;">Effacer</button></div>'))
    } else if (ev.target.id == "CleanGroupsByButton"){
        let repaired_NZb = `
NZb = function (a, b, c) {
    var d,e;
    e=JSON.parse(a.e.j.c[12]);e.groupsBy=[];a.e.j.c[12]=JSON.stringify(e);
    setTimeout(()=>window.parent.location.reload(), 500)
    d = xZb(a.e);
    S$b() && T$b(U$b(a.d, a.b, 'requestSerialized'));
    return IZb(a.f, c, a.b, a.d, d, b)
}
`
        $('iframe', $('#SSSFrame').contents()).filter('#fr\\.mckesson\\.clinique\\.application\\.web\\.portlet\\.gwt\\.ClinicalGWTPortal').each(
            (i,el)=>{
                let script = el.contentDocument.createElement('script')
                script.innerHTML = repaired_NZb
                el.contentDocument.body.append(script)
            }
        )
        $('<div style="position:absolute;width:100%;height:100%;top:0;left:0;background:#000;opacity:0.5;">')
            .appendTo($('.GOAX34LHSB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridMenuPopup', ev.view.document))
    }
}

function clickLogin(ev){
    let Meva = GM_getValue('Meva',{"user":"", "password":""})
    window.monitorMouseMove = true
    if (document.querySelector("input[name='password']")){
        document.querySelector("input[name='password']").addEventListener('focus', ev=>{
            document.querySelector("input[name='password']").value=Meva.password
        })
    }
            window.addEventListener('click', ev=>{
            if (ev.target.innerText && ev.target.innerText == "AHARRY"){
                let Meva = GM_getValue("Meva",{})
                if (document.querySelector("input[type='password']")) document.querySelector("input[type='password']").value=Meva.password}
        })
    if (document.querySelector("div.GKJG3BODITB")){
        document.querySelector("div.GKJG3BODITB").addEventListener('click', ev=>{
            if (document.querySelector("input[name='j_username']")) document.querySelector("input[name='j_username']").value=Meva.user
            if (document.querySelector("input[type='password']")) document.querySelector("input[type='password']").value=Meva.password
            if (document.querySelector("button.GKJG3BODOY")) document.querySelector("button.GKJG3BODOY").click()
            if (document.querySelector("button[tabindex='4']")) document.querySelector("button[tabindex='4']").click()
        })
        window.removeEventListener('mousemove', clickLogin)
    }
}
