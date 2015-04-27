var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.Util = {};
GleamTech.JavaScript.Util.OnDomReady = function(n) {
    var t = t || {},
    i, r, u, f;
    if (t.loaded) return n();
    if (i = t.observers, i || (i = t.observers = []), i[i.length] = n, !t.callback) {
        t.callback = function() {
            var i, n, r, u;
            if (!t.loaded) {
                for (t.loaded = !0, t.timer && (clearInterval(t.timer), t.timer = null), i = t.observers, n = 0, r = i.length; n < r; n++) u = i[n],
                i[n] = null,
                u();
                t.callback = t.observers = null
            }
        };
        var s = !!(window.attachEvent && !window.opera),
        e = !1,
        o = navigator.userAgent.match(/AppleWebKit\/(\d+)/);
        o && o[1] < 525 && (e = !0);
        document.readyState && e ? t.timer = setInterval(function() {
            var n = document.readyState; (n == "loaded" || n == "complete") && t.callback()
        },
        50) : document.readyState && s && window == window.top ? (r = !1, u = function() {
            r || (r = !0, t.callback())
        },
        function() {
            try {
                document.documentElement.doScroll("left")
            } catch(n) {
                setTimeout(arguments.callee, 50);
                return
            }
            u()
        } (), document.onreadystatechange = function() {
            document.readyState == "complete" && (document.onreadystatechange = null, u())
        }) : window.addEventListener ? (document.addEventListener("DOMContentLoaded", t.callback, !1), window.addEventListener("load", t.callback, !1)) : window.attachEvent ? window.attachEvent("onload", t.callback) : (f = window.onload, window.onload = function() {
            t.callback();
            f && f()
        })
    }
};
GleamTech.JavaScript.Util.AddEvent = function(n, t, i) {
    return n.addEventListener ? (n.addEventListener(t, i, !1), !0) : n.attachEvent ? n.attachEvent("on" + t, i) : !1
};
GleamTech.JavaScript.Util.RemoveEvent = function(n, t, i) {
    return n.removeEventListener ? (n.removeEventListener(t, i, !1), !0) : n.detachEvent ? n.detachEvent("on" + t, i) : !1
};
GleamTech.JavaScript.Util.SimulateMouse = function(n) {
    var i = n.changedTouches,
    r = i[0],
    t = "";
    switch (n.type) {
    case "touchstart":
        t = "mousedown";
        break;
    case "touchmove":
        t = "mousemove";
        break;
    case "touchend":
        t = "mouseup";
        break;
    default:
        return
    }
    GleamTech.JavaScript.Util.TriggerMouseEvent(r, t);
    n.preventDefault()
};
GleamTech.JavaScript.Util.SimulateClick = function(n) {
    function i(n) {
        if (GleamTech.JavaScript.Util.RemoveEvent(t, "touchend", i), t.touchContextMenuFired) {
            t.touchContextMenuFired = !1;
            n.preventDefault();
            return
        }
        n.changedTouches[0].target == t && GleamTech.JavaScript.Util.TriggerMouseEvent(n.changedTouches[0], "click");
        n.preventDefault()
    }
    if (n.type == "touchstart") {
        var t = n.changedTouches[0].target;
        GleamTech.JavaScript.Util.AddEvent(t, "touchend", i);
        n.preventDefault()
    }
};
GleamTech.JavaScript.Util.SimulateContextMenu = function(n, t) {
    function r(n) {
        clearTimeout(u);
        n.preventDefault()
    }
    if (n.type == "touchstart") {
        var u, i = n.changedTouches[0].target;
        GleamTech.JavaScript.Util.AddEvent(i, "touchend", r);
        GleamTech.JavaScript.Util.AddEvent(i, "touchmove", r);
        u = setTimeout(function() {
            GleamTech.JavaScript.Util.RemoveEvent(i, "touchend", r);
            GleamTech.JavaScript.Util.RemoveEvent(i, "touchmove", r);
            i.touchContextMenuFired = !0;
            var u = !0;
            t && (u = t());
            u && GleamTech.JavaScript.Util.TriggerMouseEvent(n.changedTouches[0], "contextmenu")
        },
        750);
        n.preventDefault()
    }
};
GleamTech.JavaScript.Util.TriggerMouseEvent = function(n, t, i) {
    var r = document.createEvent("MouseEvent");
    r.initMouseEvent(t, !0, !0, window, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null);
    r.isSimulatedMouseEvent = !0;
    i ? i.dispatchEvent(r) : n.target.dispatchEvent(r)
};
GleamTech.JavaScript.Util.CancelEvent = function(n) {
    if (!n) var n = window.event;
    return n.cancelBubble = !0,
    n.stopPropagation && n.stopPropagation(),
    n.returnValue = !1,
    n.preventDefault && n.preventDefault(),
    !1
};
GleamTech.JavaScript.Util.CancelEventExceptForTextInput = function(n) {
    var n, t;
    return n || (n = window.event),
    t = GleamTech.JavaScript.Util.GetEventTarget(n),
    t.type == "text" || t.type == "password" || t.type == "textarea" || t.type == "file" ? !0 : GleamTech.JavaScript.Util.CancelEvent(n)
};
GleamTech.JavaScript.Util.GetEventTarget = function(n) {
    var t;
    return n.target ? t = n.target: n.srcElement && (t = n.srcElement),
    t.nodeType == 3 && (t = t.parentNode),
    t
};
GleamTech.JavaScript.Util.FindPosition = function(n) {
    var t = 0,
    i = 0;
    if (n.offsetParent) for (t = n.offsetLeft, i = n.offsetTop; n = n.offsetParent;) t += n.offsetLeft,
    i += n.offsetTop;
    return [t, i]
};
GleamTech.JavaScript.Util.GetStyleProperty = function(n, t) {
    var i = "";
    return n.currentStyle ? i = n.currentStyle[t] : window.getComputedStyle && (i = document.defaultView.getComputedStyle(n, null).getPropertyValue(t)),
    i
};
GleamTech.JavaScript.Util.GetStyleObject = function(n) {
    var f, r, u, i, t;
    if (!document.styleSheets) return null;
    for (f = "." + GleamTech.JavaScript.Util.Trim(n).toLowerCase(), r = 0; r < document.styleSheets.length; r++) try {
        for (u = document.styleSheets[r], i = u.cssRules ? u.cssRules: u.rules, t = 0; t < i.length; t++) if (i[t] && i[t].selectorText && i[t].selectorText.toLowerCase() === f) return i[t].style
    } catch(e) {}
    return null
};
GleamTech.JavaScript.Util.EnsureDisplay = function(n, t) {
    for (var f = [], i = n, e, r, u; i && i !== document;) GleamTech.JavaScript.Util.GetStyleProperty(i, "display") == "none" && f.push(i),
    i = i.parentNode;
    if (f.length > 0) {
        for (e = {
            visibility: "hidden",
            display: "block"
        },
        r = 0; r < f.length; r++) {
            i = f[r];
            i.originalStyle = {};
            for (u in e) i.originalStyle[u] = i.style[u],
            i.style[u] = e[u]
        }
        for (t(n), r = 0; r < f.length; r++) {
            i = f[r];
            for (u in e) i.style[u] = i.originalStyle[u];
            try {
                delete i.originalStyle
            } catch(o) {
                i.originalStyle = null
            }
        }
    } else t(n)
};
GleamTech.JavaScript.Util.RequestJson = function(n, t, i, r, u) {
    var o = function() {
        var n = null;
        if (window.XMLHttpRequest) try {
            n = new XMLHttpRequest
        } catch(t) {
            n = null
        } else if (window.ActiveXObject) try {
            n = new ActiveXObject("Msxml2.XMLHTTP")
        } catch(t) {
            try {
                n = new ActiveXObject("Microsoft.XMLHTTP")
            } catch(t) {
                n = null
            }
        }
        return n
    },
    f,
    e;
    if ((f = o()) != null) {
        f.onreadystatechange = function() {
            var n, t, o, s, e;
            if (f.readyState == 4) {
                try {
                    f.status !== undefined && f.status != 0 ? (n = f.status, t = f.statusText) : (n = 13030, t = "Status Unavailable")
                } catch(h) {
                    n = 13030;
                    t = "Status Unavailable"
                }
                if (n == 200) {
                    if (o = f.getResponseHeader("Content-Type"), s = o && o.indexOf("application/json") != -1, s) {
                        e = JSON.parse(f.responseText);
                        e.Success ? i && i(e.Result) : r && r(e.Result);
                        return
                    }
                    t += "\n(Response content-type is not application/json)"
                }
                n >= 100 && n < 600 ? alert("HTTP Error:\n\n" + n + " - " + t) : alert("Connection Error:\n\n" + n + " - " + t);
                u && u()
            }
        };
        try {
            e = t != null ? JSON.stringify(t) : null;
            f.open("POST", n, !0);
            f.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            f.setRequestHeader("Accept", "application/json");
            f.send(e)
        } catch(s) {
            alert("Connection Error:\n\n" + s.toString())
        }
    } else alert("A required object, XMLHttpRequest is not found!")
};


GleamTech.JavaScript.Util.FormatFileSize = function(n) {
    var t;
    if (n.length == 0) return "";
    var i = ["B", "KB", "MB", "GB", "TB"],
    r = i.length - 1;
    for (n = +n, t = 0; n >= 1024 && t < r;) n /= 1024,
    t++;
    return n.toFixed([0, 0, 2, 2, 2][t]) + " " + i[t]
};


GleamTech.JavaScript.Util.GetFileNameWithoutExtension = function(n) {
    var t = n.lastIndexOf(".");
    return t > 0 ? n.substr(0, t) : n
};


GleamTech.JavaScript.Util.GetFileExtension = function(n) {
    var t = n.lastIndexOf(".");
    return t > 0 ? n.substr(t, n.length) : ""
};


GleamTech.JavaScript.Util.GetZipFileName = function(n) {
    var u, f = "",
    t, i, r;
    return t = /(\.\w+)$/,
    i = t.exec(n),
    i && (f = i[1].toLowerCase(), n = n.replace(t, f)),
    f == "" ? u = n + ".zip": f == ".zip" ? (t = /\((\d+)\)\.zip$/, i = t.exec(n), r = i ? parseInt(i[1]) : 0, r++, u = r == 1 ? n.replace(/\.zip$/, " (" + r + ").zip") : n.replace(t, " (" + r + ").zip")) : u = n.replace(t, ".zip"),
    u
};

GleamTech.JavaScript.Util.CheckFileName = function(n) {
    return ! /[\/:\*\?"<>|\\]/.test(n)
};

GleamTech.JavaScript.Util.TrimFileName = function(n) {
    while (n.substring(0, 1) == " " || n.substring(0, 1) == "\n" || n.substring(0, 1) == "\r") n = n.substring(1, n.length);
    while (n.substring(n.length - 1, n.length) == " " || n.substring(n.length - 1, n.length) == "." || n.substring(n.length - 1, n.length) == "\n" || n.substring(n.length - 1, n.length) == "\r") n = n.substring(0, n.length - 1);
    return n
};

GleamTech.JavaScript.Util.Trim = function(n, t) {
    return n = GleamTech.JavaScript.Util.TrimStart(n, t),
    GleamTech.JavaScript.Util.TrimEnd(n, t)
};

GleamTech.JavaScript.Util.TrimStart = function(n, t) {
    for (t || (t = " "); n.substring(0, 1) == t;) n = n.substring(1, n.length);
    return n
};

GleamTech.JavaScript.Util.TrimEnd = function(n, t) {
    for (t || (t = " "); n.substring(n.length - 1, n.length) == t;) n = n.substring(0, n.length - 1);
    return n
};

GleamTech.JavaScript.Util.EscapeRegExpPattern = function(n) {
    return n.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
};
GleamTech.JavaScript.Util.GetIEVersion = function() {
    if (document.body.style.scrollbar3dLightColor != undefined) return document.body.style.opacity != undefined ? 9 : document.querySelector != undefined ? 8 : document.body.style.msInterpolationMode != undefined ? 7 : document.body.style.textOverflow != undefined ? 6 : 5.5
};

GleamTech.JavaScript.Util.SetOpacity = function(n, t) {
    "opacity" in n.style ? n.style.opacity = t / 10 : n.style.filter = t == 10 ? "": "alpha(opacity=" + t * 10 + ")"
};

GleamTech.JavaScript.Util.SetBorderRadius = function(n, t, i, r, u) {
    var f = t + "px " + i + "px " + r + "px " + u + "px";
    "borderRadius" in n.style ? n.style.borderRadius = f: "MozBorderRadius" in n.style ? n.style.MozBorderRadius = f: "webkitBorderRadius" in n.style && (n.style.webkitBorderRadius = f)
};

GleamTech.JavaScript.Util.CreateUniqueId = function() {
    return (new Date).getTime() + "" + Math.floor(Math.random() * 8999 + 1e3)
};

GleamTech.JavaScript.Util.GetPropertyName = function(n, t) {
    for (var i in n) if (n[i] == t) return i;
    return ""
};

GleamTech.JavaScript.Util.SelectInputText = function(n, t, i) {
    if (n.createTextRange) {
        var r = n.createTextRange();
        r.collapse(!0);
        r.moveStart("character", t);
        r.moveEnd("character", i - t);
        r.select()
    } else n.setSelectionRange ? n.setSelectionRange(t, i) : n.selectionStart && (n.selectionStart = t, n.selectionEnd = i);
    n.disabled || n.focus()
};

GleamTech.JavaScript.Util.DeSelectAllRanges = function() {
    document.selection ? document.selection.empty() : window.getSelection && window.getSelection().removeAllRanges()
};
GleamTech.JavaScript.Util.SelectRange = function(n) {
    var t;
    GleamTech.JavaScript.Util.DeSelectAllRanges();
    document.selection ? (t = document.body.createTextRange(), t.moveToElementText(document.getElementById(n)), t.select()) : window.getSelection && (t = document.createRange(), t.selectNode(document.getElementById(n)), window.getSelection().addRange(t))
};

GleamTech.JavaScript.Util.ExecuteFunctionByName = function(n, t) {
    for (var u = Array.prototype.slice.call(arguments, 2), i = n.split("."), f = i.pop(), r = 0; r < i.length; r++) t = t[i[r]];
    return t[f].apply(t, u)
};
GleamTech.JavaScript.Util.AppendToUrl = function(n, t) {
    return n[n.length - 1] != "/" ? n + "/" + t: n + t
};

GleamTech.JavaScript.Util.RefreshPage = function(n) {
    var t = n || window;
    t.location.href.indexOf("#") == -1 ? t.location.href = t.location.href: t.location.reload()
};

GleamTech.JavaScript.Util.Viewport = {};
GleamTech.JavaScript.Util.Viewport.GetWidth = function() {
    var n;
    return self.innerHeight ? n = self.innerWidth: document.documentElement && document.documentElement.clientWidth ? n = document.documentElement.clientWidth: document.body && (n = document.body.clientWidth),
    n
};

GleamTech.JavaScript.Util.Viewport.GetHeight = function() {
    var n;
    return self.innerHeight ? n = self.innerHeight: document.documentElement && document.documentElement.clientHeight ? n = document.documentElement.clientHeight: document.body && (n = document.body.clientHeight),
    n
};

GleamTech.JavaScript.Util.Viewport.GetScrollLeft = function() {
    var n;
    return self.pageXOffset || self.pageYOffset ? n = self.pageXOffset: document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop) ? n = document.documentElement.scrollLeft: document.body && (n = document.body.scrollLeft),
    n
};

GleamTech.JavaScript.Util.Viewport.GetScrollTop = function() {
    var n;
    return self.pageXOffset || self.pageYOffset ? n = self.pageYOffset: document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop) ? n = document.documentElement.scrollTop: document.body && (n = document.body.scrollTop),
    n
};

GleamTech.JavaScript.Util.Viewport.GetScrollWidth = function() {
    var n;
    return document.documentElement && (document.documentElement.scrollWidth || document.documentElement.scrollHeight) ? n = document.documentElement.scrollWidth: document.body && (n = document.body.scrollWidth),
    n
};

GleamTech.JavaScript.Util.Viewport.GetScrollHeight = function() {
    var n;
    return document.documentElement && (document.documentElement.scrollWidth || document.documentElement.scrollHeight) ? n = document.documentElement.scrollHeight: document.body && (n = document.body.scrollHeight),
    n
};

GleamTech.JavaScript.Util.LanguageData = {};
GleamTech.JavaScript.Util.Languages = {};
GleamTech.JavaScript.Util.GetLanguage = function(n) {
    var t = GleamTech.JavaScript.Util.Languages[n],
    i;
    return t || (i = GleamTech.JavaScript.Util.LanguageData[n], t = new GleamTech.JavaScript.Util.Language(i), GleamTech.JavaScript.Util.Languages[n] = t),
    t
};

GleamTech.JavaScript.Util.Language = function(n) {
    this.entries = n
};

GleamTech.JavaScript.Util.Language.prototype.GetEntry = function(n, t, i, r) {
    var u = this.entries[n];
    if (u === undefined) throw new Error('Language entry with key "{0}" not found.').replace(/\{0\}/g, n);
    if (u == null) throw new Error('Value for language entry with key "{0}" is missing.').replace(/\{0\}/g, n);
    return t != undefined && (u = u.replace(/\{0\}/g, t)),
    i != undefined && (u = u.replace(/\{1\}/g, i)),
    r != undefined && (u = u.replace(/\{2\}/g, r)),
    u
};

GleamTech.JavaScript.Util.Sort = {};
GleamTech.JavaScript.Util.Sort.types = {};
GleamTech.JavaScript.Util.Sort.AddSortType = function(n, t, i, r) {
    GleamTech.JavaScript.Util.Sort.types[n] = {
        name: n,
        comparableValueFunction: t,
        compareFunction: i,
        defaultFormatFunction: r
    }
};
GleamTech.JavaScript.Util.Sort.CompareBasic = function(n, t) {
    return n < t ? -1 : n > t ? 1 : 0
};
GleamTech.JavaScript.Util.Sort.GetSelf = function(n) {
    return n
};
GleamTech.JavaScript.Util.Sort.GetLowerCase = function(n) {
    return n.toLowerCase()
};
GleamTech.JavaScript.Util.Sort.GetNumber = function(n) {
    return + n
};
GleamTech.JavaScript.Util.Sort.GetDate = function(n) {
    return new Date(n)
};
GleamTech.JavaScript.Util.Sort.FormatSfDate = function(n) {
    return n.substring(n.indexOf("|") + 1, n.length)
};
GleamTech.JavaScript.Util.Sort.FormatIsoDate = function(n, format) {
    var addLeadingZero = function(n) {
        return (n < 10 && n >= 0 ? "0": "") + n
    },
    t = function(n) {
        var t, dateObj, oh = 0,
        om = 0;
        t = /^(\d{4})?-?(\d\d)?-?(\d\d)?[T ]?(\d\d)?:?(\d\d)?:?(\d\d)?([Z+-])?(\d\d)?:?(\d\d)?$/.test(n);
        with(RegExp) $7 != "Z" && (oh = $7 + $8, $9 && (om = $7 + $9)),
        dateObj = $7 ? new Date(Date.UTC($1 || 77, $2 - 1, $3, $4 - oh, $5 - om, $6)) : new Date($1 || 77, $2 - 1, $3, $4, $5, $6);
        return t ? dateObj: null
    },
    str,
    i = t(n);
    with(i) str = format,
    str = str.replace("dd", addLeadingZero(getDate())),
    str = str.replace("MM", addLeadingZero(getMonth() + 1)),
    str = str.replace("yyyy", getFullYear()),
    str = str.replace("HH", addLeadingZero(getHours())),
    str = str.replace("mm", addLeadingZero(getMinutes()));
    return str
};
GleamTech.JavaScript.Util.Sort.AddSortType("String", GleamTech.JavaScript.Util.Sort.GetSelf, GleamTech.JavaScript.Util.Sort.CompareBasic, null);
GleamTech.JavaScript.Util.Sort.AddSortType("CaseInsensitiveString", GleamTech.JavaScript.Util.Sort.GetLowerCase, GleamTech.JavaScript.Util.Sort.CompareBasic, null);
GleamTech.JavaScript.Util.Sort.AddSortType("Number", GleamTech.JavaScript.Util.Sort.GetNumber, GleamTech.JavaScript.Util.Sort.CompareBasic, null);
GleamTech.JavaScript.Util.Sort.AddSortType("Date", GleamTech.JavaScript.Util.Sort.GetDate, GleamTech.JavaScript.Util.Sort.CompareBasic, null);
GleamTech.JavaScript.Util.Sort.AddSortType("SortableFormattedDate", GleamTech.JavaScript.Util.Sort.GetSelf, GleamTech.JavaScript.Util.Sort.CompareBasic, GleamTech.JavaScript.Util.Sort.FormatSfDate);
GleamTech.JavaScript.Util.Sort.AddSortType("ISODate", GleamTech.JavaScript.Util.Sort.GetSelf, GleamTech.JavaScript.Util.Sort.CompareBasic, GleamTech.JavaScript.Util.Sort.FormatIsoDate);

