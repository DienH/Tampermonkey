// ==UserScript==
// @name         Easily+
// @namespace    http://tampermonkey.net/
// @version      1.0.260112
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
        GM_setValue('EasilyInfos', {user:"",password:"", nom:"", prenom:"", trajectoirePassword:"", phone:"", defaultsMenusClick:{}});
    }
    let EasilyInfos = GM_getValue('EasilyInfos',{"user":"", "password":""})
    if(typeof EasilyInfos.defaultsMenusClick == "undefined"){
        EasilyInfos.defaultsMenusClick={}
        GM_setValue('EasilyInfos', EasilyInfos)
    }
    var µ = unsafeWindow
    var log = console.log
    µ.currentPatient = {id:'', nom:'', prenom:'',ddn:'', IPP:''}
    if (!$ || !$.fn) {var $ = µ.jQuery || window.jQuery };
    if (!$ || !$.fn) {try{ $ = µ.parent.jQuery || window.parent.jQuery}catch(e){}}
    if (!$ || !$.fn){
        if (location.href.search("cyberlab.chu-clermontferrand.fr")+1){
            window.parent.postMessage(JSON.stringify({command:"cyberlab-reloadFrame"}, '*'))
        }
    }
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
                //console.log(msg.data)
                if(msg.data.IPP){
                    if(window.name == "resultats"){
                        $('#pat_Code').val(msg.data.IPP)
                        $('#lastName').val(msg.data.nom)
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
//      _________ __          .__           ._____________                              ___________             .__.__
//     /   _____//  |_ ___.__.|  |   ____   |__\_   _____/___________    _____   ____   \_   _____/____    _____|__|  | ___.__.
//     \_____  \\   __<   |  ||  | _/ __ \  |  ||    __) \_  __ \__  \  /     \_/ __ \   |    __)_\__  \  /  ___/  |  |<   |  |
//     /        \|  |  \___  ||  |_\  ___/  |  ||     \   |  | \// __ \|  Y Y  \  ___/   |        \/ __ \_\___ \|  |  |_\___  |
//    /_______  /|__|  / ____||____/\___  > |__|\___  /   |__|  (____  /__|_|  /\___  > /_______  (____  /____  >__|____/ ____|
//            \/       \/               \/          \/               \/      \/     \/          \/     \/     \/        \/
            if(!$('#cyberlab_style').length){
                $('<style id="cyberlab_style">').appendTo($('body').addClass('cyberlab_framed')).html(`
                .cyberlab_framed .globalMenu, .cyberlab_framed .contextMenu, .cyberlab_framed #patientHeader, .cyberlab_framed .blockingOverlayOnMobile {display:none}
                body.cyberlab_framed {padding-top:0!important}
                .cyberlab_framed .main {height: 100vh; margin: 0; }
                .cyberlab_framed .main, .cyberlab_framed .dataTables_wrapper {width: calc(100vw - 1.5em)!important;}
                .cyberlab_framed td {overflow:hidden}
                .cyberlab_framed td.value.clickable, .cyberlab_framed .DTFC_scrollBody td:first-child {white-space:nowrap;}
                .cyberlab_framed .DTFC_scroll {left:0!important;width:calc(100vw - 20px)!important;}
                .cyberlab_framed .DTFC_scrollBody {width:calc(100vw - 20px)!important;top:0!important;height:100%!important;}
                .cyberlab_framed .DTFC_scrollBody td.column-result.first, .cyberlab_framed .DTFC_scrollBody td:first-child {height:fit-content!important;border-left:none;}
                .cyberlab_framed .DTFC_scrollBody th.column-result.first {border-left:none;}
                .cyberlab_framed .DTFC_scrollBody div.description {overflow:hidden;}
                .cyberlab_framed .DTFC_LeftWrapper, .cyberlab_framed .DTFC_RightWrapper {display:none!important}
                .cyberlab_framed .DTFC_scroll .column-test {position:sticky!important;left:0!important;z-index:10;border-right:dashed black 1px;}
                .cyberlab_framed .DTFC_scroll .column-norm {position:sticky!important;right:0!important;z-index:10;border-left:dashed black 1px;min-width:90px!important;max-width:90px!important;width:90px!important;}
                .cyberlab_framed .DTFC_scroll thead>tr {position:sticky!important;top:0!important;z-index:20;}
                .cyberlab_framed .DTFC_scroll .row-discipline>td.column-test, .cyberlab_framed .DTFC_scroll .row-section>td.column-test {overflow:visible;border-right:none!important}
                `)
            }
            $('.DTFC_LeftHeadWrapper th').prependTo('.dataTables_scrollHeadInner tr')
            $('.DTFC_LeftBodyWrapper tr>td').each((i,el)=>{
                $(el).prependTo($('.DTFC_scrollBody>table>tbody>tr:eq('+i+')'))
            })
            /**/
            $('.DTFC_RightHeadWrapper th.column-norm').appendTo('.dataTables_scrollHeadInner tr').attr('title', "Norme (Unité)")
            $('.DTFC_RightBodyWrapper tr>td.column-norm').each((i,el)=>{
                $(el).attr('title', $(el).text().trim()+ " " + $(el).next().text().trim()).appendTo($('.DTFC_scrollBody>table>tbody>tr:eq('+i+')')).attr('style', '')
            })
            /*
            */
            $('.DTFC_scrollHead thead').prependTo('.DTFC_scrollBody>table').find('th.column-result:first').addClass('first')
            $('.cyberlab_framed .DTFC_scrollBody div.description').each((i,el)=>{
                if($(el).next().find('.icon').length){
                    $(el).css('width','calc(100% - 20px)')
                }
            })
            $('.DTFC_scrollBody tr:first td, .DTFC_scrollBody th').css('width', 150)
            window.dispatchEvent(new Event('resize'))
            let units = []
            $('td.column-unit').each((i,el)=>{
                units.push($(el).text().trim())
            })
            $('.column-result.first td.value.clickable').each((i,el)=>{
                $(el).attr("title", $(el).text() + units[$(el).closest('.column-result').index('.DTFC_scrollBody>table>tbody>tr>td:nth-child(2)')])
            })
            $('td.column-test').each((i,el)=>{
                $(el).attr("title", $(el).find('div.description').text().trim())
            })
        }


        //Affichage automatique premier résultat
        $.waitFor('#browserTable tbody>tr:first').then($el=>$el.click())

//    __________                    .__   __          __
//    \______   \ ____   ________ __|  |_/  |______ _/  |_  ______
//     |       _// __ \ /  ___/  |  \  |\   __\__  \\   __\/  ___/
//     |    |   \  ___/ \___ \|  |  /  |_|  |  / __ \|  |  \___ \
//     |____|_  /\___  >____  >____/|____/__| (____  /__| /____  >
//            \/     \/     \/                     \/          \/
        let creat = "", CKDEPI = "", IPP = "", friendlyNames={
            "Polynucléaires Neutrophiles (G/l)":"PNN",
            "Ca corrigé/protéines":"Ca/Prot",
            "Protéines":"Prot",
            "Albumine":"Albu",
            "Bilirubine totale":"Bili",
            "Alcool éthylique":"OH",
            Calcium:"Ca",
            Chlore:"Cl",
            Sodium:"Na",
            Potassium:"K",
            "Formule CKDEPI":"DFG",
            "Volume Globulaire Moyen":"VGM",
            "Hémoglobine":"Hb",
            "hCG grossesse":"beta-hCG",
            "Screening toxicologique":"Screen tox"
        }
        try{
            IPP = $('.patientHeader span.identifiers:contains(IPP)').text()
            if(!IPP){
                IPP = $('.patientHeader span.identifiers span[title=IPP]').text()
            } else {
                IPP = IPP.match(/IPP: (?<IPP>\d+?),/).groups.IPP
            }
        }catch(e){
        }


        function getBioResults(test = "defaut", n_results = 0){
            /** @param {String} test - L'analyse biologique à chercher ; "tous" pour tous les résultats, "defaut" pour les résultats standards
              * @param {Number} n_results - Le nombre de résultats à renvoyer par analyse ; 0 pour tous les résultats de l'analyse
 */
            if(!$('th:first #invertSelection').length){return false}
            if(typeof test == "number"){
                n_results = test
                test = "defaut"
            }
            let $tr, $td, result=[], liste_bilans = []
            //construction de la liste des infos des bilans {date, time, status, id}
            $('th.column-result').each((i,th_bilan)=>{
                let bilan={}
                $(th_bilan).find('.sampleCollectionTime, .status, div:not([class])').each((i,info_bilan)=>{
                    if($(info_bilan).is('.status')){
                        bilan.status=$(info_bilan).text()
                    }else if($(info_bilan).is('.sampleCollectionTime')){
                        try{
                            Object.assign(bilan, $(info_bilan).text().match(/(?<date>\d{2}\/\d{2}\/\d{4})(.|\n|\s)?(?<time>\d{2}:\d{2})/).groups)
                        }catch(e){
                            $(info_bilan).log('innerText')
                        }
                    }else{
                        bilan.id = $(info_bilan).text()
                    }
                })
                liste_bilans.push(bilan)
            })

            //construction des résultats
            if (test == "default" || test == "defaut" || test == "all" || test == "tous"){
                let defauts_tests=`Na, K, Cl, Prot, Ca, Ca/Prot, Urée, Créatinine, DFG, Glucose,
                Bili, ASAT, ALAT, GGT, PAL, OH, Albu, CRP, TSH, beta-hCG, Globules Blancs, Hb, VGM,
                Plaquettes, PNN, INR, Screen tox`
                .split(",").map(t=>t.trim())
                let $tests_list = $('.DTFC_scroll td.column-test'), $test_sodium = $tests_list.filter(':contains(Sodium)'), Na_row_index = $tests_list.index($test_sodium), results = {}
                $tests_list= $tests_list.gt(Na_row_index - 1)
                $tests_list.each((i,el)=>{
                    let test_name = $(el).find('.description').text().trim().replace(/[\u200B-\u200F]/g, '')
                    test_name = friendlyNames[test_name] ?? test_name
                    if((test == "default" || test == "defaut") && !defauts_tests.includes(test_name)){return}
                    if(typeof results[test_name] == 'undefined'){
                        results[test_name]=[]
                    }
                    let $tds = $(el).siblings('.column-result')
                    $tds.each((j,el2)=>{
                        let ind=$(el2).data('column') || $tds.index(el2)
                        results[test_name][ind*100+$(el2).data('row')] = {value:$(el2).find('td.clickable').text().trim(), date:liste_bilans[ind].date+" "+liste_bilans[ind].time}
                    })
                })
                for (let test in results){
                    results[test]=results[test].filter(Boolean)
                    if(n_results> 1){
                        results[test]=results[test].filter((el,i)=>{
                            return (i < n_results)
                        })
                    } else if (n_results === 1){
                        results[test]=results[test][0]
                    }
                }
                return results
                //console.log(results)
            } else {
                $td=$()
                $('.DTFC_scroll td.column-test:contains("' + test + '")').each((i,el)=>{
                    $tr = $(el).parent()
                    $td=$td.add($tr.find('td.clickable'))
                    /*
                    if($td.parents('td').index()<n_results){
                        more_recent=$td.parents('td').index()
                        creat=$td.text().trim()}
                        */
                })
                /*
                if(n_results){
                    if(typeof n_results == 'number'){
                        $td = $td.lt(n_results)
                    } else{
                        return false
                    }
                }
                */
                $td.log().each((i,el)=>{
                    let ind=$(el).closest('td.column-result').data('column')
                    result[ind*100+$(el).closest('td.column-result').data('row')] = {value:$(el).text().trim(),date:liste_bilans[ind].date+" "+liste_bilans[ind].time}
                })
                result = result.filter(Boolean)
                if(n_results){
                    result = result.slice(0, n_results)
                }
                return result.length<2 ? result[0].value : result
            }
        }

//       _____  .__                 __
//      /  _  \ |  |   ____________/  |_
//     /  /_\  \|  | _/ __ \_  __ \   __\
//    /    |    \  |_\  ___/|  | \/|  |
//    \____|__  /____/\___  >__|   |__|
//            \/          \/
        function alertResults(show_alert = false){
            if(!$('th:first #invertSelection').length){return false}
            if(show_alert){
                let alert_text="Valeurs hors des normes sur le dernier bilan :\n\n"
                $('.highflag, .lowflag, .veryhighflag, .verylowlag', 'td.column-result.first').each((i,el)=>{
                    alert_text+=$(el).closest('td.column-result.first').prev().find('.description').text().trim() + " : " + $(el).text().trim()+ " ("+ ($(el).is('.highflag') ? "élevé" : ($(el).is('.veryhighflag') ? "élevé" : ($(el).is('.lowflag') ? "faible" : "très faible"))) + ")\n"
                })
                alert(alert_text)
            } else {
                let wrong_values = {}

                $('.highflag, .lowflag, .veryhighflag, .verylowlag', 'td.column-result.first').each((i,el)=>{
                    wrong_values[$(el).closest('td.column-result').prev().find('.description').text().trim().replace(/[\u200B-\u200F]/g, '')] = {
                        value:$(el).text().trim(),
                        alert:$(el).is('.highflag') ? "élevé" : ($(el).is('.veryhighflag') ? "élevé" : ($(el).is('.lowflag') ? "faible" : "très faible")),
                        norme:$(el).closest('td.column-result').siblings('.column-norm').text().trim()
                    }
                })
                return wrong_values
            }
        }
        unsafeWindow.getBioResults = getBioResults
        if(IPP){
            setTimeout(()=>{
                window.parent.postMessage(JSON.stringify({command:"cyberlab-lastBio", IPP:IPP, bio:getBioResults(1)}), "*")
                window.parent.postMessage(JSON.stringify({command:"cyberlab-alertBio", IPP:IPP, alert:alertResults()}), "*")
            }, 1000)
        }
        setTimeout(alertResults, 500)
        setTimeout(()=>{µ.location.reload()},480000)
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
        //console.log((location.pathname + location.hash) == "/XaIntranet/#/UserLogin")
        if((location.pathname + location.hash) == "/XaIntranet/#/UserLogin"){
            $.waitFor('#txtUSERNAME input').then(el=>{
                $(el).val(EasilyInfos.username).each((i,elem)=>{
                    $(elem).on('change', ev=>{
                        $('#txpPASSWORD input').val(EasilyInfos.password).each((j,elem2)=>{
                            $(elem2).on('updateValueFromGrid', ev2=>{
                                setTimeout(()=>$('#btnVALIDER>a').click2(), 100)
                            })
                            elem2.dispatchEvent(new Event('change'))
                            elem2.dispatchEvent(new Event('updateValueFromGrid'))
                            /**/
                        })
                    })
                    elem.dispatchEvent(new Event('change'))
                    elem.dispatchEvent(new Event('updateValueFromGrid'))
                })
            })
        }
        return true
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

            //Cacher automatiquement l'alerte sur les EI des traitements
            if(EasilyInfos.hide_warningTTT){
                $.waitFor('#SyntheseSignaux', 5000).then($el=>{
                    $el.find('#btnEnregistrer').click()
                }).catch(err=>err)
            }

            //Signature rapide
            if($(ev.target).is('div.Alignement:contains(Mot de passe)')){
                if($('#UtilisateurLogin').val() == EasilyInfos.username){
                    $('#UtilisateurPassword').val(EasilyInfos.password)
                    $('#SignatureBox #btnSigner').click2()
                }
            } else if($(ev.target).is('.SignatureAction div:has(#UtilisateurPassword)')){
                if($('#UtilisateurLogin').val() == EasilyInfos.username){
                    $('#UtilisateurPassword').val(EasilyInfos.password)
                    $('.SignatureAction #btnContinuer').click2()
                }
            }
        })
        $('#btnEnregistrer:contains(Continuer)').click()
    }



//     █████   ██████  ███████ ███    ██ ██████   █████
//    ██   ██ ██       ██      ████   ██ ██   ██ ██   ██
//    ███████ ██   ███ █████   ██ ██  ██ ██   ██ ███████
//    ██   ██ ██    ██ ██      ██  ██ ██ ██   ██ ██   ██
//    ██   ██  ██████  ███████ ██   ████ ██████  ██   ██


    else if(location.href.search("easilynlb-prod.chu-clermontferrand.fr/Agenda/Agenda.Web")+1){
        function createFastActions(){
            $('div.event.chip:not(.fastActionMiddleClick)').on('mouseup', ev=>{
                if(ev.which == 2){
                    $(ev.currentTarget).contextmenu()
                    $.waitFor('ul.context-menu-root:visible').then($el=>{
                        if(ev.shiftKey){
                            let rdvInfos = {}
                            rdvInfos.date = $(ev.currentTarget).closest('td').a('abbr')
                            let rdvTitle = $(ev.currentTarget).attr('title')
                            try{
                                Object.assign(rdvInfos, rdvTitle.match(/^(?<type>.+?) \(.+?\)\n.*\n(?<heure>.*)(\n|.)*Statut \: (?<statut>.*)\n/).groups)
                                if(rdvInfos.statut != "Réalisé"){
                                    return
                                }
                                let CoraDefault = GM_getValue('CoraDefault',{})
                                if(CoraDefault[rdvInfos.type]){
                                    rdvInfos.lieu = CoraDefault[rdvInfos.type].lieu
                                    rdvInfos.acte = CoraDefault[rdvInfos.type].acte
                                }
                                rdvInfos.date = $(ev.currentTarget).closest('td').a('abbr')
                                Object.assign(rdvInfos, rdvInfos.heure.match(/(?<heure>\d\d\:\d\d).*\((?<duree>\d{2})min\)/).groups)
                                //setTimeout($el2=>$el2.find('.icon-patEasily').trigger('mouseup'), 500, $el)
                                $el.find('.icon-selectPat').trigger('mouseup')
                                window.parent.postMessage(JSON.stringify({command:"agenda-Codage", "rdv_infos":rdvInfos}), "*")
                            }catch(e){
                            }
                        } else {
                            $el.find('.icon-selectPat').trigger('mouseup')
                            window.parent.postMessage(JSON.stringify({command:"agenda-OpenDossier"}), "*")
                        }
                    })
                }
            }).addClass('fastActionMiddleClick')
            $('#dvCalMain').off('mouseover', ".event", createFastActions)
        }
        function waitForCreateFastActions(){
            $.waitFor('#loading-indicator-navigationContenu:visible').then($el=>{
                $.waitFor('!#loading-indicator-navigationContenu').catch(err=>{
                    createFastActions()
                })
            })
        }
        $.waitFor('.rsNextDay, .rsPrevDay, .rsToday').then(()=>{
            $('.rsNextDay, .rsPrevDay, .rsToday').on('mouseup', ev=>{
                if(ev.which == 1){
                    waitForCreateFastActions()
                }
            })
        })
        $.waitFor("#navigationChoixAgenda .k-input:visible").then($el=>{
            if(!$('#agendasPrefs').length){
                $('#navigationChoixAgendaListe')
                    .after($('<div id="agendasPrefs" style="display:inline-block;" title="Agendas sauvegardés"></div'))
                    .after($('<span id="removeAgendasPrefs" class="fa fa-minus-square"></span>').hide().click(ev=>{
                    let current_planning = $('#navigationChoixAgenda .k-input').text()
                    $('#agendasPrefs [value="'+current_planning+'"]').remove()
                    $(ev.target).hide()
                    $('#addAgendasPrefs').show()
                    let CS_prefs = GM_getValue("CS_prefs", [])
                    for (let k in CS_prefs){
                        if(CS_prefs[k].long == current_planning){
                            CS_prefs.splice(k, 1)
                        }
                    }
                    GM_setValue("CS_prefs", CS_prefs)
                })).after($('<span id="addAgendasPrefs" class="fa fa-plus-square"></span>').click(ev=>{
                    let current_planning = {long:$('#navigationChoixAgenda .k-input').text()}
                    current_planning.short = current_planning.long.match(/^(?<nom>[A-Z]+)/).groups.nom
                    $('#agendasPrefs').append($('<button value="'+current_planning.long+'">'+current_planning.short+'</button>').click(ev=>{
                        let $planning_selector = $('#navigationChoixAgenda>.k-dropdown'), selected_planning = $(ev.target).value
                        if($planning_selector.text() == selected_planning){
                            return
                        }
                        $planning_selector.click()
                        $.waitFor('.comboAgendaSection:visible', 5000).then(()=>{
                            $('.comboAgendaItem:contains('+selected_planning+')').click()
                        }).catch(err=>log(err))
                    }).contextmenu(ev=>{
                        ev.preventDefault()
                        $(ev.target).attr('contenteditable', 'true').focus().on('blur', ev=>{
                            let CS_prefs = GM_getValue("CS_prefs", [])
                            $(ev.target).attr('contenteditable',false).off('blur')
                            for (let k in CS_prefs){
                                if(CS_prefs[k].long == $(ev.target).val()){
                                    console.log($(ev.target).text())
                                    CS_prefs[k].short = $(ev.target).text()
                                    GM_setValue("CS_prefs", CS_prefs)
                                    return
                                }
                            }
                        })
                    }))
                    $(ev.target).hide()
                    $('#removeAgendasPrefs').show()
                    let CS_prefs = GM_getValue("CS_prefs", [])
                    CS_prefs.push(current_planning)
                    GM_setValue("CS_prefs", CS_prefs)
                }))
                let CS_prefs = GM_getValue("CS_prefs", [])
                for (let k in CS_prefs){
                    $('#agendasPrefs').append($('<button contenteditable value="'+CS_prefs[k].long+'">'+CS_prefs[k].short+'</button>').click(ev=>{
                        let $planning_selector = $('#navigationChoixAgenda>.k-dropdown'), selected_planning = $(ev.target).val()
                        if($planning_selector.text() == selected_planning){
                            return
                        }
                        $planning_selector.click()
                        $.waitFor('.comboAgendaSection:visible', 5000).then(()=>{
                            $('.comboAgendaItem:contains('+selected_planning+')').click()
                        }).catch(err=>log(err))
                    }).contextmenu(ev=>{
                        ev.preventDefault()
                        $(ev.target).on('blur', ev=>{
                            let CS_prefs = GM_getValue("CS_prefs", [])
                            $(ev.target).off('blur')
                            for (let k in CS_prefs){
                                if(CS_prefs[k].long == $(ev.target).val()){
                                    CS_prefs[k].short = $(ev.target).text()
                                    GM_setValue("CS_prefs", CS_prefs)
                                    return
                                }
                            }
                        })
                        //setTimeout($el=>$el.focus(), 500, $(ev.target))
                    }))
                    let current_planning = $('#navigationChoixAgenda .k-input').text()
                    if(CS_prefs[k].long == current_planning){
                        $('#removeAgendasPrefs').show()
                        $('#addAgendasPrefs').hide()
                    }
                }
            }
        })
        $(window).on('click', ev=>{
            createFastActions()
        })
        $('#dvCalMain').on('mouseover', ".event", createFastActions)
        $('.filtreDispoType').on('contextmenu', ev=>{
            ev.preventDefault()
            if($('#CodageCoraPrefs').length){
                $('#CodageCoraPrefs').dialog('open')
            } else {
                let $codagePrefs = $('<div id="CodageCoraPrefs"></div>').append(`
<table>
 <thead>
  <tr>
   <th style="width:200px">Planning</th>
   <th>Acte par défaut</th>
   <th>Lieu par défaut</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td></td>
   <td>
    <select name="acte"">
     <option value="">---Aucun---</option>
     <option value="E" title="E">Entretien patient</option>
     <option value="EOS" title="EOS">Entretien obligation de soin</option>
     <option value="ECUS" title="ECUS">Entretien au lit du patient (liaison)</option>
     <option value="E+AMI" title="E+AMI">Entretien + Acte infirmier</option>
     <option value="E+ECG" title="E+ECG">Entretien + ECG</option>
     <option value="EA - EF" title="EA - EF">Entretien famille</option>
     <option value="ESK" tilte="ESK">Eskétamine</option>
    </select>
   </td>
   <td>
    <select name="lieu"">
     <option value="">---Aucun---</option>
     <option value="L02" title="L02">Lieu de soins psychiatriques</option>
     <option value="L07" title="L07">Domicile</option>
     <option value="L09" title="L09">Unité hospitalisation somatique (MCO, SSR, USLD)</option>
     <option value="L10" title="L10">Urgences</option>
    </select>
   </td>
  </tr>
</tbody></table>`)
                $codagePrefs.dialog({
                    modal:true,
                    autoOpen:false,
                    title:"Paramétrage codage rapide Cora",
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
                                let CodagePrefs = {}
                                $(this).find('tr').each((i, el)=>{
                                    let $tds = $('td', el)
                                    CodagePrefs[$tds.eq(0).data('nom_planning')]={lieu:$tds.eq(2).find('select').val(), acte:$tds.eq(1).find('select').val()}
                                })
                                GM_setValue("CoraDefault", CodagePrefs)
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
                let CodagePrefs = GM_getValue("CoraDefault")
                $('.filtreRendezVousType .itemLibelle').each((i,el)=>{
                    try{
                        let planning_name = $(el).text(), planning_uf = planning_name.match(/\((?<codeUF>\d{4})\)/).groups.codeUF
                        $codagePrefs.find('tbody>tr:last')
                            .find('td:first').text(planning_name.split(' (')[0].split('_').map(t=>t.capitalize()).join(' ')).attr('title', "UF : " + planning_uf).data('codeUF', planning_uf).attr('data-nom_planning', planning_name.split(' (')[0])
                            .end().clone().appendTo($codagePrefs.find('tbody'))
                    }catch(e){
                    }
                })
                for (let planning in CodagePrefs){
                    $codagePrefs.find('[data-nom_planning="'+planning+'"]').parent().find('[name=lieu]').val(CodagePrefs[planning].lieu).end().find('[name=acte]').val(CodagePrefs[planning].acte).end()
                }
                $codagePrefs.find('tbody>tr:last').remove()
                $codagePrefs.dialog('open')
            }
        })

        let $style = $('#EasilyPlus_Style')
        if(!$style.length){
            $('body').append($style = $('<style id="EasilyPlus_Style">'))
        }
        $style.html(`
        .btn-success {background: forestgreen!important;color: white!important;border-radius: 3px;}
        .btn-danger {background: indianred!important;color: white!important;border-radius: 3px;}
        #addAgendasPrefs {vertical-align: middle; padding: 0 5px; font-size: medium; cursor:pointer;}
        #addAgendasPrefs:hover {color:green}
        #removeAgendasPrefs {vertical-align: middle; padding: 0 5px; font-size: medium; cursor:pointer;}
        #removeAgendasPrefs:hover {color:red}
    `)
    // Agenda
    //css : background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKXSURBVDiNfZJdSFMBGIbfM6c7rvbTNjeVRKeFPxPU8kJkFUqNakQR3nTTReGNlwU2qQslPRgzsAjLFuSKUd4JEgtH1DQwYiIEp9nc9Bzb3ETtJLFxpjvndNNNbu65ffkeeL/vIwwGwyW1Wm1FHkRRFBiGcQFY3Z8RbW1tax6PpyKfgOd5dHV1+YLBoG1/JtPr9ZLJZALHcdjZ2UF1dTVEUQTHceA4DqlUCg0NDTAajclccjkA+Hw+TLjfYn19Db4ZL0KhEKLRKABApVKhsbERPT09n/1+f24BQRBIp3lk9vZAEATC4TBomoZarYbT6QQAKJXKTM5+drudTafTUiQSkRiGkQ7CarVOH1iBpmkMPxgBIOGV+yXGx8extLQEiqLgdI5sffkaEEPLKydIUnWK5//M/bdEAGAYBnWWVhCyIvA8j5aWFoyOjuLGze6tsuaL2ntj743umeXyk9bOSaVS2ZolMJvN+EEHQEh7IEkSGo0GLMviUEklYWlul0uiiNdjg7g95CorKascyKpQX18PiroPmUwGhUIBk8mEaDQKjc4kdz3sQ/znCmxXrkOjNUBWIFdlCbxeL549n8BGIgb/pw+YnZ2FzWbDt3nHbt+jKcTYMGrqmuCbcifTqd+/sgQAQJLFKCwsBADE43E4HA4MDw1o7t66ulFxrKnA83SQj6/Qh892dpyZeTe9mtjmOgAwsNvtbDKZlAKBgLS4uJh1PlEUpVgsJlkslrny0tLHF063b39/80RqPl4VBlAl39zcJILBIABAEAQsLCxk3TqTyUAQhNR6IkEdKS46lxEE3eRgb83lXmqa0Ol057VabUfOL/uHIAi7LMu6AKwBKLWYj37s775W2/9iMpJvLh+68hL9HYVCUfsXADA9PQZbgT0AAAAASUVORK5CYII=);
    /*
// association d'un menu à sa plage horaire

// ouverture fiche patient pour récupérer IPP
*/
    }


//    ████████ ██████   █████  ███    ██ ███████ ███    ███ ██ ███████ ███████ ██  ██████  ███    ██ ███████
//       ██    ██   ██ ██   ██ ████   ██ ██      ████  ████ ██ ██      ██      ██ ██    ██ ████   ██ ██
//       ██    ██████  ███████ ██ ██  ██ ███████ ██ ████ ██ ██ ███████ ███████ ██ ██    ██ ██ ██  ██ ███████
//       ██    ██   ██ ██   ██ ██  ██ ██      ██ ██  ██  ██ ██      ██      ██ ██ ██    ██ ██  ██ ██      ██
//       ██    ██   ██ ██   ██ ██   ████ ███████ ██      ██ ██ ███████ ███████ ██  ██████  ██   ████ ███████
//
//
    else if (location.pathname == "/Module/DS_TC/JDT/Index"){
        function checkTransOpen (){
            $.waitFor('#inputopen:visible').then($el=>{
                $el.not(':checked').click()
                $('thead .glyphicon-triangle-right').click()
                let transmissions = {},
                    transIncompletes={}
                $('table.table>tbody>tr').each((i,el)=>{
                    let infosPatient = $('.tdPat', el).text().trim().match(/(?<nom>([A-Z]|\s|-)+) (?<prenom>([A-Z][a-z]+|\s|-)+) (?<ddn>[0-9]{2}\/[0-9]{2}\/[0-9]{4})/).groups,
                        nchambre=$('span[data-bind="text:NumeroLit"]', el).text().trim()
                    transmissions[nchambre]={patient:infosPatient,trans:{}}
                    transIncompletes[nchambre] = {}
                    $('.svg-elts-form', el).each((i,el2)=>{
                        let $infos=$($(el2).data('title')).find('ul'),
                            transInfo={title:$infos.find('li.tool-title').text(),date:$infos.find('li.tool-info:eq(0)').text().split(' (')[0]}
                        if(typeof transmissions[nchambre].trans[transInfo.date + '-' + transInfo.title] == "undefined"){
                            if($infos.find('li.tool-title-c').length){
                                $infos = $infos.find('tr:eq(1)')
                                let tmpData=$infos.find('td:eq(0)').text(), tmpAction = $infos.find('td:eq(1)').text(), tmpResultat=$infos.find('td:eq(2)').text()
                                Object.assign(transInfo, {
                                    type:'cible',
                                    data:tmpData,
                                    action:tmpAction,
                                    resultat:tmpResultat
                                })
                                //récupération des transmissions incomplètes
                                if(tmpData.slice(-3) == "..." || tmpAction.slice(-3) == "..." ||tmpResultat.slice(-3) == "..."){
                                    transIncompletes[nchambre][transInfo.date + '-' + transInfo.title] = $(el2)
                                }
                            }else if($infos.find('li.tool-title-mc').length){
                                switch(transInfo.title){
                                    /*
                                    case "Macro cible PERMISSION":
                                        break
                                        */
                                    default:
                                        $('div.macro-struct-title', $infos).each((i,el3)=>{
                                            let infodata=''
                                            $(el3).next().find('dt').log('innerText').each((j,el4)=>{
                                                infodata += $(el4).text().trim() + " : " + $(el4).next().text().trim() + "<br>"
                                            })
                                            transInfo[i+"_"+$(el3).text()] = infodata
                                        })
                                        Object.assign(transInfo, {
                                            type:'macrocible'
                                        })
                                }
                                //log($infos.html())
                            }
                            transmissions[nchambre].trans[transInfo.date + '-' + transInfo.title ] = transInfo
                        }
                    })
                })
                let transIncompletesArray = []
                for(let chambre in transIncompletes){
                    for(let trans in transIncompletes[chambre]){
                        transIncompletesArray.push({title:trans, lit:chambre, $el:transIncompletes[chambre][trans]})
                    }
                }
                //console.log(transIncompletesArray)
                completeFullTrans(transmissions, transIncompletesArray)

                unsafeWindow.transmissions = transmissions
            })
        }
        function completeFullTrans(transCompletes, listeTransIncompletes){
            if(listeTransIncompletes.length){
                if(!$('#completeTransStyle').length){ //cacher le modal de détail de transmissions qui va s'afficher pour récupérer les détails complets des trans incomplètes
                    $('body').append($('<style id="completeTransStyle">').html(`
                    #CibleModalEdit, .modal-backdrop {visibility:hidden;}
                    `))
                }

                let transIncomplete = listeTransIncompletes.shift(), infos={}
                transIncomplete.$el.click()
                $.waitFor('#CibleModalEdit[style*=block]:has(.sbloc>.row>div)').then($el=>{
                    $el.find('.sbloc>.row>div').each((i,el)=>{
                        infos[i == 0 ? "data": (i == 1 ? "action" : "resultat")] = $(el).text().trim()
                    }).end().find('button.close').click()
                    Object.assign(transCompletes[transIncomplete.lit].trans[transIncomplete.title], infos)
                    if(0){
                        $.waitFor('#CibleModalEdit[style*=none]').then($el2=>{
                            completeFullTrans(transCompletes, listeTransIncompletes)
                        })
                    } else {
                        $.waitFor('#CibleModalEdit[style*=none]', {checkFrequency:100}).then($el2=>setTimeout(()=>{completeFullTrans(transCompletes, listeTransIncompletes)}, 300))
                    }
                })
            } else { // transmissions complétées
                $('#completeTransStyle').remove() //rafficher le modal de détail de transmissions
                transCompletes = Object.fromEntries(Object.entries(transCompletes).sort())
                let $transTable = $('<table id="transTable"><thead><tr><th>Chambre</th><th>Transmission</th><th>Infos</th></tr></thead><tbody>')
                for(let chambre in transCompletes){
                    let transChambre = transCompletes[chambre], n_trans = Object.keys(transChambre.trans).length, i = 0

                    for (let k_trans in transChambre.trans){
                        let $patientTransRow = i == 0
                        ? $("<tr class='trans-trans trans-chambre'><td rowspan="+n_trans+" class='trans-patient'>Ch. "+chambre+"<br>"+transChambre.patient.nom+ " " + transChambre.patient.prenom+"<br>né(e) le "+transChambre.patient.ddn+"</td>")
                        : $("<tr class='trans-trans'>"),
                            $k_transTable = $('<td>'+transChambre.trans[k_trans].title+'<br>'+transChambre.trans[k_trans].date+'</td><td><table class="trans-infos"><tbody>')
                        for (let t of ['data', 'action', 'resultat']){
                            if(transChambre.trans[k_trans][t]){
                                $k_transTable.find('tbody').append('<tr class="trans-data"><td class="trans-type">'+(t == "data" ? "Donnée" : t.capitalize())+'</td><td class="trans-value">'+transChambre.trans[k_trans][t]+'</td>')
                            }
                        }
                        $patientTransRow.append($k_transTable)
                        $transTable.append($patientTransRow)
                        //console.log(transChambre.trans[k_trans])
                        i++
                    }
                }
                console.log(transCompletes)
                console.log($transTable[0])
                µ.$transTable = $transTable
                $('[data-bind*=ListePatients]>div:last-child:not(#transLines)').id('transLines').after($transTable)
                let timeLineSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M192 233.3C220.3 221 240 192.8 240 160C240 115.8 204.2 80 160 80C115.8 80 80 115.8 80 160C80 192.8 99.7 221 128 233.3L128 288L64 288C46.3 288 32 302.3 32 320C32 337.7 46.3 352 64 352L288 352L288 406.7C259.7 419 240 447.2 240 480C240 524.2 275.8 560 320 560C364.2 560 400 524.2 400 480C400 447.2 380.3 419 352 406.7L352 352L576 352C593.7 352 608 337.7 608 320C608 302.3 593.7 288 576 288L512 288L512 233.3C540.3 221 560 192.8 560 160C560 115.8 524.2 80 480 80C435.8 80 400 115.8 400 160C400 192.8 419.7 221 448 233.3L448 288L192 288L192 233.3z"/></svg>`,
                    tableSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM160 160L160 224L224 224L224 160L160 160zM480 160L288 160L288 224L480 224L480 160zM160 288L160 352L224 352L224 288L160 288zM480 288L288 288L288 352L480 352L480 288zM160 416L160 480L224 480L224 416L160 416zM480 416L288 416L288 480L480 480L480 416z"/></svg>`
                $('<div id="trans-toggleAffichage"><div class="trans-affichageTable">'+tableSVG+'Afficher en tableau</div><div class="trans-affichageTimeline">'+timeLineSVG+'Afficher en Timeline</div></div>').appendTo('.nav-filter').click(ev=>{
                    $('body').toggleClass('trans-viewTable')
                })
                /*
                <div id="trans-toggleAffichage"><label><i class="fa fa-table"></i>Afficher en tableau</label></div>
                */
            }
        }
        window.addEventListener('message', ev=>{
            let messageEvData
            if (typeof ev.data == "object"){
                messageEvData = ev.data
            } else{
                try {
                    messageEvData = JSON.parse(ev.data)
                }catch(e){
                    console.log('Error parsing data', ev.data)
                    return null
                }
            }
            if(messageEvData && messageEvData.cr && messageEvData.uf){
                $('.nav-cr-uf-secteur span.f_cr').parent().find('select').each((i,el)=>{
                    if($(el).val() != messageEvData.cr){
                        $(el).val(messageEvData.cr).change()
                        $.waitFor('.nav-cr-uf-secteur span.f_uf').then($el=>{
                            $el.parent().find('select').each((i,el)=>{
                                if($(el).val() != messageEvData.uf){
                                    $(el).val(messageEvData.uf).change()
                                }
                            })
                        })
                        $.waitFor('div.loader:visible', 1000).then(
                            $el=>$.waitFor('div.loader:not(:visible)').then($el2=>checkTransOpen())
                        ).catch(err=>err)
                    } else {
                        $('.nav-cr-uf-secteur span.f_uf').parent().find('select').each((i,el)=>{
                            if($(el).val() != messageEvData.uf){
                                $(el).val(messageEvData.uf).change()
                            } else {
                                checkTransOpen()
                            }
                        })
                        $.waitFor('div.loader:visible', 1000).then(
                            $el=>$.waitFor('div.loader:not(:visible)').then($el2=>checkTransOpen())
                        ).catch(err=>err)
                    }
                })
            }
        })
        $(window).on('click',ev=>{
            if($(ev.target).filter('[data-bind="foreach:Days"] .glyphicon:visible').length){
                log(ev)
                $.waitFor('div.loader:visible', 1000).then(
                    $el=>$.waitFor('div.loader:not(:visible)').then($el2=>checkTransOpen())
                ).catch(err=>err)
            }
        })
        window.parent.postMessage(JSON.stringify({command:"transmissions_get-CR-UF"}))
        $('body').not(':has(#EasilyPlus_Style)').append($('<style id="EasilyPlus_Style">').html(`
    nav.navbar, .nav-cr-uf-secteur {display:none;}
    #module-ds-tc-jdt .table-residents>table>tbody {height: calc(100vh - 110px) !important;}
    table.table {margin-bottom:0!important}
    #trans-toggleAffichage {position: absolute; right: 260px; top: 10px;}
    #trans-toggleAffichage, #trans-toggleAffichage>div {cursor:pointer;}
    #trans-toggleAffichage>.trans-affichageTable>i {font-size: 25px; position: absolute; top: -4px; left: -26px;}
    #trans-toggleAffichage svg {width: 20px;position: absolute;left: -24px;top: -2px;}
    #transTable {width:100%; font-size:14px;display:none;}
    .trans-infos {width: 100%;}
    .trans-type {padding: 2px 5px; width: 80px;}
    .trans-data {border-bottom: 1px dashed black;}
    .trans-data:last-child {border-bottom: none;}
    .trans-trans {margin-bottom:5px;border-bottom:1px solid black;}
    .trans-trans>td {padding: 5px;}
    .trans-chambre {border-top:2px solid black;}
    .trans-viewTable #transLines {display:none}
    .trans-viewTable #transTable {display:table}
    .trans-viewTable {overflow:visible}

    .trans-affichageTimeline {display:none}
    .trans-viewTable .trans-affichageTimeline {display:initial}
    .trans-affichageTable {display:initial}
    .trans-viewTable .trans-affichageTable {display:none}
    `))
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
        if(location.pathname.match(/^\/Dominho\/Main/i)){
            $('#specialiteSelection').parent().append($('<button class="BoutonClassique"><span title="Documents de Psychiatrie">Psychiatrie</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Psychiatrie)').click()
            })).append($('<button class="BoutonClassique" style="margin-left:5px;"><span title="FHR de Psychiatrie">FHR</span>').click(ev=>{
                if(!$('#formulaireSelection li[onclick]:contains(FHR Observation Médicale - Psychiatrie)').click().length){ // ouvrir si présent dans les raccourcis
                    $('#selectedDossierSpecialite-list li>span:contains(Psychiatrie)').click()
                    $.waitFor('#groupSelection li[onclick]:contains(Observations Médicales)').then($el=>{
                        $el.click()
                        $.waitFor('#formulaireSelection li[onclick]:contains(FHR Observation Médicale - Psychiatrie)').then($el2=>{
                            $el2.click()
                        })
                    })
                }
            })).append($('<button class="BoutonClassique" style="margin-left:5px;"><span title="Observation de Liaison">Liaison</span>').click(ev=>{
                if(!$('#formulaireSelection li[onclick]:contains(Fiche de Consultation Psy de Liaison)').click().length){ // ouvrir si présent dans les raccourcis
                    $('#selectedDossierSpecialite-list li>span:contains(Psychiatrie)').click()
                    $.waitFor('#groupSelection li[onclick]:contains(Observations Médicales)').then($el=>{
                        $el.click()
                        $.waitFor('#formulaireSelection li[onclick]:contains(Fiche de Consultation Psy de Liaison)').then($el2=>{
                            $el2.click()
                        })
                    })
                }
            })).append($('<button class="BoutonClassique" style="margin-left:5px;"><span title="Observation de Consultation">Consult</span>').click(ev=>{
                if(!$('#formulaireSelection li[onclick]:contains(Fiche de Consultation Psy):first').click().length){ // ouvrir si présent dans les raccourcis
                    $('#selectedDossierSpecialite-list li>span:contains(Psychiatrie)').click()
                    $.waitFor('#groupSelection li[onclick]:contains(Observations Médicales)').then($el=>{
                        $el.click()
                        $.waitFor('#formulaireSelection li[onclick]:contains(Fiche de Consultation Psy):first').then($el2=>{
                            $el2.click()
                        })
                    })
                }
            })).append($('<button class="BoutonClassique" style="margin-left:5px;"><span title="Ordonnance de Psy">Ordo</span>').click(ev=>{
                if(!$('#formulaireSelection li[onclick]:contains(Ordonnance \(Autre\) Psy)').click().length){ // ouvrir si présent dans les raccourcis
                    $('#selectedDossierSpecialite-list li>span:contains(Psychiatrie)').click()
                    $.waitFor('#groupSelection li[onclick]:contains(Ordonnances)').then($el=>{
                        $el.click()
                        $.waitFor('#formulaireSelection li[onclick]:contains(Ordonnance \(Autre \) Psy)').then($el2=>{
                            $el2.click()
                        })
                    })
                }
            })).append($('<button class="BoutonPrincipal" style="margin-left:5px;"><span title="Documents Communs">Commun médical</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Commun Médical)').click()
            })).append($('<button class="BoutonPrincipal" style="margin-left:5px;"><span title="Bon de Transport">BdT</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Commun Médical)').click()
                $.waitFor('#groupSelection li[onclick]:contains(Cerfa)').then($el=>{
                    $el.click()
                    $.waitFor('#formulaireSelection li[onclick]:contains(Demande transport)').then($el2=>{
                        $el2.click()
                    })
                })
            })).append($('<button class="BoutonPrincipal" style="margin-left:5px;"><span title="Documents Cerfas">Cerfas</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Commun Médical)').click()
                $.waitFor('#groupSelection li[onclick]:contains(Cerfa)').then($el=>{
                    $el.click()
                })
            }))
        } else if(location.pathname.match(/^\/(d|D)ominho\/(f|F)iche\/((O|o)pen|(C|c)reate)/i)){
            if(!unsafeWindow._currentContext){return}
            let docType = $('head>title').text().split(' -')[0]
            //Expension des catégories "Contexte", "Sejour" et "Sortie" avec simple click
            $('.fm_grid_cell.fm_group_header.fm_group_header_lightgray, .fm_grid_cell.fm_group_header.fm_group_header_default').off().click(ev=>{
                //console.log($(ev.target).is('div.fm_group_header_expander'), $(ev.delegateTarget).find('div.fm_group_header_expander.image_expanded_png'))
                if(!$(ev.target).is('div.fm_group_header_expander') && !$(ev.target).closest('[fm-css-image="image_plus_png"]').length){
                    $(ev.delegateTarget).find('div.fm_group_header_expander').click()
                    ev.preventDefault()
                }
            }).css('cursor','pointer').filter('.fm_group_header_default:contains(Histoire de la maladie)').add('.fm_grid_cell.fm_group_header.fm_group_header_warning').click()
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
                //console.log(µ.getFHR_Clipboard)
                }
            }
            switch(unsafeWindow._currentContext.FicheTitle){
                case 'FHR Observation Médicale - Psychiatrie':
//    ______________ _____________
//    \_   _____/   |   \______   \
//     |    __)/    .    \       _/
//     |     \ \    Ý    /    |   \
//     \___  /  \___|_  /|____|_  /
//         \/         \/        \/
                    $('.header.headerScrolling>div:not([id])>div:first').clone().appendTo($('.header.headerScrolling>div:not([id])')).find('.ToolbarButtonImage').attr('class', 'ToolbarButtonImage image__envoyer-a-la-frappe_png').attr('icone', 'image__envoyer-a-la-frappe_png').siblings().remove().end()
                        .parent().attr({'onclick':'', 'Title': 'Remplissage auto de la fiche', 'id': '', 'ng-class':''}).click(async ev=>{
                        //let CB_content = await navigator.clipboard.readText()
                        //console.log(CB_content)
                        let observData = {}, $tmp, FHR_regex
                        µ.getFHR_Clipboard().then(clipData=>{
                            //log(clipData)
                            if(EasilyInfos.FHR_auto_UHDL){
                                let clipDataArray
                                µ.clipData = clipData
                                let FHR_regexArray = [/Motif hospitalisation \:\s?(?<motif>.*?)\r?\n(.|\n|\r)*ATCD médico/.source,
                                                      /ATCD médico.*?\r?\n(?<atcd_med>(.|\n|\r)*?)\r?\n.*?(\r?\n)?ATCD psychiatriques .*?personnels/.source,
                                                      /ATCD psychiatriques .*? personnels.*?\r?\n(?<atcd_psy>(.|\n|\r)*?)\r?\n.*?(\r?\n)?ATCD psy.*?familiaux/.source,
                                                      /ATCD psy.*?familiaux.*?\r?\n(?<atcd_psy_fam>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source,
                                                      /Allergies.*?\r?\n(?<allergies>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Traitements en/.source,
                                                      /Traitements en.*?:\r?\n?(?<tttEntree>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Traitements psycho/.source,
                                                      /Traitements psycho.*?:\r?\n(?<tttPsyAnte>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Mode de vi/.source,
                                                      /Mode de vi.*?\r?\n(?<mdv>(.|\n|\r)*?)\r?\n.*?\r?\nContact/.source,
                                                      /Contact.*?\r?\n(?<contact>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Anamn/.source,
                                                      /Anamn.*?\r?\n(?<hdlm>(.|\n|\r)*?)\r?\n.*?\r?\nExamen clinique ini/.source,
                                                      /Examen clinique ini.*?\r?\n(?<examSomaInit>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Entretiens :/.source,
                                                      /Entretiens :.*?\r?\n(?<entretiens>(.|\n|\r)*?)\r?\n.*?\r?\nCommentaire gé/.source,
                                                      /Commentaire gé.*?\r?\n(?<commentaire>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Au total/.source,
                                                      /Au total.*?\r?\n(?<conclusion>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Plan de sortie/.source,
                                                      /Plan de sortie.*?\r?\n(?<planSortie>(.|\n|\r)*?)(\r?\n.*?)?(\r?\n)?(TTT|Traitements?) de sortie/.source,
                                                      /(TTT|Traitements?) de sortie.*?\r?\n(?<tttSortie>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Dr /.source]
                                for (FHR_regex in FHR_regexArray){
                                    //log(FHR_regex, FHR_regexArray[FHR_regex])
                                    if(typeof FHR_regexArray[FHR_regex] != 'function'){
                                        try{
                                            let info = clipData.match(new RegExp(FHR_regexArray[FHR_regex]))
                                            Object.assign(observData, info.groups)
                                        }catch(e){log(FHR_regexArray[FHR_regex] +" non trouvé")}
                                    }
                                }
                                try{observData.tttEntree = observData.tttEntree.trim()}catch(e){}
                                try{observData.tttSortie = observData.tttSortie.trim()}catch(e){}
                                FHR_regex = new RegExp(
                                    /Evaluation.*?\r?\n(?<examPsyEntree>(.|\r|\n)*?)\r?\n/.source
                                    +/Diagnostic initial.*?\r?\n(?<diagEntree>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                    +/Mobilisation des ressources.*?\r?\n(?<pecEntree>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                    +/Accompagnement au projet/.source
                                )
                                try{Object.assign(observData, observData.entretiens.match(FHR_regex).groups)}catch(e){}
                                try{observData.examSomaInit = observData.examSomaInit.split('):')[1]}catch(e){
                                    try{observData.examSomaInit = observData.examSomaInit.split(') :')[1]}catch(e){}
                                }
                                try{observData.tttSortie = observData.tttSortie.split('Documents de sortie')[0].trim()}catch(e){}
                                µ.observData = observData

                                //Ajout des médecins de l'UHDL
                                $('table[fm-errors="data.model.ref_medecins.errors"]:first').each((i,el)=>{
                                    let MedecinsUHDL = 0
                                    $(el).find('input.k-input.fm_dropdownlistpractician').each((i,el2)=>{
                                        if($(el2).val() == "MERY, Raphael"){
                                            MedecinsUHDL+=1
                                            $(el2).addClass("medUHDL")
                                        }
                                        if($(el2).val() == "HARRY, Adrien"){
                                            MedecinsUHDL+=2
                                            $(el2).addClass("medUHDL")
                                        }
                                    })
                                    let $addMedBtn = $('.fm_label_important:contains(Médecin(s))').closest('.fm_grid_cell').prev().find("fm-button[fm-on-click*=Function_AjoutReferent]")
                                    if(!(MedecinsUHDL & 1)){
                                        if(!(MedecinsUHDL & 2)){
                                            $addMedBtn.click()
                                            $.waitFor('input.k-input.fm_dropdownlistpractician:not(.medUHDL)').then($el=>{
                                                $el.val("HARRY, Adrien").addClass('medUHDL').trigger('input')
                                                $.waitFor('span:contains(aharry):visible').then($el=>{
                                                    $el.click().log()
                                                    $addMedBtn.click()
                                                    $.waitFor('input.k-input.fm_dropdownlistpractician:not(.medUHDL)').then($el=>{
                                                        $el.val("MERY, Raphael").addClass('medUHDL').trigger('input')
                                                        $.waitFor('span:contains(rmery):visible').then($el=>{
                                                            $el.click()
                                                        })
                                                    })
                                                })
                                            })
                                        } else {
                                            $addMedBtn.click()
                                            $.waitFor('input.k-input.fm_dropdownlistpractician:not(.medUHDL)').then($el=>{
                                                $el.val("MERY, Raphael").addClass('medUHDL').trigger('input')
                                                $.waitFor('span:contains(rmery):visible').then($el=>{
                                                    $el.click()
                                                })
                                            })
                                        }
                                    } else if(!(MedecinsUHDL & 2)){
                                        $addMedBtn.click()
                                        $.waitFor('input.k-input.fm_dropdownlistpractician:not(.medUHDL)').then($el=>{
                                            $el.val("HARRY, Adrien").addClass('medUHDL').trigger('input')
                                            $.waitFor('span:contains(aharry):visible').then($el=>{
                                                $el.click()
                                            })
                                        })
                                    }
                                })
                                //Histoire de la maladie
                                $('.fm_grid_cell:contains(Histoire de la maladie):last').each((i,el)=>{
                                    let $elem=$(el)
                                    while(!$elem.find('iframe').length){
                                        $elem=$elem.parent().closest('.fm_grid_cell')
                                    }
                                    $elem.find('iframe').each((j,el2)=>{
                                        let $body = $('body', el2.contentDocument)
                                        if(!$body.innerText && observData.hdlm){
                                            let temparea = $('<textarea>')[0]
                                            temparea.innerText = observData.hdlm
                                            $body.html(temparea.innerHTML).trigger('paste')
                                            temparea.remove()
                                        }
                                    })
                                })
                                //Synthèse de séjour / commentaire
                                $('.fm_grid_cell:contains(Synthèse de séjour):last').each((i,el)=>{
                                    let $elem=$(el)
                                    while(!$elem.find('iframe').length){
                                        $elem=$elem.parent().closest('.fm_grid_cell')
                                    }
                                    $elem.find('iframe').each((j,el2)=>{
                                        let $body = $('body', el2.contentDocument)
                                        if(!$body.innerText && observData.commentaire){
                                            let temparea = $('<textarea>')[0]
                                            temparea.innerText = observData.commentaire
                                            $body.html(temparea.innerHTML).dispatchEvent('paste')
                                            temparea.remove()
                                        }
                                    })
                                })
                                //Mode de vie
                                $('.fm_grid_cell:contains(Mode de vie):last').each((i,el)=>{
                                    let $elem=$(el)
                                    while(!$elem.find('textarea').length){
                                        $elem=$elem.parent().closest('.fm_grid_cell')
                                    }
                                    if(observData.mdv){
                                        $elem.find('textarea').val(observData.mdv).dispatchEvent('input')
                                    }
                                })

                                //Anamnèse == ATCD med + psy + familiaux
                                $('.fm_grid_cell:contains(Anamnèse):last').parent().closest('td.fm_grid_cell').parent().next().find('textarea').each((i,el)=>{
                                    let $elem=$(el)
                                    if($elem.val() == ""){
                                        $elem.val("ATCD psychiatriques personnels :\n"+observData.atcd_psy+"\n\nATCD médicaux-chirurgicaux :\r\n"+observData.atcd_med+"\n\nATCD psychiatriques familiaux :\r\n"+observData.atcd_psy_fam).dispatchEvent('input')
                                    }
                                })
                                $('.fm-label-mandatory-save').closest('td.fm_grid_cell').each((i,el)=>{
                                    switch($(el).text().trim()){
                                        case "Mode d'hospitalisation du patient à l'entrée*":
                                            $(el).next().find('input:eq(0)').click()
                                            break
                                    }
                                })
                                $('.fm-label-mandatory-validate').closest('td.fm_grid_cell').each((i,el)=>{
                                    switch($(el).text().trim()){
                                        case "Sortie*":
                                            $(el).next().find('input').val((i,t)=> t ? t : new Date().toLocaleDateString()).trigger('input')
                                            break
                                        case "Motif entrée*":
                                            $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val((i,t)=>observData.motif ?? ( t ? t : '.')).trigger('input')
                                            break
                                        case "Conclusion de l'examen clinique initial*":
                                            $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val(
                                                (i,t) => observData.diagEntree ?(observData.examPsyEntree + " \n\nConclusion :\n" + observData.diagEntree) : ( t ? t : '.')).trigger('input')
                                            break
                                        case "Périmètre abdominal*":
                                        case "Poids*":
                                        case "Taille*":
                                            $tmp = $(el).next().find('input').val((i,v)=>v ? v : '1').trigger('input').end().next().next().find('input')
                                            if(!$tmp.filter(':checked').length){
                                                $tmp.first().click()
                                            }
                                            break
                                        case "Variation poids pré-hospit.*":
                                            $(el).next().find('input:eq(1)').click()
                                            break
                                        case "Traitement à l'entrée*":
                                            $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val((i,t)=>observData.tttEntree ? observData.tttEntree : ( t ? t : '.')).trigger('input')
                                            break
                                        case "Diagnostic de sortie*":
                                            console.log(observData.conclusion)
                                            $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').log().val((i,t)=>observData.conclusion ? observData.conclusion : ( t ? t : '.')).trigger('input')
                                            break
                                        case 'Destination du patient à la sortie*':
                                            $(el).parent().next().find('input:first').prop('checked',true).click()
                                            break
                                        case "Prescription de sortie *":
                                            $(el).closest('td.fm_group_header_default').parent().next().find('textarea').val((i,t)=>observData.tttSortie ?? ( t ? t : '.')).trigger('input')
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
                            }
                        })
                    })
                    $('.fm_group_header_expander.image_expandable_png').click().log()
                    //console.log("Fiche FHR")
                    break

//       ___                      _ _
//      / __\___  _ __  ___ _   _| | |_
//     / /  / _ \| '_ \/ __| | | | | __|
//    / /__| (_) | | | \__ \ |_| | | |_
//    \____/\___/|_| |_|___/\__,_|_|\__|
//
                case "Fiche de Consultation Psy":
                case "Fiche de Consultation Psy de Liaison":
                    $('.fm_group_header_label_light:contains(Synthèse)').click()
                    $('.fm_group_header_default:contains(Observations) .fm_group_header_expander.image_expandable_png').click()
                    break
            }

        }


//     █████  ███████ ██    ██ ██████
//    ██   ██ ██      ██    ██ ██   ██
//    ███████ ███████ ██    ██ ██████
//    ██   ██      ██ ██    ██ ██   ██
//    ██   ██ ███████  ██████  ██   ██
//
//
        if(location.pathname.match(/Urgences\/Urgences\.Web/)){
            if($(".titleContainer").text().trim() == "Vous n'êtes pas habilité(e) à visualiser ce module."){
                //console.log("Pas d'habilitation au module ASUR")
                window.parent.postMessage('{"command":"allowASUR"}', "*")
            }
            window.addEventListener('message', receiveMessage_Main)
        }

//    ██████   █████  ███    ██  ██████  █████  ██████  ████████ ███████
//    ██   ██ ██   ██ ████   ██ ██      ██   ██ ██   ██    ██    ██
//    ██████  ███████ ██ ██  ██ ██      ███████ ██████     ██    █████
//    ██      ██   ██ ██  ██ ██ ██      ██   ██ ██   ██    ██    ██
//    ██      ██   ██ ██   ████  ██████ ██   ██ ██   ██    ██    ███████
//
//
        if(location.pathname.match(/TempetePlus\/TempetePlus\.Web\/Pancarte/)){
            $.waitFor('#infosSession', 10000).then($el2=>{
                window.parent.postMessage(JSON.stringify({command:"pancarte-Ready", IEP: $el2.text().split('Venue : ')[1]}), "*")
            }).catch(err=>log(err))
            window.addEventListener('message', message=>{
                let messageEvData
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
                if(messageEvData.command == "agenda-CodageFrame"){
                    //console.log(messageEvData.rdv_infos)
                    if(!window.codageStarted){
                        window.codageStarted = true
                        $.waitFor('#infosSession:visible', 10000).then($el2=>{
                            if(messageEvData.rdv_info){
                                messageEvData.rdv_infos.IEP = $el2.text().split('Venue : ')[1]
                                console.log(`Démarrage de CORA (IPP:${messageEvData.rdv_infos.IPP}; IEP:${messageEvData.rdv_infos.IEP}; Login:LOGINAD=${EasilyInfos.username})`)
                                $('<a target="_blank">').attr('href', `Lancemodule: CORA;${messageEvData.rdv_infos.IPP};${messageEvData.rdv_infos.IEP};LOGINAD=${EasilyInfos.username}`).appendTo('body').click2().each((i,el)=>{
                                    setTimeout($el2=>{
                                        $el2.attr('href', `codagecora:${messageEvData.rdv_infos.date};${messageEvData.rdv_infos.heure};${messageEvData.rdv_infos.duree ?? "30"};${messageEvData.rdv_infos.lieu ?? "L02"};${messageEvData.rdv_infos.acte ?? "E"}`).click2().remove()
                                    }, 500, $(el))
                                })
                            } else if(messageEvData.IPP){
                                $el2.wrapInner(`<a href="Lancemodule: CORA;${messageEvData.IPP};${$el2.text().split('Venue : ')[1]};LOGINAD=${EasilyInfos.username}"></a>`)
                            }
                        }).catch(err=>log(err))
                    }
                }
            })
        }
    } else if (location.hostname == "easily-prod.chu-clermontferrand.fr" && window.top == window.self){
        window.addEventListener("message", receiveMessage_Main);

        if(GM_getValue('fromLogin', false)){
            setTimeout(()=>{
                GM_setValue('fromLogin', false)
                $(window).click()
                $('')
            }, 1500)
        }
    }

    // auto-relogon
    $('.verrouillage-nom').click(ev=>{
        if(EasilyInfos.password_store){$("#password-popup").val(EasilyInfos.password)}
        $("button.deverrouillage-button").click()
    })

    //Gestion affichage du menu
    $('.easily-univers-item').filter(':contains(paramétrage)')[EasilyInfos.hide_parametres ? 'hide':'show']().end()
    .filter(':contains(pilotage)')[EasilyInfos.hide_pilotage ? 'hide':'show']().end()
    .filter(':contains(bloc)')[EasilyInfos.hide_bloc ? 'hide':'show']().end()

    $('.easily-univers-menu-entry').on('mouseup', ev=>{
        if(ev.which == 3){
            $.waitFor('.favoris-ctxmenu.easily-ctxmenu:not(.custom-fav-menus)').then($el=>{
                $el.addClass('custom-fav-menus')

                let selectedMenu = $('.easily-univers-item.selected').text().trim().capitalize(), selectedAction = $el.closest('.easily-univers-menu-entry').attr('title')
                $el.find('p').text('Définir par défaut pour cet utilisateur').clone().text((selectedAction == EasilyInfos.defaultConnectionAction ? "Supprimer" : "Définir") + " comme action à la connexion ici").appendTo($el).click(ev=>{
                    ev.preventDefault()
                    ev.stopPropagation()
                    ev.stopImmediatePropagation()
                    let clickedAction = $(ev.target).closest('.easily-univers-menu-entry').attr('title')
                    if(clickedAction == EasilyInfos.defaultConnectionAction){
                        EasilyInfos.defaultConnectionAction = ""
                        log(clickedAction + ' supprimé comme action par défaut à la connexion ici')
                    } else {
                        EasilyInfos.defaultConnectionAction = $(ev.target).closest('.easily-univers-menu-entry').attr('title')
                        log(EasilyInfos.defaultConnectionAction + ' définit comme action par défaut à la connexion ici')
                    }
                    GM_setValue("EasilyInfos", EasilyInfos)
                    $('#easily-univers-menu').hide()
                }).contextmenu(ev=>{
                    ev.preventDefault()
                    ev.stopPropagation()
                    ev.stopImmediatePropagation()
                }).end().clone().text((selectedAction == EasilyInfos.defaultsMenusClick[selectedMenu] ? "Supprimer " : "Définir")+ " comme action par défaut du menu " + selectedMenu).appendTo($el).click(ev=>{
                    ev.preventDefault()
                    ev.stopPropagation()
                    ev.stopImmediatePropagation()
                    let clickedAction = $(ev.target).closest('.easily-univers-menu-entry').attr('title')
                    if(clickedAction == EasilyInfos.defaultsMenusClick[selectedMenu]){
                        EasilyInfos.defaultsMenusClick[selectedMenu] = ""
                        log(clickedAction + ' supprimé comme action par défaut du menu ' + selectedMenu)
                    } else {
                        EasilyInfos.defaultsMenusClick[selectedMenu] = $(ev.target).closest('.easily-univers-menu-entry').attr('title')
                        log(EasilyInfos.defaultsMenusClick[selectedMenu] + ' définit comme action par défaut du menu ' + selectedMenu)
                    }
                    GM_setValue("EasilyInfos", EasilyInfos)
                    $('#easily-univers-menu').hide()
                }).contextmenu(ev=>{
                    ev.preventDefault()
                    ev.stopPropagation()
                    ev.stopImmediatePropagation()
                })
            })
        }
    })
    if(location.href.search("https://easily-prod.chu-clermontferrand.fr/medecin")+1 || location.href.search("https://easily-prod.chu-clermontferrand.fr/Medecin")+1){
        if(EasilyInfos.defaultConnectionAction){
            $.waitFor('.easily-container').then($el=>{
                let contained_ID = $el.attr('id').match(/container\-DEFAULT\-(?<id>\d+)/).groups.id, defaultActionID = $('.easily-univers-menu-entry[title="'+EasilyInfos.defaultConnectionAction+'"]').data('pathid')
                if(contained_ID != defaultActionID){
                    $('.easily-univers-menu-entry[title="'+EasilyInfos.defaultConnectionAction+'"]').click()
                }
            })
        }
    }


//    ███    ███  ██████  ██    ██ ███████ ███████     ███████ ██    ██ ███████ ███    ██ ████████ ███████
//    ████  ████ ██    ██ ██    ██ ██      ██          ██      ██    ██ ██      ████   ██    ██    ██
//    ██ ████ ██ ██    ██ ██    ██ ███████ █████       █████   ██    ██ █████   ██ ██  ██    ██    ███████
//    ██  ██  ██ ██    ██ ██    ██      ██ ██          ██       ██  ██  ██      ██  ██ ██    ██         ██
//    ██      ██  ██████   ██████  ███████ ███████     ███████   ████   ███████ ██   ████    ██    ███████
//

    unsafeWindow.isHospitalisationLoaded = false
    $(window).on('click contextmenu mouseup', ev=>{
        //console.log(ev)
        if(location.href.search("https://easily-prod.chu-clermontferrand.fr/")+1){
            switch(location.pathname.split("/")[1]){
                case "login":
                case "Login":
                    // Auto-logon
                    if($(ev.type == "click")){
                        GM_setValue("fromLogin", true)
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
                    //Gestion des Onglets des patients
                    if($(ev.target).closest('.easily-container-area').length){ // bandeau droite
                        if ($(ev.target).is('a:contains(Pres Biologie)')){
                            if(ev.type == "click"){
                                if(!$('#module-bioboxes-anapath').is('.pres-bio_frame')){
                                    if(!µ.currentPatient.IPP){
                                        µ.currentPatient.IPP = $('.infosPatient').text().split(' : ')[1]
                                        µ.currentPatient.DDN = $('.infosPatient').text().split('le ')[1].split(" (")[0]
                                    }
                                }
                            } else if(ev.which == 2){
                                $('#presBioFrame').attr('src', 'https://cyberlab.chu-clermontferrand.fr')
                            }
                        } else if ($(ev.target).is('.openPACS')){
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
                            if(ev.type =="click"){
                                if(!$('#module-bioboxes-biologie').is('.cyberlab_frame')){
                                    if(!µ.currentPatient.IPP){
                                        µ.currentPatient.IPP = $('.infosPatient').text().split(' : ')[1]
                                        µ.currentPatient.DDN = $('.infosPatient').text().split('le ')[1].split(" (")[0]
                                    }
                                }
                            } else if(ev.type == "mouseup" && ev.which == 2){
                                let labo_url = 'http://intranet/intranet/Outils/APICyberlab/Default.aspx?'+
                                    btoa('Class=Patient&Method=ViewReport&LoginName=aharry&Password=Clermont63!&Organization=CLERMONT&Object='+µ.currentPatient.IPP+'&patientBirthDate='+µ.currentPatient.DDN.split('/').reverse().join('')+'&LastXdays=3650&OnClose=Login.jsp&showQueryFields=F')
                                window.open(labo_url, '_tab')
                            }

                            // Edition rapide de la FHR ou de la Lettre de Liaison (choix à définir dans les options)
                        } else if ($(ev.target).is('a:contains(Histoire)')){
                            if(ev.type == "mouseup" && ev.which == 2){
                                if(!$(ev.target).closest('li').is('selected')){
                                    $(ev.target).click()
                                }
                                $.waitFor('span.libelledoc:contains(FHR Observation Médicale - Psychiatrie):visible').then($el=>{
                                    try{$el.closest('li:has(.iconDependanceDoc)').find('div.iconmodif:has(.line-expanded-off)').click()}catch(e){}
                                    if(EasilyInfos.fast_edit_Lettre && $el.closest('li:has(.icon-dependance:visible)').length){
                                        $.waitFor('.ligneEnfant:has(span.libelledoc:contains(Lettre de Liaison valant CRH Psy)) div.iconmodif:visible:has(.line-expanded-off)', $el.closest('li:has(.iconDependanceDoc)').next('li')).then($el2=>{
                                            try{
                                                $el2.click()
                                            }catch(e){
                                            }
                                            $.waitFor('div.edit-document', $el2.closest('li')).then($el3=>$el3.click())
                                        })
                                    } else {
                                        $.waitFor('div.edit-document:first', $el.closest('li:has(.iconDependanceDoc)').next('li')).then($el2=>$el2.click())
                                    }
                                    $.waitFor('.delete-panier:visible', 5000).then($el=>$el.click()).catch(err=>err)
                                })
                            }
                        }
                    }

                    // En cours - édition rapide de lettre de liaison
                    if($('img[src*="word.png"][title="Lettre de Liaison valant CRH Psy"]').length){
                    }

                    //Gestion du menu
                    if($(ev.target).closest('#easily-univers').length){
                        let selectedMenu = $(ev.target).text().trim().capitalize()
                        switch(ev.type){
                            case "click":
                                $(`li[title="${EasilyInfos.defaultsMenusClick[selectedMenu]}"]`).click()
                                break
                            case "contextmenu":
                                if($(ev.target).closest('.easily-univers-item').length){
                                    ev.preventDefault()
                                } else if($(ev.target).is('.easily-univers-menu-entry')){
                                }
                                break
                            case "mouseup":
                                break
                        }
                    }
                    if($(ev.target).is('div.username')){
                        if(ev.type == "contextmenu"){
                            ev.preventDefault()
                            $('#EasilyPlusPrefs').dialog('open')
                        }
                    }
                    if(ev.type == "click"){
                        if($(ev.target).closest("[data-action=habilitation]").length || $(ev.target).closest('[data-original-title="Cliquez ici pour voir vos habilitations"]').length){
                            $.waitFor('h4:contains("Vous avez le rôle")').then(()=>{
                                $.waitFor('#module-habilitation-tab-matrice tbody>tr:visible').then(()=>{
                                    let nbHabilitations = Number($('#module-habilitation-tab-matrice+div [data-bind="text: totalItems"]:visible').text())
                                    $('#module-habilitation-tab-matrice+div select.form-control:visible').val('tous').trigger('change')
                                    $.waitFor(`#module-habilitation-tab-matrice tbody>tr:eq(${nbHabilitations-1}):visible`).then(()=>{
                                        let current_habilitations={pedo:false, psyA:false, psyB:false, addicto:false, UPP:false}, $habDiv,
                                            listeCR_hospit = {"1399H": "pedo", "1397H": "psyA", "1398H": "psyB", "1623H": "addicto", "1361U": "UPP"},
                                            listeCR_hospit_pretty = {"1399H": "Pédo", "1397H": "Psy A", "1398H": "Psy B", "1623H": "Addicto", "1361U": "UPP"}
                                        $('#module-habilitation-tab-matrice tbody>tr').each((i,el)=>{
                                            let tempHab = listeCR_hospit[$('td:first', el).text()]
                                            if (tempHab){
                                                current_habilitations[tempHab] = true
                                            }
                                        })
                                        $('#module-habilitation .leftbar:first:not(:has(.habTemp-Buttons))').append(
                                            $habDiv =
                                            $('<div class="habTemp-Buttons">Ajouter droits temporaires pour :'+
                                              /*
                                              '<button class="habTemp hab-Ajouter_UPP" data-codeCR="">UPP</button>'+
                                              '<button class="habTemp hab-Ajouter_psyA">Psy A</button>'+
                                              '<button class="habTemp hab-Ajouter_psyB">Psy B</button>'+
                                              '<button class="habTemp hab-Ajouter_pedo">Pedo</button>'+
                                              '<button class="habTemp hab-Ajouter_addicto">Addicto</button>'+
                                              */
                                              '</div>').click(ev2=>{
                                                if($(ev2.target).is('.habTemp')){
                                                    grantTempHabilitation($(ev2.target).data('codecr'))
                                                }
                                            })
                                        )
                                        for (let codeCR in listeCR_hospit){
                                            $habDiv.append(`<button class="habTemp hab-Ajouter_${listeCR_hospit[codeCR]}" data-codeCR=${codeCR}>${listeCR_hospit_pretty[codeCR]}</button>`)
                                        }
                                        for (let habilitation in current_habilitations){
                                            if (current_habilitations[habilitation])
                                            {
                                                $habDiv.addClass('hab-'+habilitation)
                                            }
                                        }
                                    })
                                    //grantTempHabilitation()
                                })
                            })
                        }
                    }
                    break;
                case "Module":
                case "module":
                    if(location.pathname == "/Module/DS_TC/JDT/Index"){
                    }
                    break
            }
        } else if(location.href.search("https://easilynlb-prod.chu-clermontferrand.fr/")+1){
            switch(location.pathname){
                case "/dominho/Fiche/Open":
                    break
            }
        }
        if(window.top == window.self && !unsafeWindow.isHospitalisationLoaded){
            $.waitFor('#module-worklistshospitalisation .menu-action:not(:has(#btnTransmissions))>div').then($el=>{
                unsafeWindow.isHospitalisationLoaded = true

                if(!$('#transmissionsFrame').length){
                    $('<iframe id="transmissionsFrame" src="/Module/DS_TC/JDT/Index">').dialog().dialog('close').parent().height($(window).height() - 50).width($(window).width() - 50).position({my:"center", at:"center", of:window})
                    /*
                    $.waitFor('div[aria-describedby="transmissionsFrame"]').then($el=>{
                        $el.height($(window).height() - 50).width($(window).width() - 50).position({my:"center", at:"center", of:window}).attr('id', 'transmissionsDialog')
                    })
                    */
                }
                $el.after($('<button class="btn btn-success btn-sm" style="margin-left:5px" id="btnTransmissions">Transmissions</button>').click(ev=>{
                    $('#transmissionsFrame').dialog('open').parent().height($(window).height() - 50).width($(window).width() - 50).position({my:"center", at:"center", of:window})
                    document.getElementById('transmissionsFrame').contentWindow.postMessage(JSON.stringify({cr:$('#dropdownCR').val().split(':')[1], uf:$('#dropdownUF').val().split(':')[1]}))
                }))


                //Notification du parapheur
                getParapheurNotif()
            })
        }
    })

    function getParapheurNotif(){
        $.get('https://easily-prod.chu-clermontferrand.fr/Module/Parapheur/MainParapheur/GetCompteurAccueilParapheurPersoAsync/?idIntervenant=', r=>{
            let n_doc=r[3].NbMessages + r[4].NbMessages
            if(n_doc){
                if(!$('#parapheurCount').length){
                    $('.easily-univers-menu-entry[title="Parapheur \(Parapheur\)"]').append($('<span id="parapheurCount">'+n_doc+'</span>'))
                } else {
                    $('#parapheurCount').text(n_doc)
                }
            } else {
                $('#parapheurCount').hide()
            }
        })
    }

    // Autorisation temporaire rapide
    function grantTempHabilitation(codeCR="1361u", autoValidate=true){
        if(!$('h4:contains("Faire une demande"):contains("temporaire"):visible').length){
            $(`ul.nav>li:contains("Demandes d'habilitation"):visible a:contains("Faire une demande d'habilitation temporaire")`).click2()
        }
        $.waitFor(`label:contains("Choix des services"):visible`).then($el2=>setTimeout(()=>{
            $el2.click()
            $.waitFor(`input[placeholder="rechercher un service par code ou libellé de..."]:visible`).then($el3=>setTimeout(()=>{
                $el3.val(codeCR).trigger("change")
                $.waitFor(`span[data-bind="click: rechercherServices"]:visible`).then($el4=>setTimeout(()=>{
                    $el4.click()
                    $.waitFor(`#module-habilitation-tab-workflow-cr tr:contains(${codeCR.toUpperCase()}) button.glyphicon-plus`).then($el5=>setTimeout(()=>{
                        $el5.click()
                        $.waitFor(`label:contains("Synthèse"):visible`).then($el6=>setTimeout(()=>{
                            $el6.click()
                            $.waitFor(`button.btn-success[data-bind="enable : allowValidation, click:faireDemande"]:visible`).then($el7=>setTimeout(()=>{
                                if(autoValidate){
                                    $el7.click()
                                    $.waitFor(`button[data-bind="click: RetourPagePrefereeOuFournie(0)"]:visible`).then($el8=>setTimeout(()=>{
                                        $el8.click()
                                        if(codeCR.toUpperCase() == "1361U"){
                                            $.waitFor(`li[title="ASUR (Urgences)"]`).then($el9=>$el9.click())
                                        }
                                    },300))
                                }
                            },300))
                        },300))
                    },300))
                },300))
            },300))
        },300))
    }

//    ███    ███ ███████ ███████ ███████  █████   ██████  ███████     ███████ ██    ██ ███████ ███    ██ ████████
//    ████  ████ ██      ██      ██      ██   ██ ██       ██          ██      ██    ██ ██      ████   ██    ██
//    ██ ████ ██ █████   ███████ ███████ ███████ ██   ███ █████       █████   ██    ██ █████   ██ ██  ██    ██
//    ██  ██  ██ ██           ██      ██ ██   ██ ██    ██ ██          ██       ██  ██  ██      ██  ██ ██    ██
//    ██      ██ ███████ ███████ ███████ ██   ██  ██████  ███████     ███████   ████   ███████ ██   ████    ██
//
//
    function receiveMessage_Main(message) {
        let waitTime = 0, messageEvData, frameOrigin, FHR_channel, clipboardContent, $currentContainer, CR_selectionContainerID
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
        console.log(messageEvData.command)
        switch(messageEvData.command){

//        _   ___ _   _ ___
//       /_\ / __| | | | _ \
//      / _ \\__ \ |_| |   /
//     /_/ \_\___/\___/|_|_\
//
            case "allowASUR":
                $('[data-action=habilitation]').click2()
                $.waitFor(`ul.nav>li:contains("Demandes d'habilitation"):visible a:contains("Faire une demande d'habilitation temporaire")`).then($el=>{
                    $.waitFor('h4:contains("Vous avez le rôle")').then(()=>setTimeout(()=>{
                        $el.click()
                        grantTempHabilitation()
                    }, 300))
                })
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
            case "cyberlab-lastBio":
                console.log(messageEvData.bio)
                break
            case "cyberlab-alertBio":
                if(Object.keys(messageEvData.alert).length){
                    let alert_title = '', important = false, $img
                    for (let test in messageEvData.alert){
                        alert_title+= test + " " + messageEvData.alert[test].alert + " (" + messageEvData.alert[test].value
                        alert_title+= (messageEvData.alert[test].norme ? ", norme " + messageEvData.alert[test].norme : "") + ")\n"
                        important = ( messageEvData.alert[test].alert == "très faible" || messageEvData.alert[test].alert == "très élevé")
                    }
                    $img = $('.area-carrousel li:contains(Biologie):not(:contains(Pres))').attr('title', alert_title).find('img.labInfo')
                    if(important){
                        $img.attr('source', "https://easilynlb-prod.chu-clermontferrand.fr/TempetePlus/TempetePlus.Web/Content/Images/alerte.png").css({width:"16px", "position":"absolute"})
                    } else {
                        $img.addClass('warning')
                    }
                }
                break
            case "cyberlab-reloadFrame":
                $(frameOrigin).attr('src', "https://cyberlab.chu-clermontferrand.fr")
                console.log(messageEvData.alert)
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

//    ___________                                   .__              .__
//    \__    ___/___________    ____   ______ _____ |__| ______ _____|__| ____   ____   ______
//      |    |  \_  __ \__  \  /    \ /  ___//     \|  |/  ___//  ___/  |/  _ \ /    \ /  ___/
//      |    |   |  | \// __ \|   |  \\___ \|  Y Y  \  |\___ \ \___ \|  (  <_> )   |  \\___ \
//      |____|   |__|  (____  /___|  /____  >__|_|  /__/____  >____  >__|\____/|___|  /____  >
//                          \/     \/     \/      \/        \/     \/               \/     \/

            case "transmissions_get-CR-UF":
                frameOrigin.contentWindow.postMessage(JSON.stringify({cr:$('#dropdownCR').val().split(':')[1], uf:$('#dropdownUF').val().split(':')[1]}))
                break

//       _____                             .___
//      /  _  \    ____   ____   ____    __| _/____
//     /  /_\  \  / ___\_/ __ \ /    \  / __ |\__  \
//    /    |    \/ /_/  >  ___/|   |  \/ /_/ | / __ \_
//    \____|__  /\___  / \___  >___|  /\____ |(____  /
//            \//_____/      \/     \/      \/     \/

            case "agenda-OpenDossier":
                $currentContainer = $('.easily-container:visible')
                $('[data-applicationname="CapMedecin"]').click()
                $.waitFor('div.clickable[data-cr="'+(btoa((EasilyInfos.CR.substr(0,4)+"C").split('').join('\x00')+"\x00"))+'"]:visible').then($el=>{
                    CR_selectionContainerID = $('.easily-container:visible').attr('id')
                    $el.click()
                    $.waitFor('.internal-selection-venue tbody .venue-link:first:visible, #iframe[src*="TempetePlus.Web/Pancarte"]', 5000).then($el2=>{
                        $('.area-carrousel-wrapper li:contains(Saisir)').click()
                        //$el.click()
                    }).catch(err=>err)
                    $.waitFor('.btnPrevious:visible').then($el=>{
                        $el.click(ev=>{
                            $.waitFor('#'+CR_selectionContainerID+':visible').then($el=>{
                                $el.hide()
                                $currentContainer.show()
                            })
                        })
                    })
                }, 5000).catch(err=>err)
                break;
            case "agenda-Codage":
                $currentContainer = $('.easily-container:visible')
                µ.codageCora = true
                $('[data-applicationname="CapMedecin"]').click()
                messageEvData.rdv_infos.date = (new Date(messageEvData.rdv_infos.date.split('/').reverse())).toLocaleDateString('fr-FR')
                µ.CoraRDV_infos = messageEvData.rdv_infos
                $.waitFor('div.clickable[data-cr="'+(btoa((EasilyInfos.CR.substr(0,4)+"C").split('').join('\x00')+"\x00"))+'"]:visible', 5000).then($el=>{
                    CR_selectionContainerID = $('.easily-container:visible').attr('id')
                    $el.click()
                    $.waitFor('.btnPrevious:visible').then($el=>{
                        $el.click(ev=>{
                            $.waitFor('#'+CR_selectionContainerID+':visible').then($el=>{
                                $el.hide()
                                $currentContainer.show()
                            })
                        })
                    })
                    $.waitFor('.internal-selection-venue tbody .venue-link:first:visible', 10000).then($el2=>{
                        $.waitFor('.infosPatient:visible:first').then($el3=>{
                            messageEvData.rdv_infos.IPP = $el3.text().match(/le (?<DDN>\d{2}\/\d{2}\/\d{4}\/*).* - IPP : (?<IPP>\d*)/).groups.IPP
                            $('.btnPrevious:visible').click(ev=>{
                                $.waitFor('#'+CR_selectionContainerID+':visible').then($el=>{
                                    $el.hide()
                                    $currentContainer.show()
                                })
                            })
                            messageEvData.rdv_infos.IEP = $el2.closest('.grille').find('tr:contains("'+ messageEvData.rdv_infos.date + " " + messageEvData.rdv_infos.heure + '")').data('venuenum')
                            $('<a target="_blank">').attr('href', `Lancemodule: CORA;${messageEvData.rdv_infos.IPP};${messageEvData.rdv_infos.IEP};LOGINAD=${EasilyInfos.username}`).appendTo('body').click2().each((i,el)=>{
                                setTimeout($el4=>{
                                    $el4.attr('href', `codagecora:${messageEvData.rdv_infos.date};${messageEvData.rdv_infos.heure};${messageEvData.rdv_infos.duree ?? "30"};${messageEvData.rdv_infos.lieu ?? "L02"};${messageEvData.rdv_infos.acte ?? "E"}`).click2().remove()
                                }, 500, $(el))
                            })
                            $('.btnPrevious:visible').click()
                        })
                    }).catch(err=>err)
                }).catch(err=>log(err+ " non trouvé."))
                break;
            case "pancarte-Ready":
                if(µ.codageCora == true){
                    µ.codageCora = false
                    log(µ.CoraRDV_infos)
                    if(µ.CoraRDV_infos){
                        µ.CoraRDV_infos.IEP = messageEvData.IEP
                        if(typeof µ.CoraRDV_infos.IPP == "undefined"){
                            µ.CoraRDV_infos.IPP = $('.infosPatient:visible:first').text().match(/le (?<DDN>\d{2}\/\d{2}\/\d{4}).* - IPP : (?<IPP>\d*)/).groups.IPP || µ.currentPatient.IPP
                        }
                        $('#iframe[src*="TempetePlus.Web/Pancarte"]').postMessage(JSON.stringify({command:"agenda-CodageFrame", rdv_infos: µ.CoraRDV_infos}), "*")
                    }
                    setTimeout(()=>{$('.btnPrevious:visible').click()}, 1000)
                } else {
                    $('#iframe[src*="TempetePlus.Web/Pancarte"]').postMessage(JSON.stringify({command:"agenda-CodageFrame", IPP: $('.infosPatient:visible:first').text().match(/le \d{2}\/\d{2}\/\d{4}.* - IPP : (?<IPP>\d*)/).groups.IPP || µ.currentPatient.IPP}), "*")
                }
                break;
//
//     /\ /\ _ __ __ _
//    / / \ \ '__/ _` |
//    \ \_/ / | | (_| |
//     \___/|_|  \__, |
//               |___/
            case "afficherDernierPassageUrg":
                $.waitFor('!#saving_status_container:visible').catch(err=>{
                    $('.lien-affichage.m-recherche:not(.selected)').click()
                    $.waitFor('#BtnRecherchePatientEnSession:visible', 5000).then($el=>{
                        $el.click().log()
                        log('Affichage des passages aux urg')
                    })
                })
                break;
        }

//       ___ _                                     _                _   _         _
//      / __| |_  __ _ _ _  __ _ ___ _ __  ___ _ _| |_   _ __  __ _| |_(_)___ _ _| |_
//     | (__| ' \/ _` | ' \/ _` / -_) '  \/ -_) ' \  _| | '_ \/ _` |  _| / -_) ' \  _|
//      \___|_||_\__,_|_||_\__, \___|_|_|_\___|_||_\__| | .__/\__,_|\__|_\___|_||_\__|
//                         |___/                        |_|
        if (µ._data && µ._data.PatientId){
            try{
                if(µ._data.PatientId != µ.currentPatient.ID){
                    µ.currentPatient = /(?<nom>[A-Z'\s-]*)\s(?<prenom>[A-Z][a-z'\s-]*)\sn/.exec(µ._data.NomPatient).groups
                    Object.assign(µ.currentPatient, $('.infosPatient:visible:first').text().match(/le (?<DDN>\d{2}\/\d{2}\/\d{4}\/*).* - IPP : (?<IPP>\d*)/).groups)
                    //µ.currentPatient.IPP = $('.infosPatient:visible:first').text().split(' : ')[1]
                    //µ.currentPatient.DDN = $('.infosPatient:visible:first').text().split('le ')[1].split(" (")[0]
                    µ.currentPatient.sexe = µ._data.PatientSexe == "Femme" ? "f" : "m"
                    µ.currentPatient.ID = µ._data.PatientId
                    µ.currentPatient.IEP = µ._data.VenueNumero
                    console.log('Changement de patient pour : ' + µ.currentPatient.nom + " " + µ.currentPatient.prenom)
                }
                changementContextePatient()
            }catch(e){
            }
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
   <td><input type="checkbox" name="password_store" id="EasilyPlus_password_store" ${EasilyInfos.password_store ? "checked" : ""}></td>
  </tr>
  <tr class="option-info_password">
   <td>Password</td>
   <td><input type="password" name="password" value="${EasilyInfos.password ? EasilyInfos.password : ""}" oninput="document.getElementById('EasilyPlus_password_store').checked = !!this.value"></td>
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
  <tr class="option-demarrage">
   <td>Page à afficher au démarrage</td>
   <td>
    <label><input type="radio" name="page_demarrage" value="default" ${EasilyInfos.page_demarrage == "default" ? "checked" : ""}> Défaut</label>
    <label><input type="radio" name="page_demarrage" value="CS" ${EasilyInfos.page_demarrage =="CS" ? "checked" : ""}> Consultation</label>
    <label><input type="radio" name="page_demarrage" value="Hospit" ${EasilyInfos.page_demarrage =="Hospit" ? "checked" : ""}> Hospitalisation</label>
    <label><input type="radio" name="page_demarrage" value="Urg" ${EasilyInfos.page_demarrage =="Urg" ? "checked" : ""}> Urgences</label>
   </td>
  </tr>
  <tr class="option-cacher_Bloc">
   <td>Menus à cacher</td>
   <td>
    <label><input type="checkbox" name="hide_bloc" ${EasilyInfos.hide_bloc ? "checked" : ""}> Bloc</label>
    <label><input type="checkbox" name="hide_pilotage" ${EasilyInfos.hide_pilotage ? "checked" : ""}> Pilotage</label>
    <label><input type="checkbox" name="hide_parametres" ${EasilyInfos.hide_parametres ? "checked" : ""}> Paramétrage</label>
   </td>
  </tr>
  <tr class="option-fast_edit">
   <td>Edition rapide</td>
   <td>
    <label><input type="radio" name="fast_edit_Lettre" value=false ${EasilyInfos.fast_edit_Lettre ? "" : "checked"}> FHR</label>
    <label><input type="radio" name="fast_edit_Lettre" value=true ${EasilyInfos.fast_edit_Lettre ? "checked" : ""}> Lettre de Liaison</label>
   </td>
  </tr>
  <tr class="option-others">
   <td>Autres options</td>
   <td>
    <label><input type="checkbox" name="hide_warningTTT" ${EasilyInfos.hide_warningTTT ? "checked" : ""}> Cacher Warning TTT</label>
    <label><input type="checkbox" name="FHR_auto_UHDL" ${EasilyInfos.FHR_auto_UHDL ? "checked" : ""}> Remplissage auto FHR UHDL</label>
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

    if(!$('#EasilyPlus_Style').length){
        $('<style id="EasilyPlus_Style">').html(`
        img[src*="word.png"]:not([title="Lettre de Liaison valant CRH Psy"]) {filter: grayscale(1);}
        img[src*="MyHopLogo"] {display:none;}
        #transmissionsFrame {width:100%!important;height:calc(100% - 25px)!important;padding:0!important}
        #specialiteSelection{display:none;}
        .area-carrousel img.rechercher {
              background: url(/Modules/CM_Histoire/Images/rechercher.png) no-repeat;
              height: 16px;width: 16px;display: inline-block;vertical-align: text-bottom;-webkit-print-color-adjust: exact;display:initial!important;position:absolute;}
        .area-carrousel img.warning, .area-carrousel img.vide, .area-carrousel img.signe,.area-carrousel img.arrete, .area-carrousel img.arr-prog {
              background: url(/Modules/WorklistsHospitalisation/Content/images/prescription/sprite_prescription.png) no-repeat;
              height: 16px;width: 16px;display: inline-block;vertical-align: text-bottom;-webkit-print-color-adjust: exact;display:initial!important;position:absolute;}
        .area-carrousel img.vide {background-position: -32px -16px}
        .area-carrousel img.signe {background-position: -32px 0}
        .area-carrousel img.warning {background-position: -16px -16px}
        .area-carrousel img.arrete {background-position: -16px 0}
        .area-carrousel img.arr-prog {background-position: 0 -16px}
        .area-carrousel img[src*=png] {position:absolute;width:16px;}
        .area-carrousel .imgRefreshListe {cursor: pointer; display: block!important; width: 16px; height: 13px;position: absolute; right: 0; bottom: 0;}
        #parapheurCount {padding: 0 3px; min-width: 24px; line-height: 22px;; background-color: #01b7f1; text-align: center; vertical-align: middle; float: right; border-radius: 12px;margin-top:-5px;border:1px solid #005996;color: white; font-weight: 600;}
        .habTemp-Buttons.hab-psyB.hab-addicto.hab-UPP.hab-psyA.hab-pedo {display:none;}
        .hab-psyA .hab-Ajouter_psyA, .hab-psyB .hab-Ajouter_psyB, .hab-pedo .hab-Ajouter_pedo, .hab-UPP .hab-Ajouter_UPP, .hab-addicto .hab-Ajouter_addicto {display: none;}
        .habTemp {margin-left:5px}
    `).appendTo('body')
    }
    // Your code here...
})();



function changementContextePatient(){
    let EasilyInfos = GM_getValue('EasilyInfos',{"user":"", "password":""})
    //<i class='fa fa-carret'></i>
    let $ = unsafeWindow.jQuery
    if($('.area-carrousel:visible li:contains(Histoire):not(.easily_plus)').length){
        $('.area-carrousel-wrapper li>a:contains("Anapath")').text('Pres Biologie')
        $('.area-carrousel-wrapper li>a:contains("Imagerie")').siblings('img').addClass('rechercher').addClass('rechercher openPACS')
        $('.area-carrousel li:contains(Biologie)').append($('<img src="/Modules/CM_Histoire/Content/Images/refresh.png" class="imgRefreshListe" title="Actualiser">').click(ev=>{
            if($(ev.target).parent(':contains(Pres)').length){
                $('#presBioFrame').attr("src", "https://cyberlab.chu-clermontferrand.fr")
            }else{
                 $('#cyberlabFrame').attr("src", "https://cyberlab.chu-clermontferrand.fr")
            }
        })).filter(':not(:contains(Pres))').find('img:first').addClass('labInfo').end()
        /*/
        $('.area-carrousel-wrapper li:not(.menu-links)>a:contains("Liens")').append("<i class='fa fa-caret-down' style='margin-left:5px;'></i>").parent().addClass("menu-links")
            .append("<li class='li_links'></li><li class='li_links'></li>")
        /**/

        $.waitFor('.area-carrousel:visible li:contains(Histoire):not(.easily_plus)', 5000).then($el=>{
            $el.addClass('easily_plus').click()
            $('li:contains(Biologie):not(:contains(Pres Bio))', '.area-carrousel').click()
            setTimeout(()=>{
                $('.area-carrousel:visible').eq(1).find('li:contains(Histoire)').click()
            }, 1000)
        }).catch(err=>err)
        $.waitFor('#module-bioboxes-imagerie').then($el=>{
            $el.not(':has(#xploreFrame)').html("").addClass('xplore_frame').append('<iframe id="xploreFrame" style="width:100%;height:100%" src="https://xplore.chu-clermontferrand.fr/XaIntranet/#/ExternalOpener?login=aharry&name=FicheDemandeRV&target=WindowDefault&param1=CREATE-FROM-NUMIPP&param2='+unsafeWindow.currentPatient.IPP+'">')
        })

        $.waitFor('#module-bioboxes-anapath').then($el=>{
            $el.not(':has(#presBioFrame)').html("").addClass('pres-bio_frame').append('<iframe id="presBioFrame" style="width:calc(100% - 10px);height:calc(100% - 5px)" src="https://cyberlab.chu-clermontferrand.fr">')
        })
        $.waitFor('#module-bioboxes-biologie').then($el=>{
            $el.not(':has(#cyberlabFrame)').html("").addClass('cyberlab_frame').append('<iframe id="cyberlabFrame" style="width:calc(100% - 10px);height:calc(100% - 5px)" src="https://cyberlab.chu-clermontferrand.fr">')
        })

        let $last_left_tab = $('.area-carrousel:visible:eq(0)>ul>li:last:not(#synth_patient)')
        $last_left_tab.after($last_left_tab.clone().attr('id', 'synth_patient').find('a').text('XWay').attr('id','').attr('href', `Lancemodule: SYNTHESE_PAT;${unsafeWindow.currentPatient.IPP};LOGINAD=${EasilyInfos.username}`).end())
        .after($last_left_tab.clone().attr('id', 'urg_patient').find('a').text('Urg').attr('id','').end().click(ev=>{
            $(ev.currentTarget).siblings('.selected').removeClass('selected').end().addClass('selected')
            $('#area-content-1')
                .filter(':not(:has(#area-content-1-urg)')
                .append($('<div id="area-content-1-urg" style="display:none; height: calc(100% - 7px); width: calc(100% - 7px);"><iframe style="width:100%;height:100%;" src="https://easilynlb-prod.chu-clermontferrand.fr/Urgences/Urgences.Web/">')
                        .find('iframe').on('load', ev=>$(ev.target).postMessage(JSON.stringify({command:'afficherDernierPassageUrg'}), '*'))).end()
            .find('[id^=area-content-1]').hide().end().find('#area-content-1-urg').show()

        }))

    }
    //modules
    // Lancemodule: SYNTHESE_PAT;${IPP};LOGINAD=${username}   == Synthèse Logon
    // Lancemodule: IMAGES_PATIENT;${IPP};LOGINAD=${username}     == PACS
}
