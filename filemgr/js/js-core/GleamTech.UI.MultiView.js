Ext.define("GleamTech.UI.MultiView", {
    extend: "Ext.container.Container",
    config: {
        store: null,
        columns: null,
        viewLayout: "details",
        multipleSelection: !0,
        emptyText: "",
        getItemIconClsFn: function() {
            return ""
        },
        getItemIconClsScope: null,
        getItemThumbnailSrcFn: function() {
            return ""
        },
        getItemThumbnailSrcScope: null,
        autoInitLazyImageLoader: !0
    },
    viewLayoutTypes: [{
        name: "extralargeicons",
        iconSize: 256,
        component: "dataview"
    },
    {
        name: "largeicons",
        iconSize: 96,
        component: "dataview"
    },
    {
        name: "mediumicons",
        iconSize: 48,
        component: "dataview"
    },
    {
        name: "smallicons",
        iconSize: 16,
        component: "dataview"
    },
    {
        name: "details",
        iconSize: 16,
        component: "gridpanel"
    },
    {
        name: "tiles",
        iconSize: 48,
        component: "dataview"
    }],
    activeViewComponent: null,
    lazyImageLoader: null,
    toolTip: null,
    deferEmptyText: !0,
    getItemNameFn: null,
    getItemTileFirstValueFn: function() {
        return ""
    },
    getItemTileSecondValueFn: function() {
        return ""
    },
    getItemToolTipValueFns: null,
    initComponent: function() {
        Ext.apply(this, {
            layout: {
                type: "fit"
            }
        });
        this.callParent();
        this.initColumnsConfig();
        this.fireEvent("afterInitComponent")
    },
    onDestroy: function() {
        this.callParent();
        Ext.destroy(this.toolTip)
    },
    initColumnsConfig: function() {
        for (var n, t = 0; t < this.columns.length; t++) n = this.columns[t],
        Ext.apply(n, {
            renderer: this.getColumnRendererWithFormatter(n.formatterFn, n.isPrimary ? this.iconColumnRenderer: this.columnRenderer),
            scope: this
        }),
        n.isPrimary ? this.getItemNameFn = this.getFieldGetterWithFormatter(n.formatterFn, n.dataIndex) : (n.tdCls = "x-item-value", n.isTileFirstValue ? this.getItemTileFirstValueFn = this.getFieldGetterWithFormatter(n.tileFormatterFn || n.formatterFn, n.dataIndex) : n.isTileSecondValue && (this.getItemTileSecondValueFn = this.getFieldGetterWithFormatter(n.tileFormatterFn || n.formatterFn, n.dataIndex)), n.isToolTipValue && (this.getItemToolTipValueFns || (this.getItemToolTipValueFns = []), this.getItemToolTipValueFns.push({
            text: n.text,
            getter: this.getFieldGetterWithFormatter(n.tileFormatterFn || n.formatterFn, n.dataIndex)
        })));
        this.getItemNameFn == null && (this.getItemNameFn = this.getFieldGetterWithFormatter(this.columns[0].formatterFn, this.columns[0].dataIndex))
    },
    getColumnRendererWithFormatter: function(n, t) {
        return Ext.isFunction(n) ?
        function(i, r, u) {
            return i = n(i, u),
            t.apply(this, [i, r, u])
        }: t
    },
    getFieldGetterWithFormatter: function(n, t) {
        return Ext.isFunction(n) ?
        function(i) {
            var r = i.data[t];
            return n(r, i)
        }: function(n) {
            return n.data[t]
        }
    },
    setViewLayout: function(n) {
        var u, t, i, f, r;
        if (this.isConfiguring) {
            this.on({
                afterInitComponent: function() {
                    this.setViewLayout(n)
                },
                scope: this,
                single: !0
            });
            return
        }
        if (u = n.toLowerCase(), t = Ext.Array.findBy(this.viewLayoutTypes,
        function(n) {
            return n.name == u
        }), !t) throw new Error(Ext.String.format('"{0}" is not a valid layout type for MultiView.', n)); (i = this.viewLayout, t != i) && (this.viewLayout = t, i && i.component == t.component ? (f = i.component == "gridpanel" ? this.activeViewComponent.getView() : this.activeViewComponent, f.refresh()) : (Ext.suspendLayouts(), this.activeViewComponent && (r = this.activeViewComponent.getSelectionModel().getSelection(), this.remove(this.activeViewComponent, !0)), this.activeViewComponent = t.component == "gridpanel" ? this.createGridPanel() : this.createDataView(), r && this.activeViewComponent.getSelectionModel().selected.add(r), this.add(this.activeViewComponent), Ext.resumeLayouts(!0), this.deferEmptyText = !1))
    },
    createGridPanel: function() {
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
                mode: this.multipleSelection ? "MULTI": "SINGLE",
                ignoreRightMouseSelection: !0,
                deselectOnContainerClick: !0,
                listeners: {
                    selectionchange: this.throttle(this.onSelectionChange, 200, this)
                }
            },
            plugins: [{
                ptype: "bufferedrenderer"
            },
            new GleamTech.UI.DragSelector]
        })
    },
    iconColumnRenderer: function(n, t, i) {
        var u = this.getItemIconClsFn.apply(this.getItemIconClsScope, [i, this.viewLayout.iconSize]),
        r = '<span class="x-grid-icon ' + u + ' x-select-target"><\/span>';
        return n == null ? r: r + '<span class="x-editable x-select-target">' + n + "<\/span>"
    },
    columnRenderer: function(n) {
        return n == null ? null: '<span class="x-select-target">' + n + "<\/span>"
    },
    createDataView: function() {
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
            prepareData: function(t, i, r) {
                var u = {
                    blankImageSrc: Ext.BLANK_IMAGE_URL,
                    layoutCls: "x-layout-" + n.viewLayout.name,
                    itemName: n.getItemNameFn(r)
                },
                e,
                o,
                f;
                return n.viewLayout.iconSize >= 32 && (e = {
                    32 : 3,
                    48 : 3,
                    96 : 6,
                    256 : 12
                },
                o = n.viewLayout.iconSize - e[n.viewLayout.iconSize], u.itemThumbnailSrc = n.getItemThumbnailSrcFn.apply(n.getItemThumbnailSrcScope, [r, o])),
                f = n.getItemIconClsFn.apply(this.getItemIconClsScope, [r, n.viewLayout.iconSize]),
                u.itemThumbnailSrc ? u.fallbackIconCls = f: u.iconCls = f,
                n.viewLayout.name == "tiles" && (u.isTile = !0, u.itemFirstValue = n.getItemTileFirstValueFn(r), u.itemSecondValue = n.getItemTileSecondValueFn(r)),
                u
            },
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
            },
            selModel: {
                mode: this.multipleSelection ? "MULTI": "SINGLE",
                ignoreRightMouseSelection: !0,
                deselectOnContainerClick: !0,
                listeners: {
                    selectionchange: this.throttle(this.onSelectionChange, 200, this)
                }
            },
            plugins: [new GleamTech.UI.DragSelector]
        })
    },
    throttle: function(n, t, i, r) {
        var f, e, s, u = null,
        o = 0,
        h;
        return r || (r = {}),
        h = function() {
            o = r.leading === !1 ? 0 : +new Date;
            u = null;
            s = n.apply(f, e);
            u || (f = e = null)
        },
        function() {
            var l = +new Date,
            c;
            return o || r.leading !== !1 || (o = l),
            c = t - (l - o),
            f = i || this,
            e = arguments,
            c <= 0 || c > t ? (clearTimeout(u), u = null, o = l, s = n.apply(f, e), u || (f = e = null)) : u || r.trailing === !1 || (u = setTimeout(h, c)),
            s
        }
    },
    onViewAfterRender: function(n) {
        this.toolTip ? (this.toolTip.view = n, this.toolTip.setTarget(n.el), this.toolTip.delegate = n.itemSelector) : this.toolTip = new Ext.tip.ToolTip({
            view: n,
            target: n.el,
            delegate: n.itemSelector,
            dismissDelay: 0,
            showDelay: 800,
            shadow: "drop",
            listeners: {
                render: function(n) {
                    n.el.on("contextmenu",
                    function(n) {
                        n.stopEvent()
                    })
                },
                beforeshow: {
                    fn: function(n) {
                        var t = n.view.getRecord(n.triggerElement),
                        i;
                        if (!t) return ! 1;
                        i = this.getItemNameFn(t);
                        Ext.Array.each(this.getItemToolTipValueFns,
                        function(n) {
                            var r = n.getter(t);
                            r && (i += "<br/>" + n.text + ": " + r)
                        });
                        n.update(i)
                    },
                    scope: this
                }
            }
        })
    },
    onContainerContextMenu: function(n) {
        return n.getSelectionModel().deselectAll(),
        this.fireEventArgs("containercontextmenu", arguments)
    },
    onItemContextMenu: function(n, t, i, r, u) {
        var f = n.getSelectionModel(),
        e = u.getTarget(null, null, !0);
        return ! e.hasCls("x-select-target") && !f.isSelected(t) ? n.fireEvent("containercontextmenu", n, u) : (f.isSelected(t) || f.selectWithEvent(t, u), this.fireEventArgs("itemcontextmenu", arguments))
    },
    onItemDblClick: function() {
        return this.fireEventArgs("itemdblclick", arguments)
    },
    onSelectionChange: function() {
        return this.fireEventArgs("selectionchange", arguments)
    },
    onRefresh: function(n) {
        return this.viewLayout.component == "dataview" && ((this.viewLayout.name == "mediumicons" || this.viewLayout.name == "largeicons") && Ext.Object.each(n.all.elements,
        function(n, t) {
            var i = t.lastChild;
            i.style.display = "block";
            $clamp(i, {
                clamp: 4,
                useNativeClamp: !1
            });
            i.style.display = ""
        }), this.autoInitLazyImageLoader && this.initLazyImageLoader(n)),
        this.fireEventArgs("refresh", arguments)
    },
    initLazyImageLoader: function(n, t) {
        if (this.viewLayout.iconSize < 32) {
            this.destroyLazyImageLoader();
            return
        }
        if (this.lazyImageLoader) this.lazyImageLoader.options.createImageFn = t,
        this.lazyImageLoader.revalidate();
        else {
            var i = this;
            this.lazyImageLoader = new Blazy({
                container: "#" + n.getEl().id,
                selector: "#" + n.getEl().id + " .b-lazy",
                beforeload: function(n) {
                    var i = Ext.get(n),
                    t = i.up(".x-item-icon");
                    t && t.addCls("x-loading")
                },
                success: function(n) {
                    var t = Ext.get(n),
                    i = t.up(".x-item-icon");
                    i && i.removeCls("x-loading x-select-target");
                    t.addCls("x-select-target");
                    n.removeAttribute("data-fallbackIconCls")
                },
                error: function(n) {
                    var i = Ext.get(n),
                    t;
                    i.setDisplayed("none");
                    t = i.up(".x-item-icon");
                    t && (t.removeCls("x-loading"), t.addCls(i.getAttribute("data-fallbackIconCls")));
                    n.removeAttribute("data-fallbackIconCls")
                },
                createImageFn: t,
                customBindEvents: function(t, r) {
                    if (r) {
                        n.on("scroll", t.onManualScroll, t);
                        i.on("resize", t.onManualResize, t)
                    } else n.un("scroll", t.onManualScroll, t),
                    i.un("resize", t.onManualResize, t)
                }
            })
        }
    },
    destroyLazyImageLoader: function() {
        this.lazyImageLoader && (this.lazyImageLoader.destroy(), this.lazyImageLoader = null)
    },
    getSelectionModel: function() {
        return this.activeViewComponent.getSelectionModel()
    },
    clearEmptyEl: function() {
        var n = this.viewLayout.component == "gridpanel" ? this.activeViewComponent.getView() : this.activeViewComponent;
        n && n.clearEmptyEl()
    }
});