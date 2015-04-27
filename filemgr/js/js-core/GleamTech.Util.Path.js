Ext.define("GleamTech.Util.Path", {
    singleton: !0,
    backSlash: "\\",
    forwardSlash: "/",
    getExtension: function(n, t) {
        for (var u = "",     r = n.length,       i = r; --i >= 1;)
            if (n.charAt(i) == ".") {
            t && i++;
            u = i != r - 1 ? n.substr(i, r - i) : "";
            break
        }
        return u
    },
    getFileNameWithoutExtension: function(n) {
        var t = this.getExtension(n);
        return n.substr(0, n.length - t.length)
    },
    combine: function(n, t, i) {
        return i || (i = this.forwardSlash),
        n[n.length - 1] != i ? n + i + t: n + t
    },
    isValidFileName: function(n) {
        return ! /[\/:\*\?"<>|\\]/.test(n)
    }
});