


var controlsToRender = controlsToRender || [];

Ext.onReady(function() {
    for (var t, n = 0; n < controlsToRender.length; n++) 
		t = Ext.create(controlsToRender[n]),
		t.renderDynamic(),
		window[t.id] = t
});





Ext.define("GleamTech.FileUltimate.FolderViewModel", {
    extend: "GleamTech.FileUltimate.FolderItemModel",
    fields: [{
        name: "size"
    },
    {
        name: "type"
    },
    {
        name: "lastModifiedTime",
        type: "date",
        dateFormat: "c"
    }]
});
GleamTech.FileUltimate.FileManagerItemType = {
    RootFolder: 1,
    Folder: 2,
    File: 3
};
GleamTech.FileUltimate.FileManagerPermissionTypes = {
    ListSubfolders: 1,
    ListFiles: 2,
    Create: 4,
    Delete: 8,
    Rename: 16,
    Edit: 32,
    Upload: 64,
    Download: 128,
    Compress: 256,
    Extract: 512,
    Cut: 1024,
    Copy: 2048,
    Paste: 4096
};
GleamTech.FileUltimate.FileManagerChooserType = {
    File: 1,
    Folder: 2,
    FileOrFolder: 3
};
GleamTech.FileUltimate.FileManagerDownloadMethod = {
    OpenInBrowser: 1,
    DownloadAsZip: 2
};
GleamTech.FileUltimate.FileManagerClipboardAction = {
    Copy: 1,
    Cut: 2
};
typeof Crypto != "undefined" && Crypto.util ||
function() {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    r = window.Crypto = {},
    i = r.util = {
        rotl: function(n, t) {
            return n << t | n >>> 32 - t
        },
        rotr: function(n, t) {
            return n << 32 - t | n >>> t
        },
        endian: function(n) {
            if (n.constructor == Number) return i.rotl(n, 8) & 16711935 | i.rotl(n, 24) & 4278255360;
            for (var t = 0; t < n.length; t++) n[t] = i.endian(n[t]);
            return n
        },
        randomBytes: function(n) {
            for (var t = []; n > 0; n--) t.push(Math.floor(Math.random() * 256));
            return t
        },
        bytesToWords: function(n) {
            for (var r = [], t = 0, i = 0; t < n.length; t++, i += 8) r[i >>> 5] |= n[t] << 24 - i % 32;
            return r
        },
        wordsToBytes: function(n) {
            for (var i = [], t = 0; t < n.length * 32; t += 8) i.push(n[t >>> 5] >>> 24 - t % 32 & 255);
            return i
        },
        bytesToHex: function(n) {
            for (var i = [], t = 0; t < n.length; t++) i.push((n[t] >>> 4).toString(16)),
            i.push((n[t] & 15).toString(16));
            return i.join("")
        },
        hexToBytes: function(n) {
            for (var i = [], t = 0; t < n.length; t += 2) i.push(parseInt(n.substr(t, 2), 16));
            return i
        },
        bytesToBase64: function(i) {
            var f, r, e, u;
            if (typeof btoa == "function") return btoa(n.bytesToString(i));
            for (f = [], r = 0; r < i.length; r += 3) for (e = i[r] << 16 | i[r + 1] << 8 | i[r + 2], u = 0; u < 4; u++) r * 8 + u * 6 <= i.length * 8 ? f.push(t.charAt(e >>> 6 * (3 - u) & 63)) : f.push("=");
            return f.join("")
        },
        base64ToBytes: function(i) {
            if (typeof atob == "function") return n.stringToBytes(atob(i));
            i = i.replace(/[^A-Z0-9+\/]/ig, "");
            for (var f = [], u = 0, r = 0; u < i.length; r = ++u % 4) r != 0 && f.push((t.indexOf(i.charAt(u - 1)) & Math.pow(2, -2 * r + 8) - 1) << r * 2 | t.indexOf(i.charAt(u)) >>> 6 - r * 2);
            return f
        }
    },
    u = r.charenc = {},
    f = u.UTF8 = {
        stringToBytes: function(t) {
            return n.stringToBytes(unescape(encodeURIComponent(t)))
        },
        bytesToString: function(t) {
            return decodeURIComponent(escape(n.bytesToString(t)))
        }
    },
    n = u.Binary = {
        stringToBytes: function(n) {
            for (var i = [], t = 0; t < n.length; t++) i.push(n.charCodeAt(t) & 255);
            return i
        },
        bytesToString: function(n) {
            for (var i = [], t = 0; t < n.length; t++) i.push(String.fromCharCode(n[t]));
            return i.join("")
        }
    }
} (); 


(function() {
    var i = Crypto,
    t = i.util,
    r = i.charenc,
    u = r.UTF8,
    f = r.Binary,
    n = i.MD5 = function(i, r) {
        var u = t.wordsToBytes(n._md5(i));
        return r && r.asBytes ? u: r && r.asString ? f.bytesToString(u) : t.bytesToHex(u)
    };
    n._md5 = function(i) {
        var s;
        i.constructor == String && (i = u.stringToBytes(i));
        var h = t.bytesToWords(i),
        y = i.length * 8,
        r = 1732584193,
        f = -271733879,
        e = -1732584194,
        o = 271733878;
        for (s = 0; s < h.length; s++) h[s] = (h[s] << 8 | h[s] >>> 24) & 16711935 | (h[s] << 24 | h[s] >>> 8) & 4278255360;
        h[y >>> 5] |= 128 << y % 32;
        h[(y + 64 >>> 9 << 4) + 14] = y;
        var c = n._ff,
        l = n._gg,
        a = n._hh,
        v = n._ii;
        for (s = 0; s < h.length; s += 16) {
            var p = r,
            w = f,
            b = e,
            k = o;
            r = c(r, f, e, o, h[s + 0], 7, -680876936);
            o = c(o, r, f, e, h[s + 1], 12, -389564586);
            e = c(e, o, r, f, h[s + 2], 17, 606105819);
            f = c(f, e, o, r, h[s + 3], 22, -1044525330);
            r = c(r, f, e, o, h[s + 4], 7, -176418897);
            o = c(o, r, f, e, h[s + 5], 12, 1200080426);
            e = c(e, o, r, f, h[s + 6], 17, -1473231341);
            f = c(f, e, o, r, h[s + 7], 22, -45705983);
            r = c(r, f, e, o, h[s + 8], 7, 1770035416);
            o = c(o, r, f, e, h[s + 9], 12, -1958414417);
            e = c(e, o, r, f, h[s + 10], 17, -42063);
            f = c(f, e, o, r, h[s + 11], 22, -1990404162);
            r = c(r, f, e, o, h[s + 12], 7, 1804603682);
            o = c(o, r, f, e, h[s + 13], 12, -40341101);
            e = c(e, o, r, f, h[s + 14], 17, -1502002290);
            f = c(f, e, o, r, h[s + 15], 22, 1236535329);
            r = l(r, f, e, o, h[s + 1], 5, -165796510);
            o = l(o, r, f, e, h[s + 6], 9, -1069501632);
            e = l(e, o, r, f, h[s + 11], 14, 643717713);
            f = l(f, e, o, r, h[s + 0], 20, -373897302);
            r = l(r, f, e, o, h[s + 5], 5, -701558691);
            o = l(o, r, f, e, h[s + 10], 9, 38016083);
            e = l(e, o, r, f, h[s + 15], 14, -660478335);
            f = l(f, e, o, r, h[s + 4], 20, -405537848);
            r = l(r, f, e, o, h[s + 9], 5, 568446438);
            o = l(o, r, f, e, h[s + 14], 9, -1019803690);
            e = l(e, o, r, f, h[s + 3], 14, -187363961);
            f = l(f, e, o, r, h[s + 8], 20, 1163531501);
            r = l(r, f, e, o, h[s + 13], 5, -1444681467);
            o = l(o, r, f, e, h[s + 2], 9, -51403784);
            e = l(e, o, r, f, h[s + 7], 14, 1735328473);
            f = l(f, e, o, r, h[s + 12], 20, -1926607734);
            r = a(r, f, e, o, h[s + 5], 4, -378558);
            o = a(o, r, f, e, h[s + 8], 11, -2022574463);
            e = a(e, o, r, f, h[s + 11], 16, 1839030562);
            f = a(f, e, o, r, h[s + 14], 23, -35309556);
            r = a(r, f, e, o, h[s + 1], 4, -1530992060);
            o = a(o, r, f, e, h[s + 4], 11, 1272893353);
            e = a(e, o, r, f, h[s + 7], 16, -155497632);
            f = a(f, e, o, r, h[s + 10], 23, -1094730640);
            r = a(r, f, e, o, h[s + 13], 4, 681279174);
            o = a(o, r, f, e, h[s + 0], 11, -358537222);
            e = a(e, o, r, f, h[s + 3], 16, -722521979);
            f = a(f, e, o, r, h[s + 6], 23, 76029189);
            r = a(r, f, e, o, h[s + 9], 4, -640364487);
            o = a(o, r, f, e, h[s + 12], 11, -421815835);
            e = a(e, o, r, f, h[s + 15], 16, 530742520);
            f = a(f, e, o, r, h[s + 2], 23, -995338651);
            r = v(r, f, e, o, h[s + 0], 6, -198630844);
            o = v(o, r, f, e, h[s + 7], 10, 1126891415);
            e = v(e, o, r, f, h[s + 14], 15, -1416354905);
            f = v(f, e, o, r, h[s + 5], 21, -57434055);
            r = v(r, f, e, o, h[s + 12], 6, 1700485571);
            o = v(o, r, f, e, h[s + 3], 10, -1894986606);
            e = v(e, o, r, f, h[s + 10], 15, -1051523);
            f = v(f, e, o, r, h[s + 1], 21, -2054922799);
            r = v(r, f, e, o, h[s + 8], 6, 1873313359);
            o = v(o, r, f, e, h[s + 15], 10, -30611744);
            e = v(e, o, r, f, h[s + 6], 15, -1560198380);
            f = v(f, e, o, r, h[s + 13], 21, 1309151649);
            r = v(r, f, e, o, h[s + 4], 6, -145523070);
            o = v(o, r, f, e, h[s + 11], 10, -1120210379);
            e = v(e, o, r, f, h[s + 2], 15, 718787259);
            f = v(f, e, o, r, h[s + 9], 21, -343485551);
            r = r + p >>> 0;
            f = f + w >>> 0;
            e = e + b >>> 0;
            o = o + k >>> 0
        }
        return t.endian([r, f, e, o])
    };
    n._ff = function(n, t, i, r, u, f, e) {
        var o = n + (t & i | ~t & r) + (u >>> 0) + e;
        return (o << f | o >>> 32 - f) + t
    };
    n._gg = function(n, t, i, r, u, f, e) {
        var o = n + (t & r | i & ~r) + (u >>> 0) + e;
        return (o << f | o >>> 32 - f) + t
    };
    n._hh = function(n, t, i, r, u, f, e) {
        var o = n + (t ^ i ^ r) + (u >>> 0) + e;
        return (o << f | o >>> 32 - f) + t
    };
    n._ii = function(n, t, i, r, u, f, e) {
        var o = n + (i ^ (t | ~r)) + (u >>> 0) + e;
        return (o << f | o >>> 32 - f) + t
    };
    n._blocksize = 16;
    n._digestsize = 16
})();


this.JSON || (this.JSON = {}),
function() {
    "use strict";
    function i(n) {
        return n < 10 ? "0" + n: n
    }
    function e(n) {
        return f.lastIndex = 0,
        f.test(n) ? '"' + n.replace(f,
        function(n) {
            var t = o[n];
            return typeof t == "string" ? t: "\\u" + ("0000" + n.charCodeAt(0).toString(16)).slice( - 4)
        }) + '"': '"' + n + '"'
    }
    function u(i, f) {
        var c, l, s, a, v = n,
        h, o = f[i];
        o && typeof o == "object" && typeof o.toJSON == "function" && (o = o.toJSON(i));
        typeof t == "function" && (o = t.call(f, i, o));
        switch (typeof o) {
        case "string":
            return e(o);
        case "number":
            return isFinite(o) ? String(o) : "null";
        case "boolean":
        case "null":
            return String(o);
        case "object":
            if (!o) return "null";
            if (n += r, h = [], Object.prototype.toString.apply(o) === "[object Array]") {
                for (a = o.length, c = 0; c < a; c += 1) h[c] = u(c, o) || "null";
                return s = h.length === 0 ? "[]": n ? "[\n" + n + h.join(",\n" + n) + "\n" + v + "]": "[" + h.join(",") + "]",
                n = v,
                s
            }
            if (t && typeof t == "object") for (a = t.length, c = 0; c < a; c += 1) l = t[c],
            typeof l == "string" && (s = u(l, o), s && h.push(e(l) + (n ? ": ": ":") + s));
            else for (l in o) Object.hasOwnProperty.call(o, l) && (s = u(l, o), s && h.push(e(l) + (n ? ": ": ":") + s));
            return s = h.length === 0 ? "{}": n ? "{\n" + n + h.join(",\n" + n) + "\n" + v + "}": "{" + h.join(",") + "}",
            n = v,
            s
        }
    }
    typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function() {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + i(this.getUTCMonth() + 1) + "-" + i(this.getUTCDate()) + "T" + i(this.getUTCHours()) + ":" + i(this.getUTCMinutes()) + ":" + i(this.getUTCSeconds()) + "Z": null
    },
    String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function() {
        return this.valueOf()
    });
    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    f = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
    n, r, o = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
    },
    t;
    typeof JSON.stringify != "function" && (JSON.stringify = function(i, f, e) {
        var o;
        if (n = "", r = "", typeof e == "number") for (o = 0; o < e; o += 1) r += " ";
        else typeof e == "string" && (r = e);
        if (t = f, f && typeof f != "function" && (typeof f != "object" || typeof f.length != "number")) throw new Error("JSON.stringify");
        return u("", {
            "": i
        })
    });
    typeof JSON.parse != "function" && (JSON.parse = function(text, reviver) {
        function walk(n, t) {
            var r, u, i = n[t];
            if (i && typeof i == "object") for (r in i) Object.hasOwnProperty.call(i, r) && (u = walk(i, r), u !== undefined ? i[r] = u: delete i[r]);
            return reviver.call(n, t, i)
        }
        var j;
        if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx,
        function(n) {
            return "\\u" + ("0000" + n.charCodeAt(0).toString(16)).slice( - 4)
        })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"),
        typeof reviver == "function" ? walk({
            "": j
        },
        "") : j;
        throw new SyntaxError("JSON.parse");
    })
} ();



GleamTech.FileUltimate.FileIconManager.baseFileIcons = {
    "file": {
        "16": "basefileicons16 icon-file",
        "32": "basefileicons32 icon-file",
        "48": "basefileicons48 icon-file",
        "96": "basefileicons96-icon-file",
        "256": "basefileicons256-icon-file"
    },
    "folder": {
        "16": "basefileicons16 icon-folder",
        "32": "basefileicons32 icon-folder",
        "48": "basefileicons48 icon-folder",
        "96": "basefileicons96-icon-folder",
        "256": "basefileicons256-icon-folder"
    },
    "rootfolder": {
        "16": "basefileicons16 icon-rootfolder",
        "32": "basefileicons32 icon-rootfolder",
        "48": "basefileicons48 icon-rootfolder",
        "96": "basefileicons96-icon-rootfolder",
        "256": "basefileicons256-icon-rootfolder"
    }
};
GleamTech.FileUltimate.FileIconManager.fileIcons = {
    "7z": {
        "16": "fileicons-archive16 icon-7z",
        "32": "fileicons-archive32 icon-7z",
        "48": "fileicons-archive48 icon-7z",
        "96": "fileicons-archive96-icon-7z",
        "256": "fileicons-archive256-icon-7z"
    },
    "dmg": {
        "16": "fileicons-archive16 icon-dmg",
        "32": "fileicons-archive32 icon-dmg",
        "48": "fileicons-archive48 icon-dmg",
        "96": "fileicons-archive96-icon-dmg",
        "256": "fileicons-archive256-icon-dmg"
    },
    "iso": {
        "16": "fileicons-archive16 icon-iso",
        "32": "fileicons-archive32 icon-iso",
        "48": "fileicons-archive48 icon-iso",
        "96": "fileicons-archive96-icon-iso",
        "256": "fileicons-archive256-icon-iso"
    },
    "jar": {
        "16": "fileicons-archive16 icon-jar",
        "32": "fileicons-archive32 icon-jar",
        "48": "fileicons-archive48 icon-jar",
        "96": "fileicons-archive96-icon-jar",
        "256": "fileicons-archive256-icon-jar"
    },
    "pkg": {
        "16": "fileicons-archive16 icon-pkg",
        "32": "fileicons-archive32 icon-pkg",
        "48": "fileicons-archive48 icon-pkg",
        "96": "fileicons-archive96-icon-pkg",
        "256": "fileicons-archive256-icon-pkg"
    },
    "rar": {
        "16": "fileicons-archive16 icon-rar",
        "32": "fileicons-archive32 icon-rar",
        "48": "fileicons-archive48 icon-rar",
        "96": "fileicons-archive96-icon-rar",
        "256": "fileicons-archive256-icon-rar"
    },
    "sitx": {
        "16": "fileicons-archive16 icon-sitx",
        "32": "fileicons-archive32 icon-sitx",
        "48": "fileicons-archive48 icon-sitx",
        "96": "fileicons-archive96-icon-sitx",
        "256": "fileicons-archive256-icon-sitx"
    },
    "zip": {
        "16": "fileicons-archive16 icon-zip",
        "32": "fileicons-archive32 icon-zip",
        "48": "fileicons-archive48 icon-zip",
        "96": "fileicons-archive96-icon-zip",
        "256": "fileicons-archive256-icon-zip"
    },
    "bz2": {
        "16": "fileicons-archive16 icon-bz2",
        "32": "fileicons-archive32 icon-bz2",
        "48": "fileicons-archive48 icon-bz2",
        "96": "fileicons-archive96-icon-bz2",
        "256": "fileicons-archive256-icon-bz2"
    },
    "gz": {
        "16": "fileicons-archive16 icon-gz",
        "32": "fileicons-archive32 icon-gz",
        "48": "fileicons-archive48 icon-gz",
        "96": "fileicons-archive96-icon-gz",
        "256": "fileicons-archive256-icon-gz"
    },
    "tar": {
        "16": "fileicons-archive16 icon-tar",
        "32": "fileicons-archive32 icon-tar",
        "48": "fileicons-archive48 icon-tar",
        "96": "fileicons-archive96-icon-tar",
        "256": "fileicons-archive256-icon-tar"
    },
    "aif": {
        "16": "fileicons-audio16 icon-aif",
        "32": "fileicons-audio32 icon-aif",
        "48": "fileicons-audio48 icon-aif",
        "96": "fileicons-audio96-icon-aif",
        "256": "fileicons-audio256-icon-aif"
    },
    "m4a": {
        "16": "fileicons-audio16 icon-m4a",
        "32": "fileicons-audio32 icon-m4a",
        "48": "fileicons-audio48 icon-m4a",
        "96": "fileicons-audio96-icon-m4a",
        "256": "fileicons-audio256-icon-m4a"
    },
    "mp3": {
        "16": "fileicons-audio16 icon-mp3",
        "32": "fileicons-audio32 icon-mp3",
        "48": "fileicons-audio48 icon-mp3",
        "96": "fileicons-audio96-icon-mp3",
        "256": "fileicons-audio256-icon-mp3"
    },
    "wav": {
        "16": "fileicons-audio16 icon-wav",
        "32": "fileicons-audio32 icon-wav",
        "48": "fileicons-audio48 icon-wav",
        "96": "fileicons-audio96-icon-wav",
        "256": "fileicons-audio256-icon-wav"
    },
    "wma": {
        "16": "fileicons-audio16 icon-wma",
        "32": "fileicons-audio32 icon-wma",
        "48": "fileicons-audio48 icon-wma",
        "96": "fileicons-audio96-icon-wma",
        "256": "fileicons-audio256-icon-wma"
    },
    "3ds": {
        "16": "fileicons-creative16 icon-3ds",
        "32": "fileicons-creative32 icon-3ds",
        "48": "fileicons-creative48 icon-3ds",
        "96": "fileicons-creative96-icon-3ds",
        "256": "fileicons-creative256-icon-3ds"
    },
    "ai": {
        "16": "fileicons-creative16 icon-ai",
        "32": "fileicons-creative32 icon-ai",
        "48": "fileicons-creative48 icon-ai",
        "96": "fileicons-creative96-icon-ai",
        "256": "fileicons-creative256-icon-ai"
    },
    "as": {
        "16": "fileicons-creative16 icon-as",
        "32": "fileicons-creative32 icon-as",
        "48": "fileicons-creative48 icon-as",
        "96": "fileicons-creative96-icon-as",
        "256": "fileicons-creative256-icon-as"
    },
    "cdr": {
        "16": "fileicons-creative16 icon-cdr",
        "32": "fileicons-creative32 icon-cdr",
        "48": "fileicons-creative48 icon-cdr",
        "96": "fileicons-creative96-icon-cdr",
        "256": "fileicons-creative256-icon-cdr"
    },
    "dwg": {
        "16": "fileicons-creative16 icon-dwg",
        "32": "fileicons-creative32 icon-dwg",
        "48": "fileicons-creative48 icon-dwg",
        "96": "fileicons-creative96-icon-dwg",
        "256": "fileicons-creative256-icon-dwg"
    },
    "dxf": {
        "16": "fileicons-creative16 icon-dxf",
        "32": "fileicons-creative32 icon-dxf",
        "48": "fileicons-creative48 icon-dxf",
        "96": "fileicons-creative96-icon-dxf",
        "256": "fileicons-creative256-icon-dxf"
    },
    "eps": {
        "16": "fileicons-creative16 icon-eps",
        "32": "fileicons-creative32 icon-eps",
        "48": "fileicons-creative48 icon-eps",
        "96": "fileicons-creative96-icon-eps",
        "256": "fileicons-creative256-icon-eps"
    },
    "fla": {
        "16": "fileicons-creative16 icon-fla",
        "32": "fileicons-creative32 icon-fla",
        "48": "fileicons-creative48 icon-fla",
        "96": "fileicons-creative96-icon-fla",
        "256": "fileicons-creative256-icon-fla"
    },
    "indd": {
        "16": "fileicons-creative16 icon-indd",
        "32": "fileicons-creative32 icon-indd",
        "48": "fileicons-creative48 icon-indd",
        "96": "fileicons-creative96-icon-indd",
        "256": "fileicons-creative256-icon-indd"
    },
    "prproj": {
        "16": "fileicons-creative16 icon-prproj",
        "32": "fileicons-creative32 icon-prproj",
        "48": "fileicons-creative48 icon-prproj",
        "96": "fileicons-creative96-icon-prproj",
        "256": "fileicons-creative256-icon-prproj"
    },
    "psd": {
        "16": "fileicons-creative16 icon-psd",
        "32": "fileicons-creative32 icon-psd",
        "48": "fileicons-creative48 icon-psd",
        "96": "fileicons-creative96-icon-psd",
        "256": "fileicons-creative256-icon-psd"
    },
    "pspimage": {
        "16": "fileicons-creative16 icon-pspimage",
        "32": "fileicons-creative32 icon-pspimage",
        "48": "fileicons-creative48 icon-pspimage",
        "96": "fileicons-creative96-icon-pspimage",
        "256": "fileicons-creative256-icon-pspimage"
    },
    "c": {
        "16": "fileicons-developer16 icon-c",
        "32": "fileicons-developer32 icon-c",
        "48": "fileicons-developer48 icon-c",
        "96": "fileicons-developer96-icon-c",
        "256": "fileicons-developer256-icon-c"
    },
    "cpp": {
        "16": "fileicons-developer16 icon-cpp",
        "32": "fileicons-developer32 icon-cpp",
        "48": "fileicons-developer48 icon-cpp",
        "96": "fileicons-developer96-icon-cpp",
        "256": "fileicons-developer256-icon-cpp"
    },
    "cs": {
        "16": "fileicons-developer16 icon-cs",
        "32": "fileicons-developer32 icon-cs",
        "48": "fileicons-developer48 icon-cs",
        "96": "fileicons-developer96-icon-cs",
        "256": "fileicons-developer256-icon-cs"
    },
    "csproj": {
        "16": "fileicons-developer16 icon-csproj",
        "32": "fileicons-developer32 icon-csproj",
        "48": "fileicons-developer48 icon-csproj",
        "96": "fileicons-developer96-icon-csproj",
        "256": "fileicons-developer256-icon-csproj"
    },
    "dtd": {
        "16": "fileicons-developer16 icon-dtd",
        "32": "fileicons-developer32 icon-dtd",
        "48": "fileicons-developer48 icon-dtd",
        "96": "fileicons-developer96-icon-dtd",
        "256": "fileicons-developer256-icon-dtd"
    },
    "h": {
        "16": "fileicons-developer16 icon-h",
        "32": "fileicons-developer32 icon-h",
        "48": "fileicons-developer48 icon-h",
        "96": "fileicons-developer96-icon-h",
        "256": "fileicons-developer256-icon-h"
    },
    "ldf": {
        "16": "fileicons-developer16 icon-ldf",
        "32": "fileicons-developer32 icon-ldf",
        "48": "fileicons-developer48 icon-ldf",
        "96": "fileicons-developer96-icon-ldf",
        "256": "fileicons-developer256-icon-ldf"
    },
    "mdf": {
        "16": "fileicons-developer16 icon-mdf",
        "32": "fileicons-developer32 icon-mdf",
        "48": "fileicons-developer48 icon-mdf",
        "96": "fileicons-developer96-icon-mdf",
        "256": "fileicons-developer256-icon-mdf"
    },
    "pdb": {
        "16": "fileicons-developer16 icon-pdb",
        "32": "fileicons-developer32 icon-pdb",
        "48": "fileicons-developer48 icon-pdb",
        "96": "fileicons-developer96-icon-pdb",
        "256": "fileicons-developer256-icon-pdb"
    },
    "resx": {
        "16": "fileicons-developer16 icon-resx",
        "32": "fileicons-developer32 icon-resx",
        "48": "fileicons-developer48 icon-resx",
        "96": "fileicons-developer96-icon-resx",
        "256": "fileicons-developer256-icon-resx"
    },
    "sln": {
        "16": "fileicons-developer16 icon-sln",
        "32": "fileicons-developer32 icon-sln",
        "48": "fileicons-developer48 icon-sln",
        "96": "fileicons-developer96-icon-sln",
        "256": "fileicons-developer256-icon-sln"
    },
    "sql": {
        "16": "fileicons-developer16 icon-sql",
        "32": "fileicons-developer32 icon-sql",
        "48": "fileicons-developer48 icon-sql",
        "96": "fileicons-developer96-icon-sql",
        "256": "fileicons-developer256-icon-sql"
    },
    "suo": {
        "16": "fileicons-developer16 icon-suo",
        "32": "fileicons-developer32 icon-suo",
        "48": "fileicons-developer48 icon-suo",
        "96": "fileicons-developer96-icon-suo",
        "256": "fileicons-developer256-icon-suo"
    },
    "vb": {
        "16": "fileicons-developer16 icon-vb",
        "32": "fileicons-developer32 icon-vb",
        "48": "fileicons-developer48 icon-vb",
        "96": "fileicons-developer96-icon-vb",
        "256": "fileicons-developer256-icon-vb"
    },
    "vbproj": {
        "16": "fileicons-developer16 icon-vbproj",
        "32": "fileicons-developer32 icon-vbproj",
        "48": "fileicons-developer48 icon-vbproj",
        "96": "fileicons-developer96-icon-vbproj",
        "256": "fileicons-developer256-icon-vbproj"
    },
    "vcproj": {
        "16": "fileicons-developer16 icon-vcproj",
        "32": "fileicons-developer32 icon-vcproj",
        "48": "fileicons-developer48 icon-vcproj",
        "96": "fileicons-developer96-icon-vcproj",
        "256": "fileicons-developer256-icon-vcproj"
    },
    "vcxproj": {
        "16": "fileicons-developer16 icon-vcxproj",
        "32": "fileicons-developer32 icon-vcxproj",
        "48": "fileicons-developer48 icon-vcxproj",
        "96": "fileicons-developer96-icon-vcxproj",
        "256": "fileicons-developer256-icon-vcxproj"
    },
    "xaml": {
        "16": "fileicons-developer16 icon-xaml",
        "32": "fileicons-developer32 icon-xaml",
        "48": "fileicons-developer48 icon-xaml",
        "96": "fileicons-developer96-icon-xaml",
        "256": "fileicons-developer256-icon-xaml"
    },
    "xml": {
        "16": "fileicons-developer16 icon-xml",
        "32": "fileicons-developer32 icon-xml",
        "48": "fileicons-developer48 icon-xml",
        "96": "fileicons-developer96-icon-xml",
        "256": "fileicons-developer256-icon-xml"
    },
    "xsd": {
        "16": "fileicons-developer16 icon-xsd",
        "32": "fileicons-developer32 icon-xsd",
        "48": "fileicons-developer48 icon-xsd",
        "96": "fileicons-developer96-icon-xsd",
        "256": "fileicons-developer256-icon-xsd"
    },
    "xsl": {
        "16": "fileicons-developer16 icon-xsl",
        "32": "fileicons-developer32 icon-xsl",
        "48": "fileicons-developer48 icon-xsl",
        "96": "fileicons-developer96-icon-xsl",
        "256": "fileicons-developer256-icon-xsl"
    },
    "bmp": {
        "16": "fileicons-image16 icon-bmp",
        "32": "fileicons-image32 icon-bmp",
        "48": "fileicons-image48 icon-bmp",
        "96": "fileicons-image96-icon-bmp",
        "256": "fileicons-image256-icon-bmp"
    },
    "gif": {
        "16": "fileicons-image16 icon-gif",
        "32": "fileicons-image32 icon-gif",
        "48": "fileicons-image48 icon-gif",
        "96": "fileicons-image96-icon-gif",
        "256": "fileicons-image256-icon-gif"
    },
    "jpg": {
        "16": "fileicons-image16 icon-jpg",
        "32": "fileicons-image32 icon-jpg",
        "48": "fileicons-image48 icon-jpg",
        "96": "fileicons-image96-icon-jpg",
        "256": "fileicons-image256-icon-jpg"
    },
    "png": {
        "16": "fileicons-image16 icon-png",
        "32": "fileicons-image32 icon-png",
        "48": "fileicons-image48 icon-png",
        "96": "fileicons-image96-icon-png",
        "256": "fileicons-image256-icon-png"
    },
    "accdb": {
        "16": "fileicons-office16 icon-accdb",
        "32": "fileicons-office32 icon-accdb",
        "48": "fileicons-office48 icon-accdb",
        "96": "fileicons-office96-icon-accdb",
        "256": "fileicons-office256-icon-accdb"
    },
    "csv": {
        "16": "fileicons-office16 icon-csv",
        "32": "fileicons-office32 icon-csv",
        "48": "fileicons-office48 icon-csv",
        "96": "fileicons-office96-icon-csv",
        "256": "fileicons-office256-icon-csv"
    },
    "doc": {
        "16": "fileicons-office16 icon-doc",
        "32": "fileicons-office32 icon-doc",
        "48": "fileicons-office48 icon-doc",
        "96": "fileicons-office96-icon-doc",
        "256": "fileicons-office256-icon-doc"
    },
    "docx": {
        "16": "fileicons-office16 icon-docx",
        "32": "fileicons-office32 icon-docx",
        "48": "fileicons-office48 icon-docx",
        "96": "fileicons-office96-icon-docx",
        "256": "fileicons-office256-icon-docx"
    },
    "dot": {
        "16": "fileicons-office16 icon-dot",
        "32": "fileicons-office32 icon-dot",
        "48": "fileicons-office48 icon-dot",
        "96": "fileicons-office96-icon-dot",
        "256": "fileicons-office256-icon-dot"
    },
    "dotx": {
        "16": "fileicons-office16 icon-dotx",
        "32": "fileicons-office32 icon-dotx",
        "48": "fileicons-office48 icon-dotx",
        "96": "fileicons-office96-icon-dotx",
        "256": "fileicons-office256-icon-dotx"
    },
    "mdb": {
        "16": "fileicons-office16 icon-mdb",
        "32": "fileicons-office32 icon-mdb",
        "48": "fileicons-office48 icon-mdb",
        "96": "fileicons-office96-icon-mdb",
        "256": "fileicons-office256-icon-mdb"
    },
    "msg": {
        "16": "fileicons-office16 icon-msg",
        "32": "fileicons-office32 icon-msg",
        "48": "fileicons-office48 icon-msg",
        "96": "fileicons-office96-icon-msg",
        "256": "fileicons-office256-icon-msg"
    },
    "pdf": {
        "16": "fileicons-office16 icon-pdf",
        "32": "fileicons-office32 icon-pdf",
        "48": "fileicons-office48 icon-pdf",
        "96": "fileicons-office96-icon-pdf",
        "256": "fileicons-office256-icon-pdf"
    },
    "pps": {
        "16": "fileicons-office16 icon-pps",
        "32": "fileicons-office32 icon-pps",
        "48": "fileicons-office48 icon-pps",
        "96": "fileicons-office96-icon-pps",
        "256": "fileicons-office256-icon-pps"
    },
    "ppsx": {
        "16": "fileicons-office16 icon-ppsx",
        "32": "fileicons-office32 icon-ppsx",
        "48": "fileicons-office48 icon-ppsx",
        "96": "fileicons-office96-icon-ppsx",
        "256": "fileicons-office256-icon-ppsx"
    },
    "ppt": {
        "16": "fileicons-office16 icon-ppt",
        "32": "fileicons-office32 icon-ppt",
        "48": "fileicons-office48 icon-ppt",
        "96": "fileicons-office96-icon-ppt",
        "256": "fileicons-office256-icon-ppt"
    },
    "pptx": {
        "16": "fileicons-office16 icon-pptx",
        "32": "fileicons-office32 icon-pptx",
        "48": "fileicons-office48 icon-pptx",
        "96": "fileicons-office96-icon-pptx",
        "256": "fileicons-office256-icon-pptx"
    },
    "pst": {
        "16": "fileicons-office16 icon-pst",
        "32": "fileicons-office32 icon-pst",
        "48": "fileicons-office48 icon-pst",
        "96": "fileicons-office96-icon-pst",
        "256": "fileicons-office256-icon-pst"
    },
    "vcf": {
        "16": "fileicons-office16 icon-vcf",
        "32": "fileicons-office32 icon-vcf",
        "48": "fileicons-office48 icon-vcf",
        "96": "fileicons-office96-icon-vcf",
        "256": "fileicons-office256-icon-vcf"
    },
    "xls": {
        "16": "fileicons-office16 icon-xls",
        "32": "fileicons-office32 icon-xls",
        "48": "fileicons-office48 icon-xls",
        "96": "fileicons-office96-icon-xls",
        "256": "fileicons-office256-icon-xls"
    },
    "xlsx": {
        "16": "fileicons-office16 icon-xlsx",
        "32": "fileicons-office32 icon-xlsx",
        "48": "fileicons-office48 icon-xlsx",
        "96": "fileicons-office96-icon-xlsx",
        "256": "fileicons-office256-icon-xlsx"
    },
    "xlt": {
        "16": "fileicons-office16 icon-xlt",
        "32": "fileicons-office32 icon-xlt",
        "48": "fileicons-office48 icon-xlt",
        "96": "fileicons-office96-icon-xlt",
        "256": "fileicons-office256-icon-xlt"
    },
    "xltx": {
        "16": "fileicons-office16 icon-xltx",
        "32": "fileicons-office32 icon-xltx",
        "48": "fileicons-office48 icon-xltx",
        "96": "fileicons-office96-icon-xltx",
        "256": "fileicons-office256-icon-xltx"
    },
    "xps": {
        "16": "fileicons-office16 icon-xps",
        "32": "fileicons-office32 icon-xps",
        "48": "fileicons-office48 icon-xps",
        "96": "fileicons-office96-icon-xps",
        "256": "fileicons-office256-icon-xps"
    },
    "cab": {
        "16": "fileicons-system16 icon-cab",
        "32": "fileicons-system32 icon-cab",
        "48": "fileicons-system48 icon-cab",
        "96": "fileicons-system96-icon-cab",
        "256": "fileicons-system256-icon-cab"
    },
    "cer": {
        "16": "fileicons-system16 icon-cer",
        "32": "fileicons-system32 icon-cer",
        "48": "fileicons-system48 icon-cer",
        "96": "fileicons-system96-icon-cer",
        "256": "fileicons-system256-icon-cer"
    },
    "chm": {
        "16": "fileicons-system16 icon-chm",
        "32": "fileicons-system32 icon-chm",
        "48": "fileicons-system48 icon-chm",
        "96": "fileicons-system96-icon-chm",
        "256": "fileicons-system256-icon-chm"
    },
    "cmd": {
        "16": "fileicons-system16 icon-cmd",
        "32": "fileicons-system32 icon-cmd",
        "48": "fileicons-system48 icon-cmd",
        "96": "fileicons-system96-icon-cmd",
        "256": "fileicons-system256-icon-cmd"
    },
    "dll": {
        "16": "fileicons-system16 icon-dll",
        "32": "fileicons-system32 icon-dll",
        "48": "fileicons-system48 icon-dll",
        "96": "fileicons-system96-icon-dll",
        "256": "fileicons-system256-icon-dll"
    },
    "exe": {
        "16": "fileicons-system16 icon-exe",
        "32": "fileicons-system32 icon-exe",
        "48": "fileicons-system48 icon-exe",
        "96": "fileicons-system96-icon-exe",
        "256": "fileicons-system256-icon-exe"
    },
    "fon": {
        "16": "fileicons-system16 icon-fon",
        "32": "fileicons-system32 icon-fon",
        "48": "fileicons-system48 icon-fon",
        "96": "fileicons-system96-icon-fon",
        "256": "fileicons-system256-icon-fon"
    },
    "hlp": {
        "16": "fileicons-system16 icon-hlp",
        "32": "fileicons-system32 icon-hlp",
        "48": "fileicons-system48 icon-hlp",
        "96": "fileicons-system96-icon-hlp",
        "256": "fileicons-system256-icon-hlp"
    },
    "ini": {
        "16": "fileicons-system16 icon-ini",
        "32": "fileicons-system32 icon-ini",
        "48": "fileicons-system48 icon-ini",
        "96": "fileicons-system96-icon-ini",
        "256": "fileicons-system256-icon-ini"
    },
    "lnk": {
        "16": "fileicons-system16 icon-lnk",
        "32": "fileicons-system32 icon-lnk",
        "48": "fileicons-system48 icon-lnk",
        "96": "fileicons-system96-icon-lnk",
        "256": "fileicons-system256-icon-lnk"
    },
    "msi": {
        "16": "fileicons-system16 icon-msi",
        "32": "fileicons-system32 icon-msi",
        "48": "fileicons-system48 icon-msi",
        "96": "fileicons-system96-icon-msi",
        "256": "fileicons-system256-icon-msi"
    },
    "ps1": {
        "16": "fileicons-system16 icon-ps1",
        "32": "fileicons-system32 icon-ps1",
        "48": "fileicons-system48 icon-ps1",
        "96": "fileicons-system96-icon-ps1",
        "256": "fileicons-system256-icon-ps1"
    },
    "reg": {
        "16": "fileicons-system16 icon-reg",
        "32": "fileicons-system32 icon-reg",
        "48": "fileicons-system48 icon-reg",
        "96": "fileicons-system96-icon-reg",
        "256": "fileicons-system256-icon-reg"
    },
    "rtf": {
        "16": "fileicons-system16 icon-rtf",
        "32": "fileicons-system32 icon-rtf",
        "48": "fileicons-system48 icon-rtf",
        "96": "fileicons-system96-icon-rtf",
        "256": "fileicons-system256-icon-rtf"
    },
    "txt": {
        "16": "fileicons-system16 icon-txt",
        "32": "fileicons-system32 icon-txt",
        "48": "fileicons-system48 icon-txt",
        "96": "fileicons-system96-icon-txt",
        "256": "fileicons-system256-icon-txt"
    },
    "vbs": {
        "16": "fileicons-system16 icon-vbs",
        "32": "fileicons-system32 icon-vbs",
        "48": "fileicons-system48 icon-vbs",
        "96": "fileicons-system96-icon-vbs",
        "256": "fileicons-system256-icon-vbs"
    },
    "avi": {
        "16": "fileicons-video16 icon-avi",
        "32": "fileicons-video32 icon-avi",
        "48": "fileicons-video48 icon-avi",
        "96": "fileicons-video96-icon-avi",
        "256": "fileicons-video256-icon-avi"
    },
    "flv": {
        "16": "fileicons-video16 icon-flv",
        "32": "fileicons-video32 icon-flv",
        "48": "fileicons-video48 icon-flv",
        "96": "fileicons-video96-icon-flv",
        "256": "fileicons-video256-icon-flv"
    },
    "m4v": {
        "16": "fileicons-video16 icon-m4v",
        "32": "fileicons-video32 icon-m4v",
        "48": "fileicons-video48 icon-m4v",
        "96": "fileicons-video96-icon-m4v",
        "256": "fileicons-video256-icon-m4v"
    },
    "mkv": {
        "16": "fileicons-video16 icon-mkv",
        "32": "fileicons-video32 icon-mkv",
        "48": "fileicons-video48 icon-mkv",
        "96": "fileicons-video96-icon-mkv",
        "256": "fileicons-video256-icon-mkv"
    },
    "mov": {
        "16": "fileicons-video16 icon-mov",
        "32": "fileicons-video32 icon-mov",
        "48": "fileicons-video48 icon-mov",
        "96": "fileicons-video96-icon-mov",
        "256": "fileicons-video256-icon-mov"
    },
    "mp4": {
        "16": "fileicons-video16 icon-mp4",
        "32": "fileicons-video32 icon-mp4",
        "48": "fileicons-video48 icon-mp4",
        "96": "fileicons-video96-icon-mp4",
        "256": "fileicons-video256-icon-mp4"
    },
    "mpg": {
        "16": "fileicons-video16 icon-mpg",
        "32": "fileicons-video32 icon-mpg",
        "48": "fileicons-video48 icon-mpg",
        "96": "fileicons-video96-icon-mpg",
        "256": "fileicons-video256-icon-mpg"
    },
    "wmv": {
        "16": "fileicons-video16 icon-wmv",
        "32": "fileicons-video32 icon-wmv",
        "48": "fileicons-video48 icon-wmv",
        "96": "fileicons-video96-icon-wmv",
        "256": "fileicons-video256-icon-wmv"
    },
    "asax": {
        "16": "fileicons-web16 icon-asax",
        "32": "fileicons-web32 icon-asax",
        "48": "fileicons-web48 icon-asax",
        "96": "fileicons-web96-icon-asax",
        "256": "fileicons-web256-icon-asax"
    },
    "ascx": {
        "16": "fileicons-web16 icon-ascx",
        "32": "fileicons-web32 icon-ascx",
        "48": "fileicons-web48 icon-ascx",
        "96": "fileicons-web96-icon-ascx",
        "256": "fileicons-web256-icon-ascx"
    },
    "ashx": {
        "16": "fileicons-web16 icon-ashx",
        "32": "fileicons-web32 icon-ashx",
        "48": "fileicons-web48 icon-ashx",
        "96": "fileicons-web96-icon-ashx",
        "256": "fileicons-web256-icon-ashx"
    },
    "asmx": {
        "16": "fileicons-web16 icon-asmx",
        "32": "fileicons-web32 icon-asmx",
        "48": "fileicons-web48 icon-asmx",
        "96": "fileicons-web96-icon-asmx",
        "256": "fileicons-web256-icon-asmx"
    },
    "aspx": {
        "16": "fileicons-web16 icon-aspx",
        "32": "fileicons-web32 icon-aspx",
        "48": "fileicons-web48 icon-aspx",
        "96": "fileicons-web96-icon-aspx",
        "256": "fileicons-web256-icon-aspx"
    },
    "config": {
        "16": "fileicons-web16 icon-config",
        "32": "fileicons-web32 icon-config",
        "48": "fileicons-web48 icon-config",
        "96": "fileicons-web96-icon-config",
        "256": "fileicons-web256-icon-config"
    },
    "cshtml": {
        "16": "fileicons-web16 icon-cshtml",
        "32": "fileicons-web32 icon-cshtml",
        "48": "fileicons-web48 icon-cshtml",
        "96": "fileicons-web96-icon-cshtml",
        "256": "fileicons-web256-icon-cshtml"
    },
    "css": {
        "16": "fileicons-web16 icon-css",
        "32": "fileicons-web32 icon-css",
        "48": "fileicons-web48 icon-css",
        "96": "fileicons-web96-icon-css",
        "256": "fileicons-web256-icon-css"
    },
    "htm": {
        "16": "fileicons-web16 icon-htm",
        "32": "fileicons-web32 icon-htm",
        "48": "fileicons-web48 icon-htm",
        "96": "fileicons-web96-icon-htm",
        "256": "fileicons-web256-icon-htm"
    },
    "js": {
        "16": "fileicons-web16 icon-js",
        "32": "fileicons-web32 icon-js",
        "48": "fileicons-web48 icon-js",
        "96": "fileicons-web96-icon-js",
        "256": "fileicons-web256-icon-js"
    },
    "swf": {
        "16": "fileicons-web16 icon-swf",
        "32": "fileicons-web32 icon-swf",
        "48": "fileicons-web48 icon-swf",
        "96": "fileicons-web96-icon-swf",
        "256": "fileicons-web256-icon-swf"
    },
    "xap": {
        "16": "fileicons-web16 icon-xap",
        "32": "fileicons-web32 icon-xap",
        "48": "fileicons-web48 icon-xap",
        "96": "fileicons-web96-icon-xap",
        "256": "fileicons-web256-icon-xap"
    }
};
GleamTech.FileUltimate.FileIconManager.fileIconMappings = {
    "tgz": "tar",
    "tbz": "tar",
    "tbz2": "tar",
    "sit": "sitx",
    "aiff": "aif",
    "aifc": "aif",
    "aac": "aif",
    "mid": "aif",
    "midi": "aif",
    "flac": "aif",
    "m4p": "aif",
    "max": "3ds",
    "sdf": "mdf",
    "user": "suo",
    "xslt": "xsl",
    "tif": "bmp",
    "tiff": "bmp",
    "tff": "bmp",
    "tga": "bmp",
    "jpeg": "jpg",
    "jpe": "jpg",
    "jif": "jpg",
    "jfif": "jpg",
    "jfi": "jpg",
    "exif": "jpg",
    "com": "exe",
    "sys": "dll",
    "ocx": "dll",
    "cpl": "dll",
    "bat": "cmd",
    "inf": "ini",
    "otf": "fon",
    "ttf": "fon",
    "log": "txt",
    "crt": "cer",
    "mp4v": "mp4",
    "3g2": "mkv",
    "3gp": "mkv",
    "mpe": "mpg",
    "mpeg": "mpg",
    "vob": "mpg",
    "asf": "mkv",
    "m2ts": "mkv",
    "mts": "mkv",
    "master": "aspx",
    "html": "htm",
    "vbhtml": "cshtml"
};
GleamTech.FileUltimate.FileThumbnailManager.supportedExtensions = {
    "bmp": 1,
    "gif": 1,
    "png": 1,
    "jpg": 1,
    "jpeg": 1,
    "jpe": 1,
    "jif": 1,
    "jfif": 1,
    "jfi": 1,
    "exif": 1,
    "tif": 1,
    "tiff": 1,
    "tff": 1,
    "psd": 1,
    "avi": 2,
    "mp4": 2,
    "m4v": 2,
    "mp4v": 2,
    "3g2": 2,
    "3gp": 2,
    "mpg": 2,
    "mpeg": 2,
    "mpe": 2,
    "vob": 2,
    "mov": 2,
    "mkv": 2,
    "wmv": 2,
    "asf": 2,
    "m2ts": 2,
    "mts": 2,
    "ts": 2,
    "m2t": 2,
    "flv": 2
};
GleamTech.FileUltimate.ArchiveFileManager.supportedExtensions = {
    "zip": 2,
    "7z": 1,
    "rar": 1,
    "tar": 1,
    "tgz": 1,
    "tbz": 1,
    "tbz2": 1,
    "gz": 1,
    "bz2": 1
};
function initHeader(n, t, i, r) {
    var u = document.getElementById("pageHeader"),
    e = document.getElementById("userInfo"),
    f = GleamTech.JavaScript.UI.ContextMenu.Parse(document.body, {
        ContextMenus: {
            ContextMenu: {
                Name: "User",
                Item: [{
                    action: "UserSettings",
                    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACoElEQVR42o2SX0hTURzHv9uuif+mTqe4+SdMbWCGucSX0kGFqE9RIDitBzGo6I8P0YMRYk/RgyWBShCoZVIU/cE/aDF8yH9RSojkw1QcznvddFu7293u7u7pbisjUvF3zu8czr/POef3++KrqTUBkpne3Qv3XV3dWXdaWk40NzcXYh8mCzUdt6tl1+8PkSdPeztWlpdq7Zv2lC27zas7XPDSaDRe1ul0gd0AlG26X6YuqyOhQTqYxjg1iaVJEFO0L2F07GNjVBTVLS192RVAKSCb6G1F6tFTosq7xPv9SVhdYmG1CFjgeCiVSu1eALnH6aBcbie+md5cW6cZwjDrcLEcshNlyFeJ8PPBtb1iIN/YsKPq6kPicLrT1tcsIk3TcDhdEAMeVJSf7K0wGL7vGcS+NiNlViiIVptbRC3OfxB4XyabU7OfBERi8EmwB6PjZFgYmLEWqVXDfp+3KSUHOF1ZteOBnlejaDh3Bn2vx6BVBqGYGzej8sIxWfTB+tx4RcIlwTKljc0rR0a6CgLP/eeFeRoEA5HeYlkD1f72itzGHYJeXzuSVLSsiak8i/nZWZTqS0CkEq6EwOrwwGRzI/sAheNpcRCluc8TM5A73V7Ce7MGtmhak5icBl/iXwHyPA8+wEsAYNC8ibumZZRplBFw2KUszE0tUnCLqR52E4IAMDbHNqBteAGGzkkIwQBujP7ArSPpv19FwtAw4H3XJPnJWBPdW4zISYJleWEboE+lsOH2QfVgHAZVDBpKtHjWM4j+5yOwrNKRLEiqFZJVKedp8/zNIWalOCY2Pj8zHhmhi2pKC5CToUbTi2lcLM7CAYUMdfXVCAaFPz/Y2do7OokoisTn9/3jHMcRlmWJy+UiTqeThPZRu0EePe7el5B+ATyXUE0p9ZJ7AAAAAElFTkSuQmCC",
                    text: "FileVista.Action.UserSettings"
                },
                {
                    action: "Administration",
                    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACwklEQVQ4jYVRbUhTYRg9u97NXeecms7vJWkfmIVo9mkUZIglFQSWkkhQP/oREoZEQVk/MzWXJZH+UCvKjFASbYIfpEvtQyvIwErTnLlNt+nd7na33bcfOtGYeOCBw8v7nOc8zwGW4V7zQKCHlzb0fCxt7KkDgJJn3YqbNa+l8AKRh1Q09VEURE0EPlM0hedyxree4/lxo9l2WyJyl7BW9n7xuayy/wVoDyk4vluoaR1ybFQps8KC/LNoWoJJ45zq9+RU5ax+EmIJQ3l1cKexN1zuJ30U4MeYtm2I3K5gJMpfU0YMj+oggCAiRAG3W4DBbB83zMz+MRqMJnVR7vklB4KbuIhAErbEKJmQAAaad5/QoR0cZGSyErFYorJaI4rjokOlqjCZysZaVXqXo2e5A6roVJqR512XaJrCiE6P1u73Tey89UTVlfwudWFOnZV3HZsysdM2jgehCEQS35wVK1S3DbYHyv22rg8PQf/gMDq1fbFpsTKHt329gSaCMCsiohmAWucrFSNIESgFnEjPyPTaUPtCg7yTh1H/sh1RAe6FGB80f8hOjIu+63Q58Hbg65CCm8jct3fnmtN7tQOgr1Vr5DY7d3mOtSIyNBj7kxOTvvROIDUlGQQEIAAhBDqTFZ2GeagkNHYoZRAIQa92AJRY7EOzdr7/84+J5pFxnctfLluawPM8eCcPQoCWnzO43jmKXZEBC8IgCzcozj9kAnDxas0b/zHddMIcy8V7BG61fkPHmAVdF/agQPMdZQfiF10RELIYo+ezL+XDOJyCaFSnf+V5SwmhoZ+3I7ikGweDGeQlR+FxbQuePmnDxPjflQI3zqYbHLwz22wxFQILDo+mbkJDbhI2g0N+khISHxFyzxzB6dwMxMSErX7dcnUVEQSB2B32FcVxHGFZllgsFmI2m0m5uorQq4lUVD5cM0YA+Af6x0UrttcFJgAAAABJRU5ErkJggg==",
                    text: "FileVista.Action.Administration"
                },
                {
                    action: "[Separator]"
                },
                {
                    action: "Logout",
                    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACp0lEQVR42pWTXUiTURjH/+/ru9am20ydM0WtxFwUqVB2Mz+gIBWK6CZKCMEo+24ZLDLCLKgwqbxxUoR5IdqFVBeVuVh1UZZUFmQEMXVzH+/eue9vt/dtWxiWOOy5eM45nPP/ned5znnwUdsmQsy0j68kRrW6J/9ia6tCqVRuxDKMiLsuVT1x6sZT7u79vq6pSd0+26wt025j/PKS9Q8bGhqOyuXyuaUAFPO+n5BuO8DFFzLQTalSTmjhohi1BEUvRjRNPB7VE9saWxJApYB429eGrM3b2Qy/LhwKpUOv88JkiGAiEIZYLM5LBiB9Tgfl8jjxSTt00myhOZo2w+UNoEBCoDiDRSgcNSarAWm12lB3/DbncHqyzUYDa7FY4HC6wM75UF1V2VddU/M1GSBFUZpHlO4oJ9ILCu2+Kd0el2NW7HZ74XS5MO0iDzefUOqTRvAyYouaV1rZkYEB08yM6dm0fga0cQofGMFTccXBivmL4u55LY8bPyK9+Regt32Yy5SJsHr3WRlZWFkKPwN+jhyKxuv1wqw17c2X76lj5/jzAsbgaVkIIW49OkYygSLI1x0ypIcncwUI4qdXgpwv3RC86l4U8k5VBzQd5yHNF3WW9TDnKKfHz4XD+YN2iyW3sCgbblYEgg0kxIrGSyCs38BL5YPHJ4FoEOx3DaoaT+NN7514JCDHR39Q8LBZPu8sIhGAZhzg2Mjv/IS8mJgHiogJmWmwdhphmx3+MQ227r8Ah97VQj5Rv+PctEnisdNsIPZhveEIopFoAjBHkQjJSuDP2IBocW1svgUBZwjEpl343H8VqwoknYleUHU8WEsb9WeEaWllAmFaMUXxssutQ8GcieHUhfm7KQKVe1UYH7yWEMdrsJyG+2Ov6/mctm7Foqf8L8C/4l85cC7qA8uN7QAAAABJRU5ErkJggg==",
                    text: "FileVista.Action.Logout"
                }]
            }
        }
    },
    function(r) {
        switch (r.action) {
        case "UserSettings":
            t.ShowUrl("usersettingsdialog.aspx", 400, 230, n.GetEntry("FileVista.Action.UserSettings"));
            break;
        case "Administration":
            window.location.href = "administration.aspx";
            break;
        case "Logout":
            GleamTech.JavaScript.Util.RequestJson(i, null,
            function() {
                window.location.href = "login.aspx"
            },
            function(t) {
                alert(n.GetEntry("544") + "\n\n" + t.Message)
            })
        }
    },
    n);
    return f.User.divElement.style.zIndex = 2,
    r && f.User.menuItems.Administration.Hide(),
    GleamTech.JavaScript.Util.AddEvent(e, "click",
    function() {
        f.User.PopupXY(u.offsetWidth, u.offsetHeight, !0)
    }),
    u
}
function fileManagerLoading(n) {
    var t = n,
    i = GleamTech.JavaScript.Util.GetLanguage(t.uploaderLanguage),
    r = new GleamTech.JavaScript.UI.ModalDialog,
    f = initHeader(i, r, getActionUrl("Logout"), !fileVistaParameters.IsAdministrator && !fileVistaParameters.IsGroupManager),
    u;
    t.insert(0, {
        xtype: "component",
        region: "north",
        contentEl: f
    });
    GleamTech.FileUltimate.FileManagerPermissionTypes.CreatePublicLink = 8192;
    u = [{
        showConditions: {
            itemTypes: {
                File: {
                    parentPermissions: ["CreatePublicLink"]
                }
            }
        },
        text: i.GetEntry("FileVista.Label.CreatePublicLink") + "...",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADP0lEQVR4nK2Te0hTcRTHv/e1O91m013dbc6WOHVuzpr0WDVzktjD7AVRVvSAiiiISsoeZtELJHsYEUVFSS+JooQIKg0rFXqYFD0kK8t0mpa1TW1u7q6bpWD0ZwcO/Di/cz4cvnwP8I+ImbAj1bb41J7pW65Xz8y70TJpzeUKY8bBHWpjjp2LW6sQk+jvJfsfYpG69rCFTFtxtiB2RuTt6OmObab0t+OiEvy8PCoi1ZJp35mUNqU4eonrjNhuFPvpQYDU7IXC8ZLK605b9SZ+ZLNE02uGaiiHJrcKDK+AJJSFLIwdpqdmzVYo9Ev/QMgBgKPu1aGPxitZ0lGPMP/QPqzm38L8bQI4PgTy4RxIloZEyiBS302aMogNbJBqijgW2gfQWvLsHYlP1lJJFBKCTH3AN4XbEfn5DuLNHPw0DT9BgBYB6pRbsK4rJZVG2XqCoCzE3Xlsodcp5Pwt5OTc/Sjbvxk12QfxSJ0Jtq0bnvcdMC/LRTcVwL3TVrSVqvOp7Cjylm1pPnQaDvqRFsQlj4DeFAfBUYeo8Vnwnd8FtyISLb06+Du8iJ34AB9cTjS2uiBpsOG3ksEMaJmYhAdCe3vfBl63B56GMozO3gr6Yi6eWavh/S6gvLkBbZ870eZlwfnZWGqRntqpGZceEGShRC+rAhmeAB+jFNetB5mUhdpLe1EVswrvuuLR+b0bDqYDVJMRytosdDX7amhepzxQe3T7IA1cNIGUObmoLdmH57ZZuNs0B95OARQjhebpcgQCLvSSfrT31N/vcxRvzJ+qlI+9CdYF78pzOHOpHEIggIqZY/A0zYIhLxLhqEwERXsxZFgYZGoJGsvbnS8qShcQf1yokAcnFkmlEcuga8QJ90actWtxP8UCpTQMBHwA+xWSornQWU348syH+qrK3Z3Oj8cGPB0en2MOkSUXMpLgDE/MS/yYdg/B4XL4g5wAzSCciob8qh1ElxbOT80XPr2uKhLHagYAv7xNEIwpRG5YwwZxK1ptJ0EbBJBaNzStU8G1WEH1MML7srrDXx0vS8SR51/eHOkZZJ5fByWmik/Iy9RO3FTMZ6xsNCwu6DLYih/HJB8uiDBszBT/+f5D+i/xE6UqHPhmOggeAAAAAElFTkSuQmCC",
        handler: function() {
            var n = "publiclinkdialog.aspx?";
            n += Ext.Object.toQueryString({
                stateId: t.serverStateId,
                path: t.navigationSelection.getPathData().fullPath,
                fileName: t.contextMenuSelection.data.name
            });
            r.ShowUrl(n, 400, 460, i.GetEntry("FileVista.Label.NewPublicLink"))
        }
    },
    {
        showConditions: {
            itemTypes: {
                File: {
                    parentPermissions: ["CreatePublicLink"]
                }
            }
        },
        text: i.GetEntry("FileVista.Label.ManagePublicLinks") + "...",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC9ElEQVR42qWSXWgUVxTHfzOzX8nuJrtZNYsb126iSQzVip8ExAebIoogtBbBh/oiyKIglT743Ic+tC+CH6GKbamiSPtSsX5S8TtBxICUVYJNauKy2SS72d1kstmduXc6k5gghfrSGc65c8+953f+c+6F//kojsv1fXPYsmRSWrLDkgLH5KyZSGHOze3Rng/a8e6V2899Nw9wOc4OJutXbujQfP73VjPKxcTQ41+T9ue/AWZMdXv/M9GyHFUmquZyiiXeXZsDCOOdzRaKomCYkqt3s6RyJiMlP+YUxP2TxAwvkc6DoVzP9wVnv+o4YQMs+51tip1crgiu9OicTo8yHB7F11wi720gJVbz+0QXsY6Gr4KhLyMLCoRpLEidKVc4eV3nh8BFjkoPzcHP6a028bopgKeioFaX0t4kDuXir/Ja+MjZWQXSrNpWQRoz/HLrb05Vb7CirUr84SUWP7rJhwGNukQEU/UQXFZm7YGboY/2caQwWNM1p0A4gGlenvmZ5tQ457Ux1Cc1BBq20LKsloEbp2H9QfSZED6vjhG8ipL4NL5kXdvO+WPErOqUB6bYvGMbrmI/msvuiZhBFF6xxV8HD7q5EDpEOQbZ0gRveER9fNPWWYBzRKJSQqoWss6PcC9HEQqilKcyPoSsqcGTSyN0nf5KlcngGnjRhVL0LFwkGzBJKGHR99sdO6CheKdRVBcfxFrpHenlSuQoY2k37koji6e+xipJRqbTD9U5Bc4vlFi0Yz29yzex/36SXdFO9PQd/shc4/Jn7eR2Z/BtHKUuqhFf00Ztw6KsPjF+W3MAyb2rjnkDbp8UZRrDBTIlhdzTVURDtfz4icWLSJBJ3yBm4jne5+1Ie73/7rNvi4U3l972QKaq08VOVbMI+w2+2N6H93aZY9kufNmL1AczSKud8NjH+OySLfnL+Z688lPx9cmJ+R50FzNFh9TpXOWQJdmz+SlLU0PcexZl+C8/jUYLrcafNEcHsm2tYyeOn7o17OT+A9ElcDpqm5xLAAAAAElFTkSuQmCC",
        handler: function() {
            var n = "managepubliclinksdialog.aspx?";
            n += Ext.Object.toQueryString({
                stateId: t.serverStateId,
                path: t.navigationSelection.getPathData().fullPath,
                fileName: t.contextMenuSelection.data.name
            });
            r.ShowUrl(n, 750, 500, i.GetEntry("FileVista.Label.ManagePublicLinks"))
        }
    }];
    Ext.override(t, {
        createViewItemContextMenu: function() {
            var n = this.callParent();
            return n.insert(n.items.findIndex("itemId", "Upload") + 1, u),
            n
        },
        createNavigationViewItemContextMenu: function() {
            var n = this.callParent();
            return n.insert(n.items.findIndex("itemId", "Upload") + 1, u),
            n
        }
    })
}
function getResourceUrl(n) {
    return fileVistaParameters.ResourceBasePath + n
}
function getActionUrl(n) {
    return fileVistaParameters.ActionBasePath + n
}
var fileVistaParameters;