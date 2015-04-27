Ext.define("GleamTech.FileUltimate.FileIconManager", {
    singleton: !0,
    baseFileIcons: {},
    fileIcons: {},
    fileIconMappings: {},
    getBaseIconCls: function(n, t) {
        n = n.toLowerCase();
        var i, r = this.baseFileIcons[n];
        return r && (i = r[t], i) ? i: ""
    },
    getIconCls: function(n, t) {
        var i, r, u;
        return (n.charAt(0) === "." && (n = n.substr(1)), n = n.toLowerCase(), r = this.fileIcons[n], r && (i = r[t], i)) ? i: (u = this.fileIconMappings[n], r = this.fileIcons[u], r && (i = r[t], i)) ? i: this.getBaseIconCls("File", t)
    }
});