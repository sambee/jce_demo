var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.GridViewCount = 0;
GleamTech.JavaScript.UI.GridViewCssClass = "gt-gridView";
GleamTech.JavaScript.UI.GridViewColumnCssClass = "gt-gridViewColumn";
GleamTech.JavaScript.UI.GridViewColumnHoverCssClass = "gt-gridViewColumn gt-gridViewColumn-hover";
GleamTech.JavaScript.UI.GridViewColumnSelectedCssClass = "gt-gridViewColumn gt-gridViewColumn-selected";
GleamTech.JavaScript.UI.GridViewCellCssClass = "gt-gridViewCell";
GleamTech.JavaScript.UI.GridViewRowCssClass = "gt-gridViewRow";
GleamTech.JavaScript.UI.GridViewRowHoverCssClass = "gt-gridViewRow-hover";
GleamTech.JavaScript.UI.GridViewRowSelectedCssClass = "gt-gridViewRow-selected";
GleamTech.JavaScript.UI.GridViewRowSelectedHoverCssClass = "gt-gridViewRow-selectedHover";
GleamTech.JavaScript.UI.GridViewAscendingImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAAXElEQVQI12P48+cPAww7JJX8R+bDGTZxRf/DZh/4H9ex8D+KpE1kzv/Eadv+t514/X/i6Tf/Z207ClbA4Byf/79949H/ux59+b/17qf/Rx5/+X/q2df/h598/Q8A22pR/QPxkAUAAAAASUVORK5CYII=";
GleamTech.JavaScript.UI.GridViewDescendingImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAECAYAAABCxiV9AAAAXElEQVQI12OwiSv6nzRr5/+Clcf+F60+9b95183/U489+D/r+IP/DH/+/GEI6l79v3jTjf8zL7z7v/n2x/9HHn/5DxIHS4Jw+prL/5fd+AyXQJEE4Vmnn/1H5gMA7c1UrTOSm6YAAAAASUVORK5CYII=";
GleamTech.JavaScript.UI.GridViewSelectionImage = "";
GleamTech.JavaScript.UI.GridViewRowRoundBorders = !1;
GleamTech.JavaScript.UI.GridViewRowFocusedCssClass = "gt-gridViewRow-focused";
GleamTech.JavaScript.UI.GridView = function() {
    this.index = GleamTech.JavaScript.UI.GridViewCount++;
    this.columnsArray = [];
    this.columns = {};
    this.rowsArray = [];
    this.selectedRowsArray = [];
    this.lastSelectedRow = null;
    this.lastFocusedRow = null;
    this.selectedCount = 0;
    this.rowTitleColumn = null;
    this.sortColumn = null;
    this.sortDescending = !1;
    this.iconsPath = {};
    this.iconWidth = 0;
    this.iconHeight = 0;
    this.multipleSelection = !0;
    this.useIconCls = !1;
    this.onColumnClick = this.onColumnClickInternal;
    this.onRowContextMenu = null;
    this.onRowDoubleClick = null;
    this.onSelectionComplete = null;
    this.onGridContextMenu = null;
    this.onRowsRenderedForOnce = null;
    this.imgOrder = new Image;
    this.imgAscending = new Image;
    this.imgAscending.src = GleamTech.JavaScript.UI.GridViewAscendingImage;
    this.imgDescending = new Image;
    this.imgDescending.src = GleamTech.JavaScript.UI.GridViewDescendingImage;
    GleamTech.JavaScript.UI.GridViewSelectionImage && (this.imgSelection = new Image, this.imgSelection.src = GleamTech.JavaScript.UI.GridViewSelectionImage);
    this.isIE7 = GleamTech.JavaScript.Util.GetIEVersion() == 7
};
GleamTech.JavaScript.UI.GridView.prototype.SetIconSize = function(n, t) {
    this.iconWidth = n;
    this.iconHeight = t
};
GleamTech.JavaScript.UI.GridView.prototype.Resize = function(n, t) {
    var i = this;
    GleamTech.JavaScript.Util.EnsureDisplay(this.divElement,
    function(r) {
        var a, w, k, u, e, d, h, y, c, g, l;
        n && (r.style.width = n + "px");
        a = r.offsetWidth - 30;
        a < 0 && (a = 0);
        i.rowsTable.style.width = a + "px";
        i.divRowsTable.style.width = i.rowsTable.offsetWidth + "px";
        i.divColumns.style.width = (i.divRowsTable.offsetWidth == 30 ? r.offsetWidth: i.divRowsTable.offsetWidth) + "px";
        var s = i.divColumns.getElementsByTagName("div"),
        o = s.length,
        f,
        v = 0,
        p = 16,
        b = !0;
        if (i.tbody.childNodes.length == 0) {
            for (f = Math.floor(i.divColumns.offsetWidth / o) - p, f < 0 && (f = 0), w = 0, u = 0; u < o; u++) e = s[u],
            w += e.offsetWidth;
            if (w == i.divColumns.offsetWidth) b = !1;
            else for (u = 0; u < o - 1; u++) e = s[u],
            e.style.width = f + "px",
            v += e.offsetWidth
        } else for (k = i.tbody.childNodes[0], u = 0; u < o - 1; u++) e = s[u],
        d = k.childNodes[u],
        f = d.offsetWidth - p,
        f < 0 && (f = 0),
        u == 0 && (f += 6),
        e.style.width = f + "px",
        v += e.offsetWidth;
        o > 1 && b && (f = i.divColumns.offsetWidth - v - p, f < 0 && (f = 0), h = s[o - 1], h.style.cssFloat = "", h.style.styleFloat = "", h.style.position = "absolute", h.style.left = v + "px", h.style.width = f + "px");
        o > 1 && (y = s[0], c = i.columnsArray[y.columnIndex], c.paddingLeft = 10, c.paddingRight = 4, y.style.paddingLeft = c.paddingLeft + "px", y.style.paddingRight = c.paddingRight + "px");
        i.sortColumn && !i.sortColumn.hidden && (i.imgOrder.style.left = i.sortColumn.divElement.offsetLeft + Math.round((i.sortColumn.divElement.offsetWidth - i.imgOrder.offsetWidth) / 2) - 1 + "px");
        g = GleamTech.JavaScript.Util.FindPosition(r);
        i.verticalScrollbarX = g[0] + r.offsetWidth - 18;
        t && (r.style.height = t + "px");
        l = r.offsetHeight - i.divColumns.offsetHeight - 6;
        r.scrollWidth > r.clientWidth && (l -= 18);
        l < 0 && (l = 0);
        i.divRowsTable.style.height = l + "px";
        i.iScroll && (r.firstChild.style.width = i.divRowsTable.offsetWidth + "px", setTimeout(function() {
            i.iScroll.refresh();
            i.iScroll2.refresh()
        },
        0))
    })
};
GleamTech.JavaScript.UI.GridView.prototype.AddColumn = function(n, t, i, r, u, f) {
    var e = new GleamTech.JavaScript.UI.GridViewColumn(t, i, r, u, f);
    return e.grid = this,
    e.index = this.columnsArray.length,
    this.columnsArray[e.index] = e,
    this.columns[n] = e,
    e
};
GleamTech.JavaScript.UI.GridView.prototype.AddRow = function(n, t) {
    var i = new GleamTech.JavaScript.UI.GridViewRow(this, n, t);
    return i.index = this.rowsArray.length,
    this.rowsArray[i.index] = i,
    i
};
GleamTech.JavaScript.UI.GridView.prototype.Render = function(n, t) {
    var i, r;
    if (!this.divElement) {
        if (this.styleGridRow = GleamTech.JavaScript.UI.GridViewRowCssClass, this.styleGridRowHover = GleamTech.JavaScript.UI.GridViewRowHoverCssClass, this.styleGridRowSelected = GleamTech.JavaScript.UI.GridViewRowSelectedCssClass, this.styleGridRowSelectedHover = GleamTech.JavaScript.UI.GridViewRowSelectedHoverCssClass, this.styleGridRowFocused = GleamTech.JavaScript.UI.GridViewRowFocusedCssClass, this.gridRowHeight = 18, (isNaN(this.gridRowHeight) || this.gridRowHeight < 18) && (this.gridRowHeight = 18), this.divElement = document.createElement("div"), this.divElement.id = n, this.divElement.style.overflowX = "auto", this.divElement.style.overflowY = "hidden", this.divElement.style.position = "relative", this.divElement.className = GleamTech.JavaScript.UI.GridViewCssClass, t.appendChild(this.divElement), i = this, this.onGridContextMenu && (GleamTech.JavaScript.Util.AddEvent(this.divElement, "contextmenu", this.onGridContextMenu), GleamTech.JavaScript.Util.AddEvent(this.divElement, "touchstart",
        function(n) {
            GleamTech.JavaScript.Util.SimulateContextMenu(n,
            function() {
                return i.rowContextMenuActive ? (i.rowContextMenuActive = !1, !1) : !0
            })
        })), this.divColumns = document.createElement("div"), this.divElement.appendChild(this.divColumns), this.divColumns.style.overflow = "hidden", this.divColumns.style.position = "relative", this.imgOrder.style.position = "absolute", this.imgOrder.style.top = "2px", this.RefreshColumns(!0), this.divRowsTable = document.createElement("div"), this.divRowsTable.style.overflowX = "hidden", this.divRowsTable.style.overflowY = "auto", this.divRowsTable.style.paddingTop = "6px", this.divRowsTable.style.paddingLeft = "6px", this.divRowsTable.style.paddingRight = "24px", this.divElement.appendChild(this.divRowsTable), GleamTech.JavaScript.Util.AddEvent(this.divRowsTable, "mousedown",
        function(n) {
            return i.onMousedown(n)
        }), GleamTech.JavaScript.Util.AddEvent(this.divRowsTable, "mouseup",
        function(n) {
            return i.onMouseUp(n)
        }), GleamTech.JavaScript.Util.AddEvent(this.divRowsTable, "touchstart", GleamTech.JavaScript.Util.SimulateMouse), GleamTech.JavaScript.Util.AddEvent(this.divRowsTable, "touchend", GleamTech.JavaScript.Util.SimulateMouse), this.rowsTable = document.createElement("table"), this.divRowsTable.appendChild(this.rowsTable), this.rowsTable.cellPadding = 0, this.rowsTable.cellSpacing = 0, this.tbody = document.createElement("tbody"), this.rowsTable.appendChild(this.tbody), typeof iScroll == "function" && /(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
            for (this.iScroll = new iScroll(this.divRowsTable, {
                hScroll: !1
            }), r = document.createElement("div"); this.divElement.firstChild;) r.appendChild(this.divElement.firstChild);
            this.divElement.appendChild(r);
            this.iScroll2 = new iScroll(this.divElement, {
                vScroll: !1
            })
        }
        this.RenderRows(!0)
    }
};
GleamTech.JavaScript.UI.GridView.prototype.RenderRows = function(n) {
    for (var i = document.createDocumentFragment(), t = 0; t < this.rowsArray.length; t++) this.rowsArray[t].index = t,
    this.rowsArray[t].Render(i);
    this.tbody.appendChild(i);
    n || this.Resize();
    this.onRowsRenderedForOnce && (this.onRowsRenderedForOnce(), this.onRowsRenderedForOnce = null)
};
GleamTech.JavaScript.UI.GridView.prototype.Clear = function() {
    this.RemoveAllRows(!0);
    for (var n = 0; n < this.columnsArray.length; n++) this.columnsArray[n].divElement && this.divColumns.removeChild(this.columnsArray[n].divElement),
    this.columnsArray[n] = null;
    this.columnsArray.length = 0;
    this.sortDescending = !1;
    this.Resize()
};
GleamTech.JavaScript.UI.GridView.prototype.RemoveRow = function(n) {
    n.Unselect();
    this.lastSelectedRow == n && (this.lastSelectedRow = null);
    this.lastFocusedRow == n && (this.lastFocusedRow = null);
    this.tbody.removeChild(n.rowElement);
    this.rowsArray.splice(n.index, 1);
    delete n;
    for (var t = 0; t < this.rowsArray.length; t++) this.rowsArray[t].index = t;
    this.Resize()
};
GleamTech.JavaScript.UI.GridView.prototype.RemoveAllRows = function(n) {
    this.selectedRowsArray.length = 0;
    this.lastSelectedRow = null;
    this.lastFocusedRow = null;
    this.selectedCount = 0;
    this.rowsTable.removeChild(this.tbody);
    this.tbody = document.createElement("tbody");
    this.rowsTable.appendChild(this.tbody);
    for (var t = 0; t < this.rowsArray.length; t++) this.rowsArray[t] != undefined && delete this.rowsArray[t];
    this.rowsArray.length = 0;
    n || this.Resize()
};
GleamTech.JavaScript.UI.GridView.prototype.onMousedown = function(n) {
    n || (n = window.event);
    var t = GleamTech.JavaScript.Util.GetEventTarget(n),
    i = n.pageX ? n.pageX: n.clientX + GleamTech.JavaScript.Util.Viewport.GetScrollLeft();
    return this.gridmousedown = t == this.divRowsTable,
    this.gridmousedown && this.divRowsTable.scrollHeight > this.divRowsTable.clientHeight && (this.gridmousedown = i < this.verticalScrollbarX),
    !0
};
GleamTech.JavaScript.UI.GridView.prototype.onMouseUp = function(n) {
    n || (n = window.event);
    var t = GleamTech.JavaScript.Util.GetEventTarget(n);
    return this.gridmousedown && t == this.divRowsTable && this.UnSelectAllRows(),
    !0
};
GleamTech.JavaScript.UI.GridView.prototype.onColumnClickInternal = function(n) {
    n == this.sortColumn ? this.Reverse() : this.Sort(n);
    this.Refresh()
};
GleamTech.JavaScript.UI.GridView.prototype.Sort = function(n, t, i) {
    var r, c;
    if (!n) if (this.sortColumn) n = this.sortColumn;
    else return;
    var e = this.rowsArray.length,
    l = n.index,
    a = n.sortType.comparableValueFunction,
    o = n.sortType.compareFunction,
    u = new Array(e);
    if (t) var v = t.index,
    y = t.sortType.comparableValueFunction,
    h = t.sortType.compareFunction,
    f = new Array(e);
    if (i) var p = i.index,
    w = i.sortType.comparableValueFunction,
    b = i.sortType.compareFunction,
    s = new Array(e);
    for (r = 0; r < e; r++) this.rowsArray[r].index = r,
    u[r] = a(this.rowsArray[r].cells[l]),
    t && (f[r] = y(this.rowsArray[r].cells[v])),
    i && (s[r] = w(this.rowsArray[r].cells[p]));
    c = i ?
    function(n, t) {
        var i = n.index,
        r = t.index,
        c = o(u[i], u[r]),
        e;
        return c != 0 ? c: (e = h(f[i], f[r]), e != 0) ? e: b(s[i], s[r])
    }: t ?
    function(n, t) {
        var i = n.index,
        r = t.index,
        e = o(u[i], u[r]);
        return e != 0 ? e: h(f[i], f[r])
    }: function(n, t) {
        var i = n.index,
        r = t.index;
        return o(u[i], u[r])
    };
    this.rowsArray.sort(c);
    this.sortDescending && this.rowsArray.reverse();
    this.sortColumn = i || t || n;
    this.divElement && !this.sortColumn.hidden && (this.imgOrder.src = this.sortDescending ? this.imgDescending.src: this.imgAscending.src, this.divColumns.appendChild(this.imgOrder), this.imgOrder.style.left = this.sortColumn.divElement.offsetLeft + Math.round((this.sortColumn.divElement.offsetWidth - this.imgOrder.offsetWidth) / 2) - 1 + "px")
};
GleamTech.JavaScript.UI.GridView.prototype.ResetSort = function() {
    this.sortColumn && (this.sortColumn = null, this.sortDescending = !1, this.imgOrder.parentNode == this.divColumns && this.divColumns.removeChild(this.imgOrder))
};
GleamTech.JavaScript.UI.GridView.prototype.Reverse = function() {
    this.rowsArray.reverse();
    this.sortDescending = !this.sortDescending
};
GleamTech.JavaScript.UI.GridView.prototype.Refresh = function() {
    var r = this.sortColumn,
    i, n, t;
    for (r && !r.hidden && (this.imgOrder.src = this.sortDescending ? this.imgDescending.src: this.imgAscending.src, this.divColumns.appendChild(this.imgOrder), this.imgOrder.style.left = this.sortColumn.divElement.offsetLeft + Math.round((this.sortColumn.divElement.offsetWidth - this.imgOrder.offsetWidth) / 2) - 1 + "px"), i = this.selectedRowsArray.slice(), this.unselectAllRowsInternal(), n = 0; n < this.rowsArray.length; n++) this.rowsArray[n].index = n,
    this.tbody.appendChild(this.rowsArray[n].rowElement);
    for (t = 0; t < i.length; t++) i[t].Select()
};
GleamTech.JavaScript.UI.GridView.prototype.RefreshColumns = function(n) {
    var i, t;
    for (this.visibleFirstColumn = null, this.visibleLastColumn = null, i = document.createDocumentFragment(), t = 0; t < this.columnsArray.length; t++) this.columnsArray[t].Render(i),
    this.columnsArray[t].hidden || (this.visibleFirstColumn == null && (this.visibleFirstColumn = this.columnsArray[t]), this.visibleLastColumn = this.columnsArray[t]);
    this.divColumns.appendChild(i);
    n || this.Resize()
};
GleamTech.JavaScript.UI.GridView.prototype.GetSelectedFirstRow = function() {
    return this.selectedRowsArray.length > 0 ? this.selectedRowsArray[0] : null
};
GleamTech.JavaScript.UI.GridView.prototype.GetSelectedLastRow = function() {
    return this.selectedRowsArray.length > 0 ? this.selectedRowsArray[this.selectedRowsArray.length - 1] : null
};
GleamTech.JavaScript.UI.GridView.prototype.GetSelectedCellValues = function(n) {
    for (var i = [], t = 0; t < this.selectedRowsArray.length; t++) i[t] = this.selectedRowsArray[t].GetCellValue(n);
    return i
};
GleamTech.JavaScript.UI.GridView.prototype.GetCellValues = function(n) {
    for (var i = [], t = 0; t < this.rowsArray.length; t++) i[t] = this.rowsArray[t].GetCellValue(n);
    return i
};
GleamTech.JavaScript.UI.GridView.prototype.SelectAllRows = function() {
    this.selectAllRowsInternal();
    this.onSelectionComplete && this.onSelectionComplete()
};
GleamTech.JavaScript.UI.GridView.prototype.UnSelectAllRows = function() {
    this.unselectAllRowsInternal();
    this.onSelectionComplete && this.onSelectionComplete()
};
GleamTech.JavaScript.UI.GridView.prototype.selectAllRowsInternal = function() {
    for (var n = 0; n < this.rowsArray.length; n++) this.rowsArray[n].Select()
};
GleamTech.JavaScript.UI.GridView.prototype.unselectAllRowsInternal = function() {
    for (var n = 0; n < this.selectedRowsArray.length; n++) this.selectedRowsArray[n].Unselect(),
    n--
};
GleamTech.JavaScript.UI.GridView.prototype.InvertSelectedRows = function() {
    for (var n = 0; n < this.rowsArray.length; n++) this.rowsArray[n].selected ? this.rowsArray[n].Unselect() : this.rowsArray[n].Select();
    this.onSelectionComplete && this.onSelectionComplete()
};
GleamTech.JavaScript.UI.GridView.prototype.ScrollToRow = function(n) {
    this.divRowsTable.scrollTop = n.rowElement.offsetTop
};
GleamTech.JavaScript.UI.GridViewColumn = function(n, t, i, r, u) {
    this.text = n;
    this.alignRight = i;
    this.format = r;
    this.hidden = !1;
    this.grid = null;
    this.index = -1;
    this.sortType = GleamTech.JavaScript.Util.Sort.types[t] ? GleamTech.JavaScript.Util.Sort.types[t] : GleamTech.JavaScript.Util.Sort.types.String;
    this.formatFunction = this.sortType.defaultFormatFunction ? this.sortType.defaultFormatFunction: null;
    this.size = u;
    this.paddingTop = 3;
    this.paddingLeft = i ? 10 : 4;
    this.paddingBottom = 1;
    this.paddingRight = i ? 4 : 10;
    this.divElement = null
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.Render = function(n) {
    var i, t, r;
    this.hidden || (n || (n = this.grid.divColumns), i = this, t = document.createElement("div"), t.style.cssFloat = "left", t.style.styleFloat = "left", t.style.whiteSpace = "nowrap", t.className = GleamTech.JavaScript.UI.GridViewColumnCssClass, this.alignRight && (t.style.textAlign = "right"), t.style.paddingTop = this.paddingTop + "px", t.style.paddingLeft = this.paddingLeft + "px", t.style.paddingBottom = this.paddingBottom + "px", t.style.paddingRight = this.paddingRight + "px", t.columnIndex = this.index, GleamTech.JavaScript.Util.AddEvent(t, "mouseover",
    function(n) {
        return i.onMouseOver(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mouseout",
    function(n) {
        return i.onMouseOut(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mousedown",
    function(n) {
        return i.onMouseDown(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mouseup",
    function(n) {
        return i.onMouseUp(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "click",
    function(n) {
        return i.onClick(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "contextmenu", GleamTech.JavaScript.Util.CancelEvent), GleamTech.JavaScript.Util.AddEvent(t, "touchstart",
    function(n) {
        i.onMouseOver(n);
        i.onMouseDown(n);
        i.onClick(n);
        return GleamTech.JavaScript.Util.CancelEvent(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "touchend",
    function(n) {
        i.onMouseOut(n);
        i.onMouseUp(n);
        return GleamTech.JavaScript.Util.CancelEvent(n)
    }), this.divElement = t, r = document.createTextNode(this.text), t.appendChild(r), this == this.grid.sortColumn && (this.grid.imgOrder.src = this.grid.sortDescending ? this.grid.imgDescending.src: this.grid.imgAscending.src, this.grid.divColumns.appendChild(this.grid.imgOrder), this.grid.imgOrder.style.left = t.offsetLeft + Math.round((t.offsetWidth - this.grid.imgOrder.offsetWidth) / 2) - 1 + "px"), n.appendChild(t))
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onMouseOver = function() {
    this.divElement.className = GleamTech.JavaScript.UI.GridViewColumnHoverCssClass;
    this.divElement.style.paddingTop = this.paddingTop + "px";
    this.divElement.style.paddingLeft = this.paddingLeft + "px";
    this.divElement.style.paddingBottom = this.paddingBottom + "px";
    this.divElement.style.paddingRight = this.paddingRight + "px"
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onMouseOut = function() {
    this.divElement.className = GleamTech.JavaScript.UI.GridViewColumnCssClass;
    this.divElement.style.paddingTop = this.paddingTop + "px";
    this.divElement.style.paddingLeft = this.paddingLeft + "px";
    this.divElement.style.paddingBottom = this.paddingBottom + "px";
    this.divElement.style.paddingRight = this.paddingRight + "px"
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onMouseDown = function(n) {
    n || (n = window.event);
    var t = n.which ? n.which: n.button;
    t == 1 && (this.divElement.className = GleamTech.JavaScript.UI.GridViewColumnSelectedCssClass, this.divElement.style.paddingTop = this.paddingTop + 1 + "px", this.divElement.style.paddingLeft = this.paddingLeft + "px", this.divElement.style.paddingBottom = this.paddingBottom - 1 + "px", this.divElement.style.paddingRight = this.paddingRight + "px")
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onMouseUp = function(n) {
    n || (n = window.event);
    var t = n.which ? n.which: n.button;
    t == 1 && (this.divElement.className = GleamTech.JavaScript.UI.GridViewColumnHoverCssClass, this.divElement.style.paddingTop = this.paddingTop + "px", this.divElement.style.paddingLeft = this.paddingLeft + "px", this.divElement.style.paddingBottom = this.paddingBottom + "px", this.divElement.style.paddingRight = this.paddingRight + "px")
};
GleamTech.JavaScript.UI.GridViewColumn.prototype.onClick = function(n) {
    this.grid.onColumnClick(this, n)
};
GleamTech.JavaScript.UI.GridViewRow = function(n, t, i) {
    var r, u;
    this.grid = n;
    this.cells = t;
    n.useIconCls ? this.icon = i: (r = i.split(":"), this.icon = r.length > 1 ? n.iconsPath[r[0]] + r[1] : n.iconsPath["default"] + i);
    this.index = -1;
    this.rowElement = null;
    this.selected = !1;
    this.isGridRow = !0;
    u = this;
    this.mouseUpEvent = function(n) {
        return u.onMouseUp(n)
    }
};
GleamTech.JavaScript.UI.GridViewRow.prototype.GetCellValue = function(n) {
    return typeof n == "string" && (n = this.grid.columns[n]),
    this.cells[n.index]
};
GleamTech.JavaScript.UI.GridViewRow.prototype.SetCellValue = function(n, t) {
    typeof n == "string" && (n = this.grid.columns[n]);
    this.cells[n.index] = t
};
GleamTech.JavaScript.UI.GridViewRow.prototype.Render = function(n) {
    var o = this,
    t = document.createElement("tr"),
    i,
    e,
    u,
    f,
    s,
    h,
    r,
    c;
    for (n ? n.appendChild(t) : this.grid.tbody.appendChild(t), this.grid.rowTitleColumn && (t.title = this.cells[this.grid.rowTitleColumn.index]), GleamTech.JavaScript.Util.AddEvent(t, "mouseover",
    function(n) {
        return o.onMouseOver(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mouseout",
    function(n) {
        return o.onMouseOut(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "mousedown",
    function(n) {
        return o.onMouseDown(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "dblclick",
    function(n) {
        return o.onDoubleClick(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "contextmenu",
    function(n) {
        return o.onContextMenu(n)
    }), GleamTech.JavaScript.Util.AddEvent(t, "touchstart",
    function(n) {
        GleamTech.JavaScript.Util.SimulateMouse(n);
        var t = GleamTech.JavaScript.Util.GetEventTarget(n),
        i = t.nodeName == "SPAN" && t.firstChild.nodeType == 3 && t.firstChild.nodeValue == String.fromCharCode(160);
        t.nodeName == "TD" || t.isContainerSpan || i || n.stopPropagation()
    }), GleamTech.JavaScript.Util.AddEvent(t, "touchstart", GleamTech.JavaScript.Util.SimulateContextMenu), GleamTech.JavaScript.Util.AddEvent(t, "touchmove",
    function(n) {
        var t = document.elementFromPoint(n.changedTouches[0].clientX, n.changedTouches[0].clientY),
        i = t,
        r = i.nodeName == "SPAN" && i.firstChild.nodeType == 3 && i.firstChild.nodeValue == String.fromCharCode(160);
        if (i.nodeName != "TD" && !i.isContainerSpan && !r) {
            while (t.nodeName.toUpperCase() != "TR" && t != document.body) t = t.parentNode;
            t.nodeName.toUpperCase() == "TR" && GleamTech.JavaScript.Util.TriggerMouseEvent(n.changedTouches[0], "mouseover", t)
        }
    }), t.className = this.grid.styleGridRow, this.grid.imgSelection && (t.style.backgroundImage = "url('" + this.grid.imgSelection.src + "')"), i = 0; i < this.cells.length; i++) this.grid.columnsArray[i].hidden || (e = document.createElement("td"), e.noWrap = !0, e.className = GleamTech.JavaScript.UI.GridViewCellCssClass, t.appendChild(e), this.grid.columnsArray[i].alignRight && (e.style.textAlign = "right"), e.style.minWidth = "80px", u = document.createElement("span"), e.appendChild(u), s = this.grid.columnsArray[i].formatFunction, f = s ? s(this.cells[i], this.grid.columnsArray[i].format, this) : this.cells[i], f.length == 0 && (f = "?"), this.grid.columnsArray[i].size > 0 && f.length > this.grid.columnsArray[i].size && (f = f.substr(0, this.grid.columnsArray[i].size) + "..."), h = document.createTextNode(f != null ? f: String.fromCharCode(160)), i == this.grid.visibleFirstColumn.index ? (this.grid.useIconCls ? (r = document.createElement("span"), r.className = this.icon, r.style.display = "inline-block") : (r = new Image, r.src = this.icon), r.style.width = this.grid.iconWidth + "px", r.style.height = this.grid.iconHeight + "px", r.style.verticalAlign = "top", this.grid.isIE7 || (r.style.position = "relative"), r.style.marginRight = "4px", u.appendChild(r), c = document.createElement("span"), u.appendChild(c), c.appendChild(h), u.style.display = "block", u.style.height = this.grid.gridRowHeight + "px", u.style.lineHeight = this.grid.gridRowHeight - 2 + "px", r.style.top = Math.round((this.grid.gridRowHeight - this.grid.iconHeight) / 2) - 1 + "px", u.isContainerSpan = !0) : u.appendChild(h));
    this.rowElement = t;
    n || this.grid.Resize()
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onMouseDown = function(n) {
    var f, e, c, r, o, s, h, u, t, i;
    if (n || (n = window.event), f = n.which ? n.which == 1 : n.button == 1, e = n.which ? n.which == 3 : n.button == 2, e && (f = !1), c = n.metaKey || n.ctrlKey, n.isSimulatedMouseEvent && (t = GleamTech.JavaScript.Util.GetEventTarget(n), i = t.nodeName == "SPAN" && t.firstChild.nodeType == 3 && t.firstChild.nodeValue == String.fromCharCode(160), t.nodeName == "TD" || t.isContainerSpan || i)) return ! 1;
    if (this.grid.mouseDownRow = this, GleamTech.JavaScript.Util.AddEvent(document, "mouseup", this.mouseUpEvent), GleamTech.JavaScript.Util.AddEvent(document, "touchend", GleamTech.JavaScript.Util.SimulateMouse), n.isSimulatedMouseEvent) return ! 0;
    if (f) if (n.shiftKey) {
        for (r = this.grid.lastSelectedRow, this.grid.unselectAllRowsInternal(), o = r ? r.index: 0, s = this.index, h = o < s ? 1 : -1, u = o; u != s + h; u += h) this.grid.rowsArray[u].Select();
        this.grid.lastSelectedRow = r
    } else c ? this.selected ? this.Unselect() : this.Select() : (this.grid.unselectAllRowsInternal(), this.Select());
    else e && (t = GleamTech.JavaScript.Util.GetEventTarget(n), i = t.nodeName == "SPAN" && t.firstChild.nodeType == 3 && t.firstChild.nodeValue == String.fromCharCode(160), this.selected || t.nodeName == "TD" || t.isContainerSpan || i || (this.grid.unselectAllRowsInternal(), this.Select()));
    return ! 0
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onMouseUp = function(n) {
    if (n || (n = window.event), n.isSimulatedMouseEvent && (this.selected ? this.grid.rowContextMenuActive ? this.grid.rowContextMenuActive = !1 : this.grid.mouseOverActive ? this.grid.mouseOverActive = !1 : this.Unselect() : this.grid.mainContextMenuActive ? this.grid.mainContextMenuActive = !1 : this.Select()), this.grid.mouseDownRow = null, GleamTech.JavaScript.Util.RemoveEvent(document, "mouseup", this.mouseUpEvent), GleamTech.JavaScript.Util.RemoveEvent(document, "touchend", GleamTech.JavaScript.Util.SimulateMouse), this.grid.onSelectionComplete) this.grid.onSelectionComplete(n);
    return ! 0
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onMouseOver = function(n) {
    var t;
    if (n || (n = window.event), this.grid.mouseDownRow) {
        if (this.grid.mouseDownRow == this && !n.isSimulatedMouseEvent || !this.grid.lastSelectedRow) return;
        if (n.isSimulatedMouseEvent && (this.grid.mainContextMenuActive || this.grid.rowContextMenuActive)) return;
        this.grid.mouseOverActive = !0;
        var i = this.grid.lastSelectedRow.index,
        r = this.index,
        u = i <= r ? 1 : -1;
        for (i += u, r += u, t = i; t != r; t += u) this.grid.rowsArray[t].Select()
    } else {
        if (n.isSimulatedMouseEvent) return;
        if (this.selected) this.onStyleChange(this.grid.styleGridRowSelectedHover);
        else this.onStyleChange(this.grid.styleGridRowHover)
    }
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onMouseOut = function() {
    var n;
    if (this.grid.mouseDownRow) {
        if (this.grid.lastSelectedRow == this || !this.grid.lastSelectedRow) return;
        var t = this.grid.lastSelectedRow.index,
        i = this.index,
        r = t < i ? 1 : -1;
        for (n = t; n != i; n += r) this.grid.rowsArray[n].Unselect()
    } else if (this.selected) this.onStyleChange(this.grid.lastSelectedRow == this ? this.grid.styleGridRowFocused: this.grid.styleGridRowSelected);
    else this.onStyleChange(this.grid.styleGridRow)
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onContextMenu = function(n) {
    n || (n = window.event);
    var t = GleamTech.JavaScript.Util.GetEventTarget(n),
    i = t.nodeName == "SPAN" && t.firstChild.nodeType == 3 && t.firstChild.nodeValue == String.fromCharCode(160);
    if (!this.selected && (t.nodeName == "TD" || t.isContainerSpan || i)) {
        this.onMouseOut(n);
        return this.grid.mainContextMenuActive = !0,
        !1
    }
    if (this.grid.onRowContextMenu) {
        n.isSimulatedMouseEvent && !this.selected && (this.grid.unselectAllRowsInternal(), this.Select());
        this.grid.onRowContextMenu(this, n);
        return this.grid.rowContextMenuActive = !0,
        GleamTech.JavaScript.Util.CancelEvent(n)
    }
    return ! 0
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onDoubleClick = function(n) {
    if (n || (n = window.event), this.grid.onRowDoubleClick) this.grid.onRowDoubleClick(this, n)
};
GleamTech.JavaScript.UI.GridViewRow.prototype.Select = function() {
    if (!this.selected && (this.grid.multipleSelection || !(this.grid.selectedCount > 0))) {
        if (this.selected = !0, this.grid.selectedRowsArray.push(this), this.grid.lastFocusedRow = this, this.grid.selectedCount++, this.grid.lastSelectedRow) this.grid.lastSelectedRow.onStyleChange(this.selected ? this.grid.styleGridRowSelected: this.grid.styleGridRow);
        this.grid.lastSelectedRow = this;
        this.onStyleChange(this.grid.styleGridRowFocused)
    }
};
GleamTech.JavaScript.UI.GridViewRow.prototype.Unselect = function() {
    if (this.selected) {
        this.selected = !1;
        for (var n = 0; n < this.grid.selectedRowsArray.length; n++) if (this.grid.selectedRowsArray[n] == this) {
            this.grid.selectedRowsArray.splice(n, 1);
            break
        }
        this.grid.lastSelectedRow = this;
        this.grid.selectedCount--;
        this.grid.lastSelectedRow == this && (this.grid.lastSelectedRow = null);
        this.onStyleChange(this.grid.styleGridRow)
    }
};
GleamTech.JavaScript.UI.GridViewRow.prototype.onStyleChange = function(n) {
    this.rowElement.className = n
};