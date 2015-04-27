Ext.define("GleamTech.FileUltimate.FileThumbnailManager", {
    singleton: !0,
    supportedExtensions: {},
    isSupported: function(n) {
        return n.charAt(0) === "." && (n = n.substr(1)),
        n = n.toLowerCase(),
        this.supportedExtensions[n]
    },
    isImage: function(n) {
        return n === 1
    },
    isVideo: function(n) {
        return n === 2
    }
});