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
    initComponent: function() {
        if (this.clipboard = {
            isEmpty: !0
        },
        this.chooser && (this.viewMultipleSelection = this.chooserMultipleSelection), this.callParent(arguments), this.chooser) {
            this.chooserType = GleamTech.FileUltimate.FileManagerChooserType[this.chooserType];
            this.chooseButton = new Ext.button.Button(this.applyAction({
                enableConditions: {
                    itemTypes: function(n) {
                        switch (n.chooserType) {
                        case GleamTech.FileUltimate.FileManagerChooserType.Folder:
                            return {
                                Folder:
                                {
                                    multiple:
                                    n.chooserMultipleSelection
                                }
                            };
                        case GleamTech.FileUltimate.FileManagerChooserType.FileOrFolder:
                            return {
                                Folder:
                                {
                                    multiple:
                                    n.chooserMultipleSelection
                                },
                                File: {
                                    multiple: n.chooserMultipleSelection
                                }
                            };
                        default:
                            return {
                                File:
                                {
                                    multiple:
                                    n.chooserMultipleSelection
                                }
                            }
                        }
                    } (this)
                },
                minWidth: 75,
                disabled: !0
            },
            "Choose"));
            var n = new Ext.toolbar.Toolbar({
                ui: "footer",
                region: "south",
                layout: {
                    pack: "end"
                },
                items: [this.chooseButton, {
                    text: GleamTech.Util.Language.getEntry("Label.Cancel"),
                    minWidth: 75,
                    handler: function() {
                        this.hide()
                    },
                    scope: this
                }]
            });
            this.add(n);
            this.on("hide",
            function(n, t) {
                if (!this.hidingAfterChoose) this.onActionChoose(n, t)
            },
            this)
        }
        this.setNavigationSelection(this.loadInitialFolder() || this.navigationStore.getAt(0), null, !0);
        Ext.callback(window[this.loading], window, [this, null])
    },
    afterRender: function() {
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
    },
    onBoxReady: function() {
        if (Ext.callback(window[this.loaded], window, [this, null]), this.isNavigationSelectionValid) {
            var n = this.navigationSelection;
            this.navigationSelection = null;
            this.setNavigationSelection(n)
        }
        this.callParent(arguments)
    },
    initLabels: function() {
        this.callParent();
        this.emptyViewText = GleamTech.Util.Language.getEntry("Message.EmptyFolder");
        this.emptyNavigationViewText = GleamTech.Util.Language.getEntry("FileManager.Label.NoRootFolders")
    },
    initActions: function() {
        this.callParent();
        this.addActions([{
            actionName: "Cut",
            languageKey: "Label.Cut.Verb",
            iconName: "Cut"
        },
        {
            actionName: "Copy",
            languageKey: "Label.Copy.Verb",
            iconName: "Copy"
        },
        {
            actionName: "Paste",
            languageKey: "Label.Paste.Verb",
            iconName: "Paste"
        },
        {
            actionName: "Delete",
            languageKey: "Label.Delete",
            iconName: "Delete"
        },
        {
            actionName: "Rename",
            languageKey: "Label.Rename",
            iconName: "Rename"
        },
        {
            actionName: "NewFolder",
            languageKey: "Label.NewFolder",
            iconName: "NewFolder"
        },
        {
            actionName: "NewFile",
            languageKey: "Label.NewFile",
            iconName: "NewFile"
        },
        {
            actionName: "Download",
            languageKey: "Label.Download.Verb",
            iconName: "Download"
        },
        {
            actionName: "Upload",
            languageKey: "Label.Upload.Verb",
            iconName: "Upload"
        },
        {
            actionName: "Open",
            languageKey: "Label.Open.Verb",
            iconName: "Open"
        },
        {
            actionName: "AddToZip",
            languageKey: "Label.AddToZip",
            iconName: "AddToZip"
        },
        {
            actionName: "ExtractAll",
            languageKey: "Label.ExtractAll",
            iconName: "ExtractAll"
        },
        {
            actionName: "ExtractAllTo",
            languageKey: "Label.ExtractAllTo"
        },
        {
            actionName: "ExtractAllHere",
            languageKey: "Label.ExtractAllHere"
        },
        {
            actionName: "Choose",
            languageKey: "Label.Choose"
        }], GleamTech.FileUltimate.FileManager.sprite)
    },
    initStores: function() {
        var t = {
            model: "GleamTech.FileUltimate.FolderNodeModel",
            proxy: this.getServerHandlerMethodProxy({
                methodInfoCallback: function(n) {
                    return {
                        name: "ExpandFolder",
                        parameters: {
                            isRefresh: n.config.isRefresh == !0,
                            path: n.config.node.getPathData().fullPath
                        },
                        suppressStatusBusy: !0
                    }
                },
                readRecordsCallback: this.readFolderNodeRecords,
                scope: this
            }),
            clearOnLoad: !1,
            sorters: [{
                property: "itemType",
                direction: "ASC"
            },
            {
                property: "name",
                direction: "ASC"
            }]
        },
        i = {
            model: "GleamTech.FileUltimate.FolderViewModel",
            proxy: this.getServerHandlerMethodProxy({
                methodInfoCallback: function(n) {
                    return {
                        name: "ListFolder",
                        parameters: {
                            isRefresh: n.config.isRefresh == !0,
                            path: n.config.node.getPathData().fullPath
                        }
                    }
                },
                readRecordsCallback: this.readFolderViewRecords,
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
            fillNode: function(t, i) {
                for (var u = t.childNodes.length,
                r, f, e; u--;) r = t.childNodes[u],
                r.isExisting ? (r.data.expandable ? r.childNodes.length == 0 && r.set("loaded", !1) : r.removeAll(!1, !1, !0), delete r.isExisting) : t.removeChild(r);
                return f = this.sortOnLoad,
                this.sortOnLoad = !1,
                e = this.sorters,
                this.sorters = n,
                this.callParent(arguments),
                this.sortOnLoad = f,
                this.sorters = e,
                this.sortOnLoad && t.sort(),
                t.childNodes.length == 0 ? (t.set("expanded", !1), t.set("expandable", !1)) : (t.set("expanded", !0), t.set("expandable", !0)),
                i
            }
        });
        this.loadRootFolders()
    },
    getViewColumnsConfig: function() {
        var n = [{
            text: GleamTech.Util.Language.getEntry("Label.Column.Name"),
            dataIndex: "name",
            hideable: !1,
            flex: 1,
            isPrimary: !0
        },
        {
            text: GleamTech.Util.Language.getEntry("Label.Column.DateModified"),
            dataIndex: "lastModifiedTime",
            formatterFn: function(n) {
                return GleamTech.Util.Culture.formatShortDateTime(n)
            },
            isToolTipValue: !0,
            width: 125
        },
        {
            text: GleamTech.Util.Language.getEntry("Label.Column.Type"),
            dataIndex: "type",
            isTileFirstValue: !0,
            formatterFn: function(n, t) {
                return n ? n: t.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? t.data.extension ? GleamTech.Util.Language.getEntry("Label.FileType", t.data.extension.toUpperCase()) : GleamTech.Util.Language.getEntry("Label.File") : GleamTech.Util.Language.getEntry("Label.FolderType")
            },
            tileFormatterFn: function(n, t) {
                return t.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? n ? n: t.data.extension ? GleamTech.Util.Language.getEntry("Label.FileType", t.data.extension.toUpperCase()) : GleamTech.Util.Language.getEntry("Label.File") : ""
            },
            isToolTipValue: !0
        },
        {
            text: GleamTech.Util.Language.getEntry("Label.Column.Size"),
            dataIndex: "size",
            align: "right",
            formatterFn: function(n) {
                return GleamTech.Util.Culture.formatKBSize(n)
            },
            isTileSecondValue: !0,
            tileFormatterFn: function(n, t) {
                return t.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? GleamTech.Util.Culture.formatByteSize(n) : ""
            },
            isToolTipValue: !0,
            width: 85
        }];
        return this.showFileExtensions || (n[0].formatterFn = function(n, t) {
            return t.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? GleamTech.Util.Path.getFileNameWithoutExtension(n) : n
        }),
        n
    },
    createRibbon: function() {
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
            },
            "Copy", 32), this.applyAction({
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
                    checkFn: function() {
                        return this.isNavigationSelectionValid && !this.clipboard.isEmpty
                    },
                    scope: this
                },
                iconAlign: "top",
                rowspan: 3
            },
            "Paste", 32), {
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
                },
                "Cut", 16)]
            }]
        }),
        n.insertGroup(t, 1, {
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
            },
            "Delete", 32), this.applyAction({
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
            },
            "Rename", 32)]
        }),

        n.insertGroup(t, 2, {
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
                    checkFn: function() {
                        return this.isNavigationSelectionValid
                    },
                    scope: this
                },
                iconAlign: "top"
            },
            "NewFolder", 32)]
        }),

        n.insertGroup(t, 3, {
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
            },
            "Download", 32), this.applyAction({
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
                    checkFn: function() {
                        return this.isNavigationSelectionValid
                    },
                    scope: this
                },
                iconAlign: "top"
            },
            "Upload", 32)]
        }),
        n.insertGroup(t, 4, {
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
            },
            "Open", 32)]
        }),
        n.insertGroup(t, 5, {
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
            },
            "AddToZip", 32), this.applyAction({
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
                    items: [this.applyAction({},
                    "ExtractAllTo"), this.applyAction({},
                    "ExtractAllHere")]
                }
            },
            "ExtractAll", 32)]
        }),


        Crypto.MD5(this.id + this.serverStateId) != this.hash && n.tabBar.insert(n.tabBar.items.findIndex("xtype", "tbfill") + 1, {
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
        }),
        n
    },


    createNavigationPane: function() {
        var n = this.callParent();
        return this.showFileExtensions || n.setColumns([{
            xtype: "treecolumn",
            dataIndex: "name",
            flex: 1,
            renderer: function(n, t, i) {
                return i.data.itemType === GleamTech.FileUltimate.FileManagerItemType.File ? GleamTech.Util.Path.getFileNameWithoutExtension(n) : n
            }
        }]),
        n
    },

    createNavigationViewItemContextMenu: function() {
        var n = this.callParent();
        return n.add([this.applyAction({
            showConditions: {
                checkFn: function(n) {
                    return ! n.data.expanded
                }
            },
            enableConditions: {
                checkFn: function(n) {
                    return n.data.expandable
                }
            }
        },
        "Expand"), this.applyAction({
            showConditions: {
                checkFn: function(n) {
                    return n.data.expanded
                }
            }
        },
        "Collapse"), this.applyAction({},
        "Refresh", 16), {
            xtype: "menuseparator"
        },
        this.applyAction({},
        "Open", 16), this.applyAction({
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
        },
        "Download", 16), this.applyAction({
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
        },
        "Upload", 16), {
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
        },
        "AddToZip", 16), this.applyAction({
            showConditions: {
                itemTypes: {
                    File: {
                        parentPermissions: ["Extract"],
                        extensions: GleamTech.FileUltimate.ArchiveFileManager.getSupportedExtensions()
                    }
                }
            },
            hideOnClick: !1,
            menu: [this.applyAction({},
            "ExtractAllTo"), this.applyAction({},
            "ExtractAllHere")]
        },

        "ExtractAll", 16), {
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
        },

        "Cut", 16), this.applyAction({
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
        },

        "Copy", 16), this.applyAction({
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
                checkFn: function() {
                    return ! this.clipboard.isEmpty
                },
                scope: this
            }
        },

        "Paste", 16), {
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
        },

        "Delete", 16), this.applyAction({
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
        },
        "Rename", 16), {
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
        },
        "NewFolder", 16)]),
        n
    },
    createViewContainerContextMenu: function() {
        var n = this.callParent();
        return n.add([this.applyAction({
            showConditions: {
                checkFn: function() {
                    return this.isNavigationSelectionValid
                },
                scope: this
            }
        },
        "Refresh", 16), {
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
        },
        "Upload", 16), {
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
                checkFn: function() {
                    return ! this.clipboard.isEmpty
                },
                scope: this
            }
        },
        "Paste", 16), {
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
        },
        "NewFolder", 16), {
            xtype: "menuseparator"
        },
        this.applyAction({},
        "SelectAll", 16)]),
        n
    },

    createViewItemContextMenu: function() {
        var n = this.callParent();
        return this.chooser && n.add([this.applyAction({
            enableConditions: {
                itemTypes: function(n) {
                    switch (n.chooserType) {
                    case GleamTech.FileUltimate.FileManagerChooserType.Folder:
                        return {
                            Folder:
                            {
                                multiple:
                                n.chooserMultipleSelection
                            }
                        };
                    case GleamTech.FileUltimate.FileManagerChooserType.FileOrFolder:
                        return {
                            Folder:
                            {
                                multiple:
                                n.chooserMultipleSelection
                            },
                            File: {
                                multiple: n.chooserMultipleSelection
                            }
                        };
                    default:
                        return {
                            File:
                            {
                                multiple:
                                n.chooserMultipleSelection
                            }
                        }
                    }
                } (this)
            }
        },
        "Choose"), {
            xtype: "menuseparator"
        }]),
        n.add([this.applyAction({
            showConditions: {
                itemTypes: {
                    Folder: {},
                    File: {
                        parentPermissions: ["Download"]
                    }
                }
            }
        },
        "Open", 16), this.applyAction({
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
        },
        "Download", 16), this.applyAction({
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
        },
        "Upload", 16), {
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
        },
        "AddToZip", 16), this.applyAction({
            showConditions: {
                itemTypes: {
                    File: {
                        parentPermissions: ["Extract"],
                        extensions: GleamTech.FileUltimate.ArchiveFileManager.getSupportedExtensions()
                    }
                }
            },
            hideOnClick: !1,
            menu: [this.applyAction({},
            "ExtractAllTo"), this.applyAction({},
            "ExtractAllHere")]
        },
        "ExtractAll", 16), {
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
        },
        "Cut", 16), this.applyAction({
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
        },
        "Copy", 16), this.applyAction({
            showConditions: {
                itemTypes: {
                    Folder: {
                        permissions: ["Paste"]
                    }
                }
            },
            enableConditions: {
                checkFn: function() {
                    return ! this.clipboard.isEmpty
                },
                scope: this
            }
        },
        "Paste", 16), {
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
        },
        "Delete", 16), this.applyAction({
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
        },
        "Rename", 16), {
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
        },
        "NewFolder", 16), {
            xtype: "menuseparator"
        },
        this.applyAction({},
        "InvertSelection", 16)]),
        n
    },
    loadRootFolders: function() {
        this.navigationStore.sortOnLoad = this.sortRootFolders;
        var n = this.navigationStore.getRoot(),
        t = this.readFolderNodeRecords({
            config: {
                node: n
            }
        },
        {
            Folders: this.rootFolders
        });
        this.navigationStore.fillNode(n, t);
        this.navigationStore.sortOnLoad = !0
    },
    loadInitialFolder: function() {
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
        },
        {
            Folders: [[i[t], null, null, !0]]
        }), this.navigationStore.fillNode(n, r), n = r[0]);
        return n
    },
    readFolderNodeRecords: function(n, t) {
        var o = n.config.node,
        s = t.Folders,
        h = s.length,
        r, u, f, i, e;
        for (o.isRoot() ? (r = GleamTech.FileUltimate.FileManagerItemType.RootFolder, u = GleamTech.FileUltimate.FileIconManager.getBaseIconCls("RootFolder", 16)) : (r = GleamTech.FileUltimate.FileManagerItemType.Folder, u = GleamTech.FileUltimate.FileIconManager.getBaseIconCls("Folder", 16)), f = [], i = 0; i < h; i++) e = this.createFolderNodeRecord(s[i], o, r, u),
        e != null && f.push(e);
        return f
    },
    readFolderViewRecords: function(n, t) {
        for (var h, u, b, i = n.config.node,
        v = t.Folders,
        e = v.length,
        y = t.Files,
        p = y.length,
        r, o = new Array(e + p), s = [], f = 0; f < e; f++) h = v[f],
        o[f] = this.createFolderViewRecord(h, i, GleamTech.FileUltimate.FileManagerItemType.Folder),
        r = this.createFolderNodeRecord(h, i, GleamTech.FileUltimate.FileManagerItemType.Folder, GleamTech.FileUltimate.FileIconManager.getBaseIconCls("Folder", 16)),
        r != null && s.push(r);
        for (u = 0; u < p; u++) {
            var c = y[u],
            l,
            w = GleamTech.Util.Path.getExtension(c[0], !0),
            a = GleamTech.FileUltimate.ArchiveFileManager.isSupported(w);
            a && (l = !GleamTech.FileUltimate.ArchiveFileManager.isReadOnly(a) && i.checkPermission(GleamTech.FileUltimate.FileManagerPermissionTypes.Edit) && i.checkPermission(GleamTech.FileUltimate.FileManagerPermissionTypes.Compress) ? i.data.permissions: i.data.permissions & (GleamTech.FileUltimate.FileManagerPermissionTypes.ListSubfolders | GleamTech.FileUltimate.FileManagerPermissionTypes.ListFiles | GleamTech.FileUltimate.FileManagerPermissionTypes.Download | GleamTech.FileUltimate.FileManagerPermissionTypes.Copy), b = [c[0], l, null, !0], r = this.createFolderNodeRecord(b, i, GleamTech.FileUltimate.FileManagerItemType.File, GleamTech.FileUltimate.FileIconManager.getIconCls(w, 16)), r != null && s.push(r));
            r = o[e + u] = this.createFolderViewRecord(c, i, GleamTech.FileUltimate.FileManagerItemType.File);
            a && (r.data.permissions = l)
        }
        return n.config.folderNodeRecords = s,
        o
    },
    createFolderNodeRecord: function(n, t, i, r) {
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
    },
    createFolderViewRecord: function(n, t, i) {
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
    },
    getItemIconCls: function(n, t) {
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
    },
    getItemThumbnailSrc: function(n, t) {
        var i = n.data,
        r, u;
        return i.itemType != GleamTech.FileUltimate.FileManagerItemType.File || i.size == 0 ? "": GleamTech.FileUltimate.FileThumbnailManager.isSupported(i.extension) ? (r = this.navigationSelection.getPathData(), u = GleamTech.Util.Path.combine(this.serverHandlerUrl, "GetThumbnail?"), u + Ext.Object.toQueryString({
            relativePath: r.relativePath,
            fileName: i.name,
            maxSize: t,
            cacheKey: r.rootFolderHash + "-" + i.size + "-" + i.lastModifiedTime.getTime()
        })) : ""
    },
    setNavigationSelection: function(n, t, i) {
        var r = this.navigationSelection;
        n || (n = this.navigationStore.getCount() > 0 ? this.navigationStore.root: null);
        this.callParent([n]);
        this.isNavigationSelectionValid ? i || this.navigationSelection == r || this.viewStore.load({
            node: this.navigationSelection,
            previousNode: r,
            callback: t
        }) : (this.ribbon && (this.ribbon.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !1, !0)), this.ribbon.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !0))), this.navigationBar.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !0)))
    },
    onViewStoreLoad: function(n, t, i, r) {
        var u = r.config.node,
        f = r.config.previousNode,
        e = r.config.folderNodeRecords;
        i ? (this.ribbon && (this.ribbon.toggleItemsUICondition(this.getUIConditionFn(u, null, null, !1, !0)), this.ribbon.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !0))), this.navigationBar.toggleItemsUICondition(this.getUIConditionFn(null, null, null, !0)), this.navigationStore.fillNode(u, e), u.data.expanded = !1, u.expand()) : this.setNavigationSelection(f, null, !0);
        this.callParent(arguments)
    },
    onViewRefresh: function(n) {
        var i, t; 
		(this.callParent(arguments), this.isNavigationSelectionValid) 
			&& (i = GleamTech.Util.Path.combine(this.serverHandlerUrl, "GetThumbnailReferer?"), 
			i += Ext.Object.toQueryString(
			{
				stateId: this.serverStateId,
				rootFolderName: this.navigationSelection.getPathData().rootFolderName
			}), 
				t = this, this.referrerIframe.setReferrer(i,
        function(i) {
            i && t.referrerIframe.window.eval("function createImage() { return new Image(); }");
            t.centerPane.initLazyImageLoader(n, t.referrerIframe.window.createImage)
        }))
    },
    getSelectionStatusText: function(n) {
        var r = 0,
        u = n.length,
        t, i;
        if (u == 0) return "";
        for (t = 0; t < u; t++) {
            if (i = n[t].data, i.itemType != GleamTech.FileUltimate.FileManagerItemType.File) return "";
            r += i.size
        }
        return GleamTech.Util.Culture.formatByteSize(r)
    },
    onViewSelectionChange: function(n, t) {
        this.callParent(arguments);
        var i = this.getUIConditionFn(t[t.length - 1], t, this.navigationSelection, !0);
        this.ribbon && this.ribbon.toggleItemsUICondition(i);
        this.chooseButton && this.chooseButton.toggleUICondition(i)
    },
    onViewItemDblClick: function(n, t) {
        if (this.chooseButton && !this.chooseButton.disabled) {
            this.chooseButton.fireHandler();
            return
        }
        if (t.data.itemType != GleamTech.FileUltimate.FileManagerItemType.File || GleamTech.FileUltimate.ArchiveFileManager.isSupported(t.data.extension)) {
            var i = this.navigationSelection.findChildNodeByName(t.data.name);
            this.setNavigationSelection(i)
        } else this.navigationSelection.checkPermission(GleamTech.FileUltimate.FileManagerPermissionTypes.Download) && !this.chooseButton && this.submitDownloadForm(this.navigationSelection.getPathData().fullPath, t.data.name)
    },
    onNavigationViewItemContextMenuBeforeShow: function(n) {
        n.toggleItemsUICondition(this.getUIConditionFn(this.contextMenuSelection, null, this.contextMenuSelection.parentNode))
    },
    onViewContainerContextMenuBeforeShow: function(n) {
        n.toggleItemsUICondition(this.getUIConditionFn(this.navigationSelection))
    },

    onViewItemContextMenuBeforeShow: function(n) {
        n.toggleItemsUICondition(this.getUIConditionFn(this.contextMenuSelection, this.viewSelection, this.navigationSelection))
    },


    getUIConditionFn: function(n, t, i, r, u) {
        var s, f, e, c, o, h;
        if (t && t.length > 1) for (f = {},
        e = new GleamTech.FileUltimate.FolderItemModel, o = 0; o < t.length; o++) h = t[o],
        e.combinePermissionsOfRecord(h),
        f[h.data.itemType] = !0;
        else n && (s = Ext.Object.getKey(GleamTech.FileUltimate.FileManagerItemType, n.data.itemType), f = !1, n.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File && (c = n.data.extension.toLowerCase()));
        return function(o, h, l) {
            var a, v, y, p, w;
            if (h && r || l && u || (v = o[h ? "showConditions": "enableConditions"], !v)) return undefined;
            if (Ext.isFunction(v.checkFn)) return Ext.callback(v.checkFn, v.scope, [n, t, i]);
            if (f) {
                for (y in f) if (p = Ext.Object.getKey(GleamTech.FileUltimate.FileManagerItemType, +y), a = v.itemTypes[p], !a || !a.multiple) return ! 1;
                for (w in v.itemTypes) if ((a = v.itemTypes[w], a.parentPermissions && i && !i.checkEitherPermissionName(a.parentPermissions)) || a.permissions && e.hasPermissions() && !e.checkEitherPermissionName(a.permissions)) return ! 1;
                return ! 0
            }
            if (s && v.itemTypes) {
                if ((a = v.itemTypes[s], !a) || a.parentPermissions && i && !i.checkEitherPermissionName(a.parentPermissions) || a.permissions && !n.checkEitherPermissionName(a.permissions)) return ! 1;
                if (!a.extensions || Ext.Array.contains(a.extensions, c)) return ! 0
            }
            return ! 1
        }
    },
    setClipboard: function(n, t, i) {
        this.clearClipboard();
        this.clipboard.action = n;
        this.clipboard.folderNodeRecord = t;
        this.clipboard.records = Ext.Array.clone(i);
        this.clipboard.isEmpty = !1;
        this.isNavigationSelectionValid && this.getAction("Paste").enable()
    },
    clearClipboard: function() {
        delete this.clipboard.action;
        delete this.clipboard.folderNodeRecord;
        this.clipboard.records && this.clipboard.records.length && (this.clipboard.records.length = 0);
        delete this.clipboard.records;
        this.clipboard.isEmpty = !0;
        this.getAction("Paste").disable()
    },
    refreshFolderNode: function(n, t) {
        n == this.navigationSelection ? this.viewStore.load({
            node: n,
            isRefresh: !0,
            callback: t
        }) : this.navigationStore.load({
            node: n,
            isRefresh: !0,
            callback: t
        })
    },
    submitDownloadForm: function(n, t, i, r) {
        for (var u, f, e; this.downloadForm.dom.firstChild;) this.downloadForm.dom.removeChild(this.downloadForm.dom.firstChild);
        i == GleamTech.FileUltimate.FileManagerDownloadMethod.DownloadAsZip ? (u = GleamTech.Util.Path.combine(this.serverHandlerUrl, "DownloadAsZip"), f = {
            stateId: this.serverStateId,
            path: n,
            itemNames: r,
            zipFileName: t
        },
        this.downloadForm.set({
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
        },
        this.downloadForm.set({
            method: "get",
            action: u
        }), Ext.Object.each(f,
        function(n, t) {
            this.downloadForm.createChild({
                tag: "input",
                name: n,
                type: "hidden"
            }).dom.value = t
        },
        this));
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
                    fn: function() {
                        var n = e.el.query("iframe", !1)[0],
                        t = n.dom.contentWindow || window.frames[n.dom.name];
                        n.on("load",
                        function() {
                            var i, r, n;
                            try {
                                i = t.document.body;
                                r = t.document.title
                            } catch(u) {
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
                    },
                    scope: this
                }
            }
        }), e.show()) : (this.downloadForm.set({
            target: this.downloadIframe.dom.name
        }), this.downloadForm.dom.submit())
    },
    getItemNameWithType: function(n) {
        return n.data.itemType == GleamTech.FileUltimate.FileManagerItemType.Folder ? n.data.name + "\\": n.data.name
    },
    getItemNamesWithType: function(n) {
        return Ext.Array.map(n,
        function(n) {
            return this.getItemNameWithType(n)
        },
        this)
    },
    getItemNameAsFolder: function(n) {
        return n + "\\"
    },
    onActionRefresh: function(n, t, i) {
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
    },
    onActionCut: function(n, t, i) {
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
    },
    onActionCopy: function(n, t, i) {
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
    },
    onActionPaste: function(n, t, i) {
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
        this.clipboard.action == GleamTech.FileUltimate.FileManagerClipboardAction.Cut && Ext.Array.each(this.clipboard.records,
        function(n) {
            var t = u.findChildNodeByName(n.data.name);
            return t && (t == this.navigationSelection || t.contains(this.navigationSelection)) ? (f = !0, !1) : !0
        },
        this);
        this.callServerHandlerMethod({
            name: this.clipboard.action == GleamTech.FileUltimate.FileManagerClipboardAction.Cut ? "Move": "Copy",
            parameters: {
                path: u.getPathData().fullPath,
                itemNames: this.getItemNamesWithType(this.clipboard.records),
                targetPath: r.getPathData().fullPath
            },
            callback: function(n) {
                if (n) {
                    var i = this,
                    t = null;
                    r != u && (t = function() {
                        r.parentNode && i.refreshFolderNode(r)
                    });
                    f ? this.setNavigationSelection(u, t) : this.refreshFolderNode(u, t)
                }
            },
            scope: this
        });
        this.clipboard.action == GleamTech.FileUltimate.FileManagerClipboardAction.Cut && this.clearClipboard()
    },
    onActionDelete: function(n, t, i) {
        var u, r, s = !1,
        f, e, o;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.NavigationViewItem:
            u = this.contextMenuSelection.parentNode;
            r = [this.contextMenuSelection]; (this.contextMenuSelection == this.navigationSelection || this.contextMenuSelection.contains(this.navigationSelection)) && (s = !0);
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
        this.messageBox.confirm(f, e,
        function(n) {
            n == "yes" && this.callServerHandlerMethod({
                name: "Delete",
                parameters: {
                    path: u.getPathData().fullPath,
                    itemNames: this.getItemNamesWithType(r)
                },
                callback: function(n) {
                    n && (s ? this.setNavigationSelection(u) : this.refreshFolderNode(u))
                },
                scope: this
            })
        },
        this)
    },
    onActionRename: function(n, t, i) {
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
        f.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? (c = GleamTech.Util.Path.getExtension(r), o = GleamTech.Util.Path.getFileNameWithoutExtension(r), e = this.showFileExtensions ? r: o, s = !this.showFileExtensions, h = o.length) : (e = r, s = !1, h = r.length);
        this.messageBox.promptWithValidator(GleamTech.Util.Language.getEntry("Label.RenameItem"), GleamTech.Util.Language.getEntry("Message.Prompt.RenameItem"),
        function(n, t) {
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
                    callback: function(n) {
                        if (n) {
                            var t = u.findChildNodeByName(r);
                            t && (t.set("name", i), t.commit());
                            this.refreshFolderNode(u)
                        }
                    },
                    scope: this
                })
            }
        },
        this, e, h,
        function(n) {
            return n == e || Ext.String.trim(n) == "" ? !1 : GleamTech.Util.Path.isValidFileName(n) ? !0 : GleamTech.Util.Language.getEntry("Message.Error.InvalidFileName") + '<br/>&emsp;&emsp;&emsp; \\ / : * ? " < > |'
        })
    },
    onActionNewFolder: function(n, t, i) {
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
        this.messageBox.promptWithValidator(GleamTech.Util.Language.getEntry("Label.CreateFolder"), GleamTech.Util.Language.getEntry("Message.Prompt.CreateFolder"),
        function(n, t) {
            n == "ok" && this.callServerHandlerMethod({
                name: "Create",
                parameters: {
                    path: r.getPathData().fullPath,
                    itemName: this.getItemNameAsFolder(t)
                },
                callback: function(n) {
                    n && this.refreshFolderNode(r)
                },
                scope: this
            })
        },
        this, u, u.length,
        function(n) {
            return Ext.String.trim(n) == "" ? !1 : GleamTech.Util.Path.isValidFileName(n) ? !0 : GleamTech.Util.Language.getEntry("Message.Error.InvalidFileName") + '<br/>&emsp;&emsp;&emsp; \\ / : * ? " < > |'
        })
    },
    onActionDownload: function(n, t, i) {
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
    },
    onActionUpload: function(n, t, i) {
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
        }), this.fileUploader.Parameters.ModalDialogTitle = this.fileUploader.Language.GetEntry("FileManager.Action.UploadFiles"), this.fileUploader.GridView.useIconCls = !0, this.fileUploader.getFileIconName = function(n) {
            return GleamTech.FileUltimate.FileIconManager.getIconCls(n, 16)
        }), this.fileUploader.SetFileTypes(r.data.fileTypes), this.fileUploader.SetCustomParameters({
            fileManagerStateId: this.serverStateId,
            fileManagerPath: r.getPathData().fullPath
        }), r == this.navigationSelection) {
            var f = [],
            u = this,
            e = this.centerPane.getSelectionModel();
            this.fileUploader.ItemUploaded = function(n) {
                f.push(Ext.data.SortTypes.asLocaleString(n));
                u.refreshFolderNode(r);
                u.viewStore.on("refresh",
                function() {
                    for (var r, t, i = [], n = 0; n < f.length; n++) r = f[n],
                    t = u.viewStore.findBy(function(n) {
                        return Ext.data.SortTypes.asLocaleString(n.data.name) == r
                    }),
                    t > -1 && i.push(u.viewStore.getAt(t));
                    e.select(i)
                },
                this, {
                    single: !0
                })
            }
        } else this.fileUploader.ItemUploaded = null;
        this.fileUploader.Show()
    },
    onActionOpen: function(n, t, i) {
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
    },
    onActionAddToZip: function(n, t, i) {
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
        u.data.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? (o = GleamTech.Util.Path.getFileNameWithoutExtension(e), h = this.showFileExtensions ? o + s: o, c = !this.showFileExtensions, l = o.length) : (h = e, c = !0, l = e.length);
        this.messageBox.promptWithValidator(GleamTech.Util.Language.getEntry("Label.AddItemsToZip"), GleamTech.Util.Language.getEntry("Message.Prompt.AddItemsToZip"),
        function(n, t) {
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
                    callback: function(n) {
                        n && this.refreshFolderNode(r)
                    },
                    scope: this
                })
            }
        },
        this, h, l,
        function(n) {
            return Ext.String.trim(n) == "" ? !1 : GleamTech.Util.Path.isValidFileName(n) ? !0 : GleamTech.Util.Language.getEntry("Message.Error.InvalidFileName") + '<br/>&emsp;&emsp;&emsp; \\ / : * ? " < > |'
        })
    },
    onActionExtractAllTo: function(n, t, i) {
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
        this.messageBox.promptWithValidator(GleamTech.Util.Language.getEntry("Label.ExtractItemsFromArchive"), GleamTech.Util.Language.getEntry("Message.Prompt.ExtractItemsFromArchive"),
        function(n, t) {
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
                    callback: function(n) {
                        n && this.refreshFolderNode(r)
                    },
                    scope: this
                })
            }
        },
        this, e, e.length,
        function(n) {
            return Ext.String.trim(n) == "" ? !1 : GleamTech.Util.Path.isValidFileName(n) ? !0 : GleamTech.Util.Language.getEntry("Message.Error.InvalidFileName") + '<br/>&emsp;&emsp;&emsp; \\ / : * ? " < > |'
        })
    },
    onActionExtractAllHere: function(n, t, i) {
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
            callback: function(n) {
                n && this.refreshFolderNode(r)
            },
            scope: this
        })
    },
    onActionChoose: function(n, t, i) {
        var f, e, o, r, u;
        switch (i) {
        case GleamTech.UI.ExplorerViewActionContext.View:
        case GleamTech.UI.ExplorerViewActionContext.ViewItem:
            for (this.hidingAfterChoose = !0, this.hide(), delete this.hidingAfterChoose, e = this.navigationSelection.getPathData().fullPath, o = [], r = 0; r < this.viewSelection.length; r++) u = this.viewSelection[r],
            o.push({
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