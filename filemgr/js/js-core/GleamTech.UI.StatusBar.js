Ext.define("GleamTech.UI.StatusBar", {
    extend: "Ext.toolbar.Toolbar",
    alternateClassName: "Ext.ux.StatusBar",
    alias: "widget.statusbar",
    requires: ["Ext.toolbar.TextItem"],
    cls: "x-statusbar x-unselectable",
    busyIconCls: "x-status-busy x-loading",
    busyText: "&#160;",
    autoClear: 5e3,
    emptyText: "&#160;",
    activeThreadId: 0,
    initComponent: function() {
        var n = this.statusAlign === "right";
        this.callParent(arguments);
        this.currIconCls = this.iconCls || this.defaultIconCls;
        this.statusEl = Ext.create("Ext.toolbar.TextItem", {
            cls: "x-status-text " + (this.currIconCls || ""),
            text: this.text || this.defaultText || this.emptyText
        });
        this.secondaryStatusEl = Ext.create("Ext.toolbar.TextItem", {
            cls: "x-status-text",
            text: this.secondaryText || this.emptyText
        });
        this.separatorEl = new Ext.toolbar.Separator({
            hidden: !0,
            style: {
                marginLeft: "4px",
                marginRight: "4px"
            }
        });
        n ? (this.cls += " x-status-right", this.add("->"), this.add(this.statusEl)) : (this.insert(0, this.statusEl), this.insert(1, this.separatorEl), this.insert(2, this.secondaryStatusEl), this.insert(3, "->"))
    },
    setStatus: function(n) {
        var i = this;
        if (n = n || {},
        Ext.suspendLayouts(), Ext.isString(n) && (n = {
            text: n
        }), n.text !== undefined && i.setText(n.text), n.iconCls !== undefined && i.setIcon(n.iconCls), n.clear) {
            var t = n.clear,
            r = i.autoClear,
            u = {
                useDefaults: !0,
                anim: !0
            };
            Ext.isObject(t) ? (t = Ext.applyIf(t, u), t.wait && (r = t.wait)) : Ext.isNumber(t) ? (r = t, t = u) : Ext.isBoolean(t) && (t = u);
            t.threadId = this.activeThreadId;
            Ext.defer(i.clearStatus, r, i, [t])
        }
        return Ext.resumeLayouts(!0),
        i
    },
    clearStatus: function(n) {
        var t, i, r, u;
        return (n = n || {},
        t = this, i = t.statusEl, n.threadId && n.threadId !== t.activeThreadId) ? t: (r = n.useDefaults ? t.defaultText: t.emptyText, u = n.useDefaults ? t.defaultIconCls ? t.defaultIconCls: "": "", n.anim ? i.el.puff({
            remove: !1,
            useDisplay: !0,
            callback: function() {
                i.el.show();
                t.setStatus({
                    text: r,
                    iconCls: u
                })
            }
        }) : t.setStatus({
            text: r,
            iconCls: u
        }), t)
    },
    setText: function(n) {
        var t = this;
        return t.activeThreadId++,
        t.text = n || "",
        t.rendered && t.statusEl.setText(t.text),
        t
    },
    getText: function() {
        return this.text
    },
    setIcon: function(n) {
        var t = this;
        return t.activeThreadId++,
        n = n || "",
        t.rendered ? (t.currIconCls && (t.statusEl.removeCls(t.currIconCls), t.currIconCls = null), n.length > 0 && (t.statusEl.addCls(n), t.currIconCls = n)) : t.currIconCls = n,
        t
    },
    busyActive: !1,
    showBusy: function() {
        this.busyActive || (this.busyActive = !0, Ext.suspendLayouts(), this.statusEl.addCls(this.busyIconCls), this.statusEl.setText(this.emptyText), this.separatorEl.hide(), this.secondaryStatusEl.setText(this.emptyText), Ext.resumeLayouts(!0))
    },
    hideBusy: function() {
        this.busyActive && (this.busyActive = !1, Ext.suspendLayouts(), this.statusEl.removeCls(this.busyIconCls), this.statusEl.setText(this.text), this.text && this.text != this.emptyText && this.separatorEl.show(), this.secondaryStatusEl.setText(this.secondaryText), Ext.resumeLayouts(!0))
    },
    busyCount: 0,
    setBusy: function(n) {
        n ? this.busyCount++:this.busyCount--;
        this.busyCount < 0 && (this.busyCount = 0);
        this.busyCount == 1 ? this.busyTimeout = Ext.defer(this.showBusy, 200, this) : this.busyCount == 0 && (clearTimeout(this.busyTimeout), this.hideBusy())
    },
    setPrimaryText: function(n) {
        this.text = n || this.emptyText;
        this.statusEl.setText(this.text);
        this.separatorEl.hidden && this.text && this.text != this.emptyText && this.separatorEl.show();
        this.secondaryStatusEl.setText(this.secondaryText || this.emptyText)
    },
    setSecondaryText: function(n) {
        this.secondaryText = n || this.emptyText;
        this.secondaryStatusEl.el.update(this.secondaryText)
    }
});