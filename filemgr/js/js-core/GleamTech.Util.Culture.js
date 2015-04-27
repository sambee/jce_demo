Ext.define("GleamTech.Util.Culture", {
    singleton: !0,
    cultureInfo: Globalize.cultures.en,
    byteUnits: ["Bytes", "KB", "MB", "GB", "TB"],
    format: function(n, t) {
        return Globalize.format(n, t, this.cultureInfo)
    },
    formatShortDateTime: function(n) {
        return this.format(n, "d") + " " + this.format(n, "t")
    },
    formatByteSize: function(n) {
        var t, i, r, u, f;
        if (n == null) return null;
        for (n = +n, t = 0, i = this.byteUnits.length - 1; n >= 1e3 && t < i;) n /= 1024,
        t++;
        return r = "n" + this.getDecimalPlaceCount(n, 3),
        u = Math.round,
        Math.round = function(n) {
            return n
        },
        f = this.format(n, r),
        Math.round = u,
        GleamTech.Util.Language.getEntry("Label.ByteSizeUnit." + this.byteUnits[t], f)
    },
    formatKBSize: function(n) {
        var t, i;
        return n == null ? null: (n = +n, n /= 1024, t = Math.round, Math.round = function(n) {
            return Math.ceil(n)
        },
        i = this.format(n, "n0"), Math.round = t, GleamTech.Util.Language.getEntry("Label.ByteSizeUnit.KB", i))
    },
    getDecimalPlaceCount: function(n, t) {
        for (var o, r = n.toString(), u = 0, f = 0, e = !1, i = 0, s = r.length; i < s; i++) if (o = r.charAt(i), o == "." && (e = !0), e && f++, u++, u == t) break;
        return f
    }
});