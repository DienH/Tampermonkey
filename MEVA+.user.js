// ==UserScript==
// @name         MEVA+
// @namespace    http://tampermonkey.net/
// @version      0.2.8
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
                    $CS_Anest.remove()
                    clearInterval(SSSFrame_wait)
                }
            }, 500)
        })
        window.frameWait = setInterval(()=>{
            let $frames = $('iframe', $('#SSSFrame')[0].contentDocument)
            if ($frames.is("#fr\\.mckesson\\.clinique\\.application\\.web\\.portlet\\.gwt\\.ClinicalGWTPortal")){
                $frames.filter('#fr\\.mckesson\\.clinique\\.application\\.web\\.portlet\\.gwt\\.ClinicalGWTPortal').each(
                    (i, el)=>{
                        console.log(el.contentWindow.NZb)
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
        // window.dispatchEvent(new Event('resize'));
        //if (!GM_getValue("Meva",{}).length){let Meva = {};Meva.user = prompt("Utilisateur ?","");Meva.password = prompt("Mot de passe ?","");GM_setValue("Meva",Meva)}
        if (!window.monitorMouseMove) window.addEventListener('mousemove', clickLogin)
        //setInterval(()=>{if (document.querySelector("#div-quitteSession")){document.querySelector("#div-quitteSession div").click()}}, 500)

        //$('.GOAX34LJRB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBodyGroupLine').remove()

    } else if ((location.href.search('heoOutput.jsp')+1)){

    } else if ((location.href.search("popupContents.jsp")+1) && (title = document.head.querySelector('title'))){
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
        //window.addEventListener('mousemove', permPicker)
    } else if (location.href.search("/heoclient-application-web/heoPrompt.jsp")+1){
        if (document.getElementById('preHeaderMarkup')){
            let promptTitle = document.getElementById('preHeaderMarkup').innerText
            if ((promptTitle == "Saisissez une date et heure de début") || (promptTitle.search("(avec une date et heure de fin optionnelle)")+1) ||
                promptTitle == "Date/time of BMT:" || promptTitle == "Quand la prescription doit-être arrêtée ?" ||
                promptTitle == "Quand la prescription doit-elle être reprise ?"){
                document.head.append(hourCSS)
                document.head.append(hourScript)
                document.head.append(dateScript)
                setTimeout(dateHourPres, 500)
                //window.addEventListener('mousemove', dateHourPres)
            }
        }
    }
})();

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

    if (typeof Litepicker != 'undefined'){
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
 maxDays: 2,
 selectForward: true,
 onShow: ()=>{$(datePicker.picker).css({transform:"scale(1.1)", 'font-size':"1em", top:200})},
 onSelect: (d1, d2)=> {
  datePicker.hide()
  if ((d2.getDate()-d1.getDate()) == 0){
   let today = new Date()
   if ((today.getDate() - d1.getDate()) == 0){
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
   if ((today.getDate() - d1.getDate()) == 0){
    sortiePerm.hours[18].click()
   } else {
    sortiePerm.hours[9].click()
   }
  }
  retourPerm.hide()
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
 if(sortiePerm.days == 2){
  let i =7
  while(i< 21){(i > Number(sortiePerm.hours.currentValue)) ? retourPerm.hours[i++].setAttribute('disabled', true) : retourPerm.hours[i++].removeAttribute('disabled')}
 } else {
  for (let i = 7 ; i < 21 ; i++){retourPerm.hours[i].removeAttribute('disabled')}
 }
})

sortiePerm.on('save', data=>{
 if(sortiePerm.days == 2){retourPerm.hours[Number(sortiePerm.hours.currentValue)].removeAttribute('disabled')
 retourPerm.hours[Number(sortiePerm.hours.currentValue)].click()}
 retourPerm.show()})

datePicker.show()
document.body.sortiePerm = sortiePerm
document.body.retourPerm = retourPerm
document.body.datePicker = datePicker
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
    } else if (ev.target.innerText == "AHARRY"){
        ev.view.document.querySelector("input[name='mevaLockSessionWindowPwField']").value=Meva.password
        ev.view.document.querySelector("span.GDKHHE1MCB-fr-mckesson-framework-gwt-widgets-client-resources-IconsCss-icon_accept").click()
    } else if (ev.target.classList.contains('stackItemMiddleCenterInner') && ev.target.innerText == "Groupé par"){
        $('label:contains("Plannings"):eq(0)', ev.view.document).parent().after($('<div><button id="CleanGroupsByButton" style="margin-left:50px;background:#528fff;">Effacer</button></div>'))
    } else if (ev.target.id == "CleanGroupsByButton"){
        let repaired_NZb = `
NZb = function (a, b, c) {
    var d,e;
    e=JSON.parse(a.e.j.c[12]);e.groupsBy=[];a.e.j.c[12]=JSON.stringify(e);
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
        $('<div style="position:fixed;width:100%;height:100%;top:0;left:0;background:#000;opacity:0.5;">').appendTo('body').click((ev)=>{$('#SSSFrame').attr('src', (i,src)=>src);$(ev.target).remove()})
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

/*
$.post("http://meva/heoclient-application-web/commander?HEOCMD=@submit", "Datebox=03%2F01%2F2020&Heurebox=18%3A00&DADEINVERSE=Vendredi&Datebox0=05%2F01%2F2020&Heurebox0=18%3A00&DATEINVERSE=Dimanche&Dur=48&Accompagne=&btPrescrire=Valider",(data)=>{
    $('#SSSFrame').each((i,el)=>{
        el.contentWindow.processStatus()
        el.contentWindow.waitHeoPrompt();
        el.contentWindow.reloadPrompt();})
    if (processStatus){
        processStatus()
        waitHeoPrompt();
        reloadPrompt();
    }
})
*/
