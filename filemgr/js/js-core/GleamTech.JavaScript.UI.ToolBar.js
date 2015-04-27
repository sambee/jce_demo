var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.ToolBarCount = 0;
GleamTech.JavaScript.UI.ToolBarCssClass = "gt-toolBar";
GleamTech.JavaScript.UI.ToolBarButtonCssClass = "gt-toolBarButton";
GleamTech.JavaScript.UI.ToolBarButtonHoverCssClass = "gt-toolBarButton gt-toolBarButton-hover";
GleamTech.JavaScript.UI.ToolBarButtonSelectedCssClass = "gt-toolBarButton gt-toolBarButton-selected";
GleamTech.JavaScript.UI.ToolBarSeparatorCssClass = "gt-toolBarSeparator";
GleamTech.JavaScript.UI.ToolBar = function() {
    this.index = GleamTech.JavaScript.UI.ToolBarCount++;
    this.items = [];
    this.buttons = {};
    this.imagesPath = "";
    this.buttonWidth = 10;
    this.buttonHeight = 10;
    this.buttonBorder = 1;
    this.vertical = !1;
    this.onButtonClick = null
};
GleamTech.JavaScript.UI.ToolBar.prototype.SetButtonSize = function(n, t, i) {
    this.buttonWidth = n;
    this.buttonHeight = t;
    this.vertical = i
};
GleamTech.JavaScript.UI.ToolBar.prototype.SetImages = function(n, t, i) {
    this.imagesPath = n;
    this.imagesWidth = t;
    this.imagesHeight = i
};
GleamTech.JavaScript.UI.ToolBar.prototype.GetHeight = function() {
    return this.divElement.offsetHeight
};
GleamTech.JavaScript.UI.ToolBar.prototype.AddButton = function(n, t, i, r) {
    i && (i = this.imagesPath + i);
    var u = new GleamTech.JavaScript.UI.ToolBarButton(n, t, i, r, this.buttonWidth - this.buttonBorder * 2, this.buttonHeight - this.buttonBorder * 2);
    return u.toolbar = this,
    u.index = this.items.length,
    this.items[u.index] = u,
    this.buttons[n] = u,
    u
};
GleamTech.JavaScript.UI.ToolBar.prototype.AddSeparator = function() {
    var n = new GleamTech.JavaScript.UI.ToolBarSeparator(this.buttonHeight);
    return n.toolbar = this,
    this.items[this.items.length] = n,
    n
};
GleamTech.JavaScript.UI.ToolBar.prototype.ToggleActions = function(n) {
    for (var t = 0; t < n.length; t++) {
        var r = n[t][0],
        u = n[t][1],
        i = this.buttons[r];
        u ? i.Enable() : i.Disable()
    }
};
GleamTech.JavaScript.UI.ToolBar.prototype.Render = function(n, t) {
    this.divElement = document.createElement("div");
    t.appendChild(this.divElement);
    this.divElement.id = n;
    this.divElement.className = GleamTech.JavaScript.UI.ToolBarCssClass;
    this.vertical ? this.divElement.style.width = this.buttonWidth + 6 - 2 + "px": this.divElement.style.height = this.buttonHeight + 6 - 2 + "px";
    this.divElement.style.overflow = "hidden";
    for (var i = 0; i < this.items.length; i++) this.items[i].Render(this.divElement)
};
GleamTech.JavaScript.UI.ToolBar.prototype.RenderItem = function(n) {
    n.Render(this.divElement)
};
GleamTech.JavaScript.UI.ToolBarButton = function(n, t, i, r, u, f) {
    this.action = n;
    this.description = t;
    this.image = i;
    this.width = u;
    this.height = f;
    this.disabled = r;
    this.toolbar = null;
    this.index = -1;
    this.divElement = null;
    this.imgElement = null;
    this.isToolbarButton = !0
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.Render = function(n) {
    var r = this,
    t = document.createElement("div"),
    i;
    t.title = this.description;
    t.style.cssFloat = "left";
    t.style.styleFloat = "left";
    t.style.textAlign = "center";
    t.style.padding = "2px";
    t.style.width = this.width + "px";
    t.style.height = this.height + "px";
    t.className = GleamTech.JavaScript.UI.ToolBarButtonCssClass;
    GleamTech.JavaScript.Util.AddEvent(t, "mouseover",
    function(n) {
        r.onMouseOver(n)
    });
    GleamTech.JavaScript.Util.AddEvent(t, "mouseout",
    function(n) {
        r.onMouseOut(n)
    });
    GleamTech.JavaScript.Util.AddEvent(t, "mousedown",
    function(n) {
        r.onMouseDown(n)
    });
    GleamTech.JavaScript.Util.AddEvent(t, "mouseup",
    function(n) {
        r.onMouseUp(n)
    });
    GleamTech.JavaScript.Util.AddEvent(t, "click",
    function(n) {
        r.onClick(n)
    });
    this.divElement = t;
    this.image && (i = new Image, i.src = this.image, i.style.width = this.toolbar.imagesWidth + "px", i.style.height = this.toolbar.imagesHeight + "px", i.style.marginLeft = (this.width - this.toolbar.imagesWidth) / 2 + "px", i.style.marginRight = (this.width - this.toolbar.imagesWidth) / 2 + "px", i.style.marginTop = (this.height - this.toolbar.imagesHeight) / 2 + "px", this.imgElement = i, t.appendChild(i));
    n.appendChild(t);
    this.disabled && (this.disabled = !1, this.Disable())
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onMouseOver = function() {
    this.disabled || (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonHoverCssClass, this.divElement.style.padding = "2px")
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onMouseOut = function() {
    this.disabled || (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonCssClass, this.divElement.style.padding = "2px")
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onMouseDown = function(n) {
    var n, t;
    this.disabled || (n || (n = window.event), t = n.which ? n.which: n.button, t == 1) && (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonSelectedCssClass, this.divElement.style.paddingTop = "3px", this.divElement.style.paddingLeft = "3px", this.divElement.style.paddingBottom = "1px", this.divElement.style.paddingRight = "1px")
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onMouseUp = function(n) {
    var n, t;
    this.disabled || (n || (n = window.event), t = n.which ? n.which: n.button, t == 1) && (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonHoverCssClass, this.divElement.style.padding = "2px")
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.onClick = function(n) {
    if (!this.disabled) {
        if (!n) var n = window.event;
        this.onMouseOut(n);
        if (this.toolbar.onButtonClick) this.toolbar.onButtonClick(this, n)
    }
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.Enable = function() {
    this.disabled && (this.divElement.disabled = !1, GleamTech.JavaScript.Util.SetOpacity(this.divElement, 10), this.disabled = !1)
};
GleamTech.JavaScript.UI.ToolBarButton.prototype.Disable = function() {
    this.disabled || (this.divElement.className = GleamTech.JavaScript.UI.ToolBarButtonCssClass, this.divElement.style.padding = "2px", this.divElement.disabled = !0, GleamTech.JavaScript.Util.SetOpacity(this.divElement, 4), this.disabled = !0)
};
GleamTech.JavaScript.UI.ToolBarSeparator = function(n) {
    this.height = n;
    this.toolbar = null
};
GleamTech.JavaScript.UI.ToolBarSeparator.prototype.Render = function(n) {
    var t = document.createElement("div");
    t.style.cssFloat = "left";
    t.style.styleFloat = "left";
    t.style.marginTop = "0px";
    t.style.marginLeft = "3px";
    t.style.marginBottom = "0px";
    t.style.marginRight = "3px";
    t.style.width = "1px";
    t.style.height = this.height + 2 + "px";
    t.className = GleamTech.JavaScript.UI.ToolBarSeparatorCssClass;
    n.appendChild(t)
};