

var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.ModalDialogDialogCssClass = "gt-modalDialog gt-nonSelectableText";
GleamTech.JavaScript.UI.ModalDialogTitleBarCssClass = "gt-modalDialogTitleBar";
GleamTech.JavaScript.UI.ModalDialogParentMaskCssClass = "gt-modalDialogParentMask";
GleamTech.JavaScript.UI.ModalDialogContentMaskCssClass = "gt-modalDialogContentMask";
GleamTech.JavaScript.UI.ModalDialogCloseImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABlElEQVR42mNgoBAwgojLJ04zdOeW/X96/yFRmqQV5RlKJ3cx6lqYQgyINrL/nxjnx+BkZUCUAfuOXWCYv2gTw9JzBxlZQAIvHj1mcDLXYWB4eJMoA0Bq21umgtkscNG/vxkYfv9kmH3xBcOu++/BQm6KgmAamZ+qLwFRCwUIA/4ABX/9ACtes3ImWCgkPB1MI/NTNQUgaqGACc76/YuB4ed3BjcZLhSNyJpBciA1YLUYBvz8wfD/6xeGFBkmBjdxVrghcM1AMZAcSA1ILYYXXly7yPDl2E4w+xOLMtBoCYa7d+/CFX56/pjh7mMIn+cPA6YLmFhYGJhY2Rk2sqkxnABq7mwrgysCsUFiIDmQGpBaTAPYOBiYObkZTjCIwjWXV3WBMdwQoBxIDUgthheYODgYWHh4GawZvsA1WXN8gRsE44PUgNRiGMDCwcXAysPPEMXznyGK4TNKwkHl84PVohggISfLcOz2awZbM0eiUuLRq4/Aehje3ENkpraMwv+vnjwjygAxGSmGiqk9jPrWFkSpxwsAVd+RBzp7tZ4AAAAASUVORK5CYII=";
GleamTech.JavaScript.UI.ModalDialogPromptImage = "data:image/png;base64,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";
GleamTech.JavaScript.UI.ModalDialog = function(n) {
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
GleamTech.JavaScript.UI.ModalDialog.prototype.calculateParentDimensions = function() {
    var i = this.parentNode.appendChild(this.parentDocument.createElement("div")),
    n,
    t;
    this.parentNode == this.parentDocument.body ? (this.parentLeft = GleamTech.JavaScript.Util.Viewport.GetScrollLeft(), this.parentTop = GleamTech.JavaScript.Util.Viewport.GetScrollTop(), this.parentWidth = GleamTech.JavaScript.Util.Viewport.GetWidth(), this.parentHeight = GleamTech.JavaScript.Util.Viewport.GetHeight()) : this.parentNode == i.offsetParent ? (this.parentLeft = 0, this.parentTop = 0, this.parentWidth = this.parentNode.clientWidth, this.parentHeight = this.parentNode.clientHeight) : (n = GleamTech.JavaScript.Util.FindPosition(this.parentNode), this.parentLeft = n[0], this.parentTop = n[1], this.parentNode.offsetParent && (t = GleamTech.JavaScript.Util.FindPosition(this.parentNode.offsetParent), this.parentLeft -= t[0], this.parentTop -= t[1]), this.parentWidth = this.parentNode.clientWidth, this.parentHeight = this.parentNode.clientHeight);
    this.parentRight = this.parentLeft + this.parentWidth;
    this.parentBottom = this.parentTop + this.parentHeight;
    this.parentNode.removeChild(i)
};
GleamTech.JavaScript.UI.ModalDialog.prototype.createParentMask = function() {
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
        this.elementParentMask.windowResizeEvent = function() {
            "ontouchstart" in window || setTimeout(function() {
                n.resizeParentMask()
            },
            200)
        };
        GleamTech.JavaScript.Util.AddEvent(window, "resize", this.elementParentMask.windowResizeEvent)
    }
};
GleamTech.JavaScript.UI.ModalDialog.prototype.removeParentMask = function() {
    this.elementParentMask && (this.dialogCount > 0 || (this.parentNode.removeChild(this.elementParentMask), GleamTech.JavaScript.Util.RemoveEvent(window, "resize", this.elementParentMask.windowResizeEvent), this.parentNode.style.overflow = this.oldParentOverflow, this.elementParentMask = null))
};
GleamTech.JavaScript.UI.ModalDialog.prototype.resizeParentMask = function() {
    this.calculateParentDimensions();
    this.elementParentMask.style.top = this.parentTop + "px";
    this.elementParentMask.style.left = this.parentLeft + "px";
    this.elementParentMask.style.width = this.parentWidth + "px";
    this.elementParentMask.style.height = this.parentHeight + "px"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.createDialog = function(n, t, i) {
    var c = this,
    r = this.parentDocument.createElement("div"),
    u,
    o,
    l,
    s,
    e,
    h,
    f;
    return r.className = GleamTech.JavaScript.UI.ModalDialogDialogCssClass,
    r.style.position = "absolute",
    r.style.zIndex = "1001",
    r.style.padding = "0px",
    r.style.width = n + "px",
    this.parentNode.appendChild(r),
    r.close = function() {
        c.Close(r)
    },
    u = this.parentDocument.createElement("div"),
    u.className = GleamTech.JavaScript.UI.ModalDialogTitleBarCssClass,
    u.style.padding = "3px",
    r.appendChild(u),
    GleamTech.JavaScript.Util.AddEvent(u, "mousedown",
    function(n) {
        c.onMoveStart(n, r)
    }),
    GleamTech.JavaScript.Util.AddEvent(u, "contextmenu", GleamTech.JavaScript.Util.CancelEvent),
    GleamTech.JavaScript.Util.AddEvent(u, "selectstart", GleamTech.JavaScript.Util.CancelEvent),
    GleamTech.JavaScript.Util.AddEvent(u, "dragstart", GleamTech.JavaScript.Util.CancelEvent),
    GleamTech.JavaScript.Util.AddEvent(u, "touchstart", GleamTech.JavaScript.Util.SimulateMouse),
    GleamTech.JavaScript.Util.AddEvent(u, "touchmove", GleamTech.JavaScript.Util.SimulateMouse),
    GleamTech.JavaScript.Util.AddEvent(u, "touchend", GleamTech.JavaScript.Util.SimulateMouse),
    o = this.parentDocument.createElement("div"),
    o.style.cssFloat = "left",
    o.style.styleFloat = "left",
    u.appendChild(o),
    l = this.parentDocument.createTextNode(i != null ? i: String.fromCharCode(160)),
    o.appendChild(l),
    s = this.parentDocument.createElement("div"),
    s.style.cssFloat = "right",
    s.style.styleFloat = "right",
    u.appendChild(s),
    e = this.parentDocument.createElement("img"),
    e.src = this.imgClose.src,
    e.style.width = "16px",
    e.style.height = "16px",
    s.appendChild(e),
    GleamTech.JavaScript.Util.AddEvent(e, "mousedown", GleamTech.JavaScript.Util.CancelEvent),
    GleamTech.JavaScript.Util.AddEvent(e, "click", r.close),
    GleamTech.JavaScript.Util.AddEvent(e, "touchstart", GleamTech.JavaScript.Util.SimulateClick),
    u.style.height = o.offsetHeight + "px",
    s.style.height = o.offsetHeight + "px",
    e.style.marginTop = (s.offsetHeight - e.offsetHeight) / 2 + "px",
    h = this.parentDocument.createElement("div"),
    h.style.width = n + "px",
    h.style.height = t + "px",
    r.appendChild(h),
    f = this.parentDocument.createElement("div"),
    f.className = GleamTech.JavaScript.UI.ModalDialogContentMaskCssClass,
    f.style.display = "none",
    f.style.position = "absolute",
    f.style.left = "0px",
    f.style.top = u.offsetHeight + "px",
    f.style.width = n + "px",
    f.style.height = t + "px",
    r.appendChild(f),
    GleamTech.JavaScript.Util.SetOpacity(f, 4),
    r.style.top = this.parentTop + (this.parentHeight - r.offsetHeight) / 2 + "px",
    r.style.left = this.parentLeft + (this.parentWidth - r.offsetWidth) / 2 + "px",
    this.dialogCount++,
    r.elementTitleBar = u,
    r.elementContent = h,
    r.elementContentMask = f,
    r
};
GleamTech.JavaScript.UI.ModalDialog.prototype.removeDialog = function(n) {
    this.parentNode.removeChild(n);
    this.dialogCount--
};
GleamTech.JavaScript.UI.ModalDialog.prototype.SetSize = function(n, t, i) {
    n.elementContent.style.width = t + "px";
    n.elementContent.style.height = i + "px";
    n.frameContent && (n.frameContent.style.width = t + "px", n.frameContent.style.height = i + "px");
    n.elementContentMask.style.left = "0px";
    n.elementContentMask.style.top = n.elementTitleBar.offsetHeight + "px";
    n.elementContentMask.style.width = t + "px";
    n.elementContentMask.style.height = i + "px"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.center = function(n) {
    n.style.top = this.parentTop + (this.parentHeight - n.offsetHeight) / 2 + "px";
    n.style.left = this.parentLeft + (this.parentWidth - n.offsetWidth) / 2 + "px"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.onMoveStart = function(n, t) {
    var r, u, f, i; (n || (n = window.event), r = n.which ? n.which == 1 : n.button == 1, r) && (u = n.pageX ? n.pageX: n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft(), f = n.pageY ? n.pageY: n.clientY + GleamTech.JavaScript.Util.Viewport.GetScrollTop(), t.relativeMouseX = u - t.offsetLeft, t.relativeMouseY = f - t.offsetTop, t.mouseMaxLeft = this.parentLeft, t.mouseMaxTop = this.parentTop, t.mouseMaxRight = this.parentRight - t.offsetWidth, t.mouseMaxBottom = this.parentBottom - t.offsetHeight, i = this, this.documentMouseUpEvent = function(n) {
        i.onMoveStop(n, t)
    },
    this.documentMouseMoveEvent = function(n) {
        i.onMove(n, t)
    },
    GleamTech.JavaScript.Util.AddEvent(t.ownerDocument, "mouseup", this.documentMouseUpEvent), GleamTech.JavaScript.Util.AddEvent(t.ownerDocument, "mousemove", this.documentMouseMoveEvent), t.elementContentMask.style.display = "block")
};
GleamTech.JavaScript.UI.ModalDialog.prototype.onMove = function(n, t) {
    var u;
    if (n || (n = window.event), u = n.which ? n.which == 1 : n.button == 1, !u) this.onMoveStop(n, t);
    var f = n.pageX ? n.pageX: n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft(),
    e = n.pageY ? n.pageY: n.clientY + GleamTech.JavaScript.Util.Viewport.GetScrollTop(),
    i = f - t.relativeMouseX,
    r = e - t.relativeMouseY;
    i < t.mouseMaxLeft && (i = t.mouseMaxLeft);
    i > t.mouseMaxRight && (i = t.mouseMaxRight);
    r < t.mouseMaxTop && (r = t.mouseMaxTop);
    r > t.mouseMaxBottom && (r = t.mouseMaxBottom);
    t.style.left = i + "px";
    t.style.top = r + "px"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.onMoveStop = function(n, t) {
    GleamTech.JavaScript.Util.RemoveEvent(t.ownerDocument, "mouseup", this.documentMouseUpEvent);
    GleamTech.JavaScript.Util.RemoveEvent(t.ownerDocument, "mousemove", this.documentMouseMoveEvent);
    t.elementContentMask.style.display = "none"
};
GleamTech.JavaScript.UI.ModalDialog.prototype.ShowElement = function(n, t, i, r, u) {
    var o, e, f;
    return this.createParentMask(),
    o = n.style.visibility,
    n.style.visibility = "hidden",
    i && i(),
    e = this,
    GleamTech.JavaScript.Util.EnsureDisplay(n,
    function(n) {
        f = e.createDialog(n.offsetWidth, n.offsetHeight, t)
    }),
    f.elementContent.appendChild(n),
    f.onClose = r,
    f.onClosed = u,
    n.style.visibility = o,
    f.windowResizeEvent = function() {
        setTimeout(function() {
            e.center(f)
        },
        200)
    },
    GleamTech.JavaScript.Util.AddEvent(window, "resize", f.windowResizeEvent),
    f
};
GleamTech.JavaScript.UI.ModalDialog.prototype.ShowUrl = function(n, t, i, r) {
    var f, u, e;
    return this.createParentMask(),
    f = this.createDialog(t, i, r),
    u = this.parentDocument.createElement("iframe"),
    u.style.backgroundColor = "transparent",
    u.allowTransparency = "true",
    u.scrolling = "no",
    u.frameBorder = "0",
    u.style.width = t + "px",
    u.style.height = i + "px",
    f.elementContent.appendChild(u),
    u.src = n,
    u.focus(),
    f.frameContent = u,
    e = this,
    f.windowResizeEvent = function() {
        setTimeout(function() {
            e.center(f)
        },
        200)
    },
    GleamTech.JavaScript.Util.AddEvent(window, "resize", f.windowResizeEvent),
    f
};
GleamTech.JavaScript.UI.ModalDialog.prototype.Prompt = function(n, t, i, r, u, f, e) {
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
    return v.style.border = "none",
    v.style.width = "32px",
    v.style.height = "32px",
    v.src = this.imgPrompt.src,
    nt.appendChild(v),
    b.appendChild(nt),
    k = this.parentDocument.createElement("td"),
    tt = this.parentDocument.createTextNode(n),
    k.appendChild(tt),
    b.appendChild(k),
    w = this.parentDocument.createElement("tr"),
    it = this.parentDocument.createElement("td"),
    w.appendChild(it),
    d = this.parentDocument.createElement("td"),
    s = this.parentDocument.createElement("input"),
    s.type = "text",
    s.style.width = "300px",
    s.value = t,
    s.disabled = u,
    d.appendChild(s),
    w.appendChild(d),
    g = this.parentDocument.createElement("tr"),
    c = this.parentDocument.createElement("td"),
    c.colSpan = 2,
    c.align = "center",
    l = this.parentDocument.createElement("input"),
    l.type = "button",
    l.value = this.OkButtonText,
    l.style.width = "82px",
    GleamTech.JavaScript.Util.AddEvent(l, "click",
    function() {
        var n = s.value;
        r(n) ? (y.Close(o), i(n)) : (s.value == "" && (s.value = t), s.select())
    }),
    c.appendChild(l),
    rt = this.parentDocument.createTextNode(String.fromCharCode(160) + String.fromCharCode(160)),
    c.appendChild(rt),
    a = this.parentDocument.createElement("input"),
    a.type = "button",
    a.value = this.CancelButtonText,
    a.style.width = "82px",
    GleamTech.JavaScript.Util.AddEvent(a, "click",
    function() {
        y.Close(o);
        i(null)
    }),
    c.appendChild(a),
    g.appendChild(c),
    p.appendChild(b),
    p.appendChild(w),
    p.appendChild(g),
    h.appendChild(p),
    o.elementContent.appendChild(h),
    typeof f == "undefined" && (f = 0),
    typeof e == "undefined" && (e = s.value.length),
    GleamTech.JavaScript.Util.SelectInputText(s, f, e),
    o.windowResizeEvent = function() {
        setTimeout(function() {
            y.center(o)
        },
        200)
    },
    GleamTech.JavaScript.Util.AddEvent(window, "resize", o.windowResizeEvent),
    o.okButton = l,
    o.cancelButton = a,
    o.keyDownEvent = function(n) {
        y.onKeyDown(n, o)
    },
    GleamTech.JavaScript.Util.AddEvent(o, "keydown", o.keyDownEvent),
    o
};
GleamTech.JavaScript.UI.ModalDialog.prototype.PromptAction = function(n, t, i, r, u, f) {
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
    return w.style.verticalAlign = "top",
    a = this.parentDocument.createElement("img"),
    a.style.border = "none",
    a.style.width = "32px",
    a.style.height = "32px",
    a.src = this.imgPrompt.src,
    w.appendChild(a),
    p.appendChild(w),
    b = this.parentDocument.createElement("td"),
    b.innerHTML = n.replace(/\n/g, "<br/>"),
    p.appendChild(b),
    k = this.parentDocument.createElement("tr"),
    s = this.parentDocument.createElement("td"),
    s.colSpan = 2,
    s.align = "center",
    c = this.parentDocument.createElement("input"),
    c.type = "button",
    c.value = t,
    c.style.width = "82px",
    c.style.height = "26px",
    GleamTech.JavaScript.Util.AddEvent(c, "click",
    function() {
        e.onClosed = null;
        v.Close(e);
        r()
    }),
    s.appendChild(c),
    s.appendChild(this.parentDocument.createTextNode(String.fromCharCode(160) + String.fromCharCode(160))),
    l = this.parentDocument.createElement("input"),
    l.type = "button",
    l.value = i,
    l.style.width = "82px",
    l.style.height = "26px",
    GleamTech.JavaScript.Util.AddEvent(l, "click",
    function() {
        e.onClosed = null;
        v.Close(e);
        u()
    }),
    s.appendChild(l),
    s.appendChild(this.parentDocument.createTextNode(String.fromCharCode(160) + String.fromCharCode(160))),
    h = this.parentDocument.createElement("input"),
    h.type = "button",
    h.value = this.CancelButtonText,
    h.style.width = "82px",
    h.style.height = "26px",
    GleamTech.JavaScript.Util.AddEvent(h, "click",
    function() {
        e.onClosed = null;
        v.Close(e);
        f()
    }),
    s.appendChild(h),
    k.appendChild(s),
    y.appendChild(p),
    y.appendChild(k),
    o.appendChild(y),
    e.elementContent.appendChild(o),
    e.onClosed = f,
    e.windowResizeEvent = function() {
        setTimeout(function() {
            v.center(e)
        },
        200)
    },
    GleamTech.JavaScript.Util.AddEvent(window, "resize", e.windowResizeEvent),
    e.cancelButton = h,
    e.keyDownEvent = function(n) {
        v.onKeyDown(n, e)
    },
    GleamTech.JavaScript.Util.AddEvent(e, "keydown", e.keyDownEvent),
    e
};
GleamTech.JavaScript.UI.ModalDialog.prototype.onKeyDown = function(n, t) {
    n || (n = window.event);
    switch (n.keyCode) {
    case 13:
        return t.okButton && t.okButton.click(),
        !1;
    case 27:
        return t.cancelButton.click(),
        !1
    }
    return ! 0
};
GleamTech.JavaScript.UI.ModalDialog.prototype.Close = function(n) {
    if (n.onClose) {
        var t = n.onClose();
        if (!t) return
    }
    this.removeDialog(n);
    this.removeParentMask();
    GleamTech.JavaScript.Util.RemoveEvent(window, "resize", n.windowResizeEvent);
    n.onClosed && n.onClosed()
};