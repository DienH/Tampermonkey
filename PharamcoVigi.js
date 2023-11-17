// ==UserScript==
// @name         Pharmaco-Decleration
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://pharmacologie-clermont.fr/declaration-de-pharmacovigilance-addictovigilance-ordonnance-falsifiee/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pharmacologie-clermont.fr
// @grant        unsafeWindow
// ==/UserScript==

(function() {
    if (typeof $ == "undefined" && typeof unsafeWindow.parent.jQuery != "undefined"){
        var $ = unsafeWindow.parent.jQuery;
        unsafeWindow.parent.$ = $;
    }
    var listeDeclarants = {
        "colin":{
            nom:"COLIN",
            prenom:"Johan",
            prof:"Psychiatre",
            email:"jcolin@chu-clermontferrand.fr",
            cp:"63000"
        },
        "harry":{
            nom:"HARRY",
            prenom:"Adrien",
            prof:"Psychiatre",
            email:"aharry@chu-clermontferrand.fr",
            cp:"63000"
        }
    }
    //console.log(unsafeWindow.parent.jQuery);
    $('#myDropdownBtn').click()
    if($('h2:contains("INFORMATIONS SUR LE D")').length){

        navigator.permissions.query({name: "clipboard-read"}).then(result => {
            navigator.clipboard.readText().then(clipText => {
                let [patient_nom, patient_prenom, patient_age, patient_sexe] = clipText.split("|")
                if(typeof patient_sexe != "undefined"){
                    $('#'+$('label:contains(du nom*)').attr('for')).val(patient_nom)
                    $('#'+$('label:contains(du prénom*)').attr('for')).val(patient_prenom)
                    $('#'+$('label:contains(Age*)').attr('for')).val(patient_age)
                    $('#'+$('label:contains(Sexe*)').attr('for')).val(patient_sexe)
                }
            })
            if (result.state == "granted" || result.state == "prompt") {
                $('h2:contains(PATIENT)').after($("<button>Remplisage auto</button>").click(ev=>{
                    navigator.clipboard.readText().then(clipText => {
                        let [patient_nom, patient_prenom, patient_age, patient_sexe] = clipText.split("|")
                        if(typeof patient_sexe != "undefined"){
                            $('#'+$('label:contains(du nom*)').attr('for')).val(patient_nom)
                            $('#'+$('label:contains(du prénom*)').attr('for')).val(patient_prenom)
                            $('#'+$('label:contains(Age*)').attr('for')).val(patient_age)
                            $('#'+$('label:contains(Sexe*)').attr('for')).val(patient_sexe)
                        }
                    })
                }))
            } else {
                console.warning("Clipboard access denied.")
            }
        })
       //     setTimeout(()=>{
        $('#'+$('label:contains(CHU)').attr('for')).attr('checked','true')
            /*.each((i,el)=>{
            $('button[type=submit]').eq(0).click()
        })*/
        $('select:contains("Psychiatrie"):visible').val('Psychiatrie enfant-adulte').change()
            /*.each((i,el)=>{
            $('button[type=submit]').eq(0).click()
        })*/
        $('#'+$('label:contains("Nom"):not(:contains(structure))').attr('for')).val(listeDeclarants.colin.nom)
        $('#'+$('label:contains("Prénom")').attr('for')).val(listeDeclarants.colin.prenom)
        $('#'+$('label:contains("Email")').attr('for')).val(listeDeclarants.colin.email)
        $('#'+$('label:contains(Code postal)').attr('for')).val(listeDeclarants.colin.cp)
        $('#'+$('label:contains(Profession)').attr('for')).val(listeDeclarants.colin.prof)
        $('#'+$('label:contains(Grave)').attr('for')).attr('checked','true')
        $('#'+$("label:contains(prolongation d'hospitalisation)").attr('for')).attr('checked','true')

            //.each((i,el)=>{
        //})
        //    }, 500)
        //quform_1_5_ce3e55_1
        //$('button[type=submit]').eq(0).click()
        //console.log('bouh')
    }
    // Your code here...
})();
