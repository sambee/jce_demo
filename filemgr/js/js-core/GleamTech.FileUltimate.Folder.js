Ext.define("GleamTech.FileUltimate.FolderNodeModel", {
    extend: "GleamTech.FileUltimate.FolderItemModel",
    fields: [{
        name: "expandable"
    },
    {
        name: "hash"
    }],
    constructor: function() {
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
    },
    onNodeAdded: function(n, t) {
        n == this && (t.hasOwnProperty("childrenNotLoadedYet") && (t.set("loaded", !1), delete t.childrenNotLoadedYet), this.nameIndexer[Ext.data.SortTypes.asLocaleString(t.data.name)] = t)
    },
    onNodeRemove: function(n, t) {
        n == this && delete this.nameIndexer[Ext.data.SortTypes.asLocaleString(t.data.name)]
    },
    onBeforeExpand: function() {
        this.isLoaded() || this.setBusy(!0)
    },
    onExpand: function() {
        this.setBusy(!1)
    },
    showBusy: function() {
        if (!this.busyActive) {
            this.busyActive = !0;
            var n = Ext.get(this.getOwnerTree().getView().getNode(this));
            n.down(".x-tree-icon").addCls("x-loading")
        }
    },
    hideBusy: function() {
        if (this.busyActive) {
            this.busyActive = !1;
            var n = Ext.get(this.getOwnerTree().getView().getNode(this));
            n.down(".x-tree-icon").removeCls("x-loading")
        }
    },
    setBusy: function(n) {
        n ? this.busyTimeout = Ext.defer(this.showBusy, 200, this) : (clearTimeout(this.busyTimeout), this.hideBusy())
    },
    set: function() {
        var t = this.callParent(arguments),
        n = this;
        return n.modified && Ext.Object.each(n.modified,
        function(t, i) {
            if (t == "name") {
                n.onNameChange(i, n.data.name);
                return ! 1
            }
            return ! 0
        }),
        t
    },
    onNameChange: function(n, t) {
        var i = this.parentNode;
        i && (delete i.nameIndexer[Ext.data.SortTypes.asLocaleString(n)], i.nameIndexer[Ext.data.SortTypes.asLocaleString(t)] = this)
    },
    findChildNodeByName: function(n) {
        return this.nameIndexer[Ext.data.SortTypes.asLocaleString(n)]
    },
    getPathData: function() {
        for (var i = [], u = [], t = this, r, n; t.parentNode;) i.unshift(t.data.name),
        u.unshift(t.data.hash),
        t = t.parentNode;
        return r = GleamTech.Util.Path.backSlash,
        n = {},
        n.rootFolderName = i[0],
        n.rootFolderHash = u[0],
        n.relativePath = r + i.slice(1).join(r),
        n.fullPath = n.rootFolderName + ":" + n.relativePath,
        n
    }
});


Ext.define("GleamTech.FileUltimate.FolderItemModel", {
    extend: "Ext.data.Model",
    fields: [{
        name: "itemType"
    },
    {
        name: "name",
        sortType: "asLocaleString"
    },
    {
        name: "permissions"
    },
    {
        name: "fileTypes"
    },
    {
        name: "extension",
        calculate: function(n) {
            return n.itemType == GleamTech.FileUltimate.FileManagerItemType.File ? GleamTech.Util.Path.getExtension(n.name, !0) : ""
        }
    }],
    checkPermission: function(n) {
        return (this.data.permissions & n) == n
    },
    checkEitherPermissionName: function(n) {
        for (var i, r, t = 0; t < n.length; t++) if (i = n[t], r = GleamTech.FileUltimate.FileManagerPermissionTypes[i], this.checkPermission(r)) return ! 0;
        return ! 1
    },
    hasPermissions: function() {
        return this.data.permissions !== ""
    },
    combinePermissionsOfRecord: function(n) {
        n.hasPermissions() && (this.hasPermissions() ? this.data.permissions |= n.data.permissions: this.data.permissions = n.data.permissions)
    }
});