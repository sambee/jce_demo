Ext.define("GleamTech.UI.Window", {
    extend: "Ext.window.Window",
    minimizeOffset: null,
    minimized: !1,
    boxBeforeMinimize: null,
    initComponent: function() {
        this.minimizeOffset || (this.minimizeOffset = [0, 0]);
        this.callParent()
    },
    minimize: function() {
        return this.minimized ? (this.expand(!1), this.setBox(this.boxBeforeMinimize), this.tools.minimize && this.tools.minimize.setType("minimize"), this.minimized = !1, this) : (this.boxBeforeMinimize = this.getBox(), this.collapse("", !1), this.setWidth(150), this.alignTo(this.alignTarget, "bl-bl", this.minimizeOffset), this.tools.minimize && this.tools.minimize.setType("restore"), this.minimized = !0, this.callParent())
    },
    maximize: function() {
        return this.callParent(arguments),
        this.minimized && (this.minimized = !1, this.tools.minimize && this.tools.minimize.setType("minimize")),
        this
    }
});