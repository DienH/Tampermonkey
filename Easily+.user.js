// ==UserScript==
// @name         Easily+
// @namespace    http://tampermonkey.net/
// @version      1.0.251104
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
                console.log(msg.data)
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
                .cyberlab_framed .DTFC_scroll .column-norm {position:sticky!important;right:0!important;z-index:10;border-left:dashed black 1px;}
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
                $(el).val(EasilyInfos.username).each((i,elem)=>{elem.dispatchEvent(new Event('change'))})
                $('#txpPASSWORD input').val(EasilyInfos.password).each((i,elem)=>{elem.dispatchEvent(new Event('change'))})
                $('#btnVALIDER>a').click2()
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

//    ████████ ██████   █████  ███    ██ ███████ ███    ███ ██ ███████ ███████ ██  ██████  ███    ██ ███████
//       ██    ██   ██ ██   ██ ████   ██ ██      ████  ████ ██ ██      ██      ██ ██    ██ ████   ██ ██
//       ██    ██████  ███████ ██ ██  ██ ███████ ██ ████ ██ ██ ███████ ███████ ██ ██    ██ ██ ██  ██ ███████
//       ██    ██   ██ ██   ██ ██  ██ ██      ██ ██  ██  ██ ██      ██      ██ ██ ██    ██ ██  ██ ██      ██
//       ██    ██   ██ ██   ██ ██   ████ ███████ ██      ██ ██ ███████ ███████ ██  ██████  ██   ████ ███████
//
//
    else if (location.pathname == "/Module/DS_TC/JDT/Index"){
        async function checkTransOpen2 (){
            await $.waitFor('#inputopen:visible:not(:checked)').then(async $el=>{
                $el.click()
                $('thead .glyphicon-triangle-right').click()
                let transmissions = {}
                await $('table.table>tbody>tr').each(async (i,el)=>{
                    let infosPatient = $('.tdPat', el).text().trim().match(/(?<nom>([A-Z]|\s|-)+) (?<prenom>([A-Z][a-z]+|\s|-)+) (?<ddn>[0-9]{2}\/[0-9]{2}\/[0-9]{4})/).groups,
                        nchambre=$('span[data-bind="text:NumeroLit"]', el).text().trim()
                    log(nchambre)
                    transmissions[nchambre]={patient:infosPatient,trans:{}}
                    await $('.svg-elts-form', el).each(async (i,el2)=>{
                        let $infos=$($(el2).data('title')).find('ul'),
                            transInfo={title:$infos.find('li.tool-title').text(),date:$infos.find('li.tool-info').text().split(' (')[0]}
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
                                let tmpDatas = await getFullTransmission($(el2))
                                Object.assign(transInfo, tmpDatas)
                                console.log(transInfo)
                            }
                        }else if($infos.find('li.tool-title-mc').length){
                            let infodata=''
                            $('div.macro-struct-title', $infos).each((i,el3)=>{
                                $(el3).next().find('dt').each((j,el4)=>{
                                    infodata += $(el4).text().trim() + " : " + $(el4).next().text().trim() + "<br>"
                                })
                                transInfo[$(el3).text()] = infodata
                            })
                            Object.assign(transInfo, {
                                type:'macrocible'
                            })
                        }
                        transmissions[nchambre].trans[transInfo.date + '-' + transInfo.title ] = transInfo
                    })
                })
                unsafeWindow.transmissions = transmissions
            })
        }
        async function getFullTransmission($transEl, type="c"){
            //type = c pour cible, type = mc pour macrocible
            let infos={data:'', action:'', resultat:''}
            console.log($($transEl.click().data('title')).find('ul li.tool-title-c').text())
            let $modal = await $.waitFor('#CibleModalEdit:visible')
            $modal.modal('hide').find('.sbloc>.row>div').each((i,el)=>{
                infos[i == 0 ? "data": (i == 1 ? "action" : "resultat")] = $(el).text().trim()
            })
            await $.waitFor('#CibleModalEdit:not(:visible)')
            return infos
        }
    function checkTransOpen (){
        $.waitFor('#inputopen:visible:not(:checked)').then($el=>{
                $el.click()
                $('thead .glyphicon-triangle-right').click()
                let transmissions = {},
                    transIncompletes={}
                $('table.table>tbody>tr').each((i,el)=>{
                    let infosPatient = $('.tdPat', el).text().trim().match(/(?<nom>([A-Z]|\s|-)+) (?<prenom>([A-Z][a-z]+|\s|-)+) (?<ddn>[0-9]{2}\/[0-9]{2}\/[0-9]{4})/).groups,
                        nchambre=$('span[data-bind="text:NumeroLit"]', el).text().trim()
                    log(nchambre)
                    transmissions[nchambre]={patient:infosPatient,trans:{}}
                    transIncompletes[nchambre] = {}
                    $('.svg-elts-form', el).each((i,el2)=>{
                        let $infos=$($(el2).data('title')).find('ul'),
                            transInfo={title:$infos.find('li.tool-title').text(),date:$infos.find('li.tool-info').text().split(' (')[0]}
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
                            let infodata=''
                            $('div.macro-struct-title', $infos).each((i,el3)=>{
                                $(el3).next().find('dt').each((j,el4)=>{
                                    infodata += $(el4).text().trim() + " : " + $(el4).next().text().trim() + "<br>"
                                })
                                transInfo[$(el3).text()] = infodata
                            })
                            Object.assign(transInfo, {
                                type:'macrocible'
                            })
                        }
                        transmissions[nchambre].trans[transInfo.date + '-' + transInfo.title ] = transInfo
                    })
                })
                unsafeWindow.transmissions = transmissions
                                console.log(transIncompletes)
            })
        }
        window.addEventListener('message', ev=>{
            if(ev.data && ev.data.cr && ev.data.uf){
                $('.nav-cr-uf-secteur span.f_cr').parent().find('select').each((i,el)=>{
                    if($(el).val() != ev.data.cr){
                        $(el).val(ev.data.cr).change()
                        $.waitFor('.nav-cr-uf-secteur span.f_uf').then($el=>{
                            $el.parent().find('select').each((i,el)=>{
                                if($(el).val() != ev.data.uf){
                                    $(el).val(ev.data.uf).change()
                                }
                            })
                        })
                        $.waitFor('div.loader:visible').then(
                            $el=>$.waitFor('div.loader:not(:visible)').then($el2=>checkTransOpen())
                        )
                    } else {
                        $('.nav-cr-uf-secteur span.f_uf').parent().find('select').each((i,el)=>{
                            if($(el).val() != ev.data.uf){
                                $(el).val(ev.data.uf).change()
                            }
                        })
                        $.waitFor('div.loader:visible').then(
                            $el=>$.waitFor('div.loader:not(:visible)').then($el2=>checkTransOpen())
                        )
                    }
                })
            }
        })
        window.parent.postMessage(JSON.stringify({command:"transmissions_get-CR-UF"}))
        $('body').not(':has(#EasilyPlus_Style)').append($('<style id="EasilyPlus_Style">').html(`
    nav.navbar, .nav-cr-uf-secteur {display:none;}
    #module-ds-tc-jdt .table-residents>table>tbody {height: calc(100vh - 130px) !important;}
    table.table {margin-bottom:0!important}
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
            $('#specialiteSelection').parent().append($('<button class="BoutonClassique"><span title="Psychiatrie">Psychiatrie</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Psychiatrie)').click()
            })).append($('<button class="BoutonClassique" style="margin-left:5px;"><span title="FHR">FHR</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Psychiatrie)').click()
                $.waitFor('li[onclick]:contains(Observations Médicales)').then($el=>{
                    $el.click()
                    $.waitFor('li[onclick]:contains(FHR Observation Médicale - Psychiatrie)').then($el2=>{
                        $el2.click()
                    })
                })
            })).append($('<button class="BoutonClassique" style="margin-left:5px;"><span title="Consult">Consult</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Psychiatrie)').click()
                $.waitFor('li[onclick]:contains(Observations Médicales)').then($el=>{
                    $el.click()
                    $.waitFor('li[onclick]:contains(Fiche de Consultation Psy)').then($el2=>{
                        $el2.click()
                    })
                })
            })).append($('<button class="BoutonPrincipal" style="margin-left:5px;"><span title="Commun">Commun médical</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Commun Médical)').click()
            })).append($('<button class="BoutonPrincipal" style="margin-left:5px;"><span title="Transport">BdT</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Commun Médical)').click()
                $.waitFor('li[onclick]:contains(Cerfa)').then($el=>{
                    $el.click()
                    $.waitFor('li[onclick]:contains(Demande transport)').then($el2=>{
                        $el2.click()
                    })
                })
            })).append($('<button class="BoutonPrincipal" style="margin-left:5px;"><span title="Cerfas">Cerfas</span>').click(ev=>{
                $('#selectedDossierSpecialite-list li>span:contains(Commun Médical)').click()
                $.waitFor('li[onclick]:contains(Cerfa)').then($el=>{
                    $el.click()
                })
            }))
        } else if(location.pathname.match(/^\/dominho\/Fiche\/(Open|Create)/i)){
            if(!unsafeWindow._currentContext){return}
            //Expension des catégories "Contexte", "Sejour" et "Sortie" avec simple click
            $('.fm_grid_cell.fm_group_header.fm_group_header_lightgray, .fm_grid_cell.fm_group_header.fm_group_header_default').off().click(ev=>{
                //console.log($(ev.target).is('div.fm_group_header_expander'), $(ev.delegateTarget).find('div.fm_group_header_expander.image_expanded_png'))
                if(!$(ev.target).is('div.fm_group_header_expander')){
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
//     |    __)/    ~    \       _/
//     |     \ \    Y    /    |   \
//     \___  /  \___|_  /|____|_  /
//         \/         \/        \/
                    $('.header.headerScrolling>div:not([id])>div:first').clone().appendTo($('.header.headerScrolling>div:not([id])')).find('.ToolbarButtonImage').attr('class', 'ToolbarButtonImage image__envoyer-a-la-frappe_png').attr('icone', 'image__envoyer-a-la-frappe_png').siblings().remove().end()
                        .parent().attr({'onclick':'', 'Title': 'Remplissage auto de la fiche', 'id': '', 'ng-class':''}).click(async ev=>{
                        //let CB_content = await navigator.clipboard.readText()
                        //console.log(CB_content)
                        let observData = {}, $tmp, FHR_regex
                        µ.getFHR_Clipboard().then(clipData=>{
                            log(clipData)
                            if(EasilyInfos.FHR_auto_UHDL){
                                let clipDataArray
                                µ.clipData = clipData
                                // clipData = 'Motif hospitalisation :' + clipData.split('Motif hospitalisation')[1]
                                try{
                                clipData = clipData.split('Motif hospitalisation :')[1]
                                let sections = [
                                    {s:'Motif hospitalisation :', o:'motif'},
                                    {s:'Médecins référents :', o:''},
                                    {s:'ATCD médico-chirurgicaux personnels:', o:'atcd_med'},
                                    {s:'ATCD psychiatriques et addictologiques personnels :', o:'atcd_psy_perso'},
                                    {s:'ATCD psychiatriques et addictologiques familiaux :', o:'atcd_psy_fam'},
                                    {s:'Allergies :', o:'allergies'},
                                    {s:"Traitements en cours à l'admission:", o:'tttEntree'},
                                    {s:'Traitements psychotropes antérieurs :', o:'tttPsyAnte'},
                                    {s:'Mode de vie/bio :', o:'mdv'},
                                    {s:'Contacts :', o:'contact'},
                                    {s:'Anamnèse :', o:'hdlm'},
                                    {s:'Examen clinique initial ', o:'examSomaInit'},
                                    {s:'Entretiens :', o:'entretiens'},
                                    {s:'Commentaire général sur la prise en charge :', o:'commentaire'},
                                    {s:'Au total :', o:'conclusion'},
                                    {s:'Plan de sortie : ', o:'planSortie'},
                                    {s:'TTT de sortie :', o:'tttSortie'},
                                    {s:'Dr ', o:''}
                                ]
                                for(let section in sections){
                                    if(typeof sections[section-0+1] == "object"){
                                        clipDataArray = clipData.split(sections[section-0+1].s)
                                        if(sections[section].o && clipDataArray.length == 2){
                                            observData[sections[section].o] = clipDataArray.shift().trim()
                                        } else {
                                            clipDataArray.shift()
                                        }
                                        clipData = clipDataArray.shift()
                                    }
                                }
                                }catch(e){}
                                /*
                                try{
                                    FHR_regex = new RegExp(
                                        /Motif hospitalisation \:\s?(?<motif>.*?)\r?\n(.|\n|\r)*A/.source
                                        +/TCD médico.*?\r?\n(?<atcd_med>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/ATCD psychiatriques .*? personnels.*?\r?\n(?<atcd_psy_perso>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/ATCD psy.*?familiaux.*?\r?\n(?<atcd_psy_fam>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/Allergies.*?\r?\n(?<allergies>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/Traitements en.*?\r?\n(?<tttEntree>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/Traitements psycho.*?\r?\n(?<tttPsyAnte>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/Mode de vi.*?\r?\n(?<mdv>(.|\n|\r)*?)\r?\n.*?\r?\n/.source
                                        +/Contact.*?\r?\n(?<contact>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/Anamn.*?\r?\n(?<hdlm>(.|\n|\r)*?)\r?\n.*?\r?\n/.source
                                        +/Examen clinique ini.*?\r?\n(?<examSomaInit>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/Entretiens :.*?\r?\n(?<entretiens>(.|\n|\r)*?)\r?\n.*?\r?\n/.source
                                        +/Commentaire gé.*?\r?\n(?<commentaire>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/Au total.*?\r?\n(?<conclusion>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/Plan de sortie.*?\r?\n(?<planSortie>(.|\n|\r)*?)(\r?\n.*?)?(\r?\n)?/.source
                                        +/TTT de sortie.*?\r?\n(?<tttSortie>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                        +/Dr /.source
                                        /*
                                    /*
                                    )
                                    observData = clipData.match(FHR_regex).groups
                                    //log(observData)
                                    µ.observData = observData
                                }catch(e){
                                    let FHR_regexArray = [/Motif hospitalisation \:\s?(?<motif>.*?)\r?\n(.|\n|\r)*ATCD médico/.source,
                                                          /ATCD médico.*?\r?\n(?<atcd_med>(.|\n|\r)*?)\r?\n.*?(\r?\n)?ATCD psychiatriques .*? personnels/.source,
                                                          /ATCD psychiatriques .*? personnels.*?\r?\n(?<atcd_psy_perso>(.|\n|\r)*?)\r?\n.*?(\r?\n)?ATCD psy.*?familiaux/.source,
                                                          /ATCD psy.*?familiaux.*?\r?\n(?<atcd_psy_fam>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source,
                                                          /Allergies.*?\r?\n(?<allergies>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Traitements en/.source,
                                                          /Traitements en.*?\r?\n(?<tttEntree>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Traitements psycho/.source,
                                                          /Traitements psycho.*?\r?\n(?<tttPsyAnte>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Mode de vi/.source,
                                                          /Mode de vi.*?\r?\n(?<mdv>(.|\n|\r)*?)\r?\n.*?\r?\nContact/.source,
                                                          /Contact.*?\r?\n(?<contact>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Anamn/.source,
                                                          /Anamn.*?\r?\n(?<hdlm>(.|\n|\r)*?)\r?\n.*?\r?\nExamen clinique ini/.source,
                                                          /Examen clinique ini.*?\r?\n(?<examSomaInit>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Entretiens :/.source,
                                                          /Entretiens :.*?\r?\n(?<entretiens>(.|\n|\r)*?)\r?\n.*?\r?\nCommentaire gé/.source,
                                                          /Commentaire gé.*?\r?\n(?<commentaire>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Au total/.source,
                                                          /Au total.*?\r?\n(?<conclusion>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Plan de sortie/.source,
                                                          /Plan de sortie.*?\r?\n(?<planSortie>(.|\n|\r)*?)(\r?\n.*?)?(\r?\n)?TTT de sortie/.source,
                                                          /TTT de sortie.*?\r?\n(?<tttSortie>(.|\n|\r)*?)\r?\n.*?(\r?\n)?Dr /.source]
                                    for (FHR_regex of FHR_regexArray){
                                        try{Object.assign(observData, observData.match(new RegExp(FHR_regex)).groups)}catch(e){}
                                    }
                                    log(observData)
                                }
                                */
                                try{observData.tttSortie = observData.tttSortie.trim()}catch(e){}
                                FHR_regex = new RegExp(
                                    /Evaluation.*?\r?\n(?<examPsyEntree>(.|\r|\n)*?)\r?\n/.source
                                    +/Diagnostic initial.*?\r?\n(?<diagEntree>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                    +/Mobilisation des ressources.*?\r?\n(?<pecEntree>(.|\n|\r)*?)\r?\n.*?(\r?\n)?/.source
                                    +/Accompagnement au projet/.source
                                )
                                try{Object.assign(observData, observData.entretiens.match(FHR_regex).groups)}catch(e){}
                                observData.examSomaInit = observData.examSomaInit.split('):')[1]
                                observData.tttSortie = observData.tttSortie.split('Documents de sortie')[0].trim()
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
                                        $addMedBtn.click()
                                        $.waitFor('input.k-input.fm_dropdownlistpractician:not(.medUHDL)').then($el=>{$el.val("MERY, Raphael").addClass('medUHDL')})
                                    }
                                    if(!(MedecinsUHDL & 2)){
                                        $addMedBtn.click()
                                        $.waitFor('input.k-input.fm_dropdownlistpractician:not(.medUHDL)').then($el=>{$el.val("HARRY, Adrien").addClass('medUHDL')})
                                    }
                                })
                                //Histoire de la maladie
                                $('.fm_grid_cell:contains(Histoire de la maladie):last').each((i,el)=>{
                                    let $elem=$(el)
                                    while(!$elem.find('iframe').length){
                                        $elem=$elem.parent().closest('.fm_grid_cell')
                                    }
                                    $elem.find('iframe').each((j,el2)=>{if(observData.hdlm)$('body', el2.contentDocument).html('<pre>'+observData.hdlm + '</pre>')})
                                })
                                //Synthèse de séjour / commentaire
                                $('.fm_grid_cell:contains(Synthèse de séjour):last').each((i,el)=>{
                                    let $elem=$(el)
                                    while(!$elem.find('iframe').length){
                                        $elem=$elem.parent().closest('.fm_grid_cell')
                                    }
                                    $elem.find('iframe').each((j,el2)=>{if(observData.commentaire)$('body', el2.contentDocument).html('<pre>'+observData.commentaire+ '</pre>')})
                                })
                                //Mode de vie
                                $('.fm_grid_cell:contains(Mode de vie):last').each((i,el)=>{
                                    let $elem=$(el)
                                    while(!$elem.find('textarea').length){
                                        $elem=$elem.parent().closest('.fm_grid_cell')
                                    }
                                    if(observData.mdv)$elem.find('textarea').val(observData.mdv).trigger('keyup')
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
                                            $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val((i,t)=>observData.diagEntree ?? ( t ? t : '.')).trigger('input')
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
                                            $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val((i,t)=>observData.tttEntree ?? ( t ? t : '.')).trigger('input')
                                            break
                                        case "Diagnostic de sortie*":
                                            $(el).parent().closest('td.fm_grid_cell').parent().next().find('textarea').val((i,t)=>observData.auTotal ?? ( t ? t : '.')).trigger('input')
                                            break
                                        case 'Destination du patient à la sortie*':
                                            //console.log($(el))
                                            $(el).parent().next().find('input:first').prop('checked',true).log().click()
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

        if(GM_getValue('fromLogin', false)){

            setTimeout(()=>{console.log(GM_getValue('fromLogin', false));GM_setValue('fromLogin', false);$(window).click()}, 1500)
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
                        } else if ($(ev.target).is('a:contains(Imagerie)')){
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
                                $(ev.target).click()
                                $.waitFor('span.libelledoc:contains(FHR Observation Médicale - Psychiatrie)').then($el=>{
                                    try{$el.closest('li:has(.iconDependanceDoc)').find('div.iconmodif').click()}catch(e){}
                                    if(EasilyInfos.fast_edit_Lettre && $el.closest('li:has(.icon-dependance:visible)').length){
                                        $.waitFor('li:has(span.libelledoc:contains(Lettre de Liaison valant CRH Psy)) div.iconmodif:visible', $el.closest('li:has(.iconDependanceDoc)').next('li')).then($el2=>{
                                            try{
                                                $el2.click()
                                            }catch(e){
                                            }
                                            $.waitFor('div.edit-document', $el2.closest('li')).then($el3=>$el3.click())
                                        })
                                    } else {
                                        $.waitFor(find('div.edit-document'), $el.closest('li:has(.iconDependanceDoc)').next('li')).then($el2=>$el2.click())
                                    }
                                })
                            }
                        }
                    }
                    //Gestion du menu
                    if($(ev.target).closest('#easily-univers').length){
                        if($(ev.target).is('a:contains("urgences")')){
                            $('li[title="ASUR (Urgences)"]').click()
                        } else if($(ev.target).is('a:contains("hospitalisation")')){
                            $('li[title="Patients en psy (WorklistsHospitalisation)"]').click()
                            unsafeWindow.isHospitalisationLoaded = false
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
                    document.getElementById('transmissionsFrame').contentWindow.postMessage({cr:$('#dropdownCR').val().split(':')[1], uf:$('#dropdownUF').val().split(':')[1]})
                    /*
                    if(!$('#transmissionsFrame').dialog('open').parent().height($(window).height() - 50).width($(window).width() - 50).position({my:"center", at:"center", of:window}).length){
                        $('<iframe id="transmissionsFrame" src="/Module/DS_TC/JDT/Index">').dialog()
                        $.waitFor('div[aria-describedby="transmissionsFrame"]').then($el=>{
                            $el.height($(window).height() - 50).width($(window).width() - 50).position({my:"center", at:"center", of:window}).attr('id', 'transmissionsDialog')
                        })
                    } else {
                    }
                    */
                }))
            })
        }
    })



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
                    $img = $('.area-carrousel li:contains(Biologie):not(:contains(Pres))').attr('title', alert_title).find('img')
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
                frameOrigin.contentWindow.postMessage({cr:$('#dropdownCR').val().split(':')[1], uf:$('#dropdownUF').val().split(':')[1]})
                break
        }

//       ___ _                                     _                _   _         _
//      / __| |_  __ _ _ _  __ _ ___ _ __  ___ _ _| |_   _ __  __ _| |_(_)___ _ _| |_
//     | (__| ' \/ _` | ' \/ _` / -_) '  \/ -_) ' \  _| | '_ \/ _` |  _| / -_) ' \  _|
//      \___|_||_\__,_|_||_\__, \___|_|_|_\___|_||_\__| | .__/\__,_|\__|_\___|_||_\__|
//                         |___/                        |_|
        if (µ._data && µ._data.PatientId){
            try{
                µ.currentPatient = /(?<nom>[A-Z'\s-]*)\s(?<prenom>[A-Z][a-z'\s-]*)\sn/.exec(µ._data.NomPatient).groups
                Object.assign(µ.currentPatient, $('.infosPatient:visible:first').text().match(/le (?<DDN>\d{2}\/\d{2}\/\d{4}\/*).* - IPP : (?<IPP>\d*)/).groups)
                //µ.currentPatient.IPP = $('.infosPatient:visible:first').text().split(' : ')[1]
                //µ.currentPatient.DDN = $('.infosPatient:visible:first').text().split('le ')[1].split(" (")[0]
                µ.currentPatient.sexe = µ._data.PatientSexe == "Femme" ? "f" : "m"
                µ.currentPatient.ID = µ._data.PatientId
                µ.currentPatient.IEP = µ._data.VenueNumero
                console.log('Changement de patient pour : ' + µ.currentPatient.nom + " " + µ.currentPatient.prenom)
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
        #transmissionsFrame {width:100%!important;height:calc(100% - 5px)!important;padding:0!important}
        #specialiteSelection{display:none;}
        .area-carrousel img.warning, .area-carrousel img.vide, .area-carrousel img.signe,.area-carrousel img.arrete, .area-carrousel img.arr-prog {
              background: url(/Modules/WorklistsHospitalisation/Content/images/prescription/sprite_prescription.png) no-repeat;
              height: 16px;width: 16px;display: inline-block;vertical-align: text-bottom;-webkit-print-color-adjust: exact;display:initial!important;position:absolute;}
        .area-carrousel img.vide {background-position: -32px -16px}
        .area-carrousel img.signe {background-position: -32px 0}
        .area-carrousel img.warning {background-position: -16px -16px}
        .area-carrousel img.arrete {background-position: -16px 0}
        .area-carrousel img.arr-prog {background-position: 0 -16px}
        .area-carrousel img[src*=png] {position:absolute;width:16px;}
    `).appendTo('body')
    }
    // Your code here...
})();



function changementContextePatient(){
    let EasilyInfos = GM_getValue('EasilyInfos',{"user":"", "password":""})
    //<i class='fa fa-carret'></i>
    let $ = unsafeWindow.jQuery
    if($('.area-carrousel:visible li:contains(Prescrire):not(.easily_plus)').length){
        $('.area-carrousel-wrapper li:not(.menu-links)>a:contains("Liens")').append("<i class='fa fa-caret-down' style='margin-left:5px;'></i>").parent().addClass("menu-links")
            .append("<li class='li_links'></li><li class='li_links'></li>")
        $('.area-carrousel-wrapper li>a:contains("Anapath")').text('Pres Biologie')

        $.waitFor('.area-carrousel:visible li:contains(Prescrire):not(.easily_plus)').then($el=>{
            $el.addClass('easily_plus')
            $('li:contains(Biologie):not(:contains(Pres Bio))', '.area-carrousel').click()
            setTimeout(()=>{
                $('.area-carrousel:visible').eq(1).find('li:first').click()
            }, 1000)
        })
        $.waitFor('#module-bioboxes-imagerie').then($el=>{
            $el.not(':has(#xploreFrame)').html("").addClass('xplore_frame').append('<iframe id="xploreFrame" style="width:100%;height:100%" src="https://xplore.chu-clermontferrand.fr/XaIntranet/#/ExternalOpener?login=aharry&name=FicheDemandeRV&target=WindowDefault&param1=CREATE-FROM-NUMIPP&param2='+unsafeWindow.currentPatient.IPP+'">')
        })

        $.waitFor('#module-bioboxes-anapath').then($el=>{
            $el.not(':has(#presBioFrame)').html("").addClass('pres-bio_frame').append('<iframe id="presBioFrame" style="width:calc(100% - 10px);height:calc(100% - 5px)" src="https://cyberlab.chu-clermontferrand.fr">')
        })
        $.waitFor('#module-bioboxes-biologie').then($el=>{
            $el.not(':has(#cyberlabFrame)').html("").addClass('cyberlab_frame').append('<iframe id="cyberlabFrame" style="width:calc(100% - 10px);height:calc(100% - 5px)" src="https://cyberlab.chu-clermontferrand.fr">')
        })

        $('.area-carrousel:visible:eq(0)>ul>li:last:not(#synth_patient)').after($('.area-carrousel:visible:eq(0)>ul>li:last').clone().attr('id', 'synth_patient').find('a').text('XWay').attr('id','').attr('href', `Lancemodule: SYNTHESE_PAT;${unsafeWindow.currentPatient.IPP};LOGINAD=${EasilyInfos.username}`).end())

    }
    //modules
    // Lancemodule: SYNTHESE_PAT;${IPP};LOGINAD=${username}   == Synthèse Logon
    // Lancemodule: IMAGES_PATIENT;${IPP};LOGINAD=${username}     == PACS
}
