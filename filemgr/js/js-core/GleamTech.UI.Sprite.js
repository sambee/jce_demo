Ext.define("GleamTech.UI.Sprite", {
    constructor: function(n) {
        this.spriteCls = n
    },
    getIcon: function(n) {
        if (!n) return null;
        var t = this.spriteCls;
        return {
            getIconCls: function(i) {
                return Ext.String.format("{0} icon-{1}{2}", t.toLowerCase(), n.toLowerCase(), i || "16")
            },
            getScale: function(n) {
                switch (n) {
                case 16:
                    return "small";
                case 24:
                    return "medium";
                case 32:
                    return "large";
                default:
                    return "small"
                }
            }
        }
    }
});