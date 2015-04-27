Ext.define("GleamTech.UI.ReferrerIframe", {
    el: null,
    window: null,
    constructor: function(n) {
        this.parentEl = n
    },
    setReferrer: function(n, t) {
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
        this.el.on("load",
        function() {
            Ext.callback(t, null, [!0])
        },
        null, {
            single: !0
        });
        this.parentEl.appendChild(this.el);
        this.window = this.el.dom.contentWindow || window.frames[this.el.dom.name]; ! this.window.eval && this.window.execScript && this.window.execScript("null")
    }
});