// ==UserScript==
// icon         http://manywork.ru/files/user/3100/portfolio/yes/1414902476-5214590_s.jpg
// @icon         http://www.userlogos.org/files/logos/abudayev/myzuka.jpg
// @name         Super Myzuka
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  Myzuka.club optimisée
// @author       Dien ©
// @match        myzuka.club/*
// @match        http://go.mail.ru/*
// @domain       *.imyz.me
// @updateURL    https://rawgit.com/DienH/Tampermonkey/master/myzuka.js
// @downloadURL  https://rawgit.com/DienH/Tampermonkey/master/myzuka.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @resource     jQueryUICSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.ui-contextmenu/1.18.1/jquery.ui-contextmenu.min.js
// @require      https://rawgit.com/DienH/Tampermonkey/master/Dien.js
// @resource     GlyphiconsCSS http://www.aetherbyte.com/forum/styles/digi/theme/fonts/glyphicons-pro-1.9.2/css/glyphicons.css
// Glyphicons    http://www.aetherbyte.com/forum/styles/digi/theme/fonts/glyphicons-pro-1.9.2/fonts/
// @connect      *
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        window.focus
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==


var µ = unsafeWindow, µ$=µ.$;
if (!$)
{
    var $ = window.jQuery
    }
unsafeWindow.$$ = $;

(function($) {
    $.fn.translate = function(word){
        for(var i=0;i<word.length;i++){
            this.filter(':contains('+word[i][0]+')').html(function(a, txt){
                if (word[i][0] == "EP("){
                    return txt.replace(word[i][0], word[i][1]);
                }
                return txt.replaceAll(word[i][0], word[i][1]);
            });
        }
        return this;
    };
}(window.jQuery));

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
Element.prototype.setTagName=function(strTN) {
    var oHTML=this.outerHTML, tempTag=document.createElement(strTN); //document.createElement will fire an error if string has wrong characters.
    var tName={original: this.tagName.toUpperCase(), change: strTN.toUpperCase()};
    if (tName.original == tName.change) return;
    oHTML=oHTML.replace(RegExp("(^\<" + tName.original + ")|(" + tName.original + "\>$)","gi"), function(x){return (x.toUpperCase().replace(tName.original, tName.change));});
    tempTag.innerHTML=oHTML;
    this.parentElement.replaceChild(tempTag.firstChild,this);
};

if (document.location.hostname === "go.mail.ru"){
    $('a[target]').attr("target", "");
    $('div.zaycev__artist_buttons').remove();
    return;
}



var $jPe = µ.$('#jplayer_N'), $jPN = $('#jp_container_N');

function volume(e){
    if (!e){
        volume.vol = GM_getValue("volume", 0.2);
        µ.$('.jp-volume-bar').prepend($('<div class="lter custom-volume">').css("width", volume.vol*100+"%"));
        $jPe.jPlayer('volume', volume.vol * volume.vol);
        if (GM_getValue("mute", false)){
            $jPe.jPlayer('mute');
            $('div.lter.custom-volume').hide();
        }
        $jPe.on("jPlayer_volumechange", volume);
        $(window).on('mousewheel', volume);
    }else if (e.type === "jPlayer_volumechange"){
        let jPopts = e.jPlayer.options;
        if (!jPopts.muted && jPopts.volume !== volume.vol){
            $('div.lter.custom-volume').css("width", jPopts.volume*100+"%");
            GM_setValue("volume", jPopts.volume);
            volume.vol = jPopts.volume * jPopts.volume;
            $jPe.jPlayer('volume', volume.vol);
        }
        GM_setValue("mute", jPopts.muted);
    }else if (e.type === "mousewheel")
    {
        if (e.target.classList.contains("jp-volume") || $(e.target).parents().is(".jp-volume"))
        {
            e.preventDefault();
            volume.vol = volume.vol + (0.01 + volume.vol * volume.vol * 0.07) *(e.originalEvent.wheelDelta > 0 ? 1 : -1);
            volume.vol = volume.vol > 1 ? 1 : volume.vol < 0 ? 0 : volume.vol;
            $jPe.jPlayer('volume', volume.vol);
            $('div.lter.custom-volume').css("width", Math.sqrt(volume.vol)*100+"%");
        }
    }
}

function downloadSongs(i){
    if (!i){
        if(downloadSongs.started){
            return;
        }else{
            downloadSongs.started = true;
        }
    }
    setTimeout(function(){
        let $song = $('div.player-inline>div.play>span:eq('+i+')'), artistAlbumName = $('h1').text();
        if($song.length){
            log("Downloading song #"+(i+1));
            GM_download($song.data("url"), artistAlbumName + " - "+(i < 9 ? "0"+(i+1):""+(i+1))+" - "+$('div.details>p>a', $song.parent().parent()).text()+".mp3");
            downloadSongs(++i);
        }else{downloadSongs.started = false;}
    }, 300);
}
function currentlyPlayingSong(e){
    let media = Object.assign(e.jPlayer.status.media), songUrl = media.mp3.split("?")[0].split("/"), $jPTitle = $jPN.find('.jp-title')
    media.artist=[]
    songUrl.splice(songUrl.length-2,1)
    songUrl=songUrl.join("/")
    $.get(songUrl, function(data){
        let details = $('div.main-details .cont tbody', data)
        details.find('a[href*="/Artist"]').each(function(i){media.artist[i]={name:$(this).text().trim(),Url:$(this).href()}})
        details.find('a[href*="/Album"]').do(function(){media.album={name:$(this).text().trim(),Url:$(this).href()}})
        media.song={name:$('#bodyContent .breadcrumbs span[itemprop="title"]', data).text(), Url:songUrl}
        let $img = $('div.main-details .vis img', data)
        media.artwork= $('div.main-details .vis img', data).attr("src")
        $jPN.find('.jp-artwork img').attr("src", media.artwork)

        //$jPTitle.children('td').children().unwrap()
    })
    $jPN.find('.jp-title').each(function(){this.media = media})
}
function saveMP3(link, name) {
    GM_xmlhttpRequest({
        method:"GET",
        url:link,
        binary:true,
        responseType:"blob",
        overrideMimeType:"audio/mpeg",
        onload:function(response){
            let a = document.createElement("a"),
                blobUrl = window.URL.createObjectURL(response.response);
                //blob = new Blob(response.responseText, {type: "audio/mpeg"}),
            a.style = "display: none";
            a.download = name+".mp3"
            a.href = blobUrl;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(blobUrl);
            a.remove()
        }
    })
}
function myzukaLoad(){
    if(!myzukaLoad.started){myzukaLoad.started = false;}else{return;}
    if(document.body.classList.contains("disabled")){setTimeout(myzukaLoad, 500);return;}
    if (myzukaLoad.href ? myzukaLoad.href !== window.location.href : true){
        myzukaLoad.started = true;
        var path = getPath();
        let artistName;

        switch (path[0]){
            case "Song":
                $('title').text(
                    $('div.breadcrumbs>a[href*="Artist/"]>span').text()+//Artist
                    " - "+$('div.breadcrumbs>span').text()+//Song
                    " (album "+$('div.breadcrumbs>a[href*="Album"]>span').text()+//Album
                    ") | Musique | Muzyka"
                );
                break;
            case "Album":
                $('a, td, h3, h1, h2, select, span').translate(wordAl);
                $('title').text(
                    $('#bodyContent>h1').text()+
                    " | Album | Muzyka"
                );
                $('div.main-details a.v2').attr("href", "#").text(" Télécharger l'album").prepend($("<span class='glyphicon glyphicon-save'>::before")).on("click", function(){
                    downloadSongs(0);
                    return false;
                })
                    .siblings("p").remove().end()
                    .siblings("button.play-all").replaceText(".", " Lire tout l'album").end()
                    .siblings("button").children("#f_text").text("Ajouter aux favoris");
                break;
            case "Artist":
                $('a, td, h3, h1, h2, select, span').translate(wordAr);
                artistName = $('#bodyContent>h1').text()
                $('title').text(
                    ((artistName.search("группы")+1) ? artistName.substr(15).slice(0,-1) : artistName.substr(8).slice(0,-1))+
                    " | Artiste | Muzyka");
                break;
            case "Letter":
                $('title').text(
                    "Artistes en \""+window.location.pathname.split("/")[2]+
                    "\" | Muzyka.me");
                break;
            case "Upload":
                $('a, td, th, h3, h1, h2, select, span').translate(wordU);
                $('a[href="/Upload/Album"]:not(:has(span.glyphicon))').prepend($('<span class="glyphicon glyphicon-upload">::before')).wrapInner($('<button class="button-upload">')).parent().textNodes().remove().end().children('a[href*="Chat"]').remove();
                $('title').text(window.location.pathname.split("/")[1]+" | Muzyka");
                $('input[value="Сохранить"]').attr("value", " Enregistrer ");
                if (path[1]) switch (path[1]){
                    case "ViewAlbum":
                        $('#bodyContent a[href="/Upload"]').remove();
                        $('#bodyContent h1').text(function(i, txt){return txt.replace("Загруженный альбом", "Album uploadé ");});
                        break;
                    case "Songs":
                        $('#bodyContent h1').text(function(i, txt){return txt.replace("Загрузка треков", "Upload de l'album");});
                        $('div.alert-info').text("Cliquez sur « Ajouter des fichiers ... » pour ajouter des chansons à l'album. \nAprès avoir ajouté toutes les chansons, cliquez sur « Suivant ».\nSi vous avez des problèmes, utilisez le ").css("whiteSpace",  "pre-wrap").children("a").text("vieux chargeur.");
                        $("#add-button>span").text("Ajouter des fichiers ...");
                        break;
                    case "Album":
                        break;
                    case "EditSongs":
                        $('#bodyContent h1').text(function(i, txt){return txt.replace("Треки нового альбома", "Pistes de l'album ");});
                        $('div.alert-info').remove();
                        $('p>a.btn.btn-primary.no-ajaxy').text("Ajouter des pistes");
                        $('p>a.btn.btn-primary:not(.no-ajaxy)').text("Modifier l'album");
                        $('div.panel-heading').text("Pistes de l'album");
                        $("#btnSave").val("Enregistrer");
                        $('#btnSendToModerator').val("Publier");
                        $('#btnDelete').val("Supprimer l'album");
                        $('a[href="/Upload/Album"]').text("Ajouter un autre album");
                        break;
                }
                break;
            default:
                $('title').text(window.location.pathname.split("/")[1]+" | Muzyka");
        }

        $('iframe').parent().add('#follow_btn, a.rbt, #TVZavr').remove();
        $('a, td, th, h3, h1, h2, select, span').translate(wordR);
        $('div.options>div.top').children("span.ico-plus").removeClass("ico-plus").addClass("glyphicon").siblings("a")
            .filter(':not(.no-ajaxy):not([itemprop="audio"]), [itemprop="audio"]').attr("class", "rbtb button-a dl").attr("title",function(a, txt){
            return txt.replace("Скачать", "Télécharger");})
            .text(" Télécharger").prepend($("<span class='glyphicon glyphicon-save'>::before")).off("click").filter(':not([href*="/Download"])')
            .on("click", function(){
            let $song = $('#play_' + $(this).siblings(".add-to-pl").data("id") + ' span'), songName;
            if (path[0] === "Album") {
                songName = $('h1').text()+ " - "+$song.parent().siblings(".position").text().trim()+" - "+$('div.details>p>a', $song.parent().parent()).text();
            } else {
                songName = $song.data("title")
            }
            saveMP3($song.data("url"), songName)
            //µ$.get(location.origin+$song.data("url"))
            //GM_download(location.origin+$song.data("url"), songName);
            return false;});
        $('div.icons, div.time').each(function(){
            if (this.className ==="time") {
                $(this).parent().siblings("div.options").children("div.data").append($('<span class="sep">|</span>')).append(this);
                this.setTagName("span");
            }else if ($(this).children()[0]){
                $(this).parent().siblings("div.options").children("div.data").prepend($('<span class="sep">|</span>')).prepend($(this));
                this.setTagName("span");
            }else{
                $(this).remove();
            }
        });
        $('a.jp-pause', $jPN).parent().addClass("jp-playpause");
        if (!$('#playerContextMenu').length) {
            let playerContextMenu =`
<ul id="playerContextMenu">
<li data-command="download"><div><span>Télécharger</span><span class="glyphicons glyphicons-download-alt contextmenu-icon"></span></div></li>
<li data-command="gotoSong"><div><span>Afficher la musique</span><span class="glyphicons glyphicons-music contextmenu-icon"></span></div></li>
<li data-command="gotoArtist"><div>Bouh</div></li>
<li data-command="gotoAlbum"><div><span>Afficher l'album</span><span class="glyphicons glyphicons-cd contextmenu-icon"></span></div></li>
</ul>
`;
            $(playerContextMenu).appendTo('body')
            $('<div class="hidden-xs hidden-sm jp-slashtime text-xs text-muted">/</div>').insertBefore('.jp-current-time+.jp-duration')
            $('<div class="jp-artwork"><img src></img></div>').insertBefore('.jp-controls .jp-progress')
        }
        $('div.jp-progress').contextmenu({
            delegate:this,
            /*
            menu:[
                {title:"Télécharger", cmd:"download", uiIcon: "ui-icon-disk"},
                {title:"Aller à l'album", cmd:"goToAlbum"},
                {title:"Aller à l'artiste", cmd:"goToArtist", uiIcon: "ui-icon-person"}
            ],
            */
            menu:$('#playerContextMenu'),
            select:function(e, ui){
                let media = $jPN.find('.jp-title').prop("media")
                if(!media){return false}
                switch(ui.cmd.split("-")[0]) {
                    case "download" :
                        GM_download(media.mp3, media.title+".mp3")
                        break;
                    case "gotoSong" :
                        µ.$("<a class='hidden' href="+media.song.Url+"></a>").appendTo('#bodyContent').click()
                        break;
                    case "gotoAlbum" :
                        µ.$("<a class='hidden' href="+media.album.Url+"></a>").appendTo('#bodyContent').click()
                        break;
                    case "gotoArtist" :
                        µ.$("<a class='hidden' href="+media.artist[ui.cmd.split("-")[1] || 0].Url+"></a>").appendTo('#bodyContent').click()
                        break;
                    default:
                        break;
                }
            },
            beforeOpen:function(e, ui){
                let media = $jPN.find('.jp-title').prop("media")
                if(!media){return false}
                if (media.artist.length > 1)
                {
                    let artistSubMenu = []
                    media.artist.forEach(function(val, i){artistSubMenu[i]={title:"<span>"+val.name+"</span><span class='glyphicons glyphicons-user contextmenu-icon'></span>",cmd:"gotoArtist-"+i}})
                    $(e.delegateTarget).contextmenu('setEntry', "gotoArtist", {title:"<span>Afficher l'artiste</span><span class='glyphicons glyphicons-group contextmenu-icon'></span>", cmd:"gotoArtist", children:artistSubMenu})
                }else{
                    $(e.delegateTarget).contextmenu('setEntry', "gotoArtist", {title:"<span>Afficher l'artiste</span><span class='glyphicons glyphicons-user contextmenu-icon'></span>", cmd:"gotoArtist"})
                }
            }
        })
        $jPe.on("jPlayer_play", currentlyPlayingSong)
        //$('a:not([data-events]):not([itemprop="audio"]):not(.no-ajaxy)').attr("data-events", "on").click(function(){myzukaLoad();});
        //title//*/
    }
    myzukaLoad.started = false;
    myzukaLoad.href = window.location.href;
    //console.log(myzukaLoad.href);
    //ajaxObserver.observe(ajaxUrl, headConfig);
}

function headerScroll(event) {
    headerScroll.event = event.type;
    if ((headerScroll.lastScroll < window.scrollY || headerScroll.event === "mouseleave" /*/&& !$(event.relatedTarget).parents('div.mainHeader')[0]/*/) && $('div.main-nav').is(":visible")){
        $('div.main-nav, div.mainHeader>div.pagin-letters').slideUp({queue: false, duration: 500, complete:function(){$(this).attr("style", "").css("display", "none");}});
    }else if ((headerScroll.lastScroll > window.scrollY || headerScroll.event ==="mouseenter") && $('div.main-nav').is(":hidden")){
        $('div.main-nav, div.mainHeader>div.pagin-letters').slideDown({queue: false, duration: 500});
    }
    headerScroll.lastScroll = window.scrollY;
}

document.addEventListener('keydown', function keyShortcut(e) {
    if (!e) e=event || window.event;
    log(e.code)
    if (!$(':focus').length)
    {
        if (e.code=="Space") {
            e.preventDefault();
            e.stopPropagation();
            if ($('#jp_audio_0').prop("paused"))
            {
                $jPe.jPlayer('play')
            } else {
                $jPe.jPlayer('pause')
            }
        } else if (e.code =="d"){
            e.preventDefault();
            e.stopPropagation();
            if ($('#jp_audio_0').attr("src"))
            {
                let media = $jPN.find('.jp-title').prop("media")
                GM_download(media.mp3, media.title+".mp3")
            }
        } else if(e.ctrlKey && e.code == "ArrowLeft")
        {
            µ$('a.jp-previous').click()
        } else if(e.ctrlKey && e.code == "ArrowRight")
        {
            µ$('a.jp-next').click()
        }
    }
    return false
});
var word = [
    ["Хиты", "топ аплоадеров", "популярные исполнители", "Все исполнители", "популярные жанры", "Все жанры", "Альбомы", "Сборники", "Саундтреки", "Радио", "ТОП-250", "Плейлисты", "Чат", "Добавить альбом", "Отключить рекламу", "Войти", "Регистрация", "топ аплоадеров", "Ваш рейтинг", "Ваш статус", "Обычный", "оценки", "избранное", "лента"], 
    ["Hits", "Top Uploaders", "Top Artistes", "Tous les artistes", "Top Genres", "Tous les genres", "Albums", "Compilations", "B-O", "Radio-Web", "Top 250", "Playlists", "Chat", "Ajouter un album", "Premium", "Connexion", "Inscription", "Top Uploaders", "Note", "Statut", "Normal", "Votes", "Favoris", "Flux"]
];
var wordAr = [
    ["Студийные альбомы","Albums studios "],
    ["Все","Tout "],
    ["Демо","Démo "],
    ["Синглы", "Singles "],
    ["Live выступления", "Lives "],
    ["DJ Миксы","Remixes "],
    ["Неофициальные сборники", "Compilations non officielles "],
    ["Другое", "Autres "],
    ["Микстейпы","Mixtapes "],
    ["Бутлеги", "Bootlegs "],
    ["разных исполнителей", "d'artistes "],
    ["Альбомы", "Albums"],
    ["Песни в альбоме", ""],
    ["треков", "titres"],
    ["ТОП ТОП ПЕСЕН", "Top Titres"],
    ["Саундтреки", "B-O "],
    ["EP(", "EP ("],
    ["Сборники исполнителя", "Best Off "],
    ["Сборники", "Compilations"],
    ["Год релиза", "Année de parution "],
];
var wordAl = [
    ["Жанр","Genre "],
    ["Исполнитель","Artiste(s) "],
    ["Дата релиза", "Date de sortie "],
    ["Тип", "Type "],
    ["Студийный альбом", "Album studio"],
    ["Загрузил","Uploader "],
    ["Лейбл", "Label "],
    ["Добавлено", "Ajouté le "],
    ["треков", "titres"],
    ["Песни в альбоме", "Chansons de l'album"]
];
var wordR=[
    ["Фото", "Photos"],
    ["фото","photos"],
    ["ВПЕРЕД", "Page suivante"],
    ["Исполнители", "Artistes"],
    ["альбомы","Albums"],
    ["Хит-Парады","Classements Hits"],
    ["песни","Titres"],
    ["Все","Tout "],
    ["Поиск","Rechercher"],
    ["Главная","Accueil"],
    ["Жанры", "Genres "],
    ["Жанр","Genre "],
    ["Альбом","Album "],
    ["Длительность","Durée "],
    ["Размер","Taille "],
    ["Рейтинг","Ecoutes "],
    ["Исполнитель","Artiste(s) "],
    ["Исполнители ","Artiste"],
    ["название","Titre"],
    ["рейтинг","Note"],
    ["новизна","Récent"],
    ["год","Année"],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""],
    ["", ""]
];
var wordU =[
    ["Выберите год", "Choisir l'année"],
    ["Загрузка музыки на сайт", "Ajout de musiques"],
    ["Загрузить альбом", "Uploader un album"],
    ["Загрузить еще альбом", "Uploader un autre album"],
    ["Новый альбом", "Nouvel album"],
    ["Текущая обложка", "Pochette actuelle "],
    ["Обложки нет", "Aucune pochette d'album"],
    ["Изменить обложку", "Changer la pochette"],
    ["Название", "Titre "],
    ["Описание", "Description "],
    ["Нет", "Aucun"],
    ["Выберите раздел", "Choisissez"],
    ["Загрузки на модерации", "Upload en attente"],
    ["Наименование", "Nom"],
    ["Уник.", "Unique"],
    ["Треков", "Titres"],
    ["Далее", "Suivant"],
    ["К списку", "Annuler"],
    ["Тип", "Type "],
    ["Год релиза", "Année de sortie "],
    ["Дата релиза", " Année de sortie "],
    ["Дата", "Date d'ajout"],
    ["Загрузил", " Uploader "],
    ["Битрейт", "Bitrate"],
    ["Редактировать треки", "Editer les pistes"],
];
var wordS = [
    ["Исполнители", "Artistes"],
    ["Альбомы", "Albums"],
    ["Треки", "Titres"],
    ["Тексты песен", "Paroles"],
];
var wordT = [
    ["Мои плейлисты", "Правила", "сообщения", "комментарии", "профиль"],
    ["Ma Playlist", "Réglement", "Messages", "Aucun commentaire", "Mon Profil"]
];

var headConfig = {attributes:true};
//$('head').observe(myzukaLoad, headconfig);
var ajaxUrl = document.body;
var ajaxObserver = new MutationObserver(function(mutations) {
    myzukaLoad();
    //ajaxObserver.disconnect();
    /*
    mutations.forEach(function(mutation){
        console.log(mutation);
        /*switch (mutation.type){
            case "childList" :
                bodyContentObserver.disconnect();
                break;
            case "attributes":
                break;
            case "characterData":
                break;
        }
    });*/
});
ajaxObserver.observe(ajaxUrl, headConfig);


var searchBox = document.getElementById("ui-id-1");
var searchBoxObserver = new MutationObserver(function(mutations) {
    $("#ui-id-1>li").translate(wordS);
});
var searchBoxObsConfig = {attributes: true};
searchBoxObserver.observe(searchBox, searchBoxObsConfig);

$('input[value="Поиск"]').attr("value", "Rechercher");
$('#SearchText').attr("placeholder", "Artiste, album, chanson, ...");
$(document).on("mousedown", ".ui-menu-item a", function(event){
    var target = (event.target.type == "LI") ? event.target : event.target.parentNode;
    target.classList.remove("ui-menu-item");
    target.firstChild.dataset.events="on";
    target.firstChild.click();
});
setTimeout(function(){
    $('#Right_1, #Left_1, #Right_2, #Left_2, .popup__overlay, #pluginInstall, #blackout').remove();
}, 500);
$('div.logo>a').text("");
$('a[data-toggle="tooltip"]').mouseover(function(e){
    let x = $(this).offset().left + ($(this).width() - $('div.tooltip').width()) / 2,
        y = $(this).offset().top + $(this).height() + 10;
    $('div.tooltip').offset({top:y, left:x});
}).attr("data-original-title", function(a, txt){
    return txt.replace(txt, wordT[1][wordT[0].indexOf(txt)]);
});

//header
$('<div class="mainHeader">').append($('div.all>div.header, div.all>div.main-nav, div.all>div.pagin-letters')).prependTo($('div.all'));
$('div.mainHeader').width($('div.main').width()).hover(headerScroll);
$('div.main-nav, div.mainHeader>div.pagin-letters').hide();


for(var i=0;i<word[0].length;i++){$('a, td, h3, div.profile-bar div').not('#bodyContent *, #bodyContent, html, head, title, body').filter(':contains('+word[0][i]+')').html(function(a, txt){return txt.replace(word[0][i], word[1][i]);});}

volume(false);


var classes =`
div.alert.alert-warning.alert-dismissible {display:none;!important}
#SearchText {padding-top:4px;}
.rbt .button-a.rbtb.dl {margin:11px;}
.rbtb, .button-a {font: bold 13px/30px Tahoma,sans-serif!important;}
a.button-a.dl {padding: 0px 11px;height: 30px;}
.button-a.rbtb.dl {background:#52a55c;margin:0;margin-right:11px;}
body {background:#ccc!important}
div.main, div.content, div.inner {background:#ccc!important}
div.main {border-top:none!important;margin-top:73px;}
.tbl tr:nth-child(2n+1) {background: #c0c0c0!important;}
.labels {margin-top:0!important}
.profile-bar {background: #ddd!important;box-shadow: 0px 0px 12px 7px #ddd;}
div.all {background: transparent!important;}
div.mainHeader {box-shadow:0px 0px 15px 7px #ddd; background:#ddd; position:fixed;top:0;z-index:95;width:auto!important;margin:inherit;left:0;right:0;min-width: inherit;max-width: inherit;}
div.mainHeader div {position:relative;}
div.main-nav {height:45px;padding: 3px 15px 3px;}
div.header {height:50px!important;padding:10px 19px 0!important;}
div.pagin-letters {padding: 10px 10px 5px 15px;}
div.pagin-letters li {border-left: 1px solid #ccc;}
.tooltip {position:fixed!important;width:140px;}
.glyphicon.glyphicon-upload:before {content: " ";}
.glyphicon-up {font-family: 'Glyphicons Halflings';}
.button-upload {padding:10px;}
a:hover {color: #fa6a13!important;}
a.button-a:hover {color: #fff!important;}
.main-nav li a:hover, .main-nav .active a {color: #fff!important;}
.pagin-letters a:hover {color: #000!important;}
.player-inline .options .add-to-pl {color: #3bafda;float: right;cursor: pointer;font-size:large;}
.player-inline .options .save-to-pl {font-size:large;}
.player-inline .options div.top {text-align: right;padding-top:3px;}
.player-inline .options .add-to-pl.big-song {margin-top: 20px;}
.player-inline .options .data {padding-top:3px!important;}
.options .top span {margin-top:5px;}
.add-to-pl:before {content: "";}
h1, h2, h3, h4 {font-family: Tahoma,Geneva,sans-serif!important;font-weight: bold!important;}
.jp-controls .jp-volume {width: 110px!important;}
.custom-volume {height: 100%;}
.jp-pause {margin-top: -5px}
.jp-controls .jp-volume-bar {height:30%;}
.jp-controls .jp-volume-bar-value {height:0!important}
.jp-controls .jp-play, .jp-controls .jp-pause {line-height: initial;}
.jp-controls .jp-playpause {vertical-align:bottom;padding-bottom:2px}
.jp-controls .jp-slashtime {width:10px}
.jp-controls .jp-current-time {padding-left: 15px;width: 55px;}
.jp-controls .jp-progress {padding:0;}
.jp-controls .jp-progress {padding:0;}
.header div.logo {background:initial;}
div.logo a {color: #f96913;font-size: 30px;font-weight: bolder;margin: -12px;margin-left: 15px;}
div.logo a:before {content:"muzyka";}
#playerContextMenu {display:none;position:fixed!important;top:50px;left:50px;}
#playerContextMenu.ui-menu-icons .ui-menu-item {padding-left:0;}
#playerContextMenu ul .ui-menu-item {padding-left:5px;white-space:nowrap;}
#playerContextMenu span {padding-left:30px;}
.glyphicon-cd:before {content:"\\e201"}
#playerContextMenu .glyphicons {float:left;left:0.3em;padding-left:0;position:absolute;}
#playerContextMenu .ui-icon {display:none}
.ui-contextmenu.ui-widget-content .ui-state-active, .ui-contextmenu .ui-state-active {border:1px solid #ffff;font-weight:initial;color:#3bafda;}
.ui-contextmenu .ui-state-active .ui-icon {filter:hue-rotate(180deg);}
#downloadFrame {display:block;position:fixed;top:50px;left:50px;width:500px;height:80vh;}
`;
GM_addStyle(classes);
GM_addStyle(GM_getResourceText("GlyphiconsCSS"))
if (1+location.host.search("myzuka"))
{
    myzukaLoad();
}else{
    log(location.href)
}
