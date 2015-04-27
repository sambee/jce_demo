var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.ContextMenuCount = 0;
GleamTech.JavaScript.UI.ContextMenuPopupImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAJCAMAAADNcxasAAAABlBMVEX19fUAAADRVAjdAAAAAXRSTlMAQObYZgAAABtJREFUCNdjYGQAAUZGCMkIIRkhJCOCjVADIgAC7QAadtCx+AAAAABJRU5ErkJggg==";
GleamTech.JavaScript.UI.ContextMenuPopupHoverImage = GleamTech.JavaScript.UI.ContextMenuPopupImage;
GleamTech.JavaScript.UI.ContextMenuSelectionImage = "";
GleamTech.JavaScript.UI.ContextMenuIconsPath = {};
GleamTech.JavaScript.UI.ContextMenuCssClass = "gt-contextMenu";
GleamTech.JavaScript.UI.ContextMenuSeparatorCssClass = "gt-contextMenuSeparator";
GleamTech.JavaScript.UI.ContextMenuVerticalSeparatorCssClass = "gt-contextMenuVerticalSeparator";
GleamTech.JavaScript.UI.ContextMenuItemCssClass = "gt-contextMenuItem";
GleamTech.JavaScript.UI.ContextMenuItemHoverCssClass = "gt-contextMenuItem gt-contextMenuItem-hover";
GleamTech.JavaScript.UI.ContextMenuItemDisabledCssClass = "gt-contextMenuItem gt-contextMenuItem-disabled";
GleamTech.JavaScript.UI.ContextMenuItemIconCssClass = "gt-contextMenuItemIcon";
GleamTech.JavaScript.UI.ContextMenuItemRoundBorders = !1;
GleamTech.JavaScript.UI.ContextMenu = function() {
    this.index = GleamTech.JavaScript.UI.ContextMenuCount++;
    this.items = [];
    this.menuItems = {};
    this.divElement = null;
    this.iconWidth = 16;
    this.iconHeight = 16;
    this.hidden = !0;
    this.itemClicked = !1;
    this.left = 0;
    this.top = 0;
    this.right = 0;
    this.bottom = 0;
    this.lastSubmenu = null;
    this.showLeft = !1;
    this.defaultMenuItem = null;
    this.parentMenuItem = null;
    this.depth = 0;
    this.target = null;
    this.onMenuItemClick = null;
    this.imgPopup = new Image;
    this.imgPopup.src = GleamTech.JavaScript.UI.ContextMenuPopupImage;
    this.imgPopupHover = new Image;
    this.imgPopupHover.src = GleamTech.JavaScript.UI.ContextMenuPopupHoverImage;
    GleamTech.JavaScript.UI.ContextMenuSelectionImage && (this.imgSelection = new Image, this.imgSelection.src = GleamTech.JavaScript.UI.ContextMenuSelectionImage)
};
GleamTech.JavaScript.UI.ContextMenu.Parse = function(n, t, i, r) {
    var o = {},
    u = t.ContextMenus,
    s = function(t, i, r) {
        var f = new GleamTech.JavaScript.UI.ContextMenu,
        c, o, u, h, e, l;
        for (f.onMenuItemClick = i, t.Item.length || (c = t.Item, t.Item = [], t.Item[0] = c), o = 0; o < t.Item.length; o++) u = t.Item[o],
        h = u.action,
        h == "[Separator]" ? f.AddSeparator() : (e = f.AddMenuItem(h, u.text ? r.GetEntry(u.text) : h, u.description, u.icon), e.ParentPermissionList = u.parentPermissionList, e.PermissionList = u.permissionList, u.isDefault == "yes" && f.SetDefault(e), u.ContextMenu && (l = s(u.ContextMenu, i, r), e.SetSubmenu(l)));
        return f.Render(n ? n: document.body),
        f.container = n,
        f
    },
    h,
    f,
    e,
    c;
    for (u.ContextMenu.length || (h = u.ContextMenu, u.ContextMenu = [], u.ContextMenu[0] = h), f = 0; f < u.ContextMenu.length; f++) e = u.ContextMenu[f],
    c = s(e, i, r),
    o[e.Name] = c;
    return o
};
GleamTech.JavaScript.UI.ContextMenu.prototype.SetIconSize = function(n, t) {
    this.iconWidth = n;
    this.iconHeight = t
};
GleamTech.JavaScript.UI.ContextMenu.prototype.AddMenuItem = function(n, t, i, r) {
    var u = new GleamTech.JavaScript.UI.ContextMenuItem(n, t, i, r);
    return u.menu = this,
    u.index = this.items.length,
    this.items[u.index] = u,
    this.menuItems[n] = u,
    u
};
GleamTech.JavaScript.UI.ContextMenu.prototype.AddSeparator = function() {
    var n = new GleamTech.JavaScript.UI.ContextMenuSeparator;
    n.menu = this;
    n.index = this.items.length;
    this.items[n.index] = n
};
GleamTech.JavaScript.UI.ContextMenu.prototype.InsertMenuItem = function(n, t, i, r, u) {
    var f = new GleamTech.JavaScript.UI.ContextMenuItem(t, i, r, u),
    e;
    for (f.menu = this, f.index = n, this.items.splice(n, 0, f), this.menuItems[t] = f, e = 0; e < this.items.length; e++) this.items[e].index = e;
    return f.Render(this.divElement, this.items[n + 1].divElement),
    f
};
GleamTech.JavaScript.UI.ContextMenu.prototype.SetDefault = function(n) {
    this.defaultMenuItem && this.defaultMenuItem.spanElement && (this.defaultMenuItem.spanElement.style.fontWeight = "");
    this.defaultMenuItem = n;
    n.spanElement && (n.spanElement.style.fontWeight = "bold")
};
GleamTech.JavaScript.UI.ContextMenu.prototype.Render = function(n) {
    var i = this,
    t = document.createElement("div"),
    r;
    for (t.className = GleamTech.JavaScript.UI.ContextMenuCssClass, t.style.position = "absolute", t.style.display = "none", t.style.visibility = "hidden", t.style.cursor = "default", GleamTech.JavaScript.Util.AddEvent(t, "mousedown",
    function(n) {
        return i.onCancelEvent(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mouseup",
    function(n) {
        return i.onCancelEvent(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "contextmenu", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(t, "selectstart", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(t, "dragstart", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(t, "touchstart",
    function(n) {
        return i.onCancelEvent(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "touchend",
    function(n) {
        return i.onCancelEvent(n)
    }), this.divElement = t, n.appendChild(t), this.verticalSeparator = document.createElement("div"), this.divElement.appendChild(this.verticalSeparator), this.verticalSeparator.className = GleamTech.JavaScript.UI.ContextMenuVerticalSeparatorCssClass, this.verticalSeparator.style.position = "absolute", this.verticalSeparator.style.width = "1px", this.verticalSeparator.style.left = "29px", r = 0; r < this.items.length; r++) this.items[r].Render(t)
};
GleamTech.JavaScript.UI.ContextMenu.prototype.CalculateDimensions = function() {
    for (var n, r, t = 0,
    i = 0; i < this.items.length; i++) n = this.items[i],
    n.hidden || (n.isSeparator ? (n.divElement.clientHeight > 1 && (n.divElement.style.height = "1px"), t += 8) : (n.topDistance = t, n.calculatedHeight = n.divElement.offsetHeight, t += n.calculatedHeight, n.submenu && (n.imgPopup.style.top = (n.divElement.clientHeight == 0 ? (n.divElement.offsetHeight - 2 - n.imgPopup.offsetHeight) / 2 : (n.divElement.clientHeight - n.imgPopup.offsetHeight) / 2) + "px")));
    this.calculatedWidth = this.divElement.offsetWidth;
    this.calculatedHeight = this.divElement.offsetHeight;
    this.verticalSeparator.style.height = this.divElement.clientHeight - 4 + "px";
    r = GleamTech.JavaScript.Util.FindPosition(this.divElement.offsetParent);
    this.parentLeft = r[0];
    this.parentTop = r[1]
};
GleamTech.JavaScript.UI.ContextMenu.prototype.onCancelEvent = function(n) {
    return this.itemClicked ? (this.itemClicked = !1, !1) : GleamTech.JavaScript.Util.CancelEvent(n)
};
GleamTech.JavaScript.UI.ContextMenu.prototype.Popup = function(n, t) {
    var u, i, r, f, e;
    GleamTech.JavaScript.Util.DeSelectAllRanges();
    u = this;
    GleamTech.JavaScript.Util.EnsureDisplay(this.divElement,
    function() {
        u.CalculateDimensions()
    });
    i = n.pageX ? n.pageX: n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft();
    r = n.pageY ? n.pageY: n.clientY + GleamTech.JavaScript.Util.Viewport.GetScrollTop();
    i -= this.parentLeft;
    r -= this.parentTop;
    f = this.container.offsetWidth - i;
    e = this.container.offsetHeight - r;
    f < this.calculatedWidth && (i -= this.calculatedWidth);
    e < this.calculatedHeight && (r -= this.calculatedHeight);
    this.target = t;
    this.Show(i, r);
    GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu = function(n) {
        u.HidePopup(n)
    };
    GleamTech.JavaScript.Util.AddEvent(document, "mousedown", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.AddEvent(document, "touchstart", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu)
};
GleamTech.JavaScript.UI.ContextMenu.prototype.PopupXY = function(n, t, i) {
    GleamTech.JavaScript.Util.DeSelectAllRanges();
    var r = this;
    GleamTech.JavaScript.Util.EnsureDisplay(this.divElement,
    function() {
        r.CalculateDimensions()
    });
    i && (n -= this.calculatedWidth);
    this.Show(n, t);
    GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu = function(n) {
        r.HidePopup(n)
    };
    GleamTech.JavaScript.Util.AddEvent(document, "mousedown", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.AddEvent(document, "touchstart", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu)
};
GleamTech.JavaScript.UI.ContextMenu.prototype.PopupSubmenu = function() {
    var i = this;
    GleamTech.JavaScript.Util.EnsureDisplay(this.divElement,
    function() {
        i.CalculateDimensions()
    });
    var n = this.parentMenuItem.menu.right - 6,
    t = this.parentMenuItem.menu.top + this.parentMenuItem.topDistance,
    r = this.container.clientWidth - n,
    u = this.container.clientHeight - t;
    this.parentMenuItem.menu.showLeft || r < this.calculatedWidth ? (n = this.parentMenuItem.menu.left - this.calculatedWidth + 4, this.showLeft = !0) : this.showLeft = !1;
    u < this.calculatedHeight && (t = this.parentMenuItem.menu.bottom - this.calculatedHeight);
    this.depth = this.parentMenuItem.menu.depth + 1;
    this.divElement.style.zIndex = this.depth;
    this.target = this.parentMenuItem.menu.target;
    this.Show(n, t);
    this.parentMenuItem.menu.lastSubmenu = this
};
GleamTech.JavaScript.UI.ContextMenu.prototype.Show = function(n, t) {
    this.left = n;
    this.right = n + this.calculatedWidth;
    this.top = t;
    this.bottom = t + this.calculatedHeight;
    this.divElement.style.top = this.top + "px";
    this.divElement.style.left = this.left + "px";
    this.divElement.style.display = "block";
    this.divElement.style.visibility = "visible";
    this.hidden = !1
};
GleamTech.JavaScript.UI.ContextMenu.prototype.Hide = function() {
    this.lastSubmenu && !this.lastSubmenu.hidden && this.lastSubmenu.Hide();
    this.divElement.style.display = "none";
    this.divElement.style.visibility = "hidden";
    this.hidden = !0;
    this.parentMenuItem && !this.parentMenuItem.disabled && this.parentMenuItem.onUnSelect()
};
GleamTech.JavaScript.UI.ContextMenu.prototype.HidePopup = function() {
    this.Hide();
    GleamTech.JavaScript.Util.RemoveEvent(document, "mousedown", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.RemoveEvent(document, "mouseup", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.RemoveEvent(document, "touchstart", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.RemoveEvent(document, "touchend", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    this.target && this.target.onContextMenuClose && this.target.onContextMenuClose()
};
GleamTech.JavaScript.UI.ContextMenuItem = function(n, t, i, r) {
    if (this.action = n, this.text = t, this.description = i, r != null) if (r.indexOf("data:") == 0) this.icon = r;
    else {
        var u = r.split(":");
        this.icon = u.length > 1 ? GleamTech.JavaScript.UI.ContextMenuIconsPath[u[0]] + u[1] : GleamTech.JavaScript.UI.ContextMenuIconsPath["default"] + r
    } else this.icon = r;
    this.index = -1;
    this.disabled = !1;
    this.hidden = !1;
    this.topDistance = 0;
    this.menu = null;
    this.submenu = null;
    this.divElement = null;
    this.imgIcon = null;
    this.imgSpan = null;
    this.imgPopup = null;
    this.spanElement = null;
    this.isMenuItem = !0
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.SetSubmenu = function(n) {
    this.submenu = n;
    n.parentMenuItem = this
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Render = function(n, t) {
    var f = this,
    i = document.createElement("div"),
    o,
    u,
    e,
    s,
    r;
    t ? n.insertBefore(i, t) : n.appendChild(i);
    this.description != null && (i.title = this.description);
    i.className = GleamTech.JavaScript.UI.ContextMenuItemCssClass;
    i.style.whiteSpace = "nowrap";
    i.style.paddingLeft = "2px";
    i.style.paddingRight = "40px";
    i.style.position = "relative";
    GleamTech.JavaScript.UI.ContextMenuItemRoundBorders && GleamTech.JavaScript.Util.SetBorderRadius(i, 3, 3, 3, 3);
    this.menu.imgSelection && (i.style.backgroundImage = "url('" + this.menu.imgSelection.src + "')");
    GleamTech.JavaScript.Util.AddEvent(i, "mouseover",
    function(n) {
        return f.onMouseOver(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "mouseout",
    function(n) {
        return f.onMouseOut(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "mousedown",
    function(n) {
        return f.onMouseDown(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "mouseup",
    function(n) {
        return f.onMouseUp(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "touchstart",
    function(n) {
        return f.onTouchStart(n)
    });
    GleamTech.JavaScript.Util.AddEvent(i, "touchend",
    function(n) {
        return f.onTouchEnd(n)
    });
    this.divElement = i;
    o = 9;
    this.icon != null ? (u = new Image, u.src = this.icon, u.style.width = this.menu.iconWidth + "px", u.style.height = this.menu.iconHeight + "px", u.style.verticalAlign = "middle", u.style.marginRight = "4px", this.imgIcon = u, this.imgSpan = document.createElement("span"), this.imgSpan.className = GleamTech.JavaScript.UI.ContextMenuItemIconCssClass, this.imgSpan.style.display = "inline-block", this.imgSpan.appendChild(this.imgIcon), i.appendChild(this.imgSpan)) : o += this.menu.iconWidth + 4;
    e = document.createElement("span");
    e.style.marginLeft = o + "px";
    this.menu.defaultMenuItem == this && (e.style.fontWeight = "bold");
    this.spanElement = e;
    s = document.createTextNode(this.text);
    e.appendChild(s);
    i.appendChild(e);
    this.submenu && (r = new Image, r.src = this.menu.imgPopup.src, r.style.position = "absolute", r.style.width = "5px", r.style.height = "9px", r.style.right = "6px", this.imgPopup = r, i.appendChild(r));
    this.disabled && this.Disable()
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.HideIcon = function() {
    this.imgIcon && (this.imgIcon.style.visibility = "hidden")
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.ShowIcon = function() {
    this.imgIcon && (this.imgIcon.style.visibility = "visible")
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onMouseOver = function() {
    this.disabled || (this.onSelect(), this.menu.lastSubmenu && this.menu.lastSubmenu != this.submenu && this.menu.lastSubmenu.Hide(), this.submenu && this.submenu.hidden && this.submenu.PopupSubmenu())
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onMouseOut = function(n) {
    var t, i, r;
    this.disabled || (this.submenu && !this.submenu.hidden ? (n || (n = window.event), t = n.pageX ? n.pageX: n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft(), i = n.pageY ? n.pageY: n.clientY + GleamTech.JavaScript.Util.Viewport.GetScrollTop(), t -= this.menu.parentLeft, i -= this.menu.parentTop, r = t > this.submenu.left - 10 && t < this.submenu.right + 10 && i > this.submenu.top - 10 && i < this.submenu.bottom + 10, !r && n.changedTouches && n.changedTouches.length == 0 && this.submenu.Hide()) : this.onUnSelect())
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onMouseDown = function() {
    GleamTech.JavaScript.Util.AddEvent(document, "mouseup", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu);
    GleamTech.JavaScript.Util.AddEvent(document, "touchend", GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu)
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onMouseUp = function(n) {
    if (!this.disabled && !this.submenu) {
        n || (n = window.event);
        var t = n.which ? n.which == 1 : n.button == 1;
        if ((t || !n.changedTouches || n.changedTouches.length != 0) && (this.menu.itemClicked = !0, GleamTech.JavaScript.UI.ContextMenu.hideCurrentMenu(), this.menu.onMenuItemClick)) this.menu.onMenuItemClick(this, n)
    }
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onTouchStart = function(n) {
    this.onMouseOver(n);
    n.preventDefault()
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onTouchEnd = function(n) {
    this.onMouseOut(n);
    GleamTech.JavaScript.Util.SimulateMouse(n)
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onSelect = function() {
    this.divElement.className = GleamTech.JavaScript.UI.ContextMenuItemHoverCssClass;
    this.imgPopup && (this.imgPopup.src = this.menu.imgPopupHover.src)
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.onUnSelect = function() {
    this.divElement.className = GleamTech.JavaScript.UI.ContextMenuItemCssClass;
    this.imgPopup && (this.imgPopup.src = this.menu.imgPopup.src)
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Enable = function() {
    this.divElement.disabled = !1;
    this.divElement.className = GleamTech.JavaScript.UI.ContextMenuItemCssClass;
    this.imgSpan && GleamTech.JavaScript.Util.SetOpacity(this.imgSpan, 10);
    this.imgPopup && GleamTech.JavaScript.Util.SetOpacity(this.imgPopup, 10);
    this.disabled = !1
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Disable = function() {
    this.divElement.disabled = !0;
    this.divElement.className = GleamTech.JavaScript.UI.ContextMenuItemDisabledCssClass;
    this.imgSpan && GleamTech.JavaScript.Util.SetOpacity(this.imgSpan, 4);
    this.imgPopup && GleamTech.JavaScript.Util.SetOpacity(this.imgPopup, 4);
    this.disabled = !0
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Show = function() {
    this.divElement.style.display = "block";
    this.hidden = !1
};
GleamTech.JavaScript.UI.ContextMenuItem.prototype.Hide = function() {
    this.divElement.style.display = "none";
    this.hidden = !0
};
GleamTech.JavaScript.UI.ContextMenuSeparator = function() {
    this.menu = null;
    this.index = -1;
    this.divElement = null;
    this.hidden = !1;
    this.isSeparator = !0
};
GleamTech.JavaScript.UI.ContextMenuSeparator.prototype.Render = function(n) {
    var t = document.createElement("div"),
    i;
    t.className = GleamTech.JavaScript.UI.ContextMenuSeparatorCssClass;
    t.style.marginTop = "2px";
    t.style.marginLeft = "30px";
    t.style.marginBottom = "2px";
    t.style.marginRight = "0px";
    t.style.lineHeight = "1px";
    t.style.fontSize = "1px";
    this.divElement = t;
    i = document.createTextNode(String.fromCharCode(160));
    t.appendChild(i);
    n.appendChild(t)
};
GleamTech.JavaScript.UI.ContextMenuSeparator.prototype.Show = function() {
    this.divElement.style.display = "block";
    this.hidden = !1
};
GleamTech.JavaScript.UI.ContextMenuSeparator.prototype.Hide = function() {
    this.divElement.style.display = "none";
    this.hidden = !0
};