// ==UserScript==
// @name         MEVA+
// @namespace    http://tampermonkey.net/
// @version      0.2.61
// @description  Help with MEVA
// @author       Me
// @match        http*://meva/*
// @include      http*://serv-cyberlab.chu-clermontferrand.fr/cyberlab/*
// @downloadURL  https://github.com/DienH/Tampermonkey/raw/master/MEVA%2B.user.js
// @require      https://code.jquery.com/jquery.min.js
// require      https://cdn.jsdelivr.net/gh/DienH/Tampermonkey@master/Dien.js
// @resource     DienJS https://raw.githubusercontent.com/DienH/Tampermonkey/master/Dien.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// ==/UserScript==


/*
// copier du texte avec formatage
function copyToClip(str) {
  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
};
*/




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
    if (location.href.search("serv-cyberlab.chu-clermontferrand.fr")+1){
        let $
        if (!$ || !$.fn) {$ = µ.jQuery || window.jQuery };
        $('tr[onclick]:first').click()
        return true
    }
    if (!$ || !$.fn) {var $ = µ.jQuery || µ.parent.jQuery || window.parent.jQuery || window.jQuery };
    if ($.fn.jquery == "1.7" && µ.parent.jQuery){$ = µ.parent.jQuery}
    if (!µ.$){µ.$ = $}
    //log(location.href, µ.jQuery, µ.parent.jQuery, window.parent.jQuery, window.jQuery, $)
    if(!$('#DienScriptPlus', document).length){
        $('body', document)
           // .append($('<script id="DienScriptPlus" src="https://cdn.jsdelivr.net/gh/DienH/Tampermonkey@master/Dien.js">', document))
            .append($('<script id="DienScriptPlus">').html(GM_getResourceText('DienJS')))
            .append(
            $('<script>').html(`if (!$ || !$.fn) {window.$ = window.parent.$ || window.parent.jQuery || window.document.SSSFrame.jQuery}
//if (!jQuery || !jQuery.fn){jQuery = window.$}
String.prototype.searchI = function(searchString) {
if (typeof "searchString" == "string"){
return this.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(searchString.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
} else {return undefined}
}`)).append($('<link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">'))
        .append($('<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>'))
    }
    $.expr[":"].containsI = function (a, i, m) {return (a.textContent || a.innerText || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(m[3].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))>=0;};
    if (!GM_getValue('Meva', false)){GM_setValue('Meva', {user:"",password:""})}
    let dateScript = document.createElement('script'), hourScript = document.createElement('script'), hourCSS = document.createElement('link'), title = ""
    dateScript.src = "https://cdn.jsdelivr.net/npm/litepicker/dist/js/main.js"
    hourScript.src = "https://cdn.jsdelivr.net/npm/nj-timepicker/dist/njtimepicker.min.js"
    hourCSS.type = "text/css"
    hourCSS.rel = "stylesheet"
    hourCSS.href = "https://cdn.jsdelivr.net/npm/nj-timepicker/dist/njtimepicker.min.css"



    if (location.pathname == "/m-eva/"){
        /*
        document.querySelector('#SSSFrame').contentWindow.addEventListener('resize', (ev)=>{
            let SSSFrame = ev.target.name == "SSSFrame" ? ev.target : document.getElementById('SSSFrame').contentWindow
            let listepatientsHeight = $('#m_eva_Hospitalisation_fonc_complement_clinique_recherche_hospit_content', document).height()
            $('.GOAX34LMSB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-Grid-sizer').height(listepatientsHeight-140)
            $('.GOAX34LERB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBody').height(listepatientsHeight-163)
        })
        */
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
                SSSFrame.monitorClick = monitorClick
                SSSFrame.monitorContextClick = monitorContextClick
                SSSFrame.monitorPresMouseOver = monitorPresMouseOver
                SSSFrame.onload = ()=>{
                    SSSFrame.contentWindow.removeEventListener('click', monitorClick)
                    SSSFrame.contentWindow.removeEventListener('mousedown', monitorContextClick)
                    SSSFrame.contentWindow.removeEventListener('contextmenu', monitorContextClick)
                    SSSFrame.contentWindow.addEventListener('click', monitorClick)
                    SSSFrame.contentWindow.addEventListener('mousedown', monitorContextClick)
                    SSSFrame.contentWindow.addEventListener('contextmenu', monitorContextClick)
                }
            }
        },500)
        // Recharger automatiquement MEVA lorsque la session n'est pas complètement quittée
        // Recharger automatiquement MEVA lorsque la session n'est pas complètement quittée
        // Recharger automatiquement MEVA lorsque la session n'est pas complètement quittée
    } else if (location.href.search("errorLoadContext.jsp")+1){
        $('a[target*=_top]:contains(Recharger)', document).click2()
    }else if (location.href.search("quitteSession")+1){
        $.waitFor('div.gwt-Label:contains(Cliquez ici)', document).then(el=>el.click2())




        // SSSFrame = fen$etre principale de MEVA
        // SSSFrame = fen$etre principale de MEVA
        // SSSFrame = fen$etre principale de MEVA
        // SSSFrame = fen$etre principale de MEVA
    }else if (location.href.search("Hospitalisation.fwks")+1 || location.href.search("m-eva.fwks")+1){
        let SSSFrame = unsafeWindow, CS_AnestTitle = (`div.carousel_enabled_item:contains("Consultation d'anesthésie")`),
            SSSFrame_wait = setInterval(()=>{
                $(CS_AnestTitle).remove()
                SSSFrame.dispatchEvent(new Event('resize'))
                $('div.carousel_enabled_item:contains("HEO - Prescrire"), div.carousel_enabled_item:contains("Observations"), div.carousel_enabled_item:contains("Résultats de laboratoire"),'+
                  'div.carousel_disabled_item:contains("HEO - Prescrire"), div.carousel_disabled_item:contains("Observations"), div.carousel_disabled_item:contains("Résultats de laboratoire")')
                    .prependTo($('div.carousel_disabled_item:contains("HEO - Prescrire"), div.carousel_enabled_item:contains("HEO - Prescrire")').parent())

                // Ajout d'un icone pour sélectionner le jour actuel pour la liste des patients
            let $dateInput = $('input.GOAX34LOXB-fr-mckesson-incubator-gwt-widgets-client-resources-FuzzyDateCss-field_without_error', SSSFrame.document).parent()
            if (!$dateInput.siblings('[title*=Aujourd]').length){
                $dateInput.before(
                    $(`<img title="Aujourd'hui" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsSAAALEgHS3X78AAAH+klEQVR42q1WeUyV2RU/3WKbph2t`+
                      `/3TqZCa109Tp1GmDog4dMHVQB5eIuBL3nVrRDooBcQsoaK0CimIELIvKVh4+HohjZR9UXOrXGFFwFwyKIPDYH8uv59z3PnwPGZwm/ZJfzv3ud+89v/u755z7EQCyR2u9hbKyjbRu3Toa+auRFBUeTWfP5FD`+
                      `/cYOiAxQbF0O+G33p/Q/epz+vW08+K/8y4Fjq7e2lnp5euv+4krKvJVN6QTx5ec6lPcF74lPOpOJPMz/7cn/CDsq5mkamsmS2qZQtKEvl9xQrriQrGC+foSxGasE/aOqUL+jLTX5UXFSC3`+
                      `/zuQ3j7eFJJWSGl5cdTdVW1ct7d3W0l0N7SSQlnT9Ds6NE0Mew9cp7xEeXmm/Iryx9gzKp3Az6Pepdc9g4nl7CfkUvoMPp07zCasHcoTdgzlMbveYfGh7xD40J+SuOCf6Ls2N1D6ZMvRtKR2HCqq2nAxx4jMCn4A`+
                      `/IO9CC3rb8kQ4ZBEejs7CTVMDebqSi/mJKMcXBN/BF+ve/74Mn4T2EFPlwyBJ+dGgKXmB/ij3FWuDiAv8W+xqcxQ+AW/2OMivweNuxagfLShxjlNRxOid/F5xHvITAoEJmmDOXXYrHYCJibqDCviGKzIuF0ivDJCcL44OHwCB+F3+4njEsjjD1NcD7zLZFMGJNE+H3oD+B26OcYfYDf0wnuJ0Zg87a`+
                      `/MgGrApZOG4HmFjMTKKYTxgg4pbLzTHZoJPyB7YQsXvCfTOJ/gBrPmxzPc8ecZctrObFP95Mj4B/kB2POWesR6Ao0NTfRv87nUbThoJrgbOIFeNI403fgnCXW1vct4Gxn1dwsXkMInGMCp36BgJ3+yP7KZFWgyxYDjU2NdM50nqIy`+
                      `/oax53nSBcZXNvv/AK/llEeYnDYCQcEByL2Y4xgDDY0NlGUwUXj6XnycTxhdyCiw2behYBDYjfmohOBqGIb9+/cjvzBP+e3q6rIRaGig5ORkSjacQkGNEUUvsqyozUJxrQklL7Md8HVdjkJp/TkrXuXikh2kT76XCHi8rFXacA6Z`+
                      `/07Cob8fwtclJTYCltcEEhLjKdOQid427ulkdNisxYYuRrcdemzoxTc/vbYxFuvrk3tVCI8Ix6VLlxyPoL6+nuLi4ig1LRWN5gaYW5rQxBDb3GpGS3sLWtqaFVo7WtFmh`+
                      `/bONnRY2tHZ1WFFdycsCpa+vraONnT1WFBReRdRUVEoKytzPIK6ujo6fvy4HAO4OoGZKculEh0dHWhtbUVPTw+4aqKtrU318WTrJrlPnyN9Mkf6ZLw88i7f5Hn06BGio6Nx48YNRwIvX76kI0eOUFJSEu7du4cHDx7gyZMnuHv3LlgdNVn67t+`+
                      `/r9pCoLGxUS34/PnzPiJCQCCExbGMkUcndvv2bZw8eRI3b958fRdIo7a2lsLDw+UYICR27dqFDRs2KLnE8enTp3Hw4EEcPnxY7UAeaYeEhODYsWMqsllFRaK4uBiLFy9WY2JjY3H58mXVPnDggGrL+tevX3dU4MWLF8SLUExMjBp85coV7Nu3T7`+
                      `WvXbuGzZs398VVQEAANE0DE1ZWdxQREaHaYnfu3KmIvHr1SrUjIyORmZmp3vmocfXqVUcCLCPxbiQOlFR5eXlqorQTExNx9OhR1RYpxVlaWppatKioSPWVl5cjKCgIVVVV2LFjh1LN399fETKZTJg/f37fMYpib2RBTU0NsUMSRyLjhQsXsHXrVj`+
                      `UpPz8fq1ev7lPAx8cHpaWlSn6Wsm/XciRCdtasWepI3N3dwcri1q1bipysK/HFsYaSvjpgU+DZs2cUGBhIsohErxAQqWVSe3s7du/erXa0bds2RUzGyDv/Nakdr1+/HryGshK8Mk/IiFoSyHKE0ldZWamOrrCw0JFAdXU1bdmyhWQnZrNZMX`+
                      `/69KlqNzU1qTTic1OxISknUS4ORYE7d+4oQkJU+uS7PkYyRKysJ49kkQQjH7HjEfDZ0aZNm0giXVJHIM65Qqq2WD3P9W/iUBxLX3Nzs3IkY8TqtULiRq8R8sgRhIWFicKOCvBuieWTTFAOJPcFOgGdhEAUEQK6OuK8paWlDzoBHUJUrH4EwcHBy`+
                      `M3NdVSAz43WrFlDoaGhyok4l5TRneokBPYExPlABOxJ6ATkqaioUNmVnZ3t+E/4+PFjWr58uaSiciJFRScxEBF7EgMR6U9C2qKABKQEstFodFTg4cOHtGjRIpJoF0dCoD+J/kSExGBE7EnoBCRgJYsMBsObBLhY0Pbt25UjvhsGJWGvRH8iA6kh`+
                      `VgJWCpafnx/S09Mdj4DTg2bPni21QDngu+ENEm87ksFISFu/jDZu3IiUlBRHBTg9aMaMGSTyiCPJX8ldIaKT0TEQobeR0muJVEUpVny5OSrA6UFTp05VBCRq9V18U1RLjuvQC49eJ3TIjkV2gbT1OrBq1SokJCQ4EuD0UASEHddpXLx4UV1IOuQ`+
                      `+0FFQUDAguLwqyAVlD7kVxcpVnJGRgaVLl0L+vsQvb8BKgIODPD09acqUKXB1dX0Dbm5umDhxIiZNmqQumcmTJ4MJY9q0aZg+fTpmzpypLiGOI8yZMwfz5s3DggUL4O3tDc4uLFmyRDnmWoMVK1bIHeGoAOcnsRNiB3m8uMZENLECdqR5eHho7Eh`+
                      `jRxoT1by8vLS5c+dqnDnawoULNXaisRNt2bJl2sqVKzW+PbW1a9dqfHNqrKrm6+urcanXOAPUd10BIfBfNO+db7uKud8AAAAASUVORK5CYII="`+
                      `style="width: 18px;transform: translateY(3px);cursor:pointer;" class="gwt-Image">`)).up().up().css('width',190)
                SSSFrame.dispatchEvent(new Event('resize'))
            }

                // Menu contextuel par patient
            if (!$('#contextMenu_patients', SSSFrame.document).length){
                $('body', SSSFrame.document).append($(`
<ul id="contextMenu_patients">
  <li><div><img src="/heoclient-application-web/icon/heo_blue_32.png" class="gwt-Image">Prescriptions</div></li>
  <li><div><img src="/m-eva-resourcestatic/icons/produits/xway/acte_32.png" class="gwt-Image">Observations</div></li>
  <li><div><img src="/m-eva-resourcestatic/icons/produits/web/pancarte_medicale_32.png" class="gwt-Image">Synthèse</div></li>
  <li><div><img src="/m-eva-resourcestatic/icons/produits/xway/labo_32.png" class="gwt-Image">Résultats de labo</div></li>
  <li><div><img src="/m-eva-resourcestatic/icons/produits/application.png" class="gwt-Image">PACS</div></li>
  <li><div><img src="" class="gwt-Image small-gwt-Image icon-ordonnance">Ordonnance</div></li>
  <li><div><img src="" class="gwt-Image small-gwt-Image icon-documents">Documents</div></li>
</ul>
`).menu().hide())
            }
                // Menu flottant pour les prescriptions
            if(!$('#hoverMenu_pres', SSSFrame.document).length){
                $('#workbody', SSSFrame.document).append($(`
<div id="hoverMenu_pres">
  <span title="Modifier" action="MODIFY"><img src="/heoclient-application-web/images/pencil.png" class="gwt-Image"></span>
  <span title="Arrêt immédiat" action="DCAO-0"><img src="/heoclient-application-web/images/stop.png" class="gwt-Image"></span>
  <span title="Arrêt programmé" action="DCAO"><img src="/heoclient-application-web/images/time_delete.png" class="gwt-Image"></span>
  <span title="Suspendre" action="HOLD"><img src="/heoclient-application-web/images/control_pause_blue.png" class="gwt-Image"></span>
  <span title="Reprendre" action="RESUME"><img src="/heoclient-application-web/images/control_play_blue.png" class="gwt-Image"></span>
  <span title="Annuler arrêt & modifications" action="RESET_ORDER"><img src="/heoclient-application-web/button/arrow_undo.png" class="gwt-Image"></span>
</div>
`).hide()).addClass("mouseOver_monitored").on('mouseover mouseout', '.GD42JS-DOYB>.GD42JS-DK-B tr', monitorPresMouseOver)

                let IPP = $('div.GOAX34LLOB-fr-mckesson-framework-gwt-widgets-client-resources-SharedCss-fw-Label:contains("IPP : ")', SSSFrame.document).text().split(" : ")[1]
                if ((typeof SSSFrame.listingPrescriptions == "undefined" || (SSSFrame.listingPrescriptions.IPP != IPP) ) && $('#workbody').length){
                    delete SSSFrame.listingPrescriptions
                    delete SSSFrame.listingConsignes
                    delete SSSFrame.nouvellesConsignes
                    delete SSSFrame.autoEnhancedPres
                    delete SSSFrame.listePresLabo
                    $('#CONSIGNES-POPUP', SSSFrame.document).dialog('destroy').remove()
                    $('table[name=HEOFRAME] button:contains(Arrêt)', SSSFrame.document).click2()
                    //$('div.GD42JS-DLOB', SSSFrame.document).hide() // cacher la fenêtre popup MEVA à l'initialisation de la page
                    //$('body', SSSFrame.document).append('<div class="full_bg"><span>Préparation de la liste de prescription</span></div>')
                    //  .append('<style>.full_bg{position:fixed;top:0;left:0;width:100%;height:100%;background:black;opacity:0.2;</style>}')
                }
            }
                $(`div.carousel_enabled_item:contains("Résultats"):not(.modified)`).addClass('modified').each((i,el)=>{el.onclick=ev=>{
                    let patientIPP = $('div.GOAX34LLOB-fr-mckesson-framework-gwt-widgets-client-resources-SharedCss-fw-Label:contains(IPP)').text().split(' : ')[1],
                        patientBD = $('.GOAX34LBN-fr-mckesson-clinique-application-web-portlet-gwt-context-client-resources-ListPatientRendererCss-listpatient').text().split(" (")[2].split(')')[0].split('/').reverse().join(''),
                        labo_url = 'https://serv-cyberlab.chu-clermontferrand.fr/cyberlab/servlet/be.mips.cyberlab.web.APIEntry'+
                        '?Class=Order&Method=SearchOrders&LoginName=aharry&Organization=CLERMONT&patientcode='+patientIPP+'&patientBirthDate='+patientBD+'&LastXdays=3650&OnClose=Login.jsp&showQueryFields=F'
                    open(labo_url)
                }})
                $(SSSFrame).resize((ev)=>{
                    let SSSFrame = ev.target.name == "SSSFrame" ? ev.target : document.getElementById('SSSFrame').contentWindow
                    if (!ev.isTrusted){
                        if (!SSSFrame.resizeMotired) {
                            if ((SSSFrame.oldWidth && $(SSSFrame).width() != SSSFrame.oldWidth) || (SSSFrame.oldHeight && $(SSSFrame).height() != SSSFrame.oldHeight)){
                                let listepatientsHeight = $(SSSFrame).height()-122
                                $('#m_eva_Hospitalisation_fonc_complement_clinique_recherche_hospit_content', document).height(listepatientsHeight)
                                $('.GOAX34LMSB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-Grid-sizer').height(listepatientsHeight-138)
                                $('.GOAX34LERB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBody').height(listepatientsHeight-163)
                                let unitSelectorWidth = $(window).width()-630
                                $('.gwt-TabPanelBottom .GOAX34LLDB-fr-mckesson-framework-gwt-widgets-client-resources-FormFamilyCss-fw-hasValue-defaultWidth:visible:eq(0)').width(unitSelectorWidth > 205 ? unitSelectorWidth : 205)
                                SSSFrame.oldHeight = $(SSSFrame).height()
                                SSSFrame.oldWidth = $(SSSFrame).width()
                            }
                            SSSFrame.resizeMotired = true
                        }
                    } else {
                        SSSFrame.resizeMotired = false
                    }
                })
                document.head.append(hourCSS)
                document.head.append(hourScript)
                document.head.append(dateScript)
                setTimeout(dateHourPres, 500)
            /*
        $.waitFor('#workbody:not(.mouseOver_Monitored)', SSSFrame.document).then($el=>{
            $el.addClass("mouseOver_monitored").on('mouseover mouseout', '.GD42JS-DJYB.GD42JS-DJ-B tr', monitorPresMouseOver)
            SSSFrame.listingPrescriptions=true
            $('table[name=HEOFRAME] button:contains(Arrêt)', SSSFrame.document).click2()
        })
        */
        }, 2000)

        if (!document.getElementById('SSSFrame_MevaStyle')){
            $('<style id="SSSFrame_MevaStyle">', document).html(`
#HEO_POPUP .dialogMiddleCenter {background:#F5F5F5;}
#HEO_POPUP.force_hidden {visibility:hidden!important}
#CONSIGNES-POPUP table, #CONSIGNES-POPUP td, #CONSIGNES-POPUP th {border: 1px solid black;border-collapse: collapse;font-size:14px;}
#CONSIGNES-POPUP table {width:100%;}
#CONSIGNES-POPUP table td+td {text-align:center;}
#CONSIGNES-POPUP tr {border: 2px solid black;border-collapse: collapse;}
#CONSIGNES-POPUP [contenteditable][placeholder]:empty:before {content: attr(placeholder);color: #aaa;font-style:italic;}
#CONSIGNES-POPUP [contenteditable][placeholder]:empty:focus:before {content: "";}
#CONSIGNES-POPUP [contenteditable][placeholder] {color: #aaa;font-style:italic;}
#CONSIGNES-POPUP tr.consigne-autorise {background: lightgreen;}
#CONSIGNES-POPUP tr.consigne-restreint {background: lightyellow;}
#CONSIGNES-POPUP tr.consigne-interdit, #CONSIGNES-POPUP tr.consigne-accompagne {background: lightpink;}
#CONSIGNES-POPUP .consigne-restreint [contenteditable][placeholder]:empty:before {color: #a22;font-style:initial;}
#CONSIGNES-POPUP .consigne-restreint [contenteditable][placeholder] {color: #a22;font-style:initial;}
#CONSIGNES-POPUP .consigne-restreint [contenteditable][placeholder] {color: #111;font-style:initial;}
#CONSIGNES-POPUP tr.consigne-deplacements-restriction {display:none}
#CONSIGNES-POPUP tr.consigne-deplacements-restriction.consigne-restreint {border-top: 0px solid white;display:table-row;}
#CONSIGNES-POPUP tr.consigne-deplacements.consigne-restreint {border-bottom: 0px solid white;}
#CONSIGNES-POPUP td.consigne-restreint td.consigne-deplacements-restreints {border-bottom:0;}
#CONSIGNES-POPUP .consigne-deplacements-restriction td[colspan] {border-top:1px solid white;}
#CONSIGNES-POPUP .consigne-deplacements-restriction td[colspan] input:first-child {margin-left:141px;}
#CONSIGNES-POPUP tr.consigne-deplacements-restriction input+label {margin-right:25px;}
#CONSIGNES-POPUP #Type-SSC {visibility:hidden;}
#CONSIGNES-POPUP .consigne-restreint #Type-SSC {visibility:visible;}
.ui-widget-content .ui-state-default.ui-button-validate {background:#090;color:#fee;}
div.ui-dialog[aria-describedby="CONSIGNES-POPUP"] .ui-dialog-titlebar-close .ui-button-icon-primary {background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB8ElEQVR42p2Sb0/TUBTGiYlJ41cwkcXwRq5mUdQ36LqKsDlQJ8rY//8MZGyjrNlSmKv6QhM/id9qMSESxK3KoN262z3ezhhdtkrgJCc5ycnv3PM8505MnDOQy12xb5bLk6hWiV2/m1gjnWi0pAfCLht4F/2KDIgiGYUTpJPKoruxibb/5ef24osbIzDq79BnaYoSuvk8GYITafQKJaBWh1WrHl8JinLp9wBF4fqiZPZ33wAfP8GUa+i93oK18gCOp2BsFQHW1xMp/Fh4QjEzc3lYQlLhaL5ITakKvP8AWq6gk85CjyVhbBYAeW9Qq/Ne2nC7ufEmJpNcN5OjvcI2k/MW2KszsAZUZejRONTHHnv43yFaOGZCZnIicSAYAaQK1LkF80zYinYoQfRIDLCuEQgBr1aB7R2m24vm7Cw5Aw4RLRyFkV0HdiQGloEik8MM1FdW0XrI48DpJPZwKAIjk2P/QIIWDKMlzNHvD1zmyVM/sL6B02d+HN29j4PpaTIKM61Geo29KkJjq7fcjwaGWXl45x49nvcA6QxOvD4c3nLiy7Wpv0Pay8vCaSAII5WBthJEkxeG3G443NxXcpP+5AVoviV8c97G/tVJYWgL1bMoHC89R9PFj3W74XBw+9en6Fj4TxzxvPC/Uw2G2MEXjV//kEpgRFM89AAAAABJRU5ErkJggg==");
background-position:initial;}
#LABO-POPUP table input {vertical-align:-2px;margin-right:5px;}
.GOAX34LERB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBody div.GOAX34LORB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBodyLineSelected:hover {color:white!important}
#contextMenu_patients {position:fixed!important;}
#contextMenu_patients.ui-menu .ui-menu-item-wrapper {padding:8px;}
#contextMenu_patients.ui-menu .ui-menu-item {padding:0;}
.gwt-Image.small-gwt-Image {width: 16px;transform: translateY(3px);padding-right: 8px;margin-top: -5px;}
.icon-documents {content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMxSURBVDhPdZLrT1N3GMc7txcmlhcmUxPj2y1LTMxeLBpJTP8CE0tGdJE4EyVLUGMr4WaBjgrCzKCOoiBooUaglhZaioXTUnrh9OZpexwtp/eW0QsdUEmIGpeFfXcoJsaAT/K8+SXPJ9/Lj6PvKev1qCs9zLTAwMwIBsOEsC0xV10VN9eWJaw1Z/6arz2e8zccAofzBWevmVVcou0jV+DTCRDzjiLhUyLm6t+K2Dr/CVtaNxmjKB+xNslDIbJEDOz7cPZxkjYRnbQ1wquvQ2SRQjKVwkp+BYXCKjYKebxeW8bGenp98+07Q279zSUAnypZsjfSec8dZJwtoG1yjI8/h2ZiAnNWK3x+Gn6aBhMKY2l5GauFTdkuQGKunl5xtSBLNiFirAY53QOVZhzE7Bwo+k+4KR9eBRmEonGkVzd2A+LmOjrr/BXpeRGihABWXRv6ngxCPfkCdg8Fu5sCtRDEYiyJVP6zADEyLCBmEsKm70Dv4FPojBa4AyE4/AE46ACoxQjCmcJeFhrovFtStJAw18CobkG7VAa5UoMZ0lNcC/UKrmAEgfTabsCSbSfEnKP5A0CCNhYwMKrBlN0NncUBg4OC2bsAf2r1cwAJcs5mxIxCGJRNEN/rQj+rwOD0Yoo9nvUFQTJJeFNr3XtYqKdzbAuZ7RZmboJQidF+/w+oXhB4GU7AxcSK64kuwewPyTicA0fYsxJ2dz4VC/Bvh1hswSiAcYzN4H43hrVTIBfCcAbCoJgomOXcf3KleuyHU6cufHfixLfl5eVfFgFJa4Mp69hpIW66BULTirYHA3g2Y8eUN44JVwimYAauaBrdfQPvleqJtHcxMk1HUiL5sP4bToZsOf23R2LOkKJ/k2yIWkXtlvB281ZX/xDkKh0qKq/jp6vX8IugDk2SuxhVa6E32QqqSaJD/JvsaFHFGik+mp0X3YvPVr/WPqqkz52v+F06pHysmDQ5Oh4psvV3pe8qhQ0rl69WEd2yPmLgscI9olRrpdKe74uA7UlZft4fJW78aBq63Mjlcr/m8Xhf1bc/PNg1ojv+QGk4e7uz92RpaWkJ+87l8/mH+RcvHuPxeNz/AX7dZzZ5DoFPAAAAAElFTkSuQmCC)}
.icon-ordonnance {content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIbSURBVDhPY6AqEF/3yExszaMasXUP6sTWPqoVW/PQheH/f0aoNE7AKGkdKidjEWImWTw7T7xt40IYFqtcXCVtHWYhaxWuzFBfzwRVjwrk7UMlpCxD9ktZhLzHhaUtgs9L2YSrQbWgAgnzcE2gomfSliH/cWKLkE+SVsG2UC2oAGYAEP+Qsgx+AnTNLSD9C4h/AjX+lrYM/kuMAU+BinYCFU8GOvcG0NZV0hZBc6UsgvcCxe4D+R8JugCo8AtQ4Wugzd9AtgNd8gPuAsuQR1Kx1S7ia++IMdT/Rw1MJBfcBOLNQPZxoAGXgPQpoAvuAA16LJXaNUds1Z1TwGg9I7LmsRcDA1LUIgXiWaDibSD/Am09A8SHgezrUpahJ8Rnn9kgtvbhfzBec3+V1qorbFDtSAaAFAP9DLIRGA5/gPzfQPqvtFXoNdF559aLrXnwEYxX318jk9wrBE8XSGFwRNIiJBmo8RzQoNVAGhKIViHbxaYfqwNqXgi0vVt8/qU8KeuImUD5dAbjNFa4AUB/Pwcacg/olTeggATa/gUo/kPaMvSK2Nzz24HO/yu69sFdscXXVkjbRq0EGn5ZwjJInkHMJkgJqPAOUCPWRAT00jPx7u0LRdc+/A404Jv49GOLpKzDZgHlGiVsQkQZjIHOAOaDQKAh9UAXNKBjoGtqpYJLnUXXPYwHZrJU8dRuc6BXc0D5BxgCBDMaAcDAAABTEhAox93HNQAAAABJRU5ErkJggg==)}
#hoverMenu_pres {position:fixed;background:white;border:solid 1px grey;border-radius:3px;padding: 2px 5px;z-index:10;opacity:0.5}
#hoverMenu_pres:hover {opacity:1}
#hoverMenu_pres span {cursor:pointer;}
#hoverMenu_pres span[title="Reprendre"], #hoverMenu_pres span[title="Annuler arrêt & modifications"], #hoverMenu_pres.modified, #hoverMenu_pres.suspended span, #hoverMenu_pres.stopped {display:none}
#hoverMenu_pres span img {margin:2px;}
#hoverMenu_pres.suspended span[title="Reprendre"] {display:inline-block}
/* #hoverMenu_pres.suspended span[title="Reprendre"], #hoverMenu_pres.suspended span[title="Arrêt immédiat"], #hoverMenu_pres.modified span[title="Annuler arrêt & modifications"], #hoverMenu_pres.stopped span[title="Annuler arrêt & modifications"] {display:inline-block} */
button.ui-button.ui-button-validate.ui-corner-all.ui-widget+button {background: #bb0000;color: white;}
button.ui-button.ui-button-validate.ui-corner-all.ui-widget {background: green;color: white;}
#m_eva_Hospitalisation_ClinicalContextPortlet_main>tbody>tr>td>div>div>table {width:auto!important;}
#m_eva_Hospitalisation_ClinicalContextPortlet_main>tbody>tr>td>div>div>div {display:flex}
#m_eva_Hospitalisation_ClinicalContextPortlet_main>tbody>tr>td>div>div>div>div:nth-of-type(8) {display:flex!important;width:50px!important;}
#m_eva_Hospitalisation_ClinicalContextPortlet_main .GOAX34LMDB-fr-mckesson-framework-gwt-widgets-client-resources-FormFamilyCss-fw-HasValueWidget {width:570px!important;}
#m_eva_Hospitalisation_fonc_complement_clinique_recherche_hospit_content {overflow-y:hidden!important;}
.GOAX34LBNB-fr-mckesson-framework-gwt-widgets-client-resources-PanelFamilyCss-fw-TabPanel .gwt-TabPanelBottom {border-radius:8px;margin:0 1px;padding:5px!important;}
@media (min-width: 1679px){}
 #m_eva_Hospitalisation_fonc_complement_clinique_recherche_hospit_main .GOAX34LOCB-fr-mckesson-framework-gwt-widgets-client-resources-FormFamilyCss-fw-FormPanel-grid>tbody>tr:nth-of-type(3) {position:absolute;top:50px;right:15px;}
 #m_eva_Hospitalisation_fonc_complement_clinique_recherche_hospit_main .GOAX34LFCB-fr-mckesson-framework-gwt-widgets-client-resources-FormFamilyCss-fw-FormPanel {height:60px!important;}
 .GG-W0PSBPTB-fr-mckesson-meva-application-web-gwt-preferredapplications-client-ressources-RessourcesCommunCss-carousel>tbody>tr>td {width:auto!important;}
 .GG-W0PSBPTB-fr-mckesson-meva-application-web-gwt-preferredapplications-client-ressources-RessourcesCommunCss-carousel>tbody>tr>td>div {width:980px!important;}
 .GG-W0PSBBUB-fr-mckesson-meva-application-web-gwt-preferredapplications-client-ressources-RessourcesCommunCss-carousel_bouton_precedent, .GG-W0PSBDUB-fr-mckesson-meva-application-web-gwt-preferredapplications-client-ressources-RessourcesCommunCss-carousel_bouton_suivant {display:none;}

@media (min-height: 900px){
 //.GOAX34LERB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBody, .GOAX34LMSB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-Grid-sizer {height:auto!important;}
}
`).appendTo('body')
        }
        if (!SSSFrame.document.getElementById('SSSFrame_Script')){
            let script = document.createElement('script')
            script.id = "SSSFrame_Script"
            script.innerHTML = `
String.prototype.searchI = function(searchString) {
	if (this.toUpperCase){
		return this.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(searchString.toUpperCase()
			.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
	}
}
$.expr[":"].containsI = function (a, i, m) {
 return (a.textContent || a.innerText || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(m[3].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))>=0;
};
` + output_Selector.toString() + autoPresConsignesRapides.toString() + currentPres_Selector.toString()
            SSSFrame.document.body.append(script)
        }

    }else if (location.href.search("initSSS")+1){
        if (!window.monitorMouseMove) window.addEventListener('mousemove', clickLogin)





// --------------------------- heoOutput (liste des traitements / consignes) ------------------------------
// --------------------------- heoOutput (liste des traitements / consignes) ------------------------------
// --------------------------- heoOutput (liste des traitements / consignes) ------------------------------
// --------------------------- heoOutput (liste des traitements / consignes) ------------------------------

    } else if ((location.href.search('heoOutput.jsp')+1)){
        let heoOutputFrame = SSSFrame.document.heoPane_output
        const ke = new KeyboardEvent("keydown", {bubbles: true, cancelable: true, keyCode: 13});
        let $HEO_INPUT = $('#HEO_INPUT', SSSFrame.document).each((i,el)=>{
            if (!el.keydown) {setTimeout(addAutoPrescriptor, 500, SSSFrame)}
        })
        $('body', document).append($('<style>').text(`
.presPsy-rapide {position: absolute;right: 0;color: green!important;}
.presPsy-rapide:hover {text-decoration:underline;}
`)).append($('<script>').text(presOutputConsignesRapides.toString()))
        $.waitFor('form[name="Command"]', document).then(el=>{
            let outputTitle = $('div.outlineTitle', document).text().trim(), orderName
            switch(outputTitle){
                case "Prescriptions Usuelles de Psychiatrie Adulte":
                    delete SSSFrame.prescriptionIsoState
                    //$('button.GD42JS-DO5:contains(Oups)', SSSFrame.document).attr('disabled', true)
                    $('a:contains("Retourner à la liste")', document).remove()
                    $('a:contains("Consignes")', document).contextmenu(ev=>{ev.preventDefault();presOutputConsignesRapides(ev);}).before($('<a class="presPsy-rapide">Consignes rapides</a>').click(presOutputConsignesRapides))
                    $('a:contains("Sorties Temp")', document).contextmenu(ev=>{ev.preventDefault();presOutputConsignesRapides(ev);}).before($('<a class="presPsy-rapide">Permission rapide</a>').click(presOutputConsignesRapides))
                    $('a:contains("Bilans Psychiatrie")', document).contextmenu(ev=>{ev.preventDefault();presLaboRapide(ev);}).before($('<a class="presPsy-rapide">Bilan rapide</a>').click(presLaboRapide))
                    if (SSSFrame.nouvellesConsignes){
                        if (SSSFrame.nouvellesConsignes.done){
                            SSSFrame.nouvellesConsignes = ""
                        } else {
                            if (SSSFrame.nouvellesConsignes.phase = 1){
                                SSSFrame.output_Selector(1)
                            }
                        }
                    }
                    break
                case "Consignes d'Hébergement":
                    $('button.GD42JS-DO5:contains(Oups)', SSSFrame.document).attr('disabled', false)
                    //log(SSSFrame.nouvellesConsignes)
                    if (SSSFrame.nouvellesConsignes){
                        SSSFrame.nouvellesConsignes.done=true
                        Object.keys(SSSFrame.nouvellesConsignes).forEach(cons=>{
                            if (typeof SSSFrame.nouvellesConsignes[cons] == "object" && !SSSFrame.nouvellesConsignes[cons].done && !Array.isArray(SSSFrame.nouvellesConsignes[cons])){
                                SSSFrame.nouvellesConsignes.done=false
                                if (SSSFrame.nouvellesConsignes[cons].changeComment){
                                    SSSFrame.currentPres_Selector(cons == "mode_hospit" ? "consentement" : [cons, SSSFrame.nouvellesConsignes[cons].consigne])
                                }else{
                                    SSSFrame.output_Selector(cons == "mode_hospit" ? "consentement" : [ cons , SSSFrame.nouvellesConsignes[cons].consigne ])
                                }
                                return false
                            }
                        })
                    }
                    if (SSSFrame.nouvellesConsignes.done){
                        SSSFrame.nouvellesConsignes = ""
                        SSSFrame.output_Selector()
                    }
                    break
                case "Sorties Temporaires (permissions de sortie)":
                    $('button.GD42JS-DO5:contains(Oups)', SSSFrame.document).attr('disabled', false)
                    if (SSSFrame.autoPresPerm){
                        SSSFrame.autoPresPerm = false
                        $("a[onclick*=1]:first", document).click2()
                    }
                    break
                default:
                    $('button.GD42JS-DO5:contains(Oups)', SSSFrame.document).attr('disabled', false)
                    orderName = $('div.orderName', document).text().trim()
                    if (outputTitle == ""){
                        if ($('body>*:not(form):not(script):not(style)', document).text().length == 0){
                            $HEO_INPUT.val('Prescriptions usuelles de psychiatrie adulte')[0].dispatchEvent(ke);
                        } else {
                            $('a[onclick]:has(div.orderDisplayNum:contains("1.")):has(div.orderableList:contains("Prescriptions Usuelles de Psychiatrie Adulte"))', document).click2()
                            if (SSSFrame.autoEnhancedPres){
                                SSSFrame.output_Selector(SSSFrame.autoEnhancedPres.nom+' '+SSSFrame.autoEnhancedPres.forme)
                            } else if (SSSFrame.listePresLabo){
                                SSSFrame.output_Selector(SSSFrame.listePresLabo.current)
                                if (orderName && SSSFrame.listePresLabo.last && orderName.searchI(SSSFrame.listePresLabo.last)+1){
                                    $HEO_INPUT[0].dispatchEvent(ke);
                                }
                            }
                        }
                    }
                    break
            }
        })



// -------------------------------- Prompt frame / paramètres prescriptions -----------------------------
// -------------------------------- Prompt frame / paramètres prescriptions  -----------------------------
// -------------------------------- Prompt frame / paramètres prescriptions  -----------------------------
// -------------------------------- Prompt frame / paramètres prescriptions  -----------------------------


    } else if (location.href.search("heoPrompt.jsp")+1){
        let heoOutputFrame = SSSFrame.document.heoPane_output,
            $HEO_INPUT = $('#HEO_INPUT', SSSFrame.document)
        const ke = new KeyboardEvent("keydown", {bubbles: true, cancelable: true, keyCode: 13});
        if (document.getElementById('preHeaderMarkup')){
            let promptTitle = document.getElementById('preHeaderMarkup').innerText, pres
            $.waitFor('.orderName', heoOutputFrame.document).then($el=>{
                if ((pres = SSSFrame.autoEnhancedPres) && $el.filter('.orderName:containsI("'+pres.nom+'"):containsI("'+pres.forme+'")').length){
                    delete SSSFrame.prescriptionIsoState
                    switch (promptTitle){
                        case "Dose par prise:":
                            $HEO_INPUT.val(pres.posos[0].dose)[0].dispatchEvent(ke);
                            //$('[id="preMultiChoiceMarkup"]:contains("'+pres.posos[0].dose+'")', document).click2() //.each((i,el)=>el.click())
                            break;
                        case "Fréquence:":
                            $HEO_INPUT.val(pres.posos[0].freqName)[0].dispatchEvent(ke)
                            //$HEO_INPUT.each((i,el)=>setTimeout((elm, kb)=>{elm.value=pres.posos[0].freqName;elm.dispatchEvent(ke);}, 750, el, ke)).val()[0] //
                            break;
                        case "Commentaires:":
                            SSSFrame.autoEnhancedPres.posos.shift()
                            if (!SSSFrame.autoEnhancedPres.posos[0]){
                                delete SSSFrame.autoEnhancedPres
                            }else {
                            }
                            $HEO_INPUT.each((i,el)=>setTimeout((elm)=>elm.dispatchEvent(ke), 250, el))
                            break;
                        case "Saisissez une date et heure de début":
                        case "Durée: (avec une date et heure de fin optionnelle)":
                            $HEO_INPUT[0].dispatchEvent(ke)
                            break;
                        case "Médicament Hors Livret, continuer :":
                            $('a[onclick]:contains("OK")', document).click2()
                            $('a[onclick]:contains("(x)")', document).each(()=>$('a[onclick]:contains("ENTREE")', document).click2())
                            break;
                        case "Alerte médicamenteuse":
                            if (SSSFrame.autoEnhancedPres){
                                $("a[onclick]:contains('outrepasser l')", document).click2()
                            }
                            break;
                    }
                } else if ($el.filter('.orderName:contains("INFORMATION SUR LE PATIENT")').length){
                    delete SSSFrame.prescriptionIsoState
                    $HEO_INPUT.each((i,el)=>setTimeout(elm=>{let a = new Date();elm.value=a.toLocaleDateString()+" "+a.toLocaleTimeString([], {timeStyle: 'short'})}, 250, el))
                } else if ($el.filter('.orderName:contains("Isolement : Indication")').add($el.filter('.orderName:contains("Contention : Indication")')).length){
                    switch (promptTitle){
                        case "Interventions alternatives tentées:":
                            if (typeof SSSFrame.prescriptionIsoState == "undefined" || SSSFrame.prescriptionIsoState < 0){
                                $('a[onclick]:contains("(_)"):not(:contains("5")), a[onclick]:contains("ENTREE")', document).click2()
                                typeof SSSFrame.prescriptionIsoState == "undefined" ? SSSFrame.prescriptionIsoState=-4 : SSSFrame.prescriptionIsoState++
                            }
                            break
                        case "Absence de contre-indication à l'isolement:":
                        case "Absence contre-indication à l'Isolement Contention:":
                            $('a[onclick]:contains("(x)"):contains("Absence de CI")', document).each(()=>$('a[onclick]:contains("ENTREE")', document).click2())
                            break
                        case "Examen somatique réalisé :":
                            if (SSSFrame.prescriptionIsoState == 0){
                                $('a[onclick]:contains("OUI")', document).click2() //.log()
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Commentaire sur l'examen somatique réalisé:":
                            if (SSSFrame.prescriptionIsoState == 1){
                                $HEO_INPUT.each((i,el)=>setTimeout(elm=>{elm.value="RAS";elm.dispatchEvent(ke)}, 500, el))
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Présence Soignants Renfort / Soins:":
                            if (SSSFrame.prescriptionIsoState == 2){
                                $('a[onclick]:contains("OUI")', document).click2() //.log()
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Présence Soignants Repas:":
                            if (SSSFrame.prescriptionIsoState == 3){
                                $('a[onclick]:contains("OUI")', document).click2() //.log()
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Présence Soignants Soins Hygiène:":
                            if (SSSFrame.prescriptionIsoState == 4){
                                $('a[onclick]:contains("OUI")', document).click2() //.log()
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Objets Autorisés:":
                            if (SSSFrame.prescriptionIsoState == 5){
                                $HEO_INPUT.each((i,el)=>setTimeout(elm=>{elm.value="AUCUN";elm.dispatchEvent(ke)}, 500, el))
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Vêtements Autorisés:":
                            if (SSSFrame.prescriptionIsoState == 6){
                                $HEO_INPUT.each((i,el)=>setTimeout(elm=>{elm.value="AUCUN";elm.dispatchEvent(ke)}, 500, el))
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Mobilier Autorisé:":
                            if (SSSFrame.prescriptionIsoState == 7){
                                $HEO_INPUT.each((i,el)=>setTimeout(elm=>{elm.value="AUCUN";elm.dispatchEvent(ke)}, 500, el))
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Oreiller Standard:":
                            if (SSSFrame.prescriptionIsoState == 8){
                                $('a[onclick]:contains("OUI")', document).click2() //.log()
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Matelas:":
                            if (SSSFrame.prescriptionIsoState == 9){
                                $('a[onclick]:contains("ADAPTÉ")', document).click2()
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Visites:":
                            if (SSSFrame.prescriptionIsoState == 10){
                                $('a[onclick]:contains("RESTREINT")', document).click2()
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Sorties:":
                            if (SSSFrame.prescriptionIsoState == 11){
                                $('a[onclick]:contains("NON")', document).click2()
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                        case "Indication Isolement:":
                            if (SSSFrame.prescriptionIsoState == 12){
                                $('a[onclick]:contains("(_)"):contains("Prévention")', document).click2() //.log()
                                SSSFrame.prescriptionIsoState++;
                            }
                            break
                    }
                } else if ($el.filter('.orderName:contains("Mise en Isolement")').length){
                    delete SSSFrame.prescriptionIsoState
                    switch (promptTitle){
                        case "Mode d'Hospitalisation:":
                            $('a[onclick]:contains("(x)")', document).each(()=>$('a[onclick]:contains("ENTREE")', document).click2())
                            break
                        case "Information Mise en Isolement:":
                            $('a[onclick]:contains("Patient"):contains("(_)")', document).click2()
                            break
                    }
                } else if (SSSFrame.nouvellesConsignes && $el.filter('.orderName:contains("Soins sans consentement")').length){
                    switch (promptTitle){
                        case "Commentaires:":
                            SSSFrame.nouvellesConsignes.mode_hospit.done=true
                            $HEO_INPUT.each((i,el)=>setTimeout(elm=>{elm.value=SSSFrame.nouvellesConsignes.mode_hospit.comment;elm.dispatchEvent(ke)}, 500, el))
                            break
                        case "Durée: (avec une date et heure de fin optionnelle)":
                            $('a[onclick]:contains("ENTREE")', document).click2()
                            break
                    }


                    // ---------- Pres Labo auto -----------
                    // ---------- Pres Labo auto -----------
                    // ---------- Pres Labo auto -----------
                    // ---------- Pres Labo auto -----------
                } else if (SSSFrame.listePresLabo && $el.is('div.orderName:containsI('+SSSFrame.listePresLabo.current+')')){
                    switch(promptTitle){
                        case "Fréquence:":
                            $('a[onclick]:contains("ENTREE")', document).click2()
                            break;
                        case "Saisissez une date et heure de début":
                            $HEO_INPUT.val(SSSFrame.listePresLabo.labo[SSSFrame.listePresLabo.current] || SSSFrame.listePresLabo.date).each((i,el)=>{
                                if (SSSFrame.listePresLabo.current != "Lithium Sanguin" && SSSFrame.listePresLabo.current != "Dosage Clozapine" && SSSFrame.listePresLabo.current != "Dosage Acide Valpro"){
                                    SSSFrame.listePresLabo.last = SSSFrame.listePresLabo.current
                                    SSSFrame.listePresLabo.current = Object.keys(SSSFrame.listePresLabo.labo)[++SSSFrame.listePresLabo.currentN]
                                    if (!SSSFrame.listePresLabo.current){
                                        delete SSSFrame.listePresLabo
                                    }
                                }
                                el.dispatchEvent(ke);
                            })
                            break;
                        case "Commentaires:":
                            $HEO_INPUT.each((i,el)=>{
                                if (SSSFrame.listePresLabo.current == "Dosage Clozapine" || SSSFrame.listePresLabo.current == "Dosage Acide Valpro"){
                                    SSSFrame.listePresLabo.last = SSSFrame.listePresLabo.current
                                    SSSFrame.listePresLabo.current = Object.keys(SSSFrame.listePresLabo.labo)[++SSSFrame.listePresLabo.currentN]
                                    if (!SSSFrame.listePresLabo.current){
                                        delete SSSFrame.listePresLabo
                                    }
                                }
                                el.dispatchEvent(ke);
                            })
                            break;
                        case "Nature du liquide:":
                            $HEO_INPUT.each((i,el)=>{
                                SSSFrame.listePresLabo.last = SSSFrame.listePresLabo.current
                                SSSFrame.listePresLabo.current = Object.keys(SSSFrame.listePresLabo.labo)[++SSSFrame.listePresLabo.currentN]
                                if (!SSSFrame.listePresLabo.current){
                                    delete SSSFrame.listePresLabo
                                }
                                el.dispatchEvent(ke);
                            })
                            break;
                        default:
                            $HEO_INPUT[0].dispatchEvent(ke);
                            break;
                    }


                    // ---------- Consignes auto -----------
                    // ---------- Consignes auto -----------
                    // ---------- Consignes auto -----------
                    // ---------- Consignes auto -----------
                } else if (SSSFrame.nouvellesConsignes && $el.filter('div.orderName:contains(Gestion)').length){
                    delete SSSFrame.prescriptionIsoState
                    let currConsigne, currConsigneA
                    switch(promptTitle){
                        case "Sélectionnez un item dans la liste":
                            break
                        case "Circulation du Patient:":
                            switch (SSSFrame.nouvellesConsignes.deplacements.restriction){
                                case "soignant":
                                    $('a[onclick]:contains("(_)"):contains("1 soignant")', document).click2()
                                    $('a[onclick]:contains("ENTREE")', document).click2()
                                    break
                                case "proche":
                                    $('a[onclick]:contains("(_)"):contains("famille ou ami")', document).click2()
                                    $('a[onclick]:contains("ENTREE")', document).click2()
                                    break
                                case "seul":
                                    $('a[onclick]:contains("(_)"):contains("seul")', document).click2()
                                    $('a[onclick]:contains("ENTREE")', document).click2()
                                    break
                            }
                            break
                        case "Saisissez une date et heure de début":
                        case "Durée: (avec une date et heure de fin optionnelle)":
                        case "Fréquence:":
                            $('a[onclick]:contains("ENTREE")', document).click2()
                            break
                        case "Nombre de cigarettes autorisées par jour :":
                        case "Commentaires :":
                            currConsigneA = $('div.orderName', heoOutputFrame.document).text().trim().split(" : ")
                            currConsigne = currConsigneA[0].split(" ")[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            SSSFrame.nouvellesConsignes[currConsigne].done=true
                            $HEO_INPUT.val(SSSFrame.nouvellesConsignes[currConsigne].comment)[0].dispatchEvent(ke);
                            break
                    }
                }
            })
            if ((promptTitle == "Saisissez une date et heure de début") || (promptTitle.search("(avec une date et heure de fin optionnelle)")+1) ||
                promptTitle == "Date/time of BMT:" || promptTitle == "Quand la prescription doit-être arrêtée ?" ||
                promptTitle == "Quand la prescription doit-elle être reprise ?" || promptTitle == "Date de Dernière Prise:" ||
                promptTitle == "Quand la prescription doit-elle être suspendue ?"){
                document.head.append(hourCSS)
                document.head.append(hourScript)
                document.head.append(dateScript)
                setTimeout(dateHourPres, 500)
            } else if (promptTitle == 'Sélectionnez le motif de non prise en compte de cette alerte ou veuillez le saisir en texte libre') {
                $HEO_INPUT.val('b')[0].dispatchEvent(ke);
            } else if (promptTitle == 'Priorité: (de votre prescription)') {
                setTimeout(()=>{$('#HEO_INPUT', SSSFrame.document).val('PLANIFIE') //[0].dispatchEvent(ke);
                               }, 500)
            } else if (promptTitle == 'OK pour confirmer cette prescription ?') {
                $HEO_INPUT[0].dispatchEvent(ke);
            } else if (promptTitle == "Médicament Hors Livret, continuer :"){
                $('a[onclick]:contains("(_) OK")', document).click2()
                $('a[onclick]:contains("(x)")', document).each(()=>$('a[onclick]:contains("ENTREE")', document).click2())
            } else if (promptTitle == "Sélectionnez un item dans la liste") {

                var listePrescriptionsEquivalent = {"tdm":"Demande d'Examen Tomodensitométrique",
                                                   "scanner":"Demande d'Examen Tomodensitométrique",
                                                   "irm":"Demande d'IRM",
                                                   "radio":"Demande de Radio conventionnelle",
                                                   "nfs":"Numération Formule Sanguine",
                                                   "BHEP":"BHEP : ASAT ALAT",
                                                   "crp":"CRP (Sang)",
                                                   "bs":"BS (Iono,CA,Uree,Creat,Glucose)",
                                                   "tshu":"TSH (Sang)"}
                if(!$("a[onclick*='@THERAPEUTICSUBSTITUTION='", document).each((i,el)=>{
                    let presSearch = el.innerText.split('"')[1], presAction = listePrescriptionsEquivalent[presSearch]
                    if (presAction){
                        SSSFrame.output_Selector(presAction)
                    }})
                   .length && SSSFrame.listePresLabo)
                {
                    $HEO_INPUT.val(SSSFrame.listePresLabo.current)[0].dispatchEvent(ke);
                }
            }
        }


// --------------------------- Popup-document frame ------------------------------
// --------------------------- Popup-document frame ------------------------------
// --------------------------- Popup-document frame ------------------------------
// --------------------------- Popup-document frame ------------------------------

    } else if (location.href.search("docs/dc.htm")+1){
        switch ($('h1',document).text()){
            case "Arrêter/Suspendre/Reprendre":
                if (SSSFrame.nouvellesConsignes || typeof SSSFrame.listingPrescriptions == "undefined"){
                    if (typeof SSSFrame.listingPrescriptions == "undefined"){
                        $('#HEO_POPUP', SSSFrame.document).addClass('force_hidden')
                    }
                    $('button:contains("Arrêter ces prescriptions")', document).click2()
                }
                break
        }



// --------------------------- Fenêtre Popup ------------------------------
// --------------------------- Fenêtre Popup ------------------------------
// --------------------------- Fenêtre Popup ------------------------------
// --------------------------- Fenêtre Popup ------------------------------
// --------------------------- Fenêtre Popup ------------------------------

    } else if ((location.href.search("popupContents.jsp")+1)){
        let styleEl = document.createElement('style'), title, pres,
            $HEO_POPUP = $('#HEO_POPUP', SSSFrame.document)
        styleEl.innerHTML = `
.outOf2DaysRange {background:coral;}
.nj-picker .outOf2DaysRange.nj-item:hover {background:antiquewhite;}
body {background-color:#F5F5F5;}
`
        document.head.append(styleEl)

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
                case "Examen IRM CHU":
                case "Examen RAdiologie":
                case "Examen Tomodensitométrique":
                case "Echodoppler Veineux":
                case "Echodoppler Arteriel":
                case "Examen Echographique":
                case "EEG":
                    $('#autonomie_Chaise, #examen, #RV_service, #PC1, #scanant_non, #prem_non, #grossesse_non, #testgrossesse_non, #ci_non, #vv_non, #pac_non', document).click2()
                    $('#Telephone, #TelService', document).val(GM_getValue('service').phone)
                    break;
                case "":
                        //log(SSSFrame.nouvellesConsignes)
                    // Fenetre Arrêt / Suspension de prescription
                    if (SSSFrame.nouvellesConsignes){
                        if(typeof String.prototype.searchI == "undefined"){
                            String.prototype.searchI = function(searchString) {
                                if (typeof "searchString" == "string"){
                                    return this.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(searchString.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
                                } else {
                                    return undefined
                                }
                            }
                        }
                        Object.keys(SSSFrame.nouvellesConsignes).forEach(el=>{
                            $('tr[id="Nursing"][name^="Gestion"]', document) //.log()
                                .filter((i,elm)=>($(elm).a('name').searchI(el)+1) && !($(elm).a('name').split(" : ")[1].searchI(SSSFrame.nouvellesConsignes[el].consigne)+1))
                                .find('input').click2()
                        })
                        if (SSSFrame.nouvellesConsignes.mode_hospit.consigne == "SL"){
                            $('tr[id="Nursing"][name="Soins sans consentement"] input', document).click2()
                            SSSFrame.nouvellesConsignes.mode_hospit.done=true
                        }
                        SSSFrame.autoPresConsignesRapides(SSSFrame.nouvellesConsignes)
/*                         SSSFrame.consignesWaiter = SSSFrame.setInterval(()=>{
                            console.log('bouh')
                            if (!$HEO_POPUP.is(':visible')){
                                console.log('bah')
                                SSSFrame.autoPresConsignesRapides(SSSFrame.nouvellesConsignes)
                            }
                        },750) */
                        if ($('input:checked', document).length){
                            $('#playbackOrders', document).click2().log()
                        } else {
                            $('#HEO_POPUP a.GD42JS-DFXB', SSSFrame.document).click2()
                        }
                    } else if (typeof SSSFrame.listingPrescriptions == "undefined"){
                        $HEO_POPUP.hide()
                        SSSFrame.listingPrescriptions = {IPP:$('div.GOAX34LLOB-fr-mckesson-framework-gwt-widgets-client-resources-SharedCss-fw-Label:contains("IPP :")', SSSFrame.document).text().split(" : ")[1]}
                        $('table[width] tr[id]>td>div[name]', document).each((i,el)=>{
                            let posoPres = $(el).parent().next(),
                                start = $(el).parent().next().next().text().split("/");start[2]=(new Date()).getFullYear()+" à "+start[2].split(" ")[1];start = start.join("/");start=start.split("CET")[0]
                            posoPres = posoPres.find('div.tooltip').text() || posoPres.text()
                            posoPres = posoPres.split('- ')
                            SSSFrame.listingPrescriptions[el.innerText+posoPres.join("- ")+(posoPres.length ==1 && !posoPres[0] ? "»" : " »")+start] = {
                                id:el.id,
                                poso:posoPres[0].trim(),
                                freq:(posoPres.length>1 ? posoPres[1].trim():""),
                                comment:(posoPres.length>2 ? posoPres[2].trim():""),
                                début:start
                            }
                            $('#HEO_POPUP a.GD42JS-DFXB', SSSFrame.document).click2()
                        })
                        //$.waitFor('div.GD42JS-DLOB[style*="visibility: hidden"]', SSSFrame.document).then($el=>{
                        $.waitFor('#HEO_POPUP.force_hidden:hidden', SSSFrame.document).then($el=>{
                            $el.removeClass('force_hidden')
                            $('.full_bg', SSSFrame.document).hide()
                        })
                    } else if ($('tr[id="Other Investigations"][name*="temporaire en cours"] input', document).click2().length){
                    }
                    break
                default:
                    // prescription rapide de médoc
                    if ((pres = window.parent.autoEnhancedPres) && (window.parent.autoEnhancedPres.posos[0]) && $("p.Titre:containsI("+pres[0]+"):containsI("+pres[1]+")", document).length){
                        $("#frequence>option[value='"+pres.posos[0].freqName.toUpperCase()+"']", document).each((i,el)=>{el.selected=true})
                        $("#PosoSimple", document)[0].click()
                        $("#DoseSimple", document).val(pres.posos[0].dose)
                        pres.posos.shift()
                        if (!pres.posos){window.parent.autoEnhancedPres = ""}
                        $('#btPrescrire', document).click2()
                    }
                    break;
            }
        }
        if ($('#modif_action', document).length){
            let subseq = $('td:contains("prescription #")', document).text().split("prescription #").join("").split(",")[0],
            $trPres = $('#workbody subseq:contains('+subseq+')', SSSFrame.document).parents("tr")
            if ($trPres.has('span.heoDiscontinuedOrder').length && !$('#modif_action td>a.Retour', document).length){$('#modif_action td>a:first', document).each((i,el)=>{
                $(el).clone().insertAfter(el).attr("href", (i,t)=>{
                    t=t.split("@")
                    t[1]="RESET_ORDER="+t[1].split("=")[1].split(",")[0]
                    return t.join("@")}).attr({class: "Retour", style:"padding-left:16px"}).text("annuler l'arrêt et les modifications")
            })}
            if ($trPres.has('span.heldOrderMarkup').length && !$('#modif_action td>a.resume', document).length){$('#modif_action td>a:first', document).each((i,el)=>{
                $(el).clone().insertAfter(el).attr("href", (i,t)=>{
                    t=t.split("@")
                    t[1]="RESET_ORDER="+t[1].split("=")[1].split(",")[0]
                    return t.join("@")}).attr({class: "resume"}).text("reprendre")
            })}
            if ($trPres.has('span.heoModifiedOrder').length && !$('#modif_action td>a.Retour', document).length){$('#modif_action td>a:first', document).each((i,el)=>{
                $(el).clone().insertAfter(el).attr("href", (i,t)=>{
                    t=t.split("@")
                    t[1]="RESET_ORDER="+t[1].split("=")[1].split(",")[0]
                    return t.join("@")}).attr({class: "Retour", style:"padding-left:16px"}).text("annuler l'arrêt et les modifications")
            })}
            if (SSSFrame.nouvellesConsignes){
                let [consigne, autorisation] = $('b:eq(0)', document.body).text().split(' : ')
                if (autorisation){
                    consigne = consigne.split(" ")[2].toStringI().toLowerCase() //.log()
                    autorisation = autorisation.split(" ")[0].toStringI().toLowerCase() //.log()
                    if (SSSFrame.nouvellesConsignes[consigne].consigne == autorisation){
                    }
                }
            }
        }
        switch ($('h1',document).text()){
            case "Erreur":
                if (document.body.innerText.search('session HEO a été interrompue')+1){
                    $('input[name=OK]', document).click2()
                }
                break
            case "Information":
                if (document.body.innerText.search('date de début est située dans le passé')+1){
                    $('#HEO_POPUP #ZonePopupBoutons span.GD42JS-DO5:contains("OK")', SSSFrame.document).click2()
                } else if (document.body.innerText.search('Les prescriptions en mémoire')+1){
                    $('input[name=OK]', document).click2()
                }
                break
        }
    }
})();



// --------------------------- Selection de prescription active ------------------------------
// --------------------------- Selection de prescription active ------------------------------
// --------------------------- Selection de prescription active ------------------------------
// --------------------------- Selection de prescription active ------------------------------
// --------------------------- Selection de prescription active ------------------------------

function currentPres_Selector(presName, presComment = ""){
    if (typeof $ == "undefined" || typeof $.fn == "undefined"){var $ = window.$ || window.parent.$}
    if (typeof presName == "string"){
        presName = presName.split(" ")
    }
    if (typeof presComment == "string"){
        presComment = presComment.split(" ")
    }
    let selector = "div.gwt-HTML"
    if (Array.isArray(presName) && Array.isArray(presComment)){
        presName.forEach(name=>{
            selector += ":containsI("+name+")"
        })
        presComment.forEach(name=>{
            selector += ":containsI("+name+")"
        })
        $(selector).click2()
    }
}


// --------------------------- Selection de nouvelle prescription ------------------------------
// --------------------------- Selection de nouvelle prescription ------------------------------
// --------------------------- Selection de nouvelle prescription ------------------------------
// --------------------------- Selection de nouvelle prescription ------------------------------
// --------------------------- Selection de nouvelle prescription ------------------------------

function output_Selector(sel, checkExists = false){
    console.log('Selection : ', sel)
    if (typeof $ == "undefined" || typeof $.fn == "undefined"){var $ = window.$ || window.parent.$}
    let output = document.heoPane_output || window.parent.document.heoPane_output,
        MedocPasHorsLivret = ["diazepam", "olanzapine"]
    if (!sel){sel = "Retourner"}
    let filterString = "", pasHorsLivret = false
    if (typeof sel == "string" && sel.search(" ")+1){
        sel = sel.split(" ")
    }
    if (Array.isArray(sel)){
        for (let i = 0; i < sel.length ; i++){
            if (MedocPasHorsLivret.includes(sel[i])){
                pasHorsLivret = true
            }
            filterString += ":containsI("+sel[i]+")"
        }
    }

    sel = 'a'+(typeof sel == "string" ? ':containsI('+sel+')' : (typeof sel == "number" ? '[onclick*='+sel+']:first' : filterString))
    if (checkExists){
        return ($(sel, output.document.body).length > 0 ? true : false)
    }else{
        setTimeout((selector, out)=>{
            let $selection = $(selector, out.document)
            //console.log($selection)
            if ($selection.length > 1){$selection = $selection.filter(pasHorsLivret ? ":not(:has(.HorsLivret))":"*")}
            $selection.first().each((i,el)=>{setTimeout((el)=>{el.click()},250, el)})
        }, 250, sel, output)
    }
}



// --------------------------- Création liste Consignes ------------------------------
// --------------------------- Création liste Consignes ------------------------------
// --------------------------- Création liste Consignes ------------------------------
// --------------------------- Création liste Consignes ------------------------------
// --------------------------- Création liste Consignes ------------------------------

function autoPresConsignesRapides(consignes){
    if (!$ || !$.fn){var $ = (typeof unsafeWindow != "undefined" ? unsafeWindow.$ || unsafeWindow.parent.$ : window.$ || window.parent.$)}
    if (consignes){
        consignes.phase = 1
        $.waitFor('#HEO_POPUP:hidden', document).then($el=>{
            window.output_Selector(1)
        })
/*        if(!consignes.phase){
            consignes.phase = 1
       } else {
            consignes.phase = 1
        } */
    } else {
        let currentConsignes = {
            affaires:{consigne:"0", comment: ""},
            appels:{consigne:"0", comment: ""},
            deplacements:{consigne:"0", comment: ""},
            tabagisme:{consigne:"0", comment: ""},
            vetements:{consigne:"0", comment: ""},
            visites:{consigne:"0", comment: ""},
            mode_hospit:{consigne:"SL", comment:""}
        }
        $('div.gwt-HTML:contains("Gestion")','#workbody').each((i,el)=>{
            let currConsigne = $(el).find('b').text(),
                currConsigneA = currConsigne.split(" : "),
                commentConsigne = $(el).textContent().split(" - ").find(el=>(el.search(' »')+1 && !(el.search('Planifi')+1))) || ""
            currConsigne = currConsigneA[0].split(" ")[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            if(commentConsigne){
                commentConsigne = commentConsigne.split("  »")[0]
            }
            currentConsignes[currConsigne] = {
                consigne:(currConsigneA[1].search("Restreint")+1 ? "restreint":(currConsigneA[1].search("Interdit")+1 ? "interdit":currConsigneA[1].search("Accompagné")+1 ? "accompagne":(currConsigneA[1].search("Autorisé")+1 ? "autorise":""))),
                comment:commentConsigne}
        })
        $('div.gwt-HTML:contains("Soins sans consentement")','#workbody').each((i,el)=>{
            currentConsignes.mode_hospit.consigne = "SSC"
            currentConsignes.mode_hospit.comment = $(el).textContent().split(" - ").find(el=>(el.search(' »')+1 && !(el.search('Planifi')+1))).split("  »")[0] || ""
        })
        return currentConsignes
    }
}



// --------------------------- Popup pres labo rapide ------------------------------
// --------------------------- Popup pres labo rapide ------------------------------
// --------------------------- Popup pres labo rapide ------------------------------
// --------------------------- Popup pres labo rapide ------------------------------
// --------------------------- Popup pres labo rapide ------------------------------

function presLaboRapide(ev){
    if (!$ || !$.fn){var $ = (typeof unsafeWindow != "undefined" ? unsafeWindow.$ || unsafeWindow.parent.$ : window.$ || window.parent.$)}
    let SSSFrame = window
    while (!SSSFrame.name || SSSFrame.name != "SSSFrame"){
        SSSFrame = SSSFrame.parent
    }
    $('#LABO-POPUP', SSSFrame.document).dialog('destroy').remove()
    $('<div id="LABO-POPUP"></div>', SSSFrame.document).append(`
<table style="margin:auto;">
 <thead>
  <tr>
   <th style="width:200px">Labo :</th>
   <th style="width:150px">Date/heure</th>
   <th style="width:200px">Dosage :</th>
   <th style="width:150px">Date/heure</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td><input type="checkbox" id="labo-nfs"><label for="labo-nfs">NFS</label></td>
   <td><input type="datetime" id="date_labo-nfs"></td>
   <td><input type="checkbox" id="labo-li"><label for="labo-li">Lithémie</label></td>
   <td><input type="datetime" id="date_labo-li"></td>
  </tr>
  <tr>
   <td><input type="checkbox" id="labo-bs"><label for="labo-bs">Iono+Ca+Urée+Créat</label></td>
   <td><input type="datetime" id="date_labo-bs"></td>
   <td><input type="checkbox" id="labo-cloza"><label for="labo-cloza">Clozapinémie</label></td>
   <td><input type="datetime" id="date_labo-cloza"></td>
  </tr>
  <tr>
   <td><input type="checkbox" id="labo-crp"><label for="labo-crp">CRP</label></td>
   <td><input type="datetime" id="date_labo-crp"></td>
   <td><input type="checkbox" id="labo-valpro"><label for="labo-valpro">Valproatémie</label></td>
   <td><input type="datetime" id="date_labo-valpro"></td>
  </tr>
  <tr>
   <td><input type="checkbox" id="labo-bh"><label for="labo-bh">Bilan hépatique</label></td>
   <td><input type="datetime" id="date_labo-bh"></td>
  </tr>
  <tr>
   <td><input type="checkbox" id="labo-tsh"><label for="labo-tsh">TSH</label></td>
   <td><input type="datetime" id="date_labo-tsh"></td>
  </tr>
  <tr>
   <td><input type="checkbox" id="labo-bc"><label for="labo-bc">Bilan coagulation</label></td>
   <td><input type="datetime" id="date_labo-bc"></td>
  </tr>
 </tbody>
 <tfoot style="margin-top:15px;border-top:1px solid black">
  <tr>
   <td colspan=4>
    Date et heure de prescription par défaut :
    <input checked type="radio" name="date_labo-general" id="date_labo-now" value=""><label for="date_labo-now">Maintenant</label>
    <input type="radio" name="date_labo-general" id="date_labo-demain" value="`+
                                                               (new Date((new Date()).setDate((new Date()).getDate()+((new Date()).getHours() > 6 ? 1 : 0)))).toLocaleDateString()+ // ajout de la date de demain s'il est plus de 08h
                                                               ` 08:00"><label for="date_labo-demain">Demain matin</label>
    <input type="radio" name="date_labo-general" id="date_labo-date" value=""><label for="date_labo-date">Date :</label><input type="datetime" step=600 name="date_labo-general" id="date_labo-autre">
   </td>
  </tr>
 </tfoot>
</table>`).dialog({
        modal:true,
        title:"Prescription rapide de bilan",
        minHeight:250,
        minWidth:680,
        width:$(SSSFrame.datePresPicker.picker).width()+298,
        height:"auto",
        resize:"auto",
        autoResize:true,
        open:function(ev, ui){
            $('#LABO-POPUP input', SSSFrame.document).attr('autocomplete', 'off')
            $('#LABO-POPUP', SSSFrame.document).on('click', 'input', ev=>{
                if ($(ev.currentTarget).is('[type=datetime]')){
                    SSSFrame.datePresPicker.show()
                    if (!SSSFrame.hourPresPicker.pickerVisible){
                        SSSFrame.hourPresPicker.show()
                    }
                    $(SSSFrame.hourPresPicker.wrapper).css({zIndex: 1001, width:0, height:0})
                    let labo_popup_pos = $("#LABO-POPUP").parent().position()
                    labo_popup_pos.top += $("#LABO-POPUP").parent().outerHeight()
                    labo_popup_pos.left += $("#LABO-POPUP").parent().outerWidth()-300
                    $(SSSFrame.hourPresPicker.container).addClass('labo-popup').css(labo_popup_pos)
                    $(SSSFrame.datePresPicker.picker).css({top:0,left:0}).position({at:"left bottom", my:"left top", of:$("#LABO-POPUP").parent()})
                    SSSFrame.hourPresPicker.labo_input = SSSFrame.datePresPicker.labo_input = ev.currentTarget
                    $(ev.currentTarget).parent().prev().find('input[type=checkbox]').add($(ev.currentTarget).siblings().filter('input[type=radio][id=date_labo-date]')).prop("checked", true)
                } else if ($(ev.currentTarget).is('[type=radio]:not([id=date_labo-date])')){
                    $('#date_labo-autre', SSSFrame.document).val("")
                }
            })
        },
        close:(ev,ui)=>{
            $('#LABO-POPUP', SSSFrame.document).off('click')
            SSSFrame.datePresPicker.setDate(new Date((new Date()).setDate((new Date()).getDate()+((new Date()).getHours() > 6 ? 1 : 0))))
            SSSFrame.hourPresPicker.hours[8].click()
            setTimeout(()=>{
                SSSFrame.datePresPicker.hide()
                SSSFrame.hourPresPicker.hide()
            },10)
        },
        buttons: [
            {
                text: "Valider",
                class: "ui-button ui-button-validate",
                click: function() {
                    let equivalenceLabo = {bs:"BS (Iono,CA,Uree,Creat,Glucose)", bc:"Bilan de coagulation", bh:"BHEP : ASAT ALAT", nfs:"numération formule sanguine", tsh:"TSH (Sang)", crp:"CRP (Sang)",
                                           cloza:"Dosage Clozapine", li:"Lithium Sanguin", valpro:"Dosage Acide Valpro"},
                        listePresLabo = {labo:{}}
                    $('#LABO-POPUP table input', SSSFrame.document).each((i,el)=>{
                        if ($(el).is('[type=checkbox]:checked')){
                            let currentLabo = $(el).attr('id').split('-')[1]
                            listePresLabo.labo[equivalenceLabo[currentLabo] || currentLabo]=$('#date_labo-'+currentLabo).val()
                        } else if ($(el).is('[name="date_labo-general"][type=radio]:checked')) {
                            listePresLabo.date = $(el).val() || $('#date_labo-autre').val() || ''
                        }
                    })
                    let pres
                    if ((pres = Object.keys(listePresLabo.labo)).length){
                        listePresLabo.current = pres[0]
                        listePresLabo.currentN = 0
                        SSSFrame.listePresLabo = listePresLabo
                        const ke = new KeyboardEvent("keydown", {bubbles: true, cancelable: true, keyCode: 13});
                        $('#HEO_INPUT', SSSFrame.document).val(pres[0])[0].dispatchEvent(ke)
                    }
                    $( this ).dialog( "close" );
                }
            },
            {
                text: "Annuler",
                click: function() {
                    $( this ).dialog( "close" );
                }
            }
        ]
    })
}

// --------------------------- Popup liste Consignes rapides ------------------------------
// --------------------------- Popup liste Consignes rapides ------------------------------
// --------------------------- Popup liste Consignes rapides ------------------------------
// --------------------------- Popup liste Consignes rapides ------------------------------
// --------------------------- Popup liste Consignes rapides ------------------------------

function presOutputConsignesRapides(ev){
    if (!$ || !$.fn){var $ = (typeof unsafeWindow != "undefined" ? unsafeWindow.$ || unsafeWindow.parent.$ : window.$ || window.parent.$)}
    let SSSFrame = window
    while (!SSSFrame.name || SSSFrame.name != "SSSFrame"){
        SSSFrame = SSSFrame.parent
    }
    if ($(ev.target).text().search('Sorties Temp')+1 || $(ev.target).text().search('Permission rapide')+1){
        SSSFrame.autoPresPerm = true
        if ($(ev.target).text().search('Sorties Temp')+1){
            ev.target.click()
        } else {
            $("a[onclick*=2]:first", document).click2()
        }
    } else if ($(ev.target).text().search('Consignes')+1){
        if(!$('#CONSIGNES-POPUP', SSSFrame.document).dialog('open').length){
            $('#CONSIGNES-POPUP', SSSFrame.document).dialog('destroy').remove()
            $('<div id="CONSIGNES-POPUP"></div>', SSSFrame.document).append(`
<table>
 <thead>
  <tr class="consigne-mode_hospit">
   <td colspan="5" style="text-align: center;">Hospitalisation en :
    <input type="radio" checked id="Mode_hospit-SL" name="mode_hospit" consigne="SL"><label for="Mode_hospit-SL"> SL</label>
    <input type="radio" id="Mode_hospit-SSC" name="mode_hospit" consigne="SSC"><label for="Mode_hospit-SSC"> SSC</label>
    <select id="Type-SSC">
     <option value="" style="font-style:italic;color:grey;">---Préciser---</option>
     <option value="SSCDT">SSCDT</option>
     <option value="SSCDTu">SSCDTu</option>
     <option value="SPPI">SPPI</option>
    </select>
   </td>
  </tr>
  <tr>
   <th style="width:150px">Consigne</th>
   <th style="width:80px">Autorisé</th>
   <th style="width:80px">Interdit</th>
   <th style="width:80px">Restreint</th>
   <th>Commentaire</th>
  </tr>
 </thead>
 <tbody>
  <tr class="consigne-appels">
   <td>Appels</td>
   <td><input type="radio" name="appels" consigne="autorise"></td>
   <td><input type="radio" name="appels" consigne="interdit"></td>
   <td><input type="radio" name="appels" consigne="restreint"></td>
   <td><div contenteditable name="appels-com" placeholder="Nombres d'appels ? Destinataires ?"/></td>
  </tr>
  <tr class="consigne-deplacements">
   <td>Déplacements</td>
   <td><input type="radio" name="deplacements" consigne="autorise"></td>
   <td><input type="radio" name="deplacements" consigne="interdit"></td>
   <td class="consigne-deplacements-restreints"><input type="radio" name="deplacements" consigne="restreint"></td>
   <td><div contenteditable name="deplacements-com" placeholder="Descente sur temps court ?">Descente sur temps courts</div></td>
  </tr>
  <tr class="consigne-deplacements-restriction">
   <td colspan="4">
    <input type="radio" name="deplacements-restriction" id="deplacements-restriction-soignants" checked=true descente="soignant">
    <label for="deplacements-restriction-soignants">avec soignant</label>
    <input type="radio" name="deplacements-restriction" id="deplacements-restriction-proche" descente="proche">
    <label for="deplacements-restriction-proche">avec proche</label>
    <input type="radio" name="deplacements-restriction" id="deplacements-restriction-seul" descente="seul">
    <label for="deplacements-restriction-seul">seul</label>
   </td>
  </tr>
  <tr class="consigne-visites">
   <td>Visites</td>
   <td><input type="radio" name="visites" consigne="autorise"></td>
   <td><input type="radio" name="visites" consigne="interdit"></td>
   <td><input type="radio" name="visites" consigne="restreint"></td>
   <td><div contenteditable name="visites-com" placeholder="Famille ? Temps court ?"/></td>
  </tr>
  <tr class="consigne-vetements">
   <td>Vêtements</td>
   <td><input type="radio" name="vetements" consigne="autorise"></td>
   <td><input type="radio" name="vetements" consigne="interdit"></td>
   <td><input type="radio" name="vetements" consigne="restreint"></td>
   <td><div contenteditable name="vetements-com" placeholder="Veste ? Pantalon ?"/></td>
  </tr>
  <tr class="consigne-affaires">
   <td>Affaires persos</td>
   <td><input type="radio" name="affaires" consigne="autorise"></td>
   <td><input type="radio" name="affaires" consigne="interdit"></td>
   <td><input type="radio" name="affaires" consigne="restreint"></td>
   <td><div contenteditable name="affaires-com" placeholder="Téléphone ? Ordinateur ? Autre ?"/></td>
  </tr>
  <tr class="consigne-tabagisme">
   <td>Cigarettes</td>
   <td><input type="radio" name="tabagisme" consigne="autorise"></td>
   <td><input type="radio" name="tabagisme" consigne="accompagne"></td>
   <td><input type="radio" name="tabagisme" consigne="restreint"></td>
   <td><div contenteditable name="tabagisme-com" placeholder="Nombre de cigarettes ?">7 cigarettes par jour</div></td>
  </tr>
</tbody></table>`).dialog({
                modal:true,
                title:"Consignes d'hospitalisation",
                minHeight:250,
                minWidth:680,
                width:800,
                height:"auto",
                resize:"auto",
                autoResize:true,
                open:function(ev, ui){
                    let currConsignes = autoPresConsignesRapides()
                    SSSFrame.listingConsignes = currConsignes
                    Object.keys(currConsignes).forEach(el=>{
                        $('#CONSIGNES-POPUP input[name='+el+'][consigne='+currConsignes[el].consigne+']', SSSFrame.document).click2()
                        $('#CONSIGNES-POPUP div[contenteditable][name='+el+'-com]').text(currConsignes[el].comment)
                        if (el == "mode_hospit" && currConsignes[el].consigne == "SSC"){
                            $("#Type-SSC option[value="+currConsignes[el].comment+"]").prop('selected', true)
                        }
                    })
                },
                buttons: [
                    {
                        text: "Valider",
                        class: "ui-button ui-button-validate",
                        click: function() {
                            let listeConsignes={affaires:{consigne:"0", comment: ""},
                                                appels:{consigne:"0", comment: ""},
                                                deplacements:{consigne:"0", comment: ""},
                                                tabagisme:{consigne:"0", comment: ""},
                                                vetements:{consigne:"0", comment: ""},
                                                visites:{consigne:"0", comment: ""},
                                                mode_hospit:{consigne:"SL", comment:""},
                                                changeComment:[]},
                                consignesValides=true
                            $('#CONSIGNES-POPUP tbody tr').each((i,el)=>{
                                if ($(el).hasClass('consigne-deplacements-restriction')){
                                    listeConsignes.deplacements.restriction = $('input:checked', el).attr('descente')
                                } else {
                                    let currentConsigne = {"consigne": $('input:checked', el).attr('consigne') || "0", "comment":$('div[contenteditable]', el).text()},
                                        nom_consigne = $('input:first', el).attr('name')
                                    if (currentConsigne.consigne == "restreint" && currentConsigne.comment == "" && nom_consigne != "deplacements")
                                    {
                                        consignesValides = false
                                        return false
                                    }
                                    listeConsignes[nom_consigne] = currentConsigne
                                }
                            })
                            if (listeConsignes.deplacements.consigne == "restreint" && listeConsignes.deplacements.restriction == "seul" && listeConsignes.deplacements.comment == ""){
                                consignesValides = false
                            }
                            $('#CONSIGNES-POPUP thead tr:first').each((i,el)=>{
                                listeConsignes.mode_hospit={consigne:$('input:checked', el).attr('id').split('-')[1],comment:$('select',el).val()}
                            })
                            if (consignesValides){
                                $( this ).dialog( "close" );
                                let nbToDelete = 0
                                Object.keys(listeConsignes).forEach(el=>{
                                    if (el == "changeComment"){
                                    } else if (SSSFrame.listingConsignes[el].consigne == listeConsignes[el].consigne){
                                        if(SSSFrame.listingConsignes[el].comment == listeConsignes[el].comment){
                                            listeConsignes[el].done=true
                                        } else {
                                            listeConsignes[el].changeComment = true
                                            listeConsignes.changeComment.push(el)
                                        }
                                    } else {
                                        nbToDelete++
                                    }
                                })
                                SSSFrame.nouvellesConsignes = listeConsignes
                                if (nbToDelete){
                                    $('table[name=HEOFRAME] button:contains(Arrêt)').click2()
                                }else{
                                    $("a[onclick*='doSel(\\'1\\'']",SSSFrame.document.heoPane_output.document).click2()
                                }
                            } else {
                                alert('Préciser les restrictions !')
                            }
                        }
                    },
                    {
                        text: "Annuler",
                        click: function() {
                            $( this ).dialog( "close" );
                        }
                    }
                ]
            })
        }
    }
}



// --------------------------- Prescription rapide ------------------------------
// --------------------------- Prescription rapide ------------------------------
// --------------------------- Prescription rapide ------------------------------
// --------------------------- Prescription rapide ------------------------------
// --------------------------- Prescription rapide ------------------------------

function addAutoPrescriptor(ev){
    // gestion de prescription rapide de traitement
    // sous la forme "MOLECULE DOSE FREQUENCE" (ex "olanzapine 15 coucher" ou "diazepam 5 1-1-1-2")
    // ou "MOLECULE POSOLOGIE" (ex diazepam 10-5-5-10)
    // ou "MOLECULE DOSE" pour des traitements prédéfinis ("olanzapine 10" équivaut à "olanzapine 10 coucher")
    let SSSFrame = ev.name && ev.name == "SSSFrame" ? ev : (ev && ev.view && ev.view.document.name == "SSSFrame" ? ev.view : document.getElementById('SSSFrame').contentWindow), $ = SSSFrame.$

    // liste équivalance DCI
    let DCI = {loxapac:"loxapine", nozinan:"levomepromazine", tercian:"cyamemazine",
               abilify:"aripiprazole", risperdal:"risperidone",zyprexa:"olanzapine", leponex:"clozapine", solian:"amisulpride", xeroquel:"quetiapine",
               valium:"diazepam", seresta:"oxazepam", tranxene:"clorazepate", lysanxia:"prazepam", temesta:"lorazepam", xanax:"alprazolam", lexomil:"bromazepam",
               atarax:"hydroxyzine", imovane:"zopiclone", stilnox:"zolpidem", noctamide:"lormetazepam", theralene:"alimemazine",
               revia:"naltrexone", selincro:"nalmefene"
              },
        defaultsPres = {
            posos:{
                diazepam:[1,1,1,1], temesta:[1,1,1,1],
                aripiprazole:[1,0,0,0], risperidone:[0,0,1], olanzapine:[0,0,0,1], quetiapine:[0,0,0,1],
                cyamemazine:[1,1,1,1], levomepromazine:[1,1,1,1], loxapine:[1,1,1,1],
                alimemazine:[0,0,0,1], lormetazepam:[0,0,0,1], hydroxyzine:[0,0,0,1]
            },
            formes:{
                loxapine:"buv", olanzapine:"dispers", cyamemazine:"buv", abilify:"cp"
            },
            dose:{
                olanzapine:20,aripiprazole:10,loxapine:25,cyamemazine:25,risperidone:2,alimemazine:10,diazepam:10,lorazepam:1,lormetazepam:1, hydroxyzine:25,quetiapine:150
            }
        },
        formes = ["cp", "buv", "inj", "gel", "im"],
        frequences = {"coucher":[0,0,0,1], "matin":[1,0,0,0], "midi":[0,1,0,0], "soir": [0,0,1,0], "mms":[1,1,1,0], "mmsc":[1,1,1,1]}
    if($('#HEO_INPUT', SSSFrame.document).each((i,el)=>{
        if (!el.keydown){
            el.keydown = el.onkeydown
        }
        el.onkeydown = "";

        // suggestion et autocompletion de prescription
        $(el).autocomplete({
            source:[
                {label:"chlorpromazine"}, {label:"Largactil", value:"chlorpromazine"},
                {label:"cyamemazine"}, {label:"Tercian", value:"cyamemazine"},
                {label:"levomepromazine"}, {label:"Nozinan", value:"levomepromazine"},
                {label:"fluphenazine"}, {label:"Modecate", value:"fluphenazine"},
                {label:"perphenazine"}, {label:"Trilafon", value:"perphenazine"},
                {label:"pipotiazine"}, {label:"Piportil", value:"pipotiazine"},
                {label:"pipamperone"}, {label:"Dipiperon", value:"pipamperone"},
                {label:"pimozide"}, {label:"Orap", value:"pimozide"},
                {label:"penfluridol"}, {label:"Semap", value:"penfluridol"},
                {label:"tiapride"}, {label:"Tiapridal", value:"tiapride"},
                {label:"zuclopenthixol"}, {label:"Clopixol", value:"zuclopenthixol"},
                {label:"flupentixol"}, {label:"Fluanxol", value:"flupentixol"},
                {label:"haloperidol"}, {label:"Haldol", value:"haloperidol"},
                {label:"loxapine"}, {label:"Loxapac", value:"loxapine"},
                {label:"clozapine"}, {label:"Leponex", value:"clozapine"},
                {label:"olanzapine"}, {label:"Zyprexa", value:"olanzapine"},
                {label:"risperidone"}, {label:"Risperdal", value:"risperidone"},
                {label:"quetiapine"}, {label:"Xeroquel", value:"quetiapine"},
                {label:"ziprasidone"},
                {label:"amisulpride"}, {label:"Solian", value:"amisulpride"},
                {label:"sulpiride"}, {label:"Dogmatil", value:"sulpiride"},
                {label:"paliperidone"}, {label:"Xeplion", value:"paliperidone"},
                {label:"aripiprazole"}, {label:"Abilify", value:"aripiprazole"},
                {label:"metoclopramide"}, {label:"Primpera", value:"metoclopramide"},
                {label:"metopimazine"}, {label:"Vogalene", value:"metopimazine"},
                {label:"alimemazine"}, {label:"Theralène", value:"alimemazine"},

                {label:"fluoxetine"}, {label:"Prozac", value:"fluoxetine"},
                {label:"paroxetine"}, {label:"Deroxat", value:"paroxetine"},
                {label:"sertraline"}, {label:"Zoloft", value:"sertraline"},
                {label:"citalopram"}, {label:"Seropram", value:"citalopram"},
                {label:"escitalopram"}, {label:"Seroplex", value:"escitalopram"},
                {label:"fluvoxamine"}, {label:"Floxyfral", value:"fluvoxamine"},
                {label:"duloxetine"}, {label:"Cymbalta", value:"duloxetine"},
                {label:"mirtazapine"}, {label:"Norset", value:"mirtazapine"},
                {label:"bupropion"}, {label:"Wellbutrin", value:"bupropion"}, {label:"Zyban", value:"bupropion"},
                {label:"vortioxetine"}, {label:"Brintellix", value:"vortioxetine"},
                {label:"minalcipran"}, {label:"Ixel", value:"minalcipran"},
                {label:"clomipramine"}, {label:"Anafranil", value:"clomipramine"},
                {label:"trazodone"}, {label:"Trittico", value:"trazodone"},
                {label:"amitriptyline"}, {label:"Laroxyl", value:"amitriptyline"},
                {label:"desipramine"},
                {label:"tranylcypromine"}, {label:"Parnate", value:"tranylcypromine"},
                {label:"trimipramine"}, {label:"Surmontil", value:"trimipramine"},
                {label:"imipramine"},
                {label:"maprotiline"}, {label:"Ludiomil", value:"maprotiline"},
                {label:"mianserine"}, {label:"Athymil", value:"mianserine"},
                {label:"tianeptine"}, {label:"Stablon", value:"tianeptine"},

                {label:"clotiazepam"}, {label:"Veratran", value:"clotiazepam"},
                {label:"oxazepam"}, {label:"Seresta", value:"oxazepam"},
                {label:"alprazolam"}, {label:"Xanax", value:"alprazolam"},
                {label:"lorazepam"}, {label:"Temesta", value:"lorazepam"},
                {label:"bromazepam"}, {label:"Lexomil", value:"bromazepam"},
                {label:"diazepam"}, {label:"Valium", value:"diazepam"},
                {label:"clorazepate"}, {label:"Tranxène", value:"clorazepate"},
                {label:"clobazam"}, {label:"Urbanyl", value:"clobazam"},
                {label:"prazepam"}, {label:"Lysanxia", value:"prazepam"},
                {label:"nitrazepam"}, {label:"Mogadon", value:"nitrazepam"},
                {label:"lormetazepam"}, {label:"Noctamide", value:"lormetazepam"},
                {label:"flunitrazepam"}, {label:"Rohypnol", value:"flunitrazepam"},
                {label:"temazepam"}, {label:"Normison", value:"temazepam"},
                {label:"loprazolam"}, {label:"Havlane", value:"loprazolam"},
                {label:"estazolam"}, {label:"Nuctalon", value:"estazolam"},
                {label:"zolpidem"}, {label:"Stilnox", value:"zolpidem"},
                {label:"zopiclone"}, {label:"Imovane", value:"zopiclone"},
                {label:"clonazepam"}, {label:"Rivotril", value:"clonazepam"},
                {label:"midazolam"}, {label:"Hypnovel", value:"midazolam"},
                {label:"macrogol"}, {label:"Movicol", value:"macrogol"},

                {label:"paracetamol"}, {label:"doliprane", value:"paracetamol"},
                {label:""}, {label:"", value:""}
            ],
            position: { my : "left top-40", at: "left bottom" },
            minLength:3
        })

        $(el).on('keydown', function(ev){
            //console.log(ev)
            let INPUT = ev.target
            if(ev.keyCode==13){ // on Enter keydown
                let command = INPUT.value.trim()
                //initialisation de l'historique de commandes
                if (!INPUT.history){
                    INPUT.history = []
                    INPUT.history.current=-1
                }
                // ajouter la commande à l'historique
                INPUT.history.unshift(INPUT.history.findIndex(el=>el==command) +1 ? INPUT.history.splice(INPUT.history.findIndex(el=>el==command), 1).join('') : command)
                if (INPUT.history.length > 20){
                    INPUT.history.pop()
                }

                let pres = command.split(" ")
                if ($("#preHeaderMarkup", SSSFrame.document.heoPane_prompt.document).is(':contains(Sélectionnez un item)') && typeof pres == "object" && pres.length > 1){
                    if (pres[0] == "mod" || pres[0] == "m") {pres.modif = pres.shift()}
                    pres.nom = DCI[pres[0]] || pres[0]
                    if (Number(pres[2])){
                        pres.dose = Number(pres[2])
                        pres.doseIndex = 2
                    } else if (Number(pres[1])){
                        pres.dose = Number(pres[1])
                        pres.doseIndex = 1
                    } else {
                        pres.dose = defaultsPres.dose[pres.nom] || ""
                        pres.doseIndex = 0
                    }
                    let poso, posoSyste
                    try{
                        poso = pres.find(el=>el.search(/[\-\.].+[\-\.]/s)+1)
                        posoSyste = poso.split('+')[0]
                        try{pres.posoSb = poso.split('+')[1]}catch(e){}
                        pres.poso = posoSyste.split('.').join('-').split("-").map(t=>Number(t))
                        pres.posoIndex = pres.findIndex(el=>el.search(/[\-\.].+[\-\.]/s)+1)
                    }catch (e){
                        pres.poso = [0,0,0,0]
                        Object.keys(frequences).filter(elm=>pres.find(el=>elm.toUpperCase()==el.toUpperCase())).forEach((el,i)=>{pres.poso = pres.poso.map((elm, j)=>elm+frequences[el][j] ? 1:0)})
                        if (Number(pres.poso.join('')) == 0){
                            pres.poso = defaultsPres.posos[pres.nom]
                        }
                    }
                    pres.forme = formes.find(el=>pres.find(elm=>elm==el)) || defaultsPres.formes[pres.nom] || "cp"
                    pres[0]=pres.nom
                    pres[1]=pres.forme
                    if(pres.poso && (pres.poso.length >= 3 && pres.poso.length <= 4) && !isNaN(pres.poso[0]) && !isNaN(pres.poso[1]) && !isNaN(pres.poso[2]) && (!pres.poso[3] || pres.poso[3] && !isNaN(pres.poso[3]))){
                        if (pres.dose && pres.doseIndex){
                            pres.poso=pres.poso.map(t=>t*pres.dose)
                            if(pres.posoSb) pres.posoSb=pres.posoSb.map(t=>t*pres.dose)
                        }
                        let i = 0
                        pres.posos=[]
                        while (!isNaN(pres.poso[i])){
                            let j = 0, addPoso = true
                            for (let j=0;j<pres.poso.length;j++){
                                if (!pres.poso[i] || (pres.posos[j] && pres.posos[j].freq[i])){
                                    addPoso = false
                                    break;
                                }
                            }
                            if (addPoso){
                                let currPoso = {dose:pres.poso[i],freq:pres.poso.map(el=>((el == pres.poso[i] ? 1 : 0)))}
                                if (pres.poso.length == 3){
                                    switch (currPoso.freq.join('-')){
                                        case "1-0-0":
                                            currPoso.freqName = "Matin"
                                            break
                                        case "0-1-0":
                                            currPoso.freqName = "Midi"
                                            break
                                        case "0-0-1":
                                            currPoso.freqName = "Soir"
                                            break
                                        case "1-1-0":
                                            currPoso.freqName = "Matin Midi"
                                            break
                                        case "1-0-1":
                                            currPoso.freqName = "Matin Soir"
                                            break
                                        case "0-1-1":
                                            currPoso.freqName = "Midi Soir"
                                            break
                                        case "1-1-1":
                                            currPoso.freqName = "Matin Midi Soir"
                                            break;
                                        default:
                                            break
                                    }
                                } else if (pres.poso.length == 4){
                                    switch (currPoso.freq.join('-')){
                                        case "1-1-1-1":
                                            currPoso.freqName = "MMS Coucher"
                                            break
                                        case "0-0-0-1":
                                            currPoso.freqName = "Coucher"
                                            break
                                        case "1-1-1-0":
                                            currPoso.freqName = "Matin Midi Soir"
                                            break;
                                        case "1-0-0-0":
                                            currPoso.freqName = "Matin"
                                            break
                                        case "0-1-0-0":
                                            currPoso.freqName = "Midi"
                                            break
                                        case "0-0-1-0":
                                            currPoso.freqName = "Soir"
                                            break
                                        case "1-1-0-0":
                                            currPoso.freqName = "Matin Midi"
                                            break
                                        case "1-0-1-0":
                                            currPoso.freqName = "Matin Soir"
                                            break
                                        case "0-1-1-0":
                                            currPoso.freqName = "Midi Soir"
                                            break
                                        case "1-0-0-1":
                                            currPoso.freqName = "Matin Coucher"
                                            break
                                        case "0-0-1-1":
                                            currPoso.freqName = "Soir Coucher"
                                            break;
                                        case "0-1-0-1":
                                            currPoso.freqName = "Midi Coucher"
                                            break
                                        default:
                                            break
                                    }
                                }
                                pres.posos.push(currPoso)
                            } else { addPoso = true}
                            i++
                        }
                        INPUT.value=pres[0]+" "+pres[1]
                        console.log(pres)
                        SSSFrame.autoEnhancedPres = pres
                        SSSFrame.autoEnhancedPresWaiter = setInterval((presc)=>{
                            if (SSSFrame.output_Selector(presc[0] + " "+presc[1], true)){
                                SSSFrame.output_Selector(presc[0] + " "+presc[1])
                                clearInterval(SSSFrame.autoEnhancedPresWaiter)
                            }
                        },250, pres)
                        //setTimeout((ev)=>
                        INPUT.keydown(ev)
                        //, 250, ev)
                        return false
                    }
                }
                INPUT.history.current = -1
                INPUT.keydown(ev)
            } else if (ev.keyCode == 38){
                if(INPUT.history.current < INPUT.history.length-1){
                    INPUT.value = INPUT.history[++INPUT.history.current]
                } else {
                    INPUT.value = ""
                    INPUT.history.current = -1
                }
            } else if (ev.keyCode == 40){
                if (INPUT.history.current > 0) {
                    INPUT.value = INPUT.history[--INPUT.history.current]
                } else {
                    INPUT.value = ""
                }
            }
        })
    }).length == 0){setTimeout(addAutoPrescriptor, 500, ev)}
}



// --------------------------- Selecteur d'horaire de prescription ------------------------------
// --------------------------- Selecteur d'horaire de prescription ------------------------------
// --------------------------- Selecteur d'horaire de prescription ------------------------------
// --------------------------- Selecteur d'horaire de prescription ------------------------------
// --------------------------- Selecteur d'horaire de prescription ------------------------------
function dateHourPres(ev){
    if (typeof datePresPicker != "undefined"){
        window.removeEventListener('mousemove', dateHourPres)
        return
    }

    let styleEl = document.createElement('style')
    styleEl.innerHTML = `
.nj-picker .nj-item {padding:0.2em!important;}
.nj-picker-container {font-size: small!important;max-width: 300px!important;min-width: 150px!important;right: 100px; bottom:3px; overflow:hidden; position: fixed;}
.nj-picker-container.labo-popup {bottom:initial;right:initial;}
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
var today = new Date(), textHourEl, textDateEl, HEO_input = window.parent.document.getElementById('HEO_INPUT')
if (!$('#dateHourPres-date', document).length){
 textHourEl = document.createElement('input')
 textDateEl = document.createElement('input')
 textDateEl.type = textHourEl.type = "text"
 textDateEl.id = textDateEl.name = "dateHourPres-date"
 textHourEl.id = textHourEl.name = "dateHourPres-time"
 textDateEl.style.display = textHourEl.style.display = "none"
 document.body.append(textDateEl)
 document.body.append(textHourEl)
} else {
 textHourEl = $('#dateHourPres-time')[0]
 textDateEl = $('#dateHourPres-date')[0]
}
var datePresPicker = new Litepicker({
 element: textDateEl,
 format: "DD/MM/YYYY",
 lang:"fr-FR",
 autoApply: true,
 startDate:(new Date()).setDate(today.getDate()+1),
 minDate: (new Date()).setDate(today.getDate()-2),
 selectForward: true,
 numberOfMonths:HEO_input ? 1:2,
 moveByOneMonth:true,
 numberOfColumns:HEO_input ? 1:2,
 onSelect: ()=>{
                if(HEO_input) {
                 HEO_input.value = textDateEl.value;hourPresPicker.show();
                }else{
                 datePresPicker.labo_input.value = textDateEl.value + " " + hourPresPicker.getValue('fullResult')
                 setTimeout(()=>{datePresPicker.show(),10})
                }
            },
 onHide:()=>{if (!HEO_input){hourPresPicker.hideTimeout = setTimeout(()=>{hourPresPicker.hide()}, 100)}},
 onShow: ()=>{
              clearTimeout(hourPresPicker.hideTimeout)
              $(datePresPicker.picker).css({top: "",left: "",right: 100,bottom: 0, overflow:"hidden", inset:"initial"})
              if (!HEO_input){
               $(datePresPicker.picker).position({at:"left bottom", my:"left top", of:$("#LABO-POPUP").parent()})
               $(hourPresPicker.container).position({at:"right bottom", my:"right top", of:$("#LABO-POPUP").parent()})
              }
          }
});
var hourPresPicker = new NJTimePicker({
    targetEl: 'dateHourPres-time',
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
  if(HEO_input){
   HEO_input.value = textDateEl.value + " " + hourPresPicker.getValue('fullResult')
  } else {
   hourPresPicker.labo_input.value = textDateEl.value + " " + hourPresPicker.getValue('fullResult')
  }
 }
}
hourPresPicker.buttons.save.innerText = "Valider"
hourPresPicker.buttons.clear.innerText = HEO_input ? "Retour" : "Effacer"
hourPresPicker.buttons.clear.onclick = ()=>{
 if(HEO_input){
  hourPresPicker.hide();
  datePresPicker.show()
 } else {
  hourPresPicker.labo_input.value = ""
  $(hourPresPicker.labo_input).parent().prev().find('input[type=checkbox]').prop("checked", false)
  if (hourPresPicker.labo_input.name == "date_labo-general"){
   $(hourPresPicker.labo_input).siblings().filter('input[type=radio][id=date_labo-now]').prop('checked', true)
  }
 }
}
hourPresPicker.buttons.close.style.display = "none"
hourPresPicker.on('show', ev=>{
 if(!HEO_input){
  if (hourPresPicker.hideTimeout) clearTimeout(hourPresPicker.hideTimeout)
  $(hourPresPicker.container).position({at:"right bottom", my:"right top", of:$("#LABO-POPUP").parent()})
 }
})
hourPresPicker.on('save', data=>{
 if (HEO_input){
  HEO_input.value = textDateEl.value + " " + hourPresPicker.getValue('fullResult')
  const ke = new KeyboardEvent("keydown", {
    bubbles: true, cancelable: true, keyCode: 13
  });
  HEO_input.dispatchEvent(ke);
 } else {
  hourPresPicker.labo_input.value = textDateEl.value + " " + hourPresPicker.getValue('fullResult')
 }
})
if (HEO_input){
 datePresPicker.show()
 $(datePresPicker.picker).css({top: "",left: "",right: 100,bottom: 0, overflow:"hidden"})
}
`
        document.head.append(dateHourScriptInit)
    } else {
        setTimeout(dateHourPres, 250)
    }
}



// --------------------------- Selecteur d'horaire de permission ------------------------------
// --------------------------- Selecteur d'horaire de permission ------------------------------
// --------------------------- Selecteur d'horaire de permission ------------------------------
// --------------------------- Selecteur d'horaire de permission ------------------------------
// --------------------------- Selecteur d'horaire de permission ------------------------------

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
    } else {
        setTimeout(permPicker, 250)
    }
}




// --------------------------- Actions rapides pour prescriptions actives ------------------------------
// --------------------------- Actions rapides pour prescriptions actives ------------------------------
// --------------------------- Actions rapides pour prescriptions actives ------------------------------
// --------------------------- Actions rapides pour prescriptions actives ------------------------------
// --------------------------- Actions rapides pour prescriptions actives ------------------------------

function monitorPresMouseOver(ev){
    if (!$ || !$.fn) {var $ = unsafeWindow.jQuery};
    if (!ev.view){ev.view = unsafeWindow || window}
    //console.log(ev.target)
    if (ev.type == "mouseover"){
        if(!$(ev.currentTarget).hasClass('currentHover_pres') && ev.view.listingPrescriptions && !$(ev.currentTarget).has('.heoSubHeader').length){
            $('tr.currentHover_pres').removeClass('currentHover_pres')
            $('#hoverMenu_pres', ev.view.document).attr('class', "").show().position({at: "right center",my:"right center", of:ev.target}) //, using:(pos,elPos)=>{
                //console.log(pos,elPos)
                //elPos.element.element.css({top:($(elPos.target.element[0].currentTarget).offset().top+2), left:pos.left+2})
            //}})
            $(ev.currentTarget).addClass('currentHover_pres')
            if ($(ev.currentTarget).has('span.heoDiscontinuedOrder').length){$('#hoverMenu_pres', ev.view.document).addClass('stopped')}
            if ($(ev.currentTarget).has('span.heldOrderMarkup').length){$('#hoverMenu_pres', ev.view.document).addClass('suspended')}
            if ($(ev.currentTarget).has('span.heoModifiedOrder').length){$('#hoverMenu_pres', ev.view.document).addClass('modified')}
        }

        // mise en forme de l'ordonnance
        if (!$('#liste_ordonnance', ev.view.document).length){
            $('#liste_ordonnance').remove()
            $('.GD42JS-DL-B:contains(Médicaments)').append('<div id="liste_ordonnance"><a><img src="" class="gwt-Image small-gwt-Image icon-ordonnance">Liste Ordonnance</a></div>')
                .find('#liste_ordonnance a').click(ev=>{
                let galeniques = ['INJ', 'CP DISPERS', 'CP', 'PDRE PR SOL BUV', 'POUDRE PR SOL BUV', 'BUV', 'GEL OPHTA', 'GEL', 'COLLYRE', 'PATCH', 'POM OPHTA', 'POMMADE', 'CREME', 'INHAL'],
                    str = "",
                    $liste_medocs_table = $(ev.target).parents('.GD42JS-DL-B').next('.GD42JS-DK-B').find('tbody tr'),
                    liste_medocs = {}
                $liste_medocs_table.each((i,el)=>{
                    if(!$(el).has('span.heoSubHeader').length){
                        let $ligne = $('td:last>.gwt-HTML', el).clone().find('subseq').remove().end()
                        let medoc = $ligne.find('b').text(),
                            galenique = galeniques.find(gal=>medoc.search(" "+gal)+1),
                            nom_medoc = medoc.substr(0, medoc.search(" "+galenique)) || medoc,
                            ligne_poso = $ligne.textContent().split(' »')[0],
                            dose = ligne_poso.split(' - ')[0].trim(),
                            frequence = ligne_poso.split(' - ')[1].trim()|| "matin"
                        galenique = medoc.substr(medoc.search(" "+galenique)+1)
                        if (galenique == nom_medoc) galenique = ""
                        if (liste_medocs[nom_medoc]){
                            if (liste_medocs[nom_medoc][galenique]){
                                if (liste_medocs[nom_medoc][galenique][dose]){
                                    liste_medocs[nom_medoc][galenique][dose] += " "+frequence
                                } else {
                                    liste_medocs[nom_medoc][galenique][dose] = frequence
                                }
                            } else {
                                liste_medocs[nom_medoc][galenique] = {}
                                liste_medocs[nom_medoc][galenique][dose] = frequence
                            }
                        } else {
                            liste_medocs[nom_medoc] = {}
                            liste_medocs[nom_medoc][galenique] = {}
                            liste_medocs[nom_medoc][galenique][dose] = frequence
                        }
                        //str += "<b>"+medoc+"</b>"
                        //str += $ligne.textContent()
                    }
                })
                console.log(liste_medocs)
                //console.log($liste_medocs_table)
                function listener(e) {
                    e.clipboardData.setData("text/html", str);
                    e.clipboardData.setData("text/plain", str);
                    e.preventDefault();
                }
                document.addEventListener("copy", listener);
                document.execCommand("copy");
                document.removeEventListener("copy", listener);
            })
        }
    } else {
        if (!$(ev.toElement).parents('tr').hasClass('currentHover_pres') && (!$(ev.toElement).parents('#hoverMenu_pres').add(ev.toElement).is("#hoverMenu_pres"))){
            $('#hoverMenu_pres', ev.view.document).hide()
            $(ev.currentTarget).removeClass('currentHover_pres')
        }
    }
}


// --------------------------- Menu contextuel ------------------------------
// --------------------------- Menu contextuel ------------------------------
// --------------------------- Menu contextuel ------------------------------
// --------------------------- Menu contextuel ------------------------------
// --------------------------- Menu contextuel ------------------------------

function monitorContextClick(ev){
    if (!$ || !$.fn) {var $ = window.document.SSSFrame.jQuery};
    if (!ev.view){ev.view = unsafeWindow || window}
    window.monitorClickEnabled = true
    if (ev.type == "contextmenu"){
        ev.preventDefault()
            if (ev.target.classList.contains("GOAX34LJHB-fr-mckesson-framework-gwt-widgets-client-resources-IconsCss-icon_arrow_refresh") ||
                ($(ev.target).has('.GOAX34LJHB-fr-mckesson-framework-gwt-widgets-client-resources-IconsCss-icon_arrow_refresh').length &&
                 (ev.target.classList.contains('GOAX34LI3-fr-mckesson-framework-gwt-widgets-client-resources-ButtonFamilyCss-fw-Button-bg') ||
                  ev.target.classList.contains('GOAX34LJ3-fr-mckesson-framework-gwt-widgets-client-resources-ButtonFamilyCss-fw-Button-borderleft') ||
                  ev.target.classList.contains('GOAX34LH3-fr-mckesson-framework-gwt-widgets-client-resources-ButtonFamilyCss-fw-Button')))){
                ev.view.parent.dispatchEvent(new Event('resize'))
            }
    } else if (ev.type == "mousedown"){
        if (ev.which == 3){
            let $patient
            if (($patient = $(ev.target).parents('.GOAX34LMRB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBodyLine')).length){
                if (!$(ev.target).parents(".GOAX34LORB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBodyLineSelected").length){
                    ev.target.click()
                }
                $.waitFor('.GOAX34LBN-fr-mckesson-clinique-application-web-portlet-gwt-context-client-resources-ListPatientRendererCss-listpatient:contains('+$('span:first',$patient).text()+')')
                .then($el=>{
                    $('#contextMenu_patients').show().position({at: "left+1 top+1",my:"left-5 top-5", of:ev})
                })
            }
        }
    }
}

String.prototype.searchI = function(searchString) {
    if (typeof "searchString" == "string"){
        return this.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(searchString.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
    } else {
        return undefined
    }
}



// --------------------------- Monitoring click souris ------------------------------
// --------------------------- Monitoring click souris ------------------------------
// --------------------------- Monitoring click souris ------------------------------
// --------------------------- Monitoring click souris ------------------------------

function monitorClick(ev){
    //console.log(unsafeWindow.document.SSSFrame.jQuery, unsafeWindow.parent.jQuery, window.parent.jQuery, window.jQuery)
    if (!$ || !$.fn) {var $ = window.document.SSSFrame.jQuery};

    if (!ev.view){ev.view = unsafeWindow||window}
    let Meva = GM_getValue('Meva',{"user":"", "password":""})
    window.monitorClickEnabled = true
    //console.log(ev.target)
    if ($('#contextMenu_patients:visible').length){
        if($('#contextMenu_patients').has(ev.target).length){
            let action = $(ev.target).text()
            if (action == "Prescriptions"){
                action = "HEO - Prescrire"
            } else if (action == "Documents"){
                action = "Gestion Documentaire"
            } else if (action == "Résultats de labo"){
                let patientIPP = $('div.GOAX34LLOB-fr-mckesson-framework-gwt-widgets-client-resources-SharedCss-fw-Label:contains(IPP)').text().split(' : ')[1].split("IPP")[0],
                patientBD = $('.GOAX34LBN-fr-mckesson-clinique-application-web-portlet-gwt-context-client-resources-ListPatientRendererCss-listpatient').text().split(" (")[2].split(')')[0].split('/').reverse().join(''),
                labo_url = 'https://serv-cyberlab.chu-clermontferrand.fr/cyberlab/servlet/be.mips.cyberlab.web.APIEntry'+
                    '?Class=Order&Method=SearchOrders&LoginName=aharry&Organization=CLERMONT&patientcode='+patientIPP+'&patientBirthDate='+patientBD+'&LastXdays=3650&OnClose=Login.jsp&showQueryFields=F'

            }
            $('div.carousel_enabled_item:contains('+action+')').click2()
        }
        $('#contextMenu_patients:visible').hide()
    }
    let $patient
    if (ev.isTrusted && ($patient = $(ev.target).parents('.GOAX34LMRB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBodyLine')).length){
        $.waitFor('.GOAX34LBN-fr-mckesson-clinique-application-web-portlet-gwt-context-client-resources-ListPatientRendererCss-listpatient:contains('+$('span:first',$patient).text()+')')
            .then($el=>{
            if ($('div.carousel_disabled_item').length){
                ev.target.click()
            }
        })
    } else if ($(ev.target).parents('#hoverMenu_pres').length){
        let action = $(ev.target).parent('span').addBack().attr('action'), act, currPres = $(".currentHover_pres",ev.view.document)[0].innerText.trim().split("...")
        currPres=(currPres.length-1) ? currPres[0] : currPres.join("...")
        //console.log($(".currentHover_pres b",ev.view.document).text(), ev.view.listingPrescriptions, ev.view.listingPrescriptions[$(".currentHover_pres b",ev.view.document).text()])
        if (currPres.search(' CET')+1){
            currPres = currPres.split(" CET")[0].split(" ; début le ").join(" »")
        }
        currPres = ev.view.listingPrescriptions[currPres]
        if (currPres){
            act="http://meva/heoclient-application-web/commander?HEOCMD=@"+action.split('-')[0]+"="+currPres.id+(action == "DCAO-0" ? ",0" : "")
            //console.log(act, currPres)
            ev.view.document.pcFrame.location=act
        }
        $('#hoverMenu_pres').hide()
    } else if (ev.target.classList.contains('GD42JS-DPOB') || ev.target.classList.contains('GD42JS-DLOB')){
        if (!$('#HEO_POPUP.force_hidden', ev.view.document).removeClass('force_hidden').length){
            $('a.GD42JS-DFXB', ev.view.document).click2()
        }
    } else if (ev.target.classList.contains('GOAX34LOXB-fr-mckesson-incubator-gwt-widgets-client-resources-FuzzyDateCss-field_without_error')){
        ev.target.parentElement.nextElementSibling.click()
        ev.target.lastValue = ev.target.value
        ev.target.dateWaiterStart = Date.now()
        ev.target.dateWaiter = setInterval((el)=>{
                //console.log(el, el.lastValue, el.value)
            if ((Date.now() - el.dateWaiterStart) > 15000){
                clearInterval(el.dateWaiter)
            }else if (el.lastValue != el.value){
                el.lastValue = el.value
                ev.view.document.querySelector('button.GOAX34LH3-fr-mckesson-framework-gwt-widgets-client-resources-ButtonFamilyCss-fw-Button').click()
            }
        },500,ev.target)
    } else if ($('.GOAX34LECB-fr-mckesson-framework-gwt-widgets-client-resources-FormFamilyCss-fw-FormField-mandatory:visible', ev.view.document).has($(ev.target)).length && ev.target.classList.contains('gwt-Image')){
        // click sur icone calendrier du jour
        if (ev.target.title=="Aujourd'hui"){
            $('.GOAX34LLXB-fr-mckesson-incubator-gwt-widgets-client-resources-FuzzyDateCss-calendar_arrow', ev.target.parentElement).click2()
            $.waitFor('div.datePickerDayIsToday', ev.view.document).then($el=>{
                if ($el.hasClass('datePickerDayIsValue')){
                    $el.up().prev().children().click2()
                    $(ev.target).click2()
                }else{
                    $el.click2()
                    $.waitFor('div.GOAX34LLLB-fr-mckesson-framework-gwt-widgets-client-resources-PanelFamilyCss-fw-BlockMaskTextDiv', ev.view.document).then($el2=>{
                        $('button.GOAX34LH3-fr-mckesson-framework-gwt-widgets-client-resources-ButtonFamilyCss-fw-Button', ev.view.document).click2()
                    })
                }
                //
            })
        } else {
            $('button.GOAX34LH3-fr-mckesson-framework-gwt-widgets-client-resources-ButtonFamilyCss-fw-Button', ev.view.document).click2()
        }
    } else if ((ev.isTrusted) && $(ev.target).parents('.GOAX34LOBB-fr-mckesson-framework-gwt-widgets-client-resources-FormFamilyCss-fw-DatePicker').length){
        $.waitFor('div.GOAX34LLLB-fr-mckesson-framework-gwt-widgets-client-resources-PanelFamilyCss-fw-BlockMaskTextDiv', ev.view.document).then($el2=>{
            $('button.GOAX34LH3-fr-mckesson-framework-gwt-widgets-client-resources-ButtonFamilyCss-fw-Button', ev.view.document).click2()
        })
    } else if (ev.target.title == "HEO - Prescrire"){
        addAutoPrescriptor(ev)
        let SSSFrame = window.top.SSSFrame || window.top[0]
        delete SSSFrame.autoEnhancedPres
        delete SSSFrame.nouvellesConsignes
        delete SSSFrame.listingConsignes
        delete SSSFrame.listePresLabo
    } else if (ev.target.innerText == "AHARRY"){
        ev.view.document.querySelector("input[name='mevaLockSessionWindowPwField']").value=Meva.password
        ev.view.document.querySelector("span.GG-W0PSBMCB-fr-mckesson-framework-gwt-widgets-client-resources-IconsCss-icon_accept").click()
    } else if (ev.target.classList.contains('stackItemMiddleCenterInner') && !ev.target.classList.contains('CleanGroupsButton') && ev.target.innerText == "Groupé par"){
        ev.target.classList.add('CleanGroupsButton')
        $('label:contains("Plannings"):eq(0)', ev.view.document).parent().after($('<div><button id="CleanGroupsByButton" style="margin-left:50px;background:#528fff;">Effacer</button></div>'))
    } else if (ev.target.id == "CleanGroupsByButton"){
        // permet d'effacer le mauvais affichage de la liste des patients
        //let repaired_NZb = `nzb = NZb;NZb = function(a){let b = a;try{b = JSON.parse(a);b.groupsBy = [];b = JSON.stringify(b)}finally {console.log(a, b);return nzb(b)}}`
        let repaired_b$b = `function b$b(a){var b;b=new Zjf;e$b(b,dGf+a.n);e$b(b,dGf+a.k);c$b(a,b);Ujf(b,a.b.b.b);let c = b.b.b.split('|'), d=JSON.parse(c[15]);d.groupsBy=[];c[15]=JSON.stringify(d);console.log(c);return c.join('|')}`
        $('iframe').filter('#fr\\.mckesson\\.clinique\\.application\\.web\\.portlet\\.gwt\\.ClinicalGWTPortal')
            .each((i,el)=>{
                let script = el.contentDocument.createElement('script')
                script.innerHTML = repaired_b$b
                el.contentDocument.body.append(script)
            }
        )
        $('<div style="position:absolute;width:100%;height:100%;top:0;left:0;background:#000;opacity:0.5;">')
            .appendTo($('.GOAX34LHSB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridMenuPopup', ev.view.document))
    } else if ($(ev.target).parents('#CONSIGNES-POPUP').length){
        if ($(ev.target).parents("tbody").length){
            if ($(ev.target).is('input[type=radio]')){
                if ($(ev.target).parents('tr:not(.consigne-deplacements-restriction)').length){
                    $(ev.target).parents('tr').removeClass('consigne-restreint consigne-interdit consigne-autorise').addClass('consigne-'+$(ev.target).attr('consigne'))
                }
                $(ev.target).filter('input[name=deplacements]').each((i,el)=>{
                    let restriction_deplacement = $(ev.target).is('[consigne=restreint]')
                    $(el).parents('tr').next()[(restriction_deplacement ? 'add':'remove') + 'Class']('consigne-restreint')
                    $(el).parents('tr').children('td:first').attr("rowspan",(restriction_deplacement ? 2:1))
                })
            } else if ($(ev.target).filter('td').length){
                $('input[type=radio]', ev.target).click2()
            }
        } else {
            if ($(ev.target).is('label[for="Mode_hospit-SSC"]') || $(ev.target).is('#Mode_hospit-SSC')){
                $(ev.target).parents('tr').addClass('consigne-restreint')
            } else if ($(ev.target).is('label[for="Mode_hospit-SL"]') || $(ev.target).is('#Mode_hospit-SL')){
                $(ev.target).parents('tr').removeClass('consigne-restreint')
            }
        }
    } else if ($(ev.target).is('span.GD42JS-DO5:contains("Fermer")')||$(ev.target).is('span.GD42JS-DO5:contains("Signer")')){
        let SSSFrame = window.top.SSSFrame || window.top[0]
        $.waitFor('div.GD42JS-DPOB[style*="visibility: hidden"]', SSSFrame.document).then($el=>{
            $el.show()
            $('#HEO_POPUP', SSSFrame.document).removeClass('force_hidden')
            $('.full_bg', SSSFrame.document).hide()
        })
    } else if ($(ev.target).is('span.GD42JS-DO5:contains(Oups)') || $(ev.target).is('span.GD42JS-DO5:contains(Outlines)')){
        let SSSFrame = window.top.SSSFrame || window.top[0]
        delete SSSFrame.autoEnhancedPres
        delete SSSFrame.nouvellesConsignes
        delete SSSFrame.listingConsignes
        delete SSSFrame.listePresLabo
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
