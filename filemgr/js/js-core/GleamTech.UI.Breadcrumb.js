Ext.define("GleamTech.UI.Breadcrumb", {
    extend: "Ext.toolbar.Breadcrumb",
    showIcons: !1,
    initComponent: function() {
        this.callParent(arguments);
        this.refreshSelectionBuffered = Ext.Function.createBuffered(this.refreshSelection, 200);
        this.fieldsToWatch = ["loaded", "expandable", this.displayField]
    },
    updateStore: function(n, t) {
        if (this.callParent(arguments), t && t.un("update", this.onNodeChildrenChange, this), n) n.on("update", this.onNodeChildrenChange, this)
    },
    onNodeChildrenChange: function(n, t, i, r) {
        r && this.selection && (t == this.selection || t.contains(this.selection)) && Ext.Array.each(r,
        function(n) {
            return Ext.Array.indexOf(this.fieldsToWatch, n) > -1 ? (this.refreshSelectionBuffered(), !1) : !0
        },
        this)
    },
    refreshSelection: function() {
        this._needsSync = !0;
        this.suspendEvent("selectionchange");
        this.updateSelection(this.selection);
        this.resumeEvent("selectionchange")
    },
    setSelection: function(n, t, i) {
        this.isConfiguring && (i = !0);
        t && (this._needsSync = !0);
        i && this.suspendEvent("selectionchange");
        this.callParent(arguments);
        i && this.resumeEvent("selectionchange")
    },
    updateSelection: function(n) {
        var i = this,
        e = i._buttons,
        y = [],
        h = i.items.getCount(),
        w = i._needsSync,
        b = i.getDisplayField(),
        c,
        l,
        f,
        a,
        v,
        r,
        o,
        t,
        p,
        s,
        u;
        if (Ext.suspendLayouts(), n) {
            for (r = n, s = n.get("depth"), v = s + 1, u = s; r;) {
                if (p = r.getId(), t = e[u], !w && t && t._breadcrumbNodeId === p) break;
                o = r.get(b);
                t ? t.setText(o) : t = e[u] = Ext.create({
                    xtype: i.getUseSplitButtons() ? "splitbutton": "button",
                    ui: i.getButtonUI(),
                    cls: i._btnCls + " " + i._btnCls + "-" + i.ui,
                    text: o,
                    showEmptyMenu: !0,
                    menu: {
                        listeners: {
                            click: "_onMenuClick",
                            beforeshow: "_onMenuBeforeShow",
                            scope: this
                        },
                        alignOffset: [ - 34, 0],
                        cls: "x-breadcrumb-menu"
                    },
                    menuAlign: "tl-br?",
                    handler: "_onButtonClick",
                    scope: i
                });
                o.length == 0 ? (t.addCls("x-no-text"), t.setText("&#160;")) : t.removeCls("x-no-text");
                c = this.getShowIcons();
                c !== !1 && (l = r.get("glyph"), a = r.get("icon"), f = r.get("iconCls"), l ? (t.setGlyph(l), t.setIcon(null), t.setIconCls(f)) : a ? (t.setGlyph(null), t.setIconCls(null), t.setIcon(a)) : f ? (t.setGlyph(null), t.setIcon(null), t.setIconCls(f)) : c ? (t.setGlyph(null), t.setIcon(null), t.setIconCls((r.isLeaf() ? i._leafIconCls: i._folderIconCls) + "-" + i.ui)) : (t.setGlyph(null), t.setIcon(null), t.setIconCls(null)));
                t.setArrowVisible(r.hasChildNodes());
                t._breadcrumbNodeId = r.getId();
                r = r.parentNode;
                u--
            }
            if (this.showIcons === !1 && (f = n.get("iconCls"), t = e[0], f && t.setIconCls(f)), i.removeCls("x-breadcrumb-empty"), v > h) y = e.slice(h, s + 1),
            i.add(y);
            else for (u = h - 1; u >= v; u--) i.remove(i.items.items[u], !1)
        } else i.removeAll(!1),
        i.addCls("x-breadcrumb-empty");
        Ext.resumeLayouts(!0);
        i.fireEvent("selectionchange", i, n);
        i._needsSync = !1
    },
    privates: {
        _onMenuClick: function(n, t) {
            t && this.setSelection(this.getStore().getNodeById(t._breadcrumbNodeId))
        },
        _onMenuBeforeShow: function(n) {
            var t = this,
            c = t.getStore().getNodeById(n.ownerCmp._breadcrumbNodeId),
            v = t.getDisplayField(),
            l = t.getShowMenuIcons(),
            e,
            i,
            o,
            s,
            u,
            h,
            f,
            a,
            r;
            if (c.hasChildNodes()) {
                for (e = c.childNodes, s = [], u = 0, a = e.length; u < a; u++) i = e[u],
                r = {
                    text: i.get(v),
                    _breadcrumbNodeId: i.getId()
                },
                l !== !1 && (o = i.get("glyph"), h = i.get("icon"), f = i.get("iconCls"), o ? (r.glyph = o, r.iconCls = f) : h ? r.icon = h: f ? r.iconCls = f: l && (r.iconCls = (i.isLeaf() ? t._leafIconCls: t._folderIconCls) + "-" + t.ui)),
                t.selection && (i == t.selection || i.contains(t.selection)) && (r.cls = "x-menu-item-bold"),
                s.push(r);
                n.removeAll();
                n.add(s)
            } else return ! 1
        }
    }
});