var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.ProgressBarHeight = 13;
GleamTech.JavaScript.UI.ProgressBarImageSprite = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAaCAIAAAD5ZqGGAAAAV0lEQVR42jWJOwrAIBAF13GTKq13yP2vkiPYpLOQsOKHRIQ8GAbmSc5Zeu9MY2aUUhhjkFJCRPjnvUdVCSEQQ1xfaZ27Jp5m1HeIXOfqzjkUx6awTw7dPlRcI2+hZb6IAAAAAElFTkSuQmCC";
GleamTech.JavaScript.UI.ProgressBarCssClass = "gt-progressBar";
GleamTech.JavaScript.UI.ProgressBar = function(n, t, i, r) {
    var u = new Image;
    u.src = r || GleamTech.JavaScript.UI.ProgressBarImageSprite;
    this.ElementControl = document.createElement("div");
    n.appendChild(this.ElementControl);
    this.ElementControl.style.width = t + "px";
    this.ElementControl.style.height = GleamTech.JavaScript.UI.ProgressBarHeight + "px";
    GleamTech.JavaScript.Util.SetBorderRadius(this.ElementControl, 2, 2, 2, 2);
    this.ElementControl.className = GleamTech.JavaScript.UI.ProgressBarCssClass;
    this.ElementControl.style.backgroundImage = "url(" + u.src + ")";
    this.ElementIndicator = document.createElement("div");
    this.ElementControl.appendChild(this.ElementIndicator);
    this.ElementIndicator.style.width = "0px";
    this.ElementIndicator.style.height = GleamTech.JavaScript.UI.ProgressBarHeight + "px";
    this.ElementIndicator.style.backgroundImage = "url(" + u.src + ")";
    this.ElementIndicator.style.backgroundPosition = "0px 13px";
    this.CurrentPercentage = 0;
    this.PreventBackingUp = i
};
GleamTech.JavaScript.UI.ProgressBar.prototype.SetPercentage = function(n) {
    n != undefined && n != null && ((n < 0 && (n = 0), n > 100 && (n = 100), this.PreventBackingUp && n <= this.CurrentPercentage) || (this.CurrentPercentage = n, this.ElementIndicator.style.width = this.ElementControl.clientWidth * n / 100 + "px"))
};
/*!@@version@@*/
(function() {
    function l() {
        this.returnValue = !1
    }
    function a() {
        this.cancelBubble = !0
    }
    var h = 0,
    u = [],
    e = {},
    o = {},
    s = {
        "<": "lt",
        ">": "gt",
        "&": "amp",
        '"': "quot",
        "'": "#39"
    },
    c = /[<>&\"\']/g,
    i,
    f = window.setTimeout,
    r = {},
    t,
    n; (function(n) {
        for (var r = n.split(/,/), i, u, t = 0; t < r.length; t += 2) for (u = r[t + 1].split(/ /), i = 0; i < u.length; i++) o[u[i]] = r[t]
    })("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,audio/mp4,m4a,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe m2v,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/3gpp,3gp,video/3gpp2,3g2,video/vnd.rn-realvideo,rv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe");
    n = {
        VERSION: "@@version@@",
        STOPPED: 1,
        STARTED: 2,
        QUEUED: 1,
        UPLOADING: 2,
        FAILED: 4,
        DONE: 5,
        GENERIC_ERROR: -100,
        HTTP_ERROR: -200,
        IO_ERROR: -300,
        SECURITY_ERROR: -400,
        INIT_ERROR: -500,
        FILE_SIZE_ERROR: -600,
        FILE_EXTENSION_ERROR: -601,
        IMAGE_FORMAT_ERROR: -700,
        IMAGE_MEMORY_ERROR: -701,
        IMAGE_DIMENSIONS_ERROR: -702,
        mimeTypes: o,
        ua: function() {
            var i = navigator,
            t = i.userAgent,
            f = i.vendor,
            n, r, u;
            return n = /WebKit/.test(t),
            u = n && f.indexOf("Apple") !== -1,
            r = window.opera && window.opera.buildNumber,
            {
                windows: navigator.platform.indexOf("Win") !== -1,
                android: /Android/.test(t),
                ie: !n && !r && /MSIE/gi.test(t) && /Explorer/gi.test(i.appName),
                webkit: n,
                gecko: !n && /Gecko/.test(t),
                safari: u,
                opera: !!r
            }
        } (),
        typeOf: function(n) {
            return {}.toString.call(n).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
        },
        extend: function(t) {
            return n.each(arguments,
            function(i, r) {
                r > 0 && n.each(i,
                function(n, i) {
                    t[i] = n
                })
            }),
            t
        },
        cleanName: function(n) {
            for (var i = [/[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u"], t = 0; t < i.length; t += 2) n = n.replace(i[t], i[t + 1]);
            return n = n.replace(/\s+/g, "_"),
            n.replace(/[^a-z0-9_\-\.]+/gi, "")
        },
        addRuntime: function(n, t) {
            return t.name = n,
            u[n] = t,
            u.push(t),
            t
        },
        guid: function() {
            for (var i = (new Date).getTime().toString(32), t = 0; t < 5; t++) i += Math.floor(Math.random() * 65535).toString(32);
            return (n.guidPrefix || "p") + i + (h++).toString(32)
        },
        buildUrl: function(t, i) {
            var r = "";
            return n.each(i,
            function(n, t) {
                r += (r ? "&": "") + encodeURIComponent(t) + "=" + encodeURIComponent(n)
            }),
            r && (t += (t.indexOf("?") > 0 ? "&": "?") + r),
            t
        },
        each: function(n, t) {
            var f, u, r;
            if (n) if (f = n.length, f === i) {
                for (u in n) if (n.hasOwnProperty(u) && t(n[u], u) === !1) return
            } else for (r = 0; r < f; r++) if (t(n[r], r) === !1) return
        },
        formatSize: function(t) {
            return t === i || /\D/.test(t) ? n.translate("N/A") : t > 1073741824 ? Math.round(t / 1073741824, 1) + " GB": t > 1048576 ? Math.round(t / 1048576, 1) + " MB": t > 1024 ? Math.round(t / 1024, 1) + " KB": t + " b"
        },
        getPos: function(t, i) {
            function h(n) {
                var t, i, r = 0,
                f = 0;
                return n && (i = n.getBoundingClientRect(), t = u.compatMode === "CSS1Compat" ? u.documentElement: u.body, r = i.left + t.scrollLeft, f = i.top + t.scrollTop),
                {
                    x: r,
                    y: f
                }
            }
            var f = 0,
            e = 0,
            r, u = document,
            o, s;
            if (t = t, i = i || u.body, t && t.getBoundingClientRect && n.ua.ie && (!u.documentMode || u.documentMode < 8)) return o = h(t),
            s = h(i),
            {
                x: o.x - s.x,
                y: o.y - s.y
            };
            for (r = t; r && r != i && r.nodeType;) f += r.offsetLeft || 0,
            e += r.offsetTop || 0,
            r = r.offsetParent;
            for (r = t.parentNode; r && r != i && r.nodeType;) f -= r.scrollLeft || 0,
            e -= r.scrollTop || 0,
            r = r.parentNode;
            return {
                x: f,
                y: e
            }
        },
        getSize: function(n) {
            return {
                w: n.offsetWidth || n.clientWidth,
                h: n.offsetHeight || n.clientHeight
            }
        },
        parseSize: function(n) {
            var t;
            return typeof n == "string" && (n = /^([0-9]+)([mgk]?)$/.exec(n.toLowerCase().replace(/[^0-9mkg]/g, "")), t = n[2], n = +n[1], t == "g" && (n *= 1073741824), t == "m" && (n *= 1048576), t == "k" && (n *= 1024)),
            n
        },
        xmlEncode: function(n) {
            return n ? ("" + n).replace(c,
            function(n) {
                return s[n] ? "&" + s[n] + ";": n
            }) : n
        },
        toArray: function(n) {
            for (var i = [], t = 0; t < n.length; t++) i[t] = n[t];
            return i
        },
        inArray: function(n, t) {
            if (t) {
                if (Array.prototype.indexOf) return Array.prototype.indexOf.call(t, n);
                for (var i = 0,
                r = t.length; i < r; i++) if (t[i] === n) return i
            }
            return - 1
        },
        addI18n: function(t) {
            return n.extend(e, t)
        },
        translate: function(n) {
            return e[n] || n
        },
        isEmptyObj: function(n) {
            if (n === i) return ! 0;
            for (var t in n) return ! 1;
            return ! 0
        },
        hasClass: function(n, t) {
            var i;
            return n.className == "" ? !1 : (i = new RegExp("(^|\\s+)" + t + "(\\s+|$)"), i.test(n.className))
        },
        addClass: function(t, i) {
            n.hasClass(t, i) || (t.className = t.className == "" ? i: t.className.replace(/\s+$/, "") + " " + i)
        },
        removeClass: function(n, t) {
            var i = new RegExp("(^|\\s+)" + t + "(\\s+|$)");
            n.className = n.className.replace(i,
            function(n, t, i) {
                return t === " " && i === " " ? " ": ""
            })
        },
        getStyle: function(n, t) {
            return n.currentStyle ? n.currentStyle[t] : window.getComputedStyle ? window.getComputedStyle(n, null)[t] : void 0
        },
        addEvent: function(u, f, e) {
            var o, s, h;
            h = arguments[3];
            f = f.toLowerCase();
            t === i && (t = "Plupload_" + n.guid());
            u.addEventListener ? (o = e, u.addEventListener(f, o, !1)) : u.attachEvent && (o = function() {
                var n = window.event;
                n.target || (n.target = n.srcElement);
                n.preventDefault = l;
                n.stopPropagation = a;
                e(n)
            },
            u.attachEvent("on" + f, o));
            u[t] === i && (u[t] = n.guid());
            r.hasOwnProperty(u[t]) || (r[u[t]] = {});
            s = r[u[t]];
            s.hasOwnProperty(f) || (s[f] = []);
            s[f].push({
                func: o,
                orig: e,
                key: h
            })
        },
        removeEvent: function(u, f) {
            var e, s, h, o;
            if (typeof arguments[2] == "function" ? s = arguments[2] : h = arguments[2], f = f.toLowerCase(), u[t] && r[u[t]] && r[u[t]][f]) e = r[u[t]][f];
            else return;
            for (o = e.length - 1; o >= 0; o--) if ((e[o].key === h || e[o].orig === s) && (u.removeEventListener ? u.removeEventListener(f, e[o].func, !1) : u.detachEvent && u.detachEvent("on" + f, e[o].func), e[o].orig = null, e[o].func = null, e.splice(o, 1), s !== i)) break;
            if (e.length || delete r[u[t]][f], n.isEmptyObj(r[u[t]])) {
                delete r[u[t]];
                try {
                    delete u[t]
                } catch(c) {
                    u[t] = i
                }
            }
        },
        removeAllEvents: function(u) {
            var f = arguments[1];
            u[t] !== i && u[t] && n.each(r[u[t]],
            function(t, i) {
                n.removeEvent(u, i, f)
            })
        }
    };
    n.Uploader = function(t) {
        function h() {
            var t, u = 0,
            i;
            if (this.state == n.STARTED) {
                for (i = 0; i < r.length; i++) t || r[i].status != n.QUEUED ? u++:(t = r[i], t.status = n.UPLOADING, this.trigger("BeforeUpload", t) && this.trigger("UploadFile", t));
                u == r.length && (this.stop(), this.trigger("UploadComplete", r))
            }
        }
        function s() {
            var u, t;
            for (e.reset(), u = 0; u < r.length; u++) t = r[u],
            t.size !== i ? (e.size += t.size, e.loaded += t.loaded) : e.size = i,
            t.status == n.DONE ? e.uploaded++:t.status == n.FAILED ? e.failed++:e.queued++;
            e.size === i ? e.percent = r.length > 0 ? Math.ceil(e.uploaded / r.length * 100) : 0 : (e.bytesPerSec = Math.ceil(e.loaded / (( + new Date - c || 1) / 1e3)), e.percent = e.size > 0 ? Math.ceil(e.loaded / e.size * 100) : 0)
        }
        var o = {},
        e, r = [],
        c,
        l = !1;
        e = new n.QueueProgress;
        t = n.extend({
            chunk_size: 0,
            multipart: !0,
            multi_selection: !0,
            file_data_name: "file",
            filters: []
        },
        t);
        n.extend(this, {
            state: n.STOPPED,
            runtime: "",
            features: {},
            files: r,
            settings: t,
            total: e,
            id: n.guid(),
            init: function() {
                function v() {
                    var i = l[y++],
                    u,
                    t,
                    r;
                    if (i) {
                        if (u = i.getFeatures(), t = e.settings.required_features, t) for (t = t.split(","), r = 0; r < t.length; r++) if (!u[t[r]]) {
                            v();
                            return
                        }
                        i.init(e,
                        function(n) {
                            n && n.success ? (e.features = u, e.runtime = i.name, e.trigger("Init", {
                                runtime: i.name
                            }), e.trigger("PostInit"), e.refresh()) : v()
                        })
                    } else e.trigger("Error", {
                        code: n.INIT_ERROR,
                        message: n.translate("Init error.")
                    })
                }
                var e = this,
                o, l, y = 0,
                a;
                if (typeof t.preinit == "function" ? t.preinit(e) : n.each(t.preinit,
                function(n, t) {
                    e.bind(t, n)
                }), t.page_url = t.page_url || document.location.pathname.replace(/\/[^\/]+$/g, "/"), /^(\w+:\/\/|\/)/.test(t.url) || (t.url = t.page_url + t.url), t.chunk_size = n.parseSize(t.chunk_size), t.max_file_size = n.parseSize(t.max_file_size), e.bind("FilesAdded",
                function(u, o) {
                    var c, s, a = 0,
                    h, l = t.filters;
                    for (l && l.length && (h = [], n.each(l,
                    function(t) {
                        n.each(t.extensions.split(/,/),
                        function(n) { / ^\s * \ * \s * $ / .test(n) ? h.push("\\.*") : h.push("\\." + n.replace(new RegExp("[" + "/^$.*+?|()[]{}\\".replace(/./g, "\\$&") + "]", "g"), "\\$&"))
                        })
                    }), h = new RegExp(h.join("|") + "$", "i")), c = 0; c < o.length; c++) {
                        if (s = o[c], s.loaded = 0, s.percent = 0, s.status = n.QUEUED, h && !h.test(s.name)) {
                            u.trigger("Error", {
                                code: n.FILE_EXTENSION_ERROR,
                                message: n.translate("File extension error."),
                                file: s
                            });
                            continue
                        }
                        if (s.size !== i && s.size > t.max_file_size) {
                            u.trigger("Error", {
                                code: n.FILE_SIZE_ERROR,
                                message: n.translate("File size error."),
                                file: s
                            });
                            continue
                        }
                        r.push(s);
                        a++
                    }
                    if (a) f(function() {
                        e.trigger("QueueChanged");
                        e.refresh()
                    },
                    1);
                    else return ! 1
                }), t.unique_names && e.bind("UploadFile",
                function(n, t) {
                    var i = t.name.match(/\.([^.]+)$/),
                    r = "tmp";
                    i && (r = i[1]);
                    t.target_name = t.id + "." + r
                }), e.bind("UploadProgress",
                function(n, t) {
                    t.percent = t.size > 0 ? Math.ceil(t.loaded / t.size * 100) : 100;
                    s()
                }), e.bind("StateChanged",
                function(t) {
                    if (t.state == n.STARTED) c = +new Date;
                    else if (t.state == n.STOPPED) for (o = t.files.length - 1; o >= 0; o--) t.files[o].status == n.UPLOADING && (t.files[o].status = n.QUEUED, s())
                }), e.bind("QueueChanged", s), e.bind("Error",
                function(t, i) {
                    i.file && (i.file.status = n.FAILED, s(), t.state == n.STARTED && f(function() {
                        h.call(e)
                    },
                    1))
                }), e.bind("FileUploaded",
                function(t, i) {
                    i.status = n.DONE;
                    i.loaded = i.size;
                    t.trigger("UploadProgress", i);
                    f(function() {
                        h.call(e)
                    },
                    1)
                }), t.runtimes) for (l = [], a = t.runtimes.split(/\s?,\s?/), o = 0; o < a.length; o++) u[a[o]] && l.push(u[a[o]]);
                else l = u;
                v();
                typeof t.init == "function" ? t.init(e) : n.each(t.init,
                function(n, t) {
                    e.bind(t, n)
                })
            },
            refresh: function() {
                this.trigger("Refresh")
            },
            start: function() {
                r.length && this.state != n.STARTED && (this.state = n.STARTED, this.trigger("StateChanged"), h.call(this))
            },
            stop: function() {
                this.state != n.STOPPED && (this.state = n.STOPPED, this.trigger("CancelUpload"), this.trigger("StateChanged"))
            },
            disableBrowse: function() {
                l = arguments[0] !== i ? arguments[0] : !0;
                this.trigger("DisableBrowse", l)
            },
            getFile: function(n) {
                for (var t = r.length - 1; t >= 0; t--) if (r[t].id === n) return r[t]
            },
            removeFile: function(n) {
                for (var t = r.length - 1; t >= 0; t--) if (r[t].id === n.id) return this.splice(t, 1)[0]
            },
            splice: function(n, t) {
                var u;
                return u = r.splice(n === i ? 0 : n, t === i ? r.length: t),
                this.trigger("FilesRemoved", u),
                this.trigger("QueueChanged"),
                u
            },
            trigger: function(n) {
                var i = o[n.toLowerCase()],
                t,
                r;
                if (i) for (r = Array.prototype.slice.call(arguments), r[0] = this, t = 0; t < i.length; t++) if (i[t].func.apply(i[t].scope, r) === !1) return ! 1;
                return ! 0
            },
            hasEventListener: function(n) {
                return !! o[n.toLowerCase()]
            },
            bind: function(n, t, i) {
                var r;
                n = n.toLowerCase();
                r = o[n] || [];
                r.push({
                    func: t,
                    scope: i || this
                });
                o[n] = r
            },
            unbind: function(n) {
                n = n.toLowerCase();
                var t = o[n],
                r,
                u = arguments[1];
                if (t) {
                    if (u !== i) {
                        for (r = t.length - 1; r >= 0; r--) if (t[r].func === u) {
                            t.splice(r, 1);
                            break
                        }
                    } else t = [];
                    t.length || delete o[n]
                }
            },
            unbindAll: function() {
                var t = this;
                n.each(o,
                function(n, i) {
                    t.unbind(i)
                })
            },
            destroy: function() {
                this.stop();
                this.trigger("Destroy");
                this.unbindAll()
            }
        })
    };
    n.File = function(n, t, i) {
        var r = this;
        r.id = n;
        r.name = t;
        r.size = i;
        r.loaded = 0;
        r.percent = 0;
        r.status = 0
    };
    n.Runtime = function() {
        this.getFeatures = function() {};
        this.init = function() {}
    };
    n.QueueProgress = function() {
        var n = this;
        n.size = 0;
        n.loaded = 0;
        n.uploaded = 0;
        n.failed = 0;
        n.queued = 0;
        n.percent = 0;
        n.bytesPerSec = 0;
        n.reset = function() {
            n.size = n.loaded = n.uploaded = n.failed = n.queued = n.percent = n.bytesPerSec = 0
        }
    };
    n.runtimes = {};
    window.plupload = n
})();
	
	(function(n, t, r, u) {
    function c(n) {
        var u = n.naturalWidth,
        f = n.naturalHeight,
        i, r;
        return u * f > 1048576 ? (i = t.createElement("canvas"), i.width = i.height = 1, r = i.getContext("2d"), r.drawImage(n, -u + 1, 0), r.getImageData(0, 0, 1, 1).data[3] === 0) : !1
    }
    function l(n, i, r) {
        var f = t.createElement("canvas"),
        e,
        c,
        s;
        f.width = 1;
        f.height = r;
        e = f.getContext("2d");
        e.drawImage(n, 0, 0);
        for (var l = e.getImageData(0, 0, 1, r).data, o = 0, h = r, u = r; u > o;) c = l[(u - 1) * 4 + 3],
        c === 0 ? h = u: o = u,
        u = h + o >> 1;
        return s = u / r,
        s === 0 ? 1 : s
    }
    function a(n, i, r) {
        var f = n.naturalWidth,
        e = n.naturalHeight,
        w = r.width,
        b = r.height,
        a = i.getContext("2d"),
        k,
        u,
        s,
        y,
        o,
        p;
        a.save();
        k = c(n);
        k && (f /= 2, e /= 2);
        u = 1024;
        s = t.createElement("canvas");
        s.width = s.height = u;
        for (var v = s.getContext("2d"), d = l(n, f, e), h = 0; h < e;) {
            for (y = h + u > e ? e - h: u, o = 0; o < f;) {
                p = o + u > f ? f - o: u;
                v.clearRect(0, 0, u, u);
                v.drawImage(n, -o, -h);
                var g = o * w / f << 0,
                nt = Math.ceil(p * w / f),
                tt = h * b / e / d << 0,
                it = Math.ceil(y * b / e / d);
                a.drawImage(s, 0, 0, p, y, g, tt, nt, it);
                o += u
            }
            h += u
        }
        a.restore();
        s = v = null
    }
    function v(t, i) {
        var r;
        if ("FileReader" in n) r = new FileReader,
        r.readAsDataURL(t),
        r.onload = function() {
            i(r.result)
        };
        else return i(t.getAsDataURL())
    }
    function o(t, i) {
        var r;
        if ("FileReader" in n) r = new FileReader,
        r.readAsBinaryString(t),
        r.onload = function() {
            i(r.result)
        };
        else return i(t.getAsBinary())
    }
    function y(n, i, r, u) {
        var o, e, s, c = this;
        v(f[n.id],
        function(f) {
            o = t.createElement("canvas");
            o.style.display = "none";
            t.body.appendChild(o);
            e = new Image;
            e.onerror = e.onabort = function() {
                u({
                    success: !1
                })
            };
            e.onload = function() {
                var v, y, t, l;
                if (i.width || (i.width = e.width), i.height || (i.height = e.height), s = Math.min(i.width / e.width, i.height / e.height), s < 1) v = Math.round(e.width * s),
                y = Math.round(e.height * s);
                else if (i.quality && r === "image/jpeg") v = e.width,
                y = e.height;
                else {
                    u({
                        success: !1
                    });
                    return
                }
                if (o.width = v, o.height = y, a(e, o, {
                    width: v,
                    height: y
                }), r === "image/jpeg" && (t = new h(atob(f.substring(f.indexOf("base64,") + 7))), t.headers && t.headers.length && (l = new p, l.init(t.get("exif")[0]) && (l.setExif("PixelXDimension", v), l.setExif("PixelYDimension", y), t.set("exif", l.getBinary()), c.hasEventListener("ExifData") && c.trigger("ExifData", n, l.EXIF()), c.hasEventListener("GpsData") && c.trigger("GpsData", n, l.GPS())))), i.quality && r === "image/jpeg") try {
                    f = o.toDataURL(r, i.quality / 100)
                } catch(w) {
                    f = o.toDataURL(r)
                } else f = o.toDataURL(r);
                f = f.substring(f.indexOf("base64,") + 7);
                f = atob(f);
                t && t.headers && t.headers.length && (f = t.restore(f), t.purge());
                o.parentNode.removeChild(o);
                u({
                    success: !0,
                    data: f
                })
            };
            e.src = f
        })
    }
    function s() {
        function i(i, r) {
            for (var e = t ? 0 : -8 * (r - 1), f = 0, u = 0; u < r; u++) f |= n.charCodeAt(i + u) << Math.abs(e + u * 8);
            return f
        }
        function r(t, i, r) {
            var r = arguments.length === 3 ? r: n.length - i - 1;
            n = n.substr(0, i) + t + n.substr(r + i)
        }
        function f(n, i, u) {
            for (var e = "",
            o = t ? 0 : -8 * (u - 1), f = 0; f < u; f++) e += String.fromCharCode(i >> Math.abs(o + f * 8) & 255);
            r(e, n, u)
        }
        var t = !1,
        n;
        return {
            II: function(n) {
                if (n === u) return t;
                t = n
            },
            init: function(i) {
                t = !1;
                n = i
            },
            SEGMENT: function(t, i, u) {
                switch (arguments.length) {
                case 1:
                    return n.substr(t, n.length - t - 1);
                case 2:
                    return n.substr(t, i);
                case 3:
                    r(u, t, i);
                    break;
                default:
                    return n
                }
            },
            BYTE: function(n) {
                return i(n, 1)
            },
            SHORT: function(n) {
                return i(n, 2)
            },
            LONG: function(n, t) {
                if (t === u) return i(n, 4);
                f(n, t, 4)
            },
            SLONG: function(n) {
                var t = i(n, 4);
                return t > 2147483647 ? t - 4294967296 : t
            },
            STRING: function(n, t) {
                var r = "";
                for (t += n; n < t; n++) r += String.fromCharCode(i(n, 1));
                return r
            }
        }
    }
    function h(n) {
        var e = {
            65505 : {
                app: "EXIF",
                name: "APP1",
                signature: "Exif\0"
            },
            65506 : {
                app: "ICC",
                name: "APP2",
                signature: "ICC_PROFILE\0"
            },
            65517 : {
                app: "IPTC",
                name: "APP13",
                signature: "Photoshop 3.0\0"
            }
        },
        i = [],
        t,
        r,
        f = u,
        o = 0,
        c;
        if (t = new s, t.init(n), t.SHORT(0) === 65496) {
            for (r = 2, c = Math.min(1048576, n.length); r <= c;) {
                if (f = t.SHORT(r), f >= 65488 && f <= 65495) {
                    r += 2;
                    continue
                }
                if (f === 65498 || f === 65497) break;
                o = t.SHORT(r + 2) + 2;
                e[f] && t.STRING(r + 4, e[f].signature.length) === e[f].signature && i.push({
                    hex: f,
                    app: e[f].app.toUpperCase(),
                    name: e[f].name.toUpperCase(),
                    start: r,
                    length: o,
                    segment: t.SEGMENT(r, o)
                });
                r += o
            }
            return t.init(null),
            {
                headers: i,
                restore: function(n) {
                    var f, e, u, o;
                    if (t.init(n), f = new h(n), !f.headers) return ! 1;
                    for (u = f.headers.length; u > 0; u--) e = f.headers[u - 1],
                    t.SEGMENT(e.start, e.length, "");
                    for (f.purge(), r = t.SHORT(2) == 65504 ? 4 + t.SHORT(4) : 2, u = 0, o = i.length; u < o; u++) t.SEGMENT(r, 0, i[u].segment),
                    r += i[u].length;
                    return t.SEGMENT()
                },
                get: function(n) {
                    for (var r = [], t = 0, u = i.length; t < u; t++) i[t].app === n.toUpperCase() && r.push(i[t].segment);
                    return r
                },
                set: function(n, t) {
                    var u = [],
                    r,
                    f;
                    for (typeof t == "string" ? u.push(t) : u = t, r = ii = 0, f = i.length; r < f; r++) if (i[r].app === n.toUpperCase() && (i[r].segment = u[ii], i[r].length = u[ii].length, ii++), ii >= u.length) break
                },
                purge: function() {
                    i = [];
                    t.init(null)
                }
            }
        }
    }
    function p() {
        function o(i, r) {
            for (var p = n.SHORT(i), f, c, y, s, w, o, a, h = [], v = {},
            l = 0; l < p; l++) if (o = w = i + 12 * l + 2, c = r[n.SHORT(o)], c !== u) {
                y = n.SHORT(o += 2);
                s = n.LONG(o += 2);
                o += 4;
                h = [];
                switch (y) {
                case 1:
                case 7:
                    for (s > 4 && (o = n.LONG(o) + t.tiffHeader), f = 0; f < s; f++) h[f] = n.BYTE(o + f);
                    break;
                case 2:
                    s > 4 && (o = n.LONG(o) + t.tiffHeader);
                    v[c] = n.STRING(o, s - 1);
                    continue;
                case 3:
                    for (s > 2 && (o = n.LONG(o) + t.tiffHeader), f = 0; f < s; f++) h[f] = n.SHORT(o + f * 2);
                    break;
                case 4:
                    for (s > 1 && (o = n.LONG(o) + t.tiffHeader), f = 0; f < s; f++) h[f] = n.LONG(o + f * 4);
                    break;
                case 5:
                    for (o = n.LONG(o) + t.tiffHeader, f = 0; f < s; f++) h[f] = n.LONG(o + f * 4) / n.LONG(o + f * 4 + 4);
                    break;
                case 9:
                    for (o = n.LONG(o) + t.tiffHeader, f = 0; f < s; f++) h[f] = n.SLONG(o + f * 4);
                    break;
                case 10:
                    for (o = n.LONG(o) + t.tiffHeader, f = 0; f < s; f++) h[f] = n.SLONG(o + f * 4) / n.SLONG(o + f * 4 + 4);
                    break;
                default:
                    continue
                }
                a = s == 1 ? h[0] : h;
                v[c] = e.hasOwnProperty(c) && typeof a != "object" ? e[c][a] : a
            }
            return v
        }
        function h() {
            var i = u,
            r = t.tiffHeader;
            return (n.II(n.SHORT(r) == 18761), n.SHORT(r += 2) !== 42) ? !1 : (t.IFD0 = t.tiffHeader + n.LONG(r += 2), i = o(t.IFD0, f.tiff), t.exifIFD = "ExifIFDPointer" in i ? t.tiffHeader + i.ExifIFDPointer: u, t.gpsIFD = "GPSInfoIFDPointer" in i ? t.tiffHeader + i.GPSInfoIFDPointer: u, !0)
        }
        function c(r, u, e) {
            var o, l, s, h = 0,
            c;
            if (typeof u == "string") {
                c = f[r.toLowerCase()];
                for (hex in c) if (c[hex] === u) {
                    u = hex;
                    break
                }
            }
            for (o = t[r.toLowerCase() + "IFD"], l = n.SHORT(o), i = 0; i < l; i++) if (s = o + 12 * i + 2, n.SHORT(s) == u) {
                h = s + 8;
                break
            }
            return h ? (n.LONG(h, e), !0) : !1
        }
        var n, f, t = {},
        e;
        return n = new s,
        f = {
            tiff: {
                274 : "Orientation",
                34665 : "ExifIFDPointer",
                34853 : "GPSInfoIFDPointer"
            },
            exif: {
                36864 : "ExifVersion",
                40961 : "ColorSpace",
                40962 : "PixelXDimension",
                40963 : "PixelYDimension",
                36867 : "DateTimeOriginal",
                33434 : "ExposureTime",
                33437 : "FNumber",
                34855 : "ISOSpeedRatings",
                37377 : "ShutterSpeedValue",
                37378 : "ApertureValue",
                37383 : "MeteringMode",
                37384 : "LightSource",
                37385 : "Flash",
                41986 : "ExposureMode",
                41987 : "WhiteBalance",
                41990 : "SceneCaptureType",
                41988 : "DigitalZoomRatio",
                41992 : "Contrast",
                41993 : "Saturation",
                41994 : "Sharpness"
            },
            gps: {
                0 : "GPSVersionID",
                1 : "GPSLatitudeRef",
                2 : "GPSLatitude",
                3 : "GPSLongitudeRef",
                4 : "GPSLongitude"
            }
        },
        e = {
            ColorSpace: {
                1 : "sRGB",
                0 : "Uncalibrated"
            },
            MeteringMode: {
                0 : "Unknown",
                1 : "Average",
                2 : "CenterWeightedAverage",
                3 : "Spot",
                4 : "MultiSpot",
                5 : "Pattern",
                6 : "Partial",
                255 : "Other"
            },
            LightSource: {
                1 : "Daylight",
                2 : "Fliorescent",
                3 : "Tungsten",
                4 : "Flash",
                9 : "Fine weather",
                10 : "Cloudy weather",
                11 : "Shade",
                12 : "Daylight fluorescent (D 5700 - 7100K)",
                13 : "Day white fluorescent (N 4600 -5400K)",
                14 : "Cool white fluorescent (W 3900 - 4500K)",
                15 : "White fluorescent (WW 3200 - 3700K)",
                17 : "Standard light A",
                18 : "Standard light B",
                19 : "Standard light C",
                20 : "D55",
                21 : "D65",
                22 : "D75",
                23 : "D50",
                24 : "ISO studio tungsten",
                255 : "Other"
            },
            Flash: {
                0 : "Flash did not fire.",
                1 : "Flash fired.",
                5 : "Strobe return light not detected.",
                7 : "Strobe return light detected.",
                9 : "Flash fired, compulsory flash mode",
                13 : "Flash fired, compulsory flash mode, return light not detected",
                15 : "Flash fired, compulsory flash mode, return light detected",
                16 : "Flash did not fire, compulsory flash mode",
                24 : "Flash did not fire, auto mode",
                25 : "Flash fired, auto mode",
                29 : "Flash fired, auto mode, return light not detected",
                31 : "Flash fired, auto mode, return light detected",
                32 : "No flash function",
                65 : "Flash fired, red-eye reduction mode",
                69 : "Flash fired, red-eye reduction mode, return light not detected",
                71 : "Flash fired, red-eye reduction mode, return light detected",
                73 : "Flash fired, compulsory flash mode, red-eye reduction mode",
                77 : "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                79 : "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                89 : "Flash fired, auto mode, red-eye reduction mode",
                93 : "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                95 : "Flash fired, auto mode, return light detected, red-eye reduction mode"
            },
            ExposureMode: {
                0 : "Auto exposure",
                1 : "Manual exposure",
                2 : "Auto bracket"
            },
            WhiteBalance: {
                0 : "Auto white balance",
                1 : "Manual white balance"
            },
            SceneCaptureType: {
                0 : "Standard",
                1 : "Landscape",
                2 : "Portrait",
                3 : "Night scene"
            },
            Contrast: {
                0 : "Normal",
                1 : "Soft",
                2 : "Hard"
            },
            Saturation: {
                0 : "Normal",
                1 : "Low saturation",
                2 : "High saturation"
            },
            Sharpness: {
                0 : "Normal",
                1 : "Soft",
                2 : "Hard"
            },
            GPSLatitudeRef: {
                N: "North latitude",
                S: "South latitude"
            },
            GPSLongitudeRef: {
                E: "East longitude",
                W: "West longitude"
            }
        },
        {
            init: function(i) {
                return (t = {
                    tiffHeader: 10
                },
                i === u || !i.length) ? !1 : (n.init(i), n.SHORT(0) === 65505 && n.STRING(4, 5).toUpperCase() === "EXIF\0") ? h() : !1
            },
            EXIF: function() {
                var n, i, u;
                if (n = o(t.exifIFD, f.exif), n.ExifVersion && r.typeOf(n.ExifVersion) === "array") {
                    for (i = 0, u = ""; i < n.ExifVersion.length; i++) u += String.fromCharCode(n.ExifVersion[i]);
                    n.ExifVersion = u
                }
                return n
            },
            GPS: function() {
                var n;
                return n = o(t.gpsIFD, f.gps),
                n.GPSVersionID && (n.GPSVersionID = n.GPSVersionID.join(".")),
                n
            },
            setExif: function(n, t) {
                return n !== "PixelXDimension" && n !== "PixelYDimension" ? !1 : c("exif", n, t)
            },
            getBinary: function() {
                return n.SEGMENT()
            }
        }
    }
    var f = {},
    e;
    r.runtimes.Html5 = r.addRuntime("html5", {
        getFeatures: function() {
            var i, f, o, s, u, h;
            return f = o = u = h = !1,
            n.XMLHttpRequest && (i = new XMLHttpRequest, o = !!i.upload, f = !!(i.sendAsBinary || i.upload)),
            f && (s = !!(i.sendAsBinary || n.Uint8Array && n.ArrayBuffer), u = !!(File && (File.prototype.getAsDataURL || n.FileReader) && s), h = !!(File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice))),
            e = r.ua.safari && r.ua.windows,
            {
                html5: f,
                dragdrop: function() {
                    var n = t.createElement("div");
                    return "draggable" in n || "ondragstart" in n && "ondrop" in n
                } (),
                jpgresize: u,
                pngresize: u,
                multipart: u || !!n.FileReader || !!n.FormData,
                canSendBinary: s,
                cantSendBlobInFormData: !!(r.ua.gecko && n.FormData && n.FileReader && !FileReader.prototype.readAsArrayBuffer) || r.ua.android,
                progress: o,
                chunks: h,
                multi_selection: !(r.ua.safari && r.ua.windows),
                triggerDialog: r.ua.gecko && n.FormData || r.ua.webkit
            }
        },
        init: function(i, u) {
            function c(n) {
                for (var t, e = [], o, s = {},
                u = 0; u < n.length; u++)(t = n[u], s[t.name] && r.ua.safari && r.ua.windows) || (s[t.name] = !0, o = r.guid(), f[o] = t, e.push(new r.File(o, t.fileName || t.name, t.fileSize || t.size)));
                e.length && i.trigger("FilesAdded", e)
            }
            var h, s;
            if (h = this.getFeatures(), !h.html5) {
                u({
                    success: !1
                });
                return
            }
            i.bind("Init",
            function(n) {
                var u, f, o = [],
                s,
                e,
                b = n.settings.filters,
                h,
                l,
                a = t.body,
                v;
                u = t.createElement("div");
                u.id = n.id + "_html5_container";
                r.extend(u.style, {
                    position: "absolute",
                    background: i.settings.shim_bgcolor || "transparent",
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    zIndex: 99999,
                    opacity: i.settings.shim_bgcolor ? "": 0
                });
                u.className = "plupload html5";
                i.settings.container && (a = t.getElementById(i.settings.container), r.getStyle(a, "position") === "static" && (a.style.position = "relative"));
                a.appendChild(u);
                n: for (s = 0; s < b.length; s++) for (h = b[s].extensions.split(/,/), e = 0; e < h.length; e++) {
                    if (h[e] === "*") {
                        o = [];
                        break n
                    }
                    l = r.mimeTypes[h[e]];
                    l && r.inArray(l, o) === -1 && o.push(l)
                }
                if (u.innerHTML = '<input id="' + i.id + '_html5"  style="font-size:999px" type="file" accept="' + o.join(",") + '" ' + (i.settings.multi_selection && i.features.multi_selection ? 'multiple="multiple"': "") + " />", u.scrollTop = 100, v = t.getElementById(i.id + "_html5"), n.features.triggerDialog ? r.extend(v.style, {
                    position: "absolute",
                    width: "100%",
                    height: "100%"
                }) : r.extend(v.style, {
                    cssFloat: "right",
                    styleFloat: "right"
                }), v.onchange = function() {
                    c(this.files);
                    this.value = ""
                },
                f = t.getElementById(n.settings.browse_button), f) {
                    var y = n.settings.browse_button_hover,
                    p = n.settings.browse_button_active,
                    w = n.features.triggerDialog ? f: u;
                    y && (r.addEvent(w, "mouseover",
                    function() {
                        r.addClass(f, y)
                    },
                    n.id), r.addEvent(w, "mouseout",
                    function() {
                        r.removeClass(f, y)
                    },
                    n.id));
                    p && (r.addEvent(w, "mousedown",
                    function() {
                        r.addClass(f, p)
                    },
                    n.id), r.addEvent(t.body, "mouseup",
                    function() {
                        r.removeClass(f, p)
                    },
                    n.id));
                    n.features.triggerDialog && r.addEvent(f, "click",
                    function(i) {
                        var r = t.getElementById(n.id + "_html5");
                        r && !r.disabled && r.click();
                        i.preventDefault()
                    },
                    n.id)
                }
            });
            i.bind("PostInit",
            function() {
                var n = t.getElementById(i.settings.drop_element);
                if (n) {
                    if (e) {
                        r.addEvent(n, "dragenter",
                        function() {
                            var u, e, f;
                            u = t.getElementById(i.id + "_drop");
                            u || (u = t.createElement("input"), u.setAttribute("type", "file"), u.setAttribute("id", i.id + "_drop"), u.setAttribute("multiple", "multiple"), r.addEvent(u, "change",
                            function() {
                                c(this.files);
                                r.removeEvent(u, "change", i.id);
                                u.parentNode.removeChild(u)
                            },
                            i.id), r.addEvent(u, "dragover",
                            function(n) {
                                n.stopPropagation()
                            },
                            i.id), n.appendChild(u));
                            e = r.getPos(n, t.getElementById(i.settings.container));
                            f = r.getSize(n);
                            r.getStyle(n, "position") === "static" && r.extend(n.style, {
                                position: "relative"
                            });
                            r.extend(u.style, {
                                position: "absolute",
                                display: "block",
                                top: 0,
                                left: 0,
                                width: f.w + "px",
                                height: f.h + "px",
                                opacity: 0
                            })
                        },
                        i.id);
                        return
                    }
                    r.addEvent(n, "dragover",
                    function(n) {
                        n.preventDefault()
                    },
                    i.id);
                    r.addEvent(n, "drop",
                    function(n) {
                        var t = n.dataTransfer;
                        t && t.files && c(t.files);
                        n.preventDefault()
                    },
                    i.id)
                }
            });
            i.bind("Refresh",
            function(n) {
                var u, e, o, s, f;
                u = t.getElementById(i.settings.browse_button);
                u && (e = r.getPos(u, t.getElementById(n.settings.container)), o = r.getSize(u), s = t.getElementById(i.id + "_html5_container"), r.extend(s.style, {
                    top: e.y + "px",
                    left: e.x + "px",
                    width: o.w + "px",
                    height: o.h + "px"
                }), i.features.triggerDialog && (r.getStyle(u, "position") === "static" && r.extend(u.style, {
                    position: "relative"
                }), f = parseInt(r.getStyle(u, "zIndex"), 10), isNaN(f) && (f = 0), r.extend(u.style, {
                    zIndex: f
                }), r.extend(s.style, {
                    zIndex: f - 1
                })))
            });
            i.bind("DisableBrowse",
            function(n, i) {
                var r = t.getElementById(n.id + "_html5");
                r && (r.disabled = i)
            });
            i.bind("CancelUpload",
            function() {
                s && s.abort && s.abort()
            });
            i.bind("UploadFile",
            function(t, i) {
                function l(n, t, i) {
                    var r;
                    if (File.prototype.slice) try {
                        return n.slice(),
                        n.slice(t, i)
                    } catch(u) {
                        return n.slice(t, i - t)
                    } else return (r = File.prototype.webkitSlice || File.prototype.mozSlice) ? r.call(n, t, i) : null
                }
                function e(u) {
                    function o() {
                        function d(n) {
                            var r, i;
                            if (s.sendAsBinary) s.sendAsBinary(n);
                            else if (t.features.canSendBinary) {
                                for (r = new Uint8Array(n.length), i = 0; i < n.length; i++) r[i] = n.charCodeAt(i) & 255;
                                s.send(r.buffer)
                            }
                        }
                        function g(u) {
                            var it = 0,
                            nt = "----pluploadboundary" + r.guid(),
                            g,
                            tt = "--",
                            c = "\r\n",
                            l = "";
                            if (s = new XMLHttpRequest, s.upload && (s.upload.onprogress = function(n) {
                                i.loaded = Math.min(i.size, e + n.loaded - it);
                                t.trigger("UploadProgress", i)
                            }), s.onreadystatechange = function() {
                                var n, h;
                                if (s.readyState == 4 && t.state !== r.STOPPED) {
                                    try {
                                        n = s.status
                                    } catch(c) {
                                        n = 0
                                    }
                                    if (n >= 400) t.trigger("Error", {
                                        code: r.HTTP_ERROR,
                                        message: r.translate("HTTP Error."),
                                        file: i,
                                        status: n
                                    });
                                    else {
                                        if (p) {
                                            if (h = {
                                                chunk: f,
                                                chunks: p,
                                                response: s.responseText,
                                                status: n
                                            },
                                            t.trigger("ChunkUploaded", i, h), e += w, h.cancelled) {
                                                i.status = r.FAILED;
                                                return
                                            }
                                            i.loaded = Math.min(i.size, (f + 1) * a)
                                        } else i.loaded = i.size;
                                        t.trigger("UploadProgress", i);
                                        u = y = g = l = null; ! p || ++f >= p ? (i.status = r.DONE, t.trigger("FileUploaded", i, {
                                            response: s.responseText,
                                            status: n
                                        })) : o()
                                    }
                                }
                            },
                            t.settings.multipart && h.multipart) {
                                if (v.name = i.target_name || i.name, s.open("post", b, !0), r.each(t.settings.headers,
                                function(n, t) {
                                    s.setRequestHeader(t, n)
                                }), typeof u != "string" && !!n.FormData) {
                                    g = new FormData;
                                    r.each(r.extend(v, t.settings.multipart_params),
                                    function(n, t) {
                                        g.append(t, n)
                                    });
                                    g.append(t.settings.file_data_name, u);
                                    s.send(g);
                                    return
                                }
                                if (typeof u == "string") {
                                    s.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + nt);
                                    r.each(r.extend(v, t.settings.multipart_params),
                                    function(n, t) {
                                        l += tt + nt + c + 'Content-Disposition: form-data; name="' + t + '"' + c + c;
                                        l += unescape(encodeURIComponent(n)) + c
                                    });
                                    k = r.mimeTypes[i.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream";
                                    l += tt + nt + c + 'Content-Disposition: form-data; name="' + t.settings.file_data_name + '"; filename="' + unescape(encodeURIComponent(i.name)) + '"' + c + "Content-Type: " + k + c + c + u + c + tt + nt + tt + c;
                                    it = l.length - u.length;
                                    u = l;
                                    d(u);
                                    return
                                }
                            }
                            b = r.buildUrl(t.settings.url, r.extend(v, t.settings.multipart_params));
                            s.open("post", b, !0);
                            s.setRequestHeader("Content-Type", "application/octet-stream");
                            r.each(t.settings.headers,
                            function(n, t) {
                                s.setRequestHeader(t, n)
                            });
                            typeof u == "string" ? d(u) : s.send(u)
                        }
                        var y, p, v, a, w, k, b = t.settings.url;
                        i.status != r.DONE && i.status != r.FAILED && t.state != r.STOPPED && (v = {
                            name: i.target_name || i.name
                        },
                        c.chunk_size && i.size > c.chunk_size && (h.chunks || typeof u == "string") ? (a = c.chunk_size, p = Math.ceil(i.size / a), w = Math.min(a, i.size - f * a), y = typeof u == "string" ? u.substring(f * a, f * a + w) : l(u, f * a, f * a + w), v.chunk = f, v.chunks = p) : (w = i.size, y = u), t.settings.multipart && h.multipart && typeof y != "string" && n.FileReader && h.cantSendBlobInFormData && h.chunks && t.settings.chunk_size ?
                        function() {
                            var n = new FileReader;
                            n.onload = function() {
                                g(n.result);
                                n = null
                            };
                            n.readAsBinaryString(y)
                        } () : g(y))
                    }
                    var f = 0,
                    e = 0;
                    o()
                }
                var c = t.settings,
                u;
                u = f[i.id];
                h.jpgresize && t.settings.resize && /\.(png|jpg|jpeg)$/i.test(i.name) ? y.call(t, i, t.settings.resize, /\.png$/i.test(i.name) ? "image/png": "image/jpeg",
                function(n) {
                    n.success ? (i.size = n.data.length, e(n.data)) : h.chunks ? e(u) : o(u, e)
                }) : !h.chunks && h.jpgresize ? o(u, e) : e(u)
            });
            i.bind("Destroy",
            function(n) {
                var f, i, e = t.body,
                u = {
                    inputContainer: n.id + "_html5_container",
                    inputFile: n.id + "_html5",
                    browseButton: n.settings.browse_button,
                    dropElm: n.settings.drop_element
                };
                for (f in u) i = t.getElementById(u[f]),
                i && r.removeAllEvents(i, n.id);
                r.removeAllEvents(t.body, n.id);
                n.settings.container && (e = t.getElementById(n.settings.container));
                e.removeChild(t.getElementById(u.inputContainer))
            });
            u({
                success: !0
            })
        }
    })
})(window, document, plupload); (function(n, t, i, r) {
    function f(n) {
        var t, e = typeof n,
        o, i, u;
        if (n === r || n === null) return "null";
        if (e === "string") return t = "\bb\tt\nn\ff\rr\"\"''\\\\",
        '"' + n.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g,
        function(n, i) {
            var r = t.indexOf(i);
            return r + 1 ? "\\" + t.charAt(r + 1) : (n = i.charCodeAt().toString(16), "\\u" + "0000".substring(n.length) + n)
        }) + '"';
        if (e == "object") {
            if (o = n.length !== r, t = "", o) {
                for (i = 0; i < n.length; i++) t && (t += ","),
                t += f(n[i]);
                t = "[" + t + "]"
            } else {
                for (u in n) n.hasOwnProperty(u) && (t && (t += ","), t += f(u) + ":" + f(n[u]));
                t = "{" + t + "}"
            }
            return t
        }
        return "" + n
    }
    function o(n) {
        var r = !1,
        o = null,
        u, t, i, f, s, e = 0,
        h;
        try {
            try {
                o = new ActiveXObject("AgControl.AgControl");
                o.IsVersionSupported(n) && (r = !0);
                o = null
            } catch(c) {
                if (h = navigator.plugins["Silverlight Plug-In"], h) {
                    for (u = h.description, u === "1.0.30226.2" && (u = "2.0.30226.2"), t = u.split("."); t.length > 3;) t.pop();
                    while (t.length < 4) t.push(0);
                    for (i = n.split("."); i.length > 4;) i.pop();
                    do f = parseInt(i[e], 10),
                    s = parseInt(t[e], 10),
                    e++;
                    while (e < i.length && f === s);
                    f <= s && !isNaN(f) && (r = !0)
                }
            }
        } catch(l) {
            r = !1
        }
        return r
    }
    var e = {},
    u = {};
    i.silverlight = {
        trigger: function(n, t) {
            var r = e[n],
            u;
            r && (u = i.toArray(arguments).slice(1), u[0] = "Silverlight:" + t, setTimeout(function() {
                r.trigger.apply(r, u)
            },
            0))
        }
    };
    i.runtimes.Silverlight = i.addRuntime("silverlight", {
        getFeatures: function() {
            return {
                jpgresize: !0,
                pngresize: !0,
                chunks: !0,
                progress: !0,
                multipart: !0,
                multi_selection: !0
            }
        },
        init: function(r, s) {
            function l() {
                return t.getElementById(r.id + "_silverlight").content.Upload
            }
            var h, v = "",
            y = r.settings.filters,
            c, a = t.body;
            if (!o("2.0.31005.0") || n.opera && n.opera.buildNumber) {
                s({
                    success: !1
                });
                return
            }
            for (u[r.id] = !1, e[r.id] = r, h = t.createElement("div"), h.id = r.id + "_silverlight_container", i.extend(h.style, {
                position: "absolute",
                top: "0px",
                background: r.settings.shim_bgcolor || "transparent",
                zIndex: 99999,
                width: "100px",
                height: "100px",
                overflow: "hidden",
                opacity: r.settings.shim_bgcolor || t.documentMode > 8 ? "": .01
            }), h.className = "plupload silverlight", r.settings.container && (a = t.getElementById(r.settings.container), i.getStyle(a, "position") === "static" && (a.style.position = "relative")), a.appendChild(h), c = 0; c < y.length; c++) v += (v != "" ? "|": "") + y[c].title + " | *." + y[c].extensions.replace(/,/g, ";*.");
            h.innerHTML = '<object id="' + r.id + '_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="' + r.settings.silverlight_xap_url + '"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="id=' + r.id + ",filter=" + v + ",multiselect=" + r.settings.multi_selection + '"/><\/object>';
            r.bind("Silverlight:Init",
            function() {
                var o, n = {};
                u[r.id] || (u[r.id] = !0, r.bind("Silverlight:StartSelectFiles",
                function() {
                    o = []
                }), r.bind("Silverlight:SelectFile",
                function(t, r, u, f) {
                    var e;
                    e = i.guid();
                    n[e] = r;
                    n[r] = e;
                    o.push(new i.File(e, u, f))
                }), r.bind("Silverlight:SelectSuccessful",
                function() {
                    o.length && r.trigger("FilesAdded", o)
                }), r.bind("Silverlight:UploadChunkError",
                function(t, u, f, e, o) {
                    r.trigger("Error", {
                        code: i.IO_ERROR,
                        message: "IO Error.",
                        details: o,
                        file: t.getFile(n[u])
                    })
                }), r.bind("Silverlight:UploadFileProgress",
                function(t, r, u, f) {
                    var e = t.getFile(n[r]);
                    e.status != i.FAILED && (e.size = f, e.loaded = u, t.trigger("UploadProgress", e))
                }), r.bind("Refresh",
                function(n) {
                    var r, u, f;
                    r = t.getElementById(n.settings.browse_button);
                    r && (u = i.getPos(r, t.getElementById(n.settings.container)), f = i.getSize(r), i.extend(t.getElementById(n.id + "_silverlight_container").style, {
                        top: u.y + "px",
                        left: u.x + "px",
                        width: f.w + "px",
                        height: f.h + "px"
                    }))
                }), r.bind("Silverlight:UploadChunkSuccessful",
                function(t, r, u, f, e) {
                    var s, o = t.getFile(n[r]);
                    s = {
                        chunk: u,
                        chunks: f,
                        response: e
                    };
                    t.trigger("ChunkUploaded", o, s);
                    o.status != i.FAILED && t.state !== i.STOPPED && l().UploadNextChunk();
                    u == f - 1 && (o.status = i.DONE, t.trigger("FileUploaded", o, {
                        response: e
                    }))
                }), r.bind("Silverlight:UploadSuccessful",
                function(t, r, u) {
                    var f = t.getFile(n[r]);
                    f.status = i.DONE;
                    t.trigger("FileUploaded", f, {
                        response: u
                    })
                }), r.bind("FilesRemoved",
                function(t, i) {
                    for (var r = 0; r < i.length; r++) l().RemoveFile(n[i[r].id])
                }), r.bind("UploadFile",
                function(t, r) {
                    var u = t.settings,
                    e = u.resize || {};
                    l().UploadFile(n[r.id], t.settings.url, f({
                        name: r.target_name || r.name,
                        mime: i.mimeTypes[r.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream",
                        chunk_size: u.chunk_size,
                        image_width: e.width,
                        image_height: e.height,
                        image_quality: e.quality,
                        multipart: !!u.multipart,
                        multipart_params: u.multipart_params || {},
                        file_data_name: u.file_data_name,
                        headers: u.headers
                    }))
                }), r.bind("CancelUpload",
                function() {
                    l().CancelUpload()
                }), r.bind("Silverlight:MouseEnter",
                function(n) {
                    var u, f;
                    u = t.getElementById(r.settings.browse_button);
                    f = n.settings.browse_button_hover;
                    u && f && i.addClass(u, f)
                }), r.bind("Silverlight:MouseLeave",
                function(n) {
                    var u, f;
                    u = t.getElementById(r.settings.browse_button);
                    f = n.settings.browse_button_hover;
                    u && f && i.removeClass(u, f)
                }), r.bind("Silverlight:MouseLeftButtonDown",
                function(n) {
                    var u, f;
                    u = t.getElementById(r.settings.browse_button);
                    f = n.settings.browse_button_active;
                    u && f && (i.addClass(u, f), i.addEvent(t.body, "mouseup",
                    function() {
                        i.removeClass(u, f)
                    }))
                }), r.bind("Sliverlight:StartSelectFiles",
                function(n) {
                    var u, f;
                    u = t.getElementById(r.settings.browse_button);
                    f = n.settings.browse_button_active;
                    u && f && i.removeClass(u, f)
                }), r.bind("DisableBrowse",
                function(n, t) {
                    l().DisableBrowse(t)
                }), r.bind("Destroy",
                function(n) {
                    var r;
                    i.removeAllEvents(t.body, n.id);
                    delete u[n.id];
                    delete e[n.id];
                    r = t.getElementById(n.id + "_silverlight_container");
                    r && r.parentNode.removeChild(r)
                }), s({
                    success: !0
                }))
            })
        }
    })
})(window, document, plupload); (function(n, t, i) {
    function f() {
        var n;
        try {
            n = navigator.plugins["Shockwave Flash"];
            n = n.description
        } catch(t) {
            try {
                n = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")
            } catch(i) {
                n = "0.0"
            }
        }
        return n = n.match(/\d+/g),
        parseFloat(n[0] + "." + n[1])
    }
    var u = {},
    r = {};
    i.flash = {
        trigger: function(n, t, i) {
            setTimeout(function() {
                var r = u[n];
                r && r.trigger("Flash:" + t, i)
            },
            0)
        }
    };
    i.runtimes.Flash = i.addRuntime("flash", {
        getFeatures: function() {
            return {
                jpgresize: !0,
                pngresize: !0,
                maxWidth: 8091,
                maxHeight: 8091,
                chunks: !0,
                progress: !0,
                multipart: !0,
                multi_selection: !0
            }
        },
        init: function(n, e) {
            function s() {
                return t.getElementById(n.id + "_flash")
            }
            function l() {
                if (a++>5e3) {
                    e({
                        success: !1
                    });
                    return
                }
                r[n.id] === !1 && setTimeout(l, 1)
            }
            var c, o, a = 0,
            h = t.body;
            if (f() < 10) {
                e({
                    success: !1
                });
                return
            }
            r[n.id] = !1;
            u[n.id] = n;
            c = t.getElementById(n.settings.browse_button);
            o = t.createElement("div");
            o.id = n.id + "_flash_container";
            i.extend(o.style, {
                position: "absolute",
                top: "0px",
                background: n.settings.shim_bgcolor || "transparent",
                zIndex: 99999,
                width: "100%",
                height: "100%"
            });
            o.className = "plupload flash";
            n.settings.container && (h = t.getElementById(n.settings.container), i.getStyle(h, "position") === "static" && (h.style.position = "relative"));
            h.appendChild(o),
            function() {
                var r, u;
                r = '<object id="' + n.id + '_flash" type="application/x-shockwave-flash" data="' + n.settings.flash_swf_url + '" ';
                i.ua.ie && (r += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ');
                r += 'width="100%" height="100%" style="outline:0"><param name="movie" value="' + n.settings.flash_swf_url + '" /><param name="flashvars" value="id=' + escape(n.id) + '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /><\/object>';
                i.ua.ie ? (u = t.createElement("div"), o.appendChild(u), u.outerHTML = r, u = null) : o.innerHTML = r
            } ();
            l();
            c = o = null;
            n.bind("Destroy",
            function(n) {
                var f;
                i.removeAllEvents(t.body, n.id);
                delete r[n.id];
                delete u[n.id];
                f = t.getElementById(n.id + "_flash_container");
                f && f.parentNode.removeChild(f)
            });
            n.bind("Flash:Init",
            function() {
                var u = {};
                try {
                    s().setFileFilters(n.settings.filters, n.settings.multi_selection)
                } catch(f) {
                    e({
                        success: !1
                    });
                    return
                }
                r[n.id] || (r[n.id] = !0, n.bind("UploadFile",
                function(t, r) {
                    var f = t.settings,
                    e = n.settings.resize || {};
                    s().uploadFile(u[r.id], f.url, {
                        name: r.target_name || r.name,
                        mime: i.mimeTypes[r.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream",
                        chunk_size: f.chunk_size,
                        width: e.width,
                        height: e.height,
                        quality: e.quality,
                        multipart: f.multipart,
                        multipart_params: f.multipart_params || {},
                        file_data_name: f.file_data_name,
                        format: /\.(jpg|jpeg)$/i.test(r.name) ? "jpg": "png",
                        headers: f.headers,
                        urlstream_upload: f.urlstream_upload
                    })
                }), n.bind("CancelUpload",
                function() {
                    s().cancelUpload()
                }), n.bind("Flash:UploadProcess",
                function(n, t) {
                    var r = n.getFile(u[t.id]);
                    r.status != i.FAILED && (r.loaded = t.loaded, r.size = t.size, n.trigger("UploadProgress", r))
                }), n.bind("Flash:UploadChunkComplete",
                function(n, t) {
                    var f, r = n.getFile(u[t.id]);
                    f = {
                        chunk: t.chunk,
                        chunks: t.chunks,
                        response: t.text
                    };
                    n.trigger("ChunkUploaded", r, f);
                    r.status !== i.FAILED && n.state !== i.STOPPED && s().uploadNextChunk();
                    t.chunk == t.chunks - 1 && (r.status = i.DONE, n.trigger("FileUploaded", r, {
                        response: t.text
                    }))
                }), n.bind("Flash:SelectFiles",
                function(t, r) {
                    for (var f, s = [], o, e = 0; e < r.length; e++) f = r[e],
                    o = i.guid(),
                    u[o] = f.id,
                    u[f.id] = o,
                    s.push(new i.File(o, f.name, f.size));
                    s.length && n.trigger("FilesAdded", s)
                }), n.bind("Flash:SecurityError",
                function(t, r) {
                    n.trigger("Error", {
                        code: i.SECURITY_ERROR,
                        message: i.translate("Security error."),
                        details: r.message,
                        file: n.getFile(u[r.id])
                    })
                }), n.bind("Flash:GenericError",
                function(t, r) {
                    n.trigger("Error", {
                        code: i.GENERIC_ERROR,
                        message: i.translate("Generic error."),
                        details: r.message,
                        file: n.getFile(u[r.id])
                    })
                }), n.bind("Flash:IOError",
                function(t, r) {
                    n.trigger("Error", {
                        code: i.IO_ERROR,
                        message: i.translate("IO error."),
                        details: r.message,
                        file: n.getFile(u[r.id])
                    })
                }), n.bind("Flash:ImageError",
                function(t, r) {
                    n.trigger("Error", {
                        code: parseInt(r.code, 10),
                        message: i.translate("Image error."),
                        file: n.getFile(u[r.id])
                    })
                }), n.bind("Flash:StageEvent:rollOver",
                function(r) {
                    var u, f;
                    u = t.getElementById(n.settings.browse_button);
                    f = r.settings.browse_button_hover;
                    u && f && i.addClass(u, f)
                }), n.bind("Flash:StageEvent:rollOut",
                function(r) {
                    var u, f;
                    u = t.getElementById(n.settings.browse_button);
                    f = r.settings.browse_button_hover;
                    u && f && i.removeClass(u, f)
                }), n.bind("Flash:StageEvent:mouseDown",
                function(r) {
                    var u, f;
                    u = t.getElementById(n.settings.browse_button);
                    f = r.settings.browse_button_active;
                    u && f && (i.addClass(u, f), i.addEvent(t.body, "mouseup",
                    function() {
                        i.removeClass(u, f)
                    },
                    r.id))
                }), n.bind("Flash:StageEvent:mouseUp",
                function(r) {
                    var u, f;
                    u = t.getElementById(n.settings.browse_button);
                    f = r.settings.browse_button_active;
                    u && f && i.removeClass(u, f)
                }), n.bind("Flash:ExifData",
                function(t, i) {
                    n.trigger("ExifData", n.getFile(u[i.id]), i.data)
                }), n.bind("Flash:GpsData",
                function(t, i) {
                    n.trigger("GpsData", n.getFile(u[i.id]), i.data)
                }), n.bind("QueueChanged",
                function() {
                    n.refresh()
                }), n.bind("FilesRemoved",
                function(n, t) {
                    for (var i = 0; i < t.length; i++) s().removeFile(u[t[i].id])
                }), n.bind("StateChanged",
                function() {
                    n.refresh()
                }), n.bind("Refresh",
                function(r) {
                    var u, f, e;
                    s().setFileFilters(n.settings.filters, n.settings.multi_selection);
                    u = t.getElementById(r.settings.browse_button);
                    u && (f = i.getPos(u, t.getElementById(r.settings.container)), e = i.getSize(u), i.extend(t.getElementById(r.id + "_flash_container").style, {
                        top: f.y + "px",
                        left: f.x + "px",
                        width: e.w + "px",
                        height: e.h + "px"
                    }))
                }), n.bind("DisableBrowse",
                function(n, t) {
                    s().disableBrowse(t)
                }), e({
                    success: !0
                }))
            })
        }
    })
})(window, document, plupload); (function(n, t, i) {
    function r(n) {
        return t.getElementById(n)
    }
    i.runtimes.Html4 = i.addRuntime("html4", {
        getFeatures: function() {
            return {
                multipart: !0,
                triggerDialog: i.ua.gecko && n.FormData || i.ua.webkit
            }
        },
        init: function(u, f) {
            u.bind("Init",
            function(f) {
                function b() {
                    var o, n, s, l;
                    e = i.guid();
                    p.push(e);
                    o = t.createElement("form");
                    o.setAttribute("id", "form_" + e);
                    o.setAttribute("method", "post");
                    o.setAttribute("enctype", "multipart/form-data");
                    o.setAttribute("encoding", "multipart/form-data");
                    o.setAttribute("target", f.id + "_iframe");
                    o.style.position = "absolute";
                    o.style.margin = "0px";
                    o.style.padding = "0px";
                    n = t.createElement("input");
                    n.setAttribute("id", "input_" + e);
                    n.setAttribute("type", "file");
                    n.setAttribute("accept", h);
                    n.setAttribute("size", 1);
                    n.style.margin = "0px";
                    n.style.padding = "0px";
                    n.style.border = "0px";
                    l = r(f.settings.browse_button);
                    f.features.triggerDialog && l && i.addEvent(r(f.settings.browse_button), "click",
                    function(t) {
                        n.disabled || n.click();
                        t.preventDefault()
                    },
                    f.id);
                    i.extend(n.style, {
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        fontSize: "99px",
                        cursor: "pointer"
                    });
                    i.extend(o.style, {
                        overflow: "hidden"
                    });
                    s = f.settings.shim_bgcolor;
                    s && (o.style.background = s);
                    d && i.extend(n.style, {
                        filter: "alpha(opacity=0)"
                    });
                    i.addEvent(n, "change",
                    function(t) {
                        var c = t.target,
                        s, h = [];
                        c.value && (r("form_" + e).style.top = "-1048575px", s = c.value.replace(/\\/g, "/"), s = s.substring(s.length, s.lastIndexOf("/") + 1), h.push(new i.File(e, s)), f.features.triggerDialog ? i.removeEvent(l, "click", f.id) : i.removeAllEvents(o, f.id), i.removeEvent(n, "change", f.id), b(), h.length && u.trigger("FilesAdded", h))
                    },
                    f.id);
                    o.appendChild(n);
                    c.appendChild(o);
                    f.refresh()
                }
                function g() {
                    var r = t.createElement("div");
                    r.innerHTML = '<iframe id="' + f.id + '_iframe" name="' + f.id + '_iframe" src="' + k + ':&quot;&quot;" style="display:none"><\/iframe>';
                    s = r.firstChild;
                    c.appendChild(s);
                    i.addEvent(s, "load",
                    function(t) {
                        var r = t.target,
                        u, e;
                        if (o) {
                            try {
                                u = r.contentWindow.document || r.contentDocument || n.frames[r.id].document
                            } catch(s) {
                                f.trigger("Error", {
                                    code: i.SECURITY_ERROR,
                                    message: i.translate("Security error."),
                                    file: o
                                });
                                return
                            }
                            e = u.documentElement.innerText || u.documentElement.textContent;
                            e && (o.status = i.DONE, o.loaded = 1025, o.percent = 100, f.trigger("UploadProgress", o), f.trigger("FileUploaded", o, {
                                response: e
                            }))
                        }
                    },
                    f.id)
                }
                var c = t.body,
                s, k = "javascript",
                o, e, p = [],
                d = /MSIE/.test(navigator.userAgent),
                h = [],
                w = f.settings.filters,
                a,
                v,
                y,
                l;
                n: for (a = 0; a < w.length; a++) for (v = w[a].extensions.split(/,/), l = 0; l < v.length; l++) {
                    if (v[l] === "*") {
                        h = [];
                        break n
                    }
                    y = i.mimeTypes[v[l]];
                    y && i.inArray(y, h) === -1 && h.push(y)
                }
                h = h.join(",");
                f.settings.container && (c = r(f.settings.container), i.getStyle(c, "position") === "static" && (c.style.position = "relative"));
                f.bind("UploadFile",
                function(n, u) {
                    var f, s;
                    u.status != i.DONE && u.status != i.FAILED && n.state != i.STOPPED && (f = r("form_" + u.id), s = r("input_" + u.id), s.setAttribute("name", n.settings.file_data_name), n.ex.sendMultipartParamsAsQuerystring ? f.setAttribute("action", i.buildUrl(n.settings.url, i.extend({
                        name: u.target_name || u.name
                    },
                    n.settings.multipart_params))) : (f.setAttribute("action", n.settings.url), i.each(i.extend({
                        name: u.target_name || u.name
                    },
                    n.settings.multipart_params),
                    function(n, r) {
                        var u = t.createElement("input");
                        i.extend(u, {
                            type: "hidden",
                            name: r,
                            value: n
                        });
                        f.insertBefore(u, f.firstChild)
                    })), o = u, r("form_" + e).style.top = "-1048575px", f.submit())
                });
                f.bind("FileUploaded",
                function(n) {
                    n.refresh()
                });
                f.bind("StateChanged",
                function(t) {
                    t.state == i.STARTED ? g() : t.state == i.STOPPED && n.setTimeout(function() {
                        i.removeEvent(s, "load", t.id);
                        s.parentNode && s.parentNode.removeChild(s)
                    },
                    0);
                    i.each(t.files,
                    function(n) {
                        if (n.status === i.DONE || n.status === i.FAILED) {
                            var t = r("form_" + n.id);
                            t && t.parentNode.removeChild(t)
                        }
                    })
                });
                f.bind("Refresh",
                function(n) {
                    var u, o, s, h, l, a, c, v, f;
                    u = r(n.settings.browse_button);
                    u && (l = i.getPos(u, r(n.settings.container)), a = i.getSize(u), c = r("form_" + e), v = r("input_" + e), i.extend(c.style, {
                        top: l.y + "px",
                        left: l.x + "px",
                        width: a.w + "px",
                        height: a.h + "px"
                    }), n.features.triggerDialog && (i.getStyle(u, "position") === "static" && i.extend(u.style, {
                        position: "relative"
                    }), f = parseInt(u.style.zIndex, 10), isNaN(f) && (f = 0), i.extend(u.style, {
                        zIndex: f
                    }), i.extend(c.style, {
                        zIndex: f - 1
                    })), s = n.settings.browse_button_hover, h = n.settings.browse_button_active, o = n.features.triggerDialog ? u: c, s && (i.addEvent(o, "mouseover",
                    function() {
                        i.addClass(u, s)
                    },
                    n.id), i.addEvent(o, "mouseout",
                    function() {
                        i.removeClass(u, s)
                    },
                    n.id)), h && (i.addEvent(o, "mousedown",
                    function() {
                        i.addClass(u, h)
                    },
                    n.id), i.addEvent(t.body, "mouseup",
                    function() {
                        i.removeClass(u, h)
                    },
                    n.id)))
                });
                u.bind("FilesRemoved",
                function(n, t) {
                    for (var u, i = 0; i < t.length; i++) u = r("form_" + t[i].id),
                    u && u.parentNode.removeChild(u)
                });
                u.bind("DisableBrowse",
                function(n, i) {
                    var r = t.getElementById("input_" + e);
                    r && (r.disabled = i)
                });
                u.bind("Destroy",
                function(n) {
                    var o, f, u, s = {
                        inputContainer: "form_" + e,
                        inputFile: "input_" + e,
                        browseButton: n.settings.browse_button
                    };
                    for (o in s) f = r(s[o]),
                    f && i.removeAllEvents(f, n.id);
                    i.removeAllEvents(t.body, n.id);
                    i.each(p,
                    function(n) {
                        u = r("form_" + n);
                        u && u.parentNode.removeChild(u)
                    })
                });
                b()
            });
            f({
                success: !0
            })
        }
    })
})(window, document, plupload);


