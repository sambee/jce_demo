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
    constructor: function(n) {
        var t = this;
        t.callParent([n])
    },
    init: function(n) {
        var t = this; (n.isPanel ? (t.grid = n, t.view = n.getView()) : t.view = n, t.selModel = t.view.getSelectionModel(), t.selModel.getSelectionMode() != "SINGLE") && t.mon(t.view, "render", t.onRender, t)
    },
    onRender: function() {
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
    },
    syncScroll: function(n) {
        var t = this.scroller.getScroll().top;
        if (this.scrollTop = t - this.scrollTopStart, this.fillRegions(), this.dragging) this.onDrag(n, !0)
    },
    fillAllRegions: function() {
        var n = this,
        t = n.objectsSelected = [];
        n.mainRegion = n.scroller.getRegion();
        n.bodyRegion = n.scroller.getRegion();
        n.mainRegion.right = n.bodyRegion.right -= n.scrollbarWidth;
        n.mainRegion.bottom = n.bodyRegion.bottom -= n.scrollbarHeight;
        Ext.Object.each(n.view.all.elements,
        function() {
            t.push(n.selModel.isSelected(t.length))
        },
        n);
        n.syncScroll()
    },
    fillRegions: function() {
        var t = this.rs = [],
        n = this.view;
        Ext.Object.each(n.all.elements,
        function(i, r) {
            t.push({
                region: Ext.util.Region.getRegion(r),
                record: n.getRecord(r)
            })
        })
    },
    onBeforeStart: function(n) {
        if (n.button === 1) return ! 1;
        var t = n.getTarget(null, null, !0),
        i,
        r;
        return t.hasCls("x-select-target") || (i = this.view.findItemByChild(t)) && (r = this.view.getRecord(i)) && this.selModel.isSelected(r) ? !1 : (this.scrollbarWidth = this.scroller.dom.offsetWidth - this.scroller.dom.clientWidth, this.scrollbarHeight = this.scroller.dom.offsetHeight - this.scroller.dom.clientHeight, n.getX() > this.scroller.getX() + this.scroller.dom.clientWidth - 2 || n.getY() > this.scroller.getY() + this.scroller.dom.clientHeight - 2) ? !1 : (this.ctrlState = n.ctrlKey, this.shiftState = n.shiftKey, Ext.menu.Manager.hideAll(), !0)
    },
    onStart: function() {
        var n = this;
        n.scrollTopStart = n.scroller.getScroll().top;
        n.fillAllRegions();
        n.createProxy().show();
        n.dragging = !0;
        n.view.on("beforecontainerclick", n.cancelEvent, n, {
            single: !0
        })
    },
    cancelEvent: function() {
        return ! 1
    },
    createProxy: function() {
        if (this.proxy && !this.proxy.isDestroyed) {
            var n = this.view.getEl();
            return n.last() != this.proxy && n.appendChild(this.proxy),
            this.proxy
        }
        return this.proxy = this.view.getEl().createChild({
            tag: "div",
            cls: "x-view-selector"
        }),
        this.proxy
    },
    onDrag: function(n, t) {
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
        e,
        a;
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
        r[1] + 10 >= i.mainRegion.bottom && (Ext.isIE ? setTimeout(function() {
            e.scrollTo("top", e.getScroll().top + 40)
        },
        100) : i.setScrollTop(e.getScroll().top + i.scrollSpeed));
        r[1] - 10 <= i.mainRegion.top && (Ext.isIE ? setTimeout(function() {
            e.scrollTo("top", e.getScroll().top - 40)
        },
        100) : i.setScrollTop(e.getScroll().top - i.scrollSpeed))
    },
    setScrollTop: function(n) {
        var t = this.scroller.dom;
        t.scrollTop = Ext.Number.constrain(n, 0, t.scrollHeight - t.clientHeight)
    },
    onEnd: function() {
        var n = this;
        n.dragging = !1;
        n.proxy.hide();
        setTimeout(function() {
            n.view.un("beforecontainerclick", n.cancelEvent, n)
        },
        100)
    }
});