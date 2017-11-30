(function($) {
    $.fn.extend({
        //select all text nodes within selected elements, or text nodes containing filter text
        textNodes(...args) {
            let filter = "", i = 0, a = [], recursive = false;
            $sel = $();
            while(arguments[i]){
                if (typeof arguments[i] === "string"){
                    filter += (filter) ? "|" : "";
                    filter += arguments[i];
                }
                i++;
            }
            lastArg = arguments[arguments.length-1];
            if(typeof lastArg === "boolean" && lastArg) {recursive = true;}
            that = (recursive) ? this.find("*") : this;
            that.each(function() {
                $sel = $sel.add($(this).contents());
            });
            $sel.each(function(){
                if(filter){
                    reg = new RegExp(filter);
                }
                keep = (this.nodeType === 3 && (!filter || this.textContent.search(filter)+1)) ? true : false;
                if (keep) a.push(this);
            });
            $sel = $(a);
            $sel.prevObject = this;
            $sel.selector = filter;
            return $sel;
        },

        // display text of selected elements
        textContent(...args) {
            let recursive = false, i = 0;
            for(i in arguments){
                if (typeof arguments[i] === "boolean") {
                    recursive = (recursive) ? true : args[i];
                }else{
                    if (typeof searchT === "undefined" && typeof arguments[i] === "string"){
                        searchT = arguments[i];
                    }else{
                        replaceT = arguments[i];
                    }
                }
            }
            //replaces first text node with given text, and delete every other text nodes
            if (replaceT === "string") {
                //select text nodes from
                $(this).textNodes(recursive ? true : "").each(function(i){
                    //change text of first textnode
                    if (!i) {
                        this.data = txt;
                    }else{
                        this.remove();
                    }
                });
                return this;
            }else if(typeof changeText === "function"){
                //replace every text node with new text returned by callback function
                /*$(this).textNodes().each(function(i, el){
					if ()
				}*/
            }
            return $(this).textNodes().text();
        },
        // return href attribute or change href attribute
        href(link){
            changeLink = (typeof link === "string") ? true : false;
            if (changeLink) return $(this).attr("href", link);
            return $(this).attr("href");
        },
        //attribute or property shortcut
        a(attribute, value){
            var attr = $(this).attr(attribute);
            var useAttr = (typeof attr === "undefined") ? false : true;
            if (useAttr){
                if (typeof value === "undefined"){
                    return $(this).attr(attribute);
                }else{
                    return $(this).attr(attribute, value);
                }
            }else{
                if (typeof value === "undefined"){
                    return $(this).prop(attribute);
                }else{
                    return $(this).prop(attribute, value);
                }
            }
        },
        do(callback){
            $(this).first().each(callback);
            return this;
        },

        // jQuery implementation of Mutation observer
        observe(callback, options) {
            options = options || { subtree:true, childList:true, characterData:true };
            var name = "observer"+Date.now();
            function cb(changes) { callback.call(node, changes, this); }
            mutationObserver = new MutationObserver(cb);
            return $(this).each(function() {
                var node = this;
                if(!node.observers) node.observers = [];
                node.observers[name] = mutationObserver;
                node.observers[name].observe(node, options);
            });
        },
        change(cb, e) {
            return $(this).observe(cb, e);
        },
        disconnect() {
            return $(this).each(function(){
                if (this.observer) {
                    this.observer.disconnect();
                }
            });
        },

        //open Href URL of a link
        url(){
            $(this).each(function(){
                if (this.href && $(this).href().split("#")[0]){
                    window.location.href = this.href;
                }
            });
            return this;
        },
        openUrl(){
            return $(this).url();
        },
        //return the coordinates of the center of the first element, or place the center of all selected elements at new coordinates
        middle(coord){
            if (typeof coord === "undefined" || (typeof coord !== "object" && typeof coord !== "function")){
                var middle = {X : 0, Y : 0};
                if (($el = $(this).first())){
                    middle.X = $el.offset().left + Math.round($el.outerWidth()/2);
                    middle.Y = $el.offset().top + Math.round($el.outerHeight()/2);
                }
                return middle;
            }/*else if((typeof coord === "object" && (coord.X || coord.left || coord.x) && (coord.Y || coord.top || coord.y)) || typeof coord === "function"){
				$(this).each(function(){
					$(this).
					offset(coord);
				});
			}*/
        },
        fakeClick(){
            $(this).each(function(){
                var middle = $(this).middle();
                var click = new MouseEvent("click", {
                    button:1,
                    buttons:1,
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX : middle.X,
                    clientY : middle.Y
                });
                this.dispatchEvent(click);
            });
            return this;
        }
    });
}($));

function log(...thing){
    return console.log(...thing);
}
function download(data, filename, type) {
    if (!type) type = "text";
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) /* IE10+ */
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { /* Others */
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function getPath(win, n){
	if (!(typeof win === "object" && win.document)) win = window;	
	log(win.location);
	subpath = (typeof win === "number") ? win : (typeof n === "number") ? n : false;
    var href = win.location.pathname.split("/");
    href.splice(0,1);
    if (subpath && href[subpath]) {
        return href[subpath];
    }else{
        return href;
    }
}

function addFn(func) {
    var dienScript = document.getElementById("DienScript") ? document.getElementById("DienScript") : document.createElement("script");
    dienScript.id = "DienScript";
    if(typeof func === "function"){
        dienScript.innerHTML = func.toString();
    }else if (typeof func === "object"){
        for (var f in func){
            dienScript.innerHTML = dienScript.innerHTML+"\n"+func[f].toString();
        }
    }
    document.head.appendChild(dienScript);
}

function getSearchParams(){
	let trimmedSearch = location.search.substring(1);

	return trimmedSearch?JSON.parse(
		'{"' + trimmedSearch.replace(/&/g, '","').replace(/=/g,'":"') + '"}', 
		function(key, value) { 
			return key===""?value:decodeURIComponent(value) 
		}
	)
	:
	{};
}

addFn([getPath, getSearchParams,download,log,addFn]);