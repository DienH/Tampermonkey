(function($) {
	if (!$ || !$.fn){return false}
	$.expr[":"].containsI = function (a, i, m) {return (a.textContent || a.innerText || "")
		.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(m[3].toUpperCase()
		.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))>=0;};
    $.fn.extend({
        //select all text nodes within selected elements, or text nodes containing filter text
        textNodes(...args) {
            let filter = "", i = 0, a = [], recursive = false;
            $sel = $();
            while(arguments[i]){
                if (typeof arguments[i] === "string"){
                    filter += (filter) ? "|" : "";
                    filter += arguments[i];
                }else if (Array.isArray(arguments[i])){
					filter += (filter) ? "|" : "";
					filter += arguments[i].join("|");
				}
                i++;
            }
            lastArg = arguments[arguments.length-1];
            if(typeof lastArg === "boolean" && lastArg) {recursive = true;}
            that = (recursive) ? this.find("*").addBack() : this;
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

        // display text of selected elements.
        textContent(...args) {
            let recursive = false, i = 0, searchT = [];
            for(i in arguments){
                switch (typeof arguments[i]){
				case ("boolean"):
					recursive = (recursive) ? true : arguments[i];
					break;
				case ("string"):
					searchT.push(arguments[i]);
					break;
				case ("object"):
					break;
			}
		}
		//select text nodes, possibly filtered by a string
		return $(this).textNodes(searchT, recursive ? true : "").text()/*//.each(function(i){
			//change text of first textnode
			this.data;
		})//*/;
        },
	//replace text with given text. Can completely replace a text node containing a string with a new Text
	replaceText(...args){
		if (1 < arguments.length < 4){
			if ((typeof (searchT=arguments[0]) && typeof (replaceT=arguments[1])) === "string"){
				$(this).textNodes(searchT, (typeof arguments[2] === "boolean") && arguments[2]).each(function(){
					this.data=replaceT;
				});
				return this;
			}
		}
	},
        // return href attribute or change href attribute
        href(link){
            changeLink = (typeof link === "string") ? true : false;
            if (changeLink) return $(this).attr("href", link);
            return $(this).attr("href");
        },
        src(link){
            changeLink = (typeof link === "string") ? true : false;
            if (changeLink) return $(this).attr("src", link);
            return $(this).attr("src");
        },
        //attribute or property shortcut
        a(array, attribute, value){
		if (typeof array !== "boolean"){
			value = attribute
			attribute = array
			array = false
		}
            let attr = $(this).attr(attribute);
            let useAttr = (typeof attr === "undefined") ? false : true;
            if (useAttr){
                if (typeof value === "undefined"){
			if (array){
				let elements = $(this), vals = [];
				for(var i=0;typeof(elements[i])!='undefined';vals.push(elements[i++].getAttribute(attribute)));
				return vals
			} else {
				return attr;
			}
                }else{
                    return $(this).attr(attribute, value);
                }
            }else{
                if (typeof value === "undefined"){
			if (array){
				let elements = $(this), vals = [];
				for(var i=0;typeof(elements[i])!='undefined';vals.push(elements[i++][attribute]));
				return vals
			} else {
                    		return $(this).prop(attribute);
			}
                }else{
                    return $(this).prop(attribute, value);
                }
            }
        },
	src(newSrc){
		if (typeof newSrc == "string" || typeof newSrc == "function")
		{
			return this.attr("id", newSrc)
		} else {
			return this.attr("id")
		}
	},
	id(newID){
		if (typeof newID == "string" || typeof newID == "function")
		{
			return this.attr("id", newID)
		} else {
			return this.attr("id")
		}
	},
	up(selector){
		return this.parent(selector)
	},
	child(selector){
		return this.children(selector)
	},
		do(callback){
			return this.eq(0).each(callback).end();
		},
	class(newClassString){
		let classesList = [], classesAddList = [], classesRemoveList = []
		if (typeof newClassString == "undefined"){
			return this.attr("class")
		} else if (typeof newClassString == "string"){
			if (newClassString.startsWith("+ ") || newClassString.startsWith("- "))
			{
				newClassString = " "+newClassString
				classesList = newClassString.split(" + ")
				classesList = classesList.map(function(t,i){return (i>0 ? "+ ":"")+t}).join("\n\t\n").split(" - ").map(function(t,i){return (i>0 ? "- ":"")+t}).join("\n\t\n").split("\n\t\n").slice(1)
				classesAddList = (" "+classesList.filter(t=>t.startsWith("+ ")).join(" ")).replace(/ \+ /g, " ")
				classesRemoveList = (" "+classesList.filter(t=>t.startsWith("- ")).join(" ")).replace(/ - /g, " ")
				return this.addClass(classesAddList).removeClass(classesRemoveList)
			} else {
				return this.attr("class", newClassString)
			}
		} else if (typeof newClassString == "object") {
			classesAddList = newClassesString["+"]+" "+newClassesString["add"]
			classesRemoveList = newClassesString["-"]+" "+newClassesString["remove"]
			return this.addClass(classesAddList).removeClass(classesRemoveList)
		}
	},
	classList(){
		let classesList = {}
		$(this).each(function(){
			Object.values(this.classList).forEach(function(c){classesList[c]=true})
		})
		return Object.keys(classesList)
	},

        // jQuery implementation of Mutation observer
        observe(options, callback, name) {
			let listOptions = {
				"text":"characterData", 
				"characterData":"characterData",
				"string":"characterData",
				"attributes":"attributes",
				"attr":"attributes",
				"childList":"childlist",
				"child":"childList",
				"children":"childList",
				"subtree":"subtree",
				"recursive":"subtree",
				"sub":"subtree"
                }, opt={};
            if(typeof options === "string"){
                options = options.split(" ");
            }
			if (Array.isArray(options)) {
				for (var i of options){
					opt[listOptions[i]]=true;
				}
            }

            opt = $.type(options) === "object" ? options : (Object.keys(opt).length) ? opt : {attributes: true, childList:true, characterData:true, subtree:true };
            nameObserver = name || options.name || ((typeof callback === "string") ? callback : "observer"+Date.now());
            mutationObserver = new MutationObserver((typeof callback === "function") ? callback : options);
            return this.each(function() {
                var node = this;
                if(!node.observers) node.observers = {};
                node.observers[nameObserver] = mutationObserver;
                node.observers[nameObserver].observe(node, opt);
            });
        },
        changes(o, cb, n) {
            return this.observe(o, cb, n);
        },
        disconnect(name) {
            return this.each(function(){
                if (this.observers) {
					for (i in this.observers){
						this.observers[i].disconnect();
					}
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
		center() {
				this.css("position","absolute");
				this.css("top", ( $(window).height() - this.height() ) / 2+$(window).scrollTop() + "px");
				return this.css("left", ( $(window).width() - this.width() ) / 2+$(window).scrollLeft() + "px");
			},
		middleclick(callback, options){
			return this.mouseup(function(e){
				if (e.button === 1){
					if (options) if (options.preventDefault) e.preventDefault();
						callback.call(this,e);
				}
			})
		},
	click2(){
		return this.each((i,el)=>el.click())
	},
        fakeClick(){
            return this.each(function(){
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
        },
	hidden(display){
		if (typeof display === "boolean") {dispNone = display}else{dispNone = false};
		return this.each(function(){
			this.style.visibility = 'hidden';
			if (dispNone) this.style.display = 'none';
		});
	},
	visible(display){
		if (typeof display === "text") {dispNone = true}else{dispNone = false};
		return this.each(function(){
			this.style.visibility = 'visible';
			if (dispNone) this.style.display = display;
		});
	},
	toggleV(display){
		if (typeof display === "text" || (typeof display === "boolean" && display)) {dispNone = true}else{dispNone = false};			
		return this.each(function(){
			if (this.style.visibility === 'visible'){
				this.style.visibility = 'hidden';
			}else{
				this.style.visibility = 'visible';
			}
		});
	},
	log(...thing){
		if (thing.length){
			if (typeof thing[0] == "function"){
				console.log(thing[0](this))
			}else{
				console.log(...thing);
			}
		} else {
			console.log(this);
		}
    		return this
	},
	lt(index){
		return this.slice(0,index)
	},
	gt(index){
		return this.slice(index+1)
	}
    });
	$.waitFor = async selector => {
		let $selection
	   		while ( ($selection = $(selector)).length === 0) {
			await new Promise( resolve => requestAnimationFrame(resolve) )
	 	   }
	    	return $selection;
	}
}($ || jQuery));

function log(...thing){
    return console.log(...thing);
}

function download(data, filename, type) {
    let url,a = document.createElement("a"), file
    try{
        url = new URL(data)
    }catch(e){
        url=0
        if (!type) type = "text";
        file = new Blob(typeof data === "object" ? data : [data], {type: type});
        }
    url = url || URL.createObjectURL(file);
    a.href = url;
    a.download = (typeof filename ==="string") ? filename : "Download.txt";
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

async function waitForElement(selector) {
    let $selection
    while ( ($selection = $(selector)).length === 0) {
        await new Promise( resolve => requestAnimationFrame(resolve) )
    }
    return $selection;
}

function getPath(win, n){
	if (!(typeof win === "object" && win.document)) win = window;
	subpath = (typeof win === "number") ? win : (typeof n === "number") ? n : false;
	let path = win.location.pathname;
    let href = path.split("/");
	href["path"] = path;
    href.splice(0,1);
    if (subpath && href[subpath]) {
	    href[subpath].params = getSearchParams(win.location.search)
        return href[subpath];
    }else{
	    href.params = getSearchParams(win.location.search)
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

function getSearchParams(url){
	let searchParams = "", searchParamsObject = {}
	if (typeof url == "string"){
		try{url = new URL(url);searchParams =  url.searchParams;}
		catch{searchParams = new URLSearchParams(url)}
	} else {
		searchParams = new URLSearchParams(location.search)
	}
	
	searchParams.forEach((v,k)=>searchParamsObject[k]=v)
	return searchParamsObject;
}

function JSON2CSV(JSONdata, title){
    let items = typeof JSONdata != 'object' ? JSON.parse(JSONdata) : JSONdata;
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header1 = Object.keys(items[0]), header2 = Object.keys(items[items.length-1]);
    let header = (header2.length > header1.length) ? header2 : header1;
    let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
	header = header.map(name => name.replace(/\,/g,"."));
    csv.unshift(header.join(','));
    if (title && typeof title === "string"){csv.unshift(title+"\r\n");}
    return csv.join('\r\n');
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}
String.prototype.log = function(){
	console.log(this.toString())
	return this
}
String.prototype.searchI = function(searchString) {
	if(typeof searchString == "string"){
	return this.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").indexOf(searchString.toUpperCase()
		.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
	} else {
		return undefined
	}
}

addFn([getPath, getSearchParams,download,log,addFn, JSON2CSV, waitForElement]);
