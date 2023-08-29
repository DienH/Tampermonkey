// ==UserScript==
// @name         Trajectoire+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Trajectoire
// @author       You
// @match        https://trajectoire.sante-ra.fr/Trajectoire/pages/AccesRestreint/Angular/App.aspx/Sanitaire/Dossier/*
// @match        https://trajectoire.sante-ra.fr/Trajectoire/Pages/AccesLibre/Login.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trajectoire.sante-ra.fr
// @grant        none
// ==/UserScript==

const zip = (a, b) => {let c={};a.map((k, i) => {c[k] = b[i]});return c};

(function() {
    'use strict';
    var $ = window.jQuery
    setInterval(remplissageAuto, 1000);
    setTimeout(autoLogin, 200);
    // Your code here...
})();


function remplissageAuto(){
    if (!$ || !$.fn){var $ = window.jQuery}
    navigator.permissions.query({name: "clipboard-read"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
            setTimeout(()=>{
                if ($('#remplissageAuto').length){return false}
                let $coordonnees = $('volet-administratif .panel-commun-volet-administratif:has(span:contains(Coordonnées))>div:last'),
                    inputEvent = new Event("input", { bubbles: true, cancelable: true })
                $('[formcontrolname="identiteInconnue"]').parent()
                    .after($('<div style="display:flex;justify-content:center;width:100%"><button id="remplissageAuto" style="margin-left: 50px; padding: 10px; background: green; border: grey; border-radius: 5px; color: white; font-size: 14px;" type="button">Remplissage auto</button></div>')
                           .click(ev => {
                    navigator.clipboard.readText().then(clipText => {
                        let infos_patient = zip(["Nom_naissance", "Nom_usage", "Prenom", "DDN", "Sexe", "Tel", "Adresse_rue", "Adresse_CP", "Adresse_Ville", "NSS"], clipText.split("\t")),
                            $etatCiv = $('etat-civil').find('label:contains("' + infos_patient.Sexe + '"):has(input):last').click().end()
                        $etatCiv.find('label:contains("Nom de naissance")').next().find('input').val(infos_patient.Nom_naissance).each((i,el)=>{el.dispatchEvent(inputEvent)})
                        if (infos_patient.Sexe == "Féminin"){
                            $etatCiv.find('label:contains("Nom utilisé")').next().find('input').val(infos_patient.Nom_usage).each((i,el)=>{el.dispatchEvent(inputEvent)})
                        }
                        $etatCiv.find('label:contains("Premier prénom de naissance")').next().find('input').val(infos_patient.Prenom).each((i,el)=>{el.dispatchEvent(inputEvent)})
                        $etatCiv.find('label:contains("Date de naissance")').next().find('input').val(infos_patient.DDN).each((i,el)=>{el.dispatchEvent(inputEvent)})
                        //console.log(infos_patient)
                    });
                }))
                $coordonnees.before($('<div style="display:flex;justify-content:center;width:100%"><button id="remplissageAuto" style="margin-left: 50px; padding: 10px; background: green; border: grey; border-radius: 5px; color: white; font-size: 14px;" type="button">Remplissage auto</button></div>')
                                    .click(ev => {
                    navigator.clipboard.readText().then(clipText => {
                        let infos_patient = zip(["Nom_naissance", "Nom_usage", "Prenom", "DDN", "Sexe", "Tel", "Adresse_rue", "Adresse_CP", "Adresse_Ville", "NSS"], clipText.split("\t"))
                        $coordonnees.find('label:contains("Adresse actuelle")').next().find('input').val(infos_patient.Adresse_rue.trim()).each((i,el)=>{el.dispatchEvent(inputEvent)})
                        //$coordonnees.find('label:contains("Code postal")').next().find('input').val(infos_patient.Adresse_CP)
                        $coordonnees.find('label:contains("Code postal")').next().find('input').val(infos_patient.Adresse_CP).focus().each((i,el)=>{el.dispatchEvent(inputEvent)})
                        setTimeout(()=>{ $coordonnees.find('label:contains("Code postal")').next().find('input').next('ul').find('>li:contains('+ infos_patient.Adresse_Ville +')').click()}, 500)
                        // + " - " + infos_patient.Adresse_Ville
                        $coordonnees.find('label:contains("Téléphone portable")').next().find('input').val(infos_patient.Tel).each((i,el)=>{el.dispatchEvent(inputEvent)})
                        $('volet-administratif .panel-commun-volet-administratif:has(span:contains(Prise en charge des soins ou du séjour))>div:last')
                            .find('label:contains("N° de sécurité sociale")').next().find('input').val(infos_patient.NSS.trim()).each((i,el)=>{el.dispatchEvent(inputEvent)})
                        //console.log(infos_patient)
                    });
                }))
                $('service-demandeur>champs-obligatoires').after($('<div style="display:flex;justify-content:center;width:100%"><button id="remplissageAuto" style="margin-left: 50px; padding: 10px; background: green; border: grey; border-radius: 5px; color: white; font-size: 14px;" type="button">Remplissage auto</button></div>')
                                    .click(ev => {
                    $('.buttonSanitaireSansBordures').first().click()
                    setTimeout(()=>{
                        $('div.PopupEquipeSoignante div.modal-body div.div_contact_sanitaire:first').click()
                        $('.buttonSanitaireSansBordures').eq(1).click()
                        setTimeout(()=>{
                            $('div.PopupEquipeSoignante div.modal-body div.div_contact_sanitaire:first').click()
                            $('.buttonSanitaireSansBordures').eq(2).click()
                            setTimeout(()=>{
                                $('div.PopupEquipeSoignante div.modal-body div.div_contact_sanitaire:first').click()
                                $('button[title="Valider le service demandeur"]').click()
                            }, 200)
                        }, 200)
                    }, 200)
                }))
            }, 100)
            /* On peut alors écrire dans le presse-papier */
        } else {
            console.warn("Accès interdit au presse-papier")
        }

    });
}

function autoLogin(){
    if (!$ || !$.fn){var $ = window.jQuery}
    console.log(location.pathname.search('Login.aspx')+1)
    if (window.parent != window.top){
        window.parent.postMessage("trajectoireLogin", "http://meva/m-eva/")
        window.onmessage = function(message){
            console.log(message)
            if (message.origin == "http://meva" && typeof(message.data) == "object" && message.data.user && message.data.trajectoirePassword){
                $('#UserName').val(message.data.user)
                $('input[type=password]').each((i,el)=>{
                    $(el).val(message.data.trajectoirePassword)
                    if(message.data.autoLogon){
                        $('input[type=submit]').click()
                    }
                })
            }
        }
    }
}
