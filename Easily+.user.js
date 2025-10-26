// ==UserScript==
// @name         Easily+
// @namespace    http://tampermonkey.net/
// @version      1.0.251026
// @description  Easily plus facile
// @author       You
// @match        https://easily-prod.chu-clermontferrand.fr/*
// @match        https://easilynlb-prod.chu-clermontferrand.fr/*
// @match        http*://serv-cyberlab.chu-clermontferrand.fr/cyberlab/*
// @match        http*://cyberlab.chu-clermontferrand.fr/cyberlab/*
// @match        http*://xplore.chu-clermontferrand.fr/*
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
    µ.currentPatient = {id:'', nom:'', prenom:'',ddn:'', IPP:''}
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
            //location.href = '/cyberlab/servlet/be.mips.cyberlab.web.FrontDoor?module=Patient&command=initiateBrowsing&onSelectPatient=resultConsultation&stateIndex=0'

            window.parent.postMessage(JSON.stringify({'command':'cyberlab-getWindowName'}), "https://easily-prod.chu-clermontferrand.fr")

            window.onmessage = msg=>{
                window.name=msg.data.windowName ?? ""
                console.log(msg.data)
                if(msg.data.IPP){
                    if(window.name == "resultats"){
                        $('#pat_Code').val(msg.data.IPP)
                        $('span.menuLabel:contains(Chercher)').click()
                    }else if(window.name == "prescription"){
                        $.post('/cyberlab/servlet/be.mips.cyberlab.web.APIEntry', `Class=Patient&Method=CreateOrder&LoginName=${EasilyInfos.username}&Password=Clermont63!&Object=${msg.data.IPP}&Visit=${msg.data.IEP}&Organization=CLERMONT&onClose=Login.jsp&application=CHU_PRESCR`, r=>{
                            document.open()
                            document.write(r)
                            document.close()
                        })
                    }
                }
            }
        } else if((location.pathname + location.search) == '/cyberlab/servlet/be.mips.cyberlab.web.FrontDoor?module=Patient&command=initiateBrowsing&onSelectPatient=resultConsultation&stateIndex=0'){
            /*
            window.parent.postMessage(JSON.stringify({command:'cyberlab-getName'}), "https://easily-prod.chu-clermontferrand.fr")
            window.onmessage = msg=>{
                if(msg.data.IPP){
                    if(window.name == "resultats"){
                        $('#pat_Code').val(msg.data.IPP)
                        $('span.menuLabel:contains(Chercher)').click()
                    }else if(window.name == "prescription"){
                        console.log(msg.data)
                        $.post('/cyberlab/servlet/be.mips.cyberlab.web.APIEntry', `Class=Patient&Method=CreateOrder&LoginName=${EasilyInfos.username}&Password=Clermont63!&Object=${msg.data.IPP}&Visit=${msg.data.IEP}&Organization=CLERMONT&onClose=Login.jsp&application=CHU_PRESCR`, r=>{
                            document.open()
                            document.write(r)
                            document.close()
                        })
                    }
                } else if (msg.data.name){
                    window.name=msg.data.name
                    window.parent.postMessage(JSON.stringify({command:'cyberlab-getIPP', name:msg.data.name}), "https://easily-prod.chu-clermontferrand.fr")
                }
            }
            */
        }
        if(window.name =="resultats"){
            if(!$('#cyberlab_style').length){
                $('<style id="cyberlab_style">').appendTo($('body').addClass('cyberlab_framed')).html(`
                .cyberlab_framed .globalMenu, .cyberlab_framed .contextMenu, .cyberlab_framed #patientHeader, .cyberlab_framed .blockingOverlayOnMobile {display:none}
                body.cyberlab_framed {padding-top:0!important}
                .cyberlab_framed .main {height: 100vh; margin: 0; }
                .cyberlab_framed .main, .cyberlab_framed .dataTables_wrapper {width: calc(100vw - 1.5em)!important;}
                .cyberlab_framed td {overflow:hidden}
                .cyberlab_framed td.value.clickable, .cyberlab_framed .DTFC_scrollBody td:first-child {white-space:nowrap;}
                .cyberlab_framed .DTFC_scrollBody td.column-result.first, .cyberlab_framed .DTFC_scrollBody td:first-child {height:fit-content!important}
                //.cyberlab_framed .DTFC_scroll {left:0!important;width:calc(100vw - 20px)!important;}
                .cyberlab_framed .DTFC_scrollBody, .cyberlab_framed .DTFC_scrollHead {width:calc(100vw - 20px)!important;}
                .cyberlab_framed .DTFC_scrollBody div.description {overflow:hidden;}
                //.cyberlab_framed .DTFC_LeftWrapper {display:none!important}
                `)
            }
            $('td.value.clickable, td.column-test').each((i,el)=>{
                $(el).height($(el).height()).attr("title", $(el).text().trim())
            })
            //$('.DTFC_LeftHeadWrapper th').prependTo('.dataTables_scrollHeadInner tr')
            /*
            $('.DTFC_LeftBodyWrapper tr>td').each((i,el)=>{
                $(el).prependTo($('.DTFC_scrollBody>table>tbody>tr:eq('+i+')'))
            })
            */
            $('.cyberlab_framed .DTFC_scrollBody div.description').each((i,el)=>{
                if($(el).next().find('.icon').length){
                    $(el).css('width','calc(100% - 20px)')
                }
            })
            $('.DTFC_scrollHead th').css('width', 150)
            $('.DTFC_scrollBody tr:first td').css('width', 150)
            $('.DTFC_scrollBody td.column-result.first')
            window.dispatchEvent(new Event('resize'))
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
                GM_setValue("labo", {IPP:IPP,creat:creat, CKDEPI: CKDEPI, autoclose:false})
                var listener = GM_addValueChangeListener("labo", function(name, oldValue, newValue, remote){
                    if (newValue.autoclose){
                        window.close()
                        GM_removeValueChangeListener(listener)
                    }
                })
            }
        }
        setTimeout(checkCreat, 2000)
        setTimeout(()=>{µ.location.reload()},240000)
        return true
    }

//    ██   ██ ██████  ██       ██████  ██████  ███████
//     ██ ██  ██   ██ ██      ██    ██ ██   ██ ██
//      ███   ██████  ██      ██    ██ ██████  █████
//     ██ ██  ██      ██      ██    ██ ██   ██ ██
//    ██   ██ ██      ███████  ██████  ██   ██ ███████
//
//

    if (location.href.search("xplore.chu-clermontferrand.fr")+1){
        if (!$ || !$.fn) {$ = µ.jQuery || µ.$ || window.jQuery }
        console.log((location.pathname + location.hash) == "/XaIntranet/#/UserLogin")
        if((location.pathname + location.hash) == "/XaIntranet/#/UserLogin"){
            $.waitFor('#txtUSERNAME input').then(el=>{
                $(el).val(EasilyInfos.username).each((i,elem)=>{elem.dispatchEvent(new Event('change'))})
                $('#txpPASSWORD input').val(EasilyInfos.password).each((i,elem)=>{elem.dispatchEvent(new Event('change'))})
                $('#btnVALIDER>a').click2()
            })
        }
    }

//    ██████  ██████  ███████ ███████
//    ██   ██ ██   ██ ██      ██
//    ██████  ██████  █████   ███████
//    ██      ██   ██ ██           ██
//    ██      ██   ██ ███████ ███████
//
//
    else if(location.href.search("https://easilynlb-prod.chu-clermontferrand.fr/ePrescriptionWeb/")+1){
        $(window).on('click', ev=>{
            //console.log(ev)

            //Cacher automatiquement l'alerte sur les EI des traitements
            if(EasilyInfos.hide_warningTTT){
                $.waitFor('#SyntheseSignaux', 3000).then($el=>{
                    $el.find('#btnEnregistrer').click()
                })
            }

            //Signature rapide
            if($(ev.target).is('div.Alignement:contains(Mot de passe)')){
                //console.log('bouh')
                if($('#UtilisateurLogin').val() == EasilyInfos.username){
                    $('#UtilisateurPassword').val(EasilyInfos.password)
                    $('#SignatureBox #btnSigner').click2()
                }
            }
        })
        $('#btnEnregistrer:contains(Continuer)').click()
    }


//    ███████ ██  ██████ ██   ██ ███████         ██     ██████   ██████   ██████
//    ██      ██ ██      ██   ██ ██             ██      ██   ██ ██    ██ ██
//    █████   ██ ██      ███████ █████         ██       ██   ██ ██    ██ ██
//    ██      ██ ██      ██   ██ ██           ██        ██   ██ ██    ██ ██
//    ██      ██  ██████ ██   ██ ███████     ██         ██████   ██████   ██████
//
//
    if(location.hostname == "easilynlb-prod.chu-clermontferrand.fr"){
        // Gestion des fiches du type Observation / FHR
        if(location.pathname == "/dominho/Fiche/Open" || location.pathname == "/Dominho/Fiche/Create"){

            //Expension des catégories "Contexte", "Sejour" et "Sortie" avec simple click
            $('.fm_grid_cell.fm_group_header.fm_group_header_lightgray').off().click(ev=>{
                //console.log($(ev.target).is('div.fm_group_header_expander'), $(ev.delegateTarget).find('div.fm_group_header_expander.image_expanded_png'))
                if(!$(ev.target).is('div.fm_group_header_expander')){
                    $(ev.delegateTarget).find('div.fm_group_header_expander').click()
                    ev.preventDefault()
                }
            })
            window.parent.postMessage({'command':'create-FHR_Channel'}, "*")
            window.onmessage = message=>{
                let messageEvData
                if (typeof message.data == "object"){
                    messageEvData = message.data
                } else{
                    try {
                        messageEvData = JSON.parse(message.data)
                    }catch(e){
                        console.error('Error parsing data', message.data)
                        return null
                    }
                }
                if(messageEvData.command == "FHR_channel-framePort"){
                    µ.FHR_parentPort = message.ports[0]
                    µ.getFHR_Clipboard = ()=>new Promise((resolve, reject)=>{
                        message.ports[0].onmessage = ({data}) =>{
                            //console.log("Message de FHR - Parent : " + data)
                            if(data){
                                resolve(data)
                            }else{
                                reject('No data')
                            }
                        }
                        message.ports[0].postMessage('FHR_getClipboard')
                    })
                console.log(µ.getFHR_Clipboard)
                }
            }
            switch(unsafeWindow._currentContext.FicheTitle){
                case 'FHR Observation Médicale - Psychiatrie':
                    $('.header.headerScrolling>div:not([id])>div:first').clone().appendTo($('.header.headerScrolling>div:not([id])')).find('.ToolbarButtonImage').attr('class', 'ToolbarButtonImage image__envoyer-a-la-frappe_png').attr('icone', 'image__envoyer-a-la-frappe_png').siblings().remove().end()
                        .parent().attr({'onclick':'', 'Title': 'Remplissage auto de la fiche', 'id': '', 'ng-class':''}).click(async ev=>{
                        //let CB_content = await navigator.clipboard.readText()
                        //console.log(CB_content)
                        µ.getFHR_Clipboard().then(clipData=>{
                            //log(clipData)
                            µ.clipData = clipData
                            try{
                                log(clipData.match(/Motif hospitalisation \:\s?(?<mh>.*?)\r?\n/).groups)
                                log(clipData.match(/Motif hospitalisation \:\s?(?<mh>.*?)\r?\n(.|\n|\r)*ATCD médico.*?\r?\n(?<atcd_med>(.|\n|\r)*?)\r?\n.*?\r?\nATCD psychiatriques .*? personnels.*?\r?\n(?<atcd_psy_perso>(.|\n|\r)*?)\r?\n.*?\r?\nATCD psy.*?familiaux.*?\r?\n(?<atcd_psy_fam>(.|\n|\r)*?)\r?\n.*?\r?\nAllergies.*?\r?\n(?<allergies>(.|\n|\r)*?)\r?\n.*?\r?\nTraitement/).groups)
                            }catch(e){
                                log(typeof clipData, clipData.length)
                                log(e)
                            }
                        })
                        let observData = {}, $tmp
                        $('.fm-label-mandatory-validate').closest('td.fm_grid_cell').each((i,el)=>{
                            switch($(el).text().trim()){
                                case "Sortie*":
                                    $(el).next().find('input').val(new Date().toLocaleDateString())
                                    break
                                case "Motif entrée*":
                                    $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val(observData.motif ?? '.')
                                    break
                                case "Conclusion de l'examen clinique initial*":
                                    $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val(observData.examInit ?? '.')
                                    break
                                case "Périmètre abdominal*":
                                case "Poids*":
                                case "Taille*":
                                    $tmp = $(el).next().find('input').val((i,v)=>v ? v : '1').end().next().next().find('input')
                                    if(!$tmp.filter(':checked').length){
                                        $tmp.first().click()
                                    }
                                    break
                                case "Variation poids pré-hospit.*":
                                   $(el).next().find('input:eq(1)').click()
                                    break
                                case "Traitement à l'entrée*":
                                    $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val(observData.tttInit ?? '.')
                                    break
                                case "Diagnostic de sortie*":
                                    $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val(observData.auTotal ?? '.')
                                    break
                                case "Destination du patient à la sortie*":
                                    $(el).parent().closest('td.fm_grid_cell').parent().next().find('input:first').click()
                                    break
                                case "Prescription de sortie *":
                                    $(el).closest('td.fm_group_header_default').parent().next().find('textarea').val(observData.tttSortie ?? '.')
                                    break
                                case "- Patient porteur/contact de BMR ou BHRe*":
                                case "- Transfusion*":
                                case "- Médicament dérivé du sang*":
                                case "- Pose d'un dispositif médical implantable*":
                                case "- Allergies au cours du séjour*":
                                case "- Evènements indésirables / Complications*":
                                case "- Déclaration de vigilance (Pharmacovigilance, etc...)*":
                                case "- Autres*":
                                   $(el).next().find('input:eq(1)').click()
                                    break
                                case "- Remis en main propre*":
                                   $(el).next().find('input:eq(0)').click()
                                    break
                                default:
                                    break
                            }
                        })
                    })
                    //console.log("Fiche FHR")
                    break
            }

        }


        // ASUR - absence d'habilitation
        if($(".titleContainer").text().trim() == "Vous n'êtes pas habilité(e) à visualiser ce module."){
            //console.log("Pas d'habilitation au module ASUR")
            window.parent.postMessage('{"command":"allowASUR"}', "*")
        }
    } else if (location.hostname == "easily-prod.chu-clermontferrand.fr" && window.top == window.self){
        window.addEventListener("message", receiveMessage_Main);
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


//    ███    ███  ██████  ██    ██ ███████ ███████     ███████ ██    ██ ███████ ███    ██ ████████ ███████
//    ████  ████ ██    ██ ██    ██ ██      ██          ██      ██    ██ ██      ████   ██    ██    ██
//    ██ ████ ██ ██    ██ ██    ██ ███████ █████       █████   ██    ██ █████   ██ ██  ██    ██    ███████
//    ██  ██  ██ ██    ██ ██    ██      ██ ██          ██       ██  ██  ██      ██  ██ ██    ██         ██
//    ██      ██  ██████   ██████  ███████ ███████     ███████   ████   ███████ ██   ████    ██    ███████
//

    $(window).on('click contextmenu mouseup', (ev=>{
        //console.log(ev)
        if(location.href.search("https://easily-prod.chu-clermontferrand.fr/")+1){
            switch(location.pathname.split("/")[1]){
                case "login":
                case "Login":
                    // Auto-logon
                    if($(ev.type == "click")){
                        if(EasilyInfos.password_store && $(ev.target).parents('.msg-accueil').length){
                            $("input#username").val(EasilyInfos.username)
                            $("input#password").val(EasilyInfos.password)
                            $("button.login-submit").click()
                        }
                    }
                    break;
                case "medecin":
                case "Medecin":
                    //auto-affiche hospit UF
                    if($(ev.target).parents('.message-center:visible:contains("Choisissez une UF")').length){
                        if(ev.type == "click"){
                            $('#dropdownCR').val('string:'+EasilyInfos.CR).change()
                            setTimeout(()=>$('#dropdownUF').val('string:'+EasilyInfos.UF).change(), 500)
                        }
                    }
                    if($(ev.target).closest('.easily-container-area').length){ // bandeau droite
                        if ($(ev.target).is('a:contains(Imagerie)')){
                            if(ev.type == "click"){
                                if(!$('#module-bioboxes-anapath').is('.pres-bio_frame')){
                                    if(!µ.currentPatient.IPP){
                                        µ.currentPatient.IPP = $('.infosPatient').text().split(' : ')[1]
                                        µ.currentPatient.DDN = $('.infosPatient').text().split('le ')[1].split(" (")[0]
                                    }
                                }
                            }
                        }else if ($(ev.target).is('a:contains(Imagerie)')){
                            if(ev.type == "click"){
                                window.open(`Lancemodule: IMAGES_PATIENT;${unsafeWindow.currentPatient.IPP};LOGINAD=${EasilyInfos.username}`)
                            }

                            if(!$('#module-bioboxes-imagerie').is('.xplore_frame')){
                                if(!µ.currentPatient.IPP){
                                    µ.currentPatient.IPP = $('.infosPatient').text().split(' : ')[1]
                                    µ.currentPatient.DDN = $('.infosPatient').text().split('le ')[1].split(" (")[0]
                                }
                                /*
                                $.waitFor('#module-bioboxes-imagerie:visible').then(el=>{
                                    $(el).html("").append('<iframe id="xploreFrame" style="width:100%;height:100%" src="https://xplore.chu-clermontferrand.fr/XaIntranet/#/ExternalOpener?login=aharry&name=FicheDemandeRV&target=WindowDefault&param1=CREATE-FROM-NUMIPP&param2='+µ.currentPatient.IPP+'">')
                                })
                                */
                            }
                            //https://xplore.chu-clermontferrand.fr/XaIntranet/#/ExternalOpener?login=aharry&name=FicheDemandeRV&target=WindowDefault&param1=CREATE-FROM-NUMIPP&param2=${IPP}
                        } else if ($(ev.target).is('a:contains(Biologie)')){
                            if(!$('#module-bioboxes-biologie').is('.cyberlab_frame')){
                                if(!µ.currentPatient.IPP){
                                    µ.currentPatient.IPP = $('.infosPatient').text().split(' : ')[1]
                                    µ.currentPatient.DDN = $('.infosPatient').text().split('le ')[1].split(" (")[0]
                                }
                                /*
                            labo_url = 'http://intranet/intranet/Outils/APICyberlab/Default.aspx?'+
                                btoa('Class=Order&Method=SearchOrders&LoginName=aharry&Password=Clermont63!&Organization=CLERMONT&patientcode='+µ._data.IPP+'&patientBirthDate='+µ.currentPatient.DDN.split('/').reverse().join('')+'&LastXdays=3650&OnClose=Login.jsp&showQueryFields=F')
                            */
                            }
                        }
                    }
                    if($(ev.target).closest('#easily-univers').length){
                        if($(ev.target).is('a:contains("urgences")')){
                            $('li[title="ASUR (Urgences)"]').click()
                        } else if($(ev.target).is('a:contains("hospitalisation")')){
                            $('li[title="Patients en psy (WorklistsHospitalisation)"]').click()
                        } else if($(ev.target).is('a:contains("consultation")')){
                            $('li[title="Gestion des agendas (Agenda)"]').click()
                        }
                    }
                    if($(ev.target).is('div.username')){
                        if(ev.type == "contextmenu"){
                            ev.preventDefault()
                            $('#EasilyPlusPrefs').dialog('open')
                        }
                    }
                    break;
            }
        } else if(location.href.search("https://easilynlb-prod.chu-clermontferrand.fr/")+1){
            switch(location.pathname){
                case "/dominho/Fiche/Open":
                    break
            }
        }
    }))



//    ███    ███ ███████ ███████ ███████  █████   ██████  ███████     ███████ ██    ██ ███████ ███    ██ ████████
//    ████  ████ ██      ██      ██      ██   ██ ██       ██          ██      ██    ██ ██      ████   ██    ██
//    ██ ████ ██ █████   ███████ ███████ ███████ ██   ███ █████       █████   ██    ██ █████   ██ ██  ██    ██
//    ██  ██  ██ ██           ██      ██ ██   ██ ██    ██ ██          ██       ██  ██  ██      ██  ██ ██    ██
//    ██      ██ ███████ ███████ ███████ ██   ██  ██████  ███████     ███████   ████   ███████ ██   ████    ██
//
//
    function receiveMessage_Main(message) {
        let waitTime = 0, messageEvData, frameOrigin, FHR_channel, clipboardContent
        //console.log(message)
        if (typeof message.data == "object"){
            messageEvData = message.data
        } else{
            try {
                messageEvData = JSON.parse(message.data)
            }catch(e){
                console.log('Error parsing data', message.data)
                return null
            }
        }
        $('iframe').each((i,el)=>{
            if(el.contentWindow == message.source){
                frameOrigin = el
            }
        })
        switch(messageEvData.command){

//        _   ___ _   _ ___
//       /_\ / __| | | | _ \
//      / _ \\__ \ |_| |   /
//     /_/ \_\___/\___/|_|_\
//
            case "allowASUR":
                $('[data-action=habilitation]').click2()
                $.waitFor(`ul.nav>li:contains("Demandes d'habilitation"):visible a:contains("Faire une demande d'habilitation temporaire")`).then($el=>{
                    $.waitFor('h4:contains("Vous avez le rôle")').then(()=>$el.click())
                })
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
                /*
                */
                break
//       ___     _             _      _
//      / __|  _| |__  ___ _ _| |__ _| |__
//     | (_| || | '_ \/ -_) '_| / _` | '_ \
//      \___\_, |_.__/\___|_| |_\__,_|_.__/
//          |__/
            case "cyberlab-getIPP":
                if (message.origin == "https://cyberlab.chu-clermontferrand.fr"){
                    $(frameOrigin).each((i,el)=>el.contentWindow.postMessage(unsafeWindow.currentPatient, "https://cyberlab.chu-clermontferrand.fr"))
                }
                break
            case "cyberlab-getWindowName":
                if (message.origin == "https://cyberlab.chu-clermontferrand.fr"){
                    let cyberlabData = unsafeWindow.currentPatient
                    cyberlabData.windowName = ($(frameOrigin).is('#cyberlabFrame') ? "resultats" : "prescription")
                    $(frameOrigin).each((i,el)=>el.contentWindow.postMessage(cyberlabData, "https://cyberlab.chu-clermontferrand.fr"))
                }
                break

//    ___________.__       .__                  /\  ________
//    \_   _____/|__| ____ |  |__   ____       / /  \______ \   ____   ____
//     |    __)  |  |/ ___\|  |  \_/ __ \     / /    |    |  \ /  _ \_/ ___\
//     |     \   |  \  \___|   Y  \  ___/    / /     |    `   (  <_> )  \___
//     \___  /   |__|\___  >___|  /\___  >  / /     /_______  /\____/ \___  >
//         \/            \/     \/     \/   \/              \/            \/
            case "create-FHR_Channel":
                //console.log('FHR Channel créé', frameOrigin)
                // create a channel
                FHR_channel = new MessageChannel()
                // listen on one end
                FHR_channel.port1.onmessage = async ({data}) => {
                    //console.log("Message de FHR_channel: " + data); // 3
                    if(data == "FHR_getClipboard"){
                        //clipboardContent = await navigator.clipboard.readText()
                        FHR_channel.port1.postMessage(await navigator.clipboard.readText())
                    }
                };
                // send the other end
                frameOrigin.contentWindow.postMessage(JSON.stringify({'command':'FHR_channel-framePort'}), '*', [FHR_channel.port2]); // 1
                break
        }

//       ___ _                                     _                _   _         _
//      / __| |_  __ _ _ _  __ _ ___ _ __  ___ _ _| |_   _ __  __ _| |_(_)___ _ _| |_
//     | (__| ' \/ _` | ' \/ _` / -_) '  \/ -_) ' \  _| | '_ \/ _` |  _| / -_) ' \  _|
//      \___|_||_\__,_|_||_\__, \___|_|_|_\___|_||_\__| | .__/\__,_|\__|_\___|_||_\__|
//                         |___/                        |_|
        if (µ._data && µ._data.PatientId){
            µ.currentPatient = /(?<nom>[A-Z'\s-]*)\s(?<prenom>[A-Z][a-z'\s-]*)\sn/.exec(µ._data.NomPatient).groups
            Object.assign(µ.currentPatient, $('.infosPatient:visible:first').text().match(/le (?<DDN>\d{2}\/\d{2}\/\d{4}\/*).* - IPP : (?<IPP>\d*)/).groups)
            //µ.currentPatient.IPP = $('.infosPatient:visible:first').text().split(' : ')[1]
            //µ.currentPatient.DDN = $('.infosPatient:visible:first').text().split('le ')[1].split(" (")[0]
            µ.currentPatient.sexe = µ._data.PatientSexe == "Femme" ? "f" : "m"
            µ.currentPatient.ID = µ._data.PatientId
            µ.currentPatient.IEP = µ._data.VenueNumero
            console.log('Changement de patient pour : ' + µ.currentPatient.nom + " " + µ.currentPatient.prenom)
            changementContextePatient()
        }
    }


//     ██████  ██████  ████████ ██  ██████  ███    ██ ███████
//    ██    ██ ██   ██    ██    ██ ██    ██ ████   ██ ██
//    ██    ██ ██████     ██    ██ ██    ██ ██ ██  ██ ███████
//    ██    ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
//     ██████  ██         ██    ██  ██████  ██   ████ ███████
//

    if(unsafeWindow == unsafeWindow.top && location.pathname.split("/")[1] != "Login"){
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
  <tr class="option-warningTTT">
   <td>Cacher Warning TTT</td>
   <td>
    <input type="checkbox" name="hide_warningTTT" ${EasilyInfos.hide_warningTTT ? "checked" : ""}>
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



function changementContextePatient(){
    let EasilyInfos = GM_getValue('EasilyInfos',{"user":"", "password":""})
    //<i class='fa fa-carret'></i>
    let $ = unsafeWindow.jQuery
    $('.area-carrousel-wrapper li:not(.menu-links)>a:contains("Liens")').append("<i class='fa fa-caret-down' style='margin-left:5px;'></i>").parent().addClass("menu-links")
        .append("<li class='li_links'></li><li class='li_links'></li>")
    $('.area-carrousel-wrapper li>a:contains("Anapath")').text('Pres Biologie')

    $.waitFor('#module-bioboxes-imagerie').then($el=>{
    $el.not(':has(#xploreFrame)').html("").addClass('xplore_frame').append('<iframe id="xploreFrame" style="width:100%;height:100%" src="https://xplore.chu-clermontferrand.fr/XaIntranet/#/ExternalOpener?login=aharry&name=FicheDemandeRV&target=WindowDefault&param1=CREATE-FROM-NUMIPP&param2='+unsafeWindow.currentPatient.IPP+'">')
    })
    $.waitFor('#module-bioboxes-anapath').then($el=>{
        $el.not(':has(#presBioFrame)').html("").addClass('pres-bio_frame').append('<iframe id="presBioFrame" style="width:calc(100% - 10px);height:calc(100% - 5px)" src="https://cyberlab.chu-clermontferrand.fr">')
    })
    $.waitFor('#module-bioboxes-biologie').then($el=>{
        $el.not(':has(#cyberlabFrame)').html("").addClass('cyberlab_frame').append('<iframe id="cyberlabFrame" style="width:calc(100% - 10px);height:calc(100% - 5px)" src="https://cyberlab.chu-clermontferrand.fr">')
    })

    $('#area-carrousel-1>ul>li:last:not(#synth_patient)').after($('#area-carrousel-1>ul>li:last').clone().attr('id', 'synth_patient').find('a').text('XWay').attr('id','').attr('href', `Lancemodule: SYNTHESE_PAT;${unsafeWindow.currentPatient.IPP};LOGINAD=${EasilyInfos.username}`).end())

    //modules
    // Lancemodule: SYNTHESE_PAT;${IPP};LOGINAD=${username}   == Synthèse Logon
    // Lancemodule: IMAGES_PATIENT;${IPP};LOGINAD=${username}     == PACS
}
