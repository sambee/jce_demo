Ext.define("GleamTech.UI.Ribbon", {
    extend: "Ext.tab.Panel",
    floatCls: Ext.baseCSSPrefix + "border-region-slide-in",
    initComponent: function() {
        Ext.apply(this, {
            collapsible: !0,
            hideCollapseTool: !0,
            collapseMode: "header",
            animCollapse: !1,
            cls: "x-ribbon",
            minHeight: 120,
            listeners: {
                afterRender: function() {
                    this.collapsed && this.makeUnfloated()
                }
            }
        });
        for (var n = 0; n < this.items.length; n++) this.initTabConfig(this.items[n]);
        this.callParent();
        this.tabBar.cls = "x-toolbar-default";
        this.tabBar.add({
            xtype: "tbfill"
        });
        this.tabBar.add(this.collapseButton = this.createCollapseButton());
        this.tabBar.un({
            click: this.tabBar.onClick,
            element: "el",
            scope: this.tabBar
        });
        this.tabBar.on({
            mousedown: this.tabBar.onClick,
            element: "el",
            scope: this.tabBar
        })
    },
    updateHeader: function() {
        this.tabBar.isHeader = !0;
        this.header = this.tabBar;
        this.callParent(arguments)
    },
    initTabConfig: function(n) {
        if (n.xtype = n.xtype || "toolbar", n.border = !1, n.layout = {
            align: "stretch"
        },
        n.cls = "x-unselectable", n.tabConfig = {
            focusable: !1
        },
        Ext.isArray(n.items)) for (var t = 0; t < n.items.length; t++) this.initGroupConfig(n.items[t])
    },
    initGroupConfig: function(n) {
        var i, t, r;
        if (n.xtype = n.xtype || "buttongroup", n.layout = n.layout || {
            type: "hbox"
        },
        n.headerPosition = n.headerPosition || "bottom", n.frame = !1, Ext.isArray(n.items)) for (i = 0; i < n.items.length; i++) if (t = n.items[i], t.xtype == "container") for (t.listeners = {
            beforeadd: function(n, t) {
                t.isButton && (t.ui = t.ui + "-toolbar")
            }
        },
        r = 0; r < t.items.length; r++) this.initItemConfig(t.items[r]);
        else this.initItemConfig(t)
    },
    initItemConfig: function(n) {
        n.xtype = n.xtype || "button";
        n.focusable = !1;
        n.iconCls && (n.iconAlign == "top" || n.iconAlign == "bottom") && (n.iconCls += " " + this.getCenterCls(n.scale), n.scale == "large" && (n.text = this.getWrappedText(n.text, 8, "<br/>"), n.menu && (n.arrowVisible = !1, n.text += ' <span class="x-btn-inline-arrow"><\/span>')));
        n.menu || (n.listeners = n.listeners = n.listeners || {},
        n.listeners.click = {
            fn: this.handleItemClick,
            scope: this
        })
    },
    getWrappedText: function(n, t, i) {
        var u, f;
        if (n.length < t) return n;
        var o = n.match(/\S+/g),
        e = [],
        r = "";
        for (u = 0; u < o.length; u++) f = o[u],
        r.length > 0 && (r.length > t || r.length + f.length > t) && (e.push(r), r = ""),
        r += r.length > 0 ? " " + f: f;
        return r.length > 0 && e.push(r),
        e.join(i)
    },
    addTab: function(n) {
        this.initTabConfig(n);
        var t = new Ext.toolbar.Toolbar(n);
        this.add(t)
    },
    insertTab: function(n, t) {
        this.initTabConfig(t);
        var i = new Ext.toolbar.Toolbar(t);
        this.insert(n, i)
    },
    addGroup: function(n, t) {
        this.initGroupConfig(t);
        var i = new Ext.container.ButtonGroup(t);
        n.add(i)
    },
    insertGroup: function(n, t, i) {
        this.initGroupConfig(i);
        var r = new Ext.container.ButtonGroup(i);
        n.insert(t, r)
    },
    getCenterCls: function(n) {
        switch (n) {
        case "small":
            return "center-small-icon";
        case "medium":
            return "center-medium-icon";
        case "large":
            return "center-large-icon";
        default:
            return "center-small-icon"
        }
    },
    createCollapseButton: function() {
        return new Ext.button.Button({
            ui: "default-toolbar",
            iconCls: this.collapsed ? "gt-icon-down-short": "gt-icon-up-short",
            handler: this.onCollapseButtonClick,
            scope: this,
            focusable: !1
        })
    },
    onCollapseButtonClick: function() {
        this.floatedFromCollapse && this.makeUnfloated();
        this.toggleCollapse()
    },
    toggleCollapse: function() {
        this.callParent();
        this.updateTabBarUI()
    },
    expand: function() {
        this.tabBar.activeTab.activate(!0);
        this.callParent()
    },
    updateTabBarUI: function() {
        this.collapseButton.setIconCls(this.floatedFromCollapse ? "gt-icon-pin": this.collapsed ? "gt-icon-down-short": "gt-icon-up-short");
        this.collapsed ? this.tabBar.items.each(function(n) {
            if (n.isTab) n.el.on("mousedown", this.makeFloated, this)
        },
        this) : this.tabBar.items.each(function(n) {
            n.isTab && n.el.un("mousedown", this.makeFloated, this)
        },
        this);
        this.collapsed ? this.tabBar.activeTab.deactivate(!0) : this.tabBar.activeTab.activate(!0)
    },
    makeFloated: function() {
        var n = this.collapsed;
        this.expand();
        this.tabBar.activeTab.activate(!0);
        this.body.hide();
        this.collapsed = n;
        this.updateLayout();
        this.addCls(this.floatCls);
        this.floatedFromCollapse = n;
        this.collapsed = !1;
        this.updateTabBarUI();
        this.updateLayout();
        this.body.show();
        Ext.getDoc().on({
            mousedown: this.handleMouseDown,
            scope: this,
            capture: !0
        })
    },
    makeUnfloated: function() {
        this.removeCls(this.floatCls);
        this.floatedFromCollapse = null;
        this.collapse();
        this.updateTabBarUI();
        Ext.getDoc().un({
            mousedown: this.handleMouseDown,
            scope: this,
            capture: !0
        })
    },
    handleMouseDown: function(n) {
        var t = n.getTarget("div[id=" + this.id + "]");
        t == null && this.makeUnfloated()
    },
    handleItemClick: function() {
        this.floatedFromCollapse && this.makeUnfloated()
    },
    toggleItemsUICondition: function(n) {
        Ext.isFunction(n) && (Ext.suspendLayouts(), this.items.each(function(t) {
            t.items.each(function(t) {
                var i = 0;
                t.items.each(function(t) {
                    t.xtype != "tbseparator" && (t.xtype == "container" ? t.items.each(function(t) {
                        t.toggleUICondition(n);
                        t.hidden || i++
                    }) : (t.toggleUICondition(n), t.hidden || i++))
                });
                i == 0 ? t.hide() : t.show()
            })
        }), Ext.resumeLayouts(!0))
    }
});