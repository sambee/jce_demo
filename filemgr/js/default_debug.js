Ext.define("GleamTech.Util.Language", {
    singleton: !0,
    name: "",
    entries: {},
    getEntry: function (n) {
        var i = Ext.Array.toArray(arguments),
            t = this.entries[n];
        if (t === undefined) throw new Error(Ext.String.format('Language entry with key "{0}" not found.', n));
        if (t == null) throw new Error(Ext.String.format('Value for language entry with key "{0}" is missing.', n));
        return i[0] = t, i.length > 1 ? Ext.String.format.apply(null, i) : t
    }
});
Ext.define("GleamTech.Util.Culture", {
    singleton: !0,
    cultureInfo: Globalize.cultures.en,
    byteUnits: ["Bytes", "KB", "MB", "GB", "TB"],
    format: function (n, t) {
        return Globalize.format(n, t, this.cultureInfo)
    }, formatShortDateTime: function (n) {
        return this.format(n, "d") + " " + this.format(n, "t")
    }, formatByteSize: function (n) {
        var t, i, r, u, f;
        if (n == null) return null;
        for (n = +n, t = 0, i = this.byteUnits.length - 1; n >= 1e3 && t < i;) n /= 1024, t++;
        return r = "n" + this.getDecimalPlaceCount(n, 3), u = Math.round, Math.round = function (n) {
            return n
        }, f = this.format(n, r), Math.round = u, GleamTech.Util.Language.getEntry("Label.ByteSizeUnit." + this.byteUnits[t], f)
    }, formatKBSize: function (n) {
        var t, i;
        return n == null ? null : (n = +n, n /= 1024, t = Math.round, Math.round = function (n) {
            return Math.ceil(n)
        }, i = this.format(n, "n0"), Math.round = t, GleamTech.Util.Language.getEntry("Label.ByteSizeUnit.KB", i))
    }, getDecimalPlaceCount: function (n, t) {
        for (var o, r = n.toString(), u = 0, f = 0, e = !1, i = 0, s = r.length; i < s; i++)
            if (o = r.charAt(i), o == "." && (e = !0), e && f++, u++, u == t) break;
        return f
    }
});
Ext.define("GleamTech.Util.Path", {
    singleton: !0,
    backSlash: "\\",
    forwardSlash: "/",
    getExtension: function (n, t) {
        for (var u = "", r = n.length, i = r; --i >= 1;)
            if (n.charAt(i) == ".") {
                t && i++;
                u = i != r - 1 ? n.substr(i, r - i) : "";
                break
            }
        return u
    }, getFileNameWithoutExtension: function (n) {
        var t = this.getExtension(n);
        return n.substr(0, n.length - t.length)
    }, combine: function (n, t, i) {
        return i || (i = this.forwardSlash), n[n.length - 1] != i ? n + i + t : n + t
    }, isValidFileName: function (n) {
        return !/[\/:\*\?"<>|\\]/.test(n)
    }
});
Ext.define("GleamTech.UI.Sprite", {
    constructor: function (n) {
        this.spriteCls = n
    }, getIcon: function (n) {
        if (!n) return null;
        var t = this.spriteCls;
        return {
            getIconCls: function (i) {
                return Ext.String.format("{0} icon-{1}{2}", t.toLowerCase(), n.toLowerCase(), i || "16")
            }, getScale: function (n) {
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
Ext.define("GleamTech.UI.ControlBase", {
    config: {
        serverStateId: "",
        serverHandlerUrl: "",
        showOnLoad: !0,
        fullViewport: !1,
        modalDialog: !1,
        modalDialogTitle: ""
    },
    constructor: function () {
        this.actions = {}
    }, registerAction: function (n, t) {
        this.actions[n.toLowerCase()] = t
    }, getAction: function (n) {
        return this.actions[n.toLowerCase()]
    }, addActions: function (n, t) {
        for (var r, i = 0; i < n.length; i++) r = n[i], this.addAction(r.actionName, r.languageKey, t.getIcon(r.iconName))
    }, addAction: function (n, t, i) {
        var r = new Ext.Action({
            text: t ? GleamTech.Util.Language.getEntry(t) : "",
            handler: this.onActionHandler,
            scope: this,
            actionName: n
        });
        return r.iconObj = i, this.registerAction(n, r), r
    }, applyAction: function (n, t, i) {
        var r = this.getAction(t);
        return n.baseAction = r, n.itemId = t, Ext.applyIf(n, r.initialConfig), r.iconObj && !n.iconCls && (n.iconCls = r.iconObj.getIconCls(i), n.scale = r.iconObj.getScale(i)), (n.enableToggle || n.toggleGroup) && (n.toggleHandler = n.handler, n.handler = null), n
    }, onActionHandler: function (n, t) {
        var i = Ext.callback(this.onActionHandlerBegin, this, [n, t]);
        Ext.callback(this["onAction" + n.baseAction.initialConfig.actionName], this, [n, t, i]);
        Ext.callback(this.onActionHandlerEnd, this, [n, t])
    }, onActionHandlerBegin: Ext.emptyFn,
    onActionHandlerEnd: Ext.emptyFn,
    callServerHandlerMethod: function (n) {
        n.parameters = Ext.apply({
            stateId: this.serverStateId
        }, n.parameters);
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
    }, serverHandlerMethodCallback: function (n, t, i) {
        var s = null,
            r = null,
            o, h, u, f, e;
        if (t)
            if (o = i.getResponseHeader("Content-Type"), h = o && o.indexOf("application/json") != -1, h)
                if (u = Ext.decode(i.responseText, !0), u == null) t = !1, r = {
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
                details: f.Type ? f : null,
                detailsType: "json"
            }
        } else t = !1, r = {
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
        } : {
            title: "Connection Error",
            msg: i.statusText
        };
        Ext.callback(this.onServerHandlerMethodEnd, this, [n.methodInfo, r]);
        Ext.callback(n.methodInfo.callback, n.scope, [t, s])
    }, onServerHandlerMethodBegin: Ext.emptyFn,
    onServerHandlerMethodEnd: Ext.emptyFn,
    getServerHandlerMethodProxy: function (n) {
        var t = new Ext.data.proxy.Server({
                reader: "json",
                url: "null"
            }),
            i = this;
        return Ext.override(t, {
            doRequest: function (r, u, f) {
                var e = this.buildRequest(r),
                    o = Ext.callback(n.methodInfoCallback, n.scope || this, [r]);
                return Ext.apply(o, {
                    callback: function (i, o) {
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
                }), i.callServerHandlerMethod(o), e
            }
        }), t
    }, refreshPage: function () {
        window.location.href.indexOf("#") == -1 ? window.location.href = window.location.href : window.location.reload()
    }, createUniqueId: function () {
        return (new Date).getTime() + "" + Math.floor(Math.random() * 8999 + 1e3)
    }, renderDynamic: function () {
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
                show: function () {
                    this.callParent(arguments);
                    n.show()
                }, hide: function () {
                    n.hidingFromChild = !0;
                    n.hide();
                    delete n.hidingFromChild;
                    this.callParent(arguments)
                }
            });
            n.on("hide", function () {
                n.hidingFromChild || this.hide()
            }, this)
        } else this.hidden = !this.showOnLoad, this.initialConfig.resizeHandles || (this.resizeHandles = "s e se"); if (this.fullViewport) this.border = !1, r = new Ext.container.Viewport({
            layout: "fit",
            items: n || this
        });
        else {
            t = Ext.getDom(this.id + "-loader");
            i = n || this;
            i.render(t.parentNode, t);
            Ext.on("resize", function () {
                i.updateLayout()
            })
        }
        n && this.showOnLoad && n.show()
    }
});
var controlsToRender = controlsToRender || [];
Ext.onReady(function () {
    for (var t, n = 0; n < controlsToRender.length; n++) t = Ext.create(controlsToRender[n]), t.renderDynamic(), window[t.id] = t
});
Ext.define("GleamTech.UI.MessageBox", {
    extend: "Ext.window.MessageBox",
    resizable: !0,
    detailsPanel: null,
    initComponent: function () {
        this.callParent();
        this.msg.addCls("x-pre-wrap")
    }, reconfigure: function (n) {
        this.callParent(arguments);
        this.toggleResizer(n.resizable === !0);
        this.detailsPanel && (this.remove(this.detailsPanel), this.detailsPanel = null);
        n.details && this.addDetailsPanel(n.details, n.detailsType)
    }, onShow: function () {
        var t, n, i, r;
        this.callParent(arguments);
        t = this;
        n = t.resizer;
        t.cfg.resizable && n && (i = t.getSize(), r = n.resizeTracker, n.minWidth = r.minWidth = i.width, n.minHeight = r.minHeight = i.height)
    }, toggleResizer: function (n) {
        for (var i = this.resizer, r = i.handles, f = r.length, e = i.possiblePositions, u, t = 0; t < f; t++)(u = i[e[r[t]]]) && u.el.setDisplayed(n)
    }, addDetailsPanel: function (n, t) {
        if (this.detailsPanel = new Ext.panel.Panel({
            title: "Details",
            collapsible: !0,
            collapsed: !0,
            titleCollapse: !0,
            animCollapse: !1,
            layout: "fit",
            height: 150,
            flex: 1,
            listeners: {
                beforecollapse: function () {
                    this.height = null
                }, scope: this
            }
        }), t == "html") this.detailsPanel.add(new Ext.Component({
            renderTpl: ['<iframe src="javascript:&quot;&quot;" name="{frameName}" width="100%" height="100%" frameborder="0"><\/iframe>'],
            renderSelectors: {
                iframeEl: "iframe"
            },
            listeners: {
                afterrender: function (t) {
                    try {
                        var i = t.iframeEl.dom.contentDocument || t.iframeEl.dom.contentWindow.document;
                        i.write(n);
                        i.close()
                    } catch (r) {}
                }
            }
        }));
        else if (t == "json") {
            var i = function (n, t) {
                    var r, u, f;
                    for (r in n) u = typeof n[r] == "object", t.children || (t.children = []), f = {
                        propertyName: r,
                        propertyValue: u ? "" : n[r],
                        leaf: !u,
                        iconCls: "x-tree-no-icon"
                    }, t.children.push(f), u && i(n[r], f)
                },
                r = {
                    expanded: !0
                };
            i(n, r);
            this.detailsPanel.add(new Ext.tree.Panel({
                rootVisible: !1,
                useArrows: !0,
                columnLines: !0,
                rowLines: !0,
                cls: "x-property-tree",
                columns: {
                    items: [{
                        xtype: "treecolumn",
                        text: "Property",
                        dataIndex: "propertyName",
                        autoSizeColumn: !0
                    }, {
                        text: "Value",
                        dataIndex: "propertyValue",
                        innerCls: "x-pre",
                        autoSizeColumn: !0
                    }]
                },
                root: r,
                viewConfig: {
                    listeners: {
                        viewready: function (n) {
                            Ext.each(n.panel.columns, function (n) {
                                n.autoSizeColumn === !0 && n.autoSize()
                            })
                        }
                    }
                },
                listeners: {
                    render: function (n) {
                        n.el.on("contextmenu", function (n) {
                            n.stopEvent()
                        })
                    }, afterrender: function (n) {
                        var t = n.getView();
                        n.add(new Ext.tip.ToolTip({
                            view: t,
                            target: t.el,
                            delegate: t.cellSelector,
                            dismissDelay: 0,
                            showDelay: 800,
                            shadow: "drop",
                            cls: "x-pre",
                            maxWidth: null,
                            listeners: {
                                beforeshow: function (n) {
                                    var t = n.view,
                                        r = t.getRecord(n.triggerElement),
                                        i = t.getHeaderByCell(n.triggerElement).dataIndex,
                                        u = t.getColumnManager().getHeaderByDataIndex(i).initialConfig.renderer,
                                        f = u ? u(r.get(i)) : r.get(i);
                                    n.update(f)
                                }
                            }
                        }))
                    }
                }
            }))
        } else this.detailsPanel.add(new Ext.form.field.TextArea({
            readOnly: !0,
            value: n
        }));
        this.add(this.detailsPanel)
    }, errorWithDetails: function (n, t, i, r) {
        var u = {
            title: n,
            msg: t,
            details: i,
            detailsType: r,
            resizable: !0,
            minWidth: 400,
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        };
        this.show(u)
    }, onPromptKey: function (n, t) {
        var i = this;
        (t.keyCode === t.RETURN || t.keyCode === 10) && (i.msgButtons.ok.isVisible() && !i.msgButtons.ok.isDisabled() ? i.msgButtons.ok.handler.call(i, i.msgButtons.ok) : i.msgButtons.yes.isVisible() && i.msgButtons.yes.handler.call(i, i.msgButtons.yes))
    }, promptWithValidator: function (n, t, i, r, u, f, e) {
        var s = this.textField,
            o = this.msgButtons.ok;
        e(u) === !1 && o.disable();
        this.prompt(n, t, function (n, t, u) {
            s.validator = null;
            o.enable();
            Ext.callback(i, r, [n, t, u])
        }, r, !1, u);
        s.selectText(0, f);
        s.validator = function (n) {
            var t = e(n);
            return t === !0 ? (o.enable(), !0) : t === !1 ? (o.disable(), !0) : (o.disable(), t)
        }
    }
});
Ext.define("GleamTech.UI.Ribbon", {
    extend: "Ext.tab.Panel",
    floatCls: Ext.baseCSSPrefix + "border-region-slide-in",
    initComponent: function () {
        Ext.apply(this, {
            collapsible: !0,
            hideCollapseTool: !0,
            collapseMode: "header",
            animCollapse: !1,
            cls: "x-ribbon",
            minHeight: 120,
            listeners: {
                afterRender: function () {
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
    }, updateHeader: function () {
        this.tabBar.isHeader = !0;
        this.header = this.tabBar;
        this.callParent(arguments)
    }, initTabConfig: function (n) {
        if (n.xtype = n.xtype || "toolbar", n.border = !1, n.layout = {
            align: "stretch"
        }, n.cls = "x-unselectable", n.tabConfig = {
            focusable: !1
        }, Ext.isArray(n.items))
            for (var t = 0; t < n.items.length; t++) this.initGroupConfig(n.items[t])
    }, initGroupConfig: function (n) {
        var i, t, r;
        if (n.xtype = n.xtype || "buttongroup", n.layout = n.layout || {
            type: "hbox"
        }, n.headerPosition = n.headerPosition || "bottom", n.frame = !1, Ext.isArray(n.items))
            for (i = 0; i < n.items.length; i++)
                if (t = n.items[i], t.xtype == "container")
                    for (t.listeners = {
                        beforeadd: function (n, t) {
                            t.isButton && (t.ui = t.ui + "-toolbar")
                        }
                    }, r = 0; r < t.items.length; r++) this.initItemConfig(t.items[r]);
                else this.initItemConfig(t)
    }, initItemConfig: function (n) {
        n.xtype = n.xtype || "button";
        n.focusable = !1;
        n.iconCls && (n.iconAlign == "top" || n.iconAlign == "bottom") && (n.iconCls += " " + this.getCenterCls(n.scale), n.scale == "large" && (n.text = this.getWrappedText(n.text, 8, "<br/>"), n.menu && (n.arrowVisible = !1, n.text += ' <span class="x-btn-inline-arrow"><\/span>')));
        n.menu || (n.listeners = n.listeners = n.listeners || {}, n.listeners.click = {
            fn: this.handleItemClick,
            scope: this
        })
    }, getWrappedText: function (n, t, i) {
        var u, f;
        if (n.length < t) return n;
        var o = n.match(/\S+/g),
            e = [],
            r = "";
        for (u = 0; u < o.length; u++) f = o[u], r.length > 0 && (r.length > t || r.length + f.length > t) && (e.push(r), r = ""), r += r.length > 0 ? " " + f : f;
        return r.length > 0 && e.push(r), e.join(i)
    }, addTab: function (n) {
        this.initTabConfig(n);
        var t = new Ext.toolbar.Toolbar(n);
        this.add(t)
    }, insertTab: function (n, t) {
        this.initTabConfig(t);
        var i = new Ext.toolbar.Toolbar(t);
        this.insert(n, i)
    }, addGroup: function (n, t) {
        this.initGroupConfig(t);
        var i = new Ext.container.ButtonGroup(t);
        n.add(i)
    }, insertGroup: function (n, t, i) {
        this.initGroupConfig(i);
        var r = new Ext.container.ButtonGroup(i);
        n.insert(t, r)
    }, getCenterCls: function (n) {
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
    }, createCollapseButton: function () {
        return new Ext.button.Button({
            ui: "default-toolbar",
            iconCls: this.collapsed ? "gt-icon-down-short" : "gt-icon-up-short",
            handler: this.onCollapseButtonClick,
            scope: this,
            focusable: !1
        })
    }, onCollapseButtonClick: function () {
        this.floatedFromCollapse && this.makeUnfloated();
        this.toggleCollapse()
    }, toggleCollapse: function () {
        this.callParent();
        this.updateTabBarUI()
    }, expand: function () {
        this.tabBar.activeTab.activate(!0);
        this.callParent()
    }, updateTabBarUI: function () {
        this.collapseButton.setIconCls(this.floatedFromCollapse ? "gt-icon-pin" : this.collapsed ? "gt-icon-down-short" : "gt-icon-up-short");
        this.collapsed ? this.tabBar.items.each(function (n) {
            if (n.isTab) n.el.on("mousedown", this.makeFloated, this)
        }, this) : this.tabBar.items.each(function (n) {
            n.isTab && n.el.un("mousedown", this.makeFloated, this)
        }, this);
        this.collapsed ? this.tabBar.activeTab.deactivate(!0) : this.tabBar.activeTab.activate(!0)
    }, makeFloated: function () {
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
    }, makeUnfloated: function () {
        this.removeCls(this.floatCls);
        this.floatedFromCollapse = null;
        this.collapse();
        this.updateTabBarUI();
        Ext.getDoc().un({
            mousedown: this.handleMouseDown,
            scope: this,
            capture: !0
        })
    }, handleMouseDown: function (n) {
        var t = n.getTarget("div[id=" + this.id + "]");
        t == null && this.makeUnfloated()
    }, handleItemClick: function () {
        this.floatedFromCollapse && this.makeUnfloated()
    }, toggleItemsUICondition: function (n) {
        Ext.isFunction(n) && (Ext.suspendLayouts(), this.items.each(function (t) {
            t.items.each(function (t) {
                var i = 0;
                t.items.each(function (t) {
                    t.xtype != "tbseparator" && (t.xtype == "container" ? t.items.each(function (t) {
                        t.toggleUICondition(n);
                        t.hidden || i++
                    }) : (t.toggleUICondition(n), t.hidden || i++))
                });
                i == 0 ? t.hide() : t.show()
            })
        }), Ext.resumeLayouts(!0))
    }
});
Ext.define("GleamTech.UI.Breadcrumb", {
    extend: "Ext.toolbar.Breadcrumb",
    showIcons: !1,
    initComponent: function () {
        this.callParent(arguments);
        this.refreshSelectionBuffered = Ext.Function.createBuffered(this.refreshSelection, 200);
        this.fieldsToWatch = ["loaded", "expandable", this.displayField]
    }, updateStore: function (n, t) {
        if (this.callParent(arguments), t && t.un("update", this.onNodeChildrenChange, this), n) n.on("update", this.onNodeChildrenChange, this)
    }, onNodeChildrenChange: function (n, t, i, r) {
        r && this.selection && (t == this.selection || t.contains(this.selection)) && Ext.Array.each(r, function (n) {
            return Ext.Array.indexOf(this.fieldsToWatch, n) > -1 ? (this.refreshSelectionBuffered(), !1) : !0
        }, this)
    }, refreshSelection: function () {
        this._needsSync = !0;
        this.suspendEvent("selectionchange");
        this.updateSelection(this.selection);
        this.resumeEvent("selectionchange")
    }, setSelection: function (n, t, i) {
        this.isConfiguring && (i = !0);
        t && (this._needsSync = !0);
        i && this.suspendEvent("selectionchange");
        this.callParent(arguments);
        i && this.resumeEvent("selectionchange")
    }, updateSelection: function (n) {
        var i = this,
            e = i._buttons,
            y = [],
            h = i.items.getCount(),
            w = i._needsSync,
            b = i.getDisplayField(),
            c, l, f, a, v, r, o, t, p, s, u;
        if (Ext.suspendLayouts(), n) {
            for (r = n, s = n.get("depth"), v = s + 1, u = s; r;) {
                if (p = r.getId(), t = e[u], !w && t && t._breadcrumbNodeId === p) break;
                o = r.get(b);
                t ? t.setText(o) : t = e[u] = Ext.create({
                    xtype: i.getUseSplitButtons() ? "splitbutton" : "button",
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
                        alignOffset: [-34, 0],
                        cls: "x-breadcrumb-menu"
                    },
                    menuAlign: "tl-br?",
                    handler: "_onButtonClick",
                    scope: i
                });
                o.length == 0 ? (t.addCls("x-no-text"), t.setText("&#160;")) : t.removeCls("x-no-text");
                c = this.getShowIcons();
                c !== !1 && (l = r.get("glyph"), a = r.get("icon"), f = r.get("iconCls"), l ? (t.setGlyph(l), t.setIcon(null), t.setIconCls(f)) : a ? (t.setGlyph(null), t.setIconCls(null), t.setIcon(a)) : f ? (t.setGlyph(null), t.setIcon(null), t.setIconCls(f)) : c ? (t.setGlyph(null), t.setIcon(null), t.setIconCls((r.isLeaf() ? i._leafIconCls : i._folderIconCls) + "-" + i.ui)) : (t.setGlyph(null), t.setIcon(null), t.setIconCls(null)));
                t.setArrowVisible(r.hasChildNodes());
                t._breadcrumbNodeId = r.getId();
                r = r.parentNode;
                u--
            }
            if (this.showIcons === !1 && (f = n.get("iconCls"), t = e[0], f && t.setIconCls(f)), i.removeCls("x-breadcrumb-empty"), v > h) y = e.slice(h, s + 1), i.add(y);
            else
                for (u = h - 1; u >= v; u--) i.remove(i.items.items[u], !1)
        } else i.removeAll(!1), i.addCls("x-breadcrumb-empty");
        Ext.resumeLayouts(!0);
        i.fireEvent("selectionchange", i, n);
        i._needsSync = !1
    }, privates: {
        _onMenuClick: function (n, t) {
            t && this.setSelection(this.getStore().getNodeById(t._breadcrumbNodeId))
        }, _onMenuBeforeShow: function (n) {
            var t = this,
                c = t.getStore().getNodeById(n.ownerCmp._breadcrumbNodeId),
                v = t.getDisplayField(),
                l = t.getShowMenuIcons(),
                e, i, o, s, u, h, f, a, r;
            if (c.hasChildNodes()) {
                for (e = c.childNodes, s = [], u = 0, a = e.length; u < a; u++) i = e[u], r = {
                    text: i.get(v),
                    _breadcrumbNodeId: i.getId()
                }, l !== !1 && (o = i.get("glyph"), h = i.get("icon"), f = i.get("iconCls"), o ? (r.glyph = o, r.iconCls = f) : h ? r.icon = h : f ? r.iconCls = f : l && (r.iconCls = (i.isLeaf() ? t._leafIconCls : t._folderIconCls) + "-" + t.ui)), t.selection && (i == t.selection || i.contains(t.selection)) && (r.cls = "x-menu-item-bold"), s.push(r);
                n.removeAll();
                n.add(s)
            } else return !1
        }
    }
});
Ext.define("GleamTech.UI.SearchField", {
    extend: "Ext.form.field.Text",
    triggers: {
        search: {
            cls: "x-form-trigger-search"
        },
        clear: {
            cls: "x-form-trigger-clear",
            hidden: !0,
            handler: function (n) {
                n.reset()
            }
        }
    },
    initComponent: function () {
        this.callParent();
        this.on("change", this.updateTriggerUI, this, {
            priority: 1
        });
        this.addCls("x-no-ms-clear")
    }, updateTriggerUI: function (n, t) {
        t.length == 0 ? (this.triggers.clear.setHidden(!0), this.triggers.search.setHidden(!1)) : (this.triggers.search.setHidden(!0), this.triggers.clear.setHidden(!1))
    }, reset: function (n) {
        n && this.suspendCheckChange++;
        this.callParent();
        n && (this.suspendCheckChange--, this.triggers.clear.setHidden(!0), this.triggers.search.setHidden(!1))
    }
});
Ext.define("GleamTech.UI.DragSelector", {
    extend: "Ext.util.Observable",
    requires: ["Ext.dd.DragTracker", "Ext.util.Region"],
    alias: "plugin.ux.dragselector",
    dragging: !1,
    scrollTopStart: 0,
    scrollTop: 0,
    targetDragSelector: ".dragselect",
    dragSafe: !1,
    scrollSpeed: 10,
    constructor: function (n) {
        var t = this;
        t.callParent([n])
    }, init: function (n) {
        var t = this;
        (n.isPanel ? (t.grid = n, t.view = n.getView()) : t.view = n, t.selModel = t.view.getSelectionModel(), t.selModel.getSelectionMode() != "SINGLE") && t.mon(t.view, "render", t.onRender, t)
    }, onRender: function () {
        var n = this;
        n.tracker = new Ext.dd.DragTracker({
            view: n.view,
            dragSelector: n,
            el: n.view.el,
            preventDefault: !1,
            onBeforeStart: Ext.Function.bind(n.onBeforeStart, n),
            onStart: Ext.Function.bind(n.onStart, n),
            onDrag: Ext.Function.bind(n.onDrag, n),
            onEnd: Ext.Function.bind(n.onEnd, n)
        });
        n.dragRegion = new Ext.util.Region;
        n.scroller = n.view.getEl();
        n.mon(n.scroller, "scroll", n.syncScroll, n)
    }, syncScroll: function (n) {
        var t = this.scroller.getScroll().top;
        if (this.scrollTop = t - this.scrollTopStart, this.fillRegions(), this.dragging) this.onDrag(n, !0)
    }, fillAllRegions: function () {
        var n = this,
            t = n.objectsSelected = [];
        n.mainRegion = n.scroller.getRegion();
        n.bodyRegion = n.scroller.getRegion();
        n.mainRegion.right = n.bodyRegion.right -= n.scrollbarWidth;
        n.mainRegion.bottom = n.bodyRegion.bottom -= n.scrollbarHeight;
        Ext.Object.each(n.view.all.elements, function () {
            t.push(n.selModel.isSelected(t.length))
        }, n);
        n.syncScroll()
    }, fillRegions: function () {
        var t = this.rs = [],
            n = this.view;
        Ext.Object.each(n.all.elements, function (i, r) {
            t.push({
                region: Ext.util.Region.getRegion(r),
                record: n.getRecord(r)
            })
        })
    }, onBeforeStart: function (n) {
        if (n.button === 1) return !1;
        var t = n.getTarget(null, null, !0),
            i, r;
        return t.hasCls("x-select-target") || (i = this.view.findItemByChild(t)) && (r = this.view.getRecord(i)) && this.selModel.isSelected(r) ? !1 : (this.scrollbarWidth = this.scroller.dom.offsetWidth - this.scroller.dom.clientWidth, this.scrollbarHeight = this.scroller.dom.offsetHeight - this.scroller.dom.clientHeight, n.getX() > this.scroller.getX() + this.scroller.dom.clientWidth - 2 || n.getY() > this.scroller.getY() + this.scroller.dom.clientHeight - 2) ? !1 : (this.ctrlState = n.ctrlKey, this.shiftState = n.shiftKey, Ext.menu.Manager.hideAll(), !0)
    }, onStart: function () {
        var n = this;
        n.scrollTopStart = n.scroller.getScroll().top;
        n.fillAllRegions();
        n.createProxy().show();
        n.dragging = !0;
        n.view.on("beforecontainerclick", n.cancelEvent, n, {
            single: !0
        })
    }, cancelEvent: function () {
        return !1
    }, createProxy: function () {
        if (this.proxy && !this.proxy.isDestroyed) {
            var n = this.view.getEl();
            return n.last() != this.proxy && n.appendChild(this.proxy), this.proxy
        }
        return this.proxy = this.view.getEl().createChild({
            tag: "div",
            cls: "x-view-selector"
        }), this.proxy
    }, onDrag: function (n, t) {
        var i = this,
            f = i.selModel,
            k = i.proxy,
            v = i.bodyRegion,
            y = i.dragRegion,
            u = i.tracker.startXY,
            r = i.tracker.getXY(),
            p = Math.min(u[0], r[0]),
            c = Math.min(u[1], r[1]) - i.scrollTop,
            w = Math.abs(u[0] - r[0]),
            l = Math.abs(u[1] - r[1]) + i.scrollTop,
            e, a;
        for (r[0] < u[0] && !t && (r[0] += 2), i.scrollTop >= 0 ? (u[1] - i.scrollTop > r[1] && (c = r[1], l = Math.abs(u[1] - r[1]) - i.scrollTop), v.top = v.y -= i.scrollTop) : (u[1] - i.scrollTop > r[1] && (c = r[1], l = Math.abs(u[1] - i.scrollTop - r[1])), v.bottom -= i.scrollTop), w == 0 && (w = 1), l == 0 && (l = 1), Ext.apply(y, {
            top: c,
            y: c,
            left: p,
            x: p,
            right: p + w,
            bottom: c + l
        }), y.constrainTo(v), k.setBox(y), e = i.scroller, a = 0; a < i.rs.length; a++) {
            var b = i.rs[a],
                s = y.intersect(b.region),
                o = b.record,
                h = f.isSelected(o),
                d = i.objectsSelected[a];
            i.ctrlState ? d ? s && h ? f.deselect(o) : s || h || f.select(o, !0) : s && !h ? f.select(o, !0) : !s && h && f.deselect(o) : s && !h ? f.select(o, !0) : !s && h && f.deselect(o)
        }
        r[1] + 10 >= i.mainRegion.bottom && (Ext.isIE ? setTimeout(function () {
            e.scrollTo("top", e.getScroll().top + 40)
        }, 100) : i.setScrollTop(e.getScroll().top + i.scrollSpeed));
        r[1] - 10 <= i.mainRegion.top && (Ext.isIE ? setTimeout(function () {
            e.scrollTo("top", e.getScroll().top - 40)
        }, 100) : i.setScrollTop(e.getScroll().top - i.scrollSpeed))
    }, setScrollTop: function (n) {
        var t = this.scroller.dom;
        t.scrollTop = Ext.Number.constrain(n, 0, t.scrollHeight - t.clientHeight)
    }, onEnd: function () {
        var n = this;
        n.dragging = !1;
        n.proxy.hide();
        setTimeout(function () {
            n.view.un("beforecontainerclick", n.cancelEvent, n)
        }, 100)
    }
});
Ext.define("GleamTech.UI.MultiView", {
    extend: "Ext.container.Container",
    config: {
        store: null,
        columns: null,
        viewLayout: "details",
        multipleSelection: !0,
        emptyText: "",
        getItemIconClsFn: function () {
            return ""
        }, getItemIconClsScope: null,
        getItemThumbnailSrcFn: function () {
            return ""
        }, getItemThumbnailSrcScope: null,
        autoInitLazyImageLoader: !0
    },
    viewLayoutTypes: [{
        name: "extralargeicons",
        iconSize: 256,
        component: "dataview"
    }, {
        name: "largeicons",
        iconSize: 96,
        component: "dataview"
    }, {
        name: "mediumicons",
        iconSize: 48,
        component: "dataview"
    }, {
        name: "smallicons",
        iconSize: 16,
        component: "dataview"
    }, {
        name: "details",
        iconSize: 16,
        component: "gridpanel"
    }, {
        name: "tiles",
        iconSize: 48,
        component: "dataview"
    }],
    activeViewComponent: null,
    lazyImageLoader: null,
    toolTip: null,
    deferEmptyText: !0,
    getItemNameFn: null,
    getItemTileFirstValueFn: function () {
        return ""
    }, getItemTileSecondValueFn: function () {
        return ""
    }, getItemToolTipValueFns: null,
    initComponent: function () {
        Ext.apply(this, {
            layout: {
                type: "fit"
            }
        });
        this.callParent();
        this.initColumnsConfig();
        this.fireEvent("afterInitComponent")
    }, onDestroy: function () {
        this.callParent();
        Ext.destroy(this.toolTip)
    }, initColumnsConfig: function () {
        for (var n, t = 0; t < this.columns.length; t++) n = this.columns[t], Ext.apply(n, {
            renderer: this.getColumnRendererWithFormatter(n.formatterFn, n.isPrimary ? this.iconColumnRenderer : this.columnRenderer),
            scope: this
        }), n.isPrimary ? this.getItemNameFn = this.getFieldGetterWithFormatter(n.formatterFn, n.dataIndex) : (n.tdCls = "x-item-value", n.isTileFirstValue ? this.getItemTileFirstValueFn = this.getFieldGetterWithFormatter(n.tileFormatterFn || n.formatterFn, n.dataIndex) : n.isTileSecondValue && (this.getItemTileSecondValueFn = this.getFieldGetterWithFormatter(n.tileFormatterFn || n.formatterFn, n.dataIndex)), n.isToolTipValue && (this.getItemToolTipValueFns || (this.getItemToolTipValueFns = []), this.getItemToolTipValueFns.push({
            text: n.text,
            getter: this.getFieldGetterWithFormatter(n.tileFormatterFn || n.formatterFn, n.dataIndex)
        })));
        this.getItemNameFn == null && (this.getItemNameFn = this.getFieldGetterWithFormatter(this.columns[0].formatterFn, this.columns[0].dataIndex))
    }, getColumnRendererWithFormatter: function (n, t) {
        return Ext.isFunction(n) ? function (i, r, u) {
            return i = n(i, u), t.apply(this, [i, r, u])
        } : t
    }, getFieldGetterWithFormatter: function (n, t) {
        return Ext.isFunction(n) ? function (i) {
            var r = i.data[t];
            return n(r, i)
        } : function (n) {
            return n.data[t]
        }
    }, setViewLayout: function (n) {
        var u, t, i, f, r;
        if (this.isConfiguring) {
            this.on({
                afterInitComponent: function () {
                    this.setViewLayout(n)
                }, scope: this,
                single: !0
            });
            return
        }
        if (u = n.toLowerCase(), t = Ext.Array.findBy(this.viewLayoutTypes, function (n) {
            return n.name == u
        }), !t) throw new Error(Ext.String.format('"{0}" is not a valid layout type for MultiView.', n));
        (i = this.viewLayout, t != i) && (this.viewLayout = t, i && i.component == t.component ? (f = i.component == "gridpanel" ? this.activeViewComponent.getView() : this.activeViewComponent, f.refresh()) : (Ext.suspendLayouts(), this.activeViewComponent && (r = this.activeViewComponent.getSelectionModel().getSelection(), this.remove(this.activeViewComponent, !0)), this.activeViewComponent = t.component == "gridpanel" ? this.createGridPanel() : this.createDataView(), r && this.activeViewComponent.getSelectionModel().selected.add(r), this.add(this.activeViewComponent), Ext.resumeLayouts(!0), this.deferEmptyText = !1))
    }, createGridPanel: function () {
        return new Ext.grid.Panel({
            store: this.store,
            columns: this.columns,
            rowLines: !1,
            forceFit: !0,
            viewConfig: {
                stripeRows: !1,
                emptyText: this.emptyText,
                deferEmptyText: this.deferEmptyText,
                loadMask: !1,
                listeners: {
                    afterrender: {
                        fn: this.onViewAfterRender,
                        scope: this
                    },
                    containercontextmenu: {
                        fn: this.onContainerContextMenu,
                        scope: this
                    },
                    itemcontextmenu: {
                        fn: this.onItemContextMenu,
                        scope: this
                    },
                    itemdblclick: {
                        fn: this.onItemDblClick,
                        scope: this
                    },
                    refresh: {
                        fn: this.onRefresh,
                        scope: this
                    },
                    destroy: {
                        fn: this.destroyLazyImageLoader,
                        scope: this
                    }
                }
            },
            selModel: {
                mode: this.multipleSelection ? "MULTI" : "SINGLE",
                ignoreRightMouseSelection: !0,
                deselectOnContainerClick: !0,
                listeners: {
                    selectionchange: this.throttle(this.onSelectionChange, 200, this)
                }
            },
            plugins: [{
                    ptype: "bufferedrenderer"
                },
                new GleamTech.UI.DragSelector
            ]
        })
    }, iconColumnRenderer: function (n, t, i) {
        var u = this.getItemIconClsFn.apply(this.getItemIconClsScope, [i, this.viewLayout.iconSize]),
            r = '<span class="x-grid-icon ' + u + ' x-select-target"><\/span>';
        return n == null ? r : r + '<span class="x-editable x-select-target">' + n + "<\/span>"
    }, columnRenderer: function (n) {
        return n == null ? null : '<span class="x-select-target">' + n + "<\/span>"
    }, createDataView: function () {
        var n = this;
        return new Ext.view.View({
            store: this.store,
            emptyText: '<div class="x-grid-empty">' + this.emptyText + "<\/div>",
            deferEmptyText: this.deferEmptyText,
            loadMask: !1,
            autoScroll: !0,
            trackOver: !0,
            cls: "x-dataview x-unselectable x-grid-body",
            overItemCls: "x-item-over",
            itemSelector: "li",
            tpl: ['<ul class="x-items">', '<tpl for=".">', '<li class="x-item {layoutCls}">', '<span class="x-item-icon {iconCls} x-select-target">', '<tpl if="itemThumbnailSrc">', '<span class="x-item-thumbnail"', '><img class="b-lazy" data-src="{itemThumbnailSrc}" data-fallbackIconCls="{fallbackIconCls}" src="{blankImageSrc}" /><', "/span>", "<\/tpl>", "<\/span", '<tpl if="isTile">', '><div class="multiline-vertical-center">', "<div>", '<span class="x-editable x-select-target">{itemName}<\/span>', '<tpl if="itemFirstValue">', '<br/><span class="x-item-value x-select-target">{itemFirstValue}<\/span>', "<\/tpl>", '<tpl if="itemSecondValue">', '<br/><span class="x-item-value x-select-target">{itemSecondValue}<\/span>', "<\/tpl>", "<\/div>", "<\/div>", "<tpl else>", '><span class="x-editable x-select-target">{itemName}<\/span>', "<\/tpl>", "<\/li>", "<\/tpl>", "<\/ul>"],
            prepareData: function (t, i, r) {
                var u = {
                        blankImageSrc: Ext.BLANK_IMAGE_URL,
                        layoutCls: "x-layout-" + n.viewLayout.name,
                        itemName: n.getItemNameFn(r)
                    },
                    e, o, f;
                return n.viewLayout.iconSize >= 32 && (e = {
                    32: 3,
                    48: 3,
                    96: 6,
                    256: 12
                }, o = n.viewLayout.iconSize - e[n.viewLayout.iconSize], u.itemThumbnailSrc = n.getItemThumbnailSrcFn.apply(n.getItemThumbnailSrcScope, [r, o])), f = n.getItemIconClsFn.apply(this.getItemIconClsScope, [r, n.viewLayout.iconSize]), u.itemThumbnailSrc ? u.fallbackIconCls = f : u.iconCls = f, n.viewLayout.name == "tiles" && (u.isTile = !0, u.itemFirstValue = n.getItemTileFirstValueFn(r), u.itemSecondValue = n.getItemTileSecondValueFn(r)), u
            }, listeners: {
                afterrender: {
                    fn: this.onViewAfterRender,
                    scope: this
                },
                containercontextmenu: {
                    fn: this.onContainerContextMenu,
                    scope: this
                },
                itemcontextmenu: {
                    fn: this.onItemContextMenu,
                    scope: this
                },
                itemdblclick: {
                    fn: this.onItemDblClick,
                    scope: this
                },
                refresh: {
                    fn: this.onRefresh,
                    scope: this
                },
                destroy: {
                    fn: this.destroyLazyImageLoader,
                    scope: this
                }
            }, selModel: {
                mode: this.multipleSelection ? "MULTI" : "SINGLE",
                ignoreRightMouseSelection: !0,
                deselectOnContainerClick: !0,
                listeners: {
                    selectionchange: this.throttle(this.onSelectionChange, 200, this)
                }
            }, plugins: [new GleamTech.UI.DragSelector]
        })
    }, throttle: function (n, t, i, r) {
        var f, e, s, u = null,
            o = 0,
            h;
        return r || (r = {}), h = function () {
                o = r.leading === !1 ? 0 : +new Date;
                u = null;
                s = n.apply(f, e);
                u || (f = e = null)
            },
            function () {
                var l = +new Date,
                    c;
                return o || r.leading !== !1 || (o = l), c = t - (l - o), f = i || this, e = arguments, c <= 0 || c > t ? (clearTimeout(u), u = null, o = l, s = n.apply(f, e), u || (f = e = null)) : u || r.trailing === !1 || (u = setTimeout(h, c)), s
            }
    }, onViewAfterRender: function (n) {
        this.toolTip ? (this.toolTip.view = n, this.toolTip.setTarget(n.el), this.toolTip.delegate = n.itemSelector) : this.toolTip = new Ext.tip.ToolTip({
            view: n,
            target: n.el,
            delegate: n.itemSelector,
            dismissDelay: 0,
            showDelay: 800,
            shadow: "drop",
            listeners: {
                render: function (n) {
                    n.el.on("contextmenu", function (n) {
                        n.stopEvent()
                    })
                }, beforeshow: {
                    fn: function (n) {
                        var t = n.view.getRecord(n.triggerElement),
                            i;
                        if (!t) return !1;
                        i = this.getItemNameFn(t);
                        Ext.Array.each(this.getItemToolTipValueFns, function (n) {
                            var r = n.getter(t);
                            r && (i += "<br/>" + n.text + ": " + r)
                        });
                        n.update(i)
                    }, scope: this
                }
            }
        })
    }, onContainerContextMenu: function (n) {
        return n.getSelectionModel().deselectAll(), this.fireEventArgs("containercontextmenu", arguments)
    }, onItemContextMenu: function (n, t, i, r, u) {
        var f = n.getSelectionModel(),
            e = u.getTarget(null, null, !0);
        return !e.hasCls("x-select-target") && !f.isSelected(t) ? n.fireEvent("containercontextmenu", n, u) : (f.isSelected(t) || f.selectWithEvent(t, u), this.fireEventArgs("itemcontextmenu", arguments))
    }, onItemDblClick: function () {
        return this.fireEventArgs("itemdblclick", arguments)
    }, onSelectionChange: function () {
        return this.fireEventArgs("selectionchange", arguments)
    }, onRefresh: function (n) {
        return this.viewLayout.component == "dataview" && ((this.viewLayout.name == "mediumicons" || this.viewLayout.name == "largeicons") && Ext.Object.each(n.all.elements, function (n, t) {
            var i = t.lastChild;
            i.style.display = "block";
            $clamp(i, {
                clamp: 4,
                useNativeClamp: !1
            });
            i.style.display = ""
        }), this.autoInitLazyImageLoader && this.initLazyImageLoader(n)), this.fireEventArgs("refresh", arguments)
    }, initLazyImageLoader: function (n, t) {
        if (this.viewLayout.iconSize < 32) {
            this.destroyLazyImageLoader();
            return
        }
        if (this.lazyImageLoader) this.lazyImageLoader.options.createImageFn = t, this.lazyImageLoader.revalidate();
        else {
            var i = this;
            this.lazyImageLoader = new Blazy({
                container: "#" + n.getEl().id,
                selector: "#" + n.getEl().id + " .b-lazy",
                beforeload: function (n) {
                    var i = Ext.get(n),
                        t = i.up(".x-item-icon");
                    t && t.addCls("x-loading")
                }, success: function (n) {
                    var t = Ext.get(n),
                        i = t.up(".x-item-icon");
                    i && i.removeCls("x-loading x-select-target");
                    t.addCls("x-select-target");
                    n.removeAttribute("data-fallbackIconCls")
                }, error: function (n) {
                    var i = Ext.get(n),
                        t;
                    i.setDisplayed("none");
                    t = i.up(".x-item-icon");
                    t && (t.removeCls("x-loading"), t.addCls(i.getAttribute("data-fallbackIconCls")));
                    n.removeAttribute("data-fallbackIconCls")
                }, createImageFn: t,
                customBindEvents: function (t, r) {
                    if (r) {
                        n.on("scroll", t.onManualScroll, t);
                        i.on("resize", t.onManualResize, t)
                    } else n.un("scroll", t.onManualScroll, t), i.un("resize", t.onManualResize, t)
                }
            })
        }
    }, destroyLazyImageLoader: function () {
        this.lazyImageLoader && (this.lazyImageLoader.destroy(), this.lazyImageLoader = null)
    }, getSelectionModel: function () {
        return this.activeViewComponent.getSelectionModel()
    }, clearEmptyEl: function () {
        var n = this.viewLayout.component == "gridpanel" ? this.activeViewComponent.getView() : this.activeViewComponent;
        n && n.clearEmptyEl()
    }
});
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
    initComponent: function () {
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
    }, setStatus: function (n) {
        var i = this;
        if (n = n || {}, Ext.suspendLayouts(), Ext.isString(n) && (n = {
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
        return Ext.resumeLayouts(!0), i
    }, clearStatus: function (n) {
        var t, i, r, u;
        return (n = n || {}, t = this, i = t.statusEl, n.threadId && n.threadId !== t.activeThreadId) ? t : (r = n.useDefaults ? t.defaultText : t.emptyText, u = n.useDefaults ? t.defaultIconCls ? t.defaultIconCls : "" : "", n.anim ? i.el.puff({
            remove: !1,
            useDisplay: !0,
            callback: function () {
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
    }, setText: function (n) {
        var t = this;
        return t.activeThreadId++, t.text = n || "", t.rendered && t.statusEl.setText(t.text), t
    }, getText: function () {
        return this.text
    }, setIcon: function (n) {
        var t = this;
        return t.activeThreadId++, n = n || "", t.rendered ? (t.currIconCls && (t.statusEl.removeCls(t.currIconCls), t.currIconCls = null), n.length > 0 && (t.statusEl.addCls(n), t.currIconCls = n)) : t.currIconCls = n, t
    }, busyActive: !1,
    showBusy: function () {
        this.busyActive || (this.busyActive = !0, Ext.suspendLayouts(), this.statusEl.addCls(this.busyIconCls), this.statusEl.setText(this.emptyText), this.separatorEl.hide(), this.secondaryStatusEl.setText(this.emptyText), Ext.resumeLayouts(!0))
    }, hideBusy: function () {
        this.busyActive && (this.busyActive = !1, Ext.suspendLayouts(), this.statusEl.removeCls(this.busyIconCls), this.statusEl.setText(this.text), this.text && this.text != this.emptyText && this.separatorEl.show(), this.secondaryStatusEl.setText(this.secondaryText), Ext.resumeLayouts(!0))
    }, busyCount: 0,
    setBusy: function (n) {
        n ? this.busyCount++ : this.busyCount--;
        this.busyCount < 0 && (this.busyCount = 0);
        this.busyCount == 1 ? this.busyTimeout = Ext.defer(this.showBusy, 200, this) : this.busyCount == 0 && (clearTimeout(this.busyTimeout), this.hideBusy())
    }, setPrimaryText: function (n) {
        this.text = n || this.emptyText;
        this.statusEl.setText(this.text);
        this.separatorEl.hidden && this.text && this.text != this.emptyText && this.separatorEl.show();
        this.secondaryStatusEl.setText(this.secondaryText || this.emptyText)
    }, setSecondaryText: function (n) {
        this.secondaryText = n || this.emptyText;
        this.secondaryStatusEl.el.update(this.secondaryText)
    }
});
Ext.define("GleamTech.UI.ReferrerIframe", {
    el: null,
    window: null,
    constructor: function (n) {
        this.parentEl = n
    }, setReferrer: function (n, t) {
        var r, i;
        if (this.el) {
            if (this.el.originalSrc == n) {
                Ext.callback(t, null, [!1]);
                return
            }
            r = this.el.id;
            this.el.remove();
            this.el = null
        }
        i = r || Ext.id(null, "referrer-iframe-");
        this.el = Ext.get(Ext.DomHelper.createDom({
            tag: "iframe",
            id: i,
            name: i,
            style: "display: none",
            src: n
        }));
        this.el.originalSrc = n;
        this.el.on("load", function () {
            Ext.callback(t, null, [!0])
        }, null, {
            single: !0
        });
        this.parentEl.appendChild(this.el);
        this.window = this.el.dom.contentWindow || window.frames[this.el.dom.name];
        !this.window.eval && this.window.execScript && this.window.execScript("null")
    }
});
Ext.define("GleamTech.UI.ExplorerView", {
    extend: "Ext.panel.Panel",
    mixins: {
        controlBase: "GleamTech.UI.ControlBase"
    },
    statics: {
        sprite: new GleamTech.UI.Sprite("explorerviewicons")
    },
    config: {
        showRibbon: !0,
        collapseRibbon: !1,
        showNavigationPane: !0,
        showPreviewPane: !1,
        showDetailsPane: !1,
        viewLayout: "details",
        viewMultipleSelection: !0,
        detailsViewLayoutThreshold: 1e3
    },
    width: 800,
    height: 600,
    ribbon: null,
    navigationBar: null,
    navigationPane: null,
    centerPane: null,
    previewPane: null,
    detailsPane: null,
    statusBar: null,
    messageBox: null,
    navigationStore: null,
    viewStore: null,
    navigationSelection: null,
    viewSelection: null,
    contextMenuSelection: null,
    isNavigationSelectionValid: !1,
    canUpNavigationSelection: !1,
    navigationViewContainerContextMenu: null,
    navigationViewItemContextMenu: null,
    viewContainerContextMenu: null,
    viewItemContextMenu: null,
    constructor: function (n) {
        this.mixins.controlBase.constructor.call(this, n);
        this.callParent(arguments)
    }, initComponent: function () {
        this.viewSelection = [];
        this.initLabels();
        this.initActions();
        this.initStores();
        var n = [];
        this.showRibbon && n.push(this.ribbon = this.createRibbon());
        n.push(this.navigationBar = this.createNavigationBar());
        this.showNavigationPane && n.push(this.navigationPane = this.createNavigationPane());
        n.push(this.centerPane = this.createCenterPane());
        this.showPreviewPane && n.push(this.previewPane = this.createPreviewPane());
        this.showDetailsPane && n.push(this.detailsPane = this.createDetailsPane());
        n.push(this.statusBar = this.createStatusBar());
        n.push(this.messageBox = this.createMessageBox());
        Ext.apply(this, {
            defaults: {
                border: !1
            },
            layout: {
                type: "border"
            },
            items: n
        });
        this.callParent()
    }, onDestroy: function () {
        this.callParent();
        Ext.destroy(this.navigationStore, this.viewStore, this.navigationViewContainerContextMenu, this.navigationViewItemContextMenu, this.viewContainerContextMenu, this.viewItemContextMenu)
    }, initLabels: function () {
        this.emptyViewText = GleamTech.Util.Language.getEntry("Message.EmptyView");
        this.emptyNavigationViewText = this.emptyViewText
    }, initActions: function () {
        this.addActions([{
            actionName: "SelectAll",
            languageKey: "Label.SelectAll",
            iconName: "SelectAll"
        }, {
            actionName: "SelectNone",
            languageKey: "Label.SelectNone",
            iconName: "SelectNone"
        }, {
            actionName: "InvertSelection",
            languageKey: "Label.InvertSelection",
            iconName: "InvertSelection"
        }, {
            actionName: "ToggleNavigationPane",
            languageKey: "Label.NavigationPane",
            iconName: "NavigationPane"
        }, {
            actionName: "TogglePreviewPane",
            languageKey: "Label.PreviewPane",
            iconName: "PreviewPane"
        }, {
            actionName: "ToggleDetailsPane",
            languageKey: "Label.DetailsPane",
            iconName: "DetailsPane"
        }, {
            actionName: "ToggleLayoutExtraLargeIcons",
            languageKey: "Label.Layout.ExtraLargeIcons",
            iconName: "ExtraLargeIcons"
        }, {
            actionName: "ToggleLayoutLargeIcons",
            languageKey: "Label.Layout.LargeIcons",
            iconName: "LargeIcons"
        }, {
            actionName: "ToggleLayoutMediumIcons",
            languageKey: "Label.Layout.MediumIcons",
            iconName: "MediumIcons"
        }, {
            actionName: "ToggleLayoutSmallIcons",
            languageKey: "Label.Layout.SmallIcons",
            iconName: "SmallIcons"
        }, {
            actionName: "ToggleLayoutList",
            languageKey: "Label.Layout.List",
            iconName: "List"
        }, {
            actionName: "ToggleLayoutDetails",
            languageKey: "Label.Layout.Details",
            iconName: "Details"
        }, {
            actionName: "ToggleLayoutTiles",
            languageKey: "Label.Layout.Tiles",
            iconName: "Tiles"
        }, {
            actionName: "ToggleLayoutContent",
            languageKey: "Label.Layout.Content",
            iconName: "Content"
        }, {
            actionName: "Refresh",
            languageKey: "Label.Refresh.Verb",
            iconName: "Refresh"
        }, {
            actionName: "Expand",
            languageKey: "Label.Expand"
        }, {
            actionName: "Collapse",
            languageKey: "Label.Collapse"
        }, {
            actionName: "Up",
            iconName: "Up"
        }], GleamTech.UI.ExplorerView.sprite)
    }, initStores: function (n, t) {
        this.navigationStore = new Ext.data.TreeStore(Ext.merge({
            root: {
                expanded: !0,
                name: "",
                children: [],
                iconCls: GleamTech.UI.ExplorerView.sprite.getIcon("Home").getIconCls()
            },
            listeners: {
                load: {
                    fn: this.onNavigationStoreLoad,
                    scope: this
                }
            }
        }, n));
        this.viewStore = new Ext.data.Store(Ext.merge({
            listeners: {
                datachanged: {
                    fn: this.onViewStoreDataChanged,
                    scope: this
                },
                load: {
                    fn: this.onViewStoreLoad,
                    scope: this
                }
            }
        }, t))
    }, getViewColumnsConfig: Ext.emptyFn,
    createRibbon: function () {
        return new GleamTech.UI.Ribbon({
            collapsed: this.collapseRibbon,
            region: "north",
            items: [{
                title: GleamTech.Util.Language.getEntry("Label.Home"),
                items: [{
                    title: GleamTech.Util.Language.getEntry("Label.Select"),
                    layout: "vbox",
                    items: [this.applyAction({}, "SelectAll", 16), this.applyAction({}, "SelectNone", 16), this.applyAction({}, "InvertSelection", 16)]
                }]
            }, {
                title: GleamTech.Util.Language.getEntry("Label.View.Noun"),
                items: [{
                    title: GleamTech.Util.Language.getEntry("Label.Panes"),
                    items: [this.applyAction({
                        enableToggle: !0,
                        pressed: this.showNavigationPane,
                        iconAlign: "top"
                    }, "ToggleNavigationPane", 32)]
                }, {
                    title: GleamTech.Util.Language.getEntry("Label.Layout"),
                    items: [{
                        xtype: "container",
                        layout: {
                            type: "vbox",
                            align: "stretchmax"
                        },
                        defaults: {
                            allowDepress: !1,
                            textAlign: "left"
                        },
                        items: [this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        }, "ToggleLayoutExtraLargeIcons", 16), this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        }, "ToggleLayoutMediumIcons", 16), this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        }, "ToggleLayoutDetails", 16)]
                    }, {
                        xtype: "container",
                        layout: {
                            type: "vbox",
                            align: "stretchmax"
                        },
                        defaults: {
                            allowDepress: !1,
                            textAlign: "left"
                        },
                        items: [this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        }, "ToggleLayoutLargeIcons", 16), this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        }, "ToggleLayoutSmallIcons", 16), this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        }, "ToggleLayoutTiles", 16)]
                    }]
                }]
            }]
        })
    }, addRibbon: function () {
        this.ribbon || (this.ribbon = this.createRibbon(), this.add(this.ribbon))
    }, removeRibbon: function () {
        this.ribbon && (this.remove(this.ribbon, !0), this.ribbon = null)
    }, createNavigationBar: function () {
        return new Ext.toolbar.Toolbar({
            region: "north",
            cls: "x-navigationbar",
            items: [this.applyAction({
                    text: "",
                    focusable: !1,
                    enableConditions: {
                        checkFn: function () {
                            return this.canUpNavigationSelection
                        }, scope: this
                    }
                }, "Up", 16), new GleamTech.UI.Breadcrumb({
                    itemId: "breadcrumb",
                    region: "north",
                    buttonUI: "default-toolbar",
                    flex: 1,
                    defaults: {
                        focusable: !1
                    },
                    store: this.navigationStore,
                    displayField: "name",
                    overflowHandler: "scroller",
                    listeners: {
                        selectionchange: {
                            fn: this.onNavigationSelectionChange,
                            scope: this
                        }
                    },
                    selection: this.navigationSelection
                }), this.applyAction({
                    text: "",
                    cls: "x-refresh-button",
                    focusable: !1,
                    enableConditions: {
                        checkFn: function () {
                            return this.isNavigationSelectionValid
                        }, scope: this
                    }
                }, "Refresh", 16), {
                    xtype: "tbspacer",
                    width: 12
                },
                new GleamTech.UI.SearchField({
                    itemId: "searchBox",
                    width: 200,
                    listeners: {
                        scope: this,
                        buffer: 500,
                        change: this.onSearchBoxChange
                    },
                    enableConditions: {
                        checkFn: function () {
                            return this.isNavigationSelectionValid
                        }, scope: this
                    }
                })
            ]
        })
    }, addNavigationBar: function () {
        this.navigationBar || (this.navigationBar = this.createNavigationBar(), this.add(this.navigationBar))
    }, removeNavigationBar: function () {
        this.navigationBar && (this.remove(this.navigationBar, !0), this.navigationBar = null)
    }, createNavigationPane: function () {
        return new Ext.tree.Panel({
            region: "west",
            split: {
                hideSplitterWhenCollapsed: !0
            },
            collapsible: !0,
            animCollapse: !1,
            animate: !1,
            header: !1,
            lines: !1,
            useArrows: !0,
            rootVisible: !1,
            title: GleamTech.Util.Language.getEntry("Label.NavigationPane"),
            width: 200,
            store: this.navigationStore,
            displayField: "name",
            viewConfig: {
                scrollable: "vertical",
                loadMask: !1,
                emptyText: this.emptyNavigationViewText,
                deferEmptyText: !1,
                listeners: {
                    afterrender: function (n) {
                        n.toolTip = new Ext.tip.ToolTip({
                            target: n.el,
                            delegate: n.itemSelector,
                            dismissDelay: 0,
                            showDelay: 800,
                            shadow: "drop",
                            listeners: {
                                render: function (n) {
                                    n.el.on("contextmenu", function (n) {
                                        n.stopEvent()
                                    })
                                }, beforeshow: function (t) {
                                    var i = n.getRecord(t.triggerElement),
                                        r = i.data.name;
                                    t.update(r)
                                }
                            }
                        })
                    }, containercontextmenu: {
                        fn: this.onNavigationViewContainerContextMenu,
                        scope: this
                    }, itemcontextmenu: {
                        fn: this.onNavigationViewItemContextMenu,
                        scope: this
                    }, viewready: {
                        fn: function (n) {
                            if (this.navigationSelection) {
                                var t = n.getSelectionModel();
                                t.select(this.navigationSelection, !1, !0)
                            }
                        }, scope: this
                    }, destroy: function (n) {
                        Ext.destroy(n.toolTip)
                    }
                }
            },
            selModel: {
                listeners: {
                    selectionchange: {
                        fn: this.onNavigationSelectionChange,
                        scope: this
                    }
                },
                ignoreRightMouseSelection: !0,
                deselectOnContainerClick: !1
            },
            plugins: {
                ptype: "bufferedrenderer"
            }
        })
    }, addNavigationPane: function () {
        this.navigationPane || (this.navigationPane = this.createNavigationPane(), this.add(this.navigationPane))
    }, removeNavigationPane: function () {
        this.navigationPane && (this.remove(this.navigationPane, !0), this.navigationPane = null)
    }, createCenterPane: function () {
        return new GleamTech.UI.MultiView({
            region: "center",
            store: this.viewStore,
            columns: this.getViewColumnsConfig(),
            viewLayout: this.viewLayout,
            multipleSelection: this.viewMultipleSelection,
            emptyText: this.emptyViewText,
            getItemIconClsFn: this.getItemIconCls,
            getItemIconClsScope: this,
            getItemThumbnailSrcFn: this.getItemThumbnailSrc,
            getItemThumbnailSrcScope: this,
            autoInitLazyImageLoader: !1,
            listeners: {
                containercontextmenu: {
                    fn: this.onViewContainerContextMenu,
                    scope: this
                },
                itemcontextmenu: {
                    fn: this.onViewItemContextMenu,
                    scope: this
                },
                itemdblclick: {
                    fn: this.onViewItemDblClick,
                    scope: this
                },
                selectionchange: {
                    fn: this.onViewSelectionChange,
                    scope: this
                },
                refresh: {
                    fn: this.onViewRefresh,
                    scope: this
                }
            }
        })
    }, addCenterPane: function () {
        this.centerPane || (this.centerPane = this.createCenterPane(), this.add(this.centerPane))
    }, removeCenterPane: function () {
        this.centerPane && (this.remove(this.centerPane, !0), this.centerPane = null)
    }, createPreviewPane: function () {
        return new Ext.panel.Panel({
            region: "east",
            split: !0,
            collapsible: !0,
            animCollapse: !1,
            header: !0,
            title: GleamTech.Util.Language.getEntry("Label.PreviewPane"),
            width: 200
        })
    }, addPreviewPane: function () {
        this.previewPane || (this.previewPane = this.createPreviewPane(), this.add(this.previewPane))
    }, removePreviewPane: function () {
        this.previewPane && (this.remove(this.previewPane, !0), this.previewPane = null)
    }, createDetailsPane: function () {
        return new Ext.panel.Panel({
            region: "east",
            split: !0,
            collapsible: !0,
            animCollapse: !1,
            header: !0,
            title: GleamTech.Util.Language.getEntry("Label.DetailsPane"),
            width: 200
        })
    }, addDetailsPane: function () {
        this.detailsPane || (this.detailsPane = this.createDetailsPane(), this.add(this.detailsPane))
    }, removeDetailsPane: function () {
        this.detailsPane && (this.remove(this.detailsPane, !0), this.detailsPane = null)
    }, createStatusBar: function () {
        return new GleamTech.UI.StatusBar({
            region: "south",
            defaults: {
                focusable: !1
            },
            items: [this.applyAction({
                toggleGroup: this.id + "layoutGroup2",
                allowDepress: !1,
                text: ""
            }, "ToggleLayoutDetails", 16), this.applyAction({
                toggleGroup: this.id + "layoutGroup2",
                allowDepress: !1,
                text: ""
            }, "ToggleLayoutLargeIcons", 16)]
        })
    }, addStatusBar: function () {
        this.statusBar || (this.statusBar = this.createStatusBar(), this.add(this.statusBar))
    }, removeStatusBar: function () {
        this.statusBar && (this.remove(this.statusBar, !0), this.statusBar = null)
    }, createMessageBox: function () {
        return new GleamTech.UI.MessageBox({
            buttonText: {
                ok: GleamTech.Util.Language.getEntry("Label.OK"),
                yes: GleamTech.Util.Language.getEntry("Label.Yes"),
                no: GleamTech.Util.Language.getEntry("Label.No"),
                cancel: GleamTech.Util.Language.getEntry("Label.Cancel")
            }
        })
    }, createNavigationViewContainerContextMenu: function () {
        return new Ext.menu.Menu({
            listeners: {
                beforeshow: {
                    fn: this.onNavigationViewContainerContextMenuBeforeShow,
                    scope: this
                }
            }
        })
    }, createNavigationViewItemContextMenu: function () {
        return new Ext.menu.Menu({
            listeners: {
                beforeshow: {
                    fn: this.onNavigationViewItemContextMenuBeforeShow,
                    scope: this
                }
            }
        })
    }, createViewContainerContextMenu: function () {
        return new Ext.menu.Menu({
            listeners: {
                beforeshow: {
                    fn: this.onViewContainerContextMenuBeforeShow,
                    scope: this
                }
            }
        })
    }, createViewItemContextMenu: function () {
        return new Ext.menu.Menu({
            listeners: {
                beforeshow: {
                    fn: this.onViewItemContextMenuBeforeShow,
                    scope: this
                }
            }
        })
    }, getItemIconCls: function () {
        return ""
    }, getItemThumbnailSrc: function () {
        return ""
    }, onServerHandlerMethodBegin: function (n) {
        this.statusBar && !n.suppressStatusBusy && this.statusBar.setBusy(!0)
    }, onServerHandlerMethodEnd: function (n, t) {
        (t && this.messageBox.errorWithDetails(t.title, t.msg, t.details, t.detailsType), this.statusBar && !n.suppressStatusBusy) && this.statusBar.setBusy(!1)
    }, checkNavigationSelection: function (n) {
        return n != null && (n !== this.navigationStore.root || this.navigationStore.rootVisible)
    }, setNavigationSelection: function (n) {
        var u = this.navigationSelection,
            i, r, t;
        this.navigationSelection = n || null;
        this.isNavigationSelectionValid = this.checkNavigationSelection(n);
        this.canUpNavigationSelection = this.isNavigationSelectionValid && this.checkNavigationSelection(n.parentNode);
        this.navigationBar && (i = this.navigationBar.getComponent("breadcrumb"), i.getSelection() != this.navigationSelection && i.setSelection(this.navigationSelection, !0, !0), r = this.navigationBar.getComponent("searchBox"), r.emptyText = this.isNavigationSelectionValid ? GleamTech.Util.Language.getEntry("Label.SearchSelected", this.navigationSelection.data.name) : " ", r.reset(!0));
        this.navigationPane && (t = this.navigationPane.getSelectionModel(), this.navigationSelection ? t.getSelection()[0] != this.navigationSelection && t.select(this.navigationSelection, !1, !0) : t.deselect(u, !0));
        this.viewStore.clearFilter(!0);
        this.isNavigationSelectionValid || (this.viewStore.removeAll(), this.centerPane.clearEmptyEl(), this.statusBar.setPrimaryText(null))
    }, onNavigationSelectionChange: function (n, t) {
        this.setNavigationSelection(Ext.isArray(t) ? t[0] : t)
    }, onNavigationStoreLoad: function (n, t, i, r, u) {
        i || u.collapse()
    }, onViewStoreDataChanged: function (n) {
        var i, r, t;
        if (n.getCount() > this.detailsViewLayoutThreshold) {
            if (!this.viewLayoutBackup) {
                for (i = this.query("button[itemId^=ToggleLayout]"), t = 0; t < i.length; t++) r = i[t], r.itemId !== "ToggleLayoutDetails" && r.disable();
                this.viewLayoutBackup = this.centerPane.viewLayout.name;
                this.centerPane.setViewLayout("details")
            }
        } else if (this.viewLayoutBackup) {
            for (i = this.query("button[itemId^=ToggleLayout]"), t = 0; t < i.length; t++) r = i[t], r.itemId !== "ToggleLayoutDetails" && r.enable();
            this.centerPane.setViewLayout(this.viewLayoutBackup);
            delete this.viewLayoutBackup
        }
    }, onViewStoreLoad: function (n, t, i) {
        if (i && this.statusBar) {
            var r = t.length;
            this.statusBar.setPrimaryText(r == 1 ? GleamTech.Util.Language.getEntry("Label.ItemCount", r) : GleamTech.Util.Language.getEntry("Label.ItemsCount", r))
        }
    }, onViewRefresh: function () {
        this.getAction("ToggleLayout" + this.centerPane.viewLayout.name).each(function (n) {
            n.toggle(!0, !0);
            Ext.ButtonToggleManager.groups[n.toggleGroup] && Ext.ButtonToggleManager.toggleGroup(n, n.pressed)
        })
    }, onViewSelectionChange: function (n, t) {
        var i, r, u;
        (this.viewSelection = t, this.statusBar) && (i = t.length, i == 0 ? this.statusBar.setSecondaryText(null) : (r = i == 1 ? GleamTech.Util.Language.getEntry("Label.SelectedItemCount", i) : GleamTech.Util.Language.getEntry("Label.SelectedItemsCount", i), u = this.getSelectionStatusText(t), u.length > 0 && (r += "&#160;&#160;" + u), this.statusBar.setSecondaryText(r)))
    }, getSelectionStatusText: function () {
        return ""
    }, onSearchBoxChange: function (n, t) {
        t.length == 0 ? this.viewStore.clearFilter() : this.viewStore.getFilters().replaceAll({
            property: "name",
            anyMatch: !0,
            value: t
        })
    }, showContextMenu: function (n, t, i) {
        n.stopEvent();
        this.contextMenuSelection = i;
        t.showAt(n.getXY())
    }, onNavigationViewContainerContextMenu: function (n, t) {
        this.navigationViewContainerContextMenu || (this.navigationViewContainerContextMenu = this.createNavigationViewContainerContextMenu());
        this.showContextMenu(t, this.navigationViewContainerContextMenu)
    }, onNavigationViewItemContextMenu: function (n, t, i, r, u) {
        if (this.navigationViewItemContextMenu || (this.navigationViewItemContextMenu = this.createNavigationViewItemContextMenu()), this.showContextMenu(u, this.navigationViewItemContextMenu, t), !this.navigationViewItemContextMenu.hidden && !this.navigationPane.getSelectionModel().isSelected(t)) {
            var f = n.indexOf(t);
            n.onRowSelect(f);
            this.navigationViewItemContextMenu.on("hide", function () {
                n.onRowDeselect(f)
            }, this, {
                single: !0
            })
        }
    }, onViewContainerContextMenu: function (n, t) {
        this.viewContainerContextMenu || (this.viewContainerContextMenu = this.createViewContainerContextMenu());
        this.showContextMenu(t, this.viewContainerContextMenu)
    }, onViewItemContextMenu: function (n, t, i, r, u) {
        this.viewItemContextMenu || (this.viewItemContextMenu = this.createViewItemContextMenu());
        this.showContextMenu(u, this.viewItemContextMenu, t)
    }, onViewItemDblClick: Ext.emptyFn,
    onNavigationViewContainerContextMenuBeforeShow: Ext.emptyFn,
    onNavigationViewItemContextMenuBeforeShow: Ext.emptyFn,
    onViewContainerContextMenuBeforeShow: Ext.emptyFn,
    onViewItemContextMenuBeforeShow: Ext.emptyFn,
    onActionHandlerBegin: function (n) {
        if (n.isMenuItem) {
            var t = n.getRootMenu();
            switch (t) {
            case this.navigationViewContextMenu:
                return GleamTech.UI.ExplorerViewActionContext.NavigationView;
            case this.navigationViewItemContextMenu:
                return GleamTech.UI.ExplorerViewActionContext.NavigationViewItem;
            case this.viewItemContextMenu:
                return GleamTech.UI.ExplorerViewActionContext.ViewItem
            }
        }
        return GleamTech.UI.ExplorerViewActionContext.View
    }, onActionSelectAll: function () {
        this.centerPane.getSelectionModel().selectAll()
    }, onActionSelectNone: function () {
        this.centerPane.getSelectionModel().deselectAll()
    }, onActionInvertSelection: function () {
        var n = this.centerPane.getSelectionModel();
        n.selectAll(!0);
        n.deselect(this.viewSelection)
    }, onActionToggleNavigationPane: function (n) {
        n.pressed ? this.addNavigationPane() : this.removeNavigationPane()
    }, onActionTogglePreviewPane: function (n) {
        n.pressed ? this.addPreviewPane() : this.removePreviewPane()
    }, onActionToggleDetailsPane: function (n) {
        n.pressed ? this.addDetailsPane() : this.removeDetailsPane()
    }, onActionToggleLayoutExtraLargeIcons: function (n) {
        n.pressed && this.centerPane.setViewLayout("extralargeicons")
    }, onActionToggleLayoutLargeIcons: function (n) {
        n.toggleSameAction();
        n.pressed && this.centerPane.setViewLayout("largeicons")
    }, onActionToggleLayoutMediumIcons: function (n) {
        n.pressed && this.centerPane.setViewLayout("mediumicons")
    }, onActionToggleLayoutSmallIcons: function (n) {
        n.pressed && this.centerPane.setViewLayout("smallicons")
    }, onActionToggleLayoutList: function (n) {
        n.pressed && this.centerPane.setViewLayout("list")
    }, onActionToggleLayoutDetails: function (n) {
        n.toggleSameAction();
        n.pressed && this.centerPane.setViewLayout("details")
    }, onActionToggleLayoutTiles: function (n) {
        n.pressed && this.centerPane.setViewLayout("tiles")
    }, onActionToggleLayoutContent: function (n) {
        n.pressed && this.centerPane.setViewLayout("content")
    }, onActionExpand: function () {
        this.contextMenuSelection.expand()
    }, onActionCollapse: function () {
        this.contextMenuSelection.collapse()
    }, onActionUp: function () {
        this.setNavigationSelection(this.navigationSelection.parentNode)
    }
});
GleamTech.UI.ExplorerViewLayoutType = {
    ExtraLargeIcons: 1,
    LargeIcons: 2,
    MediumIcons: 3,
    SmallIcons: 4,
    List: 5,
    Details: 6,
    Tiles: 7,
    Content: 8
};
GleamTech.UI.ExplorerViewActionContext = {
    NavigationView: 1,
    NavigationViewItem: 2,
    View: 3,
    ViewItem: 4
};
Ext.define("GleamTech.UI.Window", {
    extend: "Ext.window.Window",
    minimizeOffset: null,
    minimized: !1,
    boxBeforeMinimize: null,
    initComponent: function () {
        this.minimizeOffset || (this.minimizeOffset = [0, 0]);
        this.callParent()
    }, minimize: function () {
        return this.minimized ? (this.expand(!1), this.setBox(this.boxBeforeMinimize), this.tools.minimize && this.tools.minimize.setType("minimize"), this.minimized = !1, this) : (this.boxBeforeMinimize = this.getBox(), this.collapse("", !1), this.setWidth(150), this.alignTo(this.alignTarget, "bl-bl", this.minimizeOffset), this.tools.minimize && this.tools.minimize.setType("restore"), this.minimized = !0, this.callParent())
    }, maximize: function () {
        return this.callParent(arguments), this.minimized && (this.minimized = !1, this.tools.minimize && this.tools.minimize.setType("minimize")), this
    }
});
Ext.define("GleamTech.FileUltimate.FileIconManager", {
    singleton: !0,
    baseFileIcons: {},
    fileIcons: {},
    fileIconMappings: {},
    getBaseIconCls: function (n, t) {
        n = n.toLowerCase();
        var i, r = this.baseFileIcons[n];
        return r && (i = r[t], i) ? i : ""
    }, getIconCls: function (n, t) {
        var i, r, u;
        return (n.charAt(0) === "." && (n = n.substr(1)), n = n.toLowerCase(), r = this.fileIcons[n], r && (i = r[t], i)) ? i : (u = this.fileIconMappings[n], r = this.fileIcons[u], r && (i = r[t], i)) ? i : this.getBaseIconCls("File", t)
    }
});
Ext.define("GleamTech.FileUltimate.FileThumbnailManager", {
    singleton: !0,
    supportedExtensions: {},
    isSupported: function (n) {
        return n.charAt(0) === "." && (n = n.substr(1)), n = n.toLowerCase(), this.supportedExtensions[n]
    }, isImage: function (n) {
        return n === 1
    }, isVideo: function (n) {
        return n === 2
    }
});
Ext.define("GleamTech.FileUltimate.ArchiveFileManager", {
    singleton: !0,
    supportedExtensions: {},
    isSupported: function (n) {
        return n.charAt(0) === "." && (n = n.substr(1)), n = n.toLowerCase(), this.supportedExtensions[n]
    }, isReadOnly: function (n) {
        return n === 1
    }, isReadWrite: function (n) {
        return n === 2
    }, getSupportedExtensions: function () {
        return this.supportedExtensionsArray || (this.supportedExtensionsArray = Ext.Object.getAllKeys(this.supportedExtensions)), this.supportedExtensionsArray
    }
});
Ext.define("GleamTech.FileUltimate.FileManager", {
    extend: "GleamTech.UI.ExplorerView",
    statics: {
        sprite: new GleamTech.UI.Sprite("filemanagericons")
    },
    config: {
        sortRootFolders: !0,
        showFileExtensions: !1,
        chooser: !1,
        chooserType: "File",
        chooserMultipleSelection: !1
    },
    referrerIframe: null,
    downloadIframe: null,
    downloadForm: null,
    fileUploader: null,
    clipboard: null,
    chooseButton: null,
    initComponent: function () {
        if (this.clipboard = {
            isEmpty: !0
        }, this.chooser && (this.viewMultipleSelection = this.chooserMultipleSelection), this.callParent(arguments), this.chooser) {
            this.chooserType = GleamTech.FileUltimate.FileManagerChooserType[this.chooserType];
            this.chooseButton = new Ext.button.Button(this.applyAction({
                enableConditions: {
                    itemTypes: function (n) {
                        switch (n.chooserType) {
                        case GleamTech.FileUltimate.FileManagerChooserType.Folder:
                            return {
                                Folder: {
                                    multiple: n.chooserMultipleSelection
                                }
                            };
                        case GleamTech.FileUltimate.FileManagerChooserType.FileOrFolder:
                            return {
                                Folder: {
                                    multiple: n.chooserMultipleSelection
                                },
                                File: {
                                    multiple: n.chooserMultipleSelection
                                }
                            };
                        default:
                            return {
                                File: {
                                    multiple: n.chooserMultipleSelection
                                }
                            }
                        }
                    }(this)
                },
                minWidth: 75,
                disabled: !0
            }, "Choose"));
            var n = new Ext.toolbar.Toolbar({
                ui: "footer",
                region: "south",
                layout: {
                    pack: "end"
                },
                items: [this.chooseButton, {
                    text: GleamTech.Util.Language.getEntry("Label.Cancel"),
                    minWidth: 75,
                    handler: function () {
                        this.hide()
                    }, scope: this
                }]
            });
            this.add(n);
            this.on("hide", function (n, t) {
                if (!this.hidingAfterChoose) this.onActionChoose(n, t)
            }, this)
        }
        this.setNavigationSelection(this.loadInitialFolder() || this.navigationStore.getAt(0), null, !0);
        Ext.callback(window[this.loading], window, [this, null])
    }, afterRender: function () {
        this.referrerIframe = new GleamTech.UI.ReferrerIframe(this.el);
        this.downloadIframe = this.el.createChild({
            tag: "iframe",
            name: Ext.id(null, "download-iframe-"),
            src: "javascript:&quot;&quot;",
            style: "visibility: hidden; width: 0; height:0"
        });
        this.downloadForm = Ext.get(Ext.DomHelper.createDom({
            tag: "form",
            style: "visibility: hidden; width: 0; height:0"
        }));
        Ext.isIE8 ? Ext.getBody().appendChild(this.downloadForm) : this.el.appendChild(this.downloadForm);
        this.callParent(arguments)
    }, onBoxReady: function () {
        if (Ext.callback(window[this.loaded], window, [this, null]), this.isNavigationSelectionValid) {
            var n = this.navigationSelection;
            this.navigationSelection = null;
            this.setNavigationSelection(n)
        }
        this.callParent(arguments)
    }, initLabels: function () {
        this.callParent();
        this.emptyViewText = GleamTech.Util.Language.getEntry("Message.EmptyFolder");
        this.emptyNavigationViewText = GleamTech.Util.Language.getEntry("FileManager.Label.NoRootFolders")
    }, initActions: function () {
        this.callParent();
        this.addActions([{
            actionName: "Cut",
            languageKey: "Label.Cut.Verb",
            iconName: "Cut"
        }, {
            actionName: "Copy",
            languageKey: "Label.Copy.Verb",
            iconName: "Copy"
        }, {
            actionName: "Paste",
            languageKey: "Label.Paste.Verb",
            iconName: "Paste"
        }, {
            actionName: "Delete",
            languageKey: "Label.Delete",
            iconName: "Delete"
        }, {
            actionName: "Rename",
            languageKey: "Label.Rename",
            iconName: "Rename"
        }, {
            actionName: "NewFolder",
            languageKey: "Label.NewFolder",
            iconName: "NewFolder"
        }, {
            actionName: "NewFile",
            languageKey: "Label.NewFile",
            iconName: "NewFile"
        }, {
            actionName: "Download",
            languageKey: "Label.Download.Verb",
            iconName: "Download"
        }, {
            actionName: "Upload",
            languageKey: "Label.Upload.Verb",
            iconName: "Upload"
        }, {
            actionName: "Open",
            languageKey: "Label.Open.Verb",
            iconName: "Open"
        }, {
            actionName: "AddToZip",
            languageKey: "Label.AddToZip",
            iconName: "AddToZip"
        }, {
            actionName: "ExtractAll",
            languageKey: "Label.ExtractAll",
            iconName: "ExtractAll"
        }, {
            actionName: "ExtractAllTo",
            languageKey: "Label.ExtractAllTo"
        }, {
            actionName: "ExtractAllHere",
            languageKey: "Label.ExtractAllHere"
        }, {
            actionName: "Choose",
            languageKey: "Label.Choose"
        }], GleamTech.FileUltimate.FileManager.sprite)
    }, initStores: function () {
        var t = {
                model: "GleamTech.FileUltimate.FolderNodeModel",
                proxy: this.getServerHandlerMethodProxy({
                    methodInfoCallback: function (n) {
                        return {
                            name: "ExpandFolder",
                            parameters: {
                                isRefresh: n.config.isRefresh == !0,
                                path: n.config.node.getPathData().fullPath
                            },
                            suppressStatusBusy: !0
                        }
                    }, readRecordsCallback: this.readFolderNodeRecords,
                    scope: this
                }),
                clearOnLoad: !1,
                sorters: [{
                    property: "itemType",
                    direction: "ASC"
                }, {
                    property: "name",
                    direction: "ASC"
                }]
            },
            i = {
                model: "GleamTech.FileUltimate.FolderViewModel",
                proxy: this.getServerHandlerMethodProxy({
                    methodInfoCallback: function (n) {
                        return {
                            name: "ListFolder",
                            parameters: {
                                isRefresh: n.config.isRefresh == !0,
                                path: n.config.node.getPathData().fullPath
                            }
                        }
                    }, readRecordsCallback: this.readFolderViewRecords,
                    scope: this
                }),
                grouper: {
                    property: "itemType",
                    direction: "ASC"
                },
                sorters: [{
                    property: "name",
                    direction: "ASC"
                }]
            },
            n;
        this.callParent([t, i]);
        n = new Ext.util.SorterCollection;
        Ext.override(this.navigationStore, {
            fillNode: function (t, i) {
                for (var u = t.childNodes.length, r, f, e; u--;) r = t.childNodes[u], r.isExisting ? (r.data.expandable ? r.childNodes.length == 0 && r.set("loaded", !1) : r.removeAll(!1, !1, !0), delete r.isExisting) : t.removeChild(r);
                return f = this.sortOnLoad, this.sortOnLoad = !1, e = this.sorters, this.sorters = n, this.callParent(arguments), this.sortOnLoad = f, this.sorters = e, this.sortOnLoad && t.sort(), t.childNodes.length == 0 ? (t.set("expanded", !1), t.set("expandable", !1)) : (t.set("expanded", !0), t.set("expandable", !0)), i
            }
        });
        this.loadRootFolders()
    }, getViewColumnsConfig: function () {
        var n = [{
            text: GleamTech.Util.Language.getEntry("Label.Column.Name"),
            dataIndex: "name",
            hideable: !1,
            flex: 1,
            isPrimary: !0
        }, {
            text: GleamTech.Util.Language.getEntry("Label.Column.DateModified"),
            dataIndex: "lastModifiedTime",
            formatterFn: function (n) {
                return GleamTech.Util.Culture.formatShortDateTime(n)
            }, isToolTipValue: !0,
            width: 125
        }, {
            text: GleamTech.Util.Language.getEntry("Label.Column.Type"),
            dataIndex: "type",
            isTileFirstValue: !0,
            formatterFn: function (n, t) {
                return n ? n : t.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? t.data.extension ? GleamTech.Util.Language.getEntry("Label.FileType", t.data.extension.toUpperCase()) : GleamTech.Util.Language.getEntry("Label.File") : GleamTech.Util.Language.getEntry("Label.FolderType")
            }, tileFormatterFn: function (n, t) {
                return t.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? n ? n : t.data.extension ? GleamTech.Util.Language.getEntry("Label.FileType", t.data.extension.toUpperCase()) : GleamTech.Util.Language.getEntry("Label.File") : ""
            }, isToolTipValue: !0
        }, {
            text: GleamTech.Util.Language.getEntry("Label.Column.Size"),
            dataIndex: "size",
            align: "right",
            formatterFn: function (n) {
                return GleamTech.Util.Culture.formatKBSize(n)
            }, isTileSecondValue: !0,
            tileFormatterFn: function (n, t) {
                return t.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? GleamTech.Util.Culture.formatByteSize(n) : ""
            }, isToolTipValue: !0,
            width: 85
        }];
        return this.showFileExtensions || (n[0].formatterFn = function (n, t) {
            return t.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? GleamTech.Util.Path.getFileNameWithoutExtension(n) : n
        }), n
    }, createRibbon: function () {
        var n = this.callParent(),
            t = n.items.getAt(0);
        return n.insertGroup(t, 0, {
            title: GleamTech.Util.Language.getEntry("Label.Clipboard"),
            items: [this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Copy"]
                        },
                        Folder: {
                            permissions: ["Copy"]
                        },
                        File: {
                            permissions: ["Copy"]
                        }
                    }
                },
                enableConditions: {
                    itemTypes: {
                        Folder: {
                            multiple: !0
                        },
                        File: {
                            multiple: !0
                        }
                    }
                },
                iconAlign: "top",
                rowspan: 3
            }, "Copy", 32), this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Paste"]
                        },
                        Folder: {
                            permissions: ["Paste"]
                        },
                        File: {
                            permissions: ["Paste"]
                        }
                    }
                },
                enableConditions: {
                    checkFn: function () {
                        return this.isNavigationSelectionValid && !this.clipboard.isEmpty
                    }, scope: this
                },
                iconAlign: "top",
                rowspan: 3
            }, "Paste", 32), {
                xtype: "container",
                layout: {
                    type: "vbox",
                    align: "stretchmax"
                },
                items: [this.applyAction({
                    showConditions: {
                        itemTypes: {
                            RootFolder: {
                                permissions: ["Cut"]
                            },
                            Folder: {
                                permissions: ["Cut"]
                            },
                            File: {
                                permissions: ["Cut"]
                            }
                        }
                    },
                    enableConditions: {
                        itemTypes: {
                            Folder: {
                                multiple: !0
                            },
                            File: {
                                multiple: !0
                            }
                        }
                    }
                }, "Cut", 16)]
            }]
        }), n.insertGroup(t, 1, {
            title: GleamTech.Util.Language.getEntry("Label.Organize"),
            items: [this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Delete"]
                        },
                        Folder: {
                            permissions: ["Delete"]
                        },
                        File: {
                            permissions: ["Delete"]
                        }
                    }
                },
                enableConditions: {
                    itemTypes: {
                        Folder: {
                            multiple: !0
                        },
                        File: {
                            multiple: !0
                        }
                    }
                },
                iconAlign: "top"
            }, "Delete", 32), this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Rename"]
                        },
                        Folder: {
                            permissions: ["Rename"]
                        },
                        File: {
                            permissions: ["Rename"]
                        }
                    }
                },
                enableConditions: {
                    itemTypes: {
                        Folder: {},
                        File: {}
                    }
                },
                iconAlign: "top"
            }, "Rename", 32)]
        }), n.insertGroup(t, 2, {
            title: GleamTech.Util.Language.getEntry("Label.New"),
            items: [this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Create"]
                        },
                        Folder: {
                            permissions: ["Create"]
                        },
                        File: {
                            permissions: ["Create"]
                        }
                    }
                },
                enableConditions: {
                    checkFn: function () {
                        return this.isNavigationSelectionValid
                    }, scope: this
                },
                iconAlign: "top"
            }, "NewFolder", 32)]
        }), n.insertGroup(t, 3, {
            title: GleamTech.Util.Language.getEntry("Label.Transfer.Verb"),
            items: [this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Download"]
                        },
                        Folder: {
                            permissions: ["Download"]
                        },
                        File: {
                            permissions: ["Download"]
                        }
                    }
                },
                enableConditions: {
                    itemTypes: {
                        Folder: {
                            multiple: !0
                        },
                        File: {
                            multiple: !0
                        }
                    }
                },
                iconAlign: "top"
            }, "Download", 32), this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Upload"]
                        },
                        Folder: {
                            permissions: ["Upload"]
                        },
                        File: {
                            permissions: ["Upload"]
                        }
                    }
                },
                enableConditions: {
                    checkFn: function () {
                        return this.isNavigationSelectionValid
                    }, scope: this
                },
                iconAlign: "top"
            }, "Upload", 32)]
        }), n.insertGroup(t, 4, {
            title: GleamTech.Util.Language.getEntry("Label.Open.Verb"),
            items: [this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Download", "ListSubfolders"]
                        },
                        Folder: {
                            permissions: ["Download", "ListSubfolders"]
                        },
                        File: {
                            permissions: ["Download", "ListSubfolders"]
                        }
                    }
                },
                enableConditions: {
                    itemTypes: {
                        Folder: {},
                        File: {
                            parentPermissions: ["Download"]
                        }
                    }
                },
                iconAlign: "top"
            }, "Open", 32)]
        }), n.insertGroup(t, 5, {
            title: GleamTech.Util.Language.getEntry("Label.Compression"),
            items: [this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Compress"]
                        },
                        Folder: {
                            permissions: ["Compress"]
                        },
                        File: {
                            permissions: ["Compress"]
                        }
                    }
                },
                enableConditions: {
                    itemTypes: {
                        Folder: {
                            multiple: !0
                        },
                        File: {
                            multiple: !0
                        }
                    }
                },
                iconAlign: "top"
            }, "AddToZip", 32), this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Extract"]
                        },
                        Folder: {
                            permissions: ["Extract"]
                        },
                        File: {
                            permissions: ["Extract"]
                        }
                    }
                },
                enableConditions: {
                    itemTypes: {
                        File: {
                            extensions: GleamTech.FileUltimate.ArchiveFileManager.getSupportedExtensions()
                        }
                    }
                },
                iconAlign: "top",
                menu: {
                    items: [this.applyAction({}, "ExtractAllTo"), this.applyAction({}, "ExtractAllHere")]
                }
            }, "ExtractAll", 32)]
        }), Crypto.MD5(this.id + this.serverStateId) != this.hash && n.tabBar.insert(n.tabBar.items.findIndex("xtype", "tbfill") + 1, {
            xtype: "component",
            autoEl: {
                tag: "a",
                href: "http://www.gleamtech.com/purchase",
                target: "_blank",
                html: "FileUltimate (unlicensed) - Purchase a license",
                style: {
                    color: "#000080",
                    marginRight: "10px",
                    lineHeight: "22px"
                }
            }
        }), n
    }, createNavigationPane: function () {
        var n = this.callParent();
        return this.showFileExtensions || n.setColumns([{
            xtype: "treecolumn",
            dataIndex: "name",
            flex: 1,
            renderer: function (n, t, i) {
                return i.data.itemType === GleamTech.FileUltimate.FileManagerItemType.File ? GleamTech.Util.Path.getFileNameWithoutExtension(n) : n
            }
        }]), n
    }, createNavigationViewItemContextMenu: function () {
        var n = this.callParent();
        return n.add([this.applyAction({
                showConditions: {
                    checkFn: function (n) {
                        return !n.data.expanded
                    }
                },
                enableConditions: {
                    checkFn: function (n) {
                        return n.data.expandable
                    }
                }
            }, "Expand"), this.applyAction({
                showConditions: {
                    checkFn: function (n) {
                        return n.data.expanded
                    }
                }
            }, "Collapse"), this.applyAction({}, "Refresh", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({}, "Open", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Download"]
                        },
                        File: {
                            parentPermissions: ["Download"]
                        }
                    }
                }
            }, "Download", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Upload"]
                        },
                        Folder: {
                            permissions: ["Upload"]
                        },
                        File: {
                            permissions: ["Upload"]
                        }
                    }
                }
            }, "Upload", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Compress"]
                        },
                        File: {
                            parentPermissions: ["Compress"]
                        }
                    }
                }
            }, "AddToZip", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        File: {
                            parentPermissions: ["Extract"],
                            extensions: GleamTech.FileUltimate.ArchiveFileManager.getSupportedExtensions()
                        }
                    }
                },
                hideOnClick: !1,
                menu: [this.applyAction({}, "ExtractAllTo"), this.applyAction({}, "ExtractAllHere")]
            }, "ExtractAll", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Cut"]
                        },
                        File: {
                            parentPermissions: ["Cut"]
                        }
                    }
                }
            }, "Cut", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Copy"]
                        },
                        File: {
                            parentPermissions: ["Copy"]
                        }
                    }
                }
            }, "Copy", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Paste"]
                        },
                        Folder: {
                            permissions: ["Paste"]
                        },
                        File: {
                            permissions: ["Paste"]
                        }
                    }
                },
                enableConditions: {
                    checkFn: function () {
                        return !this.clipboard.isEmpty
                    }, scope: this
                }
            }, "Paste", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Delete"]
                        },
                        File: {
                            parentPermissions: ["Delete"]
                        }
                    }
                }
            }, "Delete", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Rename"]
                        },
                        File: {
                            parentPermissions: ["Rename"]
                        }
                    }
                }
            }, "Rename", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Create"]
                        },
                        Folder: {
                            permissions: ["Create"]
                        },
                        File: {
                            permissions: ["Create"]
                        }
                    }
                }
            }, "NewFolder", 16)
        ]), n
    }, createViewContainerContextMenu: function () {
        var n = this.callParent();
        return n.add([this.applyAction({
                showConditions: {
                    checkFn: function () {
                        return this.isNavigationSelectionValid
                    }, scope: this
                }
            }, "Refresh", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Upload"]
                        },
                        Folder: {
                            permissions: ["Upload"]
                        },
                        File: {
                            permissions: ["Upload"]
                        }
                    }
                }
            }, "Upload", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Paste"]
                        },
                        Folder: {
                            permissions: ["Paste"]
                        },
                        File: {
                            permissions: ["Paste"]
                        }
                    }
                },
                enableConditions: {
                    checkFn: function () {
                        return !this.clipboard.isEmpty
                    }, scope: this
                }
            }, "Paste", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        RootFolder: {
                            permissions: ["Create"]
                        },
                        Folder: {
                            permissions: ["Create"]
                        },
                        File: {
                            permissions: ["Create"]
                        }
                    }
                }
            }, "NewFolder", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({}, "SelectAll", 16)
        ]), n
    }, createViewItemContextMenu: function () {
        var n = this.callParent();
        return this.chooser && n.add([this.applyAction({
            enableConditions: {
                itemTypes: function (n) {
                    switch (n.chooserType) {
                    case GleamTech.FileUltimate.FileManagerChooserType.Folder:
                        return {
                            Folder: {
                                multiple: n.chooserMultipleSelection
                            }
                        };
                    case GleamTech.FileUltimate.FileManagerChooserType.FileOrFolder:
                        return {
                            Folder: {
                                multiple: n.chooserMultipleSelection
                            },
                            File: {
                                multiple: n.chooserMultipleSelection
                            }
                        };
                    default:
                        return {
                            File: {
                                multiple: n.chooserMultipleSelection
                            }
                        }
                    }
                }(this)
            }
        }, "Choose"), {
            xtype: "menuseparator"
        }]), n.add([this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {},
                        File: {
                            parentPermissions: ["Download"]
                        }
                    }
                }
            }, "Open", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Download"],
                            multiple: !0
                        },
                        File: {
                            parentPermissions: ["Download"],
                            multiple: !0
                        }
                    }
                }
            }, "Download", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            permissions: ["Upload"]
                        },
                        File: {
                            permissions: ["Upload"]
                        }
                    }
                }
            }, "Upload", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Compress"],
                            multiple: !0
                        },
                        File: {
                            parentPermissions: ["Compress"],
                            multiple: !0
                        }
                    }
                }
            }, "AddToZip", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        File: {
                            parentPermissions: ["Extract"],
                            extensions: GleamTech.FileUltimate.ArchiveFileManager.getSupportedExtensions()
                        }
                    }
                },
                hideOnClick: !1,
                menu: [this.applyAction({}, "ExtractAllTo"), this.applyAction({}, "ExtractAllHere")]
            }, "ExtractAll", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Cut"],
                            multiple: !0
                        },
                        File: {
                            parentPermissions: ["Cut"],
                            multiple: !0
                        }
                    }
                }
            }, "Cut", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Copy"],
                            multiple: !0
                        },
                        File: {
                            parentPermissions: ["Copy"],
                            multiple: !0
                        }
                    }
                }
            }, "Copy", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            permissions: ["Paste"]
                        }
                    }
                },
                enableConditions: {
                    checkFn: function () {
                        return !this.clipboard.isEmpty
                    }, scope: this
                }
            }, "Paste", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Delete"],
                            multiple: !0
                        },
                        File: {
                            parentPermissions: ["Delete"],
                            multiple: !0
                        }
                    }
                }
            }, "Delete", 16), this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            parentPermissions: ["Rename"]
                        },
                        File: {
                            parentPermissions: ["Rename"]
                        }
                    }
                }
            }, "Rename", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({
                showConditions: {
                    itemTypes: {
                        Folder: {
                            permissions: ["Create"]
                        }
                    }
                }
            }, "NewFolder", 16), {
                xtype: "menuseparator"
            },
            this.applyAction({}, "InvertSelection", 16)
        ]), n
    }, loadRootFolders: function () {
        this.navigationStore.sortOnLoad = this.sortRootFolders;
        var n = this.navigationStore.getRoot(),
            t = this.readFolderNodeRecords({
                config: {
                    node: n
                }
            }, {
                Folders: this.rootFolders
            });
        this.navigationStore.fillNode(n, t);
        this.navigationStore.sortOnLoad = !0
    }, loadInitialFolder: function () {
        var t, r;
        if (!this.initialFolder) return null;
        var i = this.initialFolder.split(GleamTech.Util.Path.backSlash),
            u = i[0].replace(":", ""),
            n = this.navigationStore.getRoot().findChildNodeByName(u);
        if (!n) return null;
        for (t = 1; t < i.length; t++) i[t].length != 0 && (r = this.readFolderNodeRecords({
            config: {
                node: n
            }
        }, {
            Folders: [
                [i[t], null, null, !0]
            ]
        }), this.navigationStore.fillNode(n, r), n = r[0]);
        return n
    }, readFolderNodeRecords: function (n, t) {
        var o = n.config.node,
            s = t.Folders,
            h = s.length,
            r, u, f, i, e;
        for (o.isRoot() ? (r = GleamTech.FileUltimate.FileManagerItemType.RootFolder, u = GleamTech.FileUltimate.FileIconManager.getBaseIconCls("RootFolder", 16)) : (r = GleamTech.FileUltimate.FileManagerItemType.Folder, u = GleamTech.FileUltimate.FileIconManager.getBaseIconCls("Folder", 16)), f = [], i = 0; i < h; i++) e = this.createFolderNodeRecord(s[i], o, r, u), e != null && f.push(e);
        return f
    }, readFolderViewRecords: function (n, t) {
        for (var h, u, b, i = n.config.node, v = t.Folders, e = v.length, y = t.Files, p = y.length, r, o = new Array(e + p), s = [], f = 0; f < e; f++) h = v[f], o[f] = this.createFolderViewRecord(h, i, GleamTech.FileUltimate.FileManagerItemType.Folder), r = this.createFolderNodeRecord(h, i, GleamTech.FileUltimate.FileManagerItemType.Folder, GleamTech.FileUltimate.FileIconManager.getBaseIconCls("Folder", 16)), r != null && s.push(r);
        for (u = 0; u < p; u++) {
            var c = y[u],
                l, w = GleamTech.Util.Path.getExtension(c[0], !0),
                a = GleamTech.FileUltimate.ArchiveFileManager.isSupported(w);
            a && (l = !GleamTech.FileUltimate.ArchiveFileManager.isReadOnly(a) && i.checkPermission(GleamTech.FileUltimate.FileManagerPermissionTypes.Edit) && i.checkPermission(GleamTech.FileUltimate.FileManagerPermissionTypes.Compress) ? i.data.permissions : i.data.permissions & (GleamTech.FileUltimate.FileManagerPermissionTypes.ListSubfolders | GleamTech.FileUltimate.FileManagerPermissionTypes.ListFiles | GleamTech.FileUltimate.FileManagerPermissionTypes.Download | GleamTech.FileUltimate.FileManagerPermissionTypes.Copy), b = [c[0], l, null, !0], r = this.createFolderNodeRecord(b, i, GleamTech.FileUltimate.FileManagerItemType.File, GleamTech.FileUltimate.FileIconManager.getIconCls(w, 16)), r != null && s.push(r));
            r = o[e + u] = this.createFolderViewRecord(c, i, GleamTech.FileUltimate.FileManagerItemType.File);
            a && (r.data.permissions = l)
        }
        return n.config.folderNodeRecords = s, o
    }, createFolderNodeRecord: function (n, t, i, r) {
        var e = {
                itemType: i,
                name: n[0],
                permissions: n[1] != null ? n[1] : t.data.permissions,
                fileTypes: n[2] != null ? n[2] : t.data.fileTypes,
                expandable: n[3],
                hash: n[4],
                iconCls: r
            },
            u = t.findChildNodeByName(e.name),
            f;
        return u ? (u.set(e), u.commit(), u.isExisting = !0, null) : (f = new GleamTech.FileUltimate.FolderNodeModel(e), f.phantom = !1, f.childrenNotLoadedYet = !0, f)
    }, createFolderViewRecord: function (n, t, i) {
        return i === GleamTech.FileUltimate.FileManagerItemType.Folder ? new GleamTech.FileUltimate.FolderViewModel({
            itemType: i,
            name: n[0],
            permissions: n[1] != null ? n[1] : t.data.permissions,
            fileTypes: n[2] != null ? n[2] : t.data.fileTypes,
            size: null,
            type: n[4],
            lastModifiedTime: n[5]
        }) : new GleamTech.FileUltimate.FolderViewModel({
            itemType: i,
            name: n[0],
            size: n[1],
            type: n[2],
            lastModifiedTime: n[3]
        })
    }, getItemIconCls: function (n, t) {
        var i = n.data;
        switch (i.itemType) {
        case GleamTech.FileUltimate.FileManagerItemType.RootFolder:
            return GleamTech.FileUltimate.FileIconManager.getBaseIconCls("RootFolder", t);
        case GleamTech.FileUltimate.FileManagerItemType.Folder:
            return GleamTech.FileUltimate.FileIconManager.getBaseIconCls("Folder", t);
        case GleamTech.FileUltimate.FileManagerItemType.File:
            return GleamTech.FileUltimate.FileIconManager.getIconCls(i.extension, t);
        default:
            return ""
        }
    }, getItemThumbnailSrc: function (n, t) {
        var i = n.data,
            r, u;
        return i.itemType != GleamTech.FileUltimate.FileManagerItemType.File || i.size == 0 ? "" : GleamTech.FileUltimate.FileThumbnailManager.isSupported(i.extension) ? (r = this.navigationSelection.getPathData(), u = GleamTech.Util.Path.combine(this.serverHandlerUrl, "GetThumbnail?"), u + Ext.Object.toQueryString({
            relativePath: r.relativePath,
            fileName: i.name,
            maxSize: t,
            cacheKey: r.rootFolderHash + "-" + i.size + "-" + i.lastModifiedTime.getTime()
        })) : ""
    }, setNavigationSelection: function (n, t, i) {
        var r = this.navigationSelection;
        n || (n = this.navigationStore.getCount() > 0 ? this.navigationStore.root : null);
        this.callParent([n]);
        this.isNavigationSelectionValid ? i || this.navigationSelection == r || this.viewStore.load({
            node: this.navigationSelection,
            previousNode: r,
            callback: t
        }) : (this.ribbon && (this.ribbon.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !1, !0)), this.ribbon.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !0))), this.navigationBar.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !0)))
    }, onViewStoreLoad: function (n, t, i, r) {
        var u = r.config.node,
            f = r.config.previousNode,
            e = r.config.folderNodeRecords;
        i ? (this.ribbon && (this.ribbon.toggleItemsUICondition(this.getUIConditionFn(u, null, null, !1, !0)), this.ribbon.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !0))), this.navigationBar.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !0)), this.navigationStore.fillNode(u, e), u.data.expanded = !1, u.expand()) : this.setNavigationSelection(f, null, !0);
        this.callParent(arguments)
    }, onViewRefresh: function (n) {
        var i, t;
        (this.callParent(arguments), this.isNavigationSelectionValid) && (i = GleamTech.Util.Path.combine(this.serverHandlerUrl, "GetThumbnailReferer?"), i += Ext.Object.toQueryString({
            stateId: this.serverStateId,
            rootFolderName: this.navigationSelection.getPathData().rootFolderName
        }), t = this, this.referrerIframe.setReferrer(i, function (i) {
            i && t.referrerIframe.window.eval("function createImage() { return new Image(); }");
            t.centerPane.initLazyImageLoader(n, t.referrerIframe.window.createImage)
        }))
    }, getSelectionStatusText: function (n) {
        var r = 0,
            u = n.length,
            t, i;
        if (u == 0) return "";
        for (t = 0; t < u; t++) {
            if (i = n[t].data, i.itemType != GleamTech.FileUltimate.FileManagerItemType.File) return "";
            r += i.size
        }
        return GleamTech.Util.Culture.formatByteSize(r)
    }, onViewSelectionChange: function (n, t) {
        this.callParent(arguments);
        var i = this.getUIConditionFn(t[t.length - 1], t, this.navigationSelection, !0);
        this.ribbon && this.ribbon.toggleItemsUICondition(i);
        this.chooseButton && this.chooseButton.toggleUICondition(i)
    }, onViewItemDblClick: function (n, t) {
        if (this.chooseButton && !this.chooseButton.disabled) {
            this.chooseButton.fireHandler();
            return
        }
        if (t.data.itemType != GleamTech.FileUltimate.FileManagerItemType.File || GleamTech.FileUltimate.ArchiveFileManager.isSupported(t.data.extension)) {
            var i = this.navigationSelection.findChildNodeByName(t.data.name);
            this.setNavigationSelection(i)
        } else this.navigationSelection.checkPermission(GleamTech.FileUltimate.FileManagerPermissionTypes.Download) && !this.chooseButton && this.submitDownloadForm(this.navigationSelection.getPathData().fullPath, t.data.name)
    }, onNavigationViewItemContextMenuBeforeShow: function (n) {
        n.toggleItemsUICondition(this.getUIConditionFn(this.contextMenuSelection, null, this.contextMenuSelection.parentNode))
    }, onViewContainerContextMenuBeforeShow: function (n) {
        n.toggleItemsUICondition(this.getUIConditionFn(this.navigationSelection))
    }, onViewItemContextMenuBeforeShow: function (n) {
        n.toggleItemsUICondition(this.getUIConditionFn(this.contextMenuSelection, this.viewSelection, this.navigationSelection))
    }, getUIConditionFn: function (n, t, i, r, u) {
        var s, f, e, c, o, h;
        if (t && t.length > 1)
            for (f = {}, e = new GleamTech.FileUltimate.FolderItemModel, o = 0; o < t.length; o++) h = t[o], e.combinePermissionsOfRecord(h), f[h.data.itemType] = !0;
        else n && (s = Ext.Object.getKey(GleamTech.FileUltimate.FileManagerItemType, n.data.itemType), f = !1, n.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File && (c = n.data.extension.toLowerCase()));
        return function (o, h, l) {
            var a, v, y, p, w;
            if (h && r || l && u || (v = o[h ? "showConditions" : "enableConditions"], !v)) return undefined;
            if (Ext.isFunction(v.checkFn)) return Ext.callback(v.checkFn, v.scope, [n, t, i]);
            if (f) {
                for (y in f)
                    if (p = Ext.Object.getKey(GleamTech.FileUltimate.FileManagerItemType, +y), a = v.itemTypes[p], !a || !a.multiple) return !1;
                for (w in v.itemTypes)
                    if ((a = v.itemTypes[w], a.parentPermissions && i && !i.checkEitherPermissionName(a.parentPermissions)) || a.permissions && e.hasPermissions() && !e.checkEitherPermissionName(a.permissions)) return !1;
                return !0
            }
            if (s && v.itemTypes) {
                if ((a = v.itemTypes[s], !a) || a.parentPermissions && i && !i.checkEitherPermissionName(a.parentPermissions) || a.permissions && !n.checkEitherPermissionName(a.permissions)) return !1;
                if (!a.extensions || Ext.Array.contains(a.extensions, c)) return !0
            }
            return !1
        }
    }, setClipboard: function (n, t, i) {
        this.clearClipboard();
        this.clipboard.action = n;
        this.clipboard.folderNodeRecord = t;
        this.clipboard.records = Ext.Array.clone(i);
        this.clipboard.isEmpty = !1;
        this.isNavigationSelectionValid && this.getAction("Paste").enable()
    }, clearClipboard: function () {
        delete this.clipboard.action;
        delete this.clipboard.folderNodeRecord;
        this.clipboard.records && this.clipboard.records.length && (this.clipboard.records.length = 0);
        delete this.clipboard.records;
        this.clipboard.isEmpty = !0;
        this.getAction("Paste").disable()
    }, refreshFolderNode: function (n, t) {
        n == this.navigationSelection ? this.viewStore.load({
            node: n,
            isRefresh: !0,
            callback: t
        }) : this.navigationStore.load({
            node: n,
            isRefresh: !0,
            callback: t
        })
    }, submitDownloadForm: function (n, t, i, r) {
        for (var u, f, e; this.downloadForm.dom.firstChild;) this.downloadForm.dom.removeChild(this.downloadForm.dom.firstChild);
        i == GleamTech.FileUltimate.FileManagerDownloadMethod.DownloadAsZip ? (u = GleamTech.Util.Path.combine(this.serverHandlerUrl, "DownloadAsZip"), f = {
            stateId: this.serverStateId,
            path: n,
            itemNames: r,
            zipFileName: t
        }, this.downloadForm.set({
            method: "post",
            action: u
        }), this.downloadForm.createChild({
            tag: "input",
            name: "parameters",
            type: "hidden"
        }).dom.value = Ext.encode(f)) : (u = GleamTech.Util.Path.combine(this.serverHandlerUrl, "Download"), f = {
            stateId: this.serverStateId,
            path: n,
            fileName: t,
            openInBrowser: i == GleamTech.FileUltimate.FileManagerDownloadMethod.OpenInBrowser || Ext.is.iOS === !0
        }, this.downloadForm.set({
            method: "get",
            action: u
        }), Ext.Object.each(f, function (n, t) {
            this.downloadForm.createChild({
                tag: "input",
                name: n,
                type: "hidden"
            }).dom.value = t
        }, this));
        Ext.is.iOS ? (this.downloadForm.set({
            target: ""
        }), this.downloadForm.dom.submit()) : i == GleamTech.FileUltimate.FileManagerDownloadMethod.OpenInBrowser ? (e = new GleamTech.UI.Window({
            title: t,
            width: this.getWidth() * 90 / 100,
            height: this.getHeight() * 90 / 100,
            minimizeOffset: [0, this.statusBar ? this.statusBar.getHeight() * -1 : 0],
            alignTarget: this,
            resizable: !0,
            maximizable: !0,
            minimizable: !0,
            layout: "fit",
            items: {
                xtype: "component",
                autoEl: {
                    tag: "iframe",
                    name: Ext.id(null, "file-iframe-"),
                    src: "javascript:&quot;&quot;",
                    style: {
                        border: "none",
                        backgroundColor: "white"
                    },
                    frameBorder: "0"
                }
            },
            listeners: {
                afterRender: {
                    fn: function () {
                        var n = e.el.query("iframe", !1)[0],
                            t = n.dom.contentWindow || window.frames[n.dom.name];
                        n.on("load", function () {
                            var i, r, n;
                            try {
                                i = t.document.body;
                                r = t.document.title
                            } catch (u) {
                                return
                            }
                            if (i) {
                                if (r == "Download Error") {
                                    e.close();
                                    return
                                }
                                n = i.firstChild;
                                n.tagName == "IMG" && (i.style.margin = "0", n.style.position = "absolute", n.style.left = "50%", n.style.marginLeft = "-" + n.offsetWidth / 2 + "px", n.style.top = "50%", n.style.marginTop = "-" + n.offsetHeight / 2 + "px")
                            }
                        });
                        this.downloadForm.set({
                            target: n.dom.name
                        });
                        this.downloadForm.dom.submit()
                    }, scope: this
                }
            }
        }), e.show()) : (this.downloadForm.set({
            target: this.downloadIframe.dom.name
        }), this.downloadForm.dom.submit())
    }, getItemNameWithType: function (n) {
        return n.data.itemType == GleamTech.FileUltimate.FileManagerItemType.Folder ? n.data.name + "\\" : n.data.name
    }, getItemNamesWithType: function (n) {
        return Ext.Array.map(n, function (n) {
            return this.getItemNameWithType(n)
        }, this)
    }, getItemNameAsFolder: function (n) {
        return n + "\\"
    }, onActionRefresh: function (n, t, i) {
        var r;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            r = this.contextMenuSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
            r = this.navigationSelection;
            break;
        default:
            return
        }
        this.refreshFolderNode(r)
    }, onActionCut: function (n, t, i) {
        var r, u;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            r = this.contextMenuSelection.parentNode;
            u = [this.contextMenuSelection];
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            r = this.navigationSelection;
            u = this.viewSelection;
            break;
        default:
            return
        }
        this.setClipboard(GleamTech.FileUltimate.FileManagerClipboardAction.Cut, r, u)
    }, onActionCopy: function (n, t, i) {
        var r, u;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            r = this.contextMenuSelection.parentNode;
            u = [this.contextMenuSelection];
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            r = this.navigationSelection;
            u = this.viewSelection;
            break;
        default:
            return
        }
        this.setClipboard(GleamTech.FileUltimate.FileManagerClipboardAction.Copy, r, u)
    }, onActionPaste: function (n, t, i) {
        var r, u, f;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            r = this.contextMenuSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
            r = this.navigationSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            r = this.navigationSelection.findChildNodeByName(this.contextMenuSelection.data.name);
            break;
        default:
            return
        }
        if (u = this.clipboard.folderNodeRecord, !u.parentNode) {
            this.clearClipboard();
            return
        }
        f = !1;
        this.clipboard.action == GleamTech.FileUltimate.FileManagerClipboardAction.Cut && Ext.Array.each(this.clipboard.records, function (n) {
            var t = u.findChildNodeByName(n.data.name);
            return t && (t == this.navigationSelection || t.contains(this.navigationSelection)) ? (f = !0, !1) : !0
        }, this);
        this.callServerHandlerMethod({
            name: this.clipboard.action == GleamTech.FileUltimate.FileManagerClipboardAction.Cut ? "Move" : "Copy",
            parameters: {
                path: u.getPathData().fullPath,
                itemNames: this.getItemNamesWithType(this.clipboard.records),
                targetPath: r.getPathData().fullPath
            },
            callback: function (n) {
                if (n) {
                    var i = this,
                        t = null;
                    r != u && (t = function () {
                        r.parentNode && i.refreshFolderNode(r)
                    });
                    f ? this.setNavigationSelection(u, t) : this.refreshFolderNode(u, t)
                }
            }, scope: this
        });
        this.clipboard.action == GleamTech.FileUltimate.FileManagerClipboardAction.Cut && this.clearClipboard()
    }, onActionDelete: function (n, t, i) {
        var u, r, s = !1,
            f, e, o;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            u = this.contextMenuSelection.parentNode;
            r = [this.contextMenuSelection];
            (this.contextMenuSelection == this.navigationSelection || this.contextMenuSelection.contains(this.navigationSelection)) && (s = !0);
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            u = this.navigationSelection;
            r = this.viewSelection;
            break;
        default:
            return
        }
        r.length == 1 ? (o = r[0], o.data.itemType == GleamTech.FileUltimate.FileManagerItemType.Folder ? (f = GleamTech.Util.Language.getEntry("Label.DeleteFolder"), e = GleamTech.Util.Language.getEntry("Message.Confirm.DeleteFolder") + ("<br/><br/>" + o.data.name)) : (f = GleamTech.Util.Language.getEntry("Label.DeleteFile"), e = GleamTech.Util.Language.getEntry("Message.Confirm.DeleteFile") + ("<br/><br/>" + o.data.name))) : (f = GleamTech.Util.Language.getEntry("Label.DeleteMultipleItems"), e = GleamTech.Util.Language.getEntry("Message.Confirm.DeleteMultipleItems", r.length));
        this.messageBox.confirm(f, e, function (n) {
            n == "yes" && this.callServerHandlerMethod({
                name: "Delete",
                parameters: {
                    path: u.getPathData().fullPath,
                    itemNames: this.getItemNamesWithType(r)
                },
                callback: function (n) {
                    n && (s ? this.setNavigationSelection(u) : this.refreshFolderNode(u))
                }, scope: this
            })
        }, this)
    }, onActionRename: function (n, t, i) {
        var u, f, r, c, o, e, s, h;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            u = this.contextMenuSelection.parentNode;
            f = this.contextMenuSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            u = this.navigationSelection;
            f = this.viewSelection[0];
            break;
        default:
            return
        }
        r = f.data.name;
        f.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? (c = GleamTech.Util.Path.getExtension(r), o = GleamTech.Util.Path.getFileNameWithoutExtension(r), e = this.showFileExtensions ? r : o, s = !this.showFileExtensions, h = o.length) : (e = r, s = !1, h = r.length);
        this.messageBox.promptWithValidator(GleamTech.Util.Language.getEntry("Label.RenameItem"), GleamTech.Util.Language.getEntry("Message.Prompt.RenameItem"), function (n, t) {
            if (n == "ok") {
                var i = t;
                s && (i += c);
                this.callServerHandlerMethod({
                    name: "Rename",
                    parameters: {
                        path: u.getPathData().fullPath,
                        itemName: this.getItemNameWithType(f),
                        itemNewName: i
                    },
                    callback: function (n) {
                        if (n) {
                            var t = u.findChildNodeByName(r);
                            t && (t.set("name", i), t.commit());
                            this.refreshFolderNode(u)
                        }
                    }, scope: this
                })
            }
        }, this, e, h, function (n) {
            return n == e || Ext.String.trim(n) == "" ? !1 : GleamTech.Util.Path.isValidFileName(n) ? !0 : GleamTech.Util.Language.getEntry("Message.Error.InvalidFileName") + '<br/>&emsp;&emsp;&emsp; \\ / : * ? " < > |'
        })
    }, onActionNewFolder: function (n, t, i) {
        var r, u;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            r = this.contextMenuSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
            r = this.navigationSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            r = this.navigationSelection.findChildNodeByName(this.contextMenuSelection.data.name);
            break;
        default:
            return
        }
        u = GleamTech.Util.Language.getEntry("Label.NewFolder");
        this.messageBox.promptWithValidator(GleamTech.Util.Language.getEntry("Label.CreateFolder"), GleamTech.Util.Language.getEntry("Message.Prompt.CreateFolder"), function (n, t) {
            n == "ok" && this.callServerHandlerMethod({
                name: "Create",
                parameters: {
                    path: r.getPathData().fullPath,
                    itemName: this.getItemNameAsFolder(t)
                },
                callback: function (n) {
                    n && this.refreshFolderNode(r)
                }, scope: this
            })
        }, this, u, u.length, function (n) {
            return Ext.String.trim(n) == "" ? !1 : GleamTech.Util.Path.isValidFileName(n) ? !0 : GleamTech.Util.Language.getEntry("Message.Error.InvalidFileName") + '<br/>&emsp;&emsp;&emsp; \\ / : * ? " < > |'
        })
    }, onActionDownload: function (n, t, i) {
        var f, u, r, e;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            f = this.contextMenuSelection.parentNode;
            u = [this.contextMenuSelection];
            r = this.contextMenuSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
            f = this.navigationSelection;
            u = this.viewSelection;
            r = this.viewSelection[0];
            break;
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            f = this.navigationSelection;
            u = this.viewSelection;
            r = this.contextMenuSelection;
            break;
        default:
            return
        }
        e = f.getPathData().fullPath;
        u.length > 1 || r.data.itemType == GleamTech.FileUltimate.FileManagerItemType.Folder ? this.submitDownloadForm(e, GleamTech.Util.Path.getFileNameWithoutExtension(r.data.name) + ".zip", GleamTech.FileUltimate.FileManagerDownloadMethod.DownloadAsZip, this.getItemNamesWithType(u)) : this.submitDownloadForm(e, r.data.name)
    }, onActionUpload: function (n, t, i) {
        var r;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            r = this.contextMenuSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
            r = this.navigationSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            r = this.navigationSelection.findChildNodeByName(this.contextMenuSelection.data.name);
            break;
        default:
            return
        }
        if (this.fileUploader || (this.fileUploader = new GleamTech.JavaScript.UI.FileUploader({
            ElementId: this.el.id + "-fileUploader",
            Container: this.el.dom,
            StateId: this.uploaderStateId,
            Language: this.uploaderLanguage,
            ResourceBasePath: this.uploaderResourceBasePath,
            ActionBasePath: this.uploaderActionBasePath,
            UploadMethods: this.uploaderMethods,
            Width: "540px",
            Height: "300px",
            ModalDialog: !0,
            ShowOnLoad: !1
        }), this.fileUploader.Parameters.ModalDialogTitle = this.fileUploader.Language.GetEntry("FileManager.Action.UploadFiles"), this.fileUploader.GridView.useIconCls = !0, this.fileUploader.getFileIconName = function (n) {
            return GleamTech.FileUltimate.FileIconManager.getIconCls(n, 16)
        }), this.fileUploader.SetFileTypes(r.data.fileTypes), this.fileUploader.SetCustomParameters({
            fileManagerStateId: this.serverStateId,
            fileManagerPath: r.getPathData().fullPath
        }), r == this.navigationSelection) {
            var f = [],
                u = this,
                e = this.centerPane.getSelectionModel();
            this.fileUploader.ItemUploaded = function (n) {
                f.push(Ext.data.SortTypes.asLocaleString(n));
                u.refreshFolderNode(r);
                u.viewStore.on("refresh", function () {
                    for (var r, t, i = [], n = 0; n < f.length; n++) r = f[n], t = u.viewStore.findBy(function (n) {
                        return Ext.data.SortTypes.asLocaleString(n.data.name) == r
                    }), t > -1 && i.push(u.viewStore.getAt(t));
                    e.select(i)
                }, this, {
                    single: !0
                })
            }
        } else this.fileUploader.ItemUploaded = null;
        this.fileUploader.Show()
    }, onActionOpen: function (n, t, i) {
        var r, u;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            this.setNavigationSelection(this.contextMenuSelection);
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            r = this.viewSelection[0];
            r.data.itemType != GleamTech.FileUltimate.FileManagerItemType.File || GleamTech.FileUltimate.ArchiveFileManager.isSupported(r.data.extension) ? (u = this.navigationSelection.findChildNodeByName(r.data.name), this.setNavigationSelection(u)) : this.submitDownloadForm(this.navigationSelection.getPathData().fullPath, r.data.name, GleamTech.FileUltimate.FileManagerDownloadMethod.OpenInBrowser);
            break;
        default:
            return
        }
    }, onActionAddToZip: function (n, t, i) {
        var r, f, u, s, e, h, c, l, o;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            r = this.contextMenuSelection.parentNode;
            f = [this.contextMenuSelection];
            u = this.contextMenuSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
            r = this.navigationSelection;
            f = this.viewSelection;
            u = this.viewSelection[0];
            break;
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            r = this.navigationSelection;
            f = this.viewSelection;
            u = this.contextMenuSelection;
            break;
        default:
            return
        }
        s = ".zip";
        e = u.data.name;
        u.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? (o = GleamTech.Util.Path.getFileNameWithoutExtension(e), h = this.showFileExtensions ? o + s : o, c = !this.showFileExtensions, l = o.length) : (h = e, c = !0, l = e.length);
        this.messageBox.promptWithValidator(GleamTech.Util.Language.getEntry("Label.AddItemsToZip"), GleamTech.Util.Language.getEntry("Message.Prompt.AddItemsToZip"), function (n, t) {
            if (n == "ok") {
                var i = t;
                c && (i += s);
                this.callServerHandlerMethod({
                    name: "AddToZip",
                    parameters: {
                        path: r.getPathData().fullPath,
                        itemNames: this.getItemNamesWithType(f),
                        zipFileName: i
                    },
                    callback: function (n) {
                        n && this.refreshFolderNode(r)
                    }, scope: this
                })
            }
        }, this, h, l, function (n) {
            return Ext.String.trim(n) == "" ? !1 : GleamTech.Util.Path.isValidFileName(n) ? !0 : GleamTech.Util.Language.getEntry("Message.Error.InvalidFileName") + '<br/>&emsp;&emsp;&emsp; \\ / : * ? " < > |'
        })
    }, onActionExtractAllTo: function (n, t, i) {
        var r, u, f, e;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            r = this.contextMenuSelection.parentNode;
            u = this.contextMenuSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            r = this.navigationSelection;
            u = this.viewSelection[0];
            break;
        default:
            return
        }
        f = u.data.name;
        e = GleamTech.Util.Path.getFileNameWithoutExtension(f);
        this.messageBox.promptWithValidator(GleamTech.Util.Language.getEntry("Label.ExtractItemsFromArchive"), GleamTech.Util.Language.getEntry("Message.Prompt.ExtractItemsFromArchive"), function (n, t) {
            if (n == "ok") {
                var i = r.getPathData().fullPath;
                this.callServerHandlerMethod({
                    name: "ExtractAll",
                    parameters: {
                        path: i,
                        archiveFileName: f,
                        targetPath: i,
                        folderName: t
                    },
                    callback: function (n) {
                        n && this.refreshFolderNode(r)
                    }, scope: this
                })
            }
        }, this, e, e.length, function (n) {
            return Ext.String.trim(n) == "" ? !1 : GleamTech.Util.Path.isValidFileName(n) ? !0 : GleamTech.Util.Language.getEntry("Message.Error.InvalidFileName") + '<br/>&emsp;&emsp;&emsp; \\ / : * ? " < > |'
        })
    }, onActionExtractAllHere: function (n, t, i) {
        var r, u, e, f;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            r = this.contextMenuSelection.parentNode;
            u = this.contextMenuSelection;
            break;
        case GleamTech.UI.ExplorerViewActionContext.View:
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            r = this.navigationSelection;
            u = this.viewSelection[0];
            break;
        default:
            return
        }
        e = u.data.name;
        f = r.getPathData().fullPath;
        this.callServerHandlerMethod({
            name: "ExtractAll",
            parameters: {
                path: f,
                archiveFileName: e,
                targetPath: f,
                folderName: ""
            },
            callback: function (n) {
                n && this.refreshFolderNode(r)
            }, scope: this
        })
    }, onActionChoose: function (n, t, i) {
        var f, e, o, r, u;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.View:
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            for (this.hidingAfterChoose = !0, this.hide(), delete this.hidingAfterChoose, e = this.navigationSelection.getPathData().fullPath, o = [], r = 0; r < this.viewSelection.length; r++) u = this.viewSelection[r], o.push({
                Name: u.data.name,
                FullPath: GleamTech.Util.Path.combine(e, u.data.name, GleamTech.Util.Path.backSlash),
                IsFolder: u.data.itemType == GleamTech.FileUltimate.FileManagerItemType.Folder
            });
            f = {
                IsCanceled: !1,
                Items: o,
                ParentFullPath: e
            };
            break;
        default:
            f = {
                IsCanceled: !0,
                Items: [],
                ParentFullPath: ""
            }
        }
        this.centerPane.getSelectionModel().deselectAll();
        Ext.callback(window[this.chosen], window, [this, f])
    }
});
Ext.define("GleamTech.FileUltimate.FolderItemModel", {
    extend: "Ext.data.Model",
    fields: [{
        name: "itemType"
    }, {
        name: "name",
        sortType: "asLocaleString"
    }, {
        name: "permissions"
    }, {
        name: "fileTypes"
    }, {
        name: "extension",
        calculate: function (n) {
            return n.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? GleamTech.Util.Path.getExtension(n.name, !0) : ""
        }
    }],
    checkPermission: function (n) {
        return (this.data.permissions & n) == n
    }, checkEitherPermissionName: function (n) {
        for (var i, r, t = 0; t < n.length; t++)
            if (i = n[t], r = GleamTech.FileUltimate.FileManagerPermissionTypes[i], this.checkPermission(r)) return !0;
        return !1
    }, hasPermissions: function () {
        return this.data.permissions !== ""
    }, combinePermissionsOfRecord: function (n) {
        n.hasPermissions() && (this.hasPermissions() ? this.data.permissions |= n.data.permissions : this.data.permissions = n.data.permissions)
    }
});
Ext.define("GleamTech.FileUltimate.FolderNodeModel", {
    extend: "GleamTech.FileUltimate.FolderItemModel",
    fields: [{
        name: "expandable"
    }, {
        name: "hash"
    }],
    constructor: function () {
        this.callParent(arguments);
        this.nameIndexer = {};
        this.on({
            scope: this,
            append: this.onNodeAdded,
            insert: this.onNodeAdded,
            remove: this.onNodeRemove,
            beforeexpand: this.onBeforeExpand,
            expand: this.onExpand
        })
    }, onNodeAdded: function (n, t) {
        n == this && (t.hasOwnProperty("childrenNotLoadedYet") && (t.set("loaded", !1), delete t.childrenNotLoadedYet), this.nameIndexer[Ext.data.SortTypes.asLocaleString(t.data.name)] = t)
    }, onNodeRemove: function (n, t) {
        n == this && delete this.nameIndexer[Ext.data.SortTypes.asLocaleString(t.data.name)]
    }, onBeforeExpand: function () {
        this.isLoaded() || this.setBusy(!0)
    }, onExpand: function () {
        this.setBusy(!1)
    }, showBusy: function () {
        if (!this.busyActive) {
            this.busyActive = !0;
            var n = Ext.get(this.getOwnerTree().getView().getNode(this));
            n.down(".x-tree-icon").addCls("x-loading")
        }
    }, hideBusy: function () {
        if (this.busyActive) {
            this.busyActive = !1;
            var n = Ext.get(this.getOwnerTree().getView().getNode(this));
            n.down(".x-tree-icon").removeCls("x-loading")
        }
    }, setBusy: function (n) {
        n ? this.busyTimeout = Ext.defer(this.showBusy, 200, this) : (clearTimeout(this.busyTimeout), this.hideBusy())
    }, set: function () {
        var t = this.callParent(arguments),
            n = this;
        return n.modified && Ext.Object.each(n.modified, function (t, i) {
            if (t == "name") {
                n.onNameChange(i, n.data.name);
                return !1
            }
            return !0
        }), t
    }, onNameChange: function (n, t) {
        var i = this.parentNode;
        i && (delete i.nameIndexer[Ext.data.SortTypes.asLocaleString(n)], i.nameIndexer[Ext.data.SortTypes.asLocaleString(t)] = this)
    }, findChildNodeByName: function (n) {
        return this.nameIndexer[Ext.data.SortTypes.asLocaleString(n)]
    }, getPathData: function () {
        for (var i = [], u = [], t = this, r, n; t.parentNode;) i.unshift(t.data.name), u.unshift(t.data.hash), t = t.parentNode;
        return r = GleamTech.Util.Path.backSlash, n = {}, n.rootFolderName = i[0], n.rootFolderHash = u[0], n.relativePath = r + i.slice(1).join(r), n.fullPath = n.rootFolderName + ":" + n.relativePath, n
    }
});
Ext.define("GleamTech.FileUltimate.FolderViewModel", {
    extend: "GleamTech.FileUltimate.FolderItemModel",
    fields: [{
        name: "size"
    }, {
        name: "type"
    }, {
        name: "lastModifiedTime",
        type: "date",
        dateFormat: "c"
    }]
});
GleamTech.FileUltimate.FileManagerItemType = {
    RootFolder: 1,
    Folder: 2,
    File: 3
};
GleamTech.FileUltimate.FileManagerPermissionTypes = {
    ListSubfolders: 1,
    ListFiles: 2,
    Create: 4,
    Delete: 8,
    Rename: 16,
    Edit: 32,
    Upload: 64,
    Download: 128,
    Compress: 256,
    Extract: 512,
    Cut: 1024,
    Copy: 2048,
    Paste: 4096
};
GleamTech.FileUltimate.FileManagerChooserType = {
    File: 1,
    Folder: 2,
    FileOrFolder: 3
};
GleamTech.FileUltimate.FileManagerDownloadMethod = {
    OpenInBrowser: 1,
    DownloadAsZip: 2
};
GleamTech.FileUltimate.FileManagerClipboardAction = {
    Copy: 1,
    Cut: 2
};
typeof Crypto != "undefined" && Crypto.util || function () {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        r = window.Crypto = {},
        i = r.util = {
            rotl: function (n, t) {
                return n << t | n >>> 32 - t
            }, rotr: function (n, t) {
                return n << 32 - t | n >>> t
            }, endian: function (n) {
                if (n.constructor == Number) return i.rotl(n, 8) & 16711935 | i.rotl(n, 24) & 4278255360;
                for (var t = 0; t < n.length; t++) n[t] = i.endian(n[t]);
                return n
            }, randomBytes: function (n) {
                for (var t = []; n > 0; n--) t.push(Math.floor(Math.random() * 256));
                return t
            }, bytesToWords: function (n) {
                for (var r = [], t = 0, i = 0; t < n.length; t++, i += 8) r[i >>> 5] |= n[t] << 24 - i % 32;
                return r
            }, wordsToBytes: function (n) {
                for (var i = [], t = 0; t < n.length * 32; t += 8) i.push(n[t >>> 5] >>> 24 - t % 32 & 255);
                return i
            }, bytesToHex: function (n) {
                for (var i = [], t = 0; t < n.length; t++) i.push((n[t] >>> 4).toString(16)), i.push((n[t] & 15).toString(16));
                return i.join("")
            }, hexToBytes: function (n) {
                for (var i = [], t = 0; t < n.length; t += 2) i.push(parseInt(n.substr(t, 2), 16));
                return i
            }, bytesToBase64: function (i) {
                var f, r, e, u;
                if (typeof btoa == "function") return btoa(n.bytesToString(i));
                for (f = [], r = 0; r < i.length; r += 3)
                    for (e = i[r] << 16 | i[r + 1] << 8 | i[r + 2], u = 0; u < 4; u++) r * 8 + u * 6 <= i.length * 8 ? f.push(t.charAt(e >>> 6 * (3 - u) & 63)) : f.push("=");
                return f.join("")
            }, base64ToBytes: function (i) {
                if (typeof atob == "function") return n.stringToBytes(atob(i));
                i = i.replace(/[^A-Z0-9+\/]/ig, "");
                for (var f = [], u = 0, r = 0; u < i.length; r = ++u % 4) r != 0 && f.push((t.indexOf(i.charAt(u - 1)) & Math.pow(2, -2 * r + 8) - 1) << r * 2 | t.indexOf(i.charAt(u)) >>> 6 - r * 2);
                return f
            }
        },
        u = r.charenc = {},
        f = u.UTF8 = {
            stringToBytes: function (t) {
                return n.stringToBytes(unescape(encodeURIComponent(t)))
            }, bytesToString: function (t) {
                return decodeURIComponent(escape(n.bytesToString(t)))
            }
        },
        n = u.Binary = {
            stringToBytes: function (n) {
                for (var i = [], t = 0; t < n.length; t++) i.push(n.charCodeAt(t) & 255);
                return i
            }, bytesToString: function (n) {
                for (var i = [], t = 0; t < n.length; t++) i.push(String.fromCharCode(n[t]));
                return i.join("")
            }
        }
}();
(function () {
    var i = Crypto,
        t = i.util,
        r = i.charenc,
        u = r.UTF8,
        f = r.Binary,
        n = i.MD5 = function (i, r) {
            var u = t.wordsToBytes(n._md5(i));
            return r && r.asBytes ? u : r && r.asString ? f.bytesToString(u) : t.bytesToHex(u)
        };
    n._md5 = function (i) {
        var s;
        i.constructor == String && (i = u.stringToBytes(i));
        var h = t.bytesToWords(i),
            y = i.length * 8,
            r = 1732584193,
            f = -271733879,
            e = -1732584194,
            o = 271733878;
        for (s = 0; s < h.length; s++) h[s] = (h[s] << 8 | h[s] >>> 24) & 16711935 | (h[s] << 24 | h[s] >>> 8) & 4278255360;
        h[y >>> 5] |= 128 << y % 32;
        h[(y + 64 >>> 9 << 4) + 14] = y;
        var c = n._ff,
            l = n._gg,
            a = n._hh,
            v = n._ii;
        for (s = 0; s < h.length; s += 16) {
            var p = r,
                w = f,
                b = e,
                k = o;
            r = c(r, f, e, o, h[s + 0], 7, -680876936);
            o = c(o, r, f, e, h[s + 1], 12, -389564586);
            e = c(e, o, r, f, h[s + 2], 17, 606105819);
            f = c(f, e, o, r, h[s + 3], 22, -1044525330);
            r = c(r, f, e, o, h[s + 4], 7, -176418897);
            o = c(o, r, f, e, h[s + 5], 12, 1200080426);
            e = c(e, o, r, f, h[s + 6], 17, -1473231341);
            f = c(f, e, o, r, h[s + 7], 22, -45705983);
            r = c(r, f, e, o, h[s + 8], 7, 1770035416);
            o = c(o, r, f, e, h[s + 9], 12, -1958414417);
            e = c(e, o, r, f, h[s + 10], 17, -42063);
            f = c(f, e, o, r, h[s + 11], 22, -1990404162);
            r = c(r, f, e, o, h[s + 12], 7, 1804603682);
            o = c(o, r, f, e, h[s + 13], 12, -40341101);
            e = c(e, o, r, f, h[s + 14], 17, -1502002290);
            f = c(f, e, o, r, h[s + 15], 22, 1236535329);
            r = l(r, f, e, o, h[s + 1], 5, -165796510);
            o = l(o, r, f, e, h[s + 6], 9, -1069501632);
            e = l(e, o, r, f, h[s + 11], 14, 643717713);
            f = l(f, e, o, r, h[s + 0], 20, -373897302);
            r = l(r, f, e, o, h[s + 5], 5, -701558691);
            o = l(o, r, f, e, h[s + 10], 9, 38016083);
            e = l(e, o, r, f, h[s + 15], 14, -660478335);
            f = l(f, e, o, r, h[s + 4], 20, -405537848);
            r = l(r, f, e, o, h[s + 9], 5, 568446438);
            o = l(o, r, f, e, h[s + 14], 9, -1019803690);
            e = l(e, o, r, f, h[s + 3], 14, -187363961);
            f = l(f, e, o, r, h[s + 8], 20, 1163531501);
            r = l(r, f, e, o, h[s + 13], 5, -1444681467);
            o = l(o, r, f, e, h[s + 2], 9, -51403784);
            e = l(e, o, r, f, h[s + 7], 14, 1735328473);
            f = l(f, e, o, r, h[s + 12], 20, -1926607734);
            r = a(r, f, e, o, h[s + 5], 4, -378558);
            o = a(o, r, f, e, h[s + 8], 11, -2022574463);
            e = a(e, o, r, f, h[s + 11], 16, 1839030562);
            f = a(f, e, o, r, h[s + 14], 23, -35309556);
            r = a(r, f, e, o, h[s + 1], 4, -1530992060);
            o = a(o, r, f, e, h[s + 4], 11, 1272893353);
            e = a(e, o, r, f, h[s + 7], 16, -155497632);
            f = a(f, e, o, r, h[s + 10], 23, -1094730640);
            r = a(r, f, e, o, h[s + 13], 4, 681279174);
            o = a(o, r, f, e, h[s + 0], 11, -358537222);
            e = a(e, o, r, f, h[s + 3], 16, -722521979);
            f = a(f, e, o, r, h[s + 6], 23, 76029189);
            r = a(r, f, e, o, h[s + 9], 4, -640364487);
            o = a(o, r, f, e, h[s + 12], 11, -421815835);
            e = a(e, o, r, f, h[s + 15], 16, 530742520);
            f = a(f, e, o, r, h[s + 2], 23, -995338651);
            r = v(r, f, e, o, h[s + 0], 6, -198630844);
            o = v(o, r, f, e, h[s + 7], 10, 1126891415);
            e = v(e, o, r, f, h[s + 14], 15, -1416354905);
            f = v(f, e, o, r, h[s + 5], 21, -57434055);
            r = v(r, f, e, o, h[s + 12], 6, 1700485571);
            o = v(o, r, f, e, h[s + 3], 10, -1894986606);
            e = v(e, o, r, f, h[s + 10], 15, -1051523);
            f = v(f, e, o, r, h[s + 1], 21, -2054922799);
            r = v(r, f, e, o, h[s + 8], 6, 1873313359);
            o = v(o, r, f, e, h[s + 15], 10, -30611744);
            e = v(e, o, r, f, h[s + 6], 15, -1560198380);
            f = v(f, e, o, r, h[s + 13], 21, 1309151649);
            r = v(r, f, e, o, h[s + 4], 6, -145523070);
            o = v(o, r, f, e, h[s + 11], 10, -1120210379);
            e = v(e, o, r, f, h[s + 2], 15, 718787259);
            f = v(f, e, o, r, h[s + 9], 21, -343485551);
            r = r + p >>> 0;
            f = f + w >>> 0;
            e = e + b >>> 0;
            o = o + k >>> 0
        }
        return t.endian([r, f, e, o])
    };
    n._ff = function (n, t, i, r, u, f, e) {
        var o = n + (t & i | ~t & r) + (u >>> 0) + e;
        return (o << f | o >>> 32 - f) + t
    };
    n._gg = function (n, t, i, r, u, f, e) {
        var o = n + (t & r | i & ~r) + (u >>> 0) + e;
        return (o << f | o >>> 32 - f) + t
    };
    n._hh = function (n, t, i, r, u, f, e) {
        var o = n + (t ^ i ^ r) + (u >>> 0) + e;
        return (o << f | o >>> 32 - f) + t
    };
    n._ii = function (n, t, i, r, u, f, e) {
        var o = n + (i ^ (t | ~r)) + (u >>> 0) + e;
        return (o << f | o >>> 32 - f) + t
    };
    n._blocksize = 16;
    n._digestsize = 16
})();
this.JSON || (this.JSON = {}),
    function () {
        "use strict";

        function i(n) {
            return n < 10 ? "0" + n : n
        }

        function e(n) {
            return f.lastIndex = 0, f.test(n) ? '"' + n.replace(f, function (n) {
                var t = o[n];
                return typeof t == "string" ? t : "\\u" + ("0000" + n.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + n + '"'
        }

        function u(i, f) {
            var c, l, s, a, v = n,
                h, o = f[i];
            o && typeof o == "object" && typeof o.toJSON == "function" && (o = o.toJSON(i));
            typeof t == "function" && (o = t.call(f, i, o));
            switch (typeof o) {
            case "string":
                return e(o);
            case "number":
                return isFinite(o) ? String(o) : "null";
            case "boolean":
            case "null":
                return String(o);
            case "object":
                if (!o) return "null";
                if (n += r, h = [], Object.prototype.toString.apply(o) === "[object Array]") {
                    for (a = o.length, c = 0; c < a; c += 1) h[c] = u(c, o) || "null";
                    return s = h.length === 0 ? "[]" : n ? "[\n" + n + h.join(",\n" + n) + "\n" + v + "]" : "[" + h.join(",") + "]", n = v, s
                }
                if (t && typeof t == "object")
                    for (a = t.length, c = 0; c < a; c += 1) l = t[c], typeof l == "string" && (s = u(l, o), s && h.push(e(l) + (n ? ": " : ":") + s));
                else
                    for (l in o) Object.hasOwnProperty.call(o, l) && (s = u(l, o), s && h.push(e(l) + (n ? ": " : ":") + s));
                return s = h.length === 0 ? "{}" : n ? "{\n" + n + h.join(",\n" + n) + "\n" + v + "}" : "{" + h.join(",") + "}", n = v, s
            }
        }
        typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = function () {
            return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + i(this.getUTCMonth() + 1) + "-" + i(this.getUTCDate()) + "T" + i(this.getUTCHours()) + ":" + i(this.getUTCMinutes()) + ":" + i(this.getUTCSeconds()) + "Z" : null
        }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () {
            return this.valueOf()
        });
        var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            f = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            n, r, o = {
                "\b": "\\b",
                "\t": "\\t",
                "\n": "\\n",
                "\f": "\\f",
                "\r": "\\r",
                '"': '\\"',
                "\\": "\\\\"
            },
            t;
        typeof JSON.stringify != "function" && (JSON.stringify = function (i, f, e) {
            var o;
            if (n = "", r = "", typeof e == "number")
                for (o = 0; o < e; o += 1) r += " ";
            else typeof e == "string" && (r = e); if (t = f, f && typeof f != "function" && (typeof f != "object" || typeof f.length != "number")) throw new Error("JSON.stringify");
            return u("", {
                "": i
            })
        });
        typeof JSON.parse != "function" && (JSON.parse = function (text, reviver) {
            function walk(n, t) {
                var r, u, i = n[t];
                if (i && typeof i == "object")
                    for (r in i) Object.hasOwnProperty.call(i, r) && (u = walk(i, r), u !== undefined ? i[r] = u : delete i[r]);
                return reviver.call(n, t, i)
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function (n) {
                return "\\u" + ("0000" + n.charCodeAt(0).toString(16)).slice(-4)
            })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
                "": j
            }, "") : j;
            throw new SyntaxError("JSON.parse");
        })
    }();
var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.Util = {};
GleamTech.JavaScript.Util.OnDomReady = function (n) {
    var t = t || {},
        i, r, u, f;
    if (t.loaded) return n();
    if (i = t.observers, i || (i = t.observers = []), i[i.length] = n, !t.callback) {
        t.callback = function () {
            var i, n, r, u;
            if (!t.loaded) {
                for (t.loaded = !0, t.timer && (clearInterval(t.timer), t.timer = null), i = t.observers, n = 0, r = i.length; n < r; n++) u = i[n], i[n] = null, u();
                t.callback = t.observers = null
            }
        };
        var s = !!(window.attachEvent && !window.opera),
            e = !1,
            o = navigator.userAgent.match(/AppleWebKit\/(\d+)/);
        o && o[1] < 525 && (e = !0);
        document.readyState && e ? t.timer = setInterval(function () {
            var n = document.readyState;
            (n == "loaded" || n == "complete") && t.callback()
        }, 50) : document.readyState && s && window == window.top ? (r = !1, u = function () {
            r || (r = !0, t.callback())
        }, function () {
            try {
                document.documentElement.doScroll("left")
            } catch (n) {
                setTimeout(arguments.callee, 50);
                return
            }
            u()
        }(), document.onreadystatechange = function () {
            document.readyState == "complete" && (document.onreadystatechange = null, u())
        }) : window.addEventListener ? (document.addEventListener("DOMContentLoaded", t.callback, !1), window.addEventListener("load", t.callback, !1)) : window.attachEvent ? window.attachEvent("onload", t.callback) : (f = window.onload, window.onload = function () {
            t.callback();
            f && f()
        })
    }
};
GleamTech.JavaScript.Util.AddEvent = function (n, t, i) {
    return n.addEventListener ? (n.addEventListener(t, i, !1), !0) : n.attachEvent ? n.attachEvent("on" + t, i) : !1
};
GleamTech.JavaScript.Util.RemoveEvent = function (n, t, i) {
    return n.removeEventListener ? (n.removeEventListener(t, i, !1), !0) : n.detachEvent ? n.detachEvent("on" + t, i) : !1
};
GleamTech.JavaScript.Util.SimulateMouse = function (n) {
    var i = n.changedTouches,
        r = i[0],
        t = "";
    switch (n.type) {
    case "touchstart":
        t = "mousedown";
        break;
    case "touchmove":
        t = "mousemove";
        break;
    case "touchend":
        t = "mouseup";
        break;
    default:
        return
    }
    GleamTech.JavaScript.Util.TriggerMouseEvent(r, t);
    n.preventDefault()
};
GleamTech.JavaScript.Util.SimulateClick = function (n) {
    function i(n) {
        if (GleamTech.JavaScript.Util.RemoveEvent(t, "touchend", i), t.touchContextMenuFired) {
            t.touchContextMenuFired = !1;
            n.preventDefault();
            return
        }
        n.changedTouches[0].target == t && GleamTech.JavaScript.Util.TriggerMouseEvent(n.changedTouches[0], "click");
        n.preventDefault()
    }
    if (n.type == "touchstart") {
        var t = n.changedTouches[0].target;
        GleamTech.JavaScript.Util.AddEvent(t, "touchend", i);
        n.preventDefault()
    }
};
GleamTech.JavaScript.Util.SimulateContextMenu = function (n, t) {
    function r(n) {
        clearTimeout(u);
        n.preventDefault()
    }
    if (n.type == "touchstart") {
        var u, i = n.changedTouches[0].target;
        GleamTech.JavaScript.Util.AddEvent(i, "touchend", r);
        GleamTech.JavaScript.Util.AddEvent(i, "touchmove", r);
        u = setTimeout(function () {
            GleamTech.JavaScript.Util.RemoveEvent(i, "touchend", r);
            GleamTech.JavaScript.Util.RemoveEvent(i, "touchmove", r);
            i.touchContextMenuFired = !0;
            var u = !0;
            t && (u = t());
            u && GleamTech.JavaScript.Util.TriggerMouseEvent(n.changedTouches[0], "contextmenu")
        }, 750);
        n.preventDefault()
    }
};
GleamTech.JavaScript.Util.TriggerMouseEvent = function (n, t, i) {
    var r = document.createEvent("MouseEvent");
    r.initMouseEvent(t, !0, !0, window, 1, n.screenX, n.screenY, n.clientX, n.clientY, !1, !1, !1, !1, 0, null);
    r.isSimulatedMouseEvent = !0;
    i ? i.dispatchEvent(r) : n.target.dispatchEvent(r)
};
GleamTech.JavaScript.Util.CancelEvent = function (n) {
    if (!n) var n = window.event;
    return n.cancelBubble = !0, n.stopPropagation && n.stopPropagation(), n.returnValue = !1, n.preventDefault && n.preventDefault(), !1
};
GleamTech.JavaScript.Util.CancelEventExceptForTextInput = function (n) {
    var n, t;
    return n || (n = window.event), t = GleamTech.JavaScript.Util.GetEventTarget(n), t.type == "text" || t.type == "password" || t.type == "textarea" || t.type == "file" ? !0 : GleamTech.JavaScript.Util.CancelEvent(n)
};
GleamTech.JavaScript.Util.GetEventTarget = function (n) {
    var t;
    return n.target ? t = n.target : n.srcElement && (t = n.srcElement), t.nodeType == 3 && (t = t.parentNode), t
};
GleamTech.JavaScript.Util.FindPosition = function (n) {
    var t = 0,
        i = 0;
    if (n.offsetParent)
        for (t = n.offsetLeft, i = n.offsetTop; n = n.offsetParent;) t += n.offsetLeft, i += n.offsetTop;
    return [t, i]
};
GleamTech.JavaScript.Util.GetStyleProperty = function (n, t) {
    var i = "";
    return n.currentStyle ? i = n.currentStyle[t] : window.getComputedStyle && (i = document.defaultView.getComputedStyle(n, null).getPropertyValue(t)), i
};
GleamTech.JavaScript.Util.GetStyleObject = function (n) {
    var f, r, u, i, t;
    if (!document.styleSheets) return null;
    for (f = "." + GleamTech.JavaScript.Util.Trim(n).toLowerCase(), r = 0; r < document.styleSheets.length; r++) try {
        for (u = document.styleSheets[r], i = u.cssRules ? u.cssRules : u.rules, t = 0; t < i.length; t++)
            if (i[t] && i[t].selectorText && i[t].selectorText.toLowerCase() === f) return i[t].style
    } catch (e) {}
    return null
};
GleamTech.JavaScript.Util.EnsureDisplay = function (n, t) {
    for (var f = [], i = n, e, r, u; i && i !== document;) GleamTech.JavaScript.Util.GetStyleProperty(i, "display") == "none" && f.push(i), i = i.parentNode;
    if (f.length > 0) {
        for (e = {
            visibility: "hidden",
            display: "block"
        }, r = 0; r < f.length; r++) {
            i = f[r];
            i.originalStyle = {};
            for (u in e) i.originalStyle[u] = i.style[u], i.style[u] = e[u]
        }
        for (t(n), r = 0; r < f.length; r++) {
            i = f[r];
            for (u in e) i.style[u] = i.originalStyle[u];
            try {
                delete i.originalStyle
            } catch (o) {
                i.originalStyle = null
            }
        }
    } else t(n)
};
GleamTech.JavaScript.Util.RequestJson = function (n, t, i, r, u) {
    var o = function () {
            var n = null;
            if (window.XMLHttpRequest) try {
                    n = new XMLHttpRequest
                } catch (t) {
                    n = null
                } else if (window.ActiveXObject) try {
                    n = new ActiveXObject("Msxml2.XMLHTTP")
                } catch (t) {
                    try {
                        n = new ActiveXObject("Microsoft.XMLHTTP")
                    } catch (t) {
                        n = null
                    }
                }
                return n
        },
        f, e;
    if ((f = o()) != null) {
        f.onreadystatechange = function () {
            var n, t, o, s, e;
            if (f.readyState == 4) {
                try {
                    f.status !== undefined && f.status != 0 ? (n = f.status, t = f.statusText) : (n = 13030, t = "Status Unavailable")
                } catch (h) {
                    n = 13030;
                    t = "Status Unavailable"
                }
                if (n == 200) {
                    if (o = f.getResponseHeader("Content-Type"), s = o && o.indexOf("application/json") != -1, s) {
                        e = JSON.parse(f.responseText);
                        e.Success ? i && i(e.Result) : r && r(e.Result);
                        return
                    }
                    t += "\n(Response content-type is not application/json)"
                }
                n >= 100 && n < 600 ? alert("HTTP Error:\n\n" + n + " - " + t) : alert("Connection Error:\n\n" + n + " - " + t);
                u && u()
            }
        };
        try {
            e = t != null ? JSON.stringify(t) : null;
            f.open("POST", n, !0);
            f.setRequestHeader("Content-Type", "application/json; charset=utf-8");
            f.setRequestHeader("Accept", "application/json");
            f.send(e)
        } catch (s) {
            alert("Connection Error:\n\n" + s.toString())
        }
    } else alert("A required object, XMLHttpRequest is not found!")
};
GleamTech.JavaScript.Util.FormatFileSize = function (n) {
    var t;
    if (n.length == 0) return "";
    var i = ["B", "KB", "MB", "GB", "TB"],
        r = i.length - 1;
    for (n = +n, t = 0; n >= 1024 && t < r;) n /= 1024, t++;
    return n.toFixed([0, 0, 2, 2, 2][t]) + " " + i[t]
};
GleamTech.JavaScript.Util.GetFileNameWithoutExtension = function (n) {
    var t = n.lastIndexOf(".");
    return t > 0 ? n.substr(0, t) : n
};
GleamTech.JavaScript.Util.GetFileExtension = function (n) {
    var t = n.lastIndexOf(".");
    return t > 0 ? n.substr(t, n.length) : ""
};
GleamTech.JavaScript.Util.GetZipFileName = function (n) {
    var u, f = "",
        t, i, r;
    return t = /(\.\w+)$/, i = t.exec(n), i && (f = i[1].toLowerCase(), n = n.replace(t, f)), f == "" ? u = n + ".zip" : f == ".zip" ? (t = /\((\d+)\)\.zip$/, i = t.exec(n), r = i ? parseInt(i[1]) : 0, r++, u = r == 1 ? n.replace(/\.zip$/, " (" + r + ").zip") : n.replace(t, " (" + r + ").zip")) : u = n.replace(t, ".zip"), u
};
GleamTech.JavaScript.Util.CheckFileName = function (n) {
    return !/[\/:\*\?"<>|\\]/.test(n)
};
GleamTech.JavaScript.Util.TrimFileName = function (n) {
    while (n.substring(0, 1) == " " || n.substring(0, 1) == "\n" || n.substring(0, 1) == "\r") n = n.substring(1, n.length);
    while (n.substring(n.length - 1, n.length) == " " || n.substring(n.length - 1, n.length) == "." || n.substring(n.length - 1, n.length) == "\n" || n.substring(n.length - 1, n.length) == "\r") n = n.substring(0, n.length - 1);
    return n
};
GleamTech.JavaScript.Util.Trim = function (n, t) {
    return n = GleamTech.JavaScript.Util.TrimStart(n, t), GleamTech.JavaScript.Util.TrimEnd(n, t)
};
GleamTech.JavaScript.Util.TrimStart = function (n, t) {
    for (t || (t = " "); n.substring(0, 1) == t;) n = n.substring(1, n.length);
    return n
};
GleamTech.JavaScript.Util.TrimEnd = function (n, t) {
    for (t || (t = " "); n.substring(n.length - 1, n.length) == t;) n = n.substring(0, n.length - 1);
    return n
};
GleamTech.JavaScript.Util.EscapeRegExpPattern = function (n) {
    return n.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
};
GleamTech.JavaScript.Util.GetIEVersion = function () {
    if (document.body.style.scrollbar3dLightColor != undefined) return document.body.style.opacity != undefined ? 9 : document.querySelector != undefined ? 8 : document.body.style.msInterpolationMode != undefined ? 7 : document.body.style.textOverflow != undefined ? 6 : 5.5
};
GleamTech.JavaScript.Util.SetOpacity = function (n, t) {
    "opacity" in n.style ? n.style.opacity = t / 10 : n.style.filter = t == 10 ? "" : "alpha(opacity=" + t * 10 + ")"
};
GleamTech.JavaScript.Util.SetBorderRadius = function (n, t, i, r, u) {
    var f = t + "px " + i + "px " + r + "px " + u + "px";
    "borderRadius" in n.style ? n.style.borderRadius = f : "MozBorderRadius" in n.style ? n.style.MozBorderRadius = f : "webkitBorderRadius" in n.style && (n.style.webkitBorderRadius = f)
};
GleamTech.JavaScript.Util.CreateUniqueId = function () {
    return (new Date).getTime() + "" + Math.floor(Math.random() * 8999 + 1e3)
};
GleamTech.JavaScript.Util.GetPropertyName = function (n, t) {
    for (var i in n)
        if (n[i] == t) return i;
    return ""
};
GleamTech.JavaScript.Util.SelectInputText = function (n, t, i) {
    if (n.createTextRange) {
        var r = n.createTextRange();
        r.collapse(!0);
        r.moveStart("character", t);
        r.moveEnd("character", i - t);
        r.select()
    } else n.setSelectionRange ? n.setSelectionRange(t, i) : n.selectionStart && (n.selectionStart = t, n.selectionEnd = i);
    n.disabled || n.focus()
};
GleamTech.JavaScript.Util.DeSelectAllRanges = function () {
    document.selection ? document.selection.empty() : window.getSelection && window.getSelection().removeAllRanges()
};
GleamTech.JavaScript.Util.SelectRange = function (n) {
    var t;
    GleamTech.JavaScript.Util.DeSelectAllRanges();
    document.selection ? (t = document.body.createTextRange(), t.moveToElementText(document.getElementById(n)), t.select()) : window.getSelection && (t = document.createRange(), t.selectNode(document.getElementById(n)), window.getSelection().addRange(t))
};
GleamTech.JavaScript.Util.ExecuteFunctionByName = function (n, t) {
    for (var u = Array.prototype.slice.call(arguments, 2), i = n.split("."), f = i.pop(), r = 0; r < i.length; r++) t = t[i[r]];
    return t[f].apply(t, u)
};
GleamTech.JavaScript.Util.AppendToUrl = function (n, t) {
    return n[n.length - 1] != "/" ? n + "/" + t : n + t
};
GleamTech.JavaScript.Util.RefreshPage = function (n) {
    var t = n || window;
    t.location.href.indexOf("#") == -1 ? t.location.href = t.location.href : t.location.reload()
};
GleamTech.JavaScript.Util.Viewport = {};
GleamTech.JavaScript.Util.Viewport.GetWidth = function () {
    var n;
    return self.innerHeight ? n = self.innerWidth : document.documentElement && document.documentElement.clientWidth ? n = document.documentElement.clientWidth : document.body && (n = document.body.clientWidth), n
};
GleamTech.JavaScript.Util.Viewport.GetHeight = function () {
    var n;
    return self.innerHeight ? n = self.innerHeight : document.documentElement && document.documentElement.clientHeight ? n = document.documentElement.clientHeight : document.body && (n = document.body.clientHeight), n
};
GleamTech.JavaScript.Util.Viewport.GetScrollLeft = function () {
    var n;
    return self.pageXOffset || self.pageYOffset ? n = self.pageXOffset : document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop) ? n = document.documentElement.scrollLeft : document.body && (n = document.body.scrollLeft), n
};
GleamTech.JavaScript.Util.Viewport.GetScrollTop = function () {
    var n;
    return self.pageXOffset || self.pageYOffset ? n = self.pageYOffset : document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop) ? n = document.documentElement.scrollTop : document.body && (n = document.body.scrollTop), n
};
GleamTech.JavaScript.Util.Viewport.GetScrollWidth = function () {
    var n;
    return document.documentElement && (document.documentElement.scrollWidth || document.documentElement.scrollHeight) ? n = document.documentElement.scrollWidth : document.body && (n = document.body.scrollWidth), n
};
GleamTech.JavaScript.Util.Viewport.GetScrollHeight = function () {
    var n;
    return document.documentElement && (document.documentElement.scrollWidth || document.documentElement.scrollHeight) ? n = document.documentElement.scrollHeight : document.body && (n = document.body.scrollHeight), n
};
GleamTech.JavaScript.Util.LanguageData = {};
GleamTech.JavaScript.Util.Languages = {};
GleamTech.JavaScript.Util.GetLanguage = function (n) {
    var t = GleamTech.JavaScript.Util.Languages[n],
        i;
    return t || (i = GleamTech.JavaScript.Util.LanguageData[n], t = new GleamTech.JavaScript.Util.Language(i), GleamTech.JavaScript.Util.Languages[n] = t), t
};
GleamTech.JavaScript.Util.Language = function (n) {
    this.entries = n
};
GleamTech.JavaScript.Util.Language.prototype.GetEntry = function (n, t, i, r) {
    var u = this.entries[n];
    if (u === undefined) throw new Error('Language entry with key "{0}" not found.').replace(/\{0\}/g, n);
    if (u == null) throw new Error('Value for language entry with key "{0}" is missing.').replace(/\{0\}/g, n);
    return t != undefined && (u = u.replace(/\{0\}/g, t)), i != undefined && (u = u.replace(/\{1\}/g, i)), r != undefined && (u = u.replace(/\{2\}/g, r)), u
};
GleamTech.JavaScript.Util.Sort = {};
GleamTech.JavaScript.Util.Sort.types = {};
GleamTech.JavaScript.Util.Sort.AddSortType = function (n, t, i, r) {
    GleamTech.JavaScript.Util.Sort.types[n] = {
        name: n,
        comparableValueFunction: t,
        compareFunction: i,
        defaultFormatFunction: r
    }
};
GleamTech.JavaScript.Util.Sort.CompareBasic = function (n, t) {
    return n < t ? -1 : n > t ? 1 : 0
};
GleamTech.JavaScript.Util.Sort.GetSelf = function (n) {
    return n
};
GleamTech.JavaScript.Util.Sort.GetLowerCase = function (n) {
    return n.toLowerCase()
};
GleamTech.JavaScript.Util.Sort.GetNumber = function (n) {
    return +n
};
GleamTech.JavaScript.Util.Sort.GetDate = function (n) {
    return new Date(n)
};
GleamTech.JavaScript.Util.Sort.FormatSfDate = function (n) {
    return n.substring(n.indexOf("|") + 1, n.length)
};
GleamTech.JavaScript.Util.Sort.FormatIsoDate = function (n, format) {
    var addLeadingZero = function (n) {
            return (n < 10 && n >= 0 ? "0" : "") + n
        },
        t = function (n) {
            var t, dateObj, oh = 0,
                om = 0;
            t = /^(\d{4})?-?(\d\d)?-?(\d\d)?[T ]?(\d\d)?:?(\d\d)?:?(\d\d)?([Z+-])?(\d\d)?:?(\d\d)?$/.test(n);
            with(RegExp) $7 != "Z" && (oh = $7 + $8, $9 && (om = $7 + $9)), dateObj = $7 ? new Date(Date.UTC($1 || 77, $2 - 1, $3, $4 - oh, $5 - om, $6)) : new Date($1 || 77, $2 - 1, $3, $4, $5, $6);
            return t ? dateObj : null
        },
        str, i = t(n);
    with(i) str = format, str = str.replace("dd", addLeadingZero(getDate())), str = str.replace("MM", addLeadingZero(getMonth() + 1)), str = str.replace("yyyy", getFullYear()), str = str.replace("HH", addLeadingZero(getHours())), str = str.replace("mm", addLeadingZero(getMinutes()));
    return str
};
GleamTech.JavaScript.Util.Sort.AddSortType("String", GleamTech.JavaScript.Util.Sort.GetSelf, GleamTech.JavaScript.Util.Sort.CompareBasic, null);
GleamTech.JavaScript.Util.Sort.AddSortType("CaseInsensitiveString", GleamTech.JavaScript.Util.Sort.GetLowerCase, GleamTech.JavaScript.Util.Sort.CompareBasic, null);
GleamTech.JavaScript.Util.Sort.AddSortType("Number", GleamTech.JavaScript.Util.Sort.GetNumber, GleamTech.JavaScript.Util.Sort.CompareBasic, null);
GleamTech.JavaScript.Util.Sort.AddSortType("Date", GleamTech.JavaScript.Util.Sort.GetDate, GleamTech.JavaScript.Util.Sort.CompareBasic, null);
GleamTech.JavaScript.Util.Sort.AddSortType("SortableFormattedDate", GleamTech.JavaScript.Util.Sort.GetSelf, GleamTech.JavaScript.Util.Sort.CompareBasic, GleamTech.JavaScript.Util.Sort.FormatSfDate);
GleamTech.JavaScript.Util.Sort.AddSortType("ISODate", GleamTech.JavaScript.Util.Sort.GetSelf, GleamTech.JavaScript.Util.Sort.CompareBasic, GleamTech.JavaScript.Util.Sort.FormatIsoDate);
var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.ToolBarCount = 0;
GleamTech.JavaScript.UI.ToolBarCssClass = "gt-toolBar";
GleamTech.JavaScript.UI.ToolBarButtonCssClass = "gt-toolBarButton";
GleamTech.JavaScript.UI.ToolBarButtonHoverCssClass = "gt-toolBarButton gt-toolBarButton-hover";
GleamTech.JavaScript.UI.ToolBarButtonSelectedCssClass = "gt-toolBarButton gt-toolBarButton-selected";
GleamTech.JavaScript.UI.ToolBarSeparatorCssClass = "gt-toolBarSeparator";
GleamTech.JavaScript.UI.ToolBar = function () {
    this.index = GleamTech.JavaScript.UI.ToolBarCount++;
    this.items = [];
    this.buttons = {};
    this.imagesPath = "";
    this.buttonWidth = 10;
    this.buttonHeight = 10;
    this.buttonBorder = 1;
    this.vertical = !1;
    this.onButtonClick = null
};
GleamTech.JavaScript.UI.ToolBar.prototype.SetButtonSize = function (n, t, i) {
    this.buttonWidth = n;
    this.buttonHeight = t;
    this.vertical = i
};
GleamTech.JavaScript.UI.ToolBar.prototype.SetImages = function (n, t, i) {
    this.imagesPath = n;
    this.imagesWidth = t;
    this.imagesHeight = i
};
GleamTech.JavaScript.UI.ToolBar.prototype.GetHeight = function () {
    return this.divElement.offsetHeight
};
GleamTech.JavaScript.UI.ToolBar.prototype.AddButton = function (n, t, i, r) {
    i && (i = this.imagesPath + i);
    var u = new GleamTech.JavaScript.UI.ToolBarButton(n, t, i, r, this.buttonWidth - this.buttonBorder * 2, this.buttonHeight - this.buttonBorder * 2);
    return u.toolbar = this, u.index = this.items.length, this.items[u.index] = u, this.buttons[n] = u, u
};
GleamTech.JavaScript.UI.ToolBar.prototype.AddSeparator = function () {
    var n = new GleamTech.JavaScript.UI.ToolBarSeparator(this.buttonHeight);
    return n.toolbar = this, this.items[this.items.length] = n, n
};
GleamTech.JavaScript.UI.ToolBar.prototype.ToggleActions = function (n) {
    for (var t = 0; t < n.length; t++) {
        var r = n[t][0],
            u = n[t][1],
            i = this.buttons[r];
        u ? i.Enable() : i.Disable()
    }
};
GleamTech.JavaScript.UI.ToolBar.prototype.Render = function (n, t) {
    this.divElement = document.createElement("div");
    t.appendChild(this.divElement);
    this.divElement.id = n;
    this.divElement.className = GleamTech.JavaScript.UI.ToolBarCssClass;
    this.vertical ? this.divElement.style.width = this.buttonWidth + 6 - 2 + "px" : this.divElement.style.height = this.buttonHeight + 6 - 2 + "px";
    this.divElement.style.overflow = "hidden";
    for (var i = 0; i < this.items.length; i++) this.items[i].Render(this.divElement)
};
GleamTech.JavaScript.UI.ToolBar.prototype.RenderItem = function (n) {
    n.Render(this.divElement)
};
GleamTech.JavaScript.UI.ToolBarButton = function (n, t, i, r, u, f) {
    this.action = n;
    this.description = t;
    this.image = i;
    this.width = u;
    this.height = f;
    this.disabled = r;
    this.toolbar = null;
    this.index = -1;
    this.divElement = null;
    this.imgElement = null;
    this.isToolbarButton = !0
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.Render = function (n) {
    var r = this,
        t = document.createElement("div"),
        i;
    t.title = this.description;
    t.style.cssFloat = "left";
    t.style.styleFloat = "left";
    t.style.textAlign = "center";
    t.style.padding = "2px";
    t.style.width = this.width + "px";
    t.style.height = this.height + "px";
    t.className = GleamTech.JavaScript.UI.ToolBarButtonCssClass;
    GleamTech.JavaScript.Util.AddEvent(t, "mouseover", function (n) {
        r.onMouseOver(n)
    });
    GleamTech.JavaScript.Util.AddEvent(t, "mouseout", function (n) {
        r.onMouseOut(n)
    });
    GleamTech.JavaScript.Util.AddEvent(t, "mousedown", function (n) {
        r.onMouseDown(n)
    });
    GleamTech.JavaScript.Util.AddEvent(t, "mouseup", function (n) {
        r.onMouseUp(n)
    });
    GleamTech.JavaScript.Util.AddEvent(t, "click", function (n) {
        r.onClick(n)
    });
    this.divElement = t;
    this.image && (i = new Image, i.src = this.image, i.style.width = this.toolbar.imagesWidth + "px", i.style.height = this.toolbar.imagesHeight + "px", i.style.marginLeft = (this.width - this.toolbar.imagesWidth) / 2 + "px", i.style.marginRight = (this.width - this.toolbar.imagesWidth) / 2 + "px", i.style.marginTop = (this.height - this.toolbar.imagesHeight) / 2 + "px", this.imgElement = i, t.appendChild(i));
    n.appendChild(t);
    this.disabled && (this.disabled = !1, this.Disable())
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onMouseOver = function () {
    this.disabled || (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonHoverCssClass, this.divElement.style.padding = "2px")
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onMouseOut = function () {
    this.disabled || (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonCssClass, this.divElement.style.padding = "2px")
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onMouseDown = function (n) {
    var n, t;
    this.disabled || (n || (n = window.event), t = n.which ? n.which : n.button, t == 1) && (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonSelectedCssClass, this.divElement.style.paddingTop = "3px", this.divElement.style.paddingLeft = "3px", this.divElement.style.paddingBottom = "1px", this.divElement.style.paddingRight = "1px")
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onMouseUp = function (n) {
    var n, t;
    this.disabled || (n || (n = window.event), t = n.which ? n.which : n.button, t == 1) && (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonHoverCssClass, this.divElement.style.padding = "2px")
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onClick = function (n) {
    if (!this.disabled) {
        if (!n) var n = window.event;
        this.onMouseOut(n);
        if (this.toolbar.onButtonClick) this.toolbar.onButtonClick(this, n)
    }
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.Enable = function () {
    this.disabled && (this.divElement.disabled = !1, GleamTech.JavaScript.Util.SetOpacity(this.divElement, 10), this.disabled = !1)
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.Disable = function () {
    this.disabled || (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonCssClass, this.divElement.style.padding = "2px", this.divElement.disabled = !0, GleamTech.JavaScript.Util.SetOpacity(this.divElement, 4), this.disabled = !0)
};
GleamTech.JavaScript.UI.ToolBarSeparator = function (n) {
    this.height = n;
    this.toolbar = null
};
GleamTech.JavaScript.UI.ToolBarSeparator.prototype.Render = function (n) {
    var t = document.createElement("div");
    t.style.cssFloat = "left";
    t.style.styleFloat = "left";
    t.style.marginTop = "0px";
    t.style.marginLeft = "3px";
    t.style.marginBottom = "0px";
    t.style.marginRight = "3px";
    t.style.width = "1px";
    t.style.height = this.height + 2 + "px";
    t.className = GleamTech.JavaScript.UI.ToolBarSeparatorCssClass;
    n.appendChild(t)
};
var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.GridViewCount = 0;
GleamTech.JavaScript.UI.GridViewCssClass = "gt-gridView";
GleamTech.JavaScript.UI.GridViewColumnCssClass = "gt-gridViewColumn";
GleamTech.JavaScript.UI.GridViewColumnHoverCssClass = "gt-gridViewColumn gt-gridViewColumn-hover";
GleamTech.JavaScript.UI.GridViewColumnSelectedCssClass = "gt-gridViewColumn gt-gridViewColumn-selected";
GleamTech.JavaScript.UI.GridViewCellCssClass = "gt-gridViewCell";
GleamTech.JavaScript.UI.GridViewRowCssClass = "gt-gridViewRow";
GleamTech.JavaScript.UI.GridViewRowHoverCssClass = "gt-gridViewRow-hover";
GleamTech.JavaScript.UI.GridViewRowSelectedCssClass = "gt-gridViewRow-selected";
GleamTech.JavaScript.UI.GridViewRowSelectedHoverCssClass = "gt-gridViewRow-selectedHover";
GleamTech.JavaScript.UI.GridViewAscendingImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAAXElEQVQI12P48+cPAww7JJX8R+bDGTZxRf/DZh/4H9ex8D+KpE1kzv/Eadv+t514/X/i6Tf/Z207ClbA4Byf/79949H/ux59+b/17qf/Rx5/+X/q2df/h598/Q8A22pR/QPxkAUAAAAASUVORK5CYII=";
GleamTech.JavaScript.UI.GridViewDescendingImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAAXElEQVQI12OwiSv6nzRr5/+Clcf+F60+9b95183/U489+D/r+IP/DH/+/GEI6l79v3jTjf8zL7z7v/n2x/9HHn/5DxIHS4Jw+prL/5fd+AyXQJEE4Vmnn/1H5gMA7c1UrTOSm6YAAAAASUVORK5CYII=";
GleamTech.JavaScript.UI.GridViewSelectionImage = "";
GleamTech.JavaScript.UI.GridViewRowRoundBorders = !1;
GleamTech.JavaScript.UI.GridViewRowFocusedCssClass = "gt-gridViewRow-focused";
GleamTech.JavaScript.UI.GridView = function () {
    this.index = GleamTech.JavaScript.UI.GridViewCount++;
    this.columnsArray = [];
    this.columns = {};
    this.rowsArray = [];
    this.selectedRowsArray = [];
    this.lastSelectedRow = null;
    this.lastFocusedRow = null;
    this.selectedCount = 0;
    this.rowTitleColumn = null;
    this.sortColumn = null;
    this.sortDescending = !1;
    this.iconsPath = {};
    this.iconWidth = 0;
    this.iconHeight = 0;
    this.multipleSelection = !0;
    this.useIconCls = !1;
    this.onColumnClick = this.onColumnClickInternal;
    this.onRowContextMenu = null;
    this.onRowDoubleClick = null;
    this.onSelectionComplete = null;
    this.onGridContextMenu = null;
    this.onRowsRenderedForOnce = null;
    this.imgOrder = new Image;
    this.imgAscending = new Image;
    this.imgAscending.src = GleamTech.JavaScript.UI.GridViewAscendingImage;
    this.imgDescending = new Image;
    this.imgDescending.src = GleamTech.JavaScript.UI.GridViewDescendingImage;
    GleamTech.JavaScript.UI.GridViewSelectionImage && (this.imgSelection = new Image, this.imgSelection.src = GleamTech.JavaScript.UI.GridViewSelectionImage);
    this.isIE7 = GleamTech.JavaScript.Util.GetIEVersion() == 7
};
GleamTech.JavaScript.UI.GridView.prototype.SetIconSize = function (n, t) {
    this.iconWidth = n;
    this.iconHeight = t
};
GleamTech.JavaScript.UI.GridView.prototype.Resize = function (n, t) {
    var i = this;
    GleamTech.JavaScript.Util.EnsureDisplay(this.divElement, function (r) {
        var a, w, k, u, e, d, h, y, c, g, l;
        n && (r.style.width = n + "px");
        a = r.offsetWidth - 30;
        a < 0 && (a = 0);
        i.rowsTable.style.width = a + "px";
        i.divRowsTable.style.width = i.rowsTable.offsetWidth + "px";
        i.divColumns.style.width = (i.divRowsTable.offsetWidth == 30 ? r.offsetWidth : i.divRowsTable.offsetWidth) + "px";
        var s = i.divColumns.getElementsByTagName("div"),
            o = s.length,
            f, v = 0,
            p = 16,
            b = !0;
        if (i.tbody.childNodes.length == 0) {
            for (f = Math.floor(i.divColumns.offsetWidth / o) - p, f < 0 && (f = 0), w = 0, u = 0; u < o; u++) e = s[u], w += e.offsetWidth;
            if (w == i.divColumns.offsetWidth) b = !1;
            else
                for (u = 0; u < o - 1; u++) e = s[u], e.style.width = f + "px", v += e.offsetWidth
        } else
            for (k = i.tbody.childNodes[0], u = 0; u < o - 1; u++) e = s[u], d = k.childNodes[u], f = d.offsetWidth - p, f < 0 && (f = 0), u == 0 && (f += 6), e.style.width = f + "px", v += e.offsetWidth;
        o > 1 && b && (f = i.divColumns.offsetWidth - v - p, f < 0 && (f = 0), h = s[o - 1], h.style.cssFloat = "", h.style.styleFloat = "", h.style.position = "absolute", h.style.left = v + "px", h.style.width = f + "px");
        o > 1 && (y = s[0], c = i.columnsArray[y.columnIndex], c.paddingLeft = 10, c.paddingRight = 4, y.style.paddingLeft = c.paddingLeft + "px", y.style.paddingRight = c.paddingRight + "px");
        i.sortColumn && !i.sortColumn.hidden && (i.imgOrder.style.left = i.sortColumn.divElement.offsetLeft + Math.round((i.sortColumn.divElement.offsetWidth - i.imgOrder.offsetWidth) / 2) - 1 + "px");
        g = GleamTech.JavaScript.Util.FindPosition(r);
        i.verticalScrollbarX = g[0] + r.offsetWidth - 18;
        t && (r.style.height = t + "px");
        l = r.offsetHeight - i.divColumns.offsetHeight - 6;
        r.scrollWidth > r.clientWidth && (l -= 18);
        l < 0 && (l = 0);
        i.divRowsTable.style.height = l + "px";
        i.iScroll && (r.firstChild.style.width = i.divRowsTable.offsetWidth + "px", setTimeout(function () {
            i.iScroll.refresh();
            i.iScroll2.refresh()
        }, 0))
    })
};
GleamTech.JavaScript.UI.GridView.prototype.AddColumn = function (n, t, i, r, u, f) {
    var e = new GleamTech.JavaScript.UI.GridViewColumn(t, i, r, u, f);
    return e.grid = this, e.index = this.columnsArray.length, this.columnsArray[e.index] = e, this.columns[n] = e, e
};
GleamTech.JavaScript.UI.GridView.prototype.AddRow = function (n, t) {
    var i = new GleamTech.JavaScript.UI.GridViewRow(this, n, t);
    return i.index = this.rowsArray.length, this.rowsArray[i.index] = i, i
};
GleamTech.JavaScript.UI.GridView.prototype.Render = function (n, t) {
    var i, r;
    if (!this.divElement) {
        if (this.styleGridRow = GleamTech.JavaScript.UI.GridViewRowCssClass, this.styleGridRowHover = GleamTech.JavaScript.UI.GridViewRowHoverCssClass, this.styleGridRowSelected = GleamTech.JavaScript.UI.GridViewRowSelectedCssClass, this.styleGridRowSelectedHover = GleamTech.JavaScript.UI.GridViewRowSelectedHoverCssClass, this.styleGridRowFocused = GleamTech.JavaScript.UI.GridViewRowFocusedCssClass, this.gridRowHeight = 18, (isNaN(this.gridRowHeight) || this.gridRowHeight < 18) && (this.gridRowHeight = 18), this.divElement = document.createElement("div"), this.divElement.id = n, this.divElement.style.overflowX = "auto", this.divElement.style.overflowY = "hidden", this.divElement.style.position = "relative", this.divElement.className = GleamTech.JavaScript.UI.GridViewCssClass, t.appendChild(this.divElement), i = this, this.onGridContextMenu && (GleamTech.JavaScript.Util.AddEvent(this.divElement, "contextmenu", this.onGridContextMenu), GleamTech.JavaScript.Util.AddEvent(this.divElement, "touchstart", function (n) {
            GleamTech.JavaScript.Util.SimulateContextMenu(n, function () {
                return i.rowContextMenuActive ? (i.rowContextMenuActive = !1, !1) : !0
            })
        })), this.divColumns = document.createElement("div"), this.divElement.appendChild(this.divColumns), this.divColumns.style.overflow = "hidden", this.divColumns.style.position = "relative", this.imgOrder.style.position = "absolute", this.imgOrder.style.top = "2px", this.RefreshColumns(!0), this.divRowsTable = document.createElement("div"), this.divRowsTable.style.overflowX = "hidden", this.divRowsTable.style.overflowY = "auto", this.divRowsTable.style.paddingTop = "6px", this.divRowsTable.style.paddingLeft = "6px", this.divRowsTable.style.paddingRight = "24px", this.divElement.appendChild(this.divRowsTable), GleamTech.JavaScript.Util.AddEvent(this.divRowsTable, "mousedown", function (n) {
            return i.onMousedown(n)
        }), GleamTech.JavaScript.Util.AddEvent(this.divRowsTable, "mouseup", function (n) {
            return i.onMouseUp(n)
        }), GleamTech.JavaScript.Util.AddEvent(this.divRowsTable, "touchstart", GleamTech.JavaScript.Util.SimulateMouse), GleamTech.JavaScript.Util.AddEvent(this.divRowsTable, "touchend", GleamTech.JavaScript.Util.SimulateMouse), this.rowsTable = document.createElement("table"), this.divRowsTable.appendChild(this.rowsTable), this.rowsTable.cellPadding = 0, this.rowsTable.cellSpacing = 0, this.tbody = document.createElement("tbody"), this.rowsTable.appendChild(this.tbody), typeof iScroll == "function" && /(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
            for (this.iScroll = new iScroll(this.divRowsTable, {
                hScroll: !1
            }), r = document.createElement("div"); this.divElement.firstChild;) r.appendChild(this.divElement.firstChild);
            this.divElement.appendChild(r);
            this.iScroll2 = new iScroll(this.divElement, {
                vScroll: !1
            })
        }
        this.RenderRows(!0)
    }
};
GleamTech.JavaScript.UI.GridView.prototype.RenderRows = function (n) {
    for (var i = document.createDocumentFragment(), t = 0; t < this.rowsArray.length; t++) this.rowsArray[t].index = t, this.rowsArray[t].Render(i);
    this.tbody.appendChild(i);
    n || this.Resize();
    this.onRowsRenderedForOnce && (this.onRowsRenderedForOnce(), this.onRowsRenderedForOnce = null)
};
GleamTech.JavaScript.UI.GridView.prototype.Clear = function () {
    this.RemoveAllRows(!0);
    for (var n = 0; n < this.columnsArray.length; n++) this.columnsArray[n].divElement && this.divColumns.removeChild(this.columnsArray[n].divElement), this.columnsArray[n] = null;
    this.columnsArray.length = 0;
    this.sortDescending = !1;
    this.Resize()
};
GleamTech.JavaScript.UI.GridView.prototype.RemoveRow = function (n) {
    n.Unselect();
    this.lastSelectedRow == n && (this.lastSelectedRow = null);
    this.lastFocusedRow == n && (this.lastFocusedRow = null);
    this.tbody.removeChild(n.rowElement);
    this.rowsArray.splice(n.index, 1);
    delete n;
    for (var t = 0; t < this.rowsArray.length; t++) this.rowsArray[t].index = t;
    this.Resize()
};
GleamTech.JavaScript.UI.GridView.prototype.RemoveAllRows = function (n) {
    this.selectedRowsArray.length = 0;
    this.lastSelectedRow = null;
    this.lastFocusedRow = null;
    this.selectedCount = 0;
    this.rowsTable.removeChild(this.tbody);
    this.tbody = document.createElement("tbody");
    this.rowsTable.appendChild(this.tbody);
    for (var t = 0; t < this.rowsArray.length; t++) this.rowsArray[t] != undefined && delete this.rowsArray[t];
    this.rowsArray.length = 0;
    n || this.Resize()
};
GleamTech.JavaScript.UI.GridView.prototype.onMousedown = function (n) {
    n || (n = window.event);
    var t = GleamTech.JavaScript.Util.GetEventTarget(n),
        i = n.pageX ? n.pageX : n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft();
    return this.gridmousedown = t == this.divRowsTable, this.gridmousedown && this.divRowsTable.scrollHeight > this.divRowsTable.clientHeight && (this.gridmousedown = i < this.verticalScrollbarX), !0
};
GleamTech.JavaScript.UI.GridView.prototype.onMouseUp = function (n) {
    n || (n = window.event);
    var t = GleamTech.JavaScript.Util.GetEventTarget(n);
    return this.gridmousedown && t == this.divRowsTable && this.UnSelectAllRows(), !0
};
GleamTech.JavaScript.UI.GridView.prototype.onColumnClickInternal = function (n) {
    n == this.sortColumn ? this.Reverse() : this.Sort(n);
    this.Refresh()
};
GleamTech.JavaScript.UI.GridView.prototype.Sort = function (n, t, i) {
    var r, c;
    if (!n)
        if (this.sortColumn) n = this.sortColumn;
        else return;
    var e = this.rowsArray.length,
        l = n.index,
        a = n.sortType.comparableValueFunction,
        o = n.sortType.compareFunction,
        u = new Array(e);
    if (t) var v = t.index,
        y = t.sortType.comparableValueFunction,
        h = t.sortType.compareFunction,
        f = new Array(e);
    if (i) var p = i.index,
        w = i.sortType.comparableValueFunction,
        b = i.sortType.compareFunction,
        s = new Array(e);
    for (r = 0; r < e; r++) this.rowsArray[r].index = r, u[r] = a(this.rowsArray[r].cells[l]), t && (f[r] = y(this.rowsArray[r].cells[v])), i && (s[r] = w(this.rowsArray[r].cells[p]));
    c = i ? function (n, t) {
        var i = n.index,
            r = t.index,
            c = o(u[i], u[r]),
            e;
        return c != 0 ? c : (e = h(f[i], f[r]), e != 0) ? e : b(s[i], s[r])
    } : t ? function (n, t) {
        var i = n.index,
            r = t.index,
            e = o(u[i], u[r]);
        return e != 0 ? e : h(f[i], f[r])
    } : function (n, t) {
        var i = n.index,
            r = t.index;
        return o(u[i], u[r])
    };
    this.rowsArray.sort(c);
    this.sortDescending && this.rowsArray.reverse();
    this.sortColumn = i || t || n;
    this.divElement && !this.sortColumn.hidden && (this.imgOrder.src = this.sortDescending ? this.imgDescending.src : this.imgAscending.src, this.divColumns.appendChild(this.imgOrder), this.imgOrder.style.left = this.sortColumn.divElement.offsetLeft + Math.round((this.sortColumn.divElement.offsetWidth - this.imgOrder.offsetWidth) / 2) - 1 + "px")
};
GleamTech.JavaScript.UI.GridView.prototype.ResetSort = function () {
    this.sortColumn && (this.sortColumn = null, this.sortDescending = !1, this.imgOrder.parentNode == this.divColumns && this.divColumns.removeChild(this.imgOrder))
};
GleamTech.JavaScript.UI.GridView.prototype.Reverse = function () {
    this.rowsArray.reverse();
    this.sortDescending = !this.sortDescending
};
GleamTech.JavaScript.UI.GridView.prototype.Refresh = function () {
    var r = this.sortColumn,
        i, n, t;
    for (r && !r.hidden && (this.imgOrder.src = this.sortDescending ? this.imgDescending.src : this.imgAscending.src, this.divColumns.appendChild(this.imgOrder), this.imgOrder.style.left = this.sortColumn.divElement.offsetLeft + Math.round((this.sortColumn.divElement.offsetWidth - this.imgOrder.offsetWidth) / 2) - 1 + "px"), i = this.selectedRowsArray.slice(), this.unselectAllRowsInternal(), n = 0; n < this.rowsArray.length; n++) this.rowsArray[n].index = n, this.tbody.appendChild(this.rowsArray[n].rowElement);
    for (t = 0; t < i.length; t++) i[t].Select()
};
GleamTech.JavaScript.UI.GridView.prototype.RefreshColumns = function (n) {
    var i, t;
    for (this.visibleFirstColumn = null, this.visibleLastColumn = null, i = document.createDocumentFragment(), t = 0; t < this.columnsArray.length; t++) this.columnsArray[t].Render(i), this.columnsArray[t].hidden || (this.visibleFirstColumn == null && (this.visibleFirstColumn = this.columnsArray[t]), this.visibleLastColumn = this.columnsArray[t]);
    this.divColumns.appendChild(i);
    n || this.Resize()
};
GleamTech.JavaScript.UI.GridView.prototype.GetSelectedFirstRow = function () {
    return this.selectedRowsArray.length > 0 ? this.selectedRowsArray[0] : null
};
GleamTech.JavaScript.UI.GridView.prototype.GetSelectedLastRow = function () {
    return this.selectedRowsArray.length > 0 ? this.selectedRowsArray[this.selectedRowsArray.length - 1] : null
};
GleamTech.JavaScript.UI.GridView.prototype.GetSelectedCellValues = function (n) {
    for (var i = [], t = 0; t < this.selectedRowsArray.length; t++) i[t] = this.selectedRowsArray[t].GetCellValue(n);
    return i
};
GleamTech.JavaScript.UI.GridView.prototype.GetCellValues = function (n) {
    for (var i = [], t = 0; t < this.rowsArray.length; t++) i[t] = this.rowsArray[t].GetCellValue(n);
    return i
};
GleamTech.JavaScript.UI.GridView.prototype.SelectAllRows = function () {
    this.selectAllRowsInternal();
    this.onSelectionComplete && this.onSelectionComplete()
};
GleamTech.JavaScript.UI.GridView.prototype.UnSelectAllRows = function () {
    this.unselectAllRowsInternal();
    this.onSelectionComplete && this.onSelectionComplete()
};
GleamTech.JavaScript.UI.GridView.prototype.selectAllRowsInternal = function () {
    for (var n = 0; n < this.rowsArray.length; n++) this.rowsArray[n].Select()
};
GleamTech.JavaScript.UI.GridView.prototype.unselectAllRowsInternal = function () {
    for (var n = 0; n < this.selectedRowsArray.length; n++) this.selectedRowsArray[n].Unselect(), n--
};
GleamTech.JavaScript.UI.GridView.prototype.InvertSelectedRows = function () {
    for (var n = 0; n < this.rowsArray.length; n++) this.rowsArray[n].selected ? this.rowsArray[n].Unselect() : this.rowsArray[n].Select();
    this.onSelectionComplete && this.onSelectionComplete()
};
GleamTech.JavaScript.UI.GridView.prototype.ScrollToRow = function (n) {
    this.divRowsTable.scrollTop = n.rowElement.offsetTop
};
GleamTech.JavaScript.UI.GridViewColumn = function (n, t, i, r, u) {
    this.text = n;
    this.alignRight = i;
    this.format = r;
    this.hidden = !1;
    this.grid = null;
    this.index = -1;
    this.sortType = GleamTech.JavaScript.Util.Sort.types[t] ? GleamTech.JavaScript.Util.Sort.types[t] : GleamTech.JavaScript.Util.Sort.types.String;
    this.formatFunction = this.sortType.defaultFormatFunction ? this.sortType.defaultFormatFunction : null;
    this.size = u;
    this.paddingTop = 3;
    this.paddingLeft = i ? 10 : 4;
    this.paddingBottom = 1;
    this.paddingRight = i ? 4 : 10;
    this.divElement = null
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.Render = function (n) {
    var i, t, r;
    this.hidden || (n || (n = this.grid.divColumns), i = this, t = document.createElement("div"), t.style.cssFloat = "left", t.style.styleFloat = "left", t.style.whiteSpace = "nowrap", t.className = GleamTech.JavaScript.UI.GridViewColumnCssClass, this.alignRight && (t.style.textAlign = "right"), t.style.paddingTop = this.paddingTop + "px", t.style.paddingLeft = this.paddingLeft + "px", t.style.paddingBottom = this.paddingBottom + "px", t.style.paddingRight = this.paddingRight + "px", t.columnIndex = this.index, GleamTech.JavaScript.Util.AddEvent(t, "mouseover", function (n) {
        return i.onMouseOver(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mouseout", function (n) {
        return i.onMouseOut(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mousedown", function (n) {
        return i.onMouseDown(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mouseup", function (n) {
        return i.onMouseUp(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "click", function (n) {
        return i.onClick(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "contextmenu", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(t, "touchstart", function (n) {
        i.onMouseOver(n);
        i.onMouseDown(n);
        i.onClick(n);
        return GleamTech.JavaScript.Util.CancelEvent(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "touchend", function (n) {
        i.onMouseOut(n);
        i.onMouseUp(n);
        return GleamTech.JavaScript.Util.CancelEvent(n)
    }), this.divElement = t, r = document.createTextNode(this.text), t.appendChild(r), this == this.grid.sortColumn && (this.grid.imgOrder.src = this.grid.sortDescending ? this.grid.imgDescending.src : this.grid.imgAscending.src, this.grid.divColumns.appendChild(this.grid.imgOrder), this.grid.imgOrder.style.left = t.offsetLeft + Math.round((t.offsetWidth - this.grid.imgOrder.offsetWidth) / 2) - 1 + "px"), n.appendChild(t))
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onMouseOver = function () {
    this.divElement.className = GleamTech.JavaScript.UI.GridViewColumnHoverCssClass;
    this.divElement.style.paddingTop = this.paddingTop + "px";
    this.divElement.style.paddingLeft = this.paddingLeft + "px";
    this.divElement.style.paddingBottom = this.paddingBottom + "px";
    this.divElement.style.paddingRight = this.paddingRight + "px"
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onMouseOut = function () {
    this.divElement.className = GleamTech.JavaScript.UI.GridViewColumnCssClass;
    this.divElement.style.paddingTop = this.paddingTop + "px";
    this.divElement.style.paddingLeft = this.paddingLeft + "px";
    this.divElement.style.paddingBottom = this.paddingBottom + "px";
    this.divElement.style.paddingRight = this.paddingRight + "px"
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onMouseDown = function (n) {
    n || (n = window.event);
    var t = n.which ? n.which : n.button;
    t == 1 && (this.divElement.className = GleamTech.JavaScript.UI.GridViewColumnSelectedCssClass, this.divElement.style.paddingTop = this.paddingTop + 1 + "px", this.divElement.style.paddingLeft = this.paddingLeft + "px", this.divElement.style.paddingBottom = this.paddingBottom - 1 + "px", this.divElement.style.paddingRight = this.paddingRight + "px")
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onMouseUp = function (n) {
    n || (n = window.event);
    var t = n.which ? n.which : n.button;
    t == 1 && (this.divElement.className = GleamTech.JavaScript.UI.GridViewColumnHoverCssClass, this.divElement.style.paddingTop = this.paddingTop + "px", this.divElement.style.paddingLeft = this.paddingLeft + "px", this.divElement.style.paddingBottom = this.paddingBottom + "px", this.divElement.style.paddingRight = this.paddingRight + "px")
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onClick = function (n) {
    this.grid.onColumnClick(this, n)
};
GleamTech.JavaScript.UI.GridViewRow = function (n, t, i) {
    var r, u;
    this.grid = n;
    this.cells = t;
    n.useIconCls ? this.icon = i : (r = i.split(":"), this.icon = r.length > 1 ? n.iconsPath[r[0]] + r[1] : n.iconsPath["default"] + i);
    this.index = -1;
    this.rowElement = null;
    this.selected = !1;
    this.isGridRow = !0;
    u = this;
    this.mouseUpEvent = function (n) {
        return u.onMouseUp(n)
    }
};
GleamTech.JavaScript.UI.GridViewRow.prototype.GetCellValue = function (n) {
    return typeof n == "string" && (n = this.grid.columns[n]), this.cells[n.index]
};
GleamTech.JavaScript.UI.GridViewRow.prototype.SetCellValue = function (n, t) {
    typeof n == "string" && (n = this.grid.columns[n]);
    this.cells[n.index] = t
};
GleamTech.JavaScript.UI.GridViewRow.prototype.Render = function (n) {
    var o = this,
        t = document.createElement("tr"),
        i, e, u, f, s, h, r, c;
    for (n ? n.appendChild(t) : this.grid.tbody.appendChild(t), this.grid.rowTitleColumn && (t.title = this.cells[this.grid.rowTitleColumn.index]), GleamTech.JavaScript.Util.AddEvent(t, "mouseover", function (n) {
        return o.onMouseOver(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mouseout", function (n) {
        return o.onMouseOut(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mousedown", function (n) {
        return o.onMouseDown(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "dblclick", function (n) {
        return o.onDoubleClick(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "contextmenu", function (n) {
        return o.onContextMenu(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "touchstart", function (n) {
        GleamTech.JavaScript.Util.SimulateMouse(n);
        var t = GleamTech.JavaScript.Util.GetEventTarget(n),
            i = t.nodeName == "SPAN" && t.firstChild.nodeType == 3 && t.firstChild.nodeValue == String.fromCharCode(160);
        t.nodeName == "TD" || t.isContainerSpan || i || n.stopPropagation()
    }), GleamTech.JavaScript.Util.AddEvent(t, "touchstart", GleamTech.JavaScript.Util.SimulateContextMenu), GleamTech.JavaScript.Util.AddEvent(t, "touchmove", function (n) {
        var t = document.elementFromPoint(n.changedTouches[0].clientX, n.changedTouches[0].clientY),
            i = t,
            r = i.nodeName == "SPAN" && i.firstChild.nodeType == 3 && i.firstChild.nodeValue == String.fromCharCode(160);
        if (i.nodeName != "TD" && !i.isContainerSpan && !r) {
            while (t.nodeName.toUpperCase() != "TR" && t != document.body) t = t.parentNode;
            t.nodeName.toUpperCase() == "TR" && GleamTech.JavaScript.Util.TriggerMouseEvent(n.changedTouches[0], "mouseover", t)
        }
    }), t.className = this.grid.styleGridRow, this.grid.imgSelection && (t.style.backgroundImage = "url('" + this.grid.imgSelection.src + "')"), i = 0; i < this.cells.length; i++) this.grid.columnsArray[i].hidden || (e = document.createElement("td"), e.noWrap = !0, e.className = GleamTech.JavaScript.UI.GridViewCellCssClass, t.appendChild(e), this.grid.columnsArray[i].alignRight && (e.style.textAlign = "right"), e.style.minWidth = "80px", u = document.createElement("span"), e.appendChild(u), s = this.grid.columnsArray[i].formatFunction, f = s ? s(this.cells[i], this.grid.columnsArray[i].format, this) : this.cells[i], f.length == 0 && (f = " "), this.grid.columnsArray[i].size > 0 && f.length > this.grid.columnsArray[i].size && (f = f.substr(0, this.grid.columnsArray[i].size) + "..."), h = document.createTextNode(f != null ? f : String.fromCharCode(160)), i == this.grid.visibleFirstColumn.index ? (this.grid.useIconCls ? (r = document.createElement("span"), r.className = this.icon, r.style.display = "inline-block") : (r = new Image, r.src = this.icon), r.style.width = this.grid.iconWidth + "px", r.style.height = this.grid.iconHeight + "px", r.style.verticalAlign = "top", this.grid.isIE7 || (r.style.position = "relative"), r.style.marginRight = "4px", u.appendChild(r), c = document.createElement("span"), u.appendChild(c), c.appendChild(h), u.style.display = "block", u.style.height = this.grid.gridRowHeight + "px", u.style.lineHeight = this.grid.gridRowHeight - 2 + "px", r.style.top = Math.round((this.grid.gridRowHeight - this.grid.iconHeight) / 2) - 1 + "px", u.isContainerSpan = !0) : u.appendChild(h));
    this.rowElement = t;
    n || this.grid.Resize()
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onMouseDown = function (n) {
    var f, e, c, r, o, s, h, u, t, i;
    if (n || (n = window.event), f = n.which ? n.which == 1 : n.button == 1, e = n.which ? n.which == 3 : n.button == 2, e && (f = !1), c = n.metaKey || n.ctrlKey, n.isSimulatedMouseEvent && (t = GleamTech.JavaScript.Util.GetEventTarget(n), i = t.nodeName == "SPAN" && t.firstChild.nodeType == 3 && t.firstChild.nodeValue == String.fromCharCode(160), t.nodeName == "TD" || t.isContainerSpan || i)) return !1;
    if (this.grid.mouseDownRow = this, GleamTech.JavaScript.Util.AddEvent(document, "mouseup", this.mouseUpEvent), GleamTech.JavaScript.Util.AddEvent(document, "touchend", GleamTech.JavaScript.Util.SimulateMouse), n.isSimulatedMouseEvent) return !0;
    if (f)
        if (n.shiftKey) {
            for (r = this.grid.lastSelectedRow, this.grid.unselectAllRowsInternal(), o = r ? r.index : 0, s = this.index, h = o < s ? 1 : -1, u = o; u != s + h; u += h) this.grid.rowsArray[u].Select();
            this.grid.lastSelectedRow = r
        } else c ? this.selected ? this.Unselect() : this.Select() : (this.grid.unselectAllRowsInternal(), this.Select());
    else e && (t = GleamTech.JavaScript.Util.GetEventTarget(n), i = t.nodeName == "SPAN" && t.firstChild.nodeType == 3 && t.firstChild.nodeValue == String.fromCharCode(160), this.selected || t.nodeName == "TD" || t.isContainerSpan || i || (this.grid.unselectAllRowsInternal(), this.Select()));
    return !0
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onMouseUp = function (n) {
    if (n || (n = window.event), n.isSimulatedMouseEvent && (this.selected ? this.grid.rowContextMenuActive ? this.grid.rowContextMenuActive = !1 : this.grid.mouseOverActive ? this.grid.mouseOverActive = !1 : this.Unselect() : this.grid.mainContextMenuActive ? this.grid.mainContextMenuActive = !1 : this.Select()), this.grid.mouseDownRow = null, GleamTech.JavaScript.Util.RemoveEvent(document, "mouseup", this.mouseUpEvent), GleamTech.JavaScript.Util.RemoveEvent(document, "touchend", GleamTech.JavaScript.Util.SimulateMouse), this.grid.onSelectionComplete) this.grid.onSelectionComplete(n);
    return !0
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onMouseOver = function (n) {
    var t;
    if (n || (n = window.event), this.grid.mouseDownRow) {
        if (this.grid.mouseDownRow == this && !n.isSimulatedMouseEvent || !this.grid.lastSelectedRow) return;
        if (n.isSimulatedMouseEvent && (this.grid.mainContextMenuActive || this.grid.rowContextMenuActive)) return;
        this.grid.mouseOverActive = !0;
        var i = this.grid.lastSelectedRow.index,
            r = this.index,
            u = i <= r ? 1 : -1;
        for (i += u, r += u, t = i; t != r; t += u) this.grid.rowsArray[t].Select()
    } else {
        if (n.isSimulatedMouseEvent) return;
        if (this.selected) this.onStyleChange(this.grid.styleGridRowSelectedHover);
        else this.onStyleChange(this.grid.styleGridRowHover)
    }
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onMouseOut = function () {
    var n;
    if (this.grid.mouseDownRow) {
        if (this.grid.lastSelectedRow == this || !this.grid.lastSelectedRow) return;
        var t = this.grid.lastSelectedRow.index,
            i = this.index,
            r = t < i ? 1 : -1;
        for (n = t; n != i; n += r) this.grid.rowsArray[n].Unselect()
    } else if (this.selected) this.onStyleChange(this.grid.lastSelectedRow == this ? this.grid.styleGridRowFocused : this.grid.styleGridRowSelected);
    else this.onStyleChange(this.grid.styleGridRow)
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onContextMenu = function (n) {
    n || (n = window.event);
    var t = GleamTech.JavaScript.Util.GetEventTarget(n),
        i = t.nodeName == "SPAN" && t.firstChild.nodeType == 3 && t.firstChild.nodeValue == String.fromCharCode(160);
    if (!this.selected && (t.nodeName == "TD" || t.isContainerSpan || i)) {
        this.onMouseOut(n);
        return this.grid.mainContextMenuActive = !0, !1
    }
    if (this.grid.onRowContextMenu) {
        n.isSimulatedMouseEvent && !this.selected && (this.grid.unselectAllRowsInternal(), this.Select());
        this.grid.onRowContextMenu(this, n);
        return this.grid.rowContextMenuActive = !0, GleamTech.JavaScript.Util.CancelEvent(n)
    }
    return !0
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onDoubleClick = function (n) {
    if (n || (n = window.event), this.grid.onRowDoubleClick) this.grid.onRowDoubleClick(this, n)
};
GleamTech.JavaScript.UI.GridViewRow.prototype.Select = function () {
    if (!this.selected && (this.grid.multipleSelection || !(this.grid.selectedCount > 0))) {
        if (this.selected = !0, this.grid.selectedRowsArray.push(this), this.grid.lastFocusedRow = this, this.grid.selectedCount++, this.grid.lastSelectedRow) this.grid.lastSelectedRow.onStyleChange(this.selected ? this.grid.styleGridRowSelected : this.grid.styleGridRow);
        this.grid.lastSelectedRow = this;
        this.onStyleChange(this.grid.styleGridRowFocused)
    }
};
GleamTech.JavaScript.UI.GridViewRow.prototype.Unselect = function () {
    if (this.selected) {
        this.selected = !1;
        for (var n = 0; n < this.grid.selectedRowsArray.length; n++)
            if (this.grid.selectedRowsArray[n] == this) {
                this.grid.selectedRowsArray.splice(n, 1);
                break
            }
        this.grid.lastSelectedRow = this;
        this.grid.selectedCount--;
        this.grid.lastSelectedRow == this && (this.grid.lastSelectedRow = null);
        this.onStyleChange(this.grid.styleGridRow)
    }
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onStyleChange = function (n) {
    this.rowElement.className = n
};
var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.ContextMenuCount = 0;
GleamTech.JavaScript.UI.ContextMenuPopupImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAJCAMAAADNcxasAAAABlBMVEX19fUAAADRVAjdAAAAAXRSTlMAQObYZgAAABtJREFUCNdjYGQAAUZGCMkIIRkhJCOCjVADIgAC7QAadtCx+AAAAABJRU5ErkJggg==";
GleamTech.JavaScript.UI.ContextMenuPopupHoverImage = GleamTech.JavaScript.UI.ContextMenuPopupImage;
GleamTech.JavaScript.UI.ContextMenuSelectionImage = "";
GleamTech.JavaScript.UI.ContextMenuIconsPath = {};
GleamTech.JavaScript.UI.ContextMenuCssClass = "gt-contextMenu";
GleamTech.JavaScript.UI.ContextMenuSeparatorCssClass = "gt-contextMenuSeparator";
GleamTech.JavaScript.UI.ContextMenuVerticalSeparatorCssClass = "gt-contextMenuVerticalSeparator";
GleamTech.JavaScript.UI.ContextMenuItemCssClass = "gt-contextMenuItem";
GleamTech.JavaScript.UI.ContextMenuItemHoverCssClass = "gt-contextMenuItem gt-contextMenuItem-hover";
GleamTech.JavaScript.UI.ContextMenuItemDisabledCssClass = "gt-contextMenuItem gt-contextMenuItem-disabled";
GleamTech.JavaScript.UI.ContextMenuItemIconCssClass = "gt-contextMenuItemIcon";
GleamTech.JavaScript.UI.ContextMenuItemRoundBorders = !1;
GleamTech.JavaScript.UI.ContextMenu = function () {
    this.index = GleamTech.JavaScript.UI.ContextMenuCount++;
    this.items = [];
    this.menuItems = {};
    this.divElement = null;
    this.iconWidth = 16;
    this.iconHeight = 16;
    this.hidden = !0;
    this.itemClicked = !1;
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.lastSubmenu = null;
    this.showLeft = !1;
    this.defaultMenuItem = null;
    this.parentMenuItem = null;
    this.depth = 0;
    this.target = null;
    this.onMenuItemClick = null;
    this.imgPopup = new Image;
    this.imgPopup.src = GleamTech.JavaScript.UI.ContextMenuPopupImage;
    this.imgPopupHover = new Image;
    this.imgPopupHover.src = GleamTech.JavaScript.UI.ContextMenuPopupHoverImage;
    GleamTech.JavaScript.UI.ContextMenuSelectionImage && (this.imgSelection = new Image, this.imgSelection.src = GleamTech.JavaScript.UI.ContextMenuSelectionImage)
};
GleamTech.JavaScript.UI.ContextMenu.Parse = function (n, t, i, r) {
    var o = {},
        u = t.ContextMenus,
        s = function (t, i, r) {
            var f = new GleamTech.JavaScript.UI.ContextMenu,
                c, o, u, h, e, l;
            for (f.onMenuItemClick = i, t.Item.length || (c = t.Item, t.Item = [], t.Item[0] = c), o = 0; o < t.Item.length; o++) u = t.Item[o], h = u.action, h == "[Separator]" ? f.AddSeparator() : (e = f.AddMenuItem(h, u.text ? r.GetEntry(u.text) : h, u.description, u.icon), e.ParentPermissionList = u.parentPermissionList, e.PermissionList = u.permissionList, u.isDefault == "yes" && f.SetDefault(e), u.ContextMenu && (l = s(u.ContextMenu, i, r), e.SetSubmenu(l)));
            return f.Render(n ? n : document.body), f.container = n, f
        },
        h, f, e, c;
    for (u.ContextMenu.length || (h = u.ContextMenu, u.ContextMenu = [], u.ContextMenu[0] = h), f = 0; f < u.ContextMenu.length; f++) e = u.ContextMenu[f], c = s(e, i, r), o[e.Name] = c;
    return o
};
GleamTech.JavaScript.UI.ContextMenu.prototype.SetIconSize = function (n, t) {
    this.iconWidth = n;
    this.iconHeight = t
};
GleamTech.JavaScript.UI.ContextMenu.prototype.AddMenuItem = function (n, t, i, r) {
    var u = new GleamTech.JavaScript.UI.ContextMenuItem(n, t, i, r);
    return u.menu = this, u.index = this.items.length, this.items[u.index] = u, this.menuItems[n] = u, u
};
GleamTech.JavaScript.UI.ContextMenu.prototype.AddSeparator = function () {
    var n = new GleamTech.JavaScript.UI.ContextMenuSeparator;
    n.menu = this;
    n.index = this.items.length;
    this.items[n.index] = n
};
GleamTech.JavaScript.UI.ContextMenu.prototype.InsertMenuItem = function (n, t, i, r, u) {
    var f = new GleamTech.JavaScript.UI.ContextMenuItem(t, i, r, u),
        e;
    for (f.menu = this, f.index = n, this.items.splice(n, 0, f), this.menuItems[t] = f, e = 0; e < this.items.length; e++) this.items[e].index = e;
    return f.Render(this.divElement, this.items[n + 1].divElement), f
};
GleamTech.JavaScript.UI.ContextMenu.prototype.SetDefault = function (n) {
    this.defaultMenuItem && this.defaultMenuItem.spanElement && (this.defaultMenuItem.spanElement.style.fontWeight = "");
    this.defaultMenuItem = n;
    n.spanElement && (n.spanElement.style.fontWeight = "bold")
};
GleamTech.JavaScript.UI.ContextMenu.prototype.Render = function (n) {
    var i = this,
        t = document.createElement("div"),
        r;
    for (t.className = GleamTech.JavaScript.UI.ContextMenuCssClass, t.style.position = "absolute", t.style.display = "none", t.style.visibility = "hidden", t.style.cursor = "default", GleamTech.JavaScript.Util.AddEvent(t, "mousedown", function (n) {
        return i.onCancelEvent(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mouseup", function (n) {
        return i.onCancelEvent(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "contextmenu", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(t, "selectstart", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(t, "dragstart", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(t, "touchstart", function (n) {
        return i.onCancelEvent(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "touchend", function (n) {
        return i.onCancelEvent(n)
    }), this.divElement = t, n.appendChild(t), this.verticalSeparator = document.createElement("div"), this.divElement.appendChild(this.verticalSeparator), this.verticalSeparator.className = GleamTech.JavaScript.UI.ContextMenuVerticalSeparatorCssClass, this.verticalSeparator.style.position = "absolute", this.verticalSeparator.style.width = "1px", this.verticalSeparator.style.left = "29px", r = 0; r < this.items.length; r++) this.items[r].Render(t)
};
GleamTech.JavaScript.UI.ContextMenu.prototype.CalculateDimensions = function () {
    for (var n, r, t = 0, i = 0; i < this.items.length; i++) n = this.items[i], n.hidden || (n.isSeparator ? (n.divElement.clientHeight > 1 && (n.divElement.style.height = "1px"), t += 8) : (n.topDistance = t, n.calculatedHeight = n.divElement.offsetHeight, t += n.calculatedHeight, n.submenu && (n.imgPopup.style.top = (n.divElement.clientHeight == 0 ? (n.divElement.offsetHeight - 2 - n.imgPopup.offsetHeight) / 2 : (n.divElement.clientHeight - n.imgPopup.offsetHeight) / 2) + "px")));
    this.calculatedWidth = this.divElement.offsetWidth;
    this.calculatedHeight = this.divElement.offsetHeight;
    this.verticalSeparator.style.height = this.divElement.clientHeight - 4 + "px";
    r = GleamTech.JavaScript.Util.FindPosition(this.divElement.offsetParent);
    this.parentLeft = r[0];
    this.parentTop = r[1]
};
GleamTech.JavaScript.UI.ContextMenu.prototype.onCancelEvent = function (n) {
    return this.itemClicked ? (this.itemClicked = !1, !1) : GleamTech.JavaScript.Util.CancelEvent(n)
};
GleamTech.JavaScript.UI.ContextMenu.prototype.Popup = function (n, t) {
    var u, i, r, f, e;
    GleamTech.JavaScript.Util.DeSelectAllRanges();
    u = this;
    GleamTech.JavaScript.Util.EnsureDisplay(this.divElement, function () {
        u.CalculateDimensions()
    });
    i = n.pageX ? n.pageX : n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft();
    r = n.pageY ? n.pageY : n.clientY + GleamTech.JavaScript.Util.Viewport.GetScrollTop();
    i -= this.parentLeft;
    r -= this.parentTop;
    f = this.container.offsetWidth - i;
    e = this.container.offsetHeight - r;
    f < this.calculatedWidth && (i -= this.calculatedWidth);
    e < this.calculatedHeight && (r -= this.calculatedHeight);
    this.target = t;
    this.Show(i, r);
    GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu = function (n) {
        u.HidePopup(n)
    };
    GleamTech.JavaScript.Util.AddEvent(document, "mousedown", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.AddEvent(document, "touchstart", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu)
};
GleamTech.JavaScript.UI.ContextMenu.prototype.PopupXY = function (n, t, i) {
    GleamTech.JavaScript.Util.DeSelectAllRanges();
    var r = this;
    GleamTech.JavaScript.Util.EnsureDisplay(this.divElement, function () {
        r.CalculateDimensions()
    });
    i && (n -= this.calculatedWidth);
    this.Show(n, t);
    GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu = function (n) {
        r.HidePopup(n)
    };
    GleamTech.JavaScript.Util.AddEvent(document, "mousedown", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.AddEvent(document, "touchstart", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu)
};
GleamTech.JavaScript.UI.ContextMenu.prototype.PopupSubmenu = function () {
    var i = this;
    GleamTech.JavaScript.Util.EnsureDisplay(this.divElement, function () {
        i.CalculateDimensions()
    });
    var n = this.parentMenuItem.menu.right - 6,
        t = this.parentMenuItem.menu.top + this.parentMenuItem.topDistance,
        r = this.container.clientWidth - n,
        u = this.container.clientHeight - t;
    this.parentMenuItem.menu.showLeft || r < this.calculatedWidth ? (n = this.parentMenuItem.menu.left - this.calculatedWidth + 4, this.showLeft = !0) : this.showLeft = !1;
    u < this.calculatedHeight && (t = this.parentMenuItem.menu.bottom - this.calculatedHeight);
    this.depth = this.parentMenuItem.menu.depth + 1;
    this.divElement.style.zIndex = this.depth;
    this.target = this.parentMenuItem.menu.target;
    this.Show(n, t);
    this.parentMenuItem.menu.lastSubmenu = this
};
GleamTech.JavaScript.UI.ContextMenu.prototype.Show = function (n, t) {
    this.left = n;
    this.right = n + this.calculatedWidth;
    this.top = t;
    this.bottom = t + this.calculatedHeight;
    this.divElement.style.top = this.top + "px";
    this.divElement.style.left = this.left + "px";
    this.divElement.style.display = "block";
    this.divElement.style.visibility = "visible";
    this.hidden = !1
};
GleamTech.JavaScript.UI.ContextMenu.prototype.Hide = function () {
    this.lastSubmenu && !this.lastSubmenu.hidden && this.lastSubmenu.Hide();
    this.divElement.style.display = "none";
    this.divElement.style.visibility = "hidden";
    this.hidden = !0;
    this.parentMenuItem && !this.parentMenuItem.disabled && this.parentMenuItem.onUnSelect()
};
GleamTech.JavaScript.UI.ContextMenu.prototype.HidePopup = function () {
    this.Hide();
    GleamTech.JavaScript.Util.RemoveEvent(document, "mousedown", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.RemoveEvent(document, "mouseup", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.RemoveEvent(document, "touchstart", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.RemoveEvent(document, "touchend", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    this.target && this.target.onContextMenuClose && this.target.onContextMenuClose()
};
GleamTech.JavaScript.UI.ContextMenuItem = function (n, t, i, r) {
    if (this.action = n, this.text = t, this.description = i, r != null)
        if (r.indexOf("data:") == 0) this.icon = r;
        else {
            var u = r.split(":");
            this.icon = u.length > 1 ? GleamTech.JavaScript.UI.ContextMenuIconsPath[u[0]] + u[1] : GleamTech.JavaScript.UI.ContextMenuIconsPath["default"] + r
        } else this.icon = r;
    this.index = -1;
    this.disabled = !1;
    this.hidden = !1;
    this.topDistance = 0;
    this.menu = null;
    this.submenu = null;
    this.divElement = null;
    this.imgIcon = null;
    this.imgSpan = null;
    this.imgPopup = null;
    this.spanElement = null;
    this.isMenuItem = !0
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.SetSubmenu = function (n) {
    this.submenu = n;
    n.parentMenuItem = this
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Render = function (n, t) {
    var f = this,
        i = document.createElement("div"),
        o, u, e, s, r;
    t ? n.insertBefore(i, t) : n.appendChild(i);
    this.description != null && (i.title = this.description);
    i.className = GleamTech.JavaScript.UI.ContextMenuItemCssClass;
    i.style.whiteSpace = "nowrap";
    i.style.paddingLeft = "2px";
    i.style.paddingRight = "40px";
    i.style.position = "relative";
    GleamTech.JavaScript.UI.ContextMenuItemRoundBorders && GleamTech.JavaScript.Util.SetBorderRadius(i, 3, 3, 3, 3);
    this.menu.imgSelection && (i.style.backgroundImage = "url('" + this.menu.imgSelection.src + "')");
    GleamTech.JavaScript.Util.AddEvent(i, "mouseover", function (n) {
        return f.onMouseOver(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "mouseout", function (n) {
        return f.onMouseOut(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "mousedown", function (n) {
        return f.onMouseDown(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "mouseup", function (n) {
        return f.onMouseUp(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "touchstart", function (n) {
        return f.onTouchStart(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "touchend", function (n) {
        return f.onTouchEnd(n)
    });
    this.divElement = i;
    o = 9;
    this.icon != null ? (u = new Image, u.src = this.icon, u.style.width = this.menu.iconWidth + "px", u.style.height = this.menu.iconHeight + "px", u.style.verticalAlign = "middle", u.style.marginRight = "4px", this.imgIcon = u, this.imgSpan = document.createElement("span"), this.imgSpan.className = GleamTech.JavaScript.UI.ContextMenuItemIconCssClass, this.imgSpan.style.display = "inline-block", this.imgSpan.appendChild(this.imgIcon), i.appendChild(this.imgSpan)) : o += this.menu.iconWidth + 4;
    e = document.createElement("span");
    e.style.marginLeft = o + "px";
    this.menu.defaultMenuItem == this && (e.style.fontWeight = "bold");
    this.spanElement = e;
    s = document.createTextNode(this.text);
    e.appendChild(s);
    i.appendChild(e);
    this.submenu && (r = new Image, r.src = this.menu.imgPopup.src, r.style.position = "absolute", r.style.width = "5px", r.style.height = "9px", r.style.right = "6px", this.imgPopup = r, i.appendChild(r));
    this.disabled && this.Disable()
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.HideIcon = function () {
    this.imgIcon && (this.imgIcon.style.visibility = "hidden")
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.ShowIcon = function () {
    this.imgIcon && (this.imgIcon.style.visibility = "visible")
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onMouseOver = function () {
    this.disabled || (this.onSelect(), this.menu.lastSubmenu && this.menu.lastSubmenu != this.submenu && this.menu.lastSubmenu.Hide(), this.submenu && this.submenu.hidden && this.submenu.PopupSubmenu())
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onMouseOut = function (n) {
    var t, i, r;
    this.disabled || (this.submenu && !this.submenu.hidden ? (n || (n = window.event), t = n.pageX ? n.pageX : n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft(), i = n.pageY ? n.pageY : n.clientY + GleamTech.JavaScript.Util.Viewport.GetScrollTop(), t -= this.menu.parentLeft, i -= this.menu.parentTop, r = t > this.submenu.left - 10 && t < this.submenu.right + 10 && i > this.submenu.top - 10 && i < this.submenu.bottom + 10, !r && n.changedTouches && n.changedTouches.length == 0 && this.submenu.Hide()) : this.onUnSelect())
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onMouseDown = function () {
    GleamTech.JavaScript.Util.AddEvent(document, "mouseup", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.AddEvent(document, "touchend", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu)
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onMouseUp = function (n) {
    if (!this.disabled && !this.submenu) {
        n || (n = window.event);
        var t = n.which ? n.which == 1 : n.button == 1;
        if ((t || !n.changedTouches || n.changedTouches.length != 0) && (this.menu.itemClicked = !0, GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu(), this.menu.onMenuItemClick)) this.menu.onMenuItemClick(this, n)
    }
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onTouchStart = function (n) {
    this.onMouseOver(n);
    n.preventDefault()
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onTouchEnd = function (n) {
    this.onMouseOut(n);
    GleamTech.JavaScript.Util.SimulateMouse(n)
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onSelect = function () {
    this.divElement.className = GleamTech.JavaScript.UI.ContextMenuItemHoverCssClass;
    this.imgPopup && (this.imgPopup.src = this.menu.imgPopupHover.src)
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onUnSelect = function () {
    this.divElement.className = GleamTech.JavaScript.UI.ContextMenuItemCssClass;
    this.imgPopup && (this.imgPopup.src = this.menu.imgPopup.src)
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Enable = function () {
    this.divElement.disabled = !1;
    this.divElement.className = GleamTech.JavaScript.UI.ContextMenuItemCssClass;
    this.imgSpan && GleamTech.JavaScript.Util.SetOpacity(this.imgSpan, 10);
    this.imgPopup && GleamTech.JavaScript.Util.SetOpacity(this.imgPopup, 10);
    this.disabled = !1
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Disable = function () {
    this.divElement.disabled = !0;
    this.divElement.className = GleamTech.JavaScript.UI.ContextMenuItemDisabledCssClass;
    this.imgSpan && GleamTech.JavaScript.Util.SetOpacity(this.imgSpan, 4);
    this.imgPopup && GleamTech.JavaScript.Util.SetOpacity(this.imgPopup, 4);
    this.disabled = !0
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Show = function () {
    this.divElement.style.display = "block";
    this.hidden = !1
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Hide = function () {
    this.divElement.style.display = "none";
    this.hidden = !0
};
GleamTech.JavaScript.UI.ContextMenuSeparator = function () {
    this.menu = null;
    this.index = -1;
    this.divElement = null;
    this.hidden = !1;
    this.isSeparator = !0
};
GleamTech.JavaScript.UI.ContextMenuSeparator.prototype.Render = function (n) {
    var t = document.createElement("div"),
        i;
    t.className = GleamTech.JavaScript.UI.ContextMenuSeparatorCssClass;
    t.style.marginTop = "2px";
    t.style.marginLeft = "30px";
    t.style.marginBottom = "2px";
    t.style.marginRight = "0px";
    t.style.lineHeight = "1px";
    t.style.fontSize = "1px";
    this.divElement = t;
    i = document.createTextNode(String.fromCharCode(160));
    t.appendChild(i);
    n.appendChild(t)
};
GleamTech.JavaScript.UI.ContextMenuSeparator.prototype.Show = function () {
    this.divElement.style.display = "block";
    this.hidden = !1
};
GleamTech.JavaScript.UI.ContextMenuSeparator.prototype.Hide = function () {
    this.divElement.style.display = "none";
    this.hidden = !0
};
var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.ModalDialogDialogCssClass = "gt-modalDialog gt-nonSelectableText";
GleamTech.JavaScript.UI.ModalDialogTitleBarCssClass = "gt-modalDialogTitleBar";
GleamTech.JavaScript.UI.ModalDialogParentMaskCssClass = "gt-modalDialogParentMask";
GleamTech.JavaScript.UI.ModalDialogContentMaskCssClass = "gt-modalDialogContentMask";
GleamTech.JavaScript.UI.ModalDialogCloseImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABlElEQVR42mNgoBAwgojLJ04zdOeW/X96/yFRmqQV5RlKJ3cx6lqYQgyINrL/nxjnx+BkZUCUAfuOXWCYv2gTw9JzBxlZQAIvHj1mcDLXYWB4eJMoA0Bq21umgtkscNG/vxkYfv9kmH3xBcOu++/BQm6KgmAamZ+qLwFRCwUIA/4ABX/9ACtes3ImWCgkPB1MI/NTNQUgaqGACc76/YuB4ed3BjcZLhSNyJpBciA1YLUYBvz8wfD/6xeGFBkmBjdxVrghcM1AMZAcSA1ILYYXXly7yPDl2E4w+xOLMtBoCYa7d+/CFX56/pjh7mMIn+cPA6YLmFhYGJhY2Rk2sqkxnABq7mwrgysCsUFiIDmQGpBaTAPYOBiYObkZTjCIwjWXV3WBMdwQoBxIDUgthheYODgYWHh4GawZvsA1WXN8gRsE44PUgNRiGMDCwcXAysPPEMXznyGK4TNKwkHl84PVohggISfLcOz2awZbM0eiUuLRq4/Aehje3ENkpraMwv+vnjwjygAxGSmGiqk9jPrWFkSpxwsAVd+RBzp7tZ4AAAAASUVORK5CYII=";
GleamTech.JavaScript.UI.ModalDialogPromptImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAJ4UlEQVR4nLVXe3BU9RX+7mt3k93NE3mEkJCUEJUgtiWgrHUoDi2QjKZOrc86HZHawc7YgVHrFGwV2mmxYjsV1PLQkU7QquNIEasj5S2QRIGwgiFIQhISyZMku5t93Xv7nbtJBJ1S+kc3c+buZu893znf+c75nVVwha+Hly4t4SVAm0kroxXRxg1/fZ7WRAvS6mgH1q1f33glfrUrAJ773blzn0xLS/vz9OuuqwrcdNMN8+fPn1xRUZF5W1WVvmDhQn1OIJB53YwZkwsKCsrT09MXhUKhxXNuvLHk+uuv76+trW2+nH/1MsDFK1aseJFOty1ctOgny5Yv9wcCAZcNTfn0VCfe+uBzPP2XA1i5dh82vPEZDh7tQigCJTAn4JJ75Rl5VnyIr/8pAD5wy/gJE3bcFAg8+OCSJX6v16scP9mGPccN/L2uBJv2FKJ6/1jsb5qMgy2F+MeRXLzwQSbWbMvGExsH8PJbQRguryLPig/xJT6vKADeeOukSZNer6qqKp1aWqqdaDiLk12FeOvjArxT40FjaxTRWByGloCCGB3EYKhJfjZhmSbaum1U73Xj8Q0xvLS1FiVTp2riS3yK76/i6V/NnDduvvuee3J7enpwtlPB3s+KUH8mht7+QZJvEdREMmkhSbAEzTaTTMOimCyoig1dNaG4LERNC6/+S8OR0yew7K7xEJ9bq6s3E+NOCnTn1xiQOpGqdRWVlQ54d2wiM87AgeOD6OuPMEsCJuIYHErATSUUTzQwp8yHwIwMlOanId0NhMIpdiyLQdgJ+NJsBM+qeHx9K9rOdUJ8C8bFmhgNIDsn57HymTOnsN44P+DD9hoN9Y0DzDDBzE3EEgmMyzXw2H352PJUKV5ZOQXPPjKZVoyNK6/Blt9Mx/L7ipDtUxAZisK2kjCTDNaw0d4L/OqFBng8aRAMwbokAGk1v893T/msWdrR46ex71QuTp4Z5Jekl2aS5mgshnu/PwY/uNmPMRmX1tFgM48fY+C+RRPwp2XTMD5bQTQah2klWKpUEE0s55oNByAYgiWYoxpg1vfPmj3bd+LECbRFStHQHHbo1jWb4BaNtSatUob/9DIthdowMa0kCz+9vRArnj9OLTA/26Il4fUoeL8ugcpD9RAslvl+PrZblQmnadoPy8rKlFPN/Whod6OrL0yxUWhJyZ41ZT0tsqDYwkgC+2oa8ceNH+GXnAF/faMegyF2g6JAVTUGbuPmb01Ajt9ytCAMii/QXB4dL7/TAMESTMEWBgJsN3dXVxc6wnlo/SLsZGtR0VJHcsCrKDyJvXXn8P6eT7Dz4wjilovfAbFoFwM28cTiMgKCYCr8PgNZPgsXIqnOEHCFd7t1haK00dzSgdKrr3bX1tQEJICZRUVFRn3wFE51XosLg0NOlgJq25KF5QSi0sl7B/vYego86Rlw26ZD76Ct4WRTP7p7+lkyHYZhIBY3cb5rEP0DKnQGoCAVhMqKDMVsbN95DPNmFxkMYKYEUJaXl6d8EjyH890JKpd0qrZDn83am8NB8AOdm9CZhU1xxQkSicbQNxBFXqYHnR3tMDx+jBubjaMn29HeFYGqp8FW7WGViJ5sR7AHjnyBe6tmK4KtsA5nn161quAP63fgUNt0BhAXSaWEZ1ujTEgtZdJFYwm2WRzhoRivScz7ZjoeqsykkNOQnZ2L/PyxeOR3/8SOj/rgS3eNgguaMKGoCrzaAPZUL8aTK1e2SBuOy8jIQE9/qt2SDCCRSL0XsywRYAzhSBQ9fSF094Youogjytu/48XihT7nvjifMcjni9WH8WFNNzL8aQ5bujZsfK9qGtlVyYoLginYo4PIIvUJDg4HcNhgxRFn/wuoWIhByP/jHEoVN/jwwIIsaOKcdXe7DTy3pQ4vvPk5Muk8nS3ocenwuMX4veHmBHXBpesc11+eANqs8vIlcp7vZ3+2XshNKZ/GtBAheO9AmKJKOBqAnRJkpk/HsrsLHIo13WB2Bta9FsSeYzFkZVGgBsWnqWREc4QppjnvNQasw6UO4Y4FU7Fr1652CaBKlonm5jOob/Oz11M1H4rHnDNAZoGA284MkPPAxDWT0/Gj+QUOeFaGF+/sOo33akK4KjeLIlO+BFUNJ1uN80FMca46Mj0hdkEeDh86dFRKEGxvb7cL8rLh1YeQJMXRWBR9F8JObWWKCe1OAHZqoPjTVZ5+JvsaTp83t0fh92cSXIWLVBuGi9mTbrkaKYZ0zeAkNZzhO6M0Ex0dHdIeQSlGXVNTU6K8vNyVu/sg+iM5uOBknnDUm5pmHCQWFazbSOdIPcth9eyWY8yG7nQVrZ0mfB6vQ7miaM5UTG17iriAnbpQfPQUi6Bi3jQ0nTkuAHUSwIFTDQ2xyspK1zUTBlH3ucfpBAGVOWDJGGXmZJamUkgKBsJJ7PvU4snnJjMqQTPgTTMIrA8Dqylwx758SRBjvAOYVjoJH773ZkywnTsee/TRzbLDxWJx5Rdrg+jo99FZapbbw2NUZ/96PFJPFd/I9+LOW8Yinyegpbg5muOoDYZJ90gAmpNuagQNs8C/SCSJn99homii297x7ruvrHnmmQeUkeNYFkjZ4Z76/UvYsFPoVIcHkM1gwHpKW5EBtwvL7yrEtEIXh1GC/zPg8efgt5s6OMZdDkt8wmGG0fEgG56CrMM4XyM2PVOJTRs3Dra0tNzKzWj3KEeyvcoCWVRcrC1d8Tfsbcx2Dg/JXpTtdsANtp4bqx66GuMyVUTjSWpAQ052Fn69rhkdvT62GU8NU+XxrMEe4V28JFrx0qprObLPmvv279+4evXqn+HiIg2vZDtkgezmSvbE2l040uLj4FBoKsVnONlLe91280T8uCJ/tNcPHuvE81v72ZY5DrDFzIUBJ3tmrpideHKpD8UF2Xj77bcbvujoWMTsz1wSwHAQspS+LgvkmaZmrFj7Po6dy0IaM5cA0jxuUk6a2VLTp/hQMtGDngtJ1NTHkFSuIpjB1pXsCZ4U+jV4tCY8viQHM2cUgktpT2tr6yVL6aUyxehavlkWSBfBVj/3Gj5qMHhAZzmTT4IwdA+z5CRIqpztHpbHy47hMpLU2UE6r2QhEcWUvAY8tXwWdZHAu9u3C/gDBN92Md7XAhhhQrZXWSBlh9u99yC2bvsYLb1+WPoY6AR0qdJ2Ht7tYs0F2MUzgl2Q6EOuvxX33paHiu99Gzzzzdq6utOk/eGLM79sACOakO1VFkjZ4WSNam1rxwe76nCisQu9gwqXCzluZcoBORkqSiZnYMEt01FSnIdgMGjXHD4cGgyFqvt6e9eM1PyKA7gokLmytMoOJ6ubbE+ywOTm5o4cqRgYGID8lpCRLlNVBhv3iTfD4fCr0mqX8/9fA7gokP/Lz/N/A7fn0Fs02DPwAAAAAElFTkSuQmCC";
GleamTech.JavaScript.UI.ModalDialog = function (n) {
    this.parentNode = n || document.body;
    this.parentDocument = this.parentNode.ownerDocument;
    this.dialogCount = 0;
    this.OkButtonText = "OK";
    this.CancelButtonText = "Cancel";
    this.PromptTitleText = "Prompt";
    this.imgClose = new Image;
    this.imgClose.src = GleamTech.JavaScript.UI.ModalDialogCloseImage;
    this.imgPrompt = new Image;
    this.imgPrompt.src = GleamTech.JavaScript.UI.ModalDialogPromptImage
};
GleamTech.JavaScript.UI.ModalDialog.prototype.calculateParentDimensions = function () {
    var i = this.parentNode.appendChild(this.parentDocument.createElement("div")),
        n, t;
    this.parentNode == this.parentDocument.body ? (this.parentLeft = GleamTech.JavaScript.Util.Viewport.GetScrollLeft(), this.parentTop = GleamTech.JavaScript.Util.Viewport.GetScrollTop(), this.parentWidth = GleamTech.JavaScript.Util.Viewport.GetWidth(), this.parentHeight = GleamTech.JavaScript.Util.Viewport.GetHeight()) : this.parentNode == i.offsetParent ? (this.parentLeft = 0, this.parentTop = 0, this.parentWidth = this.parentNode.clientWidth, this.parentHeight = this.parentNode.clientHeight) : (n = GleamTech.JavaScript.Util.FindPosition(this.parentNode), this.parentLeft = n[0], this.parentTop = n[1], this.parentNode.offsetParent && (t = GleamTech.JavaScript.Util.FindPosition(this.parentNode.offsetParent), this.parentLeft -= t[0], this.parentTop -= t[1]), this.parentWidth = this.parentNode.clientWidth, this.parentHeight = this.parentNode.clientHeight);
    this.parentRight = this.parentLeft + this.parentWidth;
    this.parentBottom = this.parentTop + this.parentHeight;
    this.parentNode.removeChild(i)
};
GleamTech.JavaScript.UI.ModalDialog.prototype.createParentMask = function () {
    if (!this.elementParentMask) {
        this.oldParentOverflow = this.parentNode.style.overflow;
        this.parentNode.style.overflow = "hidden";
        this.calculateParentDimensions();
        this.elementParentMask = this.parentDocument.createElement("div");
        this.elementParentMask.className = GleamTech.JavaScript.UI.ModalDialogParentMaskCssClass;
        this.elementParentMask.style.position = "absolute";
        this.elementParentMask.style.top = this.parentTop + "px";
        this.elementParentMask.style.left = this.parentLeft + "px";
        this.elementParentMask.style.width = this.parentWidth + "px";
        this.elementParentMask.style.height = this.parentHeight + "px";
        this.elementParentMask.style.zIndex = "1000";
        this.parentNode.appendChild(this.elementParentMask);
        GleamTech.JavaScript.Util.AddEvent(this.elementParentMask, "contextmenu", GleamTech.JavaScript.Util.CancelEvent);
        GleamTech.JavaScript.Util.SetOpacity(this.elementParentMask, 4);
        var n = this;
        this.elementParentMask.windowResizeEvent = function () {
            "ontouchstart" in window || setTimeout(function () {
                n.resizeParentMask()
            }, 200)
        };
        GleamTech.JavaScript.Util.AddEvent(window, "resize", this.elementParentMask.windowResizeEvent)
    }
};
GleamTech.JavaScript.UI.ModalDialog.prototype.removeParentMask = function () {
    this.elementParentMask && (this.dialogCount > 0 || (this.parentNode.removeChild(this.elementParentMask), GleamTech.JavaScript.Util.RemoveEvent(window, "resize", this.elementParentMask.windowResizeEvent), this.parentNode.style.overflow = this.oldParentOverflow, this.elementParentMask = null))
};
GleamTech.JavaScript.UI.ModalDialog.prototype.resizeParentMask = function () {
    this.calculateParentDimensions();
    this.elementParentMask.style.top = this.parentTop + "px";
    this.elementParentMask.style.left = this.parentLeft + "px";
    this.elementParentMask.style.width = this.parentWidth + "px";
    this.elementParentMask.style.height = this.parentHeight + "px"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.createDialog = function (n, t, i) {
    var c = this,
        r = this.parentDocument.createElement("div"),
        u, o, l, s, e, h, f;
    return r.className = GleamTech.JavaScript.UI.ModalDialogDialogCssClass, r.style.position = "absolute", r.style.zIndex = "1001", r.style.padding = "0px", r.style.width = n + "px", this.parentNode.appendChild(r), r.close = function () {
        c.Close(r)
    }, u = this.parentDocument.createElement("div"), u.className = GleamTech.JavaScript.UI.ModalDialogTitleBarCssClass, u.style.padding = "3px", r.appendChild(u), GleamTech.JavaScript.Util.AddEvent(u, "mousedown", function (n) {
        c.onMoveStart(n, r)
    }), GleamTech.JavaScript.Util.AddEvent(u, "contextmenu", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(u, "selectstart", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(u, "dragstart", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(u, "touchstart", GleamTech.JavaScript.Util.SimulateMouse), GleamTech.JavaScript.Util.AddEvent(u, "touchmove", GleamTech.JavaScript.Util.SimulateMouse), GleamTech.JavaScript.Util.AddEvent(u, "touchend", GleamTech.JavaScript.Util.SimulateMouse), o = this.parentDocument.createElement("div"), o.style.cssFloat = "left", o.style.styleFloat = "left", u.appendChild(o), l = this.parentDocument.createTextNode(i != null ? i : String.fromCharCode(160)), o.appendChild(l), s = this.parentDocument.createElement("div"), s.style.cssFloat = "right", s.style.styleFloat = "right", u.appendChild(s), e = this.parentDocument.createElement("img"), e.src = this.imgClose.src, e.style.width = "16px", e.style.height = "16px", s.appendChild(e), GleamTech.JavaScript.Util.AddEvent(e, "mousedown", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(e, "click", r.close), GleamTech.JavaScript.Util.AddEvent(e, "touchstart", GleamTech.JavaScript.Util.SimulateClick), u.style.height = o.offsetHeight + "px", s.style.height = o.offsetHeight + "px", e.style.marginTop = (s.offsetHeight - e.offsetHeight) / 2 + "px", h = this.parentDocument.createElement("div"), h.style.width = n + "px", h.style.height = t + "px", r.appendChild(h), f = this.parentDocument.createElement("div"), f.className = GleamTech.JavaScript.UI.ModalDialogContentMaskCssClass, f.style.display = "none", f.style.position = "absolute", f.style.left = "0px", f.style.top = u.offsetHeight + "px", f.style.width = n + "px", f.style.height = t + "px", r.appendChild(f), GleamTech.JavaScript.Util.SetOpacity(f, 4), r.style.top = this.parentTop + (this.parentHeight - r.offsetHeight) / 2 + "px", r.style.left = this.parentLeft + (this.parentWidth - r.offsetWidth) / 2 + "px", this.dialogCount++, r.elementTitleBar = u, r.elementContent = h, r.elementContentMask = f, r
};
GleamTech.JavaScript.UI.ModalDialog.prototype.removeDialog = function (n) {
    this.parentNode.removeChild(n);
    this.dialogCount--
};
GleamTech.JavaScript.UI.ModalDialog.prototype.SetSize = function (n, t, i) {
    n.elementContent.style.width = t + "px";
    n.elementContent.style.height = i + "px";
    n.frameContent && (n.frameContent.style.width = t + "px", n.frameContent.style.height = i + "px");
    n.elementContentMask.style.left = "0px";
    n.elementContentMask.style.top = n.elementTitleBar.offsetHeight + "px";
    n.elementContentMask.style.width = t + "px";
    n.elementContentMask.style.height = i + "px"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.center = function (n) {
    n.style.top = this.parentTop + (this.parentHeight - n.offsetHeight) / 2 + "px";
    n.style.left = this.parentLeft + (this.parentWidth - n.offsetWidth) / 2 + "px"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.onMoveStart = function (n, t) {
    var r, u, f, i;
    (n || (n = window.event), r = n.which ? n.which == 1 : n.button == 1, r) && (u = n.pageX ? n.pageX : n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft(), f = n.pageY ? n.pageY : n.clientY + GleamTech.JavaScript.Util.Viewport.GetScrollTop(), t.relativeMouseX = u - t.offsetLeft, t.relativeMouseY = f - t.offsetTop, t.mouseMaxLeft = this.parentLeft, t.mouseMaxTop = this.parentTop, t.mouseMaxRight = this.parentRight - t.offsetWidth, t.mouseMaxBottom = this.parentBottom - t.offsetHeight, i = this, this.documentMouseUpEvent = function (n) {
        i.onMoveStop(n, t)
    }, this.documentMouseMoveEvent = function (n) {
        i.onMove(n, t)
    }, GleamTech.JavaScript.Util.AddEvent(t.ownerDocument, "mouseup", this.documentMouseUpEvent), GleamTech.JavaScript.Util.AddEvent(t.ownerDocument, "mousemove", this.documentMouseMoveEvent), t.elementContentMask.style.display = "block")
};
GleamTech.JavaScript.UI.ModalDialog.prototype.onMove = function (n, t) {
    var u;
    if (n || (n = window.event), u = n.which ? n.which == 1 : n.button == 1, !u) this.onMoveStop(n, t);
    var f = n.pageX ? n.pageX : n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft(),
        e = n.pageY ? n.pageY : n.clientY + GleamTech.JavaScript.Util.Viewport.GetScrollTop(),
        i = f - t.relativeMouseX,
        r = e - t.relativeMouseY;
    i < t.mouseMaxLeft && (i = t.mouseMaxLeft);
    i > t.mouseMaxRight && (i = t.mouseMaxRight);
    r < t.mouseMaxTop && (r = t.mouseMaxTop);
    r > t.mouseMaxBottom && (r = t.mouseMaxBottom);
    t.style.left = i + "px";
    t.style.top = r + "px"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.onMoveStop = function (n, t) {
    GleamTech.JavaScript.Util.RemoveEvent(t.ownerDocument, "mouseup", this.documentMouseUpEvent);
    GleamTech.JavaScript.Util.RemoveEvent(t.ownerDocument, "mousemove", this.documentMouseMoveEvent);
    t.elementContentMask.style.display = "none"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.ShowElement = function (n, t, i, r, u) {
    var o, e, f;
    return this.createParentMask(), o = n.style.visibility, n.style.visibility = "hidden", i && i(), e = this, GleamTech.JavaScript.Util.EnsureDisplay(n, function (n) {
        f = e.createDialog(n.offsetWidth, n.offsetHeight, t)
    }), f.elementContent.appendChild(n), f.onClose = r, f.onClosed = u, n.style.visibility = o, f.windowResizeEvent = function () {
        setTimeout(function () {
            e.center(f)
        }, 200)
    }, GleamTech.JavaScript.Util.AddEvent(window, "resize", f.windowResizeEvent), f
};
GleamTech.JavaScript.UI.ModalDialog.prototype.ShowUrl = function (n, t, i, r) {
    var f, u, e;
    return this.createParentMask(), f = this.createDialog(t, i, r), u = this.parentDocument.createElement("iframe"), u.style.backgroundColor = "transparent", u.allowTransparency = "true", u.scrolling = "no", u.frameBorder = "0", u.style.width = t + "px", u.style.height = i + "px", f.elementContent.appendChild(u), u.src = n, u.focus(), f.frameContent = u, e = this, f.windowResizeEvent = function () {
        setTimeout(function () {
            e.center(f)
        }, 200)
    }, GleamTech.JavaScript.Util.AddEvent(window, "resize", f.windowResizeEvent), f
};
GleamTech.JavaScript.UI.ModalDialog.prototype.Prompt = function (n, t, i, r, u, f, e) {
    var k, tt, w, it, d, s, g, c, l, rt, a;
    this.createParentMask();
    var o = this.createDialog(375, 135, this.PromptTitleText),
        y = this,
        h = this.parentDocument.createElement("table");
    h.border = 0;
    h.cellPadding = 8;
    h.cellSpacing = 0;
    h.style.width = "100%";
    h.style.height = "100%";
    h.style.fontSize = "1em";
    GleamTech.JavaScript.Util.AddEvent(h, "contextmenu", GleamTech.JavaScript.Util.CancelEventExceptForTextInput);
    GleamTech.JavaScript.Util.AddEvent(h, "selectstart", GleamTech.JavaScript.Util.CancelEventExceptForTextInput);
    GleamTech.JavaScript.Util.AddEvent(h, "dragstart", GleamTech.JavaScript.Util.CancelEventExceptForTextInput);
    var p = this.parentDocument.createElement("tbody"),
        b = this.parentDocument.createElement("tr"),
        nt = this.parentDocument.createElement("td"),
        v = this.parentDocument.createElement("img");
    return v.style.border = "none", v.style.width = "32px", v.style.height = "32px", v.src = this.imgPrompt.src, nt.appendChild(v), b.appendChild(nt), k = this.parentDocument.createElement("td"), tt = this.parentDocument.createTextNode(n), k.appendChild(tt), b.appendChild(k), w = this.parentDocument.createElement("tr"), it = this.parentDocument.createElement("td"), w.appendChild(it), d = this.parentDocument.createElement("td"), s = this.parentDocument.createElement("input"), s.type = "text", s.style.width = "300px", s.value = t, s.disabled = u, d.appendChild(s), w.appendChild(d), g = this.parentDocument.createElement("tr"), c = this.parentDocument.createElement("td"), c.colSpan = 2, c.align = "center", l = this.parentDocument.createElement("input"), l.type = "button", l.value = this.OkButtonText, l.style.width = "82px", GleamTech.JavaScript.Util.AddEvent(l, "click", function () {
        var n = s.value;
        r(n) ? (y.Close(o), i(n)) : (s.value == "" && (s.value = t), s.select())
    }), c.appendChild(l), rt = this.parentDocument.createTextNode(String.fromCharCode(160) + String.fromCharCode(160)), c.appendChild(rt), a = this.parentDocument.createElement("input"), a.type = "button", a.value = this.CancelButtonText, a.style.width = "82px", GleamTech.JavaScript.Util.AddEvent(a, "click", function () {
        y.Close(o);
        i(null)
    }), c.appendChild(a), g.appendChild(c), p.appendChild(b), p.appendChild(w), p.appendChild(g), h.appendChild(p), o.elementContent.appendChild(h), typeof f == "undefined" && (f = 0), typeof e == "undefined" && (e = s.value.length), GleamTech.JavaScript.Util.SelectInputText(s, f, e), o.windowResizeEvent = function () {
        setTimeout(function () {
            y.center(o)
        }, 200)
    }, GleamTech.JavaScript.Util.AddEvent(window, "resize", o.windowResizeEvent), o.okButton = l, o.cancelButton = a, o.keyDownEvent = function (n) {
        y.onKeyDown(n, o)
    }, GleamTech.JavaScript.Util.AddEvent(o, "keydown", o.keyDownEvent), o
};
GleamTech.JavaScript.UI.ModalDialog.prototype.PromptAction = function (n, t, i, r, u, f) {
    var a, b, k, s, c, l, h;
    this.createParentMask();
    var e = this.createDialog(420, 250, this.PromptTitleText),
        v = this,
        o = this.parentDocument.createElement("table");
    o.border = 0;
    o.cellPadding = 8;
    o.cellSpacing = 0;
    o.style.width = "100%";
    o.style.height = "100%";
    o.style.fontSize = "1em";
    GleamTech.JavaScript.Util.AddEvent(o, "contextmenu", GleamTech.JavaScript.Util.CancelEventExceptForTextInput);
    GleamTech.JavaScript.Util.AddEvent(o, "selectstart", GleamTech.JavaScript.Util.CancelEventExceptForTextInput);
    GleamTech.JavaScript.Util.AddEvent(o, "dragstart", GleamTech.JavaScript.Util.CancelEventExceptForTextInput);
    var y = this.parentDocument.createElement("tbody"),
        p = this.parentDocument.createElement("tr"),
        w = this.parentDocument.createElement("td");
    return w.style.verticalAlign = "top", a = this.parentDocument.createElement("img"), a.style.border = "none", a.style.width = "32px", a.style.height = "32px", a.src = this.imgPrompt.src, w.appendChild(a), p.appendChild(w), b = this.parentDocument.createElement("td"), b.innerHTML = n.replace(/\n/g, "<br/>"), p.appendChild(b), k = this.parentDocument.createElement("tr"), s = this.parentDocument.createElement("td"), s.colSpan = 2, s.align = "center", c = this.parentDocument.createElement("input"), c.type = "button", c.value = t, c.style.width = "82px", c.style.height = "26px", GleamTech.JavaScript.Util.AddEvent(c, "click", function () {
        e.onClosed = null;
        v.Close(e);
        r()
    }), s.appendChild(c), s.appendChild(this.parentDocument.createTextNode(String.fromCharCode(160) + String.fromCharCode(160))), l = this.parentDocument.createElement("input"), l.type = "button", l.value = i, l.style.width = "82px", l.style.height = "26px", GleamTech.JavaScript.Util.AddEvent(l, "click", function () {
        e.onClosed = null;
        v.Close(e);
        u()
    }), s.appendChild(l), s.appendChild(this.parentDocument.createTextNode(String.fromCharCode(160) + String.fromCharCode(160))), h = this.parentDocument.createElement("input"), h.type = "button", h.value = this.CancelButtonText, h.style.width = "82px", h.style.height = "26px", GleamTech.JavaScript.Util.AddEvent(h, "click", function () {
        e.onClosed = null;
        v.Close(e);
        f()
    }), s.appendChild(h), k.appendChild(s), y.appendChild(p), y.appendChild(k), o.appendChild(y), e.elementContent.appendChild(o), e.onClosed = f, e.windowResizeEvent = function () {
        setTimeout(function () {
            v.center(e)
        }, 200)
    }, GleamTech.JavaScript.Util.AddEvent(window, "resize", e.windowResizeEvent), e.cancelButton = h, e.keyDownEvent = function (n) {
        v.onKeyDown(n, e)
    }, GleamTech.JavaScript.Util.AddEvent(e, "keydown", e.keyDownEvent), e
};
GleamTech.JavaScript.UI.ModalDialog.prototype.onKeyDown = function (n, t) {
    n || (n = window.event);
    switch (n.keyCode) {
    case 13:
        return t.okButton && t.okButton.click(), !1;
    case 27:
        return t.cancelButton.click(), !1
    }
    return !0
};
GleamTech.JavaScript.UI.ModalDialog.prototype.Close = function (n) {
    if (n.onClose) {
        var t = n.onClose();
        if (!t) return
    }
    this.removeDialog(n);
    this.removeParentMask();
    GleamTech.JavaScript.Util.RemoveEvent(window, "resize", n.windowResizeEvent);
    n.onClosed && n.onClosed()
};
var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.ProgressBarHeight = 13;
GleamTech.JavaScript.UI.ProgressBarImageSprite = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAaCAIAAAD5ZqGGAAAAV0lEQVR42jWJOwrAIBAF13GTKq13yP2vkiPYpLOQsOKHRIQ8GAbmSc5Zeu9MY2aUUhhjkFJCRPjnvUdVCSEQQ1xfaZ27Jp5m1HeIXOfqzjkUx6awTw7dPlRcI2+hZb6IAAAAAElFTkSuQmCC";
GleamTech.JavaScript.UI.ProgressBarCssClass = "gt-progressBar";
GleamTech.JavaScript.UI.ProgressBar = function (n, t, i, r) {
    var u = new Image;
    u.src = r || GleamTech.JavaScript.UI.ProgressBarImageSprite;
    this.ElementControl = document.createElement("div");
    n.appendChild(this.ElementControl);
    this.ElementControl.style.width = t + "px";
    this.ElementControl.style.height = GleamTech.JavaScript.UI.ProgressBarHeight + "px";
    GleamTech.JavaScript.Util.SetBorderRadius(this.ElementControl, 2, 2, 2, 2);
    this.ElementControl.className = GleamTech.JavaScript.UI.ProgressBarCssClass;
    this.ElementControl.style.backgroundImage = "url(" + u.src + ")";
    this.ElementIndicator = document.createElement("div");
    this.ElementControl.appendChild(this.ElementIndicator);
    this.ElementIndicator.style.width = "0px";
    this.ElementIndicator.style.height = GleamTech.JavaScript.UI.ProgressBarHeight + "px";
    this.ElementIndicator.style.backgroundImage = "url(" + u.src + ")";
    this.ElementIndicator.style.backgroundPosition = "0px 13px";
    this.CurrentPercentage = 0;
    this.PreventBackingUp = i
};
GleamTech.JavaScript.UI.ProgressBar.prototype.SetPercentage = function (n) {
    n != undefined && n != null && ((n < 0 && (n = 0), n > 100 && (n = 100), this.PreventBackingUp && n <= this.CurrentPercentage) || (this.CurrentPercentage = n, this.ElementIndicator.style.width = this.ElementControl.clientWidth * n / 100 + "px"))
}; /*!@@version@@*/
(function () {
    function l() {
        this.returnValue = !1
    }

    function a() {
        this.cancelBubble = !0
    }
    var h = 0,
        u = [],
        e = {},
        o = {},
        s = {
            "<": "lt",
            ">": "gt",
            "&": "amp",
            '"': "quot",
            "'": "#39"
        },
        c = /[<>&\"\']/g,
        i, f = window.setTimeout,
        r = {},
        t, n;
    (function (n) {
        for (var r = n.split(/,/), i, u, t = 0; t < r.length; t += 2)
            for (u = r[t + 1].split(/ /), i = 0; i < u.length; i++) o[u[i]] = r[t]
    })("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,audio/mp4,m4a,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe m2v,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/3gpp,3gp,video/3gpp2,3g2,video/vnd.rn-realvideo,rv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe");
    n = {
        VERSION: "@@version@@",
        STOPPED: 1,
        STARTED: 2,
        QUEUED: 1,
        UPLOADING: 2,
        FAILED: 4,
        DONE: 5,
        GENERIC_ERROR: -100,
        HTTP_ERROR: -200,
        IO_ERROR: -300,
        SECURITY_ERROR: -400,
        INIT_ERROR: -500,
        FILE_SIZE_ERROR: -600,
        FILE_EXTENSION_ERROR: -601,
        IMAGE_FORMAT_ERROR: -700,
        IMAGE_MEMORY_ERROR: -701,
        IMAGE_DIMENSIONS_ERROR: -702,
        mimeTypes: o,
        ua: function () {
            var i = navigator,
                t = i.userAgent,
                f = i.vendor,
                n, r, u;
            return n = /WebKit/.test(t), u = n && f.indexOf("Apple") !== -1, r = window.opera && window.opera.buildNumber, {
                windows: navigator.platform.indexOf("Win") !== -1,
                android: /Android/.test(t),
                ie: !n && !r && /MSIE/gi.test(t) && /Explorer/gi.test(i.appName),
                webkit: n,
                gecko: !n && /Gecko/.test(t),
                safari: u,
                opera: !!r
            }
        }(),
        typeOf: function (n) {
            return {}.toString.call(n).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
        }, extend: function (t) {
            return n.each(arguments, function (i, r) {
                r > 0 && n.each(i, function (n, i) {
                    t[i] = n
                })
            }), t
        }, cleanName: function (n) {
            for (var i = [/[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u"], t = 0; t < i.length; t += 2) n = n.replace(i[t], i[t + 1]);
            return n = n.replace(/\s+/g, "_"), n.replace(/[^a-z0-9_\-\.]+/gi, "")
        }, addRuntime: function (n, t) {
            return t.name = n, u[n] = t, u.push(t), t
        }, guid: function () {
            for (var i = (new Date).getTime().toString(32), t = 0; t < 5; t++) i += Math.floor(Math.random() * 65535).toString(32);
            return (n.guidPrefix || "p") + i + (h++).toString(32)
        }, buildUrl: function (t, i) {
            var r = "";
            return n.each(i, function (n, t) {
                r += (r ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(n)
            }), r && (t += (t.indexOf("?") > 0 ? "&" : "?") + r), t
        }, each: function (n, t) {
            var f, u, r;
            if (n)
                if (f = n.length, f === i) {
                    for (u in n)
                        if (n.hasOwnProperty(u) && t(n[u], u) === !1) return
                } else
                    for (r = 0; r < f; r++)
                        if (t(n[r], r) === !1) return
        }, formatSize: function (t) {
            return t === i || /\D/.test(t) ? n.translate("N/A") : t > 1073741824 ? Math.round(t / 1073741824, 1) + " GB" : t > 1048576 ? Math.round(t / 1048576, 1) + " MB" : t > 1024 ? Math.round(t / 1024, 1) + " KB" : t + " b"
        }, getPos: function (t, i) {
            function h(n) {
                var t, i, r = 0,
                    f = 0;
                return n && (i = n.getBoundingClientRect(), t = u.compatMode === "CSS1Compat" ? u.documentElement : u.body, r = i.left + t.scrollLeft, f = i.top + t.scrollTop), {
                    x: r,
                    y: f
                }
            }
            var f = 0,
                e = 0,
                r, u = document,
                o, s;
            if (t = t, i = i || u.body, t && t.getBoundingClientRect && n.ua.ie && (!u.documentMode || u.documentMode < 8)) return o = h(t), s = h(i), {
                x: o.x - s.x,
                y: o.y - s.y
            };
            for (r = t; r && r != i && r.nodeType;) f += r.offsetLeft || 0, e += r.offsetTop || 0, r = r.offsetParent;
            for (r = t.parentNode; r && r != i && r.nodeType;) f -= r.scrollLeft || 0, e -= r.scrollTop || 0, r = r.parentNode;
            return {
                x: f,
                y: e
            }
        }, getSize: function (n) {
            return {
                w: n.offsetWidth || n.clientWidth,
                h: n.offsetHeight || n.clientHeight
            }
        }, parseSize: function (n) {
            var t;
            return typeof n == "string" && (n = /^([0-9]+)([mgk]?)$/.exec(n.toLowerCase().replace(/[^0-9mkg]/g, "")), t = n[2], n = +n[1], t == "g" && (n *= 1073741824), t == "m" && (n *= 1048576), t == "k" && (n *= 1024)), n
        }, xmlEncode: function (n) {
            return n ? ("" + n).replace(c, function (n) {
                return s[n] ? "&" + s[n] + ";" : n
            }) : n
        }, toArray: function (n) {
            for (var i = [], t = 0; t < n.length; t++) i[t] = n[t];
            return i
        }, inArray: function (n, t) {
            if (t) {
                if (Array.prototype.indexOf) return Array.prototype.indexOf.call(t, n);
                for (var i = 0, r = t.length; i < r; i++)
                    if (t[i] === n) return i
            }
            return -1
        }, addI18n: function (t) {
            return n.extend(e, t)
        }, translate: function (n) {
            return e[n] || n
        }, isEmptyObj: function (n) {
            if (n === i) return !0;
            for (var t in n) return !1;
            return !0
        }, hasClass: function (n, t) {
            var i;
            return n.className == "" ? !1 : (i = new RegExp("(^|\\s+)" + t + "(\\s+|$)"), i.test(n.className))
        }, addClass: function (t, i) {
            n.hasClass(t, i) || (t.className = t.className == "" ? i : t.className.replace(/\s+$/, "") + " " + i)
        }, removeClass: function (n, t) {
            var i = new RegExp("(^|\\s+)" + t + "(\\s+|$)");
            n.className = n.className.replace(i, function (n, t, i) {
                return t === " " && i === " " ? " " : ""
            })
        }, getStyle: function (n, t) {
            return n.currentStyle ? n.currentStyle[t] : window.getComputedStyle ? window.getComputedStyle(n, null)[t] : void 0
        }, addEvent: function (u, f, e) {
            var o, s, h;
            h = arguments[3];
            f = f.toLowerCase();
            t === i && (t = "Plupload_" + n.guid());
            u.addEventListener ? (o = e, u.addEventListener(f, o, !1)) : u.attachEvent && (o = function () {
                var n = window.event;
                n.target || (n.target = n.srcElement);
                n.preventDefault = l;
                n.stopPropagation = a;
                e(n)
            }, u.attachEvent("on" + f, o));
            u[t] === i && (u[t] = n.guid());
            r.hasOwnProperty(u[t]) || (r[u[t]] = {});
            s = r[u[t]];
            s.hasOwnProperty(f) || (s[f] = []);
            s[f].push({
                func: o,
                orig: e,
                key: h
            })
        }, removeEvent: function (u, f) {
            var e, s, h, o;
            if (typeof arguments[2] == "function" ? s = arguments[2] : h = arguments[2], f = f.toLowerCase(), u[t] && r[u[t]] && r[u[t]][f]) e = r[u[t]][f];
            else return;
            for (o = e.length - 1; o >= 0; o--)
                if ((e[o].key === h || e[o].orig === s) && (u.removeEventListener ? u.removeEventListener(f, e[o].func, !1) : u.detachEvent && u.detachEvent("on" + f, e[o].func), e[o].orig = null, e[o].func = null, e.splice(o, 1), s !== i)) break;
            if (e.length || delete r[u[t]][f], n.isEmptyObj(r[u[t]])) {
                delete r[u[t]];
                try {
                    delete u[t]
                } catch (c) {
                    u[t] = i
                }
            }
        }, removeAllEvents: function (u) {
            var f = arguments[1];
            u[t] !== i && u[t] && n.each(r[u[t]], function (t, i) {
                n.removeEvent(u, i, f)
            })
        }
    };
    n.Uploader = function (t) {
        function h() {
            var t, u = 0,
                i;
            if (this.state == n.STARTED) {
                for (i = 0; i < r.length; i++) t || r[i].status != n.QUEUED ? u++ : (t = r[i], t.status = n.UPLOADING, this.trigger("BeforeUpload", t) && this.trigger("UploadFile", t));
                u == r.length && (this.stop(), this.trigger("UploadComplete", r))
            }
        }

        function s() {
            var u, t;
            for (e.reset(), u = 0; u < r.length; u++) t = r[u], t.size !== i ? (e.size += t.size, e.loaded += t.loaded) : e.size = i, t.status == n.DONE ? e.uploaded++ : t.status == n.FAILED ? e.failed++ : e.queued++;
            e.size === i ? e.percent = r.length > 0 ? Math.ceil(e.uploaded / r.length * 100) : 0 : (e.bytesPerSec = Math.ceil(e.loaded / ((+new Date - c || 1) / 1e3)), e.percent = e.size > 0 ? Math.ceil(e.loaded / e.size * 100) : 0)
        }
        var o = {},
            e, r = [],
            c, l = !1;
        e = new n.QueueProgress;
        t = n.extend({
            chunk_size: 0,
            multipart: !0,
            multi_selection: !0,
            file_data_name: "file",
            filters: []
        }, t);
        n.extend(this, {
            state: n.STOPPED,
            runtime: "",
            features: {},
            files: r,
            settings: t,
            total: e,
            id: n.guid(),
            init: function () {
                function v() {
                    var i = l[y++],
                        u, t, r;
                    if (i) {
                        if (u = i.getFeatures(), t = e.settings.required_features, t)
                            for (t = t.split(","), r = 0; r < t.length; r++)
                                if (!u[t[r]]) {
                                    v();
                                    return
                                }
                        i.init(e, function (n) {
                            n && n.success ? (e.features = u, e.runtime = i.name, e.trigger("Init", {
                                runtime: i.name
                            }), e.trigger("PostInit"), e.refresh()) : v()
                        })
                    } else e.trigger("Error", {
                        code: n.INIT_ERROR,
                        message: n.translate("Init error.")
                    })
                }
                var e = this,
                    o, l, y = 0,
                    a;
                if (typeof t.preinit == "function" ? t.preinit(e) : n.each(t.preinit, function (n, t) {
                    e.bind(t, n)
                }), t.page_url = t.page_url || document.location.pathname.replace(/\/[^\/]+$/g, "/"), /^(\w+:\/\/|\/)/.test(t.url) || (t.url = t.page_url + t.url), t.chunk_size = n.parseSize(t.chunk_size), t.max_file_size = n.parseSize(t.max_file_size), e.bind("FilesAdded", function (u, o) {
                    var c, s, a = 0,
                        h, l = t.filters;
                    for (l && l.length && (h = [], n.each(l, function (t) {
                        n.each(t.extensions.split(/,/), function (n) {
                            /^\s*\*\s*$/.test(n) ? h.push("\\.*") : h.push("\\." + n.replace(new RegExp("[" + "/^$.*+?|()[]{}\\".replace(/./g, "\\$&") + "]", "g"), "\\$&"))
                        })
                    }), h = new RegExp(h.join("|") + "$", "i")), c = 0; c < o.length; c++) {
                        if (s = o[c], s.loaded = 0, s.percent = 0, s.status = n.QUEUED, h && !h.test(s.name)) {
                            u.trigger("Error", {
                                code: n.FILE_EXTENSION_ERROR,
                                message: n.translate("File extension error."),
                                file: s
                            });
                            continue
                        }
                        if (s.size !== i && s.size > t.max_file_size) {
                            u.trigger("Error", {
                                code: n.FILE_SIZE_ERROR,
                                message: n.translate("File size error."),
                                file: s
                            });
                            continue
                        }
                        r.push(s);
                        a++
                    }
                    if (a) f(function () {
                        e.trigger("QueueChanged");
                        e.refresh()
                    }, 1);
                    else return !1
                }), t.unique_names && e.bind("UploadFile", function (n, t) {
                    var i = t.name.match(/\.([^.]+)$/),
                        r = "tmp";
                    i && (r = i[1]);
                    t.target_name = t.id + "." + r
                }), e.bind("UploadProgress", function (n, t) {
                    t.percent = t.size > 0 ? Math.ceil(t.loaded / t.size * 100) : 100;
                    s()
                }), e.bind("StateChanged", function (t) {
                    if (t.state == n.STARTED) c = +new Date;
                    else if (t.state == n.STOPPED)
                        for (o = t.files.length - 1; o >= 0; o--) t.files[o].status == n.UPLOADING && (t.files[o].status = n.QUEUED, s())
                }), e.bind("QueueChanged", s), e.bind("Error", function (t, i) {
                    i.file && (i.file.status = n.FAILED, s(), t.state == n.STARTED && f(function () {
                        h.call(e)
                    }, 1))
                }), e.bind("FileUploaded", function (t, i) {
                    i.status = n.DONE;
                    i.loaded = i.size;
                    t.trigger("UploadProgress", i);
                    f(function () {
                        h.call(e)
                    }, 1)
                }), t.runtimes)
                    for (l = [], a = t.runtimes.split(/\s?,\s?/), o = 0; o < a.length; o++) u[a[o]] && l.push(u[a[o]]);
                else l = u;
                v();
                typeof t.init == "function" ? t.init(e) : n.each(t.init, function (n, t) {
                    e.bind(t, n)
                })
            }, refresh: function () {
                this.trigger("Refresh")
            }, start: function () {
                r.length && this.state != n.STARTED && (this.state = n.STARTED, this.trigger("StateChanged"), h.call(this))
            }, stop: function () {
                this.state != n.STOPPED && (this.state = n.STOPPED, this.trigger("CancelUpload"), this.trigger("StateChanged"))
            }, disableBrowse: function () {
                l = arguments[0] !== i ? arguments[0] : !0;
                this.trigger("DisableBrowse", l)
            }, getFile: function (n) {
                for (var t = r.length - 1; t >= 0; t--)
                    if (r[t].id === n) return r[t]
            }, removeFile: function (n) {
                for (var t = r.length - 1; t >= 0; t--)
                    if (r[t].id === n.id) return this.splice(t, 1)[0]
            }, splice: function (n, t) {
                var u;
                return u = r.splice(n === i ? 0 : n, t === i ? r.length : t), this.trigger("FilesRemoved", u), this.trigger("QueueChanged"), u
            }, trigger: function (n) {
                var i = o[n.toLowerCase()],
                    t, r;
                if (i)
                    for (r = Array.prototype.slice.call(arguments), r[0] = this, t = 0; t < i.length; t++)
                        if (i[t].func.apply(i[t].scope, r) === !1) return !1;
                return !0
            }, hasEventListener: function (n) {
                return !!o[n.toLowerCase()]
            }, bind: function (n, t, i) {
                var r;
                n = n.toLowerCase();
                r = o[n] || [];
                r.push({
                    func: t,
                    scope: i || this
                });
                o[n] = r
            }, unbind: function (n) {
                n = n.toLowerCase();
                var t = o[n],
                    r, u = arguments[1];
                if (t) {
                    if (u !== i) {
                        for (r = t.length - 1; r >= 0; r--)
                            if (t[r].func === u) {
                                t.splice(r, 1);
                                break
                            }
                    } else t = [];
                    t.length || delete o[n]
                }
            }, unbindAll: function () {
                var t = this;
                n.each(o, function (n, i) {
                    t.unbind(i)
                })
            }, destroy: function () {
                this.stop();
                this.trigger("Destroy");
                this.unbindAll()
            }
        })
    };
    n.File = function (n, t, i) {
        var r = this;
        r.id = n;
        r.name = t;
        r.size = i;
        r.loaded = 0;
        r.percent = 0;
        r.status = 0
    };
    n.Runtime = function () {
        this.getFeatures = function () {};
        this.init = function () {}
    };
    n.QueueProgress = function () {
        var n = this;
        n.size = 0;
        n.loaded = 0;
        n.uploaded = 0;
        n.failed = 0;
        n.queued = 0;
        n.percent = 0;
        n.bytesPerSec = 0;
        n.reset = function () {
            n.size = n.loaded = n.uploaded = n.failed = n.queued = n.percent = n.bytesPerSec = 0
        }
    };
    n.runtimes = {};
    window.plupload = n
})();
(function (n, t, r, u) {
    function c(n) {
        var u = n.naturalWidth,
            f = n.naturalHeight,
            i, r;
        return u * f > 1048576 ? (i = t.createElement("canvas"), i.width = i.height = 1, r = i.getContext("2d"), r.drawImage(n, -u + 1, 0), r.getImageData(0, 0, 1, 1).data[3] === 0) : !1
    }

    function l(n, i, r) {
        var f = t.createElement("canvas"),
            e, c, s;
        f.width = 1;
        f.height = r;
        e = f.getContext("2d");
        e.drawImage(n, 0, 0);
        for (var l = e.getImageData(0, 0, 1, r).data, o = 0, h = r, u = r; u > o;) c = l[(u - 1) * 4 + 3], c === 0 ? h = u : o = u, u = h + o >> 1;
        return s = u / r, s === 0 ? 1 : s
    }

    function a(n, i, r) {
        var f = n.naturalWidth,
            e = n.naturalHeight,
            w = r.width,
            b = r.height,
            a = i.getContext("2d"),
            k, u, s, y, o, p;
        a.save();
        k = c(n);
        k && (f /= 2, e /= 2);
        u = 1024;
        s = t.createElement("canvas");
        s.width = s.height = u;
        for (var v = s.getContext("2d"), d = l(n, f, e), h = 0; h < e;) {
            for (y = h + u > e ? e - h : u, o = 0; o < f;) {
                p = o + u > f ? f - o : u;
                v.clearRect(0, 0, u, u);
                v.drawImage(n, -o, -h);
                var g = o * w / f << 0,
                    nt = Math.ceil(p * w / f),
                    tt = h * b / e / d << 0,
                    it = Math.ceil(y * b / e / d);
                a.drawImage(s, 0, 0, p, y, g, tt, nt, it);
                o += u
            }
            h += u
        }
        a.restore();
        s = v = null
    }

    function v(t, i) {
        var r;
        if ("FileReader" in n) r = new FileReader, r.readAsDataURL(t), r.onload = function () {
            i(r.result)
        };
        else return i(t.getAsDataURL())
    }

    function o(t, i) {
        var r;
        if ("FileReader" in n) r = new FileReader, r.readAsBinaryString(t), r.onload = function () {
            i(r.result)
        };
        else return i(t.getAsBinary())
    }

    function y(n, i, r, u) {
        var o, e, s, c = this;
        v(f[n.id], function (f) {
            o = t.createElement("canvas");
            o.style.display = "none";
            t.body.appendChild(o);
            e = new Image;
            e.onerror = e.onabort = function () {
                u({
                    success: !1
                })
            };
            e.onload = function () {
                var v, y, t, l;
                if (i.width || (i.width = e.width), i.height || (i.height = e.height), s = Math.min(i.width / e.width, i.height / e.height), s < 1) v = Math.round(e.width * s), y = Math.round(e.height * s);
                else if (i.quality && r === "image/jpeg") v = e.width, y = e.height;
                else {
                    u({
                        success: !1
                    });
                    return
                } if (o.width = v, o.height = y, a(e, o, {
                    width: v,
                    height: y
                }), r === "image/jpeg" && (t = new h(atob(f.substring(f.indexOf("base64,") + 7))), t.headers && t.headers.length && (l = new p, l.init(t.get("exif")[0]) && (l.setExif("PixelXDimension", v), l.setExif("PixelYDimension", y), t.set("exif", l.getBinary()), c.hasEventListener("ExifData") && c.trigger("ExifData", n, l.EXIF()), c.hasEventListener("GpsData") && c.trigger("GpsData", n, l.GPS())))), i.quality && r === "image/jpeg") try {
                    f = o.toDataURL(r, i.quality / 100)
                } catch (w) {
                    f = o.toDataURL(r)
                } else f = o.toDataURL(r);
                f = f.substring(f.indexOf("base64,") + 7);
                f = atob(f);
                t && t.headers && t.headers.length && (f = t.restore(f), t.purge());
                o.parentNode.removeChild(o);
                u({
                    success: !0,
                    data: f
                })
            };
            e.src = f
        })
    }

    function s() {
        function i(i, r) {
            for (var e = t ? 0 : -8 * (r - 1), f = 0, u = 0; u < r; u++) f |= n.charCodeAt(i + u) << Math.abs(e + u * 8);
            return f
        }

        function r(t, i, r) {
            var r = arguments.length === 3 ? r : n.length - i - 1;
            n = n.substr(0, i) + t + n.substr(r + i)
        }

        function f(n, i, u) {
            for (var e = "", o = t ? 0 : -8 * (u - 1), f = 0; f < u; f++) e += String.fromCharCode(i >> Math.abs(o + f * 8) & 255);
            r(e, n, u)
        }
        var t = !1,
            n;
        return {
            II: function (n) {
                if (n === u) return t;
                t = n
            }, init: function (i) {
                t = !1;
                n = i
            }, SEGMENT: function (t, i, u) {
                switch (arguments.length) {
                case 1:
                    return n.substr(t, n.length - t - 1);
                case 2:
                    return n.substr(t, i);
                case 3:
                    r(u, t, i);
                    break;
                default:
                    return n
                }
            }, BYTE: function (n) {
                return i(n, 1)
            }, SHORT: function (n) {
                return i(n, 2)
            }, LONG: function (n, t) {
                if (t === u) return i(n, 4);
                f(n, t, 4)
            }, SLONG: function (n) {
                var t = i(n, 4);
                return t > 2147483647 ? t - 4294967296 : t
            }, STRING: function (n, t) {
                var r = "";
                for (t += n; n < t; n++) r += String.fromCharCode(i(n, 1));
                return r
            }
        }
    }

    function h(n) {
        var e = {
                65505: {
                    app: "EXIF",
                    name: "APP1",
                    signature: "Exif\0"
                },
                65506: {
                    app: "ICC",
                    name: "APP2",
                    signature: "ICC_PROFILE\0"
                },
                65517: {
                    app: "IPTC",
                    name: "APP13",
                    signature: "Photoshop 3.0\0"
                }
            },
            i = [],
            t, r, f = u,
            o = 0,
            c;
        if (t = new s, t.init(n), t.SHORT(0) === 65496) {
            for (r = 2, c = Math.min(1048576, n.length); r <= c;) {
                if (f = t.SHORT(r), f >= 65488 && f <= 65495) {
                    r += 2;
                    continue
                }
                if (f === 65498 || f === 65497) break;
                o = t.SHORT(r + 2) + 2;
                e[f] && t.STRING(r + 4, e[f].signature.length) === e[f].signature && i.push({
                    hex: f,
                    app: e[f].app.toUpperCase(),
                    name: e[f].name.toUpperCase(),
                    start: r,
                    length: o,
                    segment: t.SEGMENT(r, o)
                });
                r += o
            }
            return t.init(null), {
                headers: i,
                restore: function (n) {
                    var f, e, u, o;
                    if (t.init(n), f = new h(n), !f.headers) return !1;
                    for (u = f.headers.length; u > 0; u--) e = f.headers[u - 1], t.SEGMENT(e.start, e.length, "");
                    for (f.purge(), r = t.SHORT(2) == 65504 ? 4 + t.SHORT(4) : 2, u = 0, o = i.length; u < o; u++) t.SEGMENT(r, 0, i[u].segment), r += i[u].length;
                    return t.SEGMENT()
                }, get: function (n) {
                    for (var r = [], t = 0, u = i.length; t < u; t++) i[t].app === n.toUpperCase() && r.push(i[t].segment);
                    return r
                }, set: function (n, t) {
                    var u = [],
                        r, f;
                    for (typeof t == "string" ? u.push(t) : u = t, r = ii = 0, f = i.length; r < f; r++)
                        if (i[r].app === n.toUpperCase() && (i[r].segment = u[ii], i[r].length = u[ii].length, ii++), ii >= u.length) break
                }, purge: function () {
                    i = [];
                    t.init(null)
                }
            }
        }
    }

    function p() {
        function o(i, r) {
            for (var p = n.SHORT(i), f, c, y, s, w, o, a, h = [], v = {}, l = 0; l < p; l++)
                if (o = w = i + 12 * l + 2, c = r[n.SHORT(o)], c !== u) {
                    y = n.SHORT(o += 2);
                    s = n.LONG(o += 2);
                    o += 4;
                    h = [];
                    switch (y) {
                    case 1:
                    case 7:
                        for (s > 4 && (o = n.LONG(o) + t.tiffHeader), f = 0; f < s; f++) h[f] = n.BYTE(o + f);
                        break;
                    case 2:
                        s > 4 && (o = n.LONG(o) + t.tiffHeader);
                        v[c] = n.STRING(o, s - 1);
                        continue;
                    case 3:
                        for (s > 2 && (o = n.LONG(o) + t.tiffHeader), f = 0; f < s; f++) h[f] = n.SHORT(o + f * 2);
                        break;
                    case 4:
                        for (s > 1 && (o = n.LONG(o) + t.tiffHeader), f = 0; f < s; f++) h[f] = n.LONG(o + f * 4);
                        break;
                    case 5:
                        for (o = n.LONG(o) + t.tiffHeader, f = 0; f < s; f++) h[f] = n.LONG(o + f * 4) / n.LONG(o + f * 4 + 4);
                        break;
                    case 9:
                        for (o = n.LONG(o) + t.tiffHeader, f = 0; f < s; f++) h[f] = n.SLONG(o + f * 4);
                        break;
                    case 10:
                        for (o = n.LONG(o) + t.tiffHeader, f = 0; f < s; f++) h[f] = n.SLONG(o + f * 4) / n.SLONG(o + f * 4 + 4);
                        break;
                    default:
                        continue
                    }
                    a = s == 1 ? h[0] : h;
                    v[c] = e.hasOwnProperty(c) && typeof a != "object" ? e[c][a] : a
                }
            return v
        }

        function h() {
            var i = u,
                r = t.tiffHeader;
            return (n.II(n.SHORT(r) == 18761), n.SHORT(r += 2) !== 42) ? !1 : (t.IFD0 = t.tiffHeader + n.LONG(r += 2), i = o(t.IFD0, f.tiff), t.exifIFD = "ExifIFDPointer" in i ? t.tiffHeader + i.ExifIFDPointer : u, t.gpsIFD = "GPSInfoIFDPointer" in i ? t.tiffHeader + i.GPSInfoIFDPointer : u, !0)
        }

        function c(r, u, e) {
            var o, l, s, h = 0,
                c;
            if (typeof u == "string") {
                c = f[r.toLowerCase()];
                for (hex in c)
                    if (c[hex] === u) {
                        u = hex;
                        break
                    }
            }
            for (o = t[r.toLowerCase() + "IFD"], l = n.SHORT(o), i = 0; i < l; i++)
                if (s = o + 12 * i + 2, n.SHORT(s) == u) {
                    h = s + 8;
                    break
                }
            return h ? (n.LONG(h, e), !0) : !1
        }
        var n, f, t = {},
            e;
        return n = new s, f = {
            tiff: {
                274: "Orientation",
                34665: "ExifIFDPointer",
                34853: "GPSInfoIFDPointer"
            },
            exif: {
                36864: "ExifVersion",
                40961: "ColorSpace",
                40962: "PixelXDimension",
                40963: "PixelYDimension",
                36867: "DateTimeOriginal",
                33434: "ExposureTime",
                33437: "FNumber",
                34855: "ISOSpeedRatings",
                37377: "ShutterSpeedValue",
                37378: "ApertureValue",
                37383: "MeteringMode",
                37384: "LightSource",
                37385: "Flash",
                41986: "ExposureMode",
                41987: "WhiteBalance",
                41990: "SceneCaptureType",
                41988: "DigitalZoomRatio",
                41992: "Contrast",
                41993: "Saturation",
                41994: "Sharpness"
            },
            gps: {
                0: "GPSVersionID",
                1: "GPSLatitudeRef",
                2: "GPSLatitude",
                3: "GPSLongitudeRef",
                4: "GPSLongitude"
            }
        }, e = {
            ColorSpace: {
                1: "sRGB",
                0: "Uncalibrated"
            },
            MeteringMode: {
                0: "Unknown",
                1: "Average",
                2: "CenterWeightedAverage",
                3: "Spot",
                4: "MultiSpot",
                5: "Pattern",
                6: "Partial",
                255: "Other"
            },
            LightSource: {
                1: "Daylight",
                2: "Fliorescent",
                3: "Tungsten",
                4: "Flash",
                9: "Fine weather",
                10: "Cloudy weather",
                11: "Shade",
                12: "Daylight fluorescent (D 5700 - 7100K)",
                13: "Day white fluorescent (N 4600 -5400K)",
                14: "Cool white fluorescent (W 3900 - 4500K)",
                15: "White fluorescent (WW 3200 - 3700K)",
                17: "Standard light A",
                18: "Standard light B",
                19: "Standard light C",
                20: "D55",
                21: "D65",
                22: "D75",
                23: "D50",
                24: "ISO studio tungsten",
                255: "Other"
            },
            Flash: {
                0: "Flash did not fire.",
                1: "Flash fired.",
                5: "Strobe return light not detected.",
                7: "Strobe return light detected.",
                9: "Flash fired, compulsory flash mode",
                13: "Flash fired, compulsory flash mode, return light not detected",
                15: "Flash fired, compulsory flash mode, return light detected",
                16: "Flash did not fire, compulsory flash mode",
                24: "Flash did not fire, auto mode",
                25: "Flash fired, auto mode",
                29: "Flash fired, auto mode, return light not detected",
                31: "Flash fired, auto mode, return light detected",
                32: "No flash function",
                65: "Flash fired, red-eye reduction mode",
                69: "Flash fired, red-eye reduction mode, return light not detected",
                71: "Flash fired, red-eye reduction mode, return light detected",
                73: "Flash fired, compulsory flash mode, red-eye reduction mode",
                77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                89: "Flash fired, auto mode, red-eye reduction mode",
                93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
            },
            ExposureMode: {
                0: "Auto exposure",
                1: "Manual exposure",
                2: "Auto bracket"
            },
            WhiteBalance: {
                0: "Auto white balance",
                1: "Manual white balance"
            },
            SceneCaptureType: {
                0: "Standard",
                1: "Landscape",
                2: "Portrait",
                3: "Night scene"
            },
            Contrast: {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            Saturation: {
                0: "Normal",
                1: "Low saturation",
                2: "High saturation"
            },
            Sharpness: {
                0: "Normal",
                1: "Soft",
                2: "Hard"
            },
            GPSLatitudeRef: {
                N: "North latitude",
                S: "South latitude"
            },
            GPSLongitudeRef: {
                E: "East longitude",
                W: "West longitude"
            }
        }, {
            init: function (i) {
                return (t = {
                    tiffHeader: 10
                }, i === u || !i.length) ? !1 : (n.init(i), n.SHORT(0) === 65505 && n.STRING(4, 5).toUpperCase() === "EXIF\0") ? h() : !1
            }, EXIF: function () {
                var n, i, u;
                if (n = o(t.exifIFD, f.exif), n.ExifVersion && r.typeOf(n.ExifVersion) === "array") {
                    for (i = 0, u = ""; i < n.ExifVersion.length; i++) u += String.fromCharCode(n.ExifVersion[i]);
                    n.ExifVersion = u
                }
                return n
            }, GPS: function () {
                var n;
                return n = o(t.gpsIFD, f.gps), n.GPSVersionID && (n.GPSVersionID = n.GPSVersionID.join(".")), n
            }, setExif: function (n, t) {
                return n !== "PixelXDimension" && n !== "PixelYDimension" ? !1 : c("exif", n, t)
            }, getBinary: function () {
                return n.SEGMENT()
            }
        }
    }
    var f = {},
        e;
    r.runtimes.Html5 = r.addRuntime("html5", {
        getFeatures: function () {
            var i, f, o, s, u, h;
            return f = o = u = h = !1, n.XMLHttpRequest && (i = new XMLHttpRequest, o = !!i.upload, f = !!(i.sendAsBinary || i.upload)), f && (s = !!(i.sendAsBinary || n.Uint8Array && n.ArrayBuffer), u = !!(File && (File.prototype.getAsDataURL || n.FileReader) && s), h = !!(File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice))), e = r.ua.safari && r.ua.windows, {
                html5: f,
                dragdrop: function () {
                    var n = t.createElement("div");
                    return "draggable" in n || "ondragstart" in n && "ondrop" in n
                }(),
                jpgresize: u,
                pngresize: u,
                multipart: u || !!n.FileReader || !!n.FormData,
                canSendBinary: s,
                cantSendBlobInFormData: !!(r.ua.gecko && n.FormData && n.FileReader && !FileReader.prototype.readAsArrayBuffer) || r.ua.android,
                progress: o,
                chunks: h,
                multi_selection: !(r.ua.safari && r.ua.windows),
                triggerDialog: r.ua.gecko && n.FormData || r.ua.webkit
            }
        }, init: function (i, u) {
            function c(n) {
                for (var t, e = [], o, s = {}, u = 0; u < n.length; u++)(t = n[u], s[t.name] && r.ua.safari && r.ua.windows) || (s[t.name] = !0, o = r.guid(), f[o] = t, e.push(new r.File(o, t.fileName || t.name, t.fileSize || t.size)));
                e.length && i.trigger("FilesAdded", e)
            }
            var h, s;
            if (h = this.getFeatures(), !h.html5) {
                u({
                    success: !1
                });
                return
            }
            i.bind("Init", function (n) {
                var u, f, o = [],
                    s, e, b = n.settings.filters,
                    h, l, a = t.body,
                    v;
                u = t.createElement("div");
                u.id = n.id + "_html5_container";
                r.extend(u.style, {
                    position: "absolute",
                    background: i.settings.shim_bgcolor || "transparent",
                    width: "100px",
                    height: "100px",
                    overflow: "hidden",
                    zIndex: 99999,
                    opacity: i.settings.shim_bgcolor ? "" : 0
                });
                u.className = "plupload html5";
                i.settings.container && (a = t.getElementById(i.settings.container), r.getStyle(a, "position") === "static" && (a.style.position = "relative"));
                a.appendChild(u);
                n: for (s = 0; s < b.length; s++)
                    for (h = b[s].extensions.split(/,/), e = 0; e < h.length; e++) {
                        if (h[e] === "*") {
                            o = [];
                            break n
                        }
                        l = r.mimeTypes[h[e]];
                        l && r.inArray(l, o) === -1 && o.push(l)
                    }
                if (u.innerHTML = '<input id="' + i.id + '_html5"  style="font-size:999px" type="file" accept="' + o.join(",") + '" ' + (i.settings.multi_selection && i.features.multi_selection ? 'multiple="multiple"' : "") + " />", u.scrollTop = 100, v = t.getElementById(i.id + "_html5"), n.features.triggerDialog ? r.extend(v.style, {
                    position: "absolute",
                    width: "100%",
                    height: "100%"
                }) : r.extend(v.style, {
                    cssFloat: "right",
                    styleFloat: "right"
                }), v.onchange = function () {
                    c(this.files);
                    this.value = ""
                }, f = t.getElementById(n.settings.browse_button), f) {
                    var y = n.settings.browse_button_hover,
                        p = n.settings.browse_button_active,
                        w = n.features.triggerDialog ? f : u;
                    y && (r.addEvent(w, "mouseover", function () {
                        r.addClass(f, y)
                    }, n.id), r.addEvent(w, "mouseout", function () {
                        r.removeClass(f, y)
                    }, n.id));
                    p && (r.addEvent(w, "mousedown", function () {
                        r.addClass(f, p)
                    }, n.id), r.addEvent(t.body, "mouseup", function () {
                        r.removeClass(f, p)
                    }, n.id));
                    n.features.triggerDialog && r.addEvent(f, "click", function (i) {
                        var r = t.getElementById(n.id + "_html5");
                        r && !r.disabled && r.click();
                        i.preventDefault()
                    }, n.id)
                }
            });
            i.bind("PostInit", function () {
                var n = t.getElementById(i.settings.drop_element);
                if (n) {
                    if (e) {
                        r.addEvent(n, "dragenter", function () {
                            var u, e, f;
                            u = t.getElementById(i.id + "_drop");
                            u || (u = t.createElement("input"), u.setAttribute("type", "file"), u.setAttribute("id", i.id + "_drop"), u.setAttribute("multiple", "multiple"), r.addEvent(u, "change", function () {
                                c(this.files);
                                r.removeEvent(u, "change", i.id);
                                u.parentNode.removeChild(u)
                            }, i.id), r.addEvent(u, "dragover", function (n) {
                                n.stopPropagation()
                            }, i.id), n.appendChild(u));
                            e = r.getPos(n, t.getElementById(i.settings.container));
                            f = r.getSize(n);
                            r.getStyle(n, "position") === "static" && r.extend(n.style, {
                                position: "relative"
                            });
                            r.extend(u.style, {
                                position: "absolute",
                                display: "block",
                                top: 0,
                                left: 0,
                                width: f.w + "px",
                                height: f.h + "px",
                                opacity: 0
                            })
                        }, i.id);
                        return
                    }
                    r.addEvent(n, "dragover", function (n) {
                        n.preventDefault()
                    }, i.id);
                    r.addEvent(n, "drop", function (n) {
                        var t = n.dataTransfer;
                        t && t.files && c(t.files);
                        n.preventDefault()
                    }, i.id)
                }
            });
            i.bind("Refresh", function (n) {
                var u, e, o, s, f;
                u = t.getElementById(i.settings.browse_button);
                u && (e = r.getPos(u, t.getElementById(n.settings.container)), o = r.getSize(u), s = t.getElementById(i.id + "_html5_container"), r.extend(s.style, {
                    top: e.y + "px",
                    left: e.x + "px",
                    width: o.w + "px",
                    height: o.h + "px"
                }), i.features.triggerDialog && (r.getStyle(u, "position") === "static" && r.extend(u.style, {
                    position: "relative"
                }), f = parseInt(r.getStyle(u, "zIndex"), 10), isNaN(f) && (f = 0), r.extend(u.style, {
                    zIndex: f
                }), r.extend(s.style, {
                    zIndex: f - 1
                })))
            });
            i.bind("DisableBrowse", function (n, i) {
                var r = t.getElementById(n.id + "_html5");
                r && (r.disabled = i)
            });
            i.bind("CancelUpload", function () {
                s && s.abort && s.abort()
            });
            i.bind("UploadFile", function (t, i) {
                function l(n, t, i) {
                    var r;
                    if (File.prototype.slice) try {
                        return n.slice(), n.slice(t, i)
                    } catch (u) {
                        return n.slice(t, i - t)
                    } else return (r = File.prototype.webkitSlice || File.prototype.mozSlice) ? r.call(n, t, i) : null
                }

                function e(u) {
                    function o() {
                        function d(n) {
                            var r, i;
                            if (s.sendAsBinary) s.sendAsBinary(n);
                            else if (t.features.canSendBinary) {
                                for (r = new Uint8Array(n.length), i = 0; i < n.length; i++) r[i] = n.charCodeAt(i) & 255;
                                s.send(r.buffer)
                            }
                        }

                        function g(u) {
                            var it = 0,
                                nt = "----pluploadboundary" + r.guid(),
                                g, tt = "--",
                                c = "\r\n",
                                l = "";
                            if (s = new XMLHttpRequest, s.upload && (s.upload.onprogress = function (n) {
                                i.loaded = Math.min(i.size, e + n.loaded - it);
                                t.trigger("UploadProgress", i)
                            }), s.onreadystatechange = function () {
                                var n, h;
                                if (s.readyState == 4 && t.state !== r.STOPPED) {
                                    try {
                                        n = s.status
                                    } catch (c) {
                                        n = 0
                                    }
                                    if (n >= 400) t.trigger("Error", {
                                        code: r.HTTP_ERROR,
                                        message: r.translate("HTTP Error."),
                                        file: i,
                                        status: n
                                    });
                                    else {
                                        if (p) {
                                            if (h = {
                                                chunk: f,
                                                chunks: p,
                                                response: s.responseText,
                                                status: n
                                            }, t.trigger("ChunkUploaded", i, h), e += w, h.cancelled) {
                                                i.status = r.FAILED;
                                                return
                                            }
                                            i.loaded = Math.min(i.size, (f + 1) * a)
                                        } else i.loaded = i.size;
                                        t.trigger("UploadProgress", i);
                                        u = y = g = l = null;
                                        !p || ++f >= p ? (i.status = r.DONE, t.trigger("FileUploaded", i, {
                                            response: s.responseText,
                                            status: n
                                        })) : o()
                                    }
                                }
                            }, t.settings.multipart && h.multipart) {
                                if (v.name = i.target_name || i.name, s.open("post", b, !0), r.each(t.settings.headers, function (n, t) {
                                    s.setRequestHeader(t, n)
                                }), typeof u != "string" && !!n.FormData) {
                                    g = new FormData;
                                    r.each(r.extend(v, t.settings.multipart_params), function (n, t) {
                                        g.append(t, n)
                                    });
                                    g.append(t.settings.file_data_name, u);
                                    s.send(g);
                                    return
                                }
                                if (typeof u == "string") {
                                    s.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + nt);
                                    r.each(r.extend(v, t.settings.multipart_params), function (n, t) {
                                        l += tt + nt + c + 'Content-Disposition: form-data; name="' + t + '"' + c + c;
                                        l += unescape(encodeURIComponent(n)) + c
                                    });
                                    k = r.mimeTypes[i.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream";
                                    l += tt + nt + c + 'Content-Disposition: form-data; name="' + t.settings.file_data_name + '"; filename="' + unescape(encodeURIComponent(i.name)) + '"' + c + "Content-Type: " + k + c + c + u + c + tt + nt + tt + c;
                                    it = l.length - u.length;
                                    u = l;
                                    d(u);
                                    return
                                }
                            }
                            b = r.buildUrl(t.settings.url, r.extend(v, t.settings.multipart_params));
                            s.open("post", b, !0);
                            s.setRequestHeader("Content-Type", "application/octet-stream");
                            r.each(t.settings.headers, function (n, t) {
                                s.setRequestHeader(t, n)
                            });
                            typeof u == "string" ? d(u) : s.send(u)
                        }
                        var y, p, v, a, w, k, b = t.settings.url;
                        i.status != r.DONE && i.status != r.FAILED && t.state != r.STOPPED && (v = {
                            name: i.target_name || i.name
                        }, c.chunk_size && i.size > c.chunk_size && (h.chunks || typeof u == "string") ? (a = c.chunk_size, p = Math.ceil(i.size / a), w = Math.min(a, i.size - f * a), y = typeof u == "string" ? u.substring(f * a, f * a + w) : l(u, f * a, f * a + w), v.chunk = f, v.chunks = p) : (w = i.size, y = u), t.settings.multipart && h.multipart && typeof y != "string" && n.FileReader && h.cantSendBlobInFormData && h.chunks && t.settings.chunk_size ? function () {
                            var n = new FileReader;
                            n.onload = function () {
                                g(n.result);
                                n = null
                            };
                            n.readAsBinaryString(y)
                        }() : g(y))
                    }
                    var f = 0,
                        e = 0;
                    o()
                }
                var c = t.settings,
                    u;
                u = f[i.id];
                h.jpgresize && t.settings.resize && /\.(png|jpg|jpeg)$/i.test(i.name) ? y.call(t, i, t.settings.resize, /\.png$/i.test(i.name) ? "image/png" : "image/jpeg", function (n) {
                    n.success ? (i.size = n.data.length, e(n.data)) : h.chunks ? e(u) : o(u, e)
                }) : !h.chunks && h.jpgresize ? o(u, e) : e(u)
            });
            i.bind("Destroy", function (n) {
                var f, i, e = t.body,
                    u = {
                        inputContainer: n.id + "_html5_container",
                        inputFile: n.id + "_html5",
                        browseButton: n.settings.browse_button,
                        dropElm: n.settings.drop_element
                    };
                for (f in u) i = t.getElementById(u[f]), i && r.removeAllEvents(i, n.id);
                r.removeAllEvents(t.body, n.id);
                n.settings.container && (e = t.getElementById(n.settings.container));
                e.removeChild(t.getElementById(u.inputContainer))
            });
            u({
                success: !0
            })
        }
    })
})(window, document, plupload);
(function (n, t, i, r) {
    function f(n) {
        var t, e = typeof n,
            o, i, u;
        if (n === r || n === null) return "null";
        if (e === "string") return t = "\bb\tt\nn\ff\rr\"\"''\\\\", '"' + n.replace(/([\u0080-\uFFFF\x00-\x1f\"])/g, function (n, i) {
            var r = t.indexOf(i);
            return r + 1 ? "\\" + t.charAt(r + 1) : (n = i.charCodeAt().toString(16), "\\u" + "0000".substring(n.length) + n)
        }) + '"';
        if (e == "object") {
            if (o = n.length !== r, t = "", o) {
                for (i = 0; i < n.length; i++) t && (t += ","), t += f(n[i]);
                t = "[" + t + "]"
            } else {
                for (u in n) n.hasOwnProperty(u) && (t && (t += ","), t += f(u) + ":" + f(n[u]));
                t = "{" + t + "}"
            }
            return t
        }
        return "" + n
    }

    function o(n) {
        var r = !1,
            o = null,
            u, t, i, f, s, e = 0,
            h;
        try {
            try {
                o = new ActiveXObject("AgControl.AgControl");
                o.IsVersionSupported(n) && (r = !0);
                o = null
            } catch (c) {
                if (h = navigator.plugins["Silverlight Plug-In"], h) {
                    for (u = h.description, u === "1.0.30226.2" && (u = "2.0.30226.2"), t = u.split("."); t.length > 3;) t.pop();
                    while (t.length < 4) t.push(0);
                    for (i = n.split("."); i.length > 4;) i.pop();
                    do f = parseInt(i[e], 10), s = parseInt(t[e], 10), e++; while (e < i.length && f === s);
                    f <= s && !isNaN(f) && (r = !0)
                }
            }
        } catch (l) {
            r = !1
        }
        return r
    }
    var e = {},
        u = {};
    i.silverlight = {
        trigger: function (n, t) {
            var r = e[n],
                u;
            r && (u = i.toArray(arguments).slice(1), u[0] = "Silverlight:" + t, setTimeout(function () {
                r.trigger.apply(r, u)
            }, 0))
        }
    };
    i.runtimes.Silverlight = i.addRuntime("silverlight", {
        getFeatures: function () {
            return {
                jpgresize: !0,
                pngresize: !0,
                chunks: !0,
                progress: !0,
                multipart: !0,
                multi_selection: !0
            }
        }, init: function (r, s) {
            function l() {
                return t.getElementById(r.id + "_silverlight").content.Upload
            }
            var h, v = "",
                y = r.settings.filters,
                c, a = t.body;
            if (!o("2.0.31005.0") || n.opera && n.opera.buildNumber) {
                s({
                    success: !1
                });
                return
            }
            for (u[r.id] = !1, e[r.id] = r, h = t.createElement("div"), h.id = r.id + "_silverlight_container", i.extend(h.style, {
                position: "absolute",
                top: "0px",
                background: r.settings.shim_bgcolor || "transparent",
                zIndex: 99999,
                width: "100px",
                height: "100px",
                overflow: "hidden",
                opacity: r.settings.shim_bgcolor || t.documentMode > 8 ? "" : .01
            }), h.className = "plupload silverlight", r.settings.container && (a = t.getElementById(r.settings.container), i.getStyle(a, "position") === "static" && (a.style.position = "relative")), a.appendChild(h), c = 0; c < y.length; c++) v += (v != "" ? "|" : "") + y[c].title + " | *." + y[c].extensions.replace(/,/g, ";*.");
            h.innerHTML = '<object id="' + r.id + '_silverlight" data="data:application/x-silverlight," type="application/x-silverlight-2" style="outline:none;" width="1024" height="1024"><param name="source" value="' + r.settings.silverlight_xap_url + '"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="id=' + r.id + ",filter=" + v + ",multiselect=" + r.settings.multi_selection + '"/><\/object>';
            r.bind("Silverlight:Init", function () {
                var o, n = {};
                u[r.id] || (u[r.id] = !0, r.bind("Silverlight:StartSelectFiles", function () {
                    o = []
                }), r.bind("Silverlight:SelectFile", function (t, r, u, f) {
                    var e;
                    e = i.guid();
                    n[e] = r;
                    n[r] = e;
                    o.push(new i.File(e, u, f))
                }), r.bind("Silverlight:SelectSuccessful", function () {
                    o.length && r.trigger("FilesAdded", o)
                }), r.bind("Silverlight:UploadChunkError", function (t, u, f, e, o) {
                    r.trigger("Error", {
                        code: i.IO_ERROR,
                        message: "IO Error.",
                        details: o,
                        file: t.getFile(n[u])
                    })
                }), r.bind("Silverlight:UploadFileProgress", function (t, r, u, f) {
                    var e = t.getFile(n[r]);
                    e.status != i.FAILED && (e.size = f, e.loaded = u, t.trigger("UploadProgress", e))
                }), r.bind("Refresh", function (n) {
                    var r, u, f;
                    r = t.getElementById(n.settings.browse_button);
                    r && (u = i.getPos(r, t.getElementById(n.settings.container)), f = i.getSize(r), i.extend(t.getElementById(n.id + "_silverlight_container").style, {
                        top: u.y + "px",
                        left: u.x + "px",
                        width: f.w + "px",
                        height: f.h + "px"
                    }))
                }), r.bind("Silverlight:UploadChunkSuccessful", function (t, r, u, f, e) {
                    var s, o = t.getFile(n[r]);
                    s = {
                        chunk: u,
                        chunks: f,
                        response: e
                    };
                    t.trigger("ChunkUploaded", o, s);
                    o.status != i.FAILED && t.state !== i.STOPPED && l().UploadNextChunk();
                    u == f - 1 && (o.status = i.DONE, t.trigger("FileUploaded", o, {
                        response: e
                    }))
                }), r.bind("Silverlight:UploadSuccessful", function (t, r, u) {
                    var f = t.getFile(n[r]);
                    f.status = i.DONE;
                    t.trigger("FileUploaded", f, {
                        response: u
                    })
                }), r.bind("FilesRemoved", function (t, i) {
                    for (var r = 0; r < i.length; r++) l().RemoveFile(n[i[r].id])
                }), r.bind("UploadFile", function (t, r) {
                    var u = t.settings,
                        e = u.resize || {};
                    l().UploadFile(n[r.id], t.settings.url, f({
                        name: r.target_name || r.name,
                        mime: i.mimeTypes[r.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream",
                        chunk_size: u.chunk_size,
                        image_width: e.width,
                        image_height: e.height,
                        image_quality: e.quality,
                        multipart: !!u.multipart,
                        multipart_params: u.multipart_params || {}, file_data_name: u.file_data_name,
                        headers: u.headers
                    }))
                }), r.bind("CancelUpload", function () {
                    l().CancelUpload()
                }), r.bind("Silverlight:MouseEnter", function (n) {
                    var u, f;
                    u = t.getElementById(r.settings.browse_button);
                    f = n.settings.browse_button_hover;
                    u && f && i.addClass(u, f)
                }), r.bind("Silverlight:MouseLeave", function (n) {
                    var u, f;
                    u = t.getElementById(r.settings.browse_button);
                    f = n.settings.browse_button_hover;
                    u && f && i.removeClass(u, f)
                }), r.bind("Silverlight:MouseLeftButtonDown", function (n) {
                    var u, f;
                    u = t.getElementById(r.settings.browse_button);
                    f = n.settings.browse_button_active;
                    u && f && (i.addClass(u, f), i.addEvent(t.body, "mouseup", function () {
                        i.removeClass(u, f)
                    }))
                }), r.bind("Sliverlight:StartSelectFiles", function (n) {
                    var u, f;
                    u = t.getElementById(r.settings.browse_button);
                    f = n.settings.browse_button_active;
                    u && f && i.removeClass(u, f)
                }), r.bind("DisableBrowse", function (n, t) {
                    l().DisableBrowse(t)
                }), r.bind("Destroy", function (n) {
                    var r;
                    i.removeAllEvents(t.body, n.id);
                    delete u[n.id];
                    delete e[n.id];
                    r = t.getElementById(n.id + "_silverlight_container");
                    r && r.parentNode.removeChild(r)
                }), s({
                    success: !0
                }))
            })
        }
    })
})(window, document, plupload);
(function (n, t, i) {
    function f() {
        var n;
        try {
            n = navigator.plugins["Shockwave Flash"];
            n = n.description
        } catch (t) {
            try {
                n = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version")
            } catch (i) {
                n = "0.0"
            }
        }
        return n = n.match(/\d+/g), parseFloat(n[0] + "." + n[1])
    }
    var u = {},
        r = {};
    i.flash = {
        trigger: function (n, t, i) {
            setTimeout(function () {
                var r = u[n];
                r && r.trigger("Flash:" + t, i)
            }, 0)
        }
    };
    i.runtimes.Flash = i.addRuntime("flash", {
        getFeatures: function () {
            return {
                jpgresize: !0,
                pngresize: !0,
                maxWidth: 8091,
                maxHeight: 8091,
                chunks: !0,
                progress: !0,
                multipart: !0,
                multi_selection: !0
            }
        }, init: function (n, e) {
            function s() {
                return t.getElementById(n.id + "_flash")
            }

            function l() {
                if (a++ > 5e3) {
                    e({
                        success: !1
                    });
                    return
                }
                r[n.id] === !1 && setTimeout(l, 1)
            }
            var c, o, a = 0,
                h = t.body;
            if (f() < 10) {
                e({
                    success: !1
                });
                return
            }
            r[n.id] = !1;
            u[n.id] = n;
            c = t.getElementById(n.settings.browse_button);
            o = t.createElement("div");
            o.id = n.id + "_flash_container";
            i.extend(o.style, {
                position: "absolute",
                top: "0px",
                background: n.settings.shim_bgcolor || "transparent",
                zIndex: 99999,
                width: "100%",
                height: "100%"
            });
            o.className = "plupload flash";
            n.settings.container && (h = t.getElementById(n.settings.container), i.getStyle(h, "position") === "static" && (h.style.position = "relative"));
            h.appendChild(o),
                function () {
                    var r, u;
                    r = '<object id="' + n.id + '_flash" type="application/x-shockwave-flash" data="' + n.settings.flash_swf_url + '" ';
                    i.ua.ie && (r += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ');
                    r += 'width="100%" height="100%" style="outline:0"><param name="movie" value="' + n.settings.flash_swf_url + '" /><param name="flashvars" value="id=' + escape(n.id) + '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /><\/object>';
                    i.ua.ie ? (u = t.createElement("div"), o.appendChild(u), u.outerHTML = r, u = null) : o.innerHTML = r
                }();
            l();
            c = o = null;
            n.bind("Destroy", function (n) {
                var f;
                i.removeAllEvents(t.body, n.id);
                delete r[n.id];
                delete u[n.id];
                f = t.getElementById(n.id + "_flash_container");
                f && f.parentNode.removeChild(f)
            });
            n.bind("Flash:Init", function () {
                var u = {};
                try {
                    s().setFileFilters(n.settings.filters, n.settings.multi_selection)
                } catch (f) {
                    e({
                        success: !1
                    });
                    return
                }
                r[n.id] || (r[n.id] = !0, n.bind("UploadFile", function (t, r) {
                    var f = t.settings,
                        e = n.settings.resize || {};
                    s().uploadFile(u[r.id], f.url, {
                        name: r.target_name || r.name,
                        mime: i.mimeTypes[r.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream",
                        chunk_size: f.chunk_size,
                        width: e.width,
                        height: e.height,
                        quality: e.quality,
                        multipart: f.multipart,
                        multipart_params: f.multipart_params || {}, file_data_name: f.file_data_name,
                        format: /\.(jpg|jpeg)$/i.test(r.name) ? "jpg" : "png",
                        headers: f.headers,
                        urlstream_upload: f.urlstream_upload
                    })
                }), n.bind("CancelUpload", function () {
                    s().cancelUpload()
                }), n.bind("Flash:UploadProcess", function (n, t) {
                    var r = n.getFile(u[t.id]);
                    r.status != i.FAILED && (r.loaded = t.loaded, r.size = t.size, n.trigger("UploadProgress", r))
                }), n.bind("Flash:UploadChunkComplete", function (n, t) {
                    var f, r = n.getFile(u[t.id]);
                    f = {
                        chunk: t.chunk,
                        chunks: t.chunks,
                        response: t.text
                    };
                    n.trigger("ChunkUploaded", r, f);
                    r.status !== i.FAILED && n.state !== i.STOPPED && s().uploadNextChunk();
                    t.chunk == t.chunks - 1 && (r.status = i.DONE, n.trigger("FileUploaded", r, {
                        response: t.text
                    }))
                }), n.bind("Flash:SelectFiles", function (t, r) {
                    for (var f, s = [], o, e = 0; e < r.length; e++) f = r[e], o = i.guid(), u[o] = f.id, u[f.id] = o, s.push(new i.File(o, f.name, f.size));
                    s.length && n.trigger("FilesAdded", s)
                }), n.bind("Flash:SecurityError", function (t, r) {
                    n.trigger("Error", {
                        code: i.SECURITY_ERROR,
                        message: i.translate("Security error."),
                        details: r.message,
                        file: n.getFile(u[r.id])
                    })
                }), n.bind("Flash:GenericError", function (t, r) {
                    n.trigger("Error", {
                        code: i.GENERIC_ERROR,
                        message: i.translate("Generic error."),
                        details: r.message,
                        file: n.getFile(u[r.id])
                    })
                }), n.bind("Flash:IOError", function (t, r) {
                    n.trigger("Error", {
                        code: i.IO_ERROR,
                        message: i.translate("IO error."),
                        details: r.message,
                        file: n.getFile(u[r.id])
                    })
                }), n.bind("Flash:ImageError", function (t, r) {
                    n.trigger("Error", {
                        code: parseInt(r.code, 10),
                        message: i.translate("Image error."),
                        file: n.getFile(u[r.id])
                    })
                }), n.bind("Flash:StageEvent:rollOver", function (r) {
                    var u, f;
                    u = t.getElementById(n.settings.browse_button);
                    f = r.settings.browse_button_hover;
                    u && f && i.addClass(u, f)
                }), n.bind("Flash:StageEvent:rollOut", function (r) {
                    var u, f;
                    u = t.getElementById(n.settings.browse_button);
                    f = r.settings.browse_button_hover;
                    u && f && i.removeClass(u, f)
                }), n.bind("Flash:StageEvent:mouseDown", function (r) {
                    var u, f;
                    u = t.getElementById(n.settings.browse_button);
                    f = r.settings.browse_button_active;
                    u && f && (i.addClass(u, f), i.addEvent(t.body, "mouseup", function () {
                        i.removeClass(u, f)
                    }, r.id))
                }), n.bind("Flash:StageEvent:mouseUp", function (r) {
                    var u, f;
                    u = t.getElementById(n.settings.browse_button);
                    f = r.settings.browse_button_active;
                    u && f && i.removeClass(u, f)
                }), n.bind("Flash:ExifData", function (t, i) {
                    n.trigger("ExifData", n.getFile(u[i.id]), i.data)
                }), n.bind("Flash:GpsData", function (t, i) {
                    n.trigger("GpsData", n.getFile(u[i.id]), i.data)
                }), n.bind("QueueChanged", function () {
                    n.refresh()
                }), n.bind("FilesRemoved", function (n, t) {
                    for (var i = 0; i < t.length; i++) s().removeFile(u[t[i].id])
                }), n.bind("StateChanged", function () {
                    n.refresh()
                }), n.bind("Refresh", function (r) {
                    var u, f, e;
                    s().setFileFilters(n.settings.filters, n.settings.multi_selection);
                    u = t.getElementById(r.settings.browse_button);
                    u && (f = i.getPos(u, t.getElementById(r.settings.container)), e = i.getSize(u), i.extend(t.getElementById(r.id + "_flash_container").style, {
                        top: f.y + "px",
                        left: f.x + "px",
                        width: e.w + "px",
                        height: e.h + "px"
                    }))
                }), n.bind("DisableBrowse", function (n, t) {
                    s().disableBrowse(t)
                }), e({
                    success: !0
                }))
            })
        }
    })
})(window, document, plupload);
(function (n, t, i) {
    function r(n) {
        return t.getElementById(n)
    }
    i.runtimes.Html4 = i.addRuntime("html4", {
        getFeatures: function () {
            return {
                multipart: !0,
                triggerDialog: i.ua.gecko && n.FormData || i.ua.webkit
            }
        }, init: function (u, f) {
            u.bind("Init", function (f) {
                function b() {
                    var o, n, s, l;
                    e = i.guid();
                    p.push(e);
                    o = t.createElement("form");
                    o.setAttribute("id", "form_" + e);
                    o.setAttribute("method", "post");
                    o.setAttribute("enctype", "multipart/form-data");
                    o.setAttribute("encoding", "multipart/form-data");
                    o.setAttribute("target", f.id + "_iframe");
                    o.style.position = "absolute";
                    o.style.margin = "0px";
                    o.style.padding = "0px";
                    n = t.createElement("input");
                    n.setAttribute("id", "input_" + e);
                    n.setAttribute("type", "file");
                    n.setAttribute("accept", h);
                    n.setAttribute("size", 1);
                    n.style.margin = "0px";
                    n.style.padding = "0px";
                    n.style.border = "0px";
                    l = r(f.settings.browse_button);
                    f.features.triggerDialog && l && i.addEvent(r(f.settings.browse_button), "click", function (t) {
                        n.disabled || n.click();
                        t.preventDefault()
                    }, f.id);
                    i.extend(n.style, {
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        fontSize: "99px",
                        cursor: "pointer"
                    });
                    i.extend(o.style, {
                        overflow: "hidden"
                    });
                    s = f.settings.shim_bgcolor;
                    s && (o.style.background = s);
                    d && i.extend(n.style, {
                        filter: "alpha(opacity=0)"
                    });
                    i.addEvent(n, "change", function (t) {
                        var c = t.target,
                            s, h = [];
                        c.value && (r("form_" + e).style.top = "-1048575px", s = c.value.replace(/\\/g, "/"), s = s.substring(s.length, s.lastIndexOf("/") + 1), h.push(new i.File(e, s)), f.features.triggerDialog ? i.removeEvent(l, "click", f.id) : i.removeAllEvents(o, f.id), i.removeEvent(n, "change", f.id), b(), h.length && u.trigger("FilesAdded", h))
                    }, f.id);
                    o.appendChild(n);
                    c.appendChild(o);
                    f.refresh()
                }

                function g() {
                    var r = t.createElement("div");
                    r.innerHTML = '<iframe id="' + f.id + '_iframe" name="' + f.id + '_iframe" src="' + k + ':&quot;&quot;" style="display:none"><\/iframe>';
                    s = r.firstChild;
                    c.appendChild(s);
                    i.addEvent(s, "load", function (t) {
                        var r = t.target,
                            u, e;
                        if (o) {
                            try {
                                u = r.contentWindow.document || r.contentDocument || n.frames[r.id].document
                            } catch (s) {
                                f.trigger("Error", {
                                    code: i.SECURITY_ERROR,
                                    message: i.translate("Security error."),
                                    file: o
                                });
                                return
                            }
                            e = u.documentElement.innerText || u.documentElement.textContent;
                            e && (o.status = i.DONE, o.loaded = 1025, o.percent = 100, f.trigger("UploadProgress", o), f.trigger("FileUploaded", o, {
                                response: e
                            }))
                        }
                    }, f.id)
                }
                var c = t.body,
                    s, k = "javascript",
                    o, e, p = [],
                    d = /MSIE/.test(navigator.userAgent),
                    h = [],
                    w = f.settings.filters,
                    a, v, y, l;
                n: for (a = 0; a < w.length; a++)
                    for (v = w[a].extensions.split(/,/), l = 0; l < v.length; l++) {
                        if (v[l] === "*") {
                            h = [];
                            break n
                        }
                        y = i.mimeTypes[v[l]];
                        y && i.inArray(y, h) === -1 && h.push(y)
                    }
                h = h.join(",");
                f.settings.container && (c = r(f.settings.container), i.getStyle(c, "position") === "static" && (c.style.position = "relative"));
                f.bind("UploadFile", function (n, u) {
                    var f, s;
                    u.status != i.DONE && u.status != i.FAILED && n.state != i.STOPPED && (f = r("form_" + u.id), s = r("input_" + u.id), s.setAttribute("name", n.settings.file_data_name), n.ex.sendMultipartParamsAsQuerystring ? f.setAttribute("action", i.buildUrl(n.settings.url, i.extend({
                        name: u.target_name || u.name
                    }, n.settings.multipart_params))) : (f.setAttribute("action", n.settings.url), i.each(i.extend({
                        name: u.target_name || u.name
                    }, n.settings.multipart_params), function (n, r) {
                        var u = t.createElement("input");
                        i.extend(u, {
                            type: "hidden",
                            name: r,
                            value: n
                        });
                        f.insertBefore(u, f.firstChild)
                    })), o = u, r("form_" + e).style.top = "-1048575px", f.submit())
                });
                f.bind("FileUploaded", function (n) {
                    n.refresh()
                });
                f.bind("StateChanged", function (t) {
                    t.state == i.STARTED ? g() : t.state == i.STOPPED && n.setTimeout(function () {
                        i.removeEvent(s, "load", t.id);
                        s.parentNode && s.parentNode.removeChild(s)
                    }, 0);
                    i.each(t.files, function (n) {
                        if (n.status === i.DONE || n.status === i.FAILED) {
                            var t = r("form_" + n.id);
                            t && t.parentNode.removeChild(t)
                        }
                    })
                });
                f.bind("Refresh", function (n) {
                    var u, o, s, h, l, a, c, v, f;
                    u = r(n.settings.browse_button);
                    u && (l = i.getPos(u, r(n.settings.container)), a = i.getSize(u), c = r("form_" + e), v = r("input_" + e), i.extend(c.style, {
                        top: l.y + "px",
                        left: l.x + "px",
                        width: a.w + "px",
                        height: a.h + "px"
                    }), n.features.triggerDialog && (i.getStyle(u, "position") === "static" && i.extend(u.style, {
                        position: "relative"
                    }), f = parseInt(u.style.zIndex, 10), isNaN(f) && (f = 0), i.extend(u.style, {
                        zIndex: f
                    }), i.extend(c.style, {
                        zIndex: f - 1
                    })), s = n.settings.browse_button_hover, h = n.settings.browse_button_active, o = n.features.triggerDialog ? u : c, s && (i.addEvent(o, "mouseover", function () {
                        i.addClass(u, s)
                    }, n.id), i.addEvent(o, "mouseout", function () {
                        i.removeClass(u, s)
                    }, n.id)), h && (i.addEvent(o, "mousedown", function () {
                        i.addClass(u, h)
                    }, n.id), i.addEvent(t.body, "mouseup", function () {
                        i.removeClass(u, h)
                    }, n.id)))
                });
                u.bind("FilesRemoved", function (n, t) {
                    for (var u, i = 0; i < t.length; i++) u = r("form_" + t[i].id), u && u.parentNode.removeChild(u)
                });
                u.bind("DisableBrowse", function (n, i) {
                    var r = t.getElementById("input_" + e);
                    r && (r.disabled = i)
                });
                u.bind("Destroy", function (n) {
                    var o, f, u, s = {
                        inputContainer: "form_" + e,
                        inputFile: "input_" + e,
                        browseButton: n.settings.browse_button
                    };
                    for (o in s) f = r(s[o]), f && i.removeAllEvents(f, n.id);
                    i.removeAllEvents(t.body, n.id);
                    i.each(p, function (n) {
                        u = r("form_" + n);
                        u && u.parentNode.removeChild(u)
                    })
                });
                b()
            });
            f({
                success: !0
            })
        }
    })
})(window, document, plupload);
var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.FileUploaderMinimumWidth = 400;
GleamTech.JavaScript.UI.FileUploaderMinimumHeight = 200;
GleamTech.JavaScript.UI.FileUploaderCssClass = "gt-fileUploader gt-nonSelectableText";
GleamTech.JavaScript.UI.FileUploaderInfoPaneCssClass = "gt-infoPane";
GleamTech.JavaScript.UI.FileUploaderInfoPaneTitleCssClass = "gt-infoPaneTitle";
GleamTech.JavaScript.UI.FileUploaderWarningTextCssClass = "gt-warningText";
GleamTech.JavaScript.UI.FileUploaderGridColumnTypes = {
    Name: {
        Text: "Label.Column.Name",
        Type: "CaseInsensitiveString",
        AlignRight: !1,
        Size: 33
    },
    Size: {
        Text: "Label.Column.Size",
        Type: "Number",
        AlignRight: !0
    },
    Type: {
        Text: "Label.Column.Type",
        Type: "CaseInsensitiveString",
        AlignRight: !1
    },
    Status: {
        Text: "FileUploader.Column.Status",
        Type: "Number",
        AlignRight: !1
    }
};
GleamTech.JavaScript.UI.FileUploaderUploadMethodType = {
    Html4: 0,
    Flash: 1,
    Silverlight: 2,
    Html5: 3
};
GleamTech.JavaScript.UI.FileUploaderUploadStatus = {
    Pending: 1,
    Rejected: 2,
    Skipped: 3,
    Uploading: 4,
    Canceled: 5,
    Failed: 6,
    Completed: 7
};
GleamTech.JavaScript.UI.FileUploaderOverallStatus = {
    Adding: 1,
    FileStarted: 2,
    FileProcessing: 3,
    FileCompleted: 4,
    Stopped: 5,
    Processed: 6
};
GleamTech.JavaScript.UI.FileUploaderValidationAction = {
    Accept: 0,
    Reject: 1,
    ConfirmReplace: 2
};
GleamTech.JavaScript.UI.FileUploader = function (n) {
    var t, r, i;
    if (document.compatMode == "BackCompat") {
        alert("FileUploader can not be rendered correctly in quirks mode.\nPlease use a proper doctype declaration in the host page.");
        return
    }
    if (GleamTech.JavaScript.Util.GetIEVersion() < 7) {
        alert("FileUploader requires Internet Explorer 7 as a minimum.\nPlease upgrade your IE version or use another browser.");
        return
    }
    if (this.Parameters = n, t = this, this.Uploading = null, this.Uploaded = null, this.ItemUploading = null, this.ItemUploaded = null, this.Language = GleamTech.JavaScript.Util.GetLanguage(this.Parameters.Language), this.ElementControl = document.createElement("div"), this.ElementControl.id = this.Parameters.ElementId, this.Parameters.ShowOnLoad || (this.ElementControl.style.display = "none"), this.ElementControl.className = GleamTech.JavaScript.UI.FileUploaderCssClass, this.ElementControl.style.height = "1px", this.ElementControl.style.overflow = "hidden", GleamTech.JavaScript.Util.AddEvent(this.ElementControl, "contextmenu", GleamTech.JavaScript.Util.CancelEventExceptForTextInput), GleamTech.JavaScript.Util.AddEvent(this.ElementControl, "selectstart", GleamTech.JavaScript.Util.CancelEventExceptForTextInput), GleamTech.JavaScript.Util.AddEvent(this.ElementControl, "dragstart", GleamTech.JavaScript.Util.CancelEventExceptForTextInput), this.Parameters.FullViewport && !this.Parameters.ModalDialog) document.body.appendChild(this.ElementControl), this.ElementControl.style.position = "absolute";
    else {
        this.ElementControl.style.position = "relative";
        try {
            if (this.Parameters.Container && this.Parameters.Container.nodeType) this.Parameters.Container.appendChild(this.ElementControl);
            else if (this.Parameters.PlaceHolder && this.Parameters.PlaceHolder.parentNode) this.Parameters.PlaceHolder.parentNode.replaceChild(this.ElementControl, this.Parameters.PlaceHolder);
            else {
                alert("FileUploader can not be rendered:\nA valid container or placeholder is not specified.");
                return
            }
        } catch (u) {
            alert("FileUploader can not be rendered:\n" + u.message);
            return
        }
    }
    this.ElementUploadInfo = document.createElement("div");
    this.ElementUploadInfo.id = this.Parameters.ElementId + "-folderInfo";
    this.ElementUploadInfo.className = GleamTech.JavaScript.UI.FileUploaderInfoPaneCssClass;
    this.ElementUploadInfo.style.height = "40px";
    this.ElementUploadInfo.style.paddingLeft = "6px";
    this.ElementUploadInfo.style.paddingTop = "3px";
    this.ElementUploadInfo.style.paddingRight = "6px";
    this.ElementUploadInfo.style.paddingBottom = "3px";
    this.ElementUploadInfo.style.position = "relative";
    this.ElementControl.appendChild(this.ElementUploadInfo);
    this.ElementUploadInfoImage = new Image;
    this.ElementUploadInfoImage.src = this.getResourceUrl("images/icons32/upload.png");
    this.ElementUploadInfoImage.style.width = "32px";
    this.ElementUploadInfoImage.style.height = "32px";
    this.ElementUploadInfoImage.style.top = "7px";
    this.ElementUploadInfoImage.style.position = "absolute";
    this.ElementUploadInfo.appendChild(this.ElementUploadInfoImage);
    this.ElementUploadInfoTitle = document.createElement("div");
    this.ElementUploadInfoTitle.style.width = "200px";
    this.ElementUploadInfoTitle.style.height = "40px";
    this.ElementUploadInfoTitle.style.lineHeight = "40px";
    this.ElementUploadInfoTitle.style.position = "absolute";
    this.ElementUploadInfoTitle.style.left = "44px";
    this.ElementUploadInfoTitle.className = GleamTech.JavaScript.UI.FileUploaderInfoPaneTitleCssClass;
    this.ElementUploadInfoTitle.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.SelectFiles")));
    this.ElementUploadInfo.appendChild(this.ElementUploadInfoTitle);
    this.ElementUploadInfoStats = document.createElement("div");
    this.ElementUploadInfoStats.style.width = "150px";
    this.ElementUploadInfoStats.style.height = "40px";
    this.ElementUploadInfoStats.style.lineHeight = "40px";
    this.ElementUploadInfoStats.style.position = "absolute";
    this.ElementUploadInfoStats.style.right = "6px";
    this.ElementUploadInfoStats.style.textAlign = "center";
    this.ElementUploadInfoStats.appendChild(document.createTextNode(String.fromCharCode(160)));
    this.ElementUploadInfo.appendChild(this.ElementUploadInfoStats);
    this.GridView = new GleamTech.JavaScript.UI.GridView;
    this.GridView.SetIconSize(16, 16);
    this.GridView.onRowContextMenu = function (n, i) {
        t.onGridRowContextMenu(n, i)
    };
    this.GridView.onGridContextMenu = function (n) {
        t.onGridContextMenu(n)
    };
    for (r in GleamTech.JavaScript.UI.FileUploaderGridColumnTypes) i = GleamTech.JavaScript.UI.FileUploaderGridColumnTypes[r], this.GridView.AddColumn(r, this.Language.GetEntry(i.Text), i.Type, i.AlignRight, null, i.Size);
    this.GridView.AddColumn("FileHandle").hidden = !0;
    this.GridView.rowTitleColumn = this.GridView.columns.Name;
    this.Parameters.ShowFileExtensions || (this.GridView.columns.Name.formatFunction = GleamTech.JavaScript.Util.GetFileNameWithoutExtension);
    this.GridView.columns.Size.formatFunction = GleamTech.JavaScript.Util.FormatFileSize;
    this.GridView.Render(this.Parameters.ElementId + "-gridView", this.ElementControl);
    this.ElementDropOverlay = document.createElement("div");
    this.ElementDropOverlay.id = this.GridView.divElement.id + "-dropOverlay";
    this.ElementDropOverlay.style.position = "absolute";
    this.ElementDropOverlay.style.backgroundColor = "transparent";
    this.ElementDropOverlay.style.display = "none";
    this.ElementControl.appendChild(this.ElementDropOverlay);
    this.ElementFooter = document.createElement("div");
    this.ElementFooter.id = this.Parameters.ElementId + "-footer";
    this.ElementFooter.style.position = "relative";
    this.ElementControl.appendChild(this.ElementFooter);
    this.ElementQueueAdding = document.createElement("div");
    this.ElementQueueAdding.id = this.Parameters.ElementId + "-queueAdding";
    this.ElementQueueAdding.style.paddingTop = "10px";
    this.ElementQueueAdding.style.paddingLeft = "6px";
    this.ElementQueueAdding.style.paddingBottom = "10px";
    this.ElementQueueAdding.style.paddingRight = "6px";
    this.ElementFooter.appendChild(this.ElementQueueAdding);
    this.ElementQueueAddingVisible = !0;
    this.ButtonAdd = document.createElement("input");
    this.ButtonAdd.id = this.Parameters.ElementId + "-addButton";
    this.ButtonAdd.type = "button";
    this.ButtonAdd.value = this.Language.GetEntry("FileUploader.Action.Add");
    this.ButtonAdd.style.width = "80px";
    this.ButtonAdd.disabled = !0;
    this.ElementQueueAdding.appendChild(this.ButtonAdd);
    this.ButtonUpload = document.createElement("input");
    this.ButtonUpload.type = "button";
    this.ButtonUpload.value = this.Language.GetEntry("Label.Upload.Verb");
    this.ButtonUpload.style.width = "80px";
    this.ButtonUpload.style.marginLeft = "6px";
    this.ButtonUpload.disabled = !0;
    this.ElementQueueAdding.appendChild(this.ButtonUpload);
    GleamTech.JavaScript.Util.AddEvent(this.ButtonUpload, "click", function () {
        t.BeginQueue()
    });
    this.ButtonClose = document.createElement("input");
    this.ButtonClose.type = "button";
    this.ButtonClose.value = this.Language.GetEntry("FileUploader.Action.Close");
    this.ButtonClose.style.width = "80px";
    this.ButtonClose.style.position = "absolute";
    this.ButtonClose.style.right = "6px";
    this.ElementQueueAdding.appendChild(this.ButtonClose);
    GleamTech.JavaScript.Util.AddEvent(this.ButtonClose, "click", function () {
        t.Hide()
    });
    GleamTech.JavaScript.UI.ContextMenuIconsPath["default"] = this.getResourceUrl("images/icons16/");
    this.ContextMenus = GleamTech.JavaScript.UI.ContextMenu.Parse(this.ElementControl, GleamTech.JavaScript.UI.FileUploaderContextMenusData, function (n) {
        t.onAction(n, n.menu.target)
    }, this.Language);
    this.ModalDialog = new GleamTech.JavaScript.UI.ModalDialog(this.ElementControl);
    this.ModalDialog.OkButtonText = this.Language.GetEntry("Label.OK");
    this.ModalDialog.CancelButtonText = this.Language.GetEntry("Label.Cancel");
    this.Parameters.ModalDialog && (this.ParentModalDialog = new GleamTech.JavaScript.UI.ModalDialog(this.Parameters.FullViewport ? null : this.ElementControl.parentNode), this.ParentModalDialog.OkButtonText = this.Language.GetEntry("Label.OK"), this.ParentModalDialog.CancelButtonText = this.Language.GetEntry("Label.Cancel"));
    this.SetFileTypes(this.Parameters.FileTypes);
    this.SetCustomParameters({});
    this.ActiveUploader = null;
    this.ActiveUploadMethod = null;
    this.LastUploadMethod = null;
    this.hidden = !0;
    this.Parameters.ShowOnLoad && this.Show()
};
GleamTech.JavaScript.UI.FileUploader.prototype.getResourceUrl = function (n) {
    return GleamTech.JavaScript.Util.AppendToUrl(this.Parameters.ResourceBasePath, n)
};
GleamTech.JavaScript.UI.FileUploader.prototype.getActionUrl = function (n) {
    return GleamTech.JavaScript.Util.AppendToUrl(this.Parameters.ActionBasePath, n)
};
GleamTech.JavaScript.UI.FileUploader.prototype.SetSize = function (n, t) {
    var u, i, r = this;
    return GleamTech.JavaScript.Util.EnsureDisplay(this.ElementControl, function (f) {
        n ? (f.style.width = n, f.style.width = f.offsetWidth < GleamTech.JavaScript.UI.FileUploaderMinimumWidth ? GleamTech.JavaScript.UI.FileUploaderMinimumWidth - (f.offsetWidth - f.clientWidth) + "px" : f.clientWidth - (f.offsetWidth - f.clientWidth) + "px") : f.offsetWidth < GleamTech.JavaScript.UI.FileUploaderMinimumWidth && (f.style.width = GleamTech.JavaScript.UI.FileUploaderMinimumWidth - (f.offsetWidth - f.clientWidth) + "px");
        t ? (f.style.height = t, f.style.height = f.offsetHeight < GleamTech.JavaScript.UI.FileUploaderMinimumHeight ? GleamTech.JavaScript.UI.FileUploaderMinimumHeight - (f.offsetHeight - f.clientHeight) + "px" : f.clientHeight - (f.offsetHeight - f.clientHeight) + "px") : f.offsetHeight < GleamTech.JavaScript.UI.FileUploaderMinimumHeight && (f.style.height = GleamTech.JavaScript.UI.FileUploaderMinimumHeight - (f.offsetHeight - f.clientHeight) + "px");
        u = f.clientWidth;
        i = f.clientHeight;
        r.GridView.Resize(null, i - r.ElementUploadInfo.offsetHeight - r.ElementFooter.offsetHeight)
    }), [u, i]
};
GleamTech.JavaScript.UI.FileUploader.prototype.resize = function () {
    this.Parameters.FullViewport && !this.Parameters.ModalDialog ? (this.ElementControl.style.left = GleamTech.JavaScript.Util.Viewport.GetScrollLeft() + "px", this.ElementControl.style.top = GleamTech.JavaScript.Util.Viewport.GetScrollTop() + "px", this.SetSize(GleamTech.JavaScript.Util.Viewport.GetWidth() + "px", GleamTech.JavaScript.Util.Viewport.GetHeight() + "px")) : this.SetSize(this.Parameters.Width, this.Parameters.Height)
};
GleamTech.JavaScript.UI.FileUploader.prototype.Show = function () {
    if (this.hidden) {
        var n = this;
        this.Parameters.ModalDialog ? (this.ElementOriginalParent = this.ElementControl.parentNode, this.ElementControl.style.border = "none", this.ParentModalDialogElement = this.ParentModalDialog.ShowElement(this.ElementControl, this.Parameters.ModalDialogTitle, function () {
            n.ElementControl.style.display = "block";
            n.resize()
        }, function () {
            return n.onHide()
        })) : (this.Parameters.FullViewport && (this.oldParentOverflow = document.body.style.overflow, document.body.style.overflow = "hidden"), this.ElementControl.style.display = "block", this.resize());
        this.LastUploadMethod == null ? this.TryLoadUploaders(this.Parameters.UploadMethods) : this.LoadUploader(this.LastUploadMethod, function (t) {
            t.Success || n.TryLoadUploaders(n.Parameters.UploadMethods)
        });
        this.oldWindowBeforeUnloadEvent = window.onbeforeunload;
        window.onbeforeunload = function () {
            return n.IsQueueInProgress ? n.Language.GetEntry("FileUploader.Confirm.UploadStillInProgress") : typeof n.oldWindowBeforeUnloadEvent == "function" ? n.oldWindowBeforeUnloadEvent.apply(null, arguments) : undefined
        };
        this.hidden = !1
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.Hide = function () {
    this.hidden || (this.Parameters.ModalDialog ? this.ParentModalDialog.Close(this.ParentModalDialogElement) : (this.onHide(), this.Parameters.FullViewport && (document.body.style.overflow = this.oldParentOverflow)))
};
GleamTech.JavaScript.UI.FileUploader.prototype.onHide = function () {
    if (this.IsQueueInProgress)
        if (confirm(this.Language.GetEntry("FileUploader.Confirm.UploadStillInProgress"))) this.Cancel();
        else return !1;
    this.UnloadUploader();
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Adding);
    return this.Parameters.ModalDialog ? (this.ElementControl.style.display = "none", this.ElementOriginalParent.appendChild(this.ElementControl)) : this.ElementControl.style.display = "none", window.onbeforeunload = this.oldWindowBeforeUnloadEvent, this.hidden = !0, !0
};
GleamTech.JavaScript.UI.FileUploader.prototype.TryLoadUploaders = function (n) {
    var t, u, r, i, h, o;
    if (n != null) {
        t = [];
        for (u in GleamTech.JavaScript.UI.FileUploaderUploadMethodType) t.push({
            Name: u.toLowerCase(),
            Value: GleamTech.JavaScript.UI.FileUploaderUploadMethodType[u]
        });
        var f = [],
            e = 0,
            s = n.split(/\s?,\s?/);
        for (r = 0; r < s.length; r++)
            for (i = 0; i < t.length; i++) s[r].toLowerCase() == t[i].Name && f.push(t[i].Value);
        h = this;
        o = function () {
            e != f.length && h.LoadUploader(f[e], function (n) {
                e++;
                n.Success || o()
            })
        };
        o()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.LoadUploader = function (n, t) {
    var i, u, r;
    if (this.ActiveUploadMethod != n) {
        this.UnloadUploader();
        this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Adding);
        u = {
            browse_button: this.ButtonAdd.id,
            container: this.ElementQueueAdding.id,
            filters: this.ActiveFileFilters
        };
        switch (n) {
        case GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html4:
            i = new plupload.Uploader(plupload.extend(u, {
                runtimes: "html4"
            }));
            this.IsFileSizeSupported = !1;
            this.IsRealTimeProgressSupported = !1;
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Flash:
            i = new plupload.Uploader(plupload.extend(u, {
                runtimes: "flash",
                multipart: !1,
                chunk_size: "4mb",
                flash_swf_url: this.getResourceUrl("flash/plupload.swf")
            }));
            this.IsFileSizeSupported = !0;
            this.IsRealTimeProgressSupported = !1;
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Silverlight:
            i = new plupload.Uploader(plupload.extend(u, {
                runtimes: "silverlight",
                multipart: !1,
                chunk_size: "4mb",
                silverlight_xap_url: this.getResourceUrl("silverlight/plupload.xap")
            }));
            this.IsFileSizeSupported = !0;
            this.IsRealTimeProgressSupported = !1;
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html5:
            i = new plupload.Uploader(plupload.extend(u, {
                runtimes: "html5",
                multipart: !1,
                chunk_size: "4mb",
                drop_element: this.ElementDropOverlay.id,
                required_features: "chunks"
            }));
            this.IsFileSizeSupported = !0;
            this.IsRealTimeProgressSupported = !0;
            break;
        default:
            t({
                Success: !1,
                UploadMethod: n
            });
            return
        }
        r = this;
        i.settings.preinit = function () {
            i.bind("Error", function (u, f) {
                if (f.code == plupload.INIT_ERROR) i.destroy(), i = null, t({
                    Success: !1,
                    UploadMethod: n
                });
                else r.onUploadClientError(f);
                return !1
            });
            i.bind("Init", function () {
                r.ActiveUploadMethod = n;
                r.ActiveUploader = i;
                r.IsRealTimeProgressSupported = r.IsRealTimeProgressSupported && i.features.progress;
                r.onDropAreaChange(!0);
                r.ButtonAdd.disabled = !1;
                r.ElementQueueAdding.title = r.Language.GetEntry("FileUploader.Action.UploadMethod") + ": " + GleamTech.JavaScript.Util.GetPropertyName(GleamTech.JavaScript.UI.FileUploaderUploadMethodType, n);
                t({
                    Success: !0,
                    UploadMethod: n
                })
            });
            i.bind("FilesAdded", function (n, t) {
                r.onFilesAdding(t);
                return !1
            });
            i.bind("UploadProgress", function (n, t) {
                if (!r.IsRealTimeProgressSupported || r.GridRowInProgress.GetCellValue(r.GridView.columns.Status) != GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading) return !1;
                r.onUploadProgress(r.GridRowInProgress, t.size, t.loaded);
                return !1
            });
            i.bind("ChunkUploaded", function (n, t, i) {
                r.onChunkResponse(i, t);
                return !1
            });
            i.bind("FileUploaded", function (n, t, i) {
                r.onUploadResponse(i.response, t);
                return !1
            })
        };
        i.settings.init = function () {};
        i.ex = {};
        i.ex.sendMultipartParamsAsQuerystring = !0;
        i.ex.startQueue = function () {
            i.state != plupload.STARTED && (i.state = plupload.STARTED, i.trigger("StateChanged"))
        };
        i.ex.stopQueue = function () {
            i.state != plupload.STOPPED && (i.state = plupload.STOPPED, i.trigger("CancelUpload"), i.trigger("StateChanged"), n == GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html4 && i.refresh())
        };
        i.ex.uploadFile = function (n) {
            n.status = plupload.UPLOADING;
            i.trigger("UploadFile", n)
        };
        i.init()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.UnloadUploader = function () {
    if (this.ButtonAdd.disabled = !0, this.ActiveUploader != null) {
        this.onAction({
            action: "Clear"
        });
        this.ActiveUploader.destroy();
        this.ActiveUploader = null
    }
    this.LastUploadMethod = this.ActiveUploadMethod;
    this.ActiveUploadMethod = null
};
GleamTech.JavaScript.UI.FileUploader.prototype.onDropAreaChange = function (n) {
    if (n = n && this.ActiveUploader && this.ActiveUploader.features.dragdrop, n) {
        this.showDropInfo();
        this.ElementDropOverlay.style.top = this.GridView.divElement.offsetTop + this.GridView.divColumns.offsetHeight + "px";
        this.ElementDropOverlay.style.width = this.GridView.divRowsTable.offsetWidth + "px";
        this.ElementDropOverlay.style.height = this.GridView.divRowsTable.offsetHeight + "px";
        var t = this;
        plupload.addEvent(this.GridView.divRowsTable, "dragenter", function () {
            t.ElementDropOverlay.style.display = "block";
            t.GridView.divRowsTable.style.backgroundColor = "#F3F7FD"
        }, "dropInfo");
        plupload.addEvent(this.ElementDropOverlay, "dragleave", function () {
            t.ElementDropOverlay.style.display = "none";
            t.GridView.divRowsTable.style.backgroundColor = ""
        }, "dropInfo");
        plupload.addEvent(this.ElementDropOverlay, "drop", function () {
            t.ElementDropOverlay.style.display = "none";
            t.GridView.divRowsTable.style.backgroundColor = ""
        }, "dropInfo")
    } else plupload.removeEvent(this.GridView.divRowsTable, "dragenter", "dropInfo"), plupload.removeEvent(this.ElementDropOverlay, "dragleave", "dropInfo"), plupload.removeEvent(this.ElementDropOverlay, "drop", "dropInfo"), this.hideDropInfo()
};
GleamTech.JavaScript.UI.FileUploader.prototype.showDropInfo = function () {
    this.ElementDropInfo || this.ActiveUploader && this.ActiveUploader.features.dragdrop && (this.ElementDropInfo = document.createElement("div"), this.ElementDropInfo.className = GleamTech.JavaScript.UI.FileUploaderWarningTextCssClass, this.ElementDropInfo.style.position = "absolute", this.ElementDropInfo.style.width = "100%", this.ElementDropInfo.style.top = "40%", this.ElementDropInfo.style.textAlign = "center", this.ElementDropInfo.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.DragAndDrop"))), this.GridView.divElement.appendChild(this.ElementDropInfo))
};
GleamTech.JavaScript.UI.FileUploader.prototype.hideDropInfo = function () {
    this.ElementDropInfo && (this.GridView.divElement.removeChild(this.ElementDropInfo), this.ElementDropInfo = null)
};
GleamTech.JavaScript.UI.FileUploader.prototype.SetFileTypes = function (n) {
    n = n && GleamTech.JavaScript.Util.Trim(n) != "" ? GleamTech.JavaScript.Util.Trim(n) : "*/";
    var r = n.split("/"),
        t = GleamTech.JavaScript.Util.Trim(r[0]),
        i = "";
    r.length > 1 && (i = GleamTech.JavaScript.Util.Trim(r[1]));
    this.AllowedFilesRegExp = t == "*" ? null : this.createFileTypesRegex(t);
    this.DeniedFilesRegExp = i == "" ? null : this.createFileTypesRegex(i);
    this.Parameters.FileTypes = n;
    this.ActiveFileFilters = this.createFileFilters(t);
    this.AllowedFileTypesText = this.AllowedFilesRegExp == null ? "" : t.split("|").join(", ");
    this.DeniedFileTypesText = this.DeniedFilesRegExp == null ? "" : i.split("|").join(", ")
};
GleamTech.JavaScript.UI.FileUploader.prototype.createFileFilters = function (n) {
    for (var i, r, u = n.split("|"), f = !0, e = [], o = [], t = 0; t < u.length; t++) {
        if (i = GleamTech.JavaScript.Util.Trim(u[t]), r = i.match(/^\*\.([^\*\?]+)$/), r == null) {
            f = !1;
            break
        }
        o.push(i);
        e.push(r[1])
    }
    return f ? [{
        title: this.Language.GetEntry("FileUploader.Label.SpecificFiles", o.join(";")),
        extensions: e.join(",")
    }] : []
};
GleamTech.JavaScript.UI.FileUploader.prototype.createFileTypesRegex = function (n) {
    for (var u, r = n.split("|"), t = "^(", i = 0; i < r.length; i++) u = GleamTech.JavaScript.Util.EscapeRegExpPattern(GleamTech.JavaScript.Util.Trim(r[i])), t += u.replace(/\\\?/g, ".").replace(/\\\*/g, ".*"), i < r.length - 1 && (t += "|");
    return t += ")$", new RegExp(t, "i")
};
GleamTech.JavaScript.UI.FileUploader.prototype.isFileAllowed = function (n) {
    return this.DeniedFilesRegExp && this.DeniedFilesRegExp.test(n) ? !1 : this.AllowedFilesRegExp ? this.AllowedFilesRegExp.test(n) : !0
};
GleamTech.JavaScript.UI.FileUploader.prototype.SetCustomParameters = function (n) {
    this.CustomParameters = n ? n : {}
};
GleamTech.JavaScript.UI.FileUploader.prototype.getFileIconName = function (n) {
    n = n.toUpperCase();
    for (var t in GleamTech.JavaScript.UI.FileUploaderFileIconMappings)
        if (t == n) return GleamTech.JavaScript.UI.FileUploaderFileIconMappings[t];
    return "unknown.png"
};
GleamTech.JavaScript.UI.FileUploader.prototype.onFilesAdding = function (n) {
    var h, r, t, o, i, s, u, f, c, e;
    for (this.GridView.ResetSort(), h = /(iPhone|iPod|iPad)/i.test(navigator.userAgent), r = 0; r < n.length; r++) {
        if (t = n[r], t.status = plupload.QUEUED, !this.isFileAllowed(t.name)) {
            o = this.Language.GetEntry("Message.Error.FileNotAllowed", t.name);
            i = "";
            this.AllowedFileTypesText.length != 0 && (i += "\n" + this.Language.GetEntry("Label.Info.AllowedFileTypes", this.AllowedFileTypesText));
            this.DeniedFileTypesText.length != 0 && (i += "\n" + this.Language.GetEntry("Label.Info.DeniedFileTypes", this.DeniedFileTypesText));
            i.length != 0 && (o += "\n" + i);
            alert(o);
            continue
        }
        for (h && t.name.toLowerCase() == "image.jpg" && (t.name = "image-" + GleamTech.JavaScript.Util.CreateUniqueId() + ".jpg"), s = !1, u = 0; u < this.GridView.rowsArray.length; u++)
            if (this.GridView.rowsArray[u].GetCellValue(this.GridView.columns.Name) == t.name) {
                s = !0;
                break
            }
        if (s) {
            alert(this.Language.GetEntry("FileUploader.Error.FileAlreadyAdded", t.name));
            continue
        }
        this.ActiveUploader.files.push(t);
        t.customId = GleamTech.JavaScript.Util.CreateUniqueId();
        f = GleamTech.JavaScript.Util.GetFileExtension(t.name);
        c = f == "" ? this.Language.GetEntry("Label.File") : this.Language.GetEntry("Label.FileType", GleamTech.JavaScript.Util.TrimStart(f, ".").toUpperCase());
        e = this.GridView.AddRow([t.name, this.IsFileSizeSupported ? t.size : "", c, "", t], this.getFileIconName(GleamTech.JavaScript.Util.TrimStart(f, ".")));
        e.Render();
        this.onUploadStatusChange(e, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Pending);
        this.GridView.ScrollToRow(e);
        this.IsFileSizeSupported && (this.TotalUploadSize += t.size);
        this.onQueueChange()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.checkSessionError = function (n) {
    return n.indexOf("SessionExpired") != -1 || n.indexOf("StateNotFound") != -1 ? (GleamTech.JavaScript.Util.RefreshPage(), !0) : !1
};
GleamTech.JavaScript.UI.FileUploader.prototype.onQueueChange = function () {
    var n = this.GridView.rowsArray.length > 0;
    this.ButtonUpload.disabled = !n;
    this.ElementUploadInfoStats.innerHTML = this.Language.GetEntry("FileManager.Label.Files", "<b>" + this.GridView.rowsArray.length + "<\/b>");
    this.IsFileSizeSupported && n && (this.ElementUploadInfoStats.innerHTML += ", <b>" + GleamTech.JavaScript.Util.FormatFileSize(this.TotalUploadSize) + "<\/b>");
    n ? this.hideDropInfo() : this.showDropInfo()
};
GleamTech.JavaScript.UI.FileUploader.prototype.onGridRowContextMenu = function (n, t) {
    this.IsQueueInProgress ? this.ContextMenus.GridRows.menuItems.Remove.Disable() : this.ContextMenus.GridRows.menuItems.Remove.Enable();
    this.ContextMenus.GridRows.Popup(t, n)
};
GleamTech.JavaScript.UI.FileUploader.prototype.onGridContextMenu = function (n) {
    var t, i;
    if (this.IsQueueInProgress) this.ContextMenus.GridMain.menuItems.Clear.Disable(), this.ContextMenus.GridMain.menuItems.UploadMethod.Disable();
    else if (this.GridView.rowsArray.length == 0) {
        this.ContextMenus.GridMain.menuItems.Clear.Disable();
        this.ContextMenus.GridMain.menuItems.UploadMethod.Enable();
        for (t in this.ContextMenus.GridMain.menuItems.UploadMethod.submenu.menuItems) i = this.ContextMenus.GridMain.menuItems.UploadMethod.submenu.menuItems[t], t == GleamTech.JavaScript.Util.GetPropertyName(GleamTech.JavaScript.UI.FileUploaderUploadMethodType, this.ActiveUploadMethod) ? i.ShowIcon() : i.HideIcon()
    } else this.ContextMenus.GridMain.menuItems.Clear.Enable(), this.ContextMenus.GridMain.menuItems.UploadMethod.Disable();
    this.GridView.UnSelectAllRows();
    this.ContextMenus.GridMain.Popup(n)
};
GleamTech.JavaScript.UI.FileUploader.prototype.BeginQueue = function () {
    for (var t, n = this, u = GleamTech.JavaScript.Util.GetPropertyName(GleamTech.JavaScript.UI.FileUploaderUploadMethodType, this.ActiveUploadMethod), i = {}, r = 0; r < this.GridView.rowsArray.length; r++) t = this.GridView.rowsArray[r].GetCellValue(this.GridView.columns.FileHandle), i[t.customId] = {
        Name: t.name,
        Size: typeof t.size == "number" ? t.size : null
    };
    this.Uploading && this.Uploading(u, i) === !1 || (this.ActiveUploadId = GleamTech.JavaScript.Util.CreateUniqueId(), GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("Begin"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId,
        method: u,
        validations: i,
        customParameters: this.CustomParameters
    }, function (t) {
        var r = {};
        r.gridRowIndex = 0;
        r.fileValidations = t;
        r.skippedItemIds = [],
            function i(t) {
                if (t.gridRowIndex == n.GridView.rowsArray.length) {
                    t.skippedItemIds.length > 0 && n.Skip(t.skippedItemIds);
                    n.ActiveUploader.ex.startQueue();
                    n.UploadNext();
                    return
                }
                t.gridRow = n.GridView.rowsArray[t.gridRowIndex];
                t.gridRowIndex++;
                t.file = t.gridRow.GetCellValue(n.GridView.columns.FileHandle);
                t.fileValidation = t.fileValidations[t.file.customId];
                switch (t.fileValidation.Action) {
                case GleamTech.JavaScript.UI.FileUploaderValidationAction.Accept:
                    i(t);
                    break;
                case GleamTech.JavaScript.UI.FileUploaderValidationAction.Reject:
                    n.onUploadStatusChange(t.gridRow, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Rejected, {
                        message: t.fileValidation.ActionData
                    });
                    i(t);
                    break;
                case GleamTech.JavaScript.UI.FileUploaderValidationAction.ConfirmReplace:
                    var r = function (r, u) {
                        t.sameForAll = u;
                        t.lastSelectedAction = r;
                        switch (r) {
                        case "Replace":
                            i(t);
                            break;
                        case "Skip":
                            t.skippedItemIds.push(t.file.customId);
                            n.onUploadStatusChange(t.gridRow, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Skipped);
                            i(t);
                            break;
                        case "KeepBoth":
                            t.file.name = t.fileValidation.ActionData.NewFileName;
                            t.gridRow.rowElement.title = t.file.name;
                            var f = t.gridRow.rowElement.children[n.GridView.columns.Name.index].firstChild.lastChild;
                            f.innerHTML = t.file.name.length > n.GridView.columnsArray[n.GridView.columns.Name.index].size ? t.file.name.substr(0, n.GridView.columnsArray[n.GridView.columns.Name.index].size) + "..." : t.file.name;
                            t.gridRow.SetCellValue(n.GridView.columns.Name, t.file.name);
                            i(t);
                            break;
                        case "Cancel":
                            n.Cancel()
                        }
                    };
                    if (t.sameForAll) r(t.lastSelectedAction, t.sameForAll);
                    else n.onConfirmReplace(t.file, t.fileValidation, r)
                }
            }(r)
    }, function (t) {
        n.checkSessionError(t.Message) || alert(t.Message)
    }, function () {}))
};
GleamTech.JavaScript.UI.FileUploader.prototype.UploadNext = function () {
    for (var t = [], n = 0; n < this.GridView.rowsArray.length; n++) this.GridView.rowsArray[n].GetCellValue(this.GridView.columns.Status) == GleamTech.JavaScript.UI.FileUploaderUploadStatus.Pending && t.push(this.GridView.rowsArray[n]);
    t.length == 0 ? this.EndQueue() : this.Upload(t[0])
};
GleamTech.JavaScript.UI.FileUploader.prototype.Upload = function (n) {
    var r, u, i, t;
    this.onUploadStatusChange(n, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading);
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileStarted);
    if (this.ItemUploading && (r = n.GetCellValue(this.GridView.columns.Name), u = this.IsFileSizeSupported ? n.GetCellValue(this.GridView.columns.Size) : null, this.ItemUploading(r, u) === !1)) {
        this.onUploadStatusChange(n, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Skipped);
        return
    }
    this.IsQueueInProgress && (i = n.GetCellValue(this.GridView.columns.FileHandle), this.ActiveUploader.settings.url = plupload.buildUrl(this.getActionUrl(this.ActiveUploader.settings.multipart ? "SendMultipart" : "SendStream"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId,
        itemId: i.customId,
        size: typeof i.size == "number" ? i.size : null
    }), this.ActiveUploader.ex.uploadFile(i), t = this, this.IsRealTimeProgressSupported ? this.TotalProcessedCount == 0 && function e() {
        setTimeout(function () {
            GleamTech.JavaScript.Util.RequestJson(t.getActionUrl("KeepSessionAlive"), null, function () {
                t.IsQueueInProgress && e()
            }, function () {}, function () {})
        }, 3e4)
    }() : function f(r, u) {
        setTimeout(function () {
            GleamTech.JavaScript.Util.RequestJson(t.getActionUrl("GetProgress"), {
                stateId: t.Parameters.StateId,
                uploadId: t.ActiveUploadId,
                itemId: i.customId,
                first: u
            }, function (i) {
                if (i != null && n.GetCellValue(t.GridView.columns.Status) == GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading) {
                    var r = i[0],
                        u = i[1];
                    t.onFileSizeDetermined(n, r);
                    t.onUploadProgress(n, r, u);
                    f(1e3, !1)
                }
            }, function () {}, function () {})
        }, r)
    }(0, !0))
};
GleamTech.JavaScript.UI.FileUploader.prototype.onFileSizeDetermined = function (n, t) {
    if (n.GetCellValue(this.GridView.columns.Size) == "") {
        n.SetCellValue(this.GridView.columns.Size, t);
        var i = n.rowElement.children[this.GridView.columns.Size.index].firstChild;
        i.firstChild.nodeValue = GleamTech.JavaScript.Util.FormatFileSize(t);
        this.GridView.rowsArray.length - this.TotalProcessedCount == 1 && (this.TotalUploadSize = this.TotalProcessedSize + t)
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onUploadProgress = function (n, t, i) {
    var r = t > 0 ? i / t * 100 : 0;
    this.onUploadStatusChange(n, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading, {
        uploadedPercentage: r
    });
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileProcessing, i)
};
GleamTech.JavaScript.UI.FileUploader.prototype.onChunkResponse = function (n, t) {
    var i, r;
    if (n.chunk != n.chunks - 1) {
        i = null;
        try {
            i = JSON.parse(n.response)
        } catch (u) {}
        if (i == null) {
            this.onUploadClientError({
                message: "Chunk unexpectedly failed.",
                file: t
            });
            return
        }
        if (!i.Success && !this.checkSessionError(i.Result.Message) && i.Result.Message.indexOf("UploadCanceled") == -1) {
            this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Failed, {
                message: i.Result.Message
            });
            this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted);
            t.status = plupload.FAILED;
            n.cancelled = !0;
            r = this;
            setTimeout(function () {
                r.UploadNext()
            }, 0)
        }
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onUploadResponse = function (n, t) {
    var i, u, e, r, o, f, s;
    if (this.GridRowInProgress.GetCellValue(this.GridView.columns.Status) != GleamTech.JavaScript.UI.FileUploaderUploadStatus.Canceled) {
        i = null;
        try {
            i = JSON.parse(n)
        } catch (h) {}
        if (i == null) {
            for (n = n.replace(/(?:\r\n|\r)+/g, "\n"), n = n.replace(/<!--[\s\S]*?-->/g, ""), u = n.split("\n"), e = n, r = 0; r < u.length; r++)
                if (GleamTech.JavaScript.Util.Trim(u[r]) != "") {
                    e = u[r];
                    break
                }
            this.onUploadClientError({
                code: plupload.HTTP_ERROR,
                message: "HTTP Error.",
                details: e,
                file: t
            });
            return
        }
        if (i.Success) {
            o = this.GridRowInProgress.GetCellValue(this.GridView.columns.Name);
            f = i.Result != null ? i.Result : this.GridRowInProgress.GetCellValue(this.GridView.columns.Size);
            this.onFileSizeDetermined(this.GridRowInProgress, f);
            this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Completed);
            this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted, f);
            this.ItemUploaded && this.ItemUploaded(o, f)
        } else if (!this.checkSessionError(i.Result.Message) && i.Result.Message.indexOf("UploadCanceled") == -1) {
            this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Failed, {
                message: i.Result.Message
            });
            this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted)
        }
        s = this;
        setTimeout(function () {
            s.UploadNext()
        }, 0)
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onUploadClientError = function (n) {
    var t = n.message + "\n",
        i;
    n.details && (t += "\nDetails: " + n.details);
    n.status && (t += "\nStatus: " + n.status);
    n.file && (t += "\nFile: " + n.file.name, typeof n.file.size == "number" && (t += " (" + GleamTech.JavaScript.Util.FormatFileSize(n.file.size) + ")"));
    this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Failed, {
        message: t
    });
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted);
    GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("Fail"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId,
        itemId: n.file.customId,
        clientError: t
    }, function () {}, function () {}, function () {});
    i = this;
    setTimeout(function () {
        i.UploadNext()
    }, 0)
};
GleamTech.JavaScript.UI.FileUploader.prototype.Skip = function (n) {
    var t = this;
    GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("Skip"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId,
        itemIds: n
    }, function () {}, function () {}, function () {})
};
GleamTech.JavaScript.UI.FileUploader.prototype.Cancel = function () {
    var t = this,
        n, i;
    GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("Cancel"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId
    }, function () {
        t.ActiveUploader.ex.stopQueue()
    }, function () {
        t.ActiveUploader.ex.stopQueue()
    }, function () {
        t.ActiveUploader.ex.stopQueue()
    });
    this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Canceled);
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Stopped);
    for (n = 0; n < this.GridView.rowsArray.length; n++)
        if (this.GridView.rowsArray[n].GetCellValue(this.GridView.columns.Status) == GleamTech.JavaScript.UI.FileUploaderUploadStatus.Pending) {
            i = this.GridView.rowsArray[n];
            this.onUploadStatusChange(i, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Canceled)
        }
    this.EndQueue(!0)
};
GleamTech.JavaScript.UI.FileUploader.prototype.EndQueue = function (n) {
    var t = this;
    GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("End"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId
    }, function () {
        if (!n) {
            t.ActiveUploader.ex.stopQueue();
            t.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Processed)
        }
        t.Uploaded && t.Uploaded()
    }, function (n) {
        t.ActiveUploader.ex.stopQueue();
        t.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Stopped);
        t.checkSessionError(n.Message) || alert(n.Message)
    }, function () {
        t.ActiveUploader.ex.stopQueue();
        t.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Stopped)
    })
};
GleamTech.JavaScript.UI.FileUploader.prototype.showQueueAddingPane = function () {
    if (!this.ElementQueueAddingVisible) {
        this.hideQueueProcessingPane();
        this.hideQueueNewPane();
        this.onDropAreaChange(!0);
        this.ElementQueueAdding.style.visibility = "visible";
        this.ElementFooter.style.height = this.ElementQueueAdding.offsetHeight + "px";
        this.resize();
        this.ElementQueueAddingVisible = !0
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.hideQueueAddingPane = function () {
    if (this.ElementQueueAddingVisible) {
        this.onDropAreaChange(!1);
        this.ElementQueueAdding.style.visibility = "hidden";
        this.ElementQueueAddingVisible = !1
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.showQueueProcessingPane = function () {
    var n, t, r, i;
    this.ElementQueueProcessing || (this.hideQueueAddingPane(), this.ElementQueueProcessing = document.createElement("div"), this.ElementQueueProcessing.id = this.Parameters.ElementId + "-queueProcessing", this.ElementQueueProcessing.style.position = "absolute", this.ElementQueueProcessing.style.left = "0px", this.ElementQueueProcessing.style.top = "0px", this.ElementQueueProcessing.style.width = this.ElementFooter.offsetWidth - 12 + "px", this.ElementQueueProcessing.style.paddingTop = "10px", this.ElementQueueProcessing.style.paddingLeft = "6px", this.ElementQueueProcessing.style.paddingBottom = "10px", this.ElementQueueProcessing.style.paddingRight = "6px", this.ElementFooter.appendChild(this.ElementQueueProcessing), n = document.createElement("div"), this.ElementQueueProcessing.appendChild(n), n.style.cssFloat = "left", n.style.styleFloat = "left", n.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.TimeRemaining"))), n.appendChild(document.createElement("br")), n.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.FilesRemaining"))), n.appendChild(document.createElement("br")), n.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.Speed"))), n.appendChild(document.createElement("br")), n = document.createElement("div"), this.ElementQueueProcessing.appendChild(n), n.style.cssFloat = "left", n.style.styleFloat = "left", n.style.marginLeft = "5px", this.ElementTimeRemaining = document.createElement("span"), n.appendChild(this.ElementTimeRemaining), n.appendChild(document.createElement("br")), this.ElementFilesRemaining = document.createElement("span"), n.appendChild(this.ElementFilesRemaining), n.appendChild(document.createElement("br")), this.ElementSpeed = document.createElement("span"), n.appendChild(this.ElementSpeed), t = this.ElementQueueProcessing.offsetWidth - 120, t > 353 && (t = 353), this.QueuePogressBar = new GleamTech.JavaScript.UI.ProgressBar(this.ElementQueueProcessing, t, !0), this.QueuePogressBar.ElementControl.style.cssFloat = "left", this.QueuePogressBar.ElementControl.style.styleFloat = "left", this.QueuePogressBar.ElementControl.style.clear = "left", this.ButtonCancel = document.createElement("input"), this.ButtonCancel.type = "button", this.ButtonCancel.value = this.Language.GetEntry("Label.Cancel"), this.ButtonCancel.style.width = "80px", this.ButtonCancel.style.position = "absolute", this.ButtonCancel.style.right = "6px", this.ButtonCancel.style.bottom = "10px", this.ElementQueueProcessing.appendChild(this.ButtonCancel), r = this, GleamTech.JavaScript.Util.AddEvent(this.ButtonCancel, "click", function () {
        r.Cancel()
    }), i = (this.ButtonCancel.offsetHeight - this.QueuePogressBar.ElementControl.offsetHeight) / 2, this.QueuePogressBar.ElementControl.style.marginTop = 10 - i + "px", this.QueuePogressBar.ElementControl.style.marginBottom = i + "px", this.ElementFooter.style.height = this.ElementQueueProcessing.offsetHeight + "px", this.resize())
};
GleamTech.JavaScript.UI.FileUploader.prototype.hideQueueProcessingPane = function () {
    this.ElementQueueProcessing && (this.ElementFooter.removeChild(this.ElementQueueProcessing), this.ElementQueueProcessing = null)
};
GleamTech.JavaScript.UI.FileUploader.prototype.showQueueNewPane = function () {
    if (!this.ElementQueueNew) {
        this.hideQueueAddingPane();
        this.hideQueueProcessingPane();
        this.ElementQueueNew = document.createElement("div");
        this.ElementQueueNew.id = this.Parameters.ElementId + "-queueNew";
        this.ElementQueueNew.style.position = "absolute";
        this.ElementQueueNew.style.left = "0px";
        this.ElementQueueNew.style.top = "0px";
        this.ElementQueueNew.style.width = this.ElementFooter.offsetWidth - 12 + "px";
        this.ElementQueueNew.style.paddingTop = "10px";
        this.ElementQueueNew.style.paddingLeft = "6px";
        this.ElementQueueNew.style.paddingBottom = "10px";
        this.ElementQueueNew.style.paddingRight = "6px";
        this.ElementFooter.appendChild(this.ElementQueueNew);
        this.ButtonNewUpload = document.createElement("input");
        this.ButtonNewUpload.type = "button";
        this.ButtonNewUpload.value = this.Language.GetEntry("FileUploader.Action.NewUpload");
        this.ButtonNewUpload.style.width = "120px";
        this.ElementQueueNew.appendChild(this.ButtonNewUpload);
        var n = this;
        GleamTech.JavaScript.Util.AddEvent(this.ButtonNewUpload, "click", function () {
            n.onAction({
                action: "Clear"
            });
            n.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Adding)
        });
        this.ButtonClose2 = document.createElement("input");
        this.ButtonClose2.type = "button";
        this.ButtonClose2.value = this.Language.GetEntry("FileUploader.Action.Close");
        this.ButtonClose2.style.width = "80px";
        this.ButtonClose2.style.position = "absolute";
        this.ButtonClose2.style.right = "6px";
        this.ElementQueueNew.appendChild(this.ButtonClose2);
        GleamTech.JavaScript.Util.AddEvent(this.ButtonClose2, "click", function () {
            n.Hide()
        });
        this.ElementFooter.style.height = this.ElementQueueNew.offsetHeight + "px";
        this.resize()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.hideQueueNewPane = function () {
    this.ElementQueueNew && (this.ElementQueueAdding.appendChild(this.ButtonClose), this.ElementFooter.removeChild(this.ElementQueueNew), this.ElementQueueNew = null)
};
GleamTech.JavaScript.UI.FileUploader.prototype.updateOverallProgress = function (n, t, i, r, u) {
    n != null && (this.ElementTimeRemaining.innerHTML = n);
    t != null && (this.ElementFilesRemaining.innerHTML = i != null ? t + " (" + GleamTech.JavaScript.Util.FormatFileSize(i) + ")" : t);
    r != null && (this.ElementSpeed.innerHTML = r);
    u != null && this.QueuePogressBar.SetPercentage(u)
};
GleamTech.JavaScript.UI.FileUploader.prototype.onOverallStatusChange = function (n, t) {
    var c, e;
    switch (n) {
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.Adding:
        this.IsQueueInProgress = !1;
        this.TotalUploadSize = 0;
        this.TotalProcessedSize = 0;
        this.TotalProcessedCount = 0;
        this.onQueueChange();
        this.showQueueAddingPane();
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileStarted:
        this.IsQueueInProgress = !0;
        this.TotalProcessedCount == 0 && (this.QueueStartTime = (new Date).getTime(), this.showQueueProcessingPane(), this.updateOverallProgress(this.Language.GetEntry("FileUploader.Label.Calculating"), this.GridView.rowsArray.length, this.TotalUploadSize > 0 ? this.TotalUploadSize : null, this.Language.GetEntry("FileUploader.Label.Calculating"), 1));
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileProcessing:
        this.IsQueueInProgress = !0;
        var o = this.TotalProcessedSize + t,
            s = ((new Date).getTime() - this.QueueStartTime) / 1e3,
            r = s > 0 ? parseInt(o / s) : 0,
            u = r > 0 ? Math.round(this.TotalUploadSize / r - s) : 0,
            l = null;
        if (u > 0) {
            var a = parseInt(u / 3600),
                f = parseInt(u / 60) % 60,
                h = u % 60,
                i;
            a > 0 ? (i = this.Language.GetEntry("FileUploader.Label.TimeEstimateHours", a), f > 0 && (i += " " + this.Language.GetEntry("FileUploader.Label.TimeEstimateMinutes", f))) : f > 0 ? (i = this.Language.GetEntry("FileUploader.Label.TimeEstimateMinutes", f), h > 0 && (i += " " + this.Language.GetEntry("FileUploader.Label.TimeEstimateSeconds", h))) : i = this.Language.GetEntry("FileUploader.Label.TimeEstimateSeconds", h);
            l = this.Language.GetEntry("FileUploader.Label.TimeEstimate", i)
        }
        var y = this.GridView.rowsArray.length - this.TotalProcessedCount,
            v = this.TotalUploadSize - o,
            p = v > 0 ? v : null,
            w = r > 0 ? this.Language.GetEntry("FileUploader.Label.SpeedEstimate", GleamTech.JavaScript.Util.FormatFileSize(r)) : null,
            b = this.TotalUploadSize > 0 ? o / this.TotalUploadSize * 100 : this.TotalProcessedCount / this.GridView.rowsArray.length * 100;
        this.updateOverallProgress(l, y, p, w, b);
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted:
        if (this.IsQueueInProgress = !0, this.TotalProcessedCount++, t) {
            this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileProcessing, t);
            this.TotalProcessedSize += t
        }
        this.TotalProcessedCount == this.GridView.rowsArray.length && this.updateOverallProgress("-", "-", null, "-", null);
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.Stopped:
        this.IsQueueInProgress = !1;
        this.showQueueNewPane();
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.Processed:
        for (this.IsQueueInProgress = !1, this.showQueueNewPane(), c = !0, e = 0; e < this.GridView.rowsArray.length; e++)
            if (this.GridView.rowsArray[e].GetCellValue(this.GridView.columns.Status) != GleamTech.JavaScript.UI.FileUploaderUploadStatus.Completed) {
                c = !1;
                break
            }
        c && this.Hide()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onUploadStatusChange = function (n, t, i) {
    if (n) {
        n.SetCellValue(this.GridView.columns.Status, t);
        var r = n.rowElement.children[this.GridView.columns.Status.index].firstChild;
        switch (t) {
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Pending:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Pending");
            r.style.color = "gray";
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Rejected:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Rejected");
            r.style.color = "red";
            this.onStatusDetailsAvailable(r, i.message);
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Skipped:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Skipped");
            r.style.color = "navy";
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading:
            this.GridRowInProgress = n;
            this.GridView.ScrollToRow(n);
            r.progressBar ? r.progressBar.SetPercentage(i.uploadedPercentage) : (r.innerHTML = "", r.progressBar = new GleamTech.JavaScript.UI.ProgressBar(r, 60, !0), r.progressBar.SetPercentage(1));
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Canceled:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Canceled");
            r.style.color = "orange";
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Failed:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Failed");
            r.style.color = "red";
            this.onStatusDetailsAvailable(r, i.message);
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Completed:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Completed");
            r.style.color = "green"
        }
        this.GridView.Resize()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onConfirmReplace = function (n, t, i) {
    var u = this,
        c, r, h, s, e, l, a, f, o;
    this.ConfirmReplaceElement || (this.ConfirmReplaceElement = document.createElement("div"), this.ConfirmReplaceElement.style.display = "none", this.ConfirmReplaceElement.style.padding = "8px", c = new Image, c.src = this.getResourceUrl("images/icons16/action.png"), r = new GleamTech.JavaScript.UI.ToolBar, r.SetButtonSize(450, 60, !0), r.onButtonClick = function (n) {
        u.ConfirmReplaceDialog.selectedAction = n.action;
        u.ModalDialog.Close(u.ConfirmReplaceDialog)
    }, r.AddButton("Replace", "", null), r.AddButton("Skip", "", null), r.AddButton("KeepBoth", "", null), r.Render(this.Parameters.ElementId + "-confirmReplace-toolbar", this.ConfirmReplaceElement), r.divElement.style.borderTopWidth = "0px", r.divElement.style.borderLeftWidth = "0px", r.divElement.style.borderRightWidth = "0px", r.divElement.style.paddingBottom = "8px", r.divElement.style.marginBottom = "8px", this.ConfirmReplaceElement.toolbar = r, r.divElement.insertBefore(document.createTextNode(this.Language.GetEntry("FileUploader.Label.UploadConflictDescription")), r.divElement.firstChild), r.items[0].divElement.style.marginTop = "6px", h = function (n, t, i) {
        var u, e, f, o;
        r.items[n].divElement.style.textAlign = "left";
        u = new Image;
        u.src = c.src;
        u.style.width = "16px";
        u.style.height = "16px";
        u.style.verticalAlign = "text-top";
        u.style.marginRight = "6px";
        r.items[n].divElement.appendChild(u);
        e = document.createElement("span");
        e.className = "gt-infoPaneTitle";
        e.appendChild(document.createTextNode(t));
        r.items[n].divElement.appendChild(e);
        r.items[n].divElement.appendChild(document.createElement("br"));
        f = document.createElement("div");
        f.style.marginLeft = "22px";
        f.appendChild(document.createTextNode(i));
        f.appendChild(document.createElement("br"));
        o = document.createElement("span");
        r.items[n].spanPlaceholder = o;
        f.appendChild(o);
        r.items[n].divElement.appendChild(f)
    }, h(0, this.Language.GetEntry("FileUploader.Label.UploadAndReplace"), this.Language.GetEntry("FileUploader.Label.UploadAndReplaceDescription")), h(1, this.Language.GetEntry("FileUploader.Label.DoNotUpload"), this.Language.GetEntry("FileUploader.Label.DoNotUploadDescription")), h(2, this.Language.GetEntry("FileUploader.Label.UploadButKeepBoth"), this.Language.GetEntry("FileUploader.Label.UploadButKeepBothDescription")), s = document.createElement("div"), s.style.cssFloat = "left", s.style.styleFloat = "left", this.ConfirmReplaceElement.appendChild(s), e = document.createElement("input"), e.id = this.Parameters.ElementId + "-confirmReplace-checkbox", e.type = "checkbox", s.appendChild(e), GleamTech.JavaScript.Util.AddEvent(e, "click", function () {
        u.ConfirmReplaceDialog.sameForAll = e.checked
    }), this.ConfirmReplaceElement.checkBoxSameForAll = e, l = document.createElement("div"), l.innerHTML = '<label for="' + e.id + '">' + this.Language.GetEntry("FileUploader.Label.SameForAllConflicts") + "<\/label>", a = l.firstChild, s.appendChild(a), f = document.createElement("input"), f.type = "button", f.value = this.Language.GetEntry("Label.Cancel"), f.style.width = "80px", f.style.cssFloat = "right", f.style.styleFloat = "right", this.ConfirmReplaceElement.appendChild(f), this.ConfirmReplaceElement.cancelButtonElement = f, GleamTech.JavaScript.Util.AddEvent(f, "click", function () {
        u.ModalDialog.Close(u.ConfirmReplaceDialog)
    }), this.ElementControl.appendChild(this.ConfirmReplaceElement));
    o = function (n, t, i, r) {
        var f = "";
        t && (f += "<b>" + t + "<\/b>", typeof i == "number" && (f += " (" + GleamTech.JavaScript.Util.FormatFileSize(i), r && (f += ", " + r), f += ")"));
        u.ConfirmReplaceElement.toolbar.items[n].spanPlaceholder.innerHTML = f
    };
    this.ConfirmReplaceDialog = this.ModalDialog.ShowElement(this.ConfirmReplaceElement, this.Language.GetEntry("FileUploader.Label.UploadConflict"), function () {
        o(0, n.name, n.size);
        o(1, t.ActionData.ExistingfileName, t.ActionData.ExistingFileSize, t.ActionData.ExistingFileDate);
        o(2, t.ActionData.NewFileName);
        u.ConfirmReplaceElement.style.display = "block";
        u.ConfirmReplaceElement.style.width = u.ConfirmReplaceElement.toolbar.divElement.offsetWidth + "px";
        u.ConfirmReplaceElement.style.height = u.ConfirmReplaceElement.toolbar.divElement.offsetHeight + u.ConfirmReplaceElement.cancelButtonElement.offsetHeight + 8 + "px"
    });
    this.ConfirmReplaceDialog.selectedAction = "Cancel";
    this.ConfirmReplaceDialog.sameForAll = !1;
    this.ConfirmReplaceDialog.onClosed = function () {
        o(0, "");
        o(1, "");
        o(2, "");
        u.ConfirmReplaceElement.checkBoxSameForAll.checked = !1;
        u.ConfirmReplaceElement.style.display = "none";
        u.ElementControl.appendChild(u.ConfirmReplaceElement);
        setTimeout(function () {
            i(u.ConfirmReplaceDialog.selectedAction, u.ConfirmReplaceDialog.sameForAll)
        }, 0)
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onStatusDetailsAvailable = function (n, t) {
    var i = this;
    GleamTech.JavaScript.Util.AddEvent(n, "click", function () {
        i.onShowStatusDetails(t)
    });
    n.style.textDecoration = "underline";
    n.style.cursor = "pointer";
    n.title = this.Language.GetEntry("FileUploader.Label.ViewStatusReason")
};
GleamTech.JavaScript.UI.FileUploader.prototype.onShowStatusDetails = function (n) {
    var t = this,
        r, i;
    this.StatusDetailsElement || (this.StatusDetailsElement = document.createElement("div"), this.StatusDetailsElement.style.display = "none", this.StatusDetailsElement.style.padding = "8px", r = document.createElement("textarea"), r.style.width = "300px", r.style.height = "150px", r.style.resize = "none", r.readOnly = !0, this.StatusDetailsElement.appendChild(r), this.StatusDetailsElement.textareaElement = r, i = document.createElement("input"), i.type = "button", i.value = this.Language.GetEntry("FileUploader.Action.Close"), i.style.width = "80px", i.style.marginTop = "8px", i.style.cssFloat = "right", i.style.styleFloat = "right", this.StatusDetailsElement.appendChild(i), this.StatusDetailsElement.closeButtonElement = i, GleamTech.JavaScript.Util.AddEvent(i, "click", function () {
        t.ModalDialog.Close(t.StatusDetailsDialog)
    }), this.ElementControl.appendChild(this.StatusDetailsElement));
    this.StatusDetailsDialog = this.ModalDialog.ShowElement(this.StatusDetailsElement, this.Language.GetEntry("FileUploader.Label.StatusReason"), function () {
        t.StatusDetailsElement.textareaElement.value = n;
        t.StatusDetailsElement.style.display = "block";
        t.StatusDetailsElement.style.width = t.StatusDetailsElement.textareaElement.offsetWidth + "px";
        t.StatusDetailsElement.style.height = t.StatusDetailsElement.textareaElement.offsetHeight + t.StatusDetailsElement.closeButtonElement.offsetHeight + 8 + "px"
    });
    this.StatusDetailsDialog.onClosed = function () {
        t.StatusDetailsElement.firstChild.value = "";
        t.StatusDetailsElement.style.display = "none";
        t.ElementControl.appendChild(t.StatusDetailsElement)
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onAction = function (n) {
    var t, i, r;
    switch (n.action) {
    case "SelectAll":
        this.GridView.SelectAllRows();
        break;
    case "InvertSelection":
        this.GridView.InvertSelectedRows();
        break;
    case "Remove":
        for (t = 0; t < this.GridView.selectedRowsArray.length; t++) i = this.GridView.selectedRowsArray[t], this.ActiveUploader.removeFile(i.GetCellValue(this.GridView.columns.FileHandle)), this.IsFileSizeSupported && (r = i.GetCellValue(this.GridView.columns.Size), this.TotalUploadSize -= r), this.GridView.RemoveRow(i), t--;
        this.onQueueChange();
        break;
    case "Clear":
        this.ActiveUploader.splice();
        this.GridView.RemoveAllRows();
        this.TotalUploadSize = 0;
        this.onQueueChange();
        break;
    case "Html4":
        this.LoadUploader(GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html4, function (n) {
            n.Success || alert("Can not set upload method to Html4!")
        });
        break;
    case "Flash":
        this.LoadUploader(GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Flash, function (n) {
            n.Success || alert("Can not set upload method to Flash!")
        });
        break;
    case "Silverlight":
        this.LoadUploader(GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Silverlight, function (n) {
            n.Success || alert("Can not set upload method to Silverlight!")
        });
        break;
    case "Html5":
        this.LoadUploader(GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html5, function (n) {
            n.Success || alert("Can not set upload method to Html5!")
        })
    }
};
GleamTech.JavaScript.UI.FileUploaderContextMenusData = {
    "ContextMenus": {
        "ContextMenu": [{
            "Item": [{
                "action": "Remove",
                "text": "FileUploader.Action.Remove"
            }, {
                "action": "[Separator]"
            }, {
                "action": "InvertSelection",
                "text": "Label.InvertSelection"
            }],
            "Name": "GridRows"
        }, {
            "Item": [{
                "action": "Clear",
                "text": "FileUploader.Action.Clear"
            }, {
                "action": "[Separator]"
            }, {
                "action": "SelectAll",
                "text": "Label.SelectAll"
            }, {
                "action": "[Separator]"
            }, {
                "action": "UploadMethod",
                "ContextMenu": {
                    "Item": [{
                        "action": "Html4",
                        "icon": "active.png"
                    }, {
                        "action": "Flash",
                        "icon": "active.png"
                    }, {
                        "action": "Silverlight",
                        "icon": "active.png"
                    }, {
                        "action": "Html5",
                        "icon": "active.png"
                    }]
                },
                "text": "FileUploader.Action.UploadMethod"
            }],
            "Name": "GridMain"
        }]
    }
};
GleamTech.FileUltimate.FileIconManager.baseFileIcons = {
    "file": {
        "16": "basefileicons16 icon-file",
        "32": "basefileicons32 icon-file",
        "48": "basefileicons48 icon-file",
        "96": "basefileicons96-icon-file",
        "256": "basefileicons256-icon-file"
    },
    "folder": {
        "16": "basefileicons16 icon-folder",
        "32": "basefileicons32 icon-folder",
        "48": "basefileicons48 icon-folder",
        "96": "basefileicons96-icon-folder",
        "256": "basefileicons256-icon-folder"
    },
    "rootfolder": {
        "16": "basefileicons16 icon-rootfolder",
        "32": "basefileicons32 icon-rootfolder",
        "48": "basefileicons48 icon-rootfolder",
        "96": "basefileicons96-icon-rootfolder",
        "256": "basefileicons256-icon-rootfolder"
    }
};
GleamTech.FileUltimate.FileIconManager.fileIcons = {
    "7z": {
        "16": "fileicons-archive16 icon-7z",
        "32": "fileicons-archive32 icon-7z",
        "48": "fileicons-archive48 icon-7z",
        "96": "fileicons-archive96-icon-7z",
        "256": "fileicons-archive256-icon-7z"
    },
    "dmg": {
        "16": "fileicons-archive16 icon-dmg",
        "32": "fileicons-archive32 icon-dmg",
        "48": "fileicons-archive48 icon-dmg",
        "96": "fileicons-archive96-icon-dmg",
        "256": "fileicons-archive256-icon-dmg"
    },
    "iso": {
        "16": "fileicons-archive16 icon-iso",
        "32": "fileicons-archive32 icon-iso",
        "48": "fileicons-archive48 icon-iso",
        "96": "fileicons-archive96-icon-iso",
        "256": "fileicons-archive256-icon-iso"
    },
    "jar": {
        "16": "fileicons-archive16 icon-jar",
        "32": "fileicons-archive32 icon-jar",
        "48": "fileicons-archive48 icon-jar",
        "96": "fileicons-archive96-icon-jar",
        "256": "fileicons-archive256-icon-jar"
    },
    "pkg": {
        "16": "fileicons-archive16 icon-pkg",
        "32": "fileicons-archive32 icon-pkg",
        "48": "fileicons-archive48 icon-pkg",
        "96": "fileicons-archive96-icon-pkg",
        "256": "fileicons-archive256-icon-pkg"
    },
    "rar": {
        "16": "fileicons-archive16 icon-rar",
        "32": "fileicons-archive32 icon-rar",
        "48": "fileicons-archive48 icon-rar",
        "96": "fileicons-archive96-icon-rar",
        "256": "fileicons-archive256-icon-rar"
    },
    "sitx": {
        "16": "fileicons-archive16 icon-sitx",
        "32": "fileicons-archive32 icon-sitx",
        "48": "fileicons-archive48 icon-sitx",
        "96": "fileicons-archive96-icon-sitx",
        "256": "fileicons-archive256-icon-sitx"
    },
    "zip": {
        "16": "fileicons-archive16 icon-zip",
        "32": "fileicons-archive32 icon-zip",
        "48": "fileicons-archive48 icon-zip",
        "96": "fileicons-archive96-icon-zip",
        "256": "fileicons-archive256-icon-zip"
    },
    "bz2": {
        "16": "fileicons-archive16 icon-bz2",
        "32": "fileicons-archive32 icon-bz2",
        "48": "fileicons-archive48 icon-bz2",
        "96": "fileicons-archive96-icon-bz2",
        "256": "fileicons-archive256-icon-bz2"
    },
    "gz": {
        "16": "fileicons-archive16 icon-gz",
        "32": "fileicons-archive32 icon-gz",
        "48": "fileicons-archive48 icon-gz",
        "96": "fileicons-archive96-icon-gz",
        "256": "fileicons-archive256-icon-gz"
    },
    "tar": {
        "16": "fileicons-archive16 icon-tar",
        "32": "fileicons-archive32 icon-tar",
        "48": "fileicons-archive48 icon-tar",
        "96": "fileicons-archive96-icon-tar",
        "256": "fileicons-archive256-icon-tar"
    },
    "aif": {
        "16": "fileicons-audio16 icon-aif",
        "32": "fileicons-audio32 icon-aif",
        "48": "fileicons-audio48 icon-aif",
        "96": "fileicons-audio96-icon-aif",
        "256": "fileicons-audio256-icon-aif"
    },
    "m4a": {
        "16": "fileicons-audio16 icon-m4a",
        "32": "fileicons-audio32 icon-m4a",
        "48": "fileicons-audio48 icon-m4a",
        "96": "fileicons-audio96-icon-m4a",
        "256": "fileicons-audio256-icon-m4a"
    },
    "mp3": {
        "16": "fileicons-audio16 icon-mp3",
        "32": "fileicons-audio32 icon-mp3",
        "48": "fileicons-audio48 icon-mp3",
        "96": "fileicons-audio96-icon-mp3",
        "256": "fileicons-audio256-icon-mp3"
    },
    "wav": {
        "16": "fileicons-audio16 icon-wav",
        "32": "fileicons-audio32 icon-wav",
        "48": "fileicons-audio48 icon-wav",
        "96": "fileicons-audio96-icon-wav",
        "256": "fileicons-audio256-icon-wav"
    },
    "wma": {
        "16": "fileicons-audio16 icon-wma",
        "32": "fileicons-audio32 icon-wma",
        "48": "fileicons-audio48 icon-wma",
        "96": "fileicons-audio96-icon-wma",
        "256": "fileicons-audio256-icon-wma"
    },
    "3ds": {
        "16": "fileicons-creative16 icon-3ds",
        "32": "fileicons-creative32 icon-3ds",
        "48": "fileicons-creative48 icon-3ds",
        "96": "fileicons-creative96-icon-3ds",
        "256": "fileicons-creative256-icon-3ds"
    },
    "ai": {
        "16": "fileicons-creative16 icon-ai",
        "32": "fileicons-creative32 icon-ai",
        "48": "fileicons-creative48 icon-ai",
        "96": "fileicons-creative96-icon-ai",
        "256": "fileicons-creative256-icon-ai"
    },
    "as": {
        "16": "fileicons-creative16 icon-as",
        "32": "fileicons-creative32 icon-as",
        "48": "fileicons-creative48 icon-as",
        "96": "fileicons-creative96-icon-as",
        "256": "fileicons-creative256-icon-as"
    },
    "cdr": {
        "16": "fileicons-creative16 icon-cdr",
        "32": "fileicons-creative32 icon-cdr",
        "48": "fileicons-creative48 icon-cdr",
        "96": "fileicons-creative96-icon-cdr",
        "256": "fileicons-creative256-icon-cdr"
    },
    "dwg": {
        "16": "fileicons-creative16 icon-dwg",
        "32": "fileicons-creative32 icon-dwg",
        "48": "fileicons-creative48 icon-dwg",
        "96": "fileicons-creative96-icon-dwg",
        "256": "fileicons-creative256-icon-dwg"
    },
    "dxf": {
        "16": "fileicons-creative16 icon-dxf",
        "32": "fileicons-creative32 icon-dxf",
        "48": "fileicons-creative48 icon-dxf",
        "96": "fileicons-creative96-icon-dxf",
        "256": "fileicons-creative256-icon-dxf"
    },
    "eps": {
        "16": "fileicons-creative16 icon-eps",
        "32": "fileicons-creative32 icon-eps",
        "48": "fileicons-creative48 icon-eps",
        "96": "fileicons-creative96-icon-eps",
        "256": "fileicons-creative256-icon-eps"
    },
    "fla": {
        "16": "fileicons-creative16 icon-fla",
        "32": "fileicons-creative32 icon-fla",
        "48": "fileicons-creative48 icon-fla",
        "96": "fileicons-creative96-icon-fla",
        "256": "fileicons-creative256-icon-fla"
    },
    "indd": {
        "16": "fileicons-creative16 icon-indd",
        "32": "fileicons-creative32 icon-indd",
        "48": "fileicons-creative48 icon-indd",
        "96": "fileicons-creative96-icon-indd",
        "256": "fileicons-creative256-icon-indd"
    },
    "prproj": {
        "16": "fileicons-creative16 icon-prproj",
        "32": "fileicons-creative32 icon-prproj",
        "48": "fileicons-creative48 icon-prproj",
        "96": "fileicons-creative96-icon-prproj",
        "256": "fileicons-creative256-icon-prproj"
    },
    "psd": {
        "16": "fileicons-creative16 icon-psd",
        "32": "fileicons-creative32 icon-psd",
        "48": "fileicons-creative48 icon-psd",
        "96": "fileicons-creative96-icon-psd",
        "256": "fileicons-creative256-icon-psd"
    },
    "pspimage": {
        "16": "fileicons-creative16 icon-pspimage",
        "32": "fileicons-creative32 icon-pspimage",
        "48": "fileicons-creative48 icon-pspimage",
        "96": "fileicons-creative96-icon-pspimage",
        "256": "fileicons-creative256-icon-pspimage"
    },
    "c": {
        "16": "fileicons-developer16 icon-c",
        "32": "fileicons-developer32 icon-c",
        "48": "fileicons-developer48 icon-c",
        "96": "fileicons-developer96-icon-c",
        "256": "fileicons-developer256-icon-c"
    },
    "cpp": {
        "16": "fileicons-developer16 icon-cpp",
        "32": "fileicons-developer32 icon-cpp",
        "48": "fileicons-developer48 icon-cpp",
        "96": "fileicons-developer96-icon-cpp",
        "256": "fileicons-developer256-icon-cpp"
    },
    "cs": {
        "16": "fileicons-developer16 icon-cs",
        "32": "fileicons-developer32 icon-cs",
        "48": "fileicons-developer48 icon-cs",
        "96": "fileicons-developer96-icon-cs",
        "256": "fileicons-developer256-icon-cs"
    },
    "csproj": {
        "16": "fileicons-developer16 icon-csproj",
        "32": "fileicons-developer32 icon-csproj",
        "48": "fileicons-developer48 icon-csproj",
        "96": "fileicons-developer96-icon-csproj",
        "256": "fileicons-developer256-icon-csproj"
    },
    "dtd": {
        "16": "fileicons-developer16 icon-dtd",
        "32": "fileicons-developer32 icon-dtd",
        "48": "fileicons-developer48 icon-dtd",
        "96": "fileicons-developer96-icon-dtd",
        "256": "fileicons-developer256-icon-dtd"
    },
    "h": {
        "16": "fileicons-developer16 icon-h",
        "32": "fileicons-developer32 icon-h",
        "48": "fileicons-developer48 icon-h",
        "96": "fileicons-developer96-icon-h",
        "256": "fileicons-developer256-icon-h"
    },
    "ldf": {
        "16": "fileicons-developer16 icon-ldf",
        "32": "fileicons-developer32 icon-ldf",
        "48": "fileicons-developer48 icon-ldf",
        "96": "fileicons-developer96-icon-ldf",
        "256": "fileicons-developer256-icon-ldf"
    },
    "mdf": {
        "16": "fileicons-developer16 icon-mdf",
        "32": "fileicons-developer32 icon-mdf",
        "48": "fileicons-developer48 icon-mdf",
        "96": "fileicons-developer96-icon-mdf",
        "256": "fileicons-developer256-icon-mdf"
    },
    "pdb": {
        "16": "fileicons-developer16 icon-pdb",
        "32": "fileicons-developer32 icon-pdb",
        "48": "fileicons-developer48 icon-pdb",
        "96": "fileicons-developer96-icon-pdb",
        "256": "fileicons-developer256-icon-pdb"
    },
    "resx": {
        "16": "fileicons-developer16 icon-resx",
        "32": "fileicons-developer32 icon-resx",
        "48": "fileicons-developer48 icon-resx",
        "96": "fileicons-developer96-icon-resx",
        "256": "fileicons-developer256-icon-resx"
    },
    "sln": {
        "16": "fileicons-developer16 icon-sln",
        "32": "fileicons-developer32 icon-sln",
        "48": "fileicons-developer48 icon-sln",
        "96": "fileicons-developer96-icon-sln",
        "256": "fileicons-developer256-icon-sln"
    },
    "sql": {
        "16": "fileicons-developer16 icon-sql",
        "32": "fileicons-developer32 icon-sql",
        "48": "fileicons-developer48 icon-sql",
        "96": "fileicons-developer96-icon-sql",
        "256": "fileicons-developer256-icon-sql"
    },
    "suo": {
        "16": "fileicons-developer16 icon-suo",
        "32": "fileicons-developer32 icon-suo",
        "48": "fileicons-developer48 icon-suo",
        "96": "fileicons-developer96-icon-suo",
        "256": "fileicons-developer256-icon-suo"
    },
    "vb": {
        "16": "fileicons-developer16 icon-vb",
        "32": "fileicons-developer32 icon-vb",
        "48": "fileicons-developer48 icon-vb",
        "96": "fileicons-developer96-icon-vb",
        "256": "fileicons-developer256-icon-vb"
    },
    "vbproj": {
        "16": "fileicons-developer16 icon-vbproj",
        "32": "fileicons-developer32 icon-vbproj",
        "48": "fileicons-developer48 icon-vbproj",
        "96": "fileicons-developer96-icon-vbproj",
        "256": "fileicons-developer256-icon-vbproj"
    },
    "vcproj": {
        "16": "fileicons-developer16 icon-vcproj",
        "32": "fileicons-developer32 icon-vcproj",
        "48": "fileicons-developer48 icon-vcproj",
        "96": "fileicons-developer96-icon-vcproj",
        "256": "fileicons-developer256-icon-vcproj"
    },
    "vcxproj": {
        "16": "fileicons-developer16 icon-vcxproj",
        "32": "fileicons-developer32 icon-vcxproj",
        "48": "fileicons-developer48 icon-vcxproj",
        "96": "fileicons-developer96-icon-vcxproj",
        "256": "fileicons-developer256-icon-vcxproj"
    },
    "xaml": {
        "16": "fileicons-developer16 icon-xaml",
        "32": "fileicons-developer32 icon-xaml",
        "48": "fileicons-developer48 icon-xaml",
        "96": "fileicons-developer96-icon-xaml",
        "256": "fileicons-developer256-icon-xaml"
    },
    "xml": {
        "16": "fileicons-developer16 icon-xml",
        "32": "fileicons-developer32 icon-xml",
        "48": "fileicons-developer48 icon-xml",
        "96": "fileicons-developer96-icon-xml",
        "256": "fileicons-developer256-icon-xml"
    },
    "xsd": {
        "16": "fileicons-developer16 icon-xsd",
        "32": "fileicons-developer32 icon-xsd",
        "48": "fileicons-developer48 icon-xsd",
        "96": "fileicons-developer96-icon-xsd",
        "256": "fileicons-developer256-icon-xsd"
    },
    "xsl": {
        "16": "fileicons-developer16 icon-xsl",
        "32": "fileicons-developer32 icon-xsl",
        "48": "fileicons-developer48 icon-xsl",
        "96": "fileicons-developer96-icon-xsl",
        "256": "fileicons-developer256-icon-xsl"
    },
    "bmp": {
        "16": "fileicons-image16 icon-bmp",
        "32": "fileicons-image32 icon-bmp",
        "48": "fileicons-image48 icon-bmp",
        "96": "fileicons-image96-icon-bmp",
        "256": "fileicons-image256-icon-bmp"
    },
    "gif": {
        "16": "fileicons-image16 icon-gif",
        "32": "fileicons-image32 icon-gif",
        "48": "fileicons-image48 icon-gif",
        "96": "fileicons-image96-icon-gif",
        "256": "fileicons-image256-icon-gif"
    },
    "jpg": {
        "16": "fileicons-image16 icon-jpg",
        "32": "fileicons-image32 icon-jpg",
        "48": "fileicons-image48 icon-jpg",
        "96": "fileicons-image96-icon-jpg",
        "256": "fileicons-image256-icon-jpg"
    },
    "png": {
        "16": "fileicons-image16 icon-png",
        "32": "fileicons-image32 icon-png",
        "48": "fileicons-image48 icon-png",
        "96": "fileicons-image96-icon-png",
        "256": "fileicons-image256-icon-png"
    },
    "accdb": {
        "16": "fileicons-office16 icon-accdb",
        "32": "fileicons-office32 icon-accdb",
        "48": "fileicons-office48 icon-accdb",
        "96": "fileicons-office96-icon-accdb",
        "256": "fileicons-office256-icon-accdb"
    },
    "csv": {
        "16": "fileicons-office16 icon-csv",
        "32": "fileicons-office32 icon-csv",
        "48": "fileicons-office48 icon-csv",
        "96": "fileicons-office96-icon-csv",
        "256": "fileicons-office256-icon-csv"
    },
    "doc": {
        "16": "fileicons-office16 icon-doc",
        "32": "fileicons-office32 icon-doc",
        "48": "fileicons-office48 icon-doc",
        "96": "fileicons-office96-icon-doc",
        "256": "fileicons-office256-icon-doc"
    },
    "docx": {
        "16": "fileicons-office16 icon-docx",
        "32": "fileicons-office32 icon-docx",
        "48": "fileicons-office48 icon-docx",
        "96": "fileicons-office96-icon-docx",
        "256": "fileicons-office256-icon-docx"
    },
    "dot": {
        "16": "fileicons-office16 icon-dot",
        "32": "fileicons-office32 icon-dot",
        "48": "fileicons-office48 icon-dot",
        "96": "fileicons-office96-icon-dot",
        "256": "fileicons-office256-icon-dot"
    },
    "dotx": {
        "16": "fileicons-office16 icon-dotx",
        "32": "fileicons-office32 icon-dotx",
        "48": "fileicons-office48 icon-dotx",
        "96": "fileicons-office96-icon-dotx",
        "256": "fileicons-office256-icon-dotx"
    },
    "mdb": {
        "16": "fileicons-office16 icon-mdb",
        "32": "fileicons-office32 icon-mdb",
        "48": "fileicons-office48 icon-mdb",
        "96": "fileicons-office96-icon-mdb",
        "256": "fileicons-office256-icon-mdb"
    },
    "msg": {
        "16": "fileicons-office16 icon-msg",
        "32": "fileicons-office32 icon-msg",
        "48": "fileicons-office48 icon-msg",
        "96": "fileicons-office96-icon-msg",
        "256": "fileicons-office256-icon-msg"
    },
    "pdf": {
        "16": "fileicons-office16 icon-pdf",
        "32": "fileicons-office32 icon-pdf",
        "48": "fileicons-office48 icon-pdf",
        "96": "fileicons-office96-icon-pdf",
        "256": "fileicons-office256-icon-pdf"
    },
    "pps": {
        "16": "fileicons-office16 icon-pps",
        "32": "fileicons-office32 icon-pps",
        "48": "fileicons-office48 icon-pps",
        "96": "fileicons-office96-icon-pps",
        "256": "fileicons-office256-icon-pps"
    },
    "ppsx": {
        "16": "fileicons-office16 icon-ppsx",
        "32": "fileicons-office32 icon-ppsx",
        "48": "fileicons-office48 icon-ppsx",
        "96": "fileicons-office96-icon-ppsx",
        "256": "fileicons-office256-icon-ppsx"
    },
    "ppt": {
        "16": "fileicons-office16 icon-ppt",
        "32": "fileicons-office32 icon-ppt",
        "48": "fileicons-office48 icon-ppt",
        "96": "fileicons-office96-icon-ppt",
        "256": "fileicons-office256-icon-ppt"
    },
    "pptx": {
        "16": "fileicons-office16 icon-pptx",
        "32": "fileicons-office32 icon-pptx",
        "48": "fileicons-office48 icon-pptx",
        "96": "fileicons-office96-icon-pptx",
        "256": "fileicons-office256-icon-pptx"
    },
    "pst": {
        "16": "fileicons-office16 icon-pst",
        "32": "fileicons-office32 icon-pst",
        "48": "fileicons-office48 icon-pst",
        "96": "fileicons-office96-icon-pst",
        "256": "fileicons-office256-icon-pst"
    },
    "vcf": {
        "16": "fileicons-office16 icon-vcf",
        "32": "fileicons-office32 icon-vcf",
        "48": "fileicons-office48 icon-vcf",
        "96": "fileicons-office96-icon-vcf",
        "256": "fileicons-office256-icon-vcf"
    },
    "xls": {
        "16": "fileicons-office16 icon-xls",
        "32": "fileicons-office32 icon-xls",
        "48": "fileicons-office48 icon-xls",
        "96": "fileicons-office96-icon-xls",
        "256": "fileicons-office256-icon-xls"
    },
    "xlsx": {
        "16": "fileicons-office16 icon-xlsx",
        "32": "fileicons-office32 icon-xlsx",
        "48": "fileicons-office48 icon-xlsx",
        "96": "fileicons-office96-icon-xlsx",
        "256": "fileicons-office256-icon-xlsx"
    },
    "xlt": {
        "16": "fileicons-office16 icon-xlt",
        "32": "fileicons-office32 icon-xlt",
        "48": "fileicons-office48 icon-xlt",
        "96": "fileicons-office96-icon-xlt",
        "256": "fileicons-office256-icon-xlt"
    },
    "xltx": {
        "16": "fileicons-office16 icon-xltx",
        "32": "fileicons-office32 icon-xltx",
        "48": "fileicons-office48 icon-xltx",
        "96": "fileicons-office96-icon-xltx",
        "256": "fileicons-office256-icon-xltx"
    },
    "xps": {
        "16": "fileicons-office16 icon-xps",
        "32": "fileicons-office32 icon-xps",
        "48": "fileicons-office48 icon-xps",
        "96": "fileicons-office96-icon-xps",
        "256": "fileicons-office256-icon-xps"
    },
    "cab": {
        "16": "fileicons-system16 icon-cab",
        "32": "fileicons-system32 icon-cab",
        "48": "fileicons-system48 icon-cab",
        "96": "fileicons-system96-icon-cab",
        "256": "fileicons-system256-icon-cab"
    },
    "cer": {
        "16": "fileicons-system16 icon-cer",
        "32": "fileicons-system32 icon-cer",
        "48": "fileicons-system48 icon-cer",
        "96": "fileicons-system96-icon-cer",
        "256": "fileicons-system256-icon-cer"
    },
    "chm": {
        "16": "fileicons-system16 icon-chm",
        "32": "fileicons-system32 icon-chm",
        "48": "fileicons-system48 icon-chm",
        "96": "fileicons-system96-icon-chm",
        "256": "fileicons-system256-icon-chm"
    },
    "cmd": {
        "16": "fileicons-system16 icon-cmd",
        "32": "fileicons-system32 icon-cmd",
        "48": "fileicons-system48 icon-cmd",
        "96": "fileicons-system96-icon-cmd",
        "256": "fileicons-system256-icon-cmd"
    },
    "dll": {
        "16": "fileicons-system16 icon-dll",
        "32": "fileicons-system32 icon-dll",
        "48": "fileicons-system48 icon-dll",
        "96": "fileicons-system96-icon-dll",
        "256": "fileicons-system256-icon-dll"
    },
    "exe": {
        "16": "fileicons-system16 icon-exe",
        "32": "fileicons-system32 icon-exe",
        "48": "fileicons-system48 icon-exe",
        "96": "fileicons-system96-icon-exe",
        "256": "fileicons-system256-icon-exe"
    },
    "fon": {
        "16": "fileicons-system16 icon-fon",
        "32": "fileicons-system32 icon-fon",
        "48": "fileicons-system48 icon-fon",
        "96": "fileicons-system96-icon-fon",
        "256": "fileicons-system256-icon-fon"
    },
    "hlp": {
        "16": "fileicons-system16 icon-hlp",
        "32": "fileicons-system32 icon-hlp",
        "48": "fileicons-system48 icon-hlp",
        "96": "fileicons-system96-icon-hlp",
        "256": "fileicons-system256-icon-hlp"
    },
    "ini": {
        "16": "fileicons-system16 icon-ini",
        "32": "fileicons-system32 icon-ini",
        "48": "fileicons-system48 icon-ini",
        "96": "fileicons-system96-icon-ini",
        "256": "fileicons-system256-icon-ini"
    },
    "lnk": {
        "16": "fileicons-system16 icon-lnk",
        "32": "fileicons-system32 icon-lnk",
        "48": "fileicons-system48 icon-lnk",
        "96": "fileicons-system96-icon-lnk",
        "256": "fileicons-system256-icon-lnk"
    },
    "msi": {
        "16": "fileicons-system16 icon-msi",
        "32": "fileicons-system32 icon-msi",
        "48": "fileicons-system48 icon-msi",
        "96": "fileicons-system96-icon-msi",
        "256": "fileicons-system256-icon-msi"
    },
    "ps1": {
        "16": "fileicons-system16 icon-ps1",
        "32": "fileicons-system32 icon-ps1",
        "48": "fileicons-system48 icon-ps1",
        "96": "fileicons-system96-icon-ps1",
        "256": "fileicons-system256-icon-ps1"
    },
    "reg": {
        "16": "fileicons-system16 icon-reg",
        "32": "fileicons-system32 icon-reg",
        "48": "fileicons-system48 icon-reg",
        "96": "fileicons-system96-icon-reg",
        "256": "fileicons-system256-icon-reg"
    },
    "rtf": {
        "16": "fileicons-system16 icon-rtf",
        "32": "fileicons-system32 icon-rtf",
        "48": "fileicons-system48 icon-rtf",
        "96": "fileicons-system96-icon-rtf",
        "256": "fileicons-system256-icon-rtf"
    },
    "txt": {
        "16": "fileicons-system16 icon-txt",
        "32": "fileicons-system32 icon-txt",
        "48": "fileicons-system48 icon-txt",
        "96": "fileicons-system96-icon-txt",
        "256": "fileicons-system256-icon-txt"
    },
    "vbs": {
        "16": "fileicons-system16 icon-vbs",
        "32": "fileicons-system32 icon-vbs",
        "48": "fileicons-system48 icon-vbs",
        "96": "fileicons-system96-icon-vbs",
        "256": "fileicons-system256-icon-vbs"
    },
    "avi": {
        "16": "fileicons-video16 icon-avi",
        "32": "fileicons-video32 icon-avi",
        "48": "fileicons-video48 icon-avi",
        "96": "fileicons-video96-icon-avi",
        "256": "fileicons-video256-icon-avi"
    },
    "flv": {
        "16": "fileicons-video16 icon-flv",
        "32": "fileicons-video32 icon-flv",
        "48": "fileicons-video48 icon-flv",
        "96": "fileicons-video96-icon-flv",
        "256": "fileicons-video256-icon-flv"
    },
    "m4v": {
        "16": "fileicons-video16 icon-m4v",
        "32": "fileicons-video32 icon-m4v",
        "48": "fileicons-video48 icon-m4v",
        "96": "fileicons-video96-icon-m4v",
        "256": "fileicons-video256-icon-m4v"
    },
    "mkv": {
        "16": "fileicons-video16 icon-mkv",
        "32": "fileicons-video32 icon-mkv",
        "48": "fileicons-video48 icon-mkv",
        "96": "fileicons-video96-icon-mkv",
        "256": "fileicons-video256-icon-mkv"
    },
    "mov": {
        "16": "fileicons-video16 icon-mov",
        "32": "fileicons-video32 icon-mov",
        "48": "fileicons-video48 icon-mov",
        "96": "fileicons-video96-icon-mov",
        "256": "fileicons-video256-icon-mov"
    },
    "mp4": {
        "16": "fileicons-video16 icon-mp4",
        "32": "fileicons-video32 icon-mp4",
        "48": "fileicons-video48 icon-mp4",
        "96": "fileicons-video96-icon-mp4",
        "256": "fileicons-video256-icon-mp4"
    },
    "mpg": {
        "16": "fileicons-video16 icon-mpg",
        "32": "fileicons-video32 icon-mpg",
        "48": "fileicons-video48 icon-mpg",
        "96": "fileicons-video96-icon-mpg",
        "256": "fileicons-video256-icon-mpg"
    },
    "wmv": {
        "16": "fileicons-video16 icon-wmv",
        "32": "fileicons-video32 icon-wmv",
        "48": "fileicons-video48 icon-wmv",
        "96": "fileicons-video96-icon-wmv",
        "256": "fileicons-video256-icon-wmv"
    },
    "asax": {
        "16": "fileicons-web16 icon-asax",
        "32": "fileicons-web32 icon-asax",
        "48": "fileicons-web48 icon-asax",
        "96": "fileicons-web96-icon-asax",
        "256": "fileicons-web256-icon-asax"
    },
    "ascx": {
        "16": "fileicons-web16 icon-ascx",
        "32": "fileicons-web32 icon-ascx",
        "48": "fileicons-web48 icon-ascx",
        "96": "fileicons-web96-icon-ascx",
        "256": "fileicons-web256-icon-ascx"
    },
    "ashx": {
        "16": "fileicons-web16 icon-ashx",
        "32": "fileicons-web32 icon-ashx",
        "48": "fileicons-web48 icon-ashx",
        "96": "fileicons-web96-icon-ashx",
        "256": "fileicons-web256-icon-ashx"
    },
    "asmx": {
        "16": "fileicons-web16 icon-asmx",
        "32": "fileicons-web32 icon-asmx",
        "48": "fileicons-web48 icon-asmx",
        "96": "fileicons-web96-icon-asmx",
        "256": "fileicons-web256-icon-asmx"
    },
    "aspx": {
        "16": "fileicons-web16 icon-aspx",
        "32": "fileicons-web32 icon-aspx",
        "48": "fileicons-web48 icon-aspx",
        "96": "fileicons-web96-icon-aspx",
        "256": "fileicons-web256-icon-aspx"
    },
    "config": {
        "16": "fileicons-web16 icon-config",
        "32": "fileicons-web32 icon-config",
        "48": "fileicons-web48 icon-config",
        "96": "fileicons-web96-icon-config",
        "256": "fileicons-web256-icon-config"
    },
    "cshtml": {
        "16": "fileicons-web16 icon-cshtml",
        "32": "fileicons-web32 icon-cshtml",
        "48": "fileicons-web48 icon-cshtml",
        "96": "fileicons-web96-icon-cshtml",
        "256": "fileicons-web256-icon-cshtml"
    },
    "css": {
        "16": "fileicons-web16 icon-css",
        "32": "fileicons-web32 icon-css",
        "48": "fileicons-web48 icon-css",
        "96": "fileicons-web96-icon-css",
        "256": "fileicons-web256-icon-css"
    },
    "htm": {
        "16": "fileicons-web16 icon-htm",
        "32": "fileicons-web32 icon-htm",
        "48": "fileicons-web48 icon-htm",
        "96": "fileicons-web96-icon-htm",
        "256": "fileicons-web256-icon-htm"
    },
    "js": {
        "16": "fileicons-web16 icon-js",
        "32": "fileicons-web32 icon-js",
        "48": "fileicons-web48 icon-js",
        "96": "fileicons-web96-icon-js",
        "256": "fileicons-web256-icon-js"
    },
    "swf": {
        "16": "fileicons-web16 icon-swf",
        "32": "fileicons-web32 icon-swf",
        "48": "fileicons-web48 icon-swf",
        "96": "fileicons-web96-icon-swf",
        "256": "fileicons-web256-icon-swf"
    },
    "xap": {
        "16": "fileicons-web16 icon-xap",
        "32": "fileicons-web32 icon-xap",
        "48": "fileicons-web48 icon-xap",
        "96": "fileicons-web96-icon-xap",
        "256": "fileicons-web256-icon-xap"
    }
};
GleamTech.FileUltimate.FileIconManager.fileIconMappings = {
    "tgz": "tar",
    "tbz": "tar",
    "tbz2": "tar",
    "sit": "sitx",
    "aiff": "aif",
    "aifc": "aif",
    "aac": "aif",
    "mid": "aif",
    "midi": "aif",
    "flac": "aif",
    "m4p": "aif",
    "max": "3ds",
    "sdf": "mdf",
    "user": "suo",
    "xslt": "xsl",
    "tif": "bmp",
    "tiff": "bmp",
    "tff": "bmp",
    "tga": "bmp",
    "jpeg": "jpg",
    "jpe": "jpg",
    "jif": "jpg",
    "jfif": "jpg",
    "jfi": "jpg",
    "exif": "jpg",
    "com": "exe",
    "sys": "dll",
    "ocx": "dll",
    "cpl": "dll",
    "bat": "cmd",
    "inf": "ini",
    "otf": "fon",
    "ttf": "fon",
    "log": "txt",
    "crt": "cer",
    "mp4v": "mp4",
    "3g2": "mkv",
    "3gp": "mkv",
    "mpe": "mpg",
    "mpeg": "mpg",
    "vob": "mpg",
    "asf": "mkv",
    "m2ts": "mkv",
    "mts": "mkv",
    "master": "aspx",
    "html": "htm",
    "vbhtml": "cshtml"
};
GleamTech.FileUltimate.FileThumbnailManager.supportedExtensions = {
    "bmp": 1,
    "gif": 1,
    "png": 1,
    "jpg": 1,
    "jpeg": 1,
    "jpe": 1,
    "jif": 1,
    "jfif": 1,
    "jfi": 1,
    "exif": 1,
    "tif": 1,
    "tiff": 1,
    "tff": 1,
    "psd": 1,
    "avi": 2,
    "mp4": 2,
    "m4v": 2,
    "mp4v": 2,
    "3g2": 2,
    "3gp": 2,
    "mpg": 2,
    "mpeg": 2,
    "mpe": 2,
    "vob": 2,
    "mov": 2,
    "mkv": 2,
    "wmv": 2,
    "asf": 2,
    "m2ts": 2,
    "mts": 2,
    "ts": 2,
    "m2t": 2,
    "flv": 2
};
GleamTech.FileUltimate.ArchiveFileManager.supportedExtensions = {
    "zip": 2,
    "7z": 1,
    "rar": 1,
    "tar": 1,
    "tgz": 1,
    "tbz": 1,
    "tbz2": 1,
    "gz": 1,
    "bz2": 1
};

function initHeader(n, t, i, r) {
    var u = document.getElementById("pageHeader"),
        e = document.getElementById("userInfo"),
        f = GleamTech.JavaScript.UI.ContextMenu.Parse(document.body, {
            ContextMenus: {
                ContextMenu: {
                    Name: "User",
                    Item: [{
                        action: "UserSettings",
                        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACoElEQVR42o2SX0hTURzHv9uuif+mTqe4+SdMbWCGucSX0kGFqE9RIDitBzGo6I8P0YMRYk/RgyWBShCoZVIU/cE/aDF8yH9RSojkw1QcznvddFu7293u7u7pbisjUvF3zu8czr/POef3++KrqTUBkpne3Qv3XV3dWXdaWk40NzcXYh8mCzUdt6tl1+8PkSdPeztWlpdq7Zv2lC27zas7XPDSaDRe1ul0gd0AlG26X6YuqyOhQTqYxjg1iaVJEFO0L2F07GNjVBTVLS192RVAKSCb6G1F6tFTosq7xPv9SVhdYmG1CFjgeCiVSu1eALnH6aBcbie+md5cW6cZwjDrcLEcshNlyFeJ8PPBtb1iIN/YsKPq6kPicLrT1tcsIk3TcDhdEAMeVJSf7K0wGL7vGcS+NiNlViiIVptbRC3OfxB4XyabU7OfBERi8EmwB6PjZFgYmLEWqVXDfp+3KSUHOF1ZteOBnlejaDh3Bn2vx6BVBqGYGzej8sIxWfTB+tx4RcIlwTKljc0rR0a6CgLP/eeFeRoEA5HeYlkD1f72itzGHYJeXzuSVLSsiak8i/nZWZTqS0CkEq6EwOrwwGRzI/sAheNpcRCluc8TM5A73V7Ce7MGtmhak5icBl/iXwHyPA8+wEsAYNC8ibumZZRplBFw2KUszE0tUnCLqR52E4IAMDbHNqBteAGGzkkIwQBujP7ArSPpv19FwtAw4H3XJPnJWBPdW4zISYJleWEboE+lsOH2QfVgHAZVDBpKtHjWM4j+5yOwrNKRLEiqFZJVKedp8/zNIWalOCY2Pj8zHhmhi2pKC5CToUbTi2lcLM7CAYUMdfXVCAaFPz/Y2do7OokoisTn9/3jHMcRlmWJy+UiTqeThPZRu0EePe7el5B+ATyXUE0p9ZJ7AAAAAElFTkSuQmCC",
                        text: "FileVista.Action.UserSettings"
                    }, {
                        action: "Administration",
                        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACwklEQVQ4jYVRbUhTYRg9u97NXeecms7vJWkfmIVo9mkUZIglFQSWkkhQP/oREoZEQVk/MzWXJZH+UCvKjFASbYIfpEvtQyvIwErTnLlNt+nd7na33bcfOtGYeOCBw8v7nOc8zwGW4V7zQKCHlzb0fCxt7KkDgJJn3YqbNa+l8AKRh1Q09VEURE0EPlM0hedyxree4/lxo9l2WyJyl7BW9n7xuayy/wVoDyk4vluoaR1ybFQps8KC/LNoWoJJ45zq9+RU5ax+EmIJQ3l1cKexN1zuJ30U4MeYtm2I3K5gJMpfU0YMj+oggCAiRAG3W4DBbB83zMz+MRqMJnVR7vklB4KbuIhAErbEKJmQAAaad5/QoR0cZGSyErFYorJaI4rjokOlqjCZysZaVXqXo2e5A6roVJqR512XaJrCiE6P1u73Tey89UTVlfwudWFOnZV3HZsysdM2jgehCEQS35wVK1S3DbYHyv22rg8PQf/gMDq1fbFpsTKHt329gSaCMCsiohmAWucrFSNIESgFnEjPyPTaUPtCg7yTh1H/sh1RAe6FGB80f8hOjIu+63Q58Hbg65CCm8jct3fnmtN7tQOgr1Vr5DY7d3mOtSIyNBj7kxOTvvROIDUlGQQEIAAhBDqTFZ2GeagkNHYoZRAIQa92AJRY7EOzdr7/84+J5pFxnctfLluawPM8eCcPQoCWnzO43jmKXZEBC8IgCzcozj9kAnDxas0b/zHddMIcy8V7BG61fkPHmAVdF/agQPMdZQfiF10RELIYo+ezL+XDOJyCaFSnf+V5SwmhoZ+3I7ikGweDGeQlR+FxbQuePmnDxPjflQI3zqYbHLwz22wxFQILDo+mbkJDbhI2g0N+khISHxFyzxzB6dwMxMSErX7dcnUVEQSB2B32FcVxHGFZllgsFmI2m0m5uorQq4lUVD5cM0YA+Af6x0UrttcFJgAAAABJRU5ErkJggg==",
                        text: "FileVista.Action.Administration"
                    }, {
                        action: "[Separator]"
                    }, {
                        action: "Logout",
                        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACp0lEQVR42pWTXUiTURjH/+/ru9am20ydM0WtxFwUqVB2Mz+gIBWK6CZKCMEo+24ZLDLCLKgwqbxxUoR5IdqFVBeVuVh1UZZUFmQEMXVzH+/eue9vt/dtWxiWOOy5eM45nPP/ned5znnwUdsmQsy0j68kRrW6J/9ia6tCqVRuxDKMiLsuVT1x6sZT7u79vq6pSd0+26wt025j/PKS9Q8bGhqOyuXyuaUAFPO+n5BuO8DFFzLQTalSTmjhohi1BEUvRjRNPB7VE9saWxJApYB429eGrM3b2Qy/LhwKpUOv88JkiGAiEIZYLM5LBiB9Tgfl8jjxSTt00myhOZo2w+UNoEBCoDiDRSgcNSarAWm12lB3/DbncHqyzUYDa7FY4HC6wM75UF1V2VddU/M1GSBFUZpHlO4oJ9ILCu2+Kd0el2NW7HZ74XS5MO0iDzefUOqTRvAyYouaV1rZkYEB08yM6dm0fga0cQofGMFTccXBivmL4u55LY8bPyK9+Regt32Yy5SJsHr3WRlZWFkKPwN+jhyKxuv1wqw17c2X76lj5/jzAsbgaVkIIW49OkYygSLI1x0ypIcncwUI4qdXgpwv3RC86l4U8k5VBzQd5yHNF3WW9TDnKKfHz4XD+YN2iyW3sCgbblYEgg0kxIrGSyCs38BL5YPHJ4FoEOx3DaoaT+NN7514JCDHR39Q8LBZPu8sIhGAZhzg2Mjv/IS8mJgHiogJmWmwdhphmx3+MQ227r8Ah97VQj5Rv+PctEnisdNsIPZhveEIopFoAjBHkQjJSuDP2IBocW1svgUBZwjEpl343H8VqwoknYleUHU8WEsb9WeEaWllAmFaMUXxssutQ8GcieHUhfm7KQKVe1UYH7yWEMdrsJyG+2Ov6/mctm7Foqf8L8C/4l85cC7qA8uN7QAAAABJRU5ErkJggg==",
                        text: "FileVista.Action.Logout"
                    }]
                }
            }
        }, function (r) {
            switch (r.action) {
            case "UserSettings":
                t.ShowUrl("usersettingsdialog.aspx", 400, 230, n.GetEntry("FileVista.Action.UserSettings"));
                break;
            case "Administration":
                window.location.href = "administration.aspx";
                break;
            case "Logout":
                GleamTech.JavaScript.Util.RequestJson(i, null, function () {
                    window.location.href = "login.aspx"
                }, function (t) {
                    alert(n.GetEntry("544") + "\n\n" + t.Message)
                })
            }
        }, n);
    return f.User.divElement.style.zIndex = 2, r && f.User.menuItems.Administration.Hide(), GleamTech.JavaScript.Util.AddEvent(e, "click", function () {
        f.User.PopupXY(u.offsetWidth, u.offsetHeight, !0)
    }), u
}

function fileManagerLoading(n) {
    var t = n,
        i = GleamTech.JavaScript.Util.GetLanguage(t.uploaderLanguage),
        r = new GleamTech.JavaScript.UI.ModalDialog,
        f = initHeader(i, r, getActionUrl("Logout"), !fileVistaParameters.IsAdministrator && !fileVistaParameters.IsGroupManager),
        u;
    t.insert(0, {
        xtype: "component",
        region: "north",
        contentEl: f
    });
    GleamTech.FileUltimate.FileManagerPermissionTypes.CreatePublicLink = 8192;
    u = [{
        showConditions: {
            itemTypes: {
                File: {
                    parentPermissions: ["CreatePublicLink"]
                }
            }
        },
        text: i.GetEntry("FileVista.Label.CreatePublicLink") + "...",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAADP0lEQVR4nK2Te0hTcRTHv/e1O91m013dbc6WOHVuzpr0WDVzktjD7AVRVvSAiiiISsoeZtELJHsYEUVFSS+JooQIKg0rFXqYFD0kK8t0mpa1TW1u7q6bpWD0ZwcO/Di/cz4cvnwP8I+ImbAj1bb41J7pW65Xz8y70TJpzeUKY8bBHWpjjp2LW6sQk+jvJfsfYpG69rCFTFtxtiB2RuTt6OmObab0t+OiEvy8PCoi1ZJp35mUNqU4eonrjNhuFPvpQYDU7IXC8ZLK605b9SZ+ZLNE02uGaiiHJrcKDK+AJJSFLIwdpqdmzVYo9Ev/QMgBgKPu1aGPxitZ0lGPMP/QPqzm38L8bQI4PgTy4RxIloZEyiBS302aMogNbJBqijgW2gfQWvLsHYlP1lJJFBKCTH3AN4XbEfn5DuLNHPw0DT9BgBYB6pRbsK4rJZVG2XqCoCzE3Xlsodcp5Pwt5OTc/Sjbvxk12QfxSJ0Jtq0bnvcdMC/LRTcVwL3TVrSVqvOp7Cjylm1pPnQaDvqRFsQlj4DeFAfBUYeo8Vnwnd8FtyISLb06+Du8iJ34AB9cTjS2uiBpsOG3ksEMaJmYhAdCe3vfBl63B56GMozO3gr6Yi6eWavh/S6gvLkBbZ870eZlwfnZWGqRntqpGZceEGShRC+rAhmeAB+jFNetB5mUhdpLe1EVswrvuuLR+b0bDqYDVJMRytosdDX7amhepzxQe3T7IA1cNIGUObmoLdmH57ZZuNs0B95OARQjhebpcgQCLvSSfrT31N/vcxRvzJ+qlI+9CdYF78pzOHOpHEIggIqZY/A0zYIhLxLhqEwERXsxZFgYZGoJGsvbnS8qShcQf1yokAcnFkmlEcuga8QJ90actWtxP8UCpTQMBHwA+xWSornQWU348syH+qrK3Z3Oj8cGPB0en2MOkSUXMpLgDE/MS/yYdg/B4XL4g5wAzSCciob8qh1ElxbOT80XPr2uKhLHagYAv7xNEIwpRG5YwwZxK1ptJ0EbBJBaNzStU8G1WEH1MML7srrDXx0vS8SR51/eHOkZZJ5fByWmik/Iy9RO3FTMZ6xsNCwu6DLYih/HJB8uiDBszBT/+f5D+i/xE6UqHPhmOggeAAAAAElFTkSuQmCC",
        handler: function () {
            var n = "publiclinkdialog.aspx?";
            n += Ext.Object.toQueryString({
                stateId: t.serverStateId,
                path: t.navigationSelection.getPathData().fullPath,
                fileName: t.contextMenuSelection.data.name
            });
            r.ShowUrl(n, 400, 460, i.GetEntry("FileVista.Label.NewPublicLink"))
        }
    }, {
        showConditions: {
            itemTypes: {
                File: {
                    parentPermissions: ["CreatePublicLink"]
                }
            }
        },
        text: i.GetEntry("FileVista.Label.ManagePublicLinks") + "...",
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC9ElEQVR42qWSXWgUVxTHfzOzX8nuJrtZNYsb126iSQzVip8ExAebIoogtBbBh/oiyKIglT743Ic+tC+CH6GKbamiSPtSsX5S8TtBxICUVYJNauKy2SS72d1kstmduXc6k5gghfrSGc65c8+953f+c+6F//kojsv1fXPYsmRSWrLDkgLH5KyZSGHOze3Rng/a8e6V2899Nw9wOc4OJutXbujQfP73VjPKxcTQ41+T9ue/AWZMdXv/M9GyHFUmquZyiiXeXZsDCOOdzRaKomCYkqt3s6RyJiMlP+YUxP2TxAwvkc6DoVzP9wVnv+o4YQMs+51tip1crgiu9OicTo8yHB7F11wi720gJVbz+0QXsY6Gr4KhLyMLCoRpLEidKVc4eV3nh8BFjkoPzcHP6a028bopgKeioFaX0t4kDuXir/Ja+MjZWQXSrNpWQRoz/HLrb05Vb7CirUr84SUWP7rJhwGNukQEU/UQXFZm7YGboY/2caQwWNM1p0A4gGlenvmZ5tQ457Ux1Cc1BBq20LKsloEbp2H9QfSZED6vjhG8ipL4NL5kXdvO+WPErOqUB6bYvGMbrmI/msvuiZhBFF6xxV8HD7q5EDpEOQbZ0gRveER9fNPWWYBzRKJSQqoWss6PcC9HEQqilKcyPoSsqcGTSyN0nf5KlcngGnjRhVL0LFwkGzBJKGHR99sdO6CheKdRVBcfxFrpHenlSuQoY2k37koji6e+xipJRqbTD9U5Bc4vlFi0Yz29yzex/36SXdFO9PQd/shc4/Jn7eR2Z/BtHKUuqhFf00Ztw6KsPjF+W3MAyb2rjnkDbp8UZRrDBTIlhdzTVURDtfz4icWLSJBJ3yBm4jne5+1Ie73/7rNvi4U3l972QKaq08VOVbMI+w2+2N6H93aZY9kufNmL1AczSKud8NjH+OySLfnL+Z688lPx9cmJ+R50FzNFh9TpXOWQJdmz+SlLU0PcexZl+C8/jUYLrcafNEcHsm2tYyeOn7o17OT+A9ElcDpqm5xLAAAAAElFTkSuQmCC",
        handler: function () {
            var n = "managepubliclinksdialog.aspx?";
            n += Ext.Object.toQueryString({
                stateId: t.serverStateId,
                path: t.navigationSelection.getPathData().fullPath,
                fileName: t.contextMenuSelection.data.name
            });
            r.ShowUrl(n, 750, 500, i.GetEntry("FileVista.Label.ManagePublicLinks"))
        }
    }];
    Ext.override(t, {
        createViewItemContextMenu: function () {
            var n = this.callParent();
            return n.insert(n.items.findIndex("itemId", "Upload") + 1, u), n
        }, createNavigationViewItemContextMenu: function () {
            var n = this.callParent();
            return n.insert(n.items.findIndex("itemId", "Upload") + 1, u), n
        }
    })
}

function getResourceUrl(n) {
    return fileVistaParameters.ResourceBasePath + n
}

function getActionUrl(n) {
    return fileVistaParameters.ActionBasePath + n
}
var fileVistaParameters;