// ==UserScript==
// @name         Easily+
// @namespace    http://tampermonkey.net/
// @version      1.0.251004
// @description  Easily plus facile
// @author       You
// @match        https://easily-prod.chu-clermontferrand.fr/*
// @match        https://easilynlb-prod.chu-clermontferrand.fr/*
// @match        http*://serv-cyberlab.chu-clermontferrand.fr/cyberlab/*
// @match        http*://cyberlab.chu-clermontferrand.fr/cyberlab/*
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


//     ██████ ██    ██ ██████  ███████ ██████  ██       █████  ██████
//    ██       ██  ██  ██   ██ ██      ██   ██ ██      ██   ██ ██   ██
//    ██        ████   ██████  █████   ██████  ██      ███████ ██████
//    ██         ██    ██   ██ ██      ██   ██ ██      ██   ██ ██   ██
//     ██████    ██    ██████  ███████ ██   ██ ███████ ██   ██ ██████
//

    if (location.href.search("cyberlab.chu-clermontferrand.fr")+1){
        let $
        if (!$ || !$.fn) {$ = µ.jQuery || µ.$ || window.jQuery };
        if(location.pathname == "/cyberlab/Login.jsp"){
            $('#loginName').val(EasilyInfos.username)
            $('#password').val(EasilyInfos.password)
            $('button.login__submitButton').click()
        } else if(location.pathname == '/cyberlab/servlet/be.mips.cyberlab.web.InitialLogin'){
            location.href = '/cyberlab/servlet/be.mips.cyberlab.web.FrontDoor?module=Patient&command=initiateBrowsing&onSelectPatient=resultConsultation&stateIndex=0'
        } else if((location.pathname + location.search) == '/cyberlab/servlet/be.mips.cyberlab.web.FrontDoor?module=Patient&command=initiateBrowsing&onSelectPatient=resultConsultation&stateIndex=0'){
            console.log('bouh')
            window.parent.postMessage("cyberlab-getIPP", "https://easily-prod.chu-clermontferrand.fr")
            window.onmessage = msg=>{
                if(msg.data.IPP){
                    $('#pat_Code').val(msg.data.IPP)
                    $('span.menuLabel:contains(Chercher)').click()
                }
            }
        }
        setTimeout(()=>{$('#browserTable tbody>tr:first').click()}, 1000)
        let creat = "", CKDEPI = "", IPP = ""
        function checkCreat() {
            IPP = $('.patientHeader span.identifiers:contains(IPP)').text()
            if (IPP && IPP.split('[IPP: ').length>1){
                IPP = IPP.split('[IPP: ')[1].split(',')[0]
            }
            let more_recent=1000, $tr, $td;
            $('.DTFC_LeftBodyWrapper>table>tbody>tr:contains(Créatinine)').each((i,el)=>{
                $tr = $('.DTFC_scrollBody>table>tbody>tr').eq($(el).index('.DTFC_LeftBodyWrapper>table>tbody>tr'))
                $td=$tr.find('td.clickable:first');if($td.parents('td').index()<more_recent){more_recent=$td.parents('td').index();creat=$td.text().trim()}})
            more_recent=1000
            $('.DTFC_LeftBodyWrapper>table>tbody>tr:contains("Formule CKDEPI")').each((i,el)=>{
                $tr = $('.DTFC_scrollBody>table>tbody>tr').eq($(el).index('.DTFC_LeftBodyWrapper>table>tbody>tr'))
                $td=$tr.find('td.clickable:first');if($td.parents('td').index()<more_recent){more_recent=$td.parents('td').index();CKDEPI=$td.text().trim()}})
            console.log(IPP + " - créat : " + creat + " - DFG : " + CKDEPI)
            if (creat && CKDEPI){
                /*
                GM_setValue("labo", {IPP:IPP,creat:creat, CKDEPI: CKDEPI, autoclose:false})
                var listener = GM_addValueChangeListener("labo", function(name, oldValue, newValue, remote){
                    if (newValue.autoclose){
                        window.close()
                        GM_removeValueChangeListener(listener)
                    }
                })
                */
            }
        }
        setTimeout(checkCreat, 2000)
        //console.log(creat, CKDEPI)
            /*
        if (creat && CKDEPI){
            GM_setValue("labo", {IPP:IPP,creat:creat, CKDEPI: CKDEPI, autoclose:false})
            var listener = GM_addValueChangeListener("labo", function(name, oldValue, newValue, remote){
                if (newValue.autoclose){
                    window.close()
                    GM_removeValueChangeListener(listener)
                }
            })
        }
        */
        setTimeout(()=>{µ.location.reload()},240000)
        return true
    }


    //modules
    // Lancemodule: SYNTHESE_PAT;${IPP};LOGINAD=${username}   == Synthèse Logon
    // Lancemodule: IMAGES_PATIENT;${IPP};LOGINAD=${username}     == PACS


    window.onmessage = function(message){
        console.log(message)
        if(message.data == "cyberlab-getIPP" && message.origin == "https://cyberlab.chu-clermontferrand.fr"){
            $('#cyberlabFrame')[0].contentWindow.postMessage({IPP:unsafeWindow._data.IPP}, "https://cyberlab.chu-clermontferrand.fr")
        }
    }

    if(location.hostname == "easilynlb-prod.chu-clermontferrand.fr"){
        if($(".titleContainer").text().trim() == "Vous n'êtes pas habilité(e) à visualiser ce module."){
            window.parent.postMessage("allowASUR", "*")
        }
    } else if (location.hostname == "easily-prod.chu-clermontferrand.fr"){
        window.addEventListener("message", receiveMessage);
    }

       // auto-relogon
    $('.verrouillage-nom').click(ev=>{
        if(EasilyInfos.password_store){$("#password-popup").val(EasilyInfos.password).log()}
        $("button.deverrouillage-button").click()
    })

    //Gestion affichage du menu
    $('.easily-univers-item').filter(':contains(paramétrage)')[EasilyInfos.hide_parametres ? 'hide':'show']().end()
    .filter(':contains(pilotage)')[EasilyInfos.hide_pilotage ? 'hide':'show']().end()
    .filter(':contains(bloc)')[EasilyInfos.hide_bloc ? 'hide':'show']().end()

    let patientIPP, patientBD, labo_url

//     ██████ ██      ██  ██████ ██   ██     ███████ ██    ██ ███████ ███    ██ ████████
//    ██      ██      ██ ██      ██  ██      ██      ██    ██ ██      ████   ██    ██
//    ██      ██      ██ ██      █████       █████   ██    ██ █████   ██ ██  ██    ██
//    ██      ██      ██ ██      ██  ██      ██       ██  ██  ██      ██  ██ ██    ██
//     ██████ ███████ ██  ██████ ██   ██     ███████   ████   ███████ ██   ████    ██
//

    window.addEventListener('click', (ev=>{
        switch(location.pathname.split("/")[1]){
            case "Login":
                // Auto-logon
                if(EasilyInfos.password_store && $(ev.target).parents('.msg-accueil').length){
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
                if($(ev.target).closest('.easily-container-area').length){ // bandeau droite
                    if ($(ev.target).is('a:contains(Imagerie)')){
                        window.open(`Lancemodule: IMAGES_PATIENT;${unsafeWindow._data.IPP};LOGINAD=${EasilyInfos.username}`)
                    } else if ($(ev.target).is('a:contains(Biologie)')){
                        if(!$('#module-bioboxes-biologie').is('.cyberlab_frame')){
                            if(!unsafeWindow._data.IPP){
                                unsafeWindow._data.IPP = $('.infosPatient').text().split(' : ')[1]
                            }
                            patientIPP = unsafeWindow._data.IPP
                            patientBD = $('.infosPatient').text().split('le ')[1].split(" (")[0].split('/').reverse().join('')
                            labo_url = 'http://intranet/intranet/Outils/APICyberlab/Default.aspx?'+
                                btoa('Class=Order&Method=SearchOrders&LoginName=aharry&Password=Clermont63!&Organization=CLERMONT&patientcode='+patientIPP+'&patientBirthDate='+patientBD+'&LastXdays=3650&OnClose=Login.jsp&showQueryFields=F')
                            $.waitFor('#module-bioboxes-biologie:visible').then(el=>{
                                $(el).html("").append('<iframe id="cyberlabFrame" style="width:100%;height:100%" src="https://cyberlab.chu-clermontferrand.fr">')
                            })
                            $('#module-bioboxes-biologie').addClass('cyberlab_frame')
                        }
                    }
                }
                if($(ev.target).closest('#easily-univers').length){
                    if($(ev.target).is('a:contains("urgences")')){
                        $('li[title="ASUR (Urgences)"]').click()
                    } else if($(ev.target).is('a:contains("hospitalisation")')){
                        $('li[title="Patients hospitalisés (WorklistsHospitalisation)"]').click()
                    }
                }
                /*
                    */
                break;
        }
    }))


//     ██████  ██████  ███    ██ ████████ ███████ ██   ██ ████████     ███    ███ ███████ ███    ██ ██    ██
//    ██      ██    ██ ████   ██    ██    ██       ██ ██     ██        ████  ████ ██      ████   ██ ██    ██
//    ██      ██    ██ ██ ██  ██    ██    █████     ███      ██        ██ ████ ██ █████   ██ ██  ██ ██    ██
//    ██      ██    ██ ██  ██ ██    ██    ██       ██ ██     ██        ██  ██  ██ ██      ██  ██ ██ ██    ██
//     ██████  ██████  ██   ████    ██    ███████ ██   ██    ██        ██      ██ ███████ ██   ████  ██████
//

    window.addEventListener('contextmenu', (ev=>{
        console.log('bah')
        switch(location.pathname.split("/")[1]){
            case "Medecin":
                if($(ev.target).is('div.username')){
                    ev.preventDefault()
                    $('#EasilyPlusPrefs').dialog('open')
                }
                break;
        }
    }))


//     █████  ███████ ██    ██ ██████
//    ██   ██ ██      ██    ██ ██   ██
//    ███████ ███████ ██    ██ ██████
//    ██   ██      ██ ██    ██ ██   ██
//    ██   ██ ███████  ██████  ██   ██
//

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


//     ██████  ██████  ████████ ██  ██████  ███    ██ ███████
//    ██    ██ ██   ██    ██    ██ ██    ██ ████   ██ ██
//    ██    ██ ██████     ██    ██ ██    ██ ██ ██  ██ ███████
//    ██    ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
//     ██████  ██         ██    ██  ██████  ██   ████ ███████
//

    if(location.pathname.split("/")[1] != "Login"){
    $('<div id="EasilyPlusPrefs"></div>').append(`
<table>
 <thead>
  <tr>
   <th style="width:200px">Info</th>
   <th>Valeur</th>
  </tr>
 </thead>
 <tbody>
  <tr class="option-info_name">
   <td>Nom</td>
   <td><input type="text" name="nom" value="${EasilyInfos.nom ? EasilyInfos.nom : $('div.username').attr('title').split(' ').filter((t,i) => t.search(/[A-Z][A-Z]+/)+1).join(' ')}"></td>
  </tr>
  <tr class="option-info_firstname">
   <td>Prénom</td>
   <td><input type="text" name="prenom" value="${EasilyInfos.prenom ? EasilyInfos.prenom : $('div.username').attr('title').split(' ').filter((t,i) => t.search(/[A-Z][a-z]+/)+1).join(' ')}"></td>
  </tr>
  <tr class="option-info_username">
   <td>Nom utilisateur</td>
   <td><input type="text" name="username" value="${EasilyInfos.username ? EasilyInfos.username : ($('div.username').attr('title').split(' ').filter((t,i) => t.search(/[A-Z][a-z]+/)+1).join('').slice(0,1) + ($('div.username').attr('title').split(' ').filter((t,i) => t.search(/[A-Z][A-Z]+/)+1).join(''))).toLowerCase()}"></td>
  </tr>
  <tr class="option-info_password_store">
   <td>Enregistrer le MdP ?</td>
   <td><input type="checkbox" name="password_store" ${EasilyInfos.password_store ? "checked" : ""}></td>
  </tr>
  <tr class="option-info_password">
   <td>Password</td>
   <td><input type="password" name="password" value="${EasilyInfos.password ? EasilyInfos.password : ""}"></td>
  </tr>
  <tr class="option-info_tel_service">
   <td>Téléphone service</td>
   <td><input type="tel" pattern="[5-6][0-9]{4}" name="phone" value="${EasilyInfos.phone ? EasilyInfos.phone : ""}" placeholder="5XXXX ou 6XXXX"></td>
  </tr>
  <tr class="option-info_CR">
   <td>Numéro CR</td>
   <td><input type="tel" pattern="[0-4][0-9]{3}[A-Z]" name="CR" value="${EasilyInfos.CR ? EasilyInfos.CR : ""}" placeholder="Ex : 1361U"></td>
  </tr>
  <tr class="option-info_UF">
   <td>Numéro UF</td>
   <td><input type="tel" pattern="[0-4][0-9]{3}" name="UF" value="${EasilyInfos.UF ? EasilyInfos.UF : ""}" placeholder="Ex : 2838"></td>
  </tr>
  <tr class="option-cacher_Bloc">
   <td>Menus à cacher</td>
   <td>
    <label><input type="checkbox" name="hide_bloc" ${EasilyInfos.hide_bloc ? "checked" : ""}> Bloc</label>
    <label><input type="checkbox" name="hide_pilotage" ${EasilyInfos.hide_pilotage ? "checked" : ""}> Pilotage</label>
    <label><input type="checkbox" name="hide_parametres" ${EasilyInfos.hide_parametres ? "checked" : ""}> Paramétrage</label>
   </td>
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
                        EasilyInfos[$(el).attr('name')] = $(el).is('[type=checkbox]') ? $(el).is(':checked') : $(el).val()

                        /*
                        if(['password_store', 'show_bloc'].includes($(el).attr('name'))){ // gestion des checkbox
                            EasilyInfos.password_store = $(el).is(':checked')
                        }
                        */
                    })
                    EasilyInfos.password = EasilyInfos.password_store ? EasilyInfos.password : ""
                    GM_setValue('EasilyInfos', EasilyInfos)
                    $('.easily-univers-item').filter(':contains(paramétrage)')[EasilyInfos.hide_parametres ? 'hide':'show']().end()
                        .filter(':contains(pilotage)')[EasilyInfos.hide_pilotage ? 'hide':'show']().end()
                        .filter(':contains(bloc)')[EasilyInfos.hide_bloc ? 'hide':'show']().end()
                    $( this ).dialog( "close" );
                },
                class:'btn-success'
            },
            {
                text: "Annuler",
                click: function() {
                    $( this ).dialog( "close" );
                },
                class:"btn-danger"
            }
        ]
    })
    }


//    ███████ ████████ ██    ██ ██      ███████
//    ██         ██     ██  ██  ██      ██
//    ███████    ██      ████   ██      █████
//         ██    ██       ██    ██      ██
//    ███████    ██       ██    ███████ ███████

    $('<style id="EasilyPlus_Style">').html(`
    `)
    // Your code here...
})();







