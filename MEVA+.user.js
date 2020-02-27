// ==UserScript==
// @name         MEVA+
// @namespace    http://tampermonkey.net/
// @version      0.2.29
// @description  Help with MEVA
// @author       Me
// @match        http*://meva/*
// @include      http*://serv-cyberlab.chu-clermontferrand.fr/cyberlab/*
// @downloadURL  https://github.com/DienH/Tampermonkey/raw/master/MEVA%2B.user.js
// @require      https://code.jquery.com/jquery.min.js
// require      https://cdn.jsdelivr.net/gh/DienH/Tampermonkey@master/Dien.js
// require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/3.16.2/math.js
// @resource     DienJS https://raw.githubusercontent.com/DienH/Tampermonkey/master/Dien.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// ==/UserScript==


(function() {

    var µ = unsafeWindow
    var log = console.log
    if (location.href.search("serv-cyberlab.chu-clermontferrand.fr")+1){
        let $
        if (!$ || !$.fn) {$ = µ.jQuery || window.jQuery };
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
        $('#SSSFrame').load((ev)=>{
            let SSSFrame = ev.target.contentWindow.name == "SSSFrame" ? ev.target.contentWindow : document.getElementById('SSSFrame').contentWindow

            $(SSSFrame).resize((ev)=>{
                let SSSFrame = ev.target.name == "SSSFrame" ? ev.target : document.getElementById('SSSFrame').contentWindow
                setTimeout(()=>{
                    $(`.GDKHHE1PTB-fr-mckesson-meva-application-web-gwt-preferredapplications-client-ressources-RessourcesCommunCss-carousel  div.carousel_enabled_item:contains("Consultation d'anesthésie")`, SSSFrame.document).remove()
                }, 500)
            })
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
    } else if (location.href.search("errorLoadContext.jsp")+1){
        $('a[target*=_top]:contains(Recharger)', document).click2()
    }else if (location.href.search("quitteSession")+1){
        $.waitFor('div.gwt-Label:contains(Cliquez ici)', document).then(el=>el.click2())
    }else if (location.href.search("Hospitalisation.fwks")+1 || location.href.search("m-eva.fwks")+1){
        let SSSFrame = window, SSSFrame_wait = setInterval(()=>{
            let state = 0, CS_AnestTitle = (`.GDKHHE1PTB-fr-mckesson-meva-application-web-gwt-preferredapplications-client-ressources-RessourcesCommunCss-carousel  div.carousel_enabled_item:contains("Consultation d'anesthésie")`)
            if ($(CS_AnestTitle).length){
                $(CS_AnestTitle).remove()
            }
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
            if (!$('#contextMenu_patients', SSSFrame.document).length){
                $('body', SSSFrame.document).append($(`
<ul id="contextMenu_patients">
  <li><div><img src="/heoclient-application-web/icon/heo_blue_32.png" class="gwt-Image">Prescriptions</div></li>
  <li><div><img src="/m-eva-resourcestatic/icons/produits/xway/acte_32.png" class="gwt-Image">Observations</div></li>
  <li><div><img src="/m-eva-resourcestatic/icons/produits/web/pancarte_medicale_32.png" class="gwt-Image">Synthèse</div></li>
  <li><div><img src="/m-eva-resourcestatic/icons/produits/xway/labo_32.png" class="gwt-Image">Résultats de labo</div></li>
  <li><div><img src="/m-eva-resourcestatic/icons/produits/application.png" class="gwt-Image">PACS</div></li>
  <li><div><img src="" class="gwt-Image icon-ordonnance">Ordonnance</div></li>
  <li><div><img src="" class="gwt-Image icon-documents">Documents</div></li>
</ul>
`).menu().hide())
            }
            if(!$('#hoverMenu_pres', SSSFrame.document).length){
                $('#workbody', SSSFrame.document).append($(`
<div id="hoverMenu_pres">
  <span title="Modifier"><img src="/heoclient-application-web/images/pencil.png" class="gwt-Image"></span>
  <span title="Arrêt immédiat"><img src="/heoclient-application-web/images/stop.png" class="gwt-Image"></span>
  <span title="Arrêt programmé"><img src="/heoclient-application-web/images/time_delete.png" class="gwt-Image"></span>
  <span title="Suspendre"><img src="/heoclient-application-web/images/control_pause_blue.png" class="gwt-Image"></span>
  <span title="Annuler arrêt & modifications"><img src="/heoclient-application-web/button/arrow_undo.png" class="gwt-Image"></span>
  <span title="Reprendre"><img src="/heoclient-application-web/images/control_play_blue.png" class="gwt-Image"></span>
</ul>
`).hide())
            }
        }, 2000)

        if (!document.getElementById('SSSFrame_MevaStyle')){
            $('<style id="SSSFrame_MevaStyle">', document).html(`
#HEO_POPUP.GD42JS-DKXB .dialogMiddleCenter {background:#F5F5F5;}
#DIEN-POPUP table, #DIEN-POPUP td, #DIEN-POPUP th {border: 1px solid black;border-collapse: collapse;font-size:14px;}
#DIEN-POPUP tr:not(.pres-consignes-deplacements-restriction) {border: 2px solid black;border-collapse: collapse;}
#DIEN-POPUP tr.pres-consignes-deplacements.pres-consignes-restreint {border-bottom: 0px solid white;}
#DIEN-POPUP tr.pres-consignes-deplacements-restriction.deplacements-restreints {border-top: 0px solid white;}
#DIEN-POPUP table {width:100%;}
#DIEN-POPUP table td+td {text-align:center;}
#DIEN-POPUP [contenteditable][placeholder]:empty:before {content: attr(placeholder);color: #aaa;font-style:italic;}
#DIEN-POPUP [contenteditable][placeholder]:empty:focus:before {content: "";}
#DIEN-POPUP .pres-consignes-restreint [contenteditable][placeholder]:empty:before {color: #a22;font-style:initial;}
#DIEN-POPUP .pres-consignes-restreint [contenteditable][placeholder] {color: #a22;font-style:initial;}
#DIEN-POPUP .pres-consignes-restreint [contenteditable][placeholder] {color: #111;font-style:initial;}
#DIEN-POPUP [contenteditable][placeholder] {color: #aaa;font-style:italic;}
#DIEN-POPUP tr.pres-consignes-deplacements-restriction {display:none}
#DIEN-POPUP tr.pres-consignes-deplacements-restriction.deplacements-restreints {display:table-row;}
#DIEN-POPUP td.pres-consignes-restreint.deplacements-restreints {border-bottom:1px solid white;}
#DIEN-POPUP .pres-consignes-deplacements-restriction td[colspan] {border-top:1px solid white;}
#DIEN-POPUP .pres-consignes-deplacements-restriction td[colspan] input:first-child {margin-left:141px;}
#DIEN-POPUP tr.pres-consignes-deplacements-restriction input+label {margin-right:25px;}
.ui-widget-content .ui-state-default.ui-button-validate {background:#090;color:#fee;}
div.ui-dialog[aria-describedby="DIEN-POPUP"] .ui-dialog-titlebar-close .ui-button-icon-primary {background-image:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB8ElEQVR42p2Sb0/TUBTGiYlJ41cwkcXwRq5mUdQ36LqKsDlQJ8rY//8MZGyjrNlSmKv6QhM/id9qMSESxK3KoN262z3ezhhdtkrgJCc5ycnv3PM8505MnDOQy12xb5bLk6hWiV2/m1gjnWi0pAfCLht4F/2KDIgiGYUTpJPKoruxibb/5ef24osbIzDq79BnaYoSuvk8GYITafQKJaBWh1WrHl8JinLp9wBF4fqiZPZ33wAfP8GUa+i93oK18gCOp2BsFQHW1xMp/Fh4QjEzc3lYQlLhaL5ITakKvP8AWq6gk85CjyVhbBYAeW9Qq/Ne2nC7ufEmJpNcN5OjvcI2k/MW2KszsAZUZejRONTHHnv43yFaOGZCZnIicSAYAaQK1LkF80zYinYoQfRIDLCuEQgBr1aB7R2m24vm7Cw5Aw4RLRyFkV0HdiQGloEik8MM1FdW0XrI48DpJPZwKAIjk2P/QIIWDKMlzNHvD1zmyVM/sL6B02d+HN29j4PpaTIKM61Geo29KkJjq7fcjwaGWXl45x49nvcA6QxOvD4c3nLiy7Wpv0Pay8vCaSAII5WBthJEkxeG3G443NxXcpP+5AVoviV8c97G/tVJYWgL1bMoHC89R9PFj3W74XBw+9en6Fj4TxzxvPC/Uw2G2MEXjV//kEpgRFM89AAAAABJRU5ErkJggg==");
background-position:initial;}
#contextMenu_patients {position:fixed!important;}
#contextMenu_patients.ui-menu .ui-menu-item-wrapper {padding:8px;}
#contextMenu_patients.ui-menu .ui-menu-item {padding:0;}
#contextMenu_patients .gwt-Image {width: 16px;transform: translateY(3px);padding-right: 8px;margin-top: -5px;}
#contextMenu_patients .gwt-Image.icon-documents {content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMxSURBVDhPdZLrT1N3GMc7txcmlhcmUxPj2y1LTMxeLBpJTP8CE0tGdJE4EyVLUGMr4WaBjgrCzKCOoiBooUaglhZaioXTUnrh9OZpexwtp/eW0QsdUEmIGpeFfXcoJsaAT/K8+SXPJ9/Lj6PvKev1qCs9zLTAwMwIBsOEsC0xV10VN9eWJaw1Z/6arz2e8zccAofzBWevmVVcou0jV+DTCRDzjiLhUyLm6t+K2Dr/CVtaNxmjKB+xNslDIbJEDOz7cPZxkjYRnbQ1wquvQ2SRQjKVwkp+BYXCKjYKebxeW8bGenp98+07Q279zSUAnypZsjfSec8dZJwtoG1yjI8/h2ZiAnNWK3x+Gn6aBhMKY2l5GauFTdkuQGKunl5xtSBLNiFirAY53QOVZhzE7Bwo+k+4KR9eBRmEonGkVzd2A+LmOjrr/BXpeRGihABWXRv6ngxCPfkCdg8Fu5sCtRDEYiyJVP6zADEyLCBmEsKm70Dv4FPojBa4AyE4/AE46ACoxQjCmcJeFhrovFtStJAw18CobkG7VAa5UoMZ0lNcC/UKrmAEgfTabsCSbSfEnKP5A0CCNhYwMKrBlN0NncUBg4OC2bsAf2r1cwAJcs5mxIxCGJRNEN/rQj+rwOD0Yoo9nvUFQTJJeFNr3XtYqKdzbAuZ7RZmboJQidF+/w+oXhB4GU7AxcSK64kuwewPyTicA0fYsxJ2dz4VC/Bvh1hswSiAcYzN4H43hrVTIBfCcAbCoJgomOXcf3KleuyHU6cufHfixLfl5eVfFgFJa4Mp69hpIW66BULTirYHA3g2Y8eUN44JVwimYAauaBrdfQPvleqJtHcxMk1HUiL5sP4bToZsOf23R2LOkKJ/k2yIWkXtlvB281ZX/xDkKh0qKq/jp6vX8IugDk2SuxhVa6E32QqqSaJD/JvsaFHFGik+mp0X3YvPVr/WPqqkz52v+F06pHysmDQ5Oh4psvV3pe8qhQ0rl69WEd2yPmLgscI9olRrpdKe74uA7UlZft4fJW78aBq63Mjlcr/m8Xhf1bc/PNg1ojv+QGk4e7uz92RpaWkJ+87l8/mH+RcvHuPxeNz/AX7dZzZ5DoFPAAAAAElFTkSuQmCC)}
#contextMenu_patients .gwt-Image.icon-ordonnance {content:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIbSURBVDhPY6AqEF/3yExszaMasXUP6sTWPqoVW/PQheH/f0aoNE7AKGkdKidjEWImWTw7T7xt40IYFqtcXCVtHWYhaxWuzFBfzwRVjwrk7UMlpCxD9ktZhLzHhaUtgs9L2YSrQbWgAgnzcE2gomfSliH/cWKLkE+SVsG2UC2oAGYAEP+Qsgx+AnTNLSD9C4h/AjX+lrYM/kuMAU+BinYCFU8GOvcG0NZV0hZBc6UsgvcCxe4D+R8JugCo8AtQ4Wugzd9AtgNd8gPuAsuQR1Kx1S7ia++IMdT/Rw1MJBfcBOLNQPZxoAGXgPQpoAvuAA16LJXaNUds1Z1TwGg9I7LmsRcDA1LUIgXiWaDibSD/Am09A8SHgezrUpahJ8Rnn9kgtvbhfzBec3+V1qorbFDtSAaAFAP9DLIRGA5/gPzfQPqvtFXoNdF559aLrXnwEYxX318jk9wrBE8XSGFwRNIiJBmo8RzQoNVAGhKIViHbxaYfqwNqXgi0vVt8/qU8KeuImUD5dAbjNFa4AUB/Pwcacg/olTeggATa/gUo/kPaMvSK2Nzz24HO/yu69sFdscXXVkjbRq0EGn5ZwjJInkHMJkgJqPAOUCPWRAT00jPx7u0LRdc+/A404Jv49GOLpKzDZgHlGiVsQkQZjIHOAOaDQKAh9UAXNKBjoGtqpYJLnUXXPYwHZrJU8dRuc6BXc0D5BxgCBDMaAcDAAABTEhAox93HNQAAAABJRU5ErkJggg==)}
#hoverMenu_pres {position:fixed;}
#hoverMenu_pres span {cursor:pointer;}
#hoverMenu_pres span[title="Reprendre"] {display:none}
#hoverMenu_pres.suspended span {display:none}
#hoverMenu_pres.suspended span[title="Reprendre"], #hoverMenu_pres.suspended span[title="Reprendre"] {display:block}
`).appendTo('body')
        }
        if (!SSSFrame.document.getElementById('SSSFrame_Script')){
            let script = document.createElement('script')
            script.id = "SSSFrame_Script"
            script.innerHTML = `
String.prototype.searchI = function(searchString) {
 return this.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(searchString.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
}
$.expr[":"].containsI = function (a, i, m) {
 return (a.textContent || a.innerText || "").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(m[3].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))>=0;
};
` + output_Selector.toString() + autoPresConsignesRapides.toString() + currentPres_Selector.toString()
            SSSFrame.document.body.append(script)
        }
        $.waitFor('#workbody', SSSFrame.document).then($el=>$el.log().on('mouseover', '.GD42JS-DJYB.GD42JS-DJ-B tr', monitorPresMouseOver))

    }else if (location.href.search("initSSS")+1){
        if (!window.monitorMouseMove) window.addEventListener('mousemove', clickLogin)
        //setInterval(()=>{if (document.querySelector("#div-quitteSession")){document.querySelector("#div-quitteSession div").click()}}, 500)

        //$('.GOAX34LJRB-fr-mckesson-framework-gwt-widgets-client-resources-TableFamilyCss-fw-GridBodyGroupLine').remove()

    } else if ((location.href.search('heoOutput.jsp')+1)){
        let SSSFrame = window.parent
        $('body', document).append($('<style>').text(`
.presPsy-rapide {position: absolute;right: 0;color: green!important;}
.presPsy-rapide:hover {text-decoration:underline;}
`)).append($('<script>').text(presOutputConsignesRapides.toString()))
        $.waitFor('div.outlineTitle', document).then(el=>{
            switch(el.text().trim()){
                case "Prescriptions Usuelles de Psychiatrie Adulte":
                    //$('button.GD42JS-DO5:contains(Oups)', SSSFrame.document).attr('disabled', true)
                    $('a:contains("Retourner à la liste")', document).remove()
                    $('a:contains("Consignes")', document).contextmenu(ev=>{ev.preventDefault();presOutputConsignesRapides(ev);}).before($('<a class="presPsy-rapide">Consignes rapides</a>').click(presOutputConsignesRapides))
                    $('a:contains("Sorties Temp")', document).contextmenu(ev=>{ev.preventDefault();presOutputConsignesRapides(ev);}).before($('<a class="presPsy-rapide">Permission rapide</a>').click(presOutputConsignesRapides))
                    if (SSSFrame.listeConsignes){
                        if (SSSFrame.listeConsignes.done){
                            SSSFrame.listeConsignes = ""
                        } else {
                            if (SSSFrame.listeConsignes.phase = 1){
                                SSSFrame.output_Selector(1)
                            }
                        }
                    }
                    break
                case "Consignes d'Hébergement":
                    $('button.GD42JS-DO5:contains(Oups)', SSSFrame.document).attr('disabled', false)
                    log(SSSFrame.listeConsignes)
                    if (SSSFrame.listeConsignes){
                        if (SSSFrame.listeConsignes.done){
                            SSSFrame.listeConsignes = ""
                        }else {
                            SSSFrame.listeConsignes.done=true
                            Object.keys(SSSFrame.listeConsignes).forEach(cons=>{
                                if (typeof SSSFrame.listeConsignes[cons] == "object" && !SSSFrame.listeConsignes[cons].done){
                                    if (SSSFrame.listeConsignes[cons].consigne != "autorise"){
                                        SSSFrame.listeConsignes.done=false
                                        if (SSSFrame.listeConsignes[cons].changeComment){
                                            SSSFrame.currentPres_Selector([cons, SSSFrame.listeConsignes[cons].consigne])
                                        }else{
                                            SSSFrame.output_Selector([cons, SSSFrame.listeConsignes[cons].consigne])
                                        }
                                        return false
                                    } else {
                                        SSSFrame.listeConsignes[el].done=true
                                    }
                                }
                            })
                        }
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
                    break
            }
        })
    } else if ((location.href.search("popupContents.jsp")+1)){
        let styleEl = document.createElement('style'), title, pres, SSSFrame = window.parent
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
                case "":
                        //log(SSSFrame.listeConsignes)
                    // Fenetre Arrêt / Suspension de prescription
                    if (SSSFrame.listeConsignes){
                        Object.keys(SSSFrame.listeConsignes).forEach(el=>{
                            $('tr[id="Nursing"][name^="Gestion"]', document).log()
                                .filter((i,elm)=>($(elm).a('name').searchI(el)+1) && !($(elm).a('name').split(" : ")[1].searchI(SSSFrame.listeConsignes[el].consigne)+1)).log()
                                .find('input').click2()
                        })
                        SSSFrame.consignesWaiter = SSSFrame.setInterval(()=>{
                            if (!$('#HEO_POPUP', SSSFrame.document).is(':visible')){
                                SSSFrame.autoPresConsignesRapides(SSSFrame.listeConsignes)
                            }
                        },250)
                        if ($('input:checked', document).length){
                            $('#playbackOrders', document).click2()
                        } else {
                            $('#HEO_POPUP a.GD42JS-DKWB', window.parent.document).click2()
                        }
                    } else if ($('tr[id="Other Investigations"][name*="temporaire en cours"] input', document).click2().length){
                    }
                    break
                default:
                    // prescription rapide de médoc
                    if ((pres = window.parent.autoEnhancedPres) && $("p.Titre:containsI("+pres[0]+"):containsI("+pres[1]+")", document).length){
                        $("#frequence>option[value='"+pres.posos[0].freqName.toUpperCase()+"']", document).each((i,el)=>{el.selected=true})
                        $("#PosoSimple", document)[0].click()
                        $("#DoseSimple", document).val(pres.posos[0].dose)
                        pres.posos.shift()
                        if (!pres.posos){window.parent.autoEnhancedPres = ""}
                        $('#btPrescrire')[0].click()
                    }
                    break;
            }
        }
        if ($('#modif_action', document).length){
            if (SSSFrame.listeConsignes){
                let [consigne, autorisation] = $('b:eq(0)', document.body).text().split(' : ')
                if (autorisation){
                    consigne = consigne.split(" ")[2].toStringI().toLowerCase().log()
                    autorisation = autorisation.split(" ")[0].toStringI().toLowerCase().log()
                    if (SSSFrame.listeConsignes[consigne].consigne == autorisation){
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
                    $('#HEO_POPUP #ZonePopupBoutons span.GD42JS-DP5:contains("OK")', SSSFrame.document).click2()
                } else if (document.body.innerText.search('Les prescriptions en mémoire')+1){
                    $('input[name=OK]', document).click2()
                }
                break
        }
    } else if (location.href.search("docs/dc.htm")+1){
        let SSSFrame = window.parent
        switch ($('h1',document).text()){
            case "Arrêter/Suspendre/Reprendre":
                if (SSSFrame.listeConsignes){
                    $('button:contains("Arrêter ces prescriptions")', document).click2()
                }
                break
        }
    } else if (location.href.search("heoPrompt.jsp")+1){
        let SSSFrame = window.parent, heoOutputFrame = SSSFrame.document.heoPane_output
        const ke = new KeyboardEvent("keydown", {bubbles: true, cancelable: true, keyCode: 13});
        if (document.getElementById('preHeaderMarkup')){
            let promptTitle = document.getElementById('preHeaderMarkup').innerText, pres
            $.waitFor('.orderName', heoOutputFrame.document).then($el=>{
                if ((pres = window.parent.autoEnhancedPres) && $el.filter('.orderName:containsI("'+pres.nom+'"):containsI("'+pres.forme+'")').length){
                    switch (promptTitle){
                        case "Dose par prise:":
                            $('[id="preMultiChoiceMarkup"]:contains("'+pres.posos[0].dose+'")', document).click2() //.each((i,el)=>el.click())
                            break;
                    }
                } else if ($el.filter('.orderName:contains("INFORMATION SUR LE PATIENT")').length){
                    $('#HEO_INPUT', SSSFrame.document).each((i,el)=>setTimeout(elm=>{let a = new Date();elm.value=a.toLocaleDateString()+" "+a.toLocaleTimeString([], {timeStyle: 'short'})}, 250, el))
                } else if ($el.filter('.orderName:contains("Isolement : Indication")').length){
                    switch (promptTitle){
                        case "Interventions alternatives tentées:":
                            $('a[onclick]:contains("(_)"):not(:contains("5")), a[onclick]:contains("ENTREE")', document).click2()
                            break
                        case "Indication Isolement:":
                            $('a[onclick]:contains("(_)"):contains("Prévention")', document).log().click2()
                            break
                        case "Absence de contre-indication à l'isolement:":
                            $('a[onclick]:contains("(x)"):contains("Absence de CI")', document).each(()=>$('a[onclick]:contains("ENTREE")', document).click2())
                            break
                        case "Présence Soignants Renfort / Soins:":
                        case "Examen somatique réalisé :":
                        case "Présence Soignants Repas:":
                        case "Présence Soignants Soins Hygiène:":
                        case "Oreiller Standard:":
                            $('a[onclick]:contains("OUI")', document).log().click2()
                            break
                        case "Matelas:":
                            $('a[onclick]:contains("STANDARD")', document).click2()
                            break
                        case "Objets Autorisés:":
                        case "Vêtements Autorisés:":
                        case "Mobilier Autorisé:":
                            $('#HEO_INPUT', SSSFrame.document).each((i,el)=>setTimeout(elm=>{elm.value="AUCUN"}, 750, el))
                            break
                        case "Visites:":
                            $('a[onclick]:contains("RESTREINT")', document).click2()
                            break
                    }
                } else if ($el.filter('.orderName:contains("Mise en Isolement")').length){
                    switch (promptTitle){
                        case "Mode d'Hospitalisation:":
                            $('a[onclick]:contains("(x)")', document).each(()=>$('a[onclick]:contains("ENTREE")', document).click2())
                            break
                        case "Information Mise en Isolement:":
                            $('a[onclick]:contains("Patient"):contains("(_)")', document).click2()
                            break
                    }
                } else if (SSSFrame.listeConsignes && $el.filter('div.orderName:contains(Gestion)').length){
                    let currConsigne, currConsigneA
                    switch(promptTitle){
                        case "Sélectionnez un item dans la liste":
                            break
                        case "Circulation du Patient:":
                            switch (SSSFrame.listeConsignes.deplacements.restriction){
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
                            SSSFrame.listeConsignes[currConsigne].done=true
                            $('#HEO_INPUT', SSSFrame.document).val(SSSFrame.listeConsignes[currConsigne].comment)[0].dispatchEvent(ke);
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
            }
        }
    }
})();

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
function output_Selector(sel, checkExists = false){
    if (typeof $ == "undefined" || typeof $.fn == "undefined"){var $ = window.$ || window.parent.$}
    let output = document.heoPane_output || window.parent.document.heoPane_output,
        MedocPasHorsLivret = ["diazepam", "olanzapine"]
    if (!sel){sel = "Retourner"}
    let filterString = "", pasHorsLivret = false
    if (typeof sel == "string" && sel.search(" ")+1){
        sel = sel.split(" ")
        for (let i = 0; i < sel.length ; i++){
            if (MedocPasHorsLivret.includes(sel[i])){
                pasHorsLivret = true
            } else {
                filterString += ":containsI("+sel[i]+")"
            }
        }
    } else if (Array.isArray(sel)){
        for (let i = 0; i < sel.length ; i++){
            if (MedocPasHorsLivret.includes(sel[i])){
                pasHorsLivret = true
            } else {
                filterString += ":containsI("+sel[i]+")"
            }
        }
    }

    sel = 'a'+(typeof sel == "string" ? ':containsI('+sel+')' : (typeof sel == "number" ? '[onclick*='+sel+']:first' : filterString))
    if (checkExists){
        return ($(sel, output.document.body).length > 0 ? true : false)
    }else{
        setTimeout((selector, out)=>{
            let $selection = $(selector, out.document)
            if ($selection.length > 1){$selection = $selection.filter(pasHorsLivret ? ":not(:has(.HorsLivret))":"*")}
            $selection.each((i,el)=>{if (!i){setTimeout((el)=>{el.click()},250, el)}})
        }, 250, sel, output)
    }
}

function autoPresConsignesRapides(consignes){
    if (!$ || !$.fn){var $ = (typeof unsafeWindow != "undefined" ? unsafeWindow.$ || unsafeWindow.parent.$ : window.$ || window.parent.$)}
    let currentConsignes = {
        affaires:{consigne:"autorise", comment: ""},
        appels:{consigne:"autorise", comment: ""},
        deplacements:{consigne:"autorise", comment: ""},
        tabagisme:{consigne:"autorise", comment: ""},
        vetements:{consigne:"autorise", comment: ""},
        visites:{consigne:"autorise", comment: ""}
    }
    $('div.gwt-HTML:contains("Gestion")','#workbody').each((i,el)=>{
        let currConsigne = $(el).find('b').text(),
            currConsigneA = currConsigne.split(" : "),
            commentConsigneA = $(el).textContent().split(" - "), commentConsigne = commentConsigneA.find(el=>(el.search(' »')+1 && !(el.search('Planifi')+1))) || ""
        currConsigne = currConsigneA[0].split(" ")[2].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        if(commentConsigne){
            commentConsigne = commentConsigne.split("  »")[0]
        }
        currentConsignes[currConsigne] = {
            consigne:(currConsigneA[1].search("Restreint")+1 ? "restreint":(currConsigneA[1].search("Interdit")+1 ? "interdit":currConsigneA[1].search("Accompagné")+1 ? "accompagne":"autorise")),
            comment:commentConsigne}
    })
    if (consignes){
       if(!consignes.phase){
            consignes.phase = 1
       } else {
            consignes.phase = 1
        }
    } else {
        return currentConsignes
    }
}
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
        if(!$('#DIEN-POPUP', SSSFrame.document).dialog('open').length){
            $('#DIEN-POPUP', SSSFrame.document).dialog('destroy').remove()
            $('<div id="DIEN-POPUP"></div>', SSSFrame.document).append(`
<table>
 <thead>
  <tr>
   <th style="width:150px">Consigne</th>
   <th style="width:80px">Autorisé</th>
   <th style="width:80px">Interdit</th>
   <th style="width:80px">Restreint</th>
   <th>Commentaire</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>Appels</td>
   <td><input type="radio" name="appels" consigne="autorise"></td>
   <td><input type="radio" name="appels" consigne="interdit"></td>
   <td class="pres-consignes-restreint"><input type="radio" name="appels" class="pres-consignes-restreint" consigne="restreint"></td>
   <td><div contenteditable name="appels-com" placeholder="Nombres d'appels ? Destinataires ?"/></td>
  </tr>
  <tr class="pres-consignes-deplacements">
   <td>Déplacements</td>
   <td><input type="radio" name="deplacements" consigne="autorise"></td>
   <td><input type="radio" name="deplacements" consigne="interdit"></td>
   <td class="pres-consignes-restreint"><input type="radio" name="deplacements" class="pres-consignes-restreint" consigne="restreint"></td>
   <td><div contenteditable name="deplacements-com" placeholder="Descente sur temps court ?">Descente sur temps courts</div></td>
  </tr>
  <tr class="pres-consignes-deplacements-restriction">
   <td colspan="4">
    <input type="radio" name="deplacements-restriction" id="deplacements-restriction-soignants" checked=true descente="soignant">
    <label for="deplacements-restriction-soignants">avec soignant</label>
    <input type="radio" name="deplacements-restriction" id="deplacements-restriction-proche" descente="proche">
    <label for="deplacements-restriction-proche">avec proche</label>
    <input type="radio" name="deplacements-restriction" id="deplacements-restriction-seul" descente="seul">
    <label for="deplacements-restriction-seul">seul</label>
   </td>
  </tr>
  <tr>
   <td>Visites</td>
   <td><input type="radio" name="visites" consigne="autorise"></td>
   <td><input type="radio" name="visites" consigne="interdit"></td>
   <td class="pres-consignes-restreint"><input type="radio" name="visites" class="pres-consignes-restreint" consigne="restreint"></td>
   <td><div contenteditable name="visites-com" placeholder="Famille ? Temps court ?"/></td>
  </tr>
  <tr>
   <td>Vêtements</td>
   <td><input type="radio" name="vetements" consigne="autorise"></td>
   <td><input type="radio" name="vetements" consigne="interdit"></td>
   <td class="pres-consignes-restreint"><input type="radio" name="vetements" class="pres-consignes-restreint" consigne="restreint"></td>
   <td><div contenteditable name="vetements-com" placeholder="Veste ? Pantalon ?"/></td>
  </tr>
  <tr>
   <td>Affaires persos</td>
   <td><input type="radio" name="affaires" consigne="autorise"></td>
   <td><input type="radio" name="affaires" consigne="interdit"></td>
   <td class="pres-consignes-restreint"><input type="radio" name="affaires" class="pres-consignes-restreint" consigne="restreint"></td>
   <td><div contenteditable name="affaires-com" placeholder="Téléphone ? Ordinateur ? Autre ?"/></td>
  </tr>
  <tr>
   <td>Cigarettes</td>
   <td><input type="radio" name="tabagisme" consigne="autorise"></td>
   <td class="pres-consignes-restreint"><input type="radio" name="tabagisme" class="pres-consignes-restreint" consigne="accompagne"></td>
   <td class="pres-consignes-restreint"><input type="radio" name="tabagisme" class="pres-consignes-restreint" consigne="restreint"></td>
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
                    SSSFrame.currentListeConsignes = currConsignes
                    Object.keys(currConsignes).forEach(el=>{
                        $('#DIEN-POPUP input[name='+el+'][consigne='+currConsignes[el].consigne+']', SSSFrame.document).click2()
                        $('#DIEN-POPUP div[contenteditable][name='+el+'-com]').text(currConsignes[el].comment)
                    })
                },
                buttons: [
                    {
                        text: "Valider",
                        class: "ui-button ui-button-validate",
                        click: function() {
                            let listeConsignes={deplacements:{},changeComment:[]}, consignesValides=true
                            $('#DIEN-POPUP tbody tr').each((i,el)=>{
                                if ($(el).hasClass('pres-consignes-deplacements-restriction')){
                                    listeConsignes.deplacements.restriction = $('input:checked', el).attr('descente')
                                } else {
                                    let currentConsigne = {"consigne": $('input:checked', el).attr('consigne'), "comment":$('div[contenteditable]', el).text()}
                                    if (currentConsigne.consigne == "restreint" && currentConsigne.comment == "")
                                    {
                                        consignesValides = false
                                        return false
                                    }
                                    listeConsignes[$('input:first', el).attr('name')] = currentConsigne
                                }
                            })
                            if (consignesValides){
                                $( this ).dialog( "close" );
                                let nbToDelete = 0
                                Object.keys(listeConsignes).forEach(el=>{
                                    if (SSSFrame.currentListeConsignes[el].consigne == listeConsignes[el].consigne){
                                        if(SSSFrame.currentListeConsignes[el].comment == listeConsignes[el].comment){
                                            listeConsignes[el].done=true
                                        } else {
                                            listeConsignes[el].changeComment = true
                                        }
                                    } else if (SSSFrame.currentListeConsignes[el].consigne != "autorise"){
                                        nbToDelete++
                                    }
                                })
                                SSSFrame.listeConsignes = listeConsignes
                                if (nbToDelete){$('table[name=HEOFRAME] button:contains(Arrêt)').click2()}else{
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

function addAutoPrescriptor(ev){
    let SSSFrame = ev.view.document.name == "SSSFrame" ? ev.view.document : document.getElementById('SSSFrame').contentWindow, $ = SSSFrame.$
    let DCI = {loxapac:"loxapine", nozinan:"levomepromazine", tercian:"cyamemazine", theralene:"alimemazine", abilify:"aripiprazole", risperdal:"risperidone",zyprexa:"olanzapine",
               nozinan:"levomepromazine", leponex:"clozapine", valium:"diazepam", seresta:"oxazepam", tranxene:"clorazepate", lysanxia:"prazepam", temesta:"lorazepam", xanax:"alprazolam",
               atarax:"hydroxyzine", imovane:"zopiclone", revia:"naltrexone", selincro:"nalmefene", noctamide:"lormetazepam"
              },
        defaultsPres = {
            posos:{
                diazepam:[1,1,1,1], aripiprazole:[1,0,0], loxapine:[1,1,1,1], risperidone:[0,0,0,1], olanzapine:[0,0,0,1], cyamemazine:[1,1,1,1],alimemazine:[0,0,0,1], lormetazepam:[0,0,0,1], hydroxyzine:[0,0,0,1]
            },
            formes:{
                loxapine:"buv", olanzapine:"dispers", cyamemazine:"buv"
            },
            dose:{
                olanzapine:20,aripiprazole:10,loxapine:25,cyamemazine:25,risperidone:2,alimemazine:10,diazepam:10,lorazepam:1,lormetazepam:1, hydroxyzine:25
            }
        },
        formes = ["cp", "buv", "inj", "gel"],
        frequence = {"coucher":[0,0,0,1], "matin":[1,0,0], "midi":[0,1,0], "soir": [0,0,1]}
    if($('#HEO_INPUT', SSSFrame.document).each((i,el)=>{if (!el.keydown){el.keydown = el.onkeydown}; el.onkeydown = (ev)=>{
        if(ev.keyCode==13){
            let pres = ev.target.value.split(" ")
            if ($("#preHeaderMarkup", SSSFrame.document.heoPane_prompt.document).is(':contains(Sélectionnez un item)') && typeof pres == "object" && pres.length > 1){
                if (pres[0] == "mod") {pres.modif = pres.shift()}
                pres.nom = DCI[pres[0]] || pres[0]
                pres.dose = Number(pres[2]) || Number(pres[1]) || ""
                let poso, posoSyste
                try{
                    poso = pres.find(el=>el.search(/[\-\.].+[\-\.]/s)+1)
                    posoSyste = poso.split('+')[0]
                    try{pres.posoSb = poso.split('+')[1]}catch(e){}
                    pres.poso = posoSyste.split('.').join('-').split("-").map(t=>Number(t))
                    pres.posoIndex = pres.findIndex(el=>el.search(/[\-\.].+[\-\.]/s)+1)
                }catch (e){
                    pres.poso = frequence[Object.keys(frequence).find(elm=>pres.find(el=>elm.toUpperCase()==el.toUpperCase()))]
                    if (pres.poso == undefined){
                        pres.poso = defaultsPres.posos[pres.nom]
                    }
                }
                pres.forme = formes.find(el=>pres.find(elm=>elm==el)) || defaultsPres.formes[pres.nom] || "cp"
                pres[0]=pres.nom
                pres[1]=pres.forme
                if(pres.poso && (pres.poso.length >= 3 && pres.poso.length <= 4) && !isNaN(pres.poso[0]) && !isNaN(pres.poso[1]) && !isNaN(pres.poso[2]) && (!pres.poso[3] || pres.poso[3] && !isNaN(pres.poso[3]))){
                    if (pres.dose){
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
                                        currPoso.freqName = "Matin Coucher"
                                        break
                                    default:
                                        break
                                }
                            }
                            pres.posos.push(currPoso)
                        } else { addPoso = true}
                        i++
                    }
                    ev.target.value=pres[0]+" "+pres[1]
                    SSSFrame.autoEnhancedPres = pres
                    SSSFrame.autoEnhancedPresWaiter = setInterval((presc)=>{
                        if (SSSFrame.output_Selector(presc[0] + " "+presc[1], true)){
                            SSSFrame.output_Selector(presc[0] + " "+presc[1])
                            clearInterval(SSSFrame.autoEnhancedPresWaiter)
                        }
                    },250, pres)
                    //setTimeout((ev)=>
                    ev.target.keydown(ev)
                    //, 250, ev)
                    return false
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
function monitorPresMouseOver(ev){
    if (!$ || !$.fn) {var $ = unsafeWindow.jQuery};
    if (!ev.view){ev.view = unsafeWindow || window}
    //$('#hoverMenu_pres', ev.view.document).show().position({at: "center",my:"center", of:ev, using:(a,b)=>{console.log(a,b)}})
}
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
function monitorClick(ev){
    //console.log(unsafeWindow.document.SSSFrame.jQuery, unsafeWindow.parent.jQuery, window.parent.jQuery, window.jQuery)
    if (!$ || !$.fn) {var $ = window.document.SSSFrame.jQuery};

    if (!ev.view){ev.view = unsafeWindow}
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
                let patientIPP = $('div.GOAX34LLOB-fr-mckesson-framework-gwt-widgets-client-resources-SharedCss-fw-Label:contains(IPP)').text().split(' : ')[1],
                patientBD = $('.GOAX34LBN-fr-mckesson-clinique-application-web-portlet-gwt-context-client-resources-ListPatientRendererCss-listpatient').text().split(" (")[2].split(')')[0].split('/').reverse().join(''),
                labo_url = 'https://serv-cyberlab.chu-clermontferrand.fr/cyberlab/servlet/be.mips.cyberlab.web.APIEntry?Class=Order&Method=SearchOrders&LoginName=aharry&Organization=CLERMONT&patientcode='+patientIPP+'&patientBirthDate='+patientBD+'&LastXdays=3650&OnClose=Login.jsp&showQueryFields=F'

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
    } else
        if (ev.target.classList.contains('GD42JS-DLOB')){
        $('a.GD42JS-DKWB', ev.view.document).click2()
    } else if (ev.target.classList.contains('GOAX34LOXB-fr-mckesson-incubator-gwt-widgets-client-resources-FuzzyDateCss-field_without_error')){
        ev.target.parentElement.nextElementSibling.click()
        ev.target.lastValue = ev.target.value
        ev.target.dateWaiterStart = Date.now()
        ev.target.dateWaiter = setInterval((el)=>{
                console.log(el, el.lastValue, el.value)
            if ((Date.now() - el.dateWaiterStart) > 15000){
                clearInterval(el.dateWaiter)
            }else if (el.lastValue != el.value){
                el.lastValue = el.value
                ev.view.document.querySelector('button.GOAX34LH3-fr-mckesson-framework-gwt-widgets-client-resources-ButtonFamilyCss-fw-Button').click()
            }
        },500,ev.target)
    } else if ($('.GOAX34LECB-fr-mckesson-framework-gwt-widgets-client-resources-FormFamilyCss-fw-FormField-mandatory:visible', ev.view.document).has($(ev.target)).length && ev.target.classList.contains('gwt-Image')){
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
    } else if ($(ev.target).filter('input[type=radio]').parents('#DIEN-POPUP').length){
        if ($(ev.target).hasClass('pres-consignes-restreint')){
            $(ev.target).parents('tr').addClass('pres-consignes-restreint')
            $(ev.target).filter('[name=deplacements]').each((i,el)=>{
                $(el).parents('tr').next().add($(el).parent()).addClass('deplacements-restreints')
                $(el).parents('').children('td:first').attr("rowspan",2)
            })
        } else {
            $(ev.target).parents('tr').removeClass('pres-consignes-restreint')
            $(ev.target).filter('[name=deplacements]').each((i,el)=>{
                $(el).parents('').children('td:first').attr("rowspan",1)
                $(el).parents('tr').next().add($(el).parents('tr').find('td.pres-consignes-restreint')).removeClass('deplacements-restreints')
            })
        }
    }/* else if ($(ev.target).filter('span.GD42JS-DP5:contains(Oups)')){
        console.log(ev.target, ev.target.parentElement.parentElement)
        if ($('div.outlineTitle',ev.view.document.heoPane_output.document).text().log().trim() == "Prescriptions Usuelles de Psychiatrie Adulte"){
            $(ev.target).parents('button').attr("disabled", true)
        } else {
            $(ev.target).parents('button').attr("disabled", false)
        }
    }*/
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
