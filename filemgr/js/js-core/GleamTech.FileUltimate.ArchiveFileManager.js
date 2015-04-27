Ext.define("GleamTech.FileUltimate.ArchiveFileManager", {
    singleton: !0,
    supportedExtensions: {},
    isSupported: function(n) {
        return n.charAt(0) === "." && (n = n.substr(1)),
        n = n.toLowerCase(),
        this.supportedExtensions[n]
    },
    isReadOnly: function(n) {
        return n === 1
    },
    isReadWrite: function(n) {
        return n === 2
    },
    getSupportedExtensions: function() {
        return this.supportedExtensionsArray || (this.supportedExtensionsArray = Ext.Object.getAllKeys(this.supportedExtensions)),
        this.supportedExtensionsArray
    }
});