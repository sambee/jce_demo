Ext.define("GleamTech.UI.ControlBase", {
    config: {
        serverStateId: "",
        serverHandlerUrl: "",
        showOnLoad: !0,
        fullViewport: !1,
        modalDialog: !1,
        modalDialogTitle: ""
    },
    constructor: function() {
        this.actions = {}
    },
    registerAction: function(n, t) {
        this.actions[n.toLowerCase()] = t
    },
    getAction: function(n) {
        return this.actions[n.toLowerCase()]
    },
    addActions: function(n, t) {
        for (var r, i = 0; i < n.length; i++) r = n[i],
        this.addAction(r.actionName, r.languageKey, t.getIcon(r.iconName))
    },
    addAction: function(n, t, i) {
        var r = new Ext.Action({
            text: t ? GleamTech.Util.Language.getEntry(t) : "",
            handler: this.onActionHandler,
            scope: this,
            actionName: n
        });
        return r.iconObj = i,
        this.registerAction(n, r),
        r
    },
    applyAction: function(n, t, i) {
        var r = this.getAction(t);
        return n.baseAction = r,
        n.itemId = t,
        Ext.applyIf(n, r.initialConfig),
        r.iconObj && !n.iconCls && (n.iconCls = r.iconObj.getIconCls(i), n.scale = r.iconObj.getScale(i)),
        (n.enableToggle || n.toggleGroup) && (n.toggleHandler = n.handler, n.handler = null),
        n
    },
    onActionHandler: function(n, t) {
        var i = Ext.callback(this.onActionHandlerBegin, this, [n, t]);
        Ext.callback(this["onAction" + n.baseAction.initialConfig.actionName], this, [n, t, i]);
        Ext.callback(this.onActionHandlerEnd, this, [n, t])
    },
    onActionHandlerBegin: Ext.emptyFn,
    onActionHandlerEnd: Ext.emptyFn,
    callServerHandlerMethod: function(n) {
        n.parameters = Ext.apply({
            stateId: this.serverStateId
        },
        n.parameters);
        Ext.callback(this.onServerHandlerMethodBegin, this, [n]);
        Ext.Ajax.request({
            url: GleamTech.Util.Path.combine(this.serverHandlerUrl, n.name),
            jsonData: n.parameters,
            method: "POST",
            headers: {
                Accept: "application/json"
            },
            callback: this.serverHandlerMethodCallback,
            scope: this,
            methodInfo: n,
            timeout: 11e4
        })
    },
    serverHandlerMethodCallback: function(n, t, i) {
        var s = null,
        r = null,
        o, h, u, f, e;
        if (t) if (o = i.getResponseHeader("Content-Type"), h = o && o.indexOf("application/json") != -1, h) if (u = Ext.decode(i.responseText, !0), u == null) t = !1,
        r = {
            title: "Request Error",
            msg: "Invalid JSON string.",
            details: i.responseText
        };
        else if (u.Success) s = u.Result;
        else {
            if (t = !1, f = u.Result, e = f.Message, e.indexOf("SessionExpired") != -1 || e.indexOf("StateNotFound") != -1) {
                this.refreshPage();
                return
            }
            r = {
                title: "Action Error",
                msg: e,
                details: f.Type ? f: null,
                detailsType: "json"
            }
        } else t = !1,
        r = {
            title: "Request Error",
            msg: "Response content-type is not application/json.",
            details: i.responseText,
            detailsType: "html"
        };
        else r = i.status > 0 ? {
            title: "Http Error",
            msg: "HTTP " + i.status + " - " + i.statusText,
            details: i.responseText,
            detailsType: "html"
        }: {
            title: "Connection Error",
            msg: i.statusText
        };
        Ext.callback(this.onServerHandlerMethodEnd, this, [n.methodInfo, r]);
        Ext.callback(n.methodInfo.callback, n.scope, [t, s])
    },
    onServerHandlerMethodBegin: Ext.emptyFn,
    onServerHandlerMethodEnd: Ext.emptyFn,
    getServerHandlerMethodProxy: function(n) {
        var t = new Ext.data.proxy.Server({
            reader: "json",
            url: "null"
        }),
        i = this;
        return Ext.override(t, {
            doRequest: function(r, u, f) {
                var e = this.buildRequest(r),
                o = Ext.callback(n.methodInfoCallback, n.scope || this, [r]);
                return Ext.apply(o, {
                    callback: function(i, o) {
                        var h = {},
                        c = t,
                        s, l;
                        i === !0 ? (s = Ext.callback(n.readRecordsCallback, n.scope || this, [r, o]), l = new Ext.data.ResultSet({
                            total: s.records,
                            count: s.length,
                            records: s,
                            success: i
                        }), r.process(l, e, h)) : (c.setException(r, h), c.fireEvent("exception", this, h, r));
                        Ext.callback(u, f || this, [r])
                    }
                }),
                i.callServerHandlerMethod(o),
                e
            }
        }),
        t
    },
    refreshPage: function() {
        window.location.href.indexOf("#") == -1 ? window.location.href = window.location.href: window.location.reload()
    },
    createUniqueId: function() {
        return (new Date).getTime() + "" + Math.floor(Math.random() * 8999 + 1e3)
    },
    renderDynamic: function() {
        var n, r, t, i;
        if (this.modalDialog) {
            this.border = !1;
            n = new Ext.window.Window({
                title: this.modalDialogTitle,
                layout: "fit",
                items: this,
                width: this.width,
                height: this.height,
                resizable: this.resizable,
                resizeHandles: this.initialConfig.resizeHandles || "all",
                modal: !0,
                ghost: !1,
                constrain: !0,
                closeAction: "hide"
            });
            this.resizable = !1;
            Ext.override(this, {
                show: function() {
                    this.callParent(arguments);
                    n.show()
                },
                hide: function() {
                    n.hidingFromChild = !0;
                    n.hide();
                    delete n.hidingFromChild;
                    this.callParent(arguments)
                }
            });
            n.on("hide",
            function() {
                n.hidingFromChild || this.hide()
            },
            this)
        } else this.hidden = !this.showOnLoad,
        this.initialConfig.resizeHandles || (this.resizeHandles = "s e se");
        if (this.fullViewport) this.border = !1,
        r = new Ext.container.Viewport({
            layout: "fit",
            items: n || this
        });
        else {
            t = Ext.getDom(this.id + "-loader");
            i = n || this;
            i.render(t.parentNode, t);
            Ext.on("resize",
            function() {
                i.updateLayout()
            })
        }
        n && this.showOnLoad && n.show()
    }
});