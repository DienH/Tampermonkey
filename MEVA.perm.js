// ==UserScript==
// @name         MEVA.Perm
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Help with MEVA
// @author       Me
// @match        http*://meva/*
// @exclude      http*://meva/heoclient-application-web/shortStop.jsp
// @exclude      http*://meva/heoclient-application-web/clientRequest.jsp*
// @updateURL    https://github.com/DienH/Tampermonkey/raw/master/MEVA%2B.user.update
// @downloadURL  https://github.com/DienH/Tampermonkey/raw/master/MEVA%2B.user.js
// @require      https://code.jquery.com/jquery.min.js
// @resource     DienJS https://raw.githubusercontent.com/DienH/Tampermonkey/master/Dien.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        window.close
// ==/UserScript==



(function() {
    let SSSFrame = window.top.SSSFrame
    if (window.frameElement){
        switch(window.frameElement.id){
            case "mevaModulesEntry":
            case "mevaContainerEntry":
            case "hiddenContextFrame":
            case "HCP":
            case "fr.mckesson.entrepot.portal.EntrepotPortal":
            case "fr.mckesson.soins.application.web.portal.SoinsModulePortal":
            case "fr.mckesson.framework.gwt.desktop.server.DesktopServer":
                return false
                break
        }
        switch(window.frameElement.name){
            case "heoPane_Hidden":
                return false
                break
        }
        if (window.frameElement.name.search("FormPanel_HCP")+1) return false
    }
    var µ = unsafeWindow
    var log = console.log
    if (!$ || !$.fn) {var $ = µ.jQuery || µ.parent.jQuery || window.parent.jQuery || window.jQuery };
    if ($.fn.jquery == "1.7" && µ.parent.jQuery){$ = µ.parent.jQuery}
    if (!µ.$){µ.$ = $}
    if (!µ.jQuery){µ.jQuery = $}
    //log(location.href, µ.jQuery, µ.parent.jQuery, window.parent.jQuery, window.jQuery, $)
    if(!$('#DienScriptPlus', document).length){
        $('body', document)
           // .append($('<script id="DienScriptPlus" src="https://cdn.jsdelivr.net/gh/DienH/Tampermonkey@master/Dien.js">', document))
            .append($('<script id="DienScriptPlus">').html(GM_getResourceText('DienJS')))
            .append(
            $('<script>').html(`if (!$ || !$.fn) {window.$ = window.parent.$ || window.parent.jQuery || window.document.SSSFrame.jQuery || window.document.SSSFrame.$}
//if (!jQuery || !jQuery.fn){jQuery = window.$}
String.prototype.searchI = function(searchString) {
if (typeof "searchString" == "string"){
return this.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(searchString.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
} else {return undefined}
}`)).append($('<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">'))
        .append($('<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>'))
    }
    $.expr[":"].containsI = function (a, i, m) {return (a.textContent || a.innerText || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(m[3].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))>=0;};
    let dateScript = document.createElement('script'), hourScript = document.createElement('script'), hourCSS = document.createElement('link'), title = ""
    dateScript.src = "https://cdn.jsdelivr.net/npm/litepicker/dist/js/main.js"
    hourScript.src = "https://cdn.jsdelivr.net/npm/nj-timepicker/dist/njtimepicker.min.js"
    hourCSS.type = "text/css"
    hourCSS.rel = "stylesheet"
    hourCSS.href = "https://cdn.jsdelivr.net/npm/nj-timepicker/dist/njtimepicker.min.css"

    if (location.pathname == "/m-eva/"){
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
        // Recharger automatiquement MEVA lorsque la session n'est pas complètement quittée
        // Recharger automatiquement MEVA lorsque la session n'est pas complètement quittée
        // Recharger automatiquement MEVA lorsque la session n'est pas complètement quittée
    } else if (location.href.search("errorLoadContext.jsp")+1){
        $('a[target*=_top]:contains(Recharger)', document).click2()
    }else if (location.href.search("quitteSession")+1){
        $.waitFor('div.gwt-Label:contains(Cliquez ici)', document).then(el=>el.click2())
    } else if ((location.href.search("popupContents.jsp")+1)){
        let styleEl = document.createElement('style'), title, pres, bioDate = (new Date()), textarea_infos, $datepickerFRScript,
            $HEO_POPUP = $('#HEO_POPUP', SSSFrame.document)
        styleEl.innerHTML = `
.outOf2DaysRange {background:coral;}
.nj-picker .outOf2DaysRange.nj-item:hover {background:antiquewhite;}
body {background-color:#F5F5F5;}
a.lien-labo{text-decoration: underline;color: blue;margin-right: 10px;}
.titreIform {background-color:green!important;}
form[name=CFD_Essai_TOP30] {padding-top:80px}
form[name=CFD_Essai_TOP30] .BandeauTitreEtPatient {position:fixed;top:0;background:#F5F5F5}
form[name=CFD_Essai_TOP30] .BandeauBoutons input {position:fixed;right:0}
form[name=CFD_Essai_TOP30] .BandeauBoutons #btPrescrire {top:0;background:#008000;color:white}
form[name=CFD_Essai_TOP30] .BandeauBoutons #btAnnuler {top:36px;background:#ffa500}
`
        document.head.append(styleEl)
        $('head', document).append($('<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">'))

        if (title = document.head.querySelector('title')){
            switch(title.innerText){
                case "SORTIETEMPO":
                    $.waitFor('#Datebox', document).then($el=>{
                        document.head.append(hourCSS)
                        document.head.append(hourScript)
                        document.head.append(dateScript)
                        setTimeout(permPicker, 250)
                    })
                    break;
            }
        }
    }
})()


function permPicker(ev){
    if (typeof datePicker != "undefined"){
        window.removeEventListener('mousemove', permPicker)
        return
    }
    if (typeof Litepicker != 'undefined' || typeof NJTimePicker != 'undefined'){
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
  dateRestante.start = new Date(dateRestante.start.getTime()+172800000)
  dateRestante.hours = dateRestante.hours-48
  document.getElementById('Datebox0').value = dateRestante.start.toLocaleDateString()
  document.getElementById('Heurebox0').value = document.getElementById('Heurebox').value
  window.parent.datePermRestante = dateRestante
  document.body.onunload = window.parent.autoExtendPerm
 } else {
  document.getElementById('Datebox').value = dateRestante.start.toLocaleDateString()
  document.getElementById('Heurebox').value = dateRestante.start.toLocaleTimeString([], {timeStyle: 'short'})
  document.getElementById('Datebox0').value = dateRestante.end.toLocaleDateString()
  document.getElementById('Heurebox0').value = dateRestante.end.toLocaleTimeString([], {timeStyle: 'short'})
  window.parent.datePermRestante = null
 }
 document.getElementById('btPrescrire').click()
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
  retourPerm.setValue({minutes:sortiePerm.minutes.currentValue})
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
 let datePerm = {start:(new Date(datePicker.getStartDate().setHours(sortiePerm.hours.currentValue))).setMinutes(sortiePerm.minutes.currentValue), end:new Date((new Date(datePicker.getEndDate().setHours(retourPerm.hours.currentValue))).setMinutes(retourPerm.minutes.currentValue)),
  hours:sortiePerm.days*24+(Number(retourPerm.hours.currentValue)-Number(sortiePerm.hours.currentValue))}
 datePicker.datePicked = datePerm
 if (datePerm.hours > 48){
  datePerm.start = new Date(datePerm.start+172800000)
  datePerm.hours = datePerm.hours-48
  document.getElementById('Datebox0').value = datePerm.start.toLocaleString().split(" ")[0]
  document.getElementById('Heurebox0').value = document.getElementById('Heurebox').value
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
    } else {
        setTimeout(permPicker, 250)
    }
}
