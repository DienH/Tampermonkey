// ==UserScript==
// @name         eToro
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Enhanced eToro
// @author       Dien
// @match        https://www.etoro.com/*
// @require      https://code.jquery.com/jquery.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require      https://rawgit.com/DienH/Tampermonkey/master/Dien.js
// @updateURL    https://rawgit.com/DienH/Tampermonkey/master/eToro.js
// @downloadURL  https://rawgit.com/DienH/Tampermonkey/master/eToro.js
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        window.focus
// @grant        unsafeWindow
// @run-at       document-idle

// ==/UserScript==
µ = unsafeWindow;
µ$ = µ.$;
µ.$$ = $;
function waiting(){
    if (typeof waiter !== "undefined") clearTimeout(waiter);
    waiter = setTimeout(function(){eToro();}, 500);
}

function stat(data){
    stat.lastData = data[data.length-1];
    stat.prevData = data[data.length-2];
    if (!stat.prev) stat.prev = data[data.length-2];
    let keys = Object.keys(stat.lastData);
    if(!stat.adx) {
        let adx = keys.filter(key => key.search("ADX")>-1);
        stat.adx={
            adx:keys.filter(key => key.search("ADX ADX")>-1).join(""),
            dip:keys.filter(key => key.search("\\+DI")>-1).join(""),
            dim:keys.filter(key => key.search("\\-DI")>-1).join(""),
            atr:"atr",
            range:"trueRange"
        };
        let bollinger = keys.filter(key => key.search("Bollinger")>-1);
        stat.bollinger={
            T:bollinger.filter(key => key.search("Top")>-1).join(""),
            B:bollinger.filter(key => key.search("Bottom")>-1).join(""),
            M:bollinger.filter(key => key.search("Median")>-1).join("")
        };
        stat.rsi=keys.filter(key => key.search("RSI rsi")>-1).join("");
        stat.stoch={
            slow:keys.filter(key => key.search("stoch")>-1 && key.search("true\\)_3")>-1).join(""),
            fast:keys.filter(key => key.search("stoch")>-1 && key.search("true")>-1 && key.search("true\\)_3")===-1).join("")
        };
        stat.psar = keys.filter(key => key.search("PSAR")>-1).join("");
        let macd = keys.filter(key => key.search("macd")>-1);
        stat.macd = {
            m : macd.filter(key => key.search("MACD")>-1).join(""),
            s : macd.filter(key => key.search("Signal")>-1).join(""),
            m1 : macd.filter(key => key.search("Signal")>-1).join(""),
            m2 : macd.filter(key => key.search("Signal")>-1).join(""),
            hist : macd.filter(key => key.search("hist")>-1).join("")
        };
        let chaikin = keys.filter(key => key.search("Chaikin")>-1);
        stat.chaikin = {
            m : chaikin.filter(key => key.search("MA")>-1).join(""),
            r : chaikin.filter(key => key.search("Result")>-1).join(""),
            HL : chaikin.filter(key => key.search("High")>-1).join("")
        };
    }
    stat.prev = stat.lastData;
}
statF = stat;

function eToro(m){
    //$(document).on("turbolinks:load", function(e){log(e);});
    eToro.iframe = (window.top !== window.self);
    eToro.path = getPath();
    if (eToro.path.join("") === ("appsv-iframe" || "intercom-frame")) return false;
    if (!eToro.oldPath) eToro.oldPath = eToro.path;
    if (eToro.path.join("") !== eToro.oldPath.join("")) {eToro.watchReady = false;}
    switch (eToro.path[0]) {
        case "watchlists":
            if (eToro.watchReady) return false;
            if (typeof marketData === "undefined") marketData = {};
            if (!$('head link[href*="jquery-ui.min.css"]').length) $("head").append('<link href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css" rel="stylesheet" type="text/css">');
            $('title').text("Liste "+$('div.title>div.ng-binding').text().split(" ").join("")+" - eToro");
            $('.table-head.market .table-info>.table-cell:eq(1)').append("<span class='head-label spread'>Spread</span>").each(function(){$('body').addClass("spread");});
            let w = $(window).width(), h = $(window).height();
            $('.table-body.market>div.table-row:not(.empty)').each(function(){
                let marketName = $("span.user-nickname", this).text();
                µ$('div.table-name-cell, div.market-card-chart-ph', this).off();
                $('div.table-name-cell', this).click(function(e){window.open("/markets/"+marketName);});
                $('div.market-card-chart-ph', this).click(function(e){e.preventDefault();var win = window.open("/markets/"+marketName+"/chart/full");});
                $('div.market-card-chart-ph>span.new-tab-chart', this).click(function(e){
                    e.preventDefault();e.stopImmediatePropagation();
                    if(!$('#'+marketName+'Dialog').dialog("open").length){
                        this.$dialog = $('<iframe id="'+marketName+'Dialog" height="900px" class="etoro-chart-dialog" src="/markets/'+marketName+'/chart/full"></iframe>').appendTo("body").dialog({
                            autoOpen: true, modal: true, resizable: true, minWidth: w*0.33, width: w*0.66, height: h*0.66, maxHeight: h*0.66
                        }).dialog("option", "title", marketName).dialog("option", "height", h*0.66);
                        //setTimeout(function(){$('#'+marketName+'Dialog').dialog("close");}, 1000);
                    }
                });//.click(function(e){e.preventDefault();e.delegateTarget.$dialog.dialog("open");});
                $('.etoro-horizontal', this).append(function(){
                    let spread = (Number($(".etoro-buy-button span", this).text())/Number($(".etoro-sell-button span", this).text())-1)*100;
                    spread = Math.trunc(spread*100)/100;
                    return "<div class='market-spread'>"+(spread === 0 ? "~ 0" : spread)+" %</div>";
                }).find(".etoro-sell-button .etoro-price-value>span:not(.watch-value)").each(function(){
                    this.marketName = marketName;
                    this.buySpan = $(this).closest(".etoro-sell-button").next().find(".etoro-price-value>span")[0];
                    this.spreadSpan = $(this).closest(".etoro-sell-button").nextAll(".market-spread")[0];
                    $(this).observe("text sub child", function(m){m.forEach(function(n){
                        let sell = Number(n.target.data), sellName = n.target.parentNode.marketName, buy = Number(n.target.parentNode.buySpan.innerText);
                        let spread = Math.trunc((buy/sell-1)*10000)/100;
                        n.target.parentNode.spreadSpan.innerText = (spread === 0 ? "~ 0" : spread)+" %";
                        //log(sellName, sell, buy);
                        //watchValues[sellName][Date.now()] = [Number(sell), Number(buy)];
                        //GM_setValue("watchValues", watchValues);
                    });}, marketName);
                }).addClass("watch-value");
            });
            let watchValues = GM_getValue("watchValues", {});
            $('.etoro-sell-button .etoro-price-value>span:not(.watch-value)').each(function(){
                priceName = $(this).attr("marketName");
                if (!watchValues[priceName]) {
                    watchValues[priceName]={};
                    watchValues[priceName][Date.now()] =
                        [Number($(this).text()),
                         Number($(this).closest(".etoro-sell-button").next().find(".etoro-price-value>span").text())
                        ];
                }
            });
            if ($('body').hasClass("spread")) eToro.watchReady = true;
            break;
        case "markets":
            if (eToro.path[2] && eToro.path[2] === "chart" && (eToro.chart = $('#chartContainer')[0]) && eToro.chart.stx && eToro.chart.stx.chart){
                eToro.marketName = $('.symbolDescription').text();
                if (!eToro.iframe){
                    eToro.$title = $('title');
                    if(!eToro.$title.attr("changed")){
                        eToro.title =eToro.$title.text().split("rate ")[1] || $('.symbolDescription').text()+" - eToro";
                        eToro.$title.text($('ui-buysell-buttons.etoro-sell-button span').text()+" : "+eToro.title).attr("changed", true);
                    }
                    let $drawMenu = $('div.cq-menu-item.draw');
                    if (!$('.icon.calliper')[0]){
                        let pencilMenu = '<div class="cq-menu-item pencil"><span class="ico ng-binding"><translate original="Draw">Draw</translate></span> <div class="bridge"></div></div>',
                            measureMenu = '<div class="cq-menu-item calliper icon"><span><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" enable-background="new 0 0 24 24" height="24px" id="Layer_1" version="1.1" viewBox="0 0 24 24" width="24px" xml:space="preserve"><path d="M24,24l-0.8-3.4L18,12c2.4-1.8,4-5,4-8h-1c0,3-1.4,5.5-3.5,7.1L13.7,5C13.9,4.7,14,4.3,14,4c0-0.7-1-1.4-1-1.7V1  c0-0.6-0.4-1-1-1s-1,0.4-1,1v1.3c-1,0.3-1,1-1,1.7c0,0.4,0.1,0.7,0.3,1L0.8,20.6L0,24l2.6-2.3L7.7,13c1.3,0.6,2.7,1,4.3,1  c1.5,0,3-0.4,4.3-1l5.2,8.6L24,24z M12,3c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S11.4,3,12,3z M12,13c-1.3,0-2.6-0.3-3.7-0.8L12,6  c0,0,0,0,0,0s0,0,0,0l3.7,6.2C14.6,12.7,13.3,13,12,13z"/></svg></span><div class="bridge"></div></div>',
                            toolsMenu = '<div class="cq-menu-item tools icon"><span><svg class="icon icon-tools"><path d="M8.955 14.532c0.526 0.525 2.554 2.665 2.554 2.665l1.124-1.159-1.762-1.82 3.382-3.592c0 0-1.526-1.488-0.858-0.895 0.639-2.372 0.057-5.018-1.745-6.883-1.786-1.85-4.324-2.456-6.604-1.819l3.864 3.991-1.017 3.916-3.783 1.045-3.862-3.992c-0.616 2.357-0.030 4.979 1.76 6.83 1.878 1.941 4.582 2.512 6.948 1.714zM21.838 18.413l-4.66 4.603 7.685 7.963c0.627 0.65 1.453 0.975 2.277 0.975 0.82 0 1.645-0.324 2.275-0.975 1.258-1.301 1.258-3.406 0-4.707l-7.578-7.859zM31.99 5.057l-4.894-5.057-14.427 14.916 1.762 1.82-8.635 8.925-1.974 1.055-2.788 4.549 0.71 0.736 4.401-2.883 1.020-2.041 8.636-8.924 1.763 1.82 14.427-14.916z"></path></svg></span><div class="bridge"></div></div>';
                        $drawMenu.after($(pencilMenu+measureMenu+toolsMenu)).click();
                        $('div.cq-menu-item.settings>ul');
                        $('instrument-chart').addClass("normal-chart").next().remove();
                        $('div.crosshairs.on').each(function(){$('div.hu').css("display", "inline-block").prependTo("div.menus");});
                        /*$('<a class="e-btn light i-ptc-action stop closing-frame-button"><span class="i-ptc-action-icon sprite"><a/>').appendTo()*/
                        $('a.i-stock-chart-info').click(function(e){
                            e.preventDefault();e.stopPropagation();
                            //$('div.i-chart-frame-container').visible();
                        }).append($('<div class="i-chart-frame-container"><iframe class="i-chart-frame" src=/portfolio/'+eToro.marketName+'>')).find('span.i-chart-info').remove();
                        $("<li>Download dataset</li>").insertBefore($('div.cq-menu-item.settings>ul>li.divider:eq(0)')).click(function(){
                            let date = (new Date(Date.now()).toLocaleString()).split(" ");
                            date.splice(1,1);
                            (date = date.join("-").split("/").join("-").split(":")).pop();
                            date = date.join("h");
                            //let dataset = JSON.stringify(eToro.chart.stx.chart.dataSet);
                            let dataset = JSON2CSV(eToro.chart.stx.chart.dataSet);
                            download(dataset, eToro.marketName+" - "+$('div.cq-menu-item.period.menu>span').text()+" - "+date+".csv");
                        });
                    }
                    if(!$('div.cq-menu-item.pencil>ul')[0]){
                        let ulDrop = '<ul class="e-drop-select-box">',
                            $pencilMenu = $('div.cq-menu-item.pencil').append(ulDrop).click(function(){$('div.draw').click();}),
                            $calliperMenu = $('div.cq-menu-item.calliper').append(ulDrop),
                            $toolsMenu = $('div.cq-menu-item.tools').append(ulDrop),
                            pencilOldMenu = 'div.workspace.menu[ng-show*="tools"]>ul>li',
                            calliperOldMenu = 'div.workspace.menu[ng-show*="al"]:contains("ADX")>ul>li',
                            toolsOldMenu = 'div.workspace.menu[ng-show*="mz"]>ul>li';
                        $(pencilOldMenu).each(
                            function(i){
                                that=this;
                                $('<li>').text($(that).text()).addClass($(that).attr("class")).each(function(){this.orig=i;}).click(function(){$(pencilOldMenu).eq(this.orig).click();}).appendTo($("ul", $pencilMenu));
                            }
                        );
                        $(calliperOldMenu).each(
                            function(i){
                                that=this;
                                $('<li>').text($(that).text()).addClass($(that).attr("class")).each(function(){this.orig=i;}).click(function(){$drawMenu.click();$(calliperOldMenu).eq(this.orig).click();}).appendTo($("ul", $calliperMenu));
                            }
                        );
                        $(toolsOldMenu).each(
                            function(i){
                                that=this;
                                $('<li>').text($(that).text()).addClass($(that).attr("class")).each(function(){this.orig=i;}).click(function(){$drawMenu.click();$(toolsOldMenu).eq(this.orig).click();}).appendTo($("ul", $toolsMenu));
                            }
                        );
                    }
                    $('li.stx-menu-content.add:not(".clearer")').prepend('<a class="clear-symbol-search">✖</a>').addClass("clearer").each(function(){
                        $(this).children("a").click(function(){$(this).next("input").val("");});
                    });
                    $('div.etoro-trade-button:not(".listener")').mouseup(function(){
                        setTimeout(function(){$("#open-position-view").addClass("hidden").center();}, 50);
                        setTimeout(function(){
                            let $orderDialog = $("#open-position-view");
                            $orderDialog.appendTo("body").draggable({handle:"div.execution-head", opacity:0.6});
                            $orderDialog.removeClass("hidden");
                            $(".uidialog").remove();
                            $('.head-button.close').mouseup(function(){$("#open-position-view").remove();$('body').removeClass("uidialog-open");});
                            $('button.execution-button').mouseup(function(){setTimeout(function(){$("#open-position-view").remove();$('body').removeClass("uidialog-open");}, 500);});
                        }, 300);
                    }).addClass("listener");
                }else{
                    $('header.a-header').next("div:has(div.a-menu)").addBack().remove();
                    $('instrument-chart').addClass("dialog-chart");
                }
                //observer
                $('ui-buysell-buttons.etoro-sell-button span').observe("child sub text", function(m){
                    m.forEach(function(n){
                        eToro.data = eToro.chart.stx.chart.dataSet;
                        if (!eToro.last60data) {eToro.last60data = [eToro.data[eToro.data.length-1]];}
                        if (eToro.last60data && eToro.last60data[0].Close !== eToro.data[eToro.data.length-1].Close) eToro.last60data.unshift(eToro.data[eToro.data.length-1]);
                        if (eToro.last60data.length > 60) eToro.last60data.pop();
                        eToro.last60data[0].DT = new Date();
                        lastData = eToro.last60data;
                        //log(eToro.last60data);
                        if (eToro.iframe) {
                            window.top.marketData[eToro.marketName] = eToro.data;
                        }else if (eToro.title) {
                            eToro.$title.text(eToro.last60data[0].Close+" : "+eToro.title);
                        }
                        //log(eToro.data[eToro.data.length-1]);
                    });
                });
            }
            break;
        case "portfolio":
            if(eToro.iframe){
                if (!$('label.close-all-positions-check-box').prev('input:not(:checked)').click().end().length)$('div[data-etoro-automation-id="drop-down-actions-option-instrument-close"]').click();
                $('html').addClass("iframed");
            }
            //$('label.close-all-positions-check-box').click();
            //$('button.close-all-positions-button')
            break;
    }
    eToro.oldPath = eToro.path;
}
let style = `
div.cq-menu-item.draw {display:none!important;}
div.menus ul.e-drop-select-box li {padding:10px 12px;}
.cq-menu-item.icon {width: 50px}
.Dark .menus > div.cq-menu-item.pencil > span {background-position: -300px -100px;}
.menus > div.cq-menu-item.pencil:hover > span, .Dark .menus > div.cq-menu-item.pencil:hover > span {background-position: -300px -50px;}
.cq-menu-item.icon ul {;max-height:482px}
.cq-menu-item.tools ul {margin-left: -80px;}
.cq-menu-item.calliper ul {margin-left: -30px;}
div.icon svg {width: 32px; height: 32px; stroke-width: 0; fill: #fff;}
div.icon:hover svg {fill: #20a5ee;}
div.icon.tools > span {transform: scale(0.7);padding:8px;}
div.icon.calliper > span {transform: scale(0.7);padding:8px;}

a.i-stock-chart-info {top:54px;left:10px;border-top-right-radius: 10px; border-bottom-right-radius: 10px; padding: 10px 20px;transition:height 0.5s;width:auto;height:54px;}
a.i-stock-chart-info:hover {height: 120px;}
a.i-stock-chart-info span.i-chart-amount {float:left;}
a.i-stock-chart-info span.i-chart-info {display:none;}
.i-ptc-action.stop.closing-frame-button{float:right;width:40px;height:34px;}
.i-chart-frame{width:120px;height:60px;}
.i-chart-frame-container{visibility:hidden;opacity:0;transition: opacity 0.3s 0.3s;}
a.i-stock-chart-info:hover .i-chart-frame-container {visibility:visible;opacity:1;}

html.iframed, html.iframed body {background:transparent!important;}
html.iframed ui-layout *, .iframed .close-all-positions-avatar, .iframed .close-all-positions-details-container, .iframed .w-sm-amount-info-close {display:none;background:transparent!important;}
.iframed .close-all-positions-w-sm, .iframed .uidialog-content  {background:transparent!important;}
.iframed .w-share-header-nav-button-x, .iframed .close-all-positions-note, .iframed .w-sm-disclaimer, .w-confirmation-modal-title {display:none!important;}
.iframed .close-all-positions-button-wrapper{padding-top:0;margin-top:5px}
.iframed .w-sm-amount-info-unit, .iframed .execution-main-head {padding: 6px 20px;}
.iframed .close-all-positions-button-wrapper {position:absolute;top:0;left:0}
.iframed .close-all-positions-button {width:120px!important;min-width:120px!important}

div.hu {top:0;background-color:transparent!important;border:none!important}

div.modal-backdrop, div.modal.edit.execution.main-resize {display: none!important;}
div.modal.stx-dialog {padding:0;width:500px}
div.uidialog-overlay {display:none;}

#open-position-view {position:fixed;bottom:unset;right:unset;}
#menuCompare #compareSymbol {width: 93%;margin-left: 2%;}
li.stx-menu-content.add {cursor:default!important;}
.head-label.spread {width:8%;}

.table-cell .etoro-buy-button {width: 85%; padding-right: 10px;}
.table-cell .etoro-sell-button {width: 85%;}
.market-spread {position: absolute; right: 10px; padding:6px; font-weight: 600;}

iframe.etoro-chart-dialog {width:66vw!important; height:66vh!important;}
instrument-chart.dialog-chart {position: fixed; top: 0; left: 0; width: 100%; height: 100%!important;}
instrument-chart.normal-chart {height:100%!important;}
.etoro-horizontal .negative .etoro-price-value, .etoro-horizontal .negative .etoro-price-name, .etoro-horizontal .positive .etoro-price-value, .etoro-horizontal .positive .etoro-price-name {animation:none!important;}

.title.inner-header-nav-button.dropdown-menu div.drop-select-box {max-height:calc(100vh - 70px)}
`;
GM_addStyle(style);
$("body").observe("child sub", waiting);
eToro();
