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
    constructor: function(n) {
        this.mixins.controlBase.constructor.call(this, n);
        this.callParent(arguments)
    },
    initComponent: function() {
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
    },
    onDestroy: function() {
        this.callParent();
        Ext.destroy(this.navigationStore, this.viewStore, this.navigationViewContainerContextMenu, this.navigationViewItemContextMenu, this.viewContainerContextMenu, this.viewItemContextMenu)
    },
    initLabels: function() {
        this.emptyViewText = GleamTech.Util.Language.getEntry("Message.EmptyView");
        this.emptyNavigationViewText = this.emptyViewText
    },
    initActions: function() {
        this.addActions([{
            actionName: "SelectAll",
            languageKey: "Label.SelectAll",
            iconName: "SelectAll"
        },
        {
            actionName: "SelectNone",
            languageKey: "Label.SelectNone",
            iconName: "SelectNone"
        },
        {
            actionName: "InvertSelection",
            languageKey: "Label.InvertSelection",
            iconName: "InvertSelection"
        },
        {
            actionName: "ToggleNavigationPane",
            languageKey: "Label.NavigationPane",
            iconName: "NavigationPane"
        },
        {
            actionName: "TogglePreviewPane",
            languageKey: "Label.PreviewPane",
            iconName: "PreviewPane"
        },
        {
            actionName: "ToggleDetailsPane",
            languageKey: "Label.DetailsPane",
            iconName: "DetailsPane"
        },
        {
            actionName: "ToggleLayoutExtraLargeIcons",
            languageKey: "Label.Layout.ExtraLargeIcons",
            iconName: "ExtraLargeIcons"
        },
        {
            actionName: "ToggleLayoutLargeIcons",
            languageKey: "Label.Layout.LargeIcons",
            iconName: "LargeIcons"
        },
        {
            actionName: "ToggleLayoutMediumIcons",
            languageKey: "Label.Layout.MediumIcons",
            iconName: "MediumIcons"
        },
        {
            actionName: "ToggleLayoutSmallIcons",
            languageKey: "Label.Layout.SmallIcons",
            iconName: "SmallIcons"
        },
        {
            actionName: "ToggleLayoutList",
            languageKey: "Label.Layout.List",
            iconName: "List"
        },
        {
            actionName: "ToggleLayoutDetails",
            languageKey: "Label.Layout.Details",
            iconName: "Details"
        },
        {
            actionName: "ToggleLayoutTiles",
            languageKey: "Label.Layout.Tiles",
            iconName: "Tiles"
        },
        {
            actionName: "ToggleLayoutContent",
            languageKey: "Label.Layout.Content",
            iconName: "Content"
        },
        {
            actionName: "Refresh",
            languageKey: "Label.Refresh.Verb",
            iconName: "Refresh"
        },
        {
            actionName: "Expand",
            languageKey: "Label.Expand"
        },
        {
            actionName: "Collapse",
            languageKey: "Label.Collapse"
        },
        {
            actionName: "Up",
            iconName: "Up"
        }], GleamTech.UI.ExplorerView.sprite)
    },
    initStores: function(n, t) {
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
        },
        n));
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
        },
        t))
    },
    getViewColumnsConfig: Ext.emptyFn,
    createRibbon: function() {
        return new GleamTech.UI.Ribbon({
            collapsed: this.collapseRibbon,
            region: "north",
            items: [{
                title: GleamTech.Util.Language.getEntry("Label.Home"),
                items: [{
                    title: GleamTech.Util.Language.getEntry("Label.Select"),
                    layout: "vbox",
                    items: [this.applyAction({},
                    "SelectAll", 16), this.applyAction({},
                    "SelectNone", 16), this.applyAction({},
                    "InvertSelection", 16)]
                }]
            },
            {
                title: GleamTech.Util.Language.getEntry("Label.View.Noun"),
                items: [{
                    title: GleamTech.Util.Language.getEntry("Label.Panes"),
                    items: [this.applyAction({
                        enableToggle: !0,
                        pressed: this.showNavigationPane,
                        iconAlign: "top"
                    },
                    "ToggleNavigationPane", 32)]
                },
                {
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
                        },
                        "ToggleLayoutExtraLargeIcons", 16), this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        },
                        "ToggleLayoutMediumIcons", 16), this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        },
                        "ToggleLayoutDetails", 16)]
                    },
                    {
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
                        },
                        "ToggleLayoutLargeIcons", 16), this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        },
                        "ToggleLayoutSmallIcons", 16), this.applyAction({
                            toggleGroup: this.id + "layoutGroup"
                        },
                        "ToggleLayoutTiles", 16)]
                    }]
                }]
            }]
        })
    },
    addRibbon: function() {
        this.ribbon || (this.ribbon = this.createRibbon(), this.add(this.ribbon))
    },
    removeRibbon: function() {
        this.ribbon && (this.remove(this.ribbon, !0), this.ribbon = null)
    },
    createNavigationBar: function() {
        return new Ext.toolbar.Toolbar({
            region: "north",
            cls: "x-navigationbar",
            items: [this.applyAction({
                text: "",
                focusable: !1,
                enableConditions: {
                    checkFn: function() {
                        return this.canUpNavigationSelection
                    },
                    scope: this
                }
            },
            "Up", 16), new GleamTech.UI.Breadcrumb({
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
                    checkFn: function() {
                        return this.isNavigationSelectionValid
                    },
                    scope: this
                }
            },
            "Refresh", 16), {
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
                    checkFn: function() {
                        return this.isNavigationSelectionValid
                    },
                    scope: this
                }
            })]
        })
    },
    addNavigationBar: function() {
        this.navigationBar || (this.navigationBar = this.createNavigationBar(), this.add(this.navigationBar))
    },
    removeNavigationBar: function() {
        this.navigationBar && (this.remove(this.navigationBar, !0), this.navigationBar = null)
    },
    createNavigationPane: function() {
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
                    afterrender: function(n) {
                        n.toolTip = new Ext.tip.ToolTip({
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
                                beforeshow: function(t) {
                                    var i = n.getRecord(t.triggerElement),
                                    r = i.data.name;
                                    t.update(r)
                                }
                            }
                        })
                    },
                    containercontextmenu: {
                        fn: this.onNavigationViewContainerContextMenu,
                        scope: this
                    },
                    itemcontextmenu: {
                        fn: this.onNavigationViewItemContextMenu,
                        scope: this
                    },
                    viewready: {
                        fn: function(n) {
                            if (this.navigationSelection) {
                                var t = n.getSelectionModel();
                                t.select(this.navigationSelection, !1, !0)
                            }
                        },
                        scope: this
                    },
                    destroy: function(n) {
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
    },
    addNavigationPane: function() {
        this.navigationPane || (this.navigationPane = this.createNavigationPane(), this.add(this.navigationPane))
    },
    removeNavigationPane: function() {
        this.navigationPane && (this.remove(this.navigationPane, !0), this.navigationPane = null)
    },
    createCenterPane: function() {
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
    },
    addCenterPane: function() {
        this.centerPane || (this.centerPane = this.createCenterPane(), this.add(this.centerPane))
    },
    removeCenterPane: function() {
        this.centerPane && (this.remove(this.centerPane, !0), this.centerPane = null)
    },
    createPreviewPane: function() {
        return new Ext.panel.Panel({
            region: "east",
            split: !0,
            collapsible: !0,
            animCollapse: !1,
            header: !0,
            title: GleamTech.Util.Language.getEntry("Label.PreviewPane"),
            width: 200
        })
    },
    addPreviewPane: function() {
        this.previewPane || (this.previewPane = this.createPreviewPane(), this.add(this.previewPane))
    },
    removePreviewPane: function() {
        this.previewPane && (this.remove(this.previewPane, !0), this.previewPane = null)
    },
    createDetailsPane: function() {
        return new Ext.panel.Panel({
            region: "east",
            split: !0,
            collapsible: !0,
            animCollapse: !1,
            header: !0,
            title: GleamTech.Util.Language.getEntry("Label.DetailsPane"),
            width: 200
        })
    },
    addDetailsPane: function() {
        this.detailsPane || (this.detailsPane = this.createDetailsPane(), this.add(this.detailsPane))
    },
    removeDetailsPane: function() {
        this.detailsPane && (this.remove(this.detailsPane, !0), this.detailsPane = null)
    },
    createStatusBar: function() {
        return new GleamTech.UI.StatusBar({
            region: "south",
            defaults: {
                focusable: !1
            },
            items: [this.applyAction({
                toggleGroup: this.id + "layoutGroup2",
                allowDepress: !1,
                text: ""
            },
            "ToggleLayoutDetails", 16), this.applyAction({
                toggleGroup: this.id + "layoutGroup2",
                allowDepress: !1,
                text: ""
            },
            "ToggleLayoutLargeIcons", 16)]
        })
    },
    addStatusBar: function() {
        this.statusBar || (this.statusBar = this.createStatusBar(), this.add(this.statusBar))
    },
    removeStatusBar: function() {
        this.statusBar && (this.remove(this.statusBar, !0), this.statusBar = null)
    },
    createMessageBox: function() {
        return new GleamTech.UI.MessageBox({
            buttonText: {
                ok: GleamTech.Util.Language.getEntry("Label.OK"),
                yes: GleamTech.Util.Language.getEntry("Label.Yes"),
                no: GleamTech.Util.Language.getEntry("Label.No"),
                cancel: GleamTech.Util.Language.getEntry("Label.Cancel")
            }
        })
    },
    createNavigationViewContainerContextMenu: function() {
        return new Ext.menu.Menu({
            listeners: {
                beforeshow: {
                    fn: this.onNavigationViewContainerContextMenuBeforeShow,
                    scope: this
                }
            }
        })
    },
    createNavigationViewItemContextMenu: function() {
        return new Ext.menu.Menu({
            listeners: {
                beforeshow: {
                    fn: this.onNavigationViewItemContextMenuBeforeShow,
                    scope: this
                }
            }
        })
    },
    createViewContainerContextMenu: function() {
        return new Ext.menu.Menu({
            listeners: {
                beforeshow: {
                    fn: this.onViewContainerContextMenuBeforeShow,
                    scope: this
                }
            }
        })
    },
    createViewItemContextMenu: function() {
        return new Ext.menu.Menu({
            listeners: {
                beforeshow: {
                    fn: this.onViewItemContextMenuBeforeShow,
                    scope: this
                }
            }
        })
    },
    getItemIconCls: function() {
        return ""
    },
    getItemThumbnailSrc: function() {
        return ""
    },
    onServerHandlerMethodBegin: function(n) {
        this.statusBar && !n.suppressStatusBusy && this.statusBar.setBusy(!0)
    },
    onServerHandlerMethodEnd: function(n, t) { (t && this.messageBox.errorWithDetails(t.title, t.msg, t.details, t.detailsType), this.statusBar && !n.suppressStatusBusy) && this.statusBar.setBusy(!1)
    },
    checkNavigationSelection: function(n) {
        return n != null && (n !== this.navigationStore.root || this.navigationStore.rootVisible)
    },
    setNavigationSelection: function(n) {
        var u = this.navigationSelection,
        i, r, t;
        this.navigationSelection = n || null;
        this.isNavigationSelectionValid = this.checkNavigationSelection(n);
        this.canUpNavigationSelection = this.isNavigationSelectionValid && this.checkNavigationSelection(n.parentNode);
        this.navigationBar && (i = this.navigationBar.getComponent("breadcrumb"), i.getSelection() != this.navigationSelection && i.setSelection(this.navigationSelection, !0, !0), r = this.navigationBar.getComponent("searchBox"), r.emptyText = this.isNavigationSelectionValid ? GleamTech.Util.Language.getEntry("Label.SearchSelected", this.navigationSelection.data.name) : " ", r.reset(!0));
        this.navigationPane && (t = this.navigationPane.getSelectionModel(), this.navigationSelection ? t.getSelection()[0] != this.navigationSelection && t.select(this.navigationSelection, !1, !0) : t.deselect(u, !0));
        this.viewStore.clearFilter(!0);
        this.isNavigationSelectionValid || (this.viewStore.removeAll(), this.centerPane.clearEmptyEl(), this.statusBar.setPrimaryText(null))
    },
    onNavigationSelectionChange: function(n, t) {
        this.setNavigationSelection(Ext.isArray(t) ? t[0] : t)
    },
    onNavigationStoreLoad: function(n, t, i, r, u) {
        i || u.collapse()
    },
    onViewStoreDataChanged: function(n) {
        var i, r, t;
        if (n.getCount() > this.detailsViewLayoutThreshold) {
            if (!this.viewLayoutBackup) {
                for (i = this.query("button[itemId^=ToggleLayout]"), t = 0; t < i.length; t++) r = i[t],
                r.itemId !== "ToggleLayoutDetails" && r.disable();
                this.viewLayoutBackup = this.centerPane.viewLayout.name;
                this.centerPane.setViewLayout("details")
            }
        } else if (this.viewLayoutBackup) {
            for (i = this.query("button[itemId^=ToggleLayout]"), t = 0; t < i.length; t++) r = i[t],
            r.itemId !== "ToggleLayoutDetails" && r.enable();
            this.centerPane.setViewLayout(this.viewLayoutBackup);
            delete this.viewLayoutBackup
        }
    },
    onViewStoreLoad: function(n, t, i) {
        if (i && this.statusBar) {
            var r = t.length;
            this.statusBar.setPrimaryText(r == 1 ? GleamTech.Util.Language.getEntry("Label.ItemCount", r) : GleamTech.Util.Language.getEntry("Label.ItemsCount", r))
        }
    },
    onViewRefresh: function() {
        this.getAction("ToggleLayout" + this.centerPane.viewLayout.name).each(function(n) {
            n.toggle(!0, !0);
            Ext.ButtonToggleManager.groups[n.toggleGroup] && Ext.ButtonToggleManager.toggleGroup(n, n.pressed)
        })
    },
    onViewSelectionChange: function(n, t) {
        var i, r, u; (this.viewSelection = t, this.statusBar) && (i = t.length, i == 0 ? this.statusBar.setSecondaryText(null) : (r = i == 1 ? GleamTech.Util.Language.getEntry("Label.SelectedItemCount", i) : GleamTech.Util.Language.getEntry("Label.SelectedItemsCount", i), u = this.getSelectionStatusText(t), u.length > 0 && (r += "&#160;&#160;" + u), this.statusBar.setSecondaryText(r)))
    },
    getSelectionStatusText: function() {
        return ""
    },
    onSearchBoxChange: function(n, t) {
        t.length == 0 ? this.viewStore.clearFilter() : this.viewStore.getFilters().replaceAll({
            property: "name",
            anyMatch: !0,
            value: t
        })
    },
    showContextMenu: function(n, t, i) {
        n.stopEvent();
        this.contextMenuSelection = i;
        t.showAt(n.getXY())
    },
    onNavigationViewContainerContextMenu: function(n, t) {
        this.navigationViewContainerContextMenu || (this.navigationViewContainerContextMenu = this.createNavigationViewContainerContextMenu());
        this.showContextMenu(t, this.navigationViewContainerContextMenu)
    },
    onNavigationViewItemContextMenu: function(n, t, i, r, u) {
        if (this.navigationViewItemContextMenu || (this.navigationViewItemContextMenu = this.createNavigationViewItemContextMenu()), this.showContextMenu(u, this.navigationViewItemContextMenu, t), !this.navigationViewItemContextMenu.hidden && !this.navigationPane.getSelectionModel().isSelected(t)) {
            var f = n.indexOf(t);
            n.onRowSelect(f);
            this.navigationViewItemContextMenu.on("hide",
            function() {
                n.onRowDeselect(f)
            },
            this, {
                single: !0
            })
        }
    },
    onViewContainerContextMenu: function(n, t) {
        this.viewContainerContextMenu || (this.viewContainerContextMenu = this.createViewContainerContextMenu());
        this.showContextMenu(t, this.viewContainerContextMenu)
    },
    onViewItemContextMenu: function(n, t, i, r, u) {
        this.viewItemContextMenu || (this.viewItemContextMenu = this.createViewItemContextMenu());
        this.showContextMenu(u, this.viewItemContextMenu, t)
    },
    onViewItemDblClick: Ext.emptyFn,
    onNavigationViewContainerContextMenuBeforeShow: Ext.emptyFn,
    onNavigationViewItemContextMenuBeforeShow: Ext.emptyFn,
    onViewContainerContextMenuBeforeShow: Ext.emptyFn,
    onViewItemContextMenuBeforeShow: Ext.emptyFn,
    onActionHandlerBegin: function(n) {
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
    },
    onActionSelectAll: function() {
        this.centerPane.getSelectionModel().selectAll()
    },
    onActionSelectNone: function() {
        this.centerPane.getSelectionModel().deselectAll()
    },
    onActionInvertSelection: function() {
        var n = this.centerPane.getSelectionModel();
        n.selectAll(!0);
        n.deselect(this.viewSelection)
    },
    onActionToggleNavigationPane: function(n) {
        n.pressed ? this.addNavigationPane() : this.removeNavigationPane()
    },
    onActionTogglePreviewPane: function(n) {
        n.pressed ? this.addPreviewPane() : this.removePreviewPane()
    },
    onActionToggleDetailsPane: function(n) {
        n.pressed ? this.addDetailsPane() : this.removeDetailsPane()
    },
    onActionToggleLayoutExtraLargeIcons: function(n) {
        n.pressed && this.centerPane.setViewLayout("extralargeicons")
    },
    onActionToggleLayoutLargeIcons: function(n) {
        n.toggleSameAction();
        n.pressed && this.centerPane.setViewLayout("largeicons")
    },
    onActionToggleLayoutMediumIcons: function(n) {
        n.pressed && this.centerPane.setViewLayout("mediumicons")
    },
    onActionToggleLayoutSmallIcons: function(n) {
        n.pressed && this.centerPane.setViewLayout("smallicons")
    },
    onActionToggleLayoutList: function(n) {
        n.pressed && this.centerPane.setViewLayout("list")
    },
    onActionToggleLayoutDetails: function(n) {
        n.toggleSameAction();
        n.pressed && this.centerPane.setViewLayout("details")
    },
    onActionToggleLayoutTiles: function(n) {
        n.pressed && this.centerPane.setViewLayout("tiles")
    },
    onActionToggleLayoutContent: function(n) {
        n.pressed && this.centerPane.setViewLayout("content")
    },
    onActionExpand: function() {
        this.contextMenuSelection.expand()
    },
    onActionCollapse: function() {
        this.contextMenuSelection.collapse()
    },
    onActionUp: function() {
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