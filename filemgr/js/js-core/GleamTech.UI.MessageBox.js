Ext.define("GleamTech.UI.MessageBox", {
    extend: "Ext.window.MessageBox",
    resizable: !0,
    detailsPanel: null,
    initComponent: function() {
        this.callParent();
        this.msg.addCls("x-pre-wrap")
    },
    reconfigure: function(n) {
        this.callParent(arguments);
        this.toggleResizer(n.resizable === !0);
        this.detailsPanel && (this.remove(this.detailsPanel), this.detailsPanel = null);
        n.details && this.addDetailsPanel(n.details, n.detailsType)
    },
    onShow: function() {
        var t, n, i, r;
        this.callParent(arguments);
        t = this;
        n = t.resizer;
        t.cfg.resizable && n && (i = t.getSize(), r = n.resizeTracker, n.minWidth = r.minWidth = i.width, n.minHeight = r.minHeight = i.height)
    },
    toggleResizer: function(n) {
        for (var i = this.resizer,
        r = i.handles,
        f = r.length,
        e = i.possiblePositions,
        u, t = 0; t < f; t++)(u = i[e[r[t]]]) && u.el.setDisplayed(n)
    },
    addDetailsPanel: function(n, t) {
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
                beforecollapse: function() {
                    this.height = null
                },
                scope: this
            }
        }), t == "html") this.detailsPanel.add(new Ext.Component({
            renderTpl: ['<iframe src="javascript:&quot;&quot;" name="{frameName}" width="100%" height="100%" frameborder="0"><\/iframe>'],
            renderSelectors: {
                iframeEl: "iframe"
            },
            listeners: {
                afterrender: function(t) {
                    try {
                        var i = t.iframeEl.dom.contentDocument || t.iframeEl.dom.contentWindow.document;
                        i.write(n);
                        i.close()
                    } catch(r) {}
                }
            }
        }));
        else if (t == "json") {
            var i = function(n, t) {
                var r, u, f;
                for (r in n) u = typeof n[r] == "object",
                t.children || (t.children = []),
                f = {
                    propertyName: r,
                    propertyValue: u ? "": n[r],
                    leaf: !u,
                    iconCls: "x-tree-no-icon"
                },
                t.children.push(f),
                u && i(n[r], f)
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
                    },
                    {
                        text: "Value",
                        dataIndex: "propertyValue",
                        innerCls: "x-pre",
                        autoSizeColumn: !0
                    }]
                },
                root: r,
                viewConfig: {
                    listeners: {
                        viewready: function(n) {
                            Ext.each(n.panel.columns,
                            function(n) {
                                n.autoSizeColumn === !0 && n.autoSize()
                            })
                        }
                    }
                },
                listeners: {
                    render: function(n) {
                        n.el.on("contextmenu",
                        function(n) {
                            n.stopEvent()
                        })
                    },
                    afterrender: function(n) {
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
                                beforeshow: function(n) {
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
    },
    errorWithDetails: function(n, t, i, r) {
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
    },
    onPromptKey: function(n, t) {
        var i = this; (t.keyCode === t.RETURN || t.keyCode === 10) && (i.msgButtons.ok.isVisible() && !i.msgButtons.ok.isDisabled() ? i.msgButtons.ok.handler.call(i, i.msgButtons.ok) : i.msgButtons.yes.isVisible() && i.msgButtons.yes.handler.call(i, i.msgButtons.yes))
    },
    promptWithValidator: function(n, t, i, r, u, f, e) {
        var s = this.textField,
        o = this.msgButtons.ok;
        e(u) === !1 && o.disable();
        this.prompt(n, t,
        function(n, t, u) {
            s.validator = null;
            o.enable();
            Ext.callback(i, r, [n, t, u])
        },
        r, !1, u);
        s.selectText(0, f);
        s.validator = function(n) {
            var t = e(n);
            return t === !0 ? (o.enable(), !0) : t === !1 ? (o.disable(), !0) : (o.disable(), t)
        }
    }
});