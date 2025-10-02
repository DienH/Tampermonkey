// ==UserScript==
// @name         Easily+
// @namespace    http://tampermonkey.net/
// @version      1.0.251002
// @description  Easily plus facile
// @author       You
// @match        https://easily-prod.chu-clermontferrand.fr/*
// @match        https://easilynlb-prod.chu-clermontferrand.fr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chu-clermontferrand.fr
// @resource     DienJS https://raw.githubusercontent.com/DienH/Tampermonkey/master/Dien.js
// @updateURL    https://github.com/DienH/Tampermonkey/raw/master/Easily%2B.user.js
// @downloadURL  https://github.com/DienH/Tampermonkey/raw/master/Easily%2B.user.js
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @grant        GM_getResourceText
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        window.close
// ==/UserScript==
// require      https://cdn.jsdelivr.net/gh/DienH/Tampermonkey@master/Dien.js

(function() {
    'use strict';
    if (!GM_getValue('EasilyInfos', false)){
        GM_setValue('EasilyInfos', {user:"",password:"", nom:"", prenom:"", trajectoirePassword:"", phone:""});
    }
    let EasilyInfos = GM_getValue('EasilyInfos',{"user":"", "password":""})
    var µ = unsafeWindow
    var log = console.log
    if (!$ || !$.fn) {var $ = µ.jQuery || µ.parent.jQuery || window.parent.jQuery || window.jQuery };
    if(!$('#DienScriptPlus', document).length){
        $('body', document)
            .append($('<script id="DienScriptPlus">').html(GM_getResourceText('DienJS')))
    }


    if(location.hostname == "easilynlb-prod.chu-clermontferrand.fr"){
        if($(".titleContainer").text().trim() == "Vous n'êtes pas habilité(e) à visualiser ce module."){
            window.parent.postMessage("allowASUR", "*")
        }
    } else if (location.hostname == "easily-prod.chu-clermontferrand.fr"){
        window.addEventListener("message", receiveMessage);
    }

    window.addEventListener('click', (ev=>{
        switch(location.pathname.split("/")[1]){
            case "Login":
                console.log($(ev.target))
                if($(ev.target).parents('.msg-accueil').length){
                    let EasilyInfos = GM_getValue('EasilyInfos',{"user":"", "password":""})
                    $("input#username").val(EasilyInfos.username)
                    $("input#password").val(EasilyInfos.password)
                    $("button.login-submit").click()
                }
                break;
            case "Medecin":
                //auto-affiche hospit UF
                if($(ev.target).parents('.message-center:visible:contains("Choisissez une UF")').length){
                        $('#dropdownCR').val('string:'+EasilyInfos.CR).change()
                        setTimeout(()=>$('#dropdownUF').val('string:'+EasilyInfos.UF).change(), 500)
                    //}
                }
                if($(ev.target).closest('#easily-univers').length){
                    if($(ev.target).is('a:contains("urgences")')){
                        $('li[title="ASUR (Urgences)"]').click()
                    } else if($(ev.target).is('a:contains("hospitalisation")')){
                        $('li[title="Patients hospitalisés (WorklistsHospitalisation)"]').click()
                    }
                }
                break;
        }
    }))


    // CONTEXT MENU
    window.addEventListener('contextmenu', (ev=>{
        switch(location.pathname.split("/")[1]){
            case "Medecin":
                if($(ev.target).is('div.username')){
                    ev.preventDefault()
                    $('#EasilyPlusPrefs').dialog('open')
                }
                break;
        }
    }))

    // Auto-habilitation urgences
    function receiveMessage(event) {
        let waitTime = 0
        switch(event.data){
            case "allowASUR":
                $('[data-action=habilitation]').click2()
                $.waitFor(`ul.nav>li:contains("Demandes d'habilitation"):visible a:contains("Faire une demande d'habilitation temporaire")`).then(el=>setTimeout((e)=>$(e).click(),300,el))
                $.waitFor(`label:contains("Choix des services"):visible`).then(el=>setTimeout((e)=>$(e).click(),300,el))
                $.waitFor(`input[placeholder="rechercher un service par code ou libellé de..."]:visible`).then(el=>setTimeout((e)=>$(e).val("1361u").trigger("change"),300,el))
                $.waitFor(`span[data-bind="click: rechercherServices"]:visible`).then(el=>setTimeout((e)=>$(e).click(),300,el))
                $.waitFor(`#module-habilitation-tab-workflow-cr tr:contains("URGENCES ET UHCD GM") button.glyphicon-plus`).then(el=>setTimeout((e)=>$(el).click(),300,el))
                $.waitFor(`label:contains("Synthèse"):visible`).then(el=>setTimeout((e)=>$(e).click(),300,el))
                $.waitFor(`button.btn-success[data-bind="enable : allowValidation, click:faireDemande"]:visible`).then(el=>setTimeout((e)=>$(e).click(),300,el))
                $.waitFor(`button[data-bind="click: RetourPagePrefereeOuFournie(0)"]:visible`).then(el=>setTimeout((e)=>{
                    $(e).click()
                    $.waitFor(`li[title="ASUR (Urgences)"]`).then(el2=>$(el2).click())
                },300,el)
                )
        }
    }


    // Options du script
    $('<div id="EasilyPlusPrefs"></div>').append(`
<table>
 <thead>
  <tr>
   <th style="width:200px">Info</th>
   <th style="width:200px">Valeur</th>
  </tr>
 </thead>
 <tbody>
  <tr class="option-info-name">
   <td>Nom</td>
   <td><input type="text" name="username" value="${EasilyInfos.username ?? ($('div.username').attr('title').split(' ').filter((t,i) => t.search(/[A-Z][a-z]+/)+1).join('').slice(0,1) + $('div.username').attr('title').split(' ').filter((t,i) => t.search(/[A-Z][A-Z]+/)+1)).toLowerCase()}"></td>
  </tr>
  <tr class="option-info-password_store">
   <td>Enregistrer le MdP ?</td>
   <td><input type="checkbox" name="password_store" checked="${EasilyInfos.password ? true : false}"></td>
  </tr>
  <tr class="option-info-password">
   <td>Password</td>
   <td><input type="password" name="password" value="${EasilyInfos.password ?? ""}"></td>
  </tr>
  <tr class="option-info-tel_service">
   <td>Téléphone service</td>
   <td><input type="tel" pattern="[5-6][0-9]{4}" name="phone" value="${EasilyInfos.phone ?? ""}" placeholder="5XXXX ou 6XXXX"></td>
  </tr>
  <tr class="option-info-CR">
   <td>Numéro CR</td>
   <td><input type="tel" pattern="[0-4][0-9]{3}[A-Z]" name="CR" value="${EasilyInfos.CR ?? ""}" placeholder="Ex : 1361U"></td>
  </tr>
  <tr class="option-info-UF">
   <td>Numéro UF</td>
   <td><input type="tel" pattern="[0-4][0-9]{3}" name="UF" value="${EasilyInfos.UF ?? ""}" placeholder="Ex : 2838"></td>
  </tr>
</tbody></table>`).dialog({
        modal:true,
        autoOpen:false,
        title:"Options Easily+",
        minHeight:250,
        minWidth:680,
        width:800,
        height:"auto",
        resize:"auto",
        autoResize:true,
        open:function(ev, ui){
        },
        buttons: [
            {
                text: "Valider",
                click: function() {
                    $(this).find('input').each((i, el)=>{
                        EasilyInfos[$(el).attr('name')] = $(el).val()
                        if($(el).attr('name') == 'password_store'){
                            EasilyInfos.password_store = $(el).is(':checked')
                        }
                    })
                    EasilyInfos.password = EasilyInfos.password_store ? EasilyInfos.password : ""
                    GM_setValue('EasilyInfos', EasilyInfos)
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

    // auto-relogon
    $('.verrouillage-nom').click(ev=>{
        $("#password-popup").val(EasilyInfos.password)
        $("button.deverrouillage-button").click()
    })
    // Your code here...
})();
