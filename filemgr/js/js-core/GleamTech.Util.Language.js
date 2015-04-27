Ext.define("GleamTech.Util.Language", {
    singleton: !0,
    name: "",
    entries: {},
    getEntry: function(n) {
        var i = Ext.Array.toArray(arguments),
        t = this.entries[n];
        if (t === undefined) throw new Error(Ext.String.format('Language entry with key "{0}" not found.', n));
        if (t == null) throw new Error(Ext.String.format('Value for language entry with key "{0}" is missing.', n));
        return i[0] = t,
        i.length > 1 ? Ext.String.format.apply(null, i) : t
    }
});