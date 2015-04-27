var GleamTech = GleamTech || {};
GleamTech.JavaScript = GleamTech.JavaScript || {};
GleamTech.JavaScript.UI = GleamTech.JavaScript.UI || {};
GleamTech.JavaScript.UI.FileUploaderMinimumWidth = 400;
GleamTech.JavaScript.UI.FileUploaderMinimumHeight = 200;
GleamTech.JavaScript.UI.FileUploaderCssClass = "gt-fileUploader gt-nonSelectableText";
GleamTech.JavaScript.UI.FileUploaderInfoPaneCssClass = "gt-infoPane";
GleamTech.JavaScript.UI.FileUploaderInfoPaneTitleCssClass = "gt-infoPaneTitle";
GleamTech.JavaScript.UI.FileUploaderWarningTextCssClass = "gt-warningText";
GleamTech.JavaScript.UI.FileUploaderGridColumnTypes = {
    Name: {
        Text: "Label.Column.Name",
        Type: "CaseInsensitiveString",
        AlignRight: !1,
        Size: 33
    },
    Size: {
        Text: "Label.Column.Size",
        Type: "Number",
        AlignRight: !0
    },
    Type: {
        Text: "Label.Column.Type",
        Type: "CaseInsensitiveString",
        AlignRight: !1
    },
    Status: {
        Text: "FileUploader.Column.Status",
        Type: "Number",
        AlignRight: !1
    }
};
GleamTech.JavaScript.UI.FileUploaderUploadMethodType = {
    Html4: 0,
    Flash: 1,
    Silverlight: 2,
    Html5: 3
};
GleamTech.JavaScript.UI.FileUploaderUploadStatus = {
    Pending: 1,
    Rejected: 2,
    Skipped: 3,
    Uploading: 4,
    Canceled: 5,
    Failed: 6,
    Completed: 7
};
GleamTech.JavaScript.UI.FileUploaderOverallStatus = {
    Adding: 1,
    FileStarted: 2,
    FileProcessing: 3,
    FileCompleted: 4,
    Stopped: 5,
    Processed: 6
};
GleamTech.JavaScript.UI.FileUploaderValidationAction = {
    Accept: 0,
    Reject: 1,
    ConfirmReplace: 2
};
GleamTech.JavaScript.UI.FileUploader = function(n) {
    var t, r, i;
    if (document.compatMode == "BackCompat") {
        alert("FileUploader can not be rendered correctly in quirks mode.\nPlease use a proper doctype declaration in the host page.");
        return
    }
    if (GleamTech.JavaScript.Util.GetIEVersion() < 7) {
        alert("FileUploader requires Internet Explorer 7 as a minimum.\nPlease upgrade your IE version or use another browser.");
        return
    }
    if (this.Parameters = n, t = this, this.Uploading = null, this.Uploaded = null, this.ItemUploading = null, this.ItemUploaded = null, this.Language = GleamTech.JavaScript.Util.GetLanguage(this.Parameters.Language), this.ElementControl = document.createElement("div"), this.ElementControl.id = this.Parameters.ElementId, this.Parameters.ShowOnLoad || (this.ElementControl.style.display = "none"), this.ElementControl.className = GleamTech.JavaScript.UI.FileUploaderCssClass, this.ElementControl.style.height = "1px", this.ElementControl.style.overflow = "hidden", GleamTech.JavaScript.Util.AddEvent(this.ElementControl, "contextmenu", GleamTech.JavaScript.Util.CancelEventExceptForTextInput), GleamTech.JavaScript.Util.AddEvent(this.ElementControl, "selectstart", GleamTech.JavaScript.Util.CancelEventExceptForTextInput), GleamTech.JavaScript.Util.AddEvent(this.ElementControl, "dragstart", GleamTech.JavaScript.Util.CancelEventExceptForTextInput), this.Parameters.FullViewport && !this.Parameters.ModalDialog) document.body.appendChild(this.ElementControl),
    this.ElementControl.style.position = "absolute";
    else {
        this.ElementControl.style.position = "relative";
        try {
            if (this.Parameters.Container && this.Parameters.Container.nodeType) this.Parameters.Container.appendChild(this.ElementControl);
            else if (this.Parameters.PlaceHolder && this.Parameters.PlaceHolder.parentNode) this.Parameters.PlaceHolder.parentNode.replaceChild(this.ElementControl, this.Parameters.PlaceHolder);
            else {
                alert("FileUploader can not be rendered:\nA valid container or placeholder is not specified.");
                return
            }
        } catch(u) {
            alert("FileUploader can not be rendered:\n" + u.message);
            return
        }
    }
    this.ElementUploadInfo = document.createElement("div");
    this.ElementUploadInfo.id = this.Parameters.ElementId + "-folderInfo";
    this.ElementUploadInfo.className = GleamTech.JavaScript.UI.FileUploaderInfoPaneCssClass;
    this.ElementUploadInfo.style.height = "40px";
    this.ElementUploadInfo.style.paddingLeft = "6px";
    this.ElementUploadInfo.style.paddingTop = "3px";
    this.ElementUploadInfo.style.paddingRight = "6px";
    this.ElementUploadInfo.style.paddingBottom = "3px";
    this.ElementUploadInfo.style.position = "relative";
    this.ElementControl.appendChild(this.ElementUploadInfo);
    this.ElementUploadInfoImage = new Image;
    this.ElementUploadInfoImage.src = this.getResourceUrl("images/icons32/upload.png");
    this.ElementUploadInfoImage.style.width = "32px";
    this.ElementUploadInfoImage.style.height = "32px";
    this.ElementUploadInfoImage.style.top = "7px";
    this.ElementUploadInfoImage.style.position = "absolute";
    this.ElementUploadInfo.appendChild(this.ElementUploadInfoImage);
    this.ElementUploadInfoTitle = document.createElement("div");
    this.ElementUploadInfoTitle.style.width = "200px";
    this.ElementUploadInfoTitle.style.height = "40px";
    this.ElementUploadInfoTitle.style.lineHeight = "40px";
    this.ElementUploadInfoTitle.style.position = "absolute";
    this.ElementUploadInfoTitle.style.left = "44px";
    this.ElementUploadInfoTitle.className = GleamTech.JavaScript.UI.FileUploaderInfoPaneTitleCssClass;
    this.ElementUploadInfoTitle.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.SelectFiles")));
    this.ElementUploadInfo.appendChild(this.ElementUploadInfoTitle);
    this.ElementUploadInfoStats = document.createElement("div");
    this.ElementUploadInfoStats.style.width = "150px";
    this.ElementUploadInfoStats.style.height = "40px";
    this.ElementUploadInfoStats.style.lineHeight = "40px";
    this.ElementUploadInfoStats.style.position = "absolute";
    this.ElementUploadInfoStats.style.right = "6px";
    this.ElementUploadInfoStats.style.textAlign = "center";
    this.ElementUploadInfoStats.appendChild(document.createTextNode(String.fromCharCode(160)));
    this.ElementUploadInfo.appendChild(this.ElementUploadInfoStats);
    this.GridView = new GleamTech.JavaScript.UI.GridView;
    this.GridView.SetIconSize(16, 16);
    this.GridView.onRowContextMenu = function(n, i) {
        t.onGridRowContextMenu(n, i)
    };
    this.GridView.onGridContextMenu = function(n) {
        t.onGridContextMenu(n)
    };
    for (r in GleamTech.JavaScript.UI.FileUploaderGridColumnTypes) i = GleamTech.JavaScript.UI.FileUploaderGridColumnTypes[r],
    this.GridView.AddColumn(r, this.Language.GetEntry(i.Text), i.Type, i.AlignRight, null, i.Size);
    this.GridView.AddColumn("FileHandle").hidden = !0;
    this.GridView.rowTitleColumn = this.GridView.columns.Name;
    this.Parameters.ShowFileExtensions || (this.GridView.columns.Name.formatFunction = GleamTech.JavaScript.Util.GetFileNameWithoutExtension);
    this.GridView.columns.Size.formatFunction = GleamTech.JavaScript.Util.FormatFileSize;
    this.GridView.Render(this.Parameters.ElementId + "-gridView", this.ElementControl);
    this.ElementDropOverlay = document.createElement("div");
    this.ElementDropOverlay.id = this.GridView.divElement.id + "-dropOverlay";
    this.ElementDropOverlay.style.position = "absolute";
    this.ElementDropOverlay.style.backgroundColor = "transparent";
    this.ElementDropOverlay.style.display = "none";
    this.ElementControl.appendChild(this.ElementDropOverlay);
    this.ElementFooter = document.createElement("div");
    this.ElementFooter.id = this.Parameters.ElementId + "-footer";
    this.ElementFooter.style.position = "relative";
    this.ElementControl.appendChild(this.ElementFooter);
    this.ElementQueueAdding = document.createElement("div");
    this.ElementQueueAdding.id = this.Parameters.ElementId + "-queueAdding";
    this.ElementQueueAdding.style.paddingTop = "10px";
    this.ElementQueueAdding.style.paddingLeft = "6px";
    this.ElementQueueAdding.style.paddingBottom = "10px";
    this.ElementQueueAdding.style.paddingRight = "6px";
    this.ElementFooter.appendChild(this.ElementQueueAdding);
    this.ElementQueueAddingVisible = !0;
    this.ButtonAdd = document.createElement("input");
    this.ButtonAdd.id = this.Parameters.ElementId + "-addButton";
    this.ButtonAdd.type = "button";
    this.ButtonAdd.value = this.Language.GetEntry("FileUploader.Action.Add");
    this.ButtonAdd.style.width = "80px";
    this.ButtonAdd.disabled = !0;
    this.ElementQueueAdding.appendChild(this.ButtonAdd);
    this.ButtonUpload = document.createElement("input");
    this.ButtonUpload.type = "button";
    this.ButtonUpload.value = this.Language.GetEntry("Label.Upload.Verb");
    this.ButtonUpload.style.width = "80px";
    this.ButtonUpload.style.marginLeft = "6px";
    this.ButtonUpload.disabled = !0;
    this.ElementQueueAdding.appendChild(this.ButtonUpload);
    GleamTech.JavaScript.Util.AddEvent(this.ButtonUpload, "click",
    function() {
        t.BeginQueue()
    });
    this.ButtonClose = document.createElement("input");
    this.ButtonClose.type = "button";
    this.ButtonClose.value = this.Language.GetEntry("FileUploader.Action.Close");
    this.ButtonClose.style.width = "80px";
    this.ButtonClose.style.position = "absolute";
    this.ButtonClose.style.right = "6px";
    this.ElementQueueAdding.appendChild(this.ButtonClose);
    GleamTech.JavaScript.Util.AddEvent(this.ButtonClose, "click",
    function() {
        t.Hide()
    });
    GleamTech.JavaScript.UI.ContextMenuIconsPath["default"] = this.getResourceUrl("images/icons16/");
    this.ContextMenus = GleamTech.JavaScript.UI.ContextMenu.Parse(this.ElementControl, GleamTech.JavaScript.UI.FileUploaderContextMenusData,
    function(n) {
        t.onAction(n, n.menu.target)
    },
    this.Language);
    this.ModalDialog = new GleamTech.JavaScript.UI.ModalDialog(this.ElementControl);
    this.ModalDialog.OkButtonText = this.Language.GetEntry("Label.OK");
    this.ModalDialog.CancelButtonText = this.Language.GetEntry("Label.Cancel");
    this.Parameters.ModalDialog && (this.ParentModalDialog = new GleamTech.JavaScript.UI.ModalDialog(this.Parameters.FullViewport ? null: this.ElementControl.parentNode), this.ParentModalDialog.OkButtonText = this.Language.GetEntry("Label.OK"), this.ParentModalDialog.CancelButtonText = this.Language.GetEntry("Label.Cancel"));
    this.SetFileTypes(this.Parameters.FileTypes);
    this.SetCustomParameters({});
    this.ActiveUploader = null;
    this.ActiveUploadMethod = null;
    this.LastUploadMethod = null;
    this.hidden = !0;
    this.Parameters.ShowOnLoad && this.Show()
};
GleamTech.JavaScript.UI.FileUploader.prototype.getResourceUrl = function(n) {
    return GleamTech.JavaScript.Util.AppendToUrl(this.Parameters.ResourceBasePath, n)
};
GleamTech.JavaScript.UI.FileUploader.prototype.getActionUrl = function(n) {
    return GleamTech.JavaScript.Util.AppendToUrl(this.Parameters.ActionBasePath, n)
};
GleamTech.JavaScript.UI.FileUploader.prototype.SetSize = function(n, t) {
    var u, i, r = this;
    return GleamTech.JavaScript.Util.EnsureDisplay(this.ElementControl,
    function(f) {
        n ? (f.style.width = n, f.style.width = f.offsetWidth < GleamTech.JavaScript.UI.FileUploaderMinimumWidth ? GleamTech.JavaScript.UI.FileUploaderMinimumWidth - (f.offsetWidth - f.clientWidth) + "px": f.clientWidth - (f.offsetWidth - f.clientWidth) + "px") : f.offsetWidth < GleamTech.JavaScript.UI.FileUploaderMinimumWidth && (f.style.width = GleamTech.JavaScript.UI.FileUploaderMinimumWidth - (f.offsetWidth - f.clientWidth) + "px");
        t ? (f.style.height = t, f.style.height = f.offsetHeight < GleamTech.JavaScript.UI.FileUploaderMinimumHeight ? GleamTech.JavaScript.UI.FileUploaderMinimumHeight - (f.offsetHeight - f.clientHeight) + "px": f.clientHeight - (f.offsetHeight - f.clientHeight) + "px") : f.offsetHeight < GleamTech.JavaScript.UI.FileUploaderMinimumHeight && (f.style.height = GleamTech.JavaScript.UI.FileUploaderMinimumHeight - (f.offsetHeight - f.clientHeight) + "px");
        u = f.clientWidth;
        i = f.clientHeight;
        r.GridView.Resize(null, i - r.ElementUploadInfo.offsetHeight - r.ElementFooter.offsetHeight)
    }),
    [u, i]
};
GleamTech.JavaScript.UI.FileUploader.prototype.resize = function() {
    this.Parameters.FullViewport && !this.Parameters.ModalDialog ? (this.ElementControl.style.left = GleamTech.JavaScript.Util.Viewport.GetScrollLeft() + "px", this.ElementControl.style.top = GleamTech.JavaScript.Util.Viewport.GetScrollTop() + "px", this.SetSize(GleamTech.JavaScript.Util.Viewport.GetWidth() + "px", GleamTech.JavaScript.Util.Viewport.GetHeight() + "px")) : this.SetSize(this.Parameters.Width, this.Parameters.Height)
};
GleamTech.JavaScript.UI.FileUploader.prototype.Show = function() {
    if (this.hidden) {
        var n = this;
        this.Parameters.ModalDialog ? (this.ElementOriginalParent = this.ElementControl.parentNode, this.ElementControl.style.border = "none", this.ParentModalDialogElement = this.ParentModalDialog.ShowElement(this.ElementControl, this.Parameters.ModalDialogTitle,
        function() {
            n.ElementControl.style.display = "block";
            n.resize()
        },
        function() {
            return n.onHide()
        })) : (this.Parameters.FullViewport && (this.oldParentOverflow = document.body.style.overflow, document.body.style.overflow = "hidden"), this.ElementControl.style.display = "block", this.resize());
        this.LastUploadMethod == null ? this.TryLoadUploaders(this.Parameters.UploadMethods) : this.LoadUploader(this.LastUploadMethod,
        function(t) {
            t.Success || n.TryLoadUploaders(n.Parameters.UploadMethods)
        });
        this.oldWindowBeforeUnloadEvent = window.onbeforeunload;
        window.onbeforeunload = function() {
            return n.IsQueueInProgress ? n.Language.GetEntry("FileUploader.Confirm.UploadStillInProgress") : typeof n.oldWindowBeforeUnloadEvent == "function" ? n.oldWindowBeforeUnloadEvent.apply(null, arguments) : undefined
        };
        this.hidden = !1
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.Hide = function() {
    this.hidden || (this.Parameters.ModalDialog ? this.ParentModalDialog.Close(this.ParentModalDialogElement) : (this.onHide(), this.Parameters.FullViewport && (document.body.style.overflow = this.oldParentOverflow)))
};
GleamTech.JavaScript.UI.FileUploader.prototype.onHide = function() {
    if (this.IsQueueInProgress) if (confirm(this.Language.GetEntry("FileUploader.Confirm.UploadStillInProgress"))) this.Cancel();
    else return ! 1;
    this.UnloadUploader();
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Adding);
    return this.Parameters.ModalDialog ? (this.ElementControl.style.display = "none", this.ElementOriginalParent.appendChild(this.ElementControl)) : this.ElementControl.style.display = "none",
    window.onbeforeunload = this.oldWindowBeforeUnloadEvent,
    this.hidden = !0,
    !0
};
GleamTech.JavaScript.UI.FileUploader.prototype.TryLoadUploaders = function(n) {
    var t, u, r, i, h, o;
    if (n != null) {
        t = [];
        for (u in GleamTech.JavaScript.UI.FileUploaderUploadMethodType) t.push({
            Name: u.toLowerCase(),
            Value: GleamTech.JavaScript.UI.FileUploaderUploadMethodType[u]
        });
        var f = [],
        e = 0,
        s = n.split(/\s?,\s?/);
        for (r = 0; r < s.length; r++) for (i = 0; i < t.length; i++) s[r].toLowerCase() == t[i].Name && f.push(t[i].Value);
        h = this;
        o = function() {
            e != f.length && h.LoadUploader(f[e],
            function(n) {
                e++;
                n.Success || o()
            })
        };
        o()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.LoadUploader = function(n, t) {
    var i, u, r;
    if (this.ActiveUploadMethod != n) {
        this.UnloadUploader();
        this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Adding);
        u = {
            browse_button: this.ButtonAdd.id,
            container: this.ElementQueueAdding.id,
            filters: this.ActiveFileFilters
        };
        switch (n) {
        case GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html4:
            i = new plupload.Uploader(plupload.extend(u, {
                runtimes: "html4"
            }));
            this.IsFileSizeSupported = !1;
            this.IsRealTimeProgressSupported = !1;
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Flash:
            i = new plupload.Uploader(plupload.extend(u, {
                runtimes: "flash",
                multipart: !1,
                chunk_size: "4mb",
                flash_swf_url: this.getResourceUrl("flash/plupload.swf")
            }));
            this.IsFileSizeSupported = !0;
            this.IsRealTimeProgressSupported = !1;
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Silverlight:
            i = new plupload.Uploader(plupload.extend(u, {
                runtimes: "silverlight",
                multipart: !1,
                chunk_size: "4mb",
                silverlight_xap_url: this.getResourceUrl("silverlight/plupload.xap")
            }));
            this.IsFileSizeSupported = !0;
            this.IsRealTimeProgressSupported = !1;
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html5:
            i = new plupload.Uploader(plupload.extend(u, {
                runtimes: "html5",
                multipart: !1,
                chunk_size: "4mb",
                drop_element: this.ElementDropOverlay.id,
                required_features: "chunks"
            }));
            this.IsFileSizeSupported = !0;
            this.IsRealTimeProgressSupported = !0;
            break;
        default:
            t({
                Success:
                !1,
                UploadMethod: n
            });
            return
        }
        r = this;
        i.settings.preinit = function() {
            i.bind("Error",
            function(u, f) {
                if (f.code == plupload.INIT_ERROR) i.destroy(),
                i = null,
                t({
                    Success: !1,
                    UploadMethod: n
                });
                else r.onUploadClientError(f);
                return ! 1
            });
            i.bind("Init",
            function() {
                r.ActiveUploadMethod = n;
                r.ActiveUploader = i;
                r.IsRealTimeProgressSupported = r.IsRealTimeProgressSupported && i.features.progress;
                r.onDropAreaChange(!0);
                r.ButtonAdd.disabled = !1;
                r.ElementQueueAdding.title = r.Language.GetEntry("FileUploader.Action.UploadMethod") + ": " + GleamTech.JavaScript.Util.GetPropertyName(GleamTech.JavaScript.UI.FileUploaderUploadMethodType, n);
                t({
                    Success: !0,
                    UploadMethod: n
                })
            });
            i.bind("FilesAdded",
            function(n, t) {
                r.onFilesAdding(t);
                return ! 1
            });
            i.bind("UploadProgress",
            function(n, t) {
                if (!r.IsRealTimeProgressSupported || r.GridRowInProgress.GetCellValue(r.GridView.columns.Status) != GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading) return ! 1;
                r.onUploadProgress(r.GridRowInProgress, t.size, t.loaded);
                return ! 1
            });
            i.bind("ChunkUploaded",
            function(n, t, i) {
                r.onChunkResponse(i, t);
                return ! 1
            });
            i.bind("FileUploaded",
            function(n, t, i) {
                r.onUploadResponse(i.response, t);
                return ! 1
            })
        };
        i.settings.init = function() {};
        i.ex = {};
        i.ex.sendMultipartParamsAsQuerystring = !0;
        i.ex.startQueue = function() {
            i.state != plupload.STARTED && (i.state = plupload.STARTED, i.trigger("StateChanged"))
        };
        i.ex.stopQueue = function() {
            i.state != plupload.STOPPED && (i.state = plupload.STOPPED, i.trigger("CancelUpload"), i.trigger("StateChanged"), n == GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html4 && i.refresh())
        };
        i.ex.uploadFile = function(n) {
            n.status = plupload.UPLOADING;
            i.trigger("UploadFile", n)
        };
        i.init()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.UnloadUploader = function() {
    if (this.ButtonAdd.disabled = !0, this.ActiveUploader != null) {
        this.onAction({
            action: "Clear"
        });
        this.ActiveUploader.destroy();
        this.ActiveUploader = null
    }
    this.LastUploadMethod = this.ActiveUploadMethod;
    this.ActiveUploadMethod = null
};
GleamTech.JavaScript.UI.FileUploader.prototype.onDropAreaChange = function(n) {
    if (n = n && this.ActiveUploader && this.ActiveUploader.features.dragdrop, n) {
        this.showDropInfo();
        this.ElementDropOverlay.style.top = this.GridView.divElement.offsetTop + this.GridView.divColumns.offsetHeight + "px";
        this.ElementDropOverlay.style.width = this.GridView.divRowsTable.offsetWidth + "px";
        this.ElementDropOverlay.style.height = this.GridView.divRowsTable.offsetHeight + "px";
        var t = this;
        plupload.addEvent(this.GridView.divRowsTable, "dragenter",
        function() {
            t.ElementDropOverlay.style.display = "block";
            t.GridView.divRowsTable.style.backgroundColor = "#F3F7FD"
        },
        "dropInfo");
        plupload.addEvent(this.ElementDropOverlay, "dragleave",
        function() {
            t.ElementDropOverlay.style.display = "none";
            t.GridView.divRowsTable.style.backgroundColor = ""
        },
        "dropInfo");
        plupload.addEvent(this.ElementDropOverlay, "drop",
        function() {
            t.ElementDropOverlay.style.display = "none";
            t.GridView.divRowsTable.style.backgroundColor = ""
        },
        "dropInfo")
    } else plupload.removeEvent(this.GridView.divRowsTable, "dragenter", "dropInfo"),
    plupload.removeEvent(this.ElementDropOverlay, "dragleave", "dropInfo"),
    plupload.removeEvent(this.ElementDropOverlay, "drop", "dropInfo"),
    this.hideDropInfo()
};
GleamTech.JavaScript.UI.FileUploader.prototype.showDropInfo = function() {
    this.ElementDropInfo || this.ActiveUploader && this.ActiveUploader.features.dragdrop && (this.ElementDropInfo = document.createElement("div"), this.ElementDropInfo.className = GleamTech.JavaScript.UI.FileUploaderWarningTextCssClass, this.ElementDropInfo.style.position = "absolute", this.ElementDropInfo.style.width = "100%", this.ElementDropInfo.style.top = "40%", this.ElementDropInfo.style.textAlign = "center", this.ElementDropInfo.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.DragAndDrop"))), this.GridView.divElement.appendChild(this.ElementDropInfo))
};
GleamTech.JavaScript.UI.FileUploader.prototype.hideDropInfo = function() {
    this.ElementDropInfo && (this.GridView.divElement.removeChild(this.ElementDropInfo), this.ElementDropInfo = null)
};
GleamTech.JavaScript.UI.FileUploader.prototype.SetFileTypes = function(n) {
    n = n && GleamTech.JavaScript.Util.Trim(n) != "" ? GleamTech.JavaScript.Util.Trim(n) : "*/";
    var r = n.split("/"),
    t = GleamTech.JavaScript.Util.Trim(r[0]),
    i = "";
    r.length > 1 && (i = GleamTech.JavaScript.Util.Trim(r[1]));
    this.AllowedFilesRegExp = t == "*" ? null: this.createFileTypesRegex(t);
    this.DeniedFilesRegExp = i == "" ? null: this.createFileTypesRegex(i);
    this.Parameters.FileTypes = n;
    this.ActiveFileFilters = this.createFileFilters(t);
    this.AllowedFileTypesText = this.AllowedFilesRegExp == null ? "": t.split("|").join(", ");
    this.DeniedFileTypesText = this.DeniedFilesRegExp == null ? "": i.split("|").join(", ")
};
GleamTech.JavaScript.UI.FileUploader.prototype.createFileFilters = function(n) {
    for (var i, r, u = n.split("|"), f = !0, e = [], o = [], t = 0; t < u.length; t++) {
        if (i = GleamTech.JavaScript.Util.Trim(u[t]), r = i.match(/^\*\.([^\*\?]+)$/), r == null) {
            f = !1;
            break
        }
        o.push(i);
        e.push(r[1])
    }
    return f ? [{
        title: this.Language.GetEntry("FileUploader.Label.SpecificFiles", o.join(";")),
        extensions: e.join(",")
    }] : []
};
GleamTech.JavaScript.UI.FileUploader.prototype.createFileTypesRegex = function(n) {
    for (var u, r = n.split("|"), t = "^(", i = 0; i < r.length; i++) u = GleamTech.JavaScript.Util.EscapeRegExpPattern(GleamTech.JavaScript.Util.Trim(r[i])),
    t += u.replace(/\\\?/g, ".").replace(/\\\*/g, ".*"),
    i < r.length - 1 && (t += "|");
    return t += ")$",
    new RegExp(t, "i")
};
GleamTech.JavaScript.UI.FileUploader.prototype.isFileAllowed = function(n) {
    return this.DeniedFilesRegExp && this.DeniedFilesRegExp.test(n) ? !1 : this.AllowedFilesRegExp ? this.AllowedFilesRegExp.test(n) : !0
};
GleamTech.JavaScript.UI.FileUploader.prototype.SetCustomParameters = function(n) {
    this.CustomParameters = n ? n: {}
};
GleamTech.JavaScript.UI.FileUploader.prototype.getFileIconName = function(n) {
    n = n.toUpperCase();
    for (var t in GleamTech.JavaScript.UI.FileUploaderFileIconMappings) if (t == n) return GleamTech.JavaScript.UI.FileUploaderFileIconMappings[t];
    return "unknown.png"
};
GleamTech.JavaScript.UI.FileUploader.prototype.onFilesAdding = function(n) {
    var h, r, t, o, i, s, u, f, c, e;
    for (this.GridView.ResetSort(), h = /(iPhone|iPod|iPad)/i.test(navigator.userAgent), r = 0; r < n.length; r++) {
        if (t = n[r], t.status = plupload.QUEUED, !this.isFileAllowed(t.name)) {
            o = this.Language.GetEntry("Message.Error.FileNotAllowed", t.name);
            i = "";
            this.AllowedFileTypesText.length != 0 && (i += "\n" + this.Language.GetEntry("Label.Info.AllowedFileTypes", this.AllowedFileTypesText));
            this.DeniedFileTypesText.length != 0 && (i += "\n" + this.Language.GetEntry("Label.Info.DeniedFileTypes", this.DeniedFileTypesText));
            i.length != 0 && (o += "\n" + i);
            alert(o);
            continue
        }
        for (h && t.name.toLowerCase() == "image.jpg" && (t.name = "image-" + GleamTech.JavaScript.Util.CreateUniqueId() + ".jpg"), s = !1, u = 0; u < this.GridView.rowsArray.length; u++) if (this.GridView.rowsArray[u].GetCellValue(this.GridView.columns.Name) == t.name) {
            s = !0;
            break
        }
        if (s) {
            alert(this.Language.GetEntry("FileUploader.Error.FileAlreadyAdded", t.name));
            continue
        }
        this.ActiveUploader.files.push(t);
        t.customId = GleamTech.JavaScript.Util.CreateUniqueId();
        f = GleamTech.JavaScript.Util.GetFileExtension(t.name);
        c = f == "" ? this.Language.GetEntry("Label.File") : this.Language.GetEntry("Label.FileType", GleamTech.JavaScript.Util.TrimStart(f, ".").toUpperCase());
        e = this.GridView.AddRow([t.name, this.IsFileSizeSupported ? t.size: "", c, "", t], this.getFileIconName(GleamTech.JavaScript.Util.TrimStart(f, ".")));
        e.Render();
        this.onUploadStatusChange(e, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Pending);
        this.GridView.ScrollToRow(e);
        this.IsFileSizeSupported && (this.TotalUploadSize += t.size);
        this.onQueueChange()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.checkSessionError = function(n) {
    return n.indexOf("SessionExpired") != -1 || n.indexOf("StateNotFound") != -1 ? (GleamTech.JavaScript.Util.RefreshPage(), !0) : !1
};
GleamTech.JavaScript.UI.FileUploader.prototype.onQueueChange = function() {
    var n = this.GridView.rowsArray.length > 0;
    this.ButtonUpload.disabled = !n;
    this.ElementUploadInfoStats.innerHTML = this.Language.GetEntry("FileManager.Label.Files", "<b>" + this.GridView.rowsArray.length + "<\/b>");
    this.IsFileSizeSupported && n && (this.ElementUploadInfoStats.innerHTML += ", <b>" + GleamTech.JavaScript.Util.FormatFileSize(this.TotalUploadSize) + "<\/b>");
    n ? this.hideDropInfo() : this.showDropInfo()
};
GleamTech.JavaScript.UI.FileUploader.prototype.onGridRowContextMenu = function(n, t) {
    this.IsQueueInProgress ? this.ContextMenus.GridRows.menuItems.Remove.Disable() : this.ContextMenus.GridRows.menuItems.Remove.Enable();
    this.ContextMenus.GridRows.Popup(t, n)
};
GleamTech.JavaScript.UI.FileUploader.prototype.onGridContextMenu = function(n) {
    var t, i;
    if (this.IsQueueInProgress) this.ContextMenus.GridMain.menuItems.Clear.Disable(),
    this.ContextMenus.GridMain.menuItems.UploadMethod.Disable();
    else if (this.GridView.rowsArray.length == 0) {
        this.ContextMenus.GridMain.menuItems.Clear.Disable();
        this.ContextMenus.GridMain.menuItems.UploadMethod.Enable();
        for (t in this.ContextMenus.GridMain.menuItems.UploadMethod.submenu.menuItems) i = this.ContextMenus.GridMain.menuItems.UploadMethod.submenu.menuItems[t],
        t == GleamTech.JavaScript.Util.GetPropertyName(GleamTech.JavaScript.UI.FileUploaderUploadMethodType, this.ActiveUploadMethod) ? i.ShowIcon() : i.HideIcon()
    } else this.ContextMenus.GridMain.menuItems.Clear.Enable(),
    this.ContextMenus.GridMain.menuItems.UploadMethod.Disable();
    this.GridView.UnSelectAllRows();
    this.ContextMenus.GridMain.Popup(n)
};
GleamTech.JavaScript.UI.FileUploader.prototype.BeginQueue = function() {
    for (var t, n = this,
    u = GleamTech.JavaScript.Util.GetPropertyName(GleamTech.JavaScript.UI.FileUploaderUploadMethodType, this.ActiveUploadMethod), i = {},
    r = 0; r < this.GridView.rowsArray.length; r++) t = this.GridView.rowsArray[r].GetCellValue(this.GridView.columns.FileHandle),
    i[t.customId] = {
        Name: t.name,
        Size: typeof t.size == "number" ? t.size: null
    };
    this.Uploading && this.Uploading(u, i) === !1 || (this.ActiveUploadId = GleamTech.JavaScript.Util.CreateUniqueId(), GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("Begin"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId,
        method: u,
        validations: i,
        customParameters: this.CustomParameters
    },
    function(t) {
        var r = {};
        r.gridRowIndex = 0;
        r.fileValidations = t;
        r.skippedItemIds = [],
        function i(t) {
            if (t.gridRowIndex == n.GridView.rowsArray.length) {
                t.skippedItemIds.length > 0 && n.Skip(t.skippedItemIds);
                n.ActiveUploader.ex.startQueue();
                n.UploadNext();
                return
            }
            t.gridRow = n.GridView.rowsArray[t.gridRowIndex];
            t.gridRowIndex++;
            t.file = t.gridRow.GetCellValue(n.GridView.columns.FileHandle);
            t.fileValidation = t.fileValidations[t.file.customId];
            switch (t.fileValidation.Action) {
            case GleamTech.JavaScript.UI.FileUploaderValidationAction.Accept:
                i(t);
                break;
            case GleamTech.JavaScript.UI.FileUploaderValidationAction.Reject:
                n.onUploadStatusChange(t.gridRow, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Rejected, {
                    message: t.fileValidation.ActionData
                });
                i(t);
                break;
            case GleamTech.JavaScript.UI.FileUploaderValidationAction.ConfirmReplace:
                var r = function(r, u) {
                    t.sameForAll = u;
                    t.lastSelectedAction = r;
                    switch (r) {
                    case "Replace":
                        i(t);
                        break;
                    case "Skip":
                        t.skippedItemIds.push(t.file.customId);
                        n.onUploadStatusChange(t.gridRow, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Skipped);
                        i(t);
                        break;
                    case "KeepBoth":
                        t.file.name = t.fileValidation.ActionData.NewFileName;
                        t.gridRow.rowElement.title = t.file.name;
                        var f = t.gridRow.rowElement.children[n.GridView.columns.Name.index].firstChild.lastChild;
                        f.innerHTML = t.file.name.length > n.GridView.columnsArray[n.GridView.columns.Name.index].size ? t.file.name.substr(0, n.GridView.columnsArray[n.GridView.columns.Name.index].size) + "...": t.file.name;
                        t.gridRow.SetCellValue(n.GridView.columns.Name, t.file.name);
                        i(t);
                        break;
                    case "Cancel":
                        n.Cancel()
                    }
                };
                if (t.sameForAll) r(t.lastSelectedAction, t.sameForAll);
                else n.onConfirmReplace(t.file, t.fileValidation, r)
            }
        } (r)
    },
    function(t) {
        n.checkSessionError(t.Message) || alert(t.Message)
    },
    function() {}))
};
GleamTech.JavaScript.UI.FileUploader.prototype.UploadNext = function() {
    for (var t = [], n = 0; n < this.GridView.rowsArray.length; n++) this.GridView.rowsArray[n].GetCellValue(this.GridView.columns.Status) == GleamTech.JavaScript.UI.FileUploaderUploadStatus.Pending && t.push(this.GridView.rowsArray[n]);
    t.length == 0 ? this.EndQueue() : this.Upload(t[0])
};
GleamTech.JavaScript.UI.FileUploader.prototype.Upload = function(n) {
    var r, u, i, t;
    this.onUploadStatusChange(n, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading);
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileStarted);
    if (this.ItemUploading && (r = n.GetCellValue(this.GridView.columns.Name), u = this.IsFileSizeSupported ? n.GetCellValue(this.GridView.columns.Size) : null, this.ItemUploading(r, u) === !1)) {
        this.onUploadStatusChange(n, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Skipped);
        return
    }
    this.IsQueueInProgress && (i = n.GetCellValue(this.GridView.columns.FileHandle), this.ActiveUploader.settings.url = plupload.buildUrl(this.getActionUrl(this.ActiveUploader.settings.multipart ? "SendMultipart": "SendStream"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId,
        itemId: i.customId,
        size: typeof i.size == "number" ? i.size: null
    }), this.ActiveUploader.ex.uploadFile(i), t = this, this.IsRealTimeProgressSupported ? this.TotalProcessedCount == 0 &&
    function e() {
        setTimeout(function() {
            GleamTech.JavaScript.Util.RequestJson(t.getActionUrl("KeepSessionAlive"), null,
            function() {
                t.IsQueueInProgress && e()
            },
            function() {},
            function() {})
        },
        3e4)
    } () : function f(r, u) {
        setTimeout(function() {
            GleamTech.JavaScript.Util.RequestJson(t.getActionUrl("GetProgress"), {
                stateId: t.Parameters.StateId,
                uploadId: t.ActiveUploadId,
                itemId: i.customId,
                first: u
            },
            function(i) {
                if (i != null && n.GetCellValue(t.GridView.columns.Status) == GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading) {
                    var r = i[0],
                    u = i[1];
                    t.onFileSizeDetermined(n, r);
                    t.onUploadProgress(n, r, u);
                    f(1e3, !1)
                }
            },
            function() {},
            function() {})
        },
        r)
    } (0, !0))
};
GleamTech.JavaScript.UI.FileUploader.prototype.onFileSizeDetermined = function(n, t) {
    if (n.GetCellValue(this.GridView.columns.Size) == "") {
        n.SetCellValue(this.GridView.columns.Size, t);
        var i = n.rowElement.children[this.GridView.columns.Size.index].firstChild;
        i.firstChild.nodeValue = GleamTech.JavaScript.Util.FormatFileSize(t);
        this.GridView.rowsArray.length - this.TotalProcessedCount == 1 && (this.TotalUploadSize = this.TotalProcessedSize + t)
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onUploadProgress = function(n, t, i) {
    var r = t > 0 ? i / t * 100 : 0;
    this.onUploadStatusChange(n, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading, {
        uploadedPercentage: r
    });
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileProcessing, i)
};
GleamTech.JavaScript.UI.FileUploader.prototype.onChunkResponse = function(n, t) {
    var i, r;
    if (n.chunk != n.chunks - 1) {
        i = null;
        try {
            i = JSON.parse(n.response)
        } catch(u) {}
        if (i == null) {
            this.onUploadClientError({
                message: "Chunk unexpectedly failed.",
                file: t
            });
            return
        }
        if (!i.Success && !this.checkSessionError(i.Result.Message) && i.Result.Message.indexOf("UploadCanceled") == -1) {
            this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Failed, {
                message: i.Result.Message
            });
            this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted);
            t.status = plupload.FAILED;
            n.cancelled = !0;
            r = this;
            setTimeout(function() {
                r.UploadNext()
            },
            0)
        }
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onUploadResponse = function(n, t) {
    var i, u, e, r, o, f, s;
    if (this.GridRowInProgress.GetCellValue(this.GridView.columns.Status) != GleamTech.JavaScript.UI.FileUploaderUploadStatus.Canceled) {
        i = null;
        try {
            i = JSON.parse(n)
        } catch(h) {}
        if (i == null) {
            for (n = n.replace(/(?:\r\n|\r)+/g, "\n"), n = n.replace(/<!--[\s\S]*?-->/g, ""), u = n.split("\n"), e = n, r = 0; r < u.length; r++) if (GleamTech.JavaScript.Util.Trim(u[r]) != "") {
                e = u[r];
                break
            }
            this.onUploadClientError({
                code: plupload.HTTP_ERROR,
                message: "HTTP Error.",
                details: e,
                file: t
            });
            return
        }
        if (i.Success) {
            o = this.GridRowInProgress.GetCellValue(this.GridView.columns.Name);
            f = i.Result != null ? i.Result: this.GridRowInProgress.GetCellValue(this.GridView.columns.Size);
            this.onFileSizeDetermined(this.GridRowInProgress, f);
            this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Completed);
            this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted, f);
            this.ItemUploaded && this.ItemUploaded(o, f)
        } else if (!this.checkSessionError(i.Result.Message) && i.Result.Message.indexOf("UploadCanceled") == -1) {
            this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Failed, {
                message: i.Result.Message
            });
            this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted)
        }
        s = this;
        setTimeout(function() {
            s.UploadNext()
        },
        0)
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onUploadClientError = function(n) {
    var t = n.message + "\n",
    i;
    n.details && (t += "\nDetails: " + n.details);
    n.status && (t += "\nStatus: " + n.status);
    n.file && (t += "\nFile: " + n.file.name, typeof n.file.size == "number" && (t += " (" + GleamTech.JavaScript.Util.FormatFileSize(n.file.size) + ")"));
    this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Failed, {
        message: t
    });
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted);
    GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("Fail"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId,
        itemId: n.file.customId,
        clientError: t
    },
    function() {},
    function() {},
    function() {});
    i = this;
    setTimeout(function() {
        i.UploadNext()
    },
    0)
};
GleamTech.JavaScript.UI.FileUploader.prototype.Skip = function(n) {
    var t = this;
    GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("Skip"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId,
        itemIds: n
    },
    function() {},
    function() {},
    function() {})
};
GleamTech.JavaScript.UI.FileUploader.prototype.Cancel = function() {
    var t = this,
    n, i;
    GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("Cancel"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId
    },
    function() {
        t.ActiveUploader.ex.stopQueue()
    },
    function() {
        t.ActiveUploader.ex.stopQueue()
    },
    function() {
        t.ActiveUploader.ex.stopQueue()
    });
    this.onUploadStatusChange(this.GridRowInProgress, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Canceled);
    this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Stopped);
    for (n = 0; n < this.GridView.rowsArray.length; n++) if (this.GridView.rowsArray[n].GetCellValue(this.GridView.columns.Status) == GleamTech.JavaScript.UI.FileUploaderUploadStatus.Pending) {
        i = this.GridView.rowsArray[n];
        this.onUploadStatusChange(i, GleamTech.JavaScript.UI.FileUploaderUploadStatus.Canceled)
    }
    this.EndQueue(!0)
};
GleamTech.JavaScript.UI.FileUploader.prototype.EndQueue = function(n) {
    var t = this;
    GleamTech.JavaScript.Util.RequestJson(this.getActionUrl("End"), {
        stateId: this.Parameters.StateId,
        uploadId: this.ActiveUploadId
    },
    function() {
        if (!n) {
            t.ActiveUploader.ex.stopQueue();
            t.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Processed)
        }
        t.Uploaded && t.Uploaded()
    },
    function(n) {
        t.ActiveUploader.ex.stopQueue();
        t.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Stopped);
        t.checkSessionError(n.Message) || alert(n.Message)
    },
    function() {
        t.ActiveUploader.ex.stopQueue();
        t.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Stopped)
    })
};
GleamTech.JavaScript.UI.FileUploader.prototype.showQueueAddingPane = function() {
    if (!this.ElementQueueAddingVisible) {
        this.hideQueueProcessingPane();
        this.hideQueueNewPane();
        this.onDropAreaChange(!0);
        this.ElementQueueAdding.style.visibility = "visible";
        this.ElementFooter.style.height = this.ElementQueueAdding.offsetHeight + "px";
        this.resize();
        this.ElementQueueAddingVisible = !0
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.hideQueueAddingPane = function() {
    if (this.ElementQueueAddingVisible) {
        this.onDropAreaChange(!1);
        this.ElementQueueAdding.style.visibility = "hidden";
        this.ElementQueueAddingVisible = !1
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.showQueueProcessingPane = function() {
    var n, t, r, i;
    this.ElementQueueProcessing || (this.hideQueueAddingPane(), this.ElementQueueProcessing = document.createElement("div"), this.ElementQueueProcessing.id = this.Parameters.ElementId + "-queueProcessing", this.ElementQueueProcessing.style.position = "absolute", this.ElementQueueProcessing.style.left = "0px", this.ElementQueueProcessing.style.top = "0px", this.ElementQueueProcessing.style.width = this.ElementFooter.offsetWidth - 12 + "px", this.ElementQueueProcessing.style.paddingTop = "10px", this.ElementQueueProcessing.style.paddingLeft = "6px", this.ElementQueueProcessing.style.paddingBottom = "10px", this.ElementQueueProcessing.style.paddingRight = "6px", this.ElementFooter.appendChild(this.ElementQueueProcessing), n = document.createElement("div"), this.ElementQueueProcessing.appendChild(n), n.style.cssFloat = "left", n.style.styleFloat = "left", n.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.TimeRemaining"))), n.appendChild(document.createElement("br")), n.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.FilesRemaining"))), n.appendChild(document.createElement("br")), n.appendChild(document.createTextNode(this.Language.GetEntry("FileUploader.Label.Speed"))), n.appendChild(document.createElement("br")), n = document.createElement("div"), this.ElementQueueProcessing.appendChild(n), n.style.cssFloat = "left", n.style.styleFloat = "left", n.style.marginLeft = "5px", this.ElementTimeRemaining = document.createElement("span"), n.appendChild(this.ElementTimeRemaining), n.appendChild(document.createElement("br")), this.ElementFilesRemaining = document.createElement("span"), n.appendChild(this.ElementFilesRemaining), n.appendChild(document.createElement("br")), this.ElementSpeed = document.createElement("span"), n.appendChild(this.ElementSpeed), t = this.ElementQueueProcessing.offsetWidth - 120, t > 353 && (t = 353), this.QueuePogressBar = new GleamTech.JavaScript.UI.ProgressBar(this.ElementQueueProcessing, t, !0), this.QueuePogressBar.ElementControl.style.cssFloat = "left", this.QueuePogressBar.ElementControl.style.styleFloat = "left", this.QueuePogressBar.ElementControl.style.clear = "left", this.ButtonCancel = document.createElement("input"), this.ButtonCancel.type = "button", this.ButtonCancel.value = this.Language.GetEntry("Label.Cancel"), this.ButtonCancel.style.width = "80px", this.ButtonCancel.style.position = "absolute", this.ButtonCancel.style.right = "6px", this.ButtonCancel.style.bottom = "10px", this.ElementQueueProcessing.appendChild(this.ButtonCancel), r = this, GleamTech.JavaScript.Util.AddEvent(this.ButtonCancel, "click",
    function() {
        r.Cancel()
    }), i = (this.ButtonCancel.offsetHeight - this.QueuePogressBar.ElementControl.offsetHeight) / 2, this.QueuePogressBar.ElementControl.style.marginTop = 10 - i + "px", this.QueuePogressBar.ElementControl.style.marginBottom = i + "px", this.ElementFooter.style.height = this.ElementQueueProcessing.offsetHeight + "px", this.resize())
};
GleamTech.JavaScript.UI.FileUploader.prototype.hideQueueProcessingPane = function() {
    this.ElementQueueProcessing && (this.ElementFooter.removeChild(this.ElementQueueProcessing), this.ElementQueueProcessing = null)
};
GleamTech.JavaScript.UI.FileUploader.prototype.showQueueNewPane = function() {
    if (!this.ElementQueueNew) {
        this.hideQueueAddingPane();
        this.hideQueueProcessingPane();
        this.ElementQueueNew = document.createElement("div");
        this.ElementQueueNew.id = this.Parameters.ElementId + "-queueNew";
        this.ElementQueueNew.style.position = "absolute";
        this.ElementQueueNew.style.left = "0px";
        this.ElementQueueNew.style.top = "0px";
        this.ElementQueueNew.style.width = this.ElementFooter.offsetWidth - 12 + "px";
        this.ElementQueueNew.style.paddingTop = "10px";
        this.ElementQueueNew.style.paddingLeft = "6px";
        this.ElementQueueNew.style.paddingBottom = "10px";
        this.ElementQueueNew.style.paddingRight = "6px";
        this.ElementFooter.appendChild(this.ElementQueueNew);
        this.ButtonNewUpload = document.createElement("input");
        this.ButtonNewUpload.type = "button";
        this.ButtonNewUpload.value = this.Language.GetEntry("FileUploader.Action.NewUpload");
        this.ButtonNewUpload.style.width = "120px";
        this.ElementQueueNew.appendChild(this.ButtonNewUpload);
        var n = this;
        GleamTech.JavaScript.Util.AddEvent(this.ButtonNewUpload, "click",
        function() {
            n.onAction({
                action: "Clear"
            });
            n.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.Adding)
        });
        this.ButtonClose2 = document.createElement("input");
        this.ButtonClose2.type = "button";
        this.ButtonClose2.value = this.Language.GetEntry("FileUploader.Action.Close");
        this.ButtonClose2.style.width = "80px";
        this.ButtonClose2.style.position = "absolute";
        this.ButtonClose2.style.right = "6px";
        this.ElementQueueNew.appendChild(this.ButtonClose2);
        GleamTech.JavaScript.Util.AddEvent(this.ButtonClose2, "click",
        function() {
            n.Hide()
        });
        this.ElementFooter.style.height = this.ElementQueueNew.offsetHeight + "px";
        this.resize()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.hideQueueNewPane = function() {
    this.ElementQueueNew && (this.ElementQueueAdding.appendChild(this.ButtonClose), this.ElementFooter.removeChild(this.ElementQueueNew), this.ElementQueueNew = null)
};
GleamTech.JavaScript.UI.FileUploader.prototype.updateOverallProgress = function(n, t, i, r, u) {
    n != null && (this.ElementTimeRemaining.innerHTML = n);
    t != null && (this.ElementFilesRemaining.innerHTML = i != null ? t + " (" + GleamTech.JavaScript.Util.FormatFileSize(i) + ")": t);
    r != null && (this.ElementSpeed.innerHTML = r);
    u != null && this.QueuePogressBar.SetPercentage(u)
};
GleamTech.JavaScript.UI.FileUploader.prototype.onOverallStatusChange = function(n, t) {
    var c, e;
    switch (n) {
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.Adding:
        this.IsQueueInProgress = !1;
        this.TotalUploadSize = 0;
        this.TotalProcessedSize = 0;
        this.TotalProcessedCount = 0;
        this.onQueueChange();
        this.showQueueAddingPane();
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileStarted:
        this.IsQueueInProgress = !0;
        this.TotalProcessedCount == 0 && (this.QueueStartTime = (new Date).getTime(), this.showQueueProcessingPane(), this.updateOverallProgress(this.Language.GetEntry("FileUploader.Label.Calculating"), this.GridView.rowsArray.length, this.TotalUploadSize > 0 ? this.TotalUploadSize: null, this.Language.GetEntry("FileUploader.Label.Calculating"), 1));
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileProcessing:
        this.IsQueueInProgress = !0;
        var o = this.TotalProcessedSize + t,
        s = ((new Date).getTime() - this.QueueStartTime) / 1e3,
        r = s > 0 ? parseInt(o / s) : 0,
        u = r > 0 ? Math.round(this.TotalUploadSize / r - s) : 0,
        l = null;
        if (u > 0) {
            var a = parseInt(u / 3600),
            f = parseInt(u / 60) % 60,
            h = u % 60,
            i;
            a > 0 ? (i = this.Language.GetEntry("FileUploader.Label.TimeEstimateHours", a), f > 0 && (i += " " + this.Language.GetEntry("FileUploader.Label.TimeEstimateMinutes", f))) : f > 0 ? (i = this.Language.GetEntry("FileUploader.Label.TimeEstimateMinutes", f), h > 0 && (i += " " + this.Language.GetEntry("FileUploader.Label.TimeEstimateSeconds", h))) : i = this.Language.GetEntry("FileUploader.Label.TimeEstimateSeconds", h);
            l = this.Language.GetEntry("FileUploader.Label.TimeEstimate", i)
        }
        var y = this.GridView.rowsArray.length - this.TotalProcessedCount,
        v = this.TotalUploadSize - o,
        p = v > 0 ? v: null,
        w = r > 0 ? this.Language.GetEntry("FileUploader.Label.SpeedEstimate", GleamTech.JavaScript.Util.FormatFileSize(r)) : null,
        b = this.TotalUploadSize > 0 ? o / this.TotalUploadSize * 100 : this.TotalProcessedCount / this.GridView.rowsArray.length * 100;
        this.updateOverallProgress(l, y, p, w, b);
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileCompleted:
        if (this.IsQueueInProgress = !0, this.TotalProcessedCount++, t) {
            this.onOverallStatusChange(GleamTech.JavaScript.UI.FileUploaderOverallStatus.FileProcessing, t);
            this.TotalProcessedSize += t
        }
        this.TotalProcessedCount == this.GridView.rowsArray.length && this.updateOverallProgress("-", "-", null, "-", null);
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.Stopped:
        this.IsQueueInProgress = !1;
        this.showQueueNewPane();
        break;
    case GleamTech.JavaScript.UI.FileUploaderOverallStatus.Processed:
        for (this.IsQueueInProgress = !1, this.showQueueNewPane(), c = !0, e = 0; e < this.GridView.rowsArray.length; e++) if (this.GridView.rowsArray[e].GetCellValue(this.GridView.columns.Status) != GleamTech.JavaScript.UI.FileUploaderUploadStatus.Completed) {
            c = !1;
            break
        }
        c && this.Hide()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onUploadStatusChange = function(n, t, i) {
    if (n) {
        n.SetCellValue(this.GridView.columns.Status, t);
        var r = n.rowElement.children[this.GridView.columns.Status.index].firstChild;
        switch (t) {
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Pending:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Pending");
            r.style.color = "gray";
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Rejected:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Rejected");
            r.style.color = "red";
            this.onStatusDetailsAvailable(r, i.message);
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Skipped:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Skipped");
            r.style.color = "navy";
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Uploading:
            this.GridRowInProgress = n;
            this.GridView.ScrollToRow(n);
            r.progressBar ? r.progressBar.SetPercentage(i.uploadedPercentage) : (r.innerHTML = "", r.progressBar = new GleamTech.JavaScript.UI.ProgressBar(r, 60, !0), r.progressBar.SetPercentage(1));
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Canceled:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Canceled");
            r.style.color = "orange";
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Failed:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Failed");
            r.style.color = "red";
            this.onStatusDetailsAvailable(r, i.message);
            break;
        case GleamTech.JavaScript.UI.FileUploaderUploadStatus.Completed:
            r.innerHTML = this.Language.GetEntry("FileUploader.UploadStatus.Completed");
            r.style.color = "green"
        }
        this.GridView.Resize()
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onConfirmReplace = function(n, t, i) {
    var u = this,
    c, r, h, s, e, l, a, f, o;
    this.ConfirmReplaceElement || (this.ConfirmReplaceElement = document.createElement("div"), this.ConfirmReplaceElement.style.display = "none", this.ConfirmReplaceElement.style.padding = "8px", c = new Image, c.src = this.getResourceUrl("images/icons16/action.png"), r = new GleamTech.JavaScript.UI.ToolBar, r.SetButtonSize(450, 60, !0), r.onButtonClick = function(n) {
        u.ConfirmReplaceDialog.selectedAction = n.action;
        u.ModalDialog.Close(u.ConfirmReplaceDialog)
    },
    r.AddButton("Replace", "", null), r.AddButton("Skip", "", null), r.AddButton("KeepBoth", "", null), r.Render(this.Parameters.ElementId + "-confirmReplace-toolbar", this.ConfirmReplaceElement), r.divElement.style.borderTopWidth = "0px", r.divElement.style.borderLeftWidth = "0px", r.divElement.style.borderRightWidth = "0px", r.divElement.style.paddingBottom = "8px", r.divElement.style.marginBottom = "8px", this.ConfirmReplaceElement.toolbar = r, r.divElement.insertBefore(document.createTextNode(this.Language.GetEntry("FileUploader.Label.UploadConflictDescription")), r.divElement.firstChild), r.items[0].divElement.style.marginTop = "6px", h = function(n, t, i) {
        var u, e, f, o;
        r.items[n].divElement.style.textAlign = "left";
        u = new Image;
        u.src = c.src;
        u.style.width = "16px";
        u.style.height = "16px";
        u.style.verticalAlign = "text-top";
        u.style.marginRight = "6px";
        r.items[n].divElement.appendChild(u);
        e = document.createElement("span");
        e.className = "gt-infoPaneTitle";
        e.appendChild(document.createTextNode(t));
        r.items[n].divElement.appendChild(e);
        r.items[n].divElement.appendChild(document.createElement("br"));
        f = document.createElement("div");
        f.style.marginLeft = "22px";
        f.appendChild(document.createTextNode(i));
        f.appendChild(document.createElement("br"));
        o = document.createElement("span");
        r.items[n].spanPlaceholder = o;
        f.appendChild(o);
        r.items[n].divElement.appendChild(f)
    },
    h(0, this.Language.GetEntry("FileUploader.Label.UploadAndReplace"), this.Language.GetEntry("FileUploader.Label.UploadAndReplaceDescription")), h(1, this.Language.GetEntry("FileUploader.Label.DoNotUpload"), this.Language.GetEntry("FileUploader.Label.DoNotUploadDescription")), h(2, this.Language.GetEntry("FileUploader.Label.UploadButKeepBoth"), this.Language.GetEntry("FileUploader.Label.UploadButKeepBothDescription")), s = document.createElement("div"), s.style.cssFloat = "left", s.style.styleFloat = "left", this.ConfirmReplaceElement.appendChild(s), e = document.createElement("input"), e.id = this.Parameters.ElementId + "-confirmReplace-checkbox", e.type = "checkbox", s.appendChild(e), GleamTech.JavaScript.Util.AddEvent(e, "click",
    function() {
        u.ConfirmReplaceDialog.sameForAll = e.checked
    }), this.ConfirmReplaceElement.checkBoxSameForAll = e, l = document.createElement("div"), l.innerHTML = '<label for="' + e.id + '">' + this.Language.GetEntry("FileUploader.Label.SameForAllConflicts") + "<\/label>", a = l.firstChild, s.appendChild(a), f = document.createElement("input"), f.type = "button", f.value = this.Language.GetEntry("Label.Cancel"), f.style.width = "80px", f.style.cssFloat = "right", f.style.styleFloat = "right", this.ConfirmReplaceElement.appendChild(f), this.ConfirmReplaceElement.cancelButtonElement = f, GleamTech.JavaScript.Util.AddEvent(f, "click",
    function() {
        u.ModalDialog.Close(u.ConfirmReplaceDialog)
    }), this.ElementControl.appendChild(this.ConfirmReplaceElement));
    o = function(n, t, i, r) {
        var f = "";
        t && (f += "<b>" + t + "<\/b>", typeof i == "number" && (f += " (" + GleamTech.JavaScript.Util.FormatFileSize(i), r && (f += ", " + r), f += ")"));
        u.ConfirmReplaceElement.toolbar.items[n].spanPlaceholder.innerHTML = f
    };
    this.ConfirmReplaceDialog = this.ModalDialog.ShowElement(this.ConfirmReplaceElement, this.Language.GetEntry("FileUploader.Label.UploadConflict"),
    function() {
        o(0, n.name, n.size);
        o(1, t.ActionData.ExistingfileName, t.ActionData.ExistingFileSize, t.ActionData.ExistingFileDate);
        o(2, t.ActionData.NewFileName);
        u.ConfirmReplaceElement.style.display = "block";
        u.ConfirmReplaceElement.style.width = u.ConfirmReplaceElement.toolbar.divElement.offsetWidth + "px";
        u.ConfirmReplaceElement.style.height = u.ConfirmReplaceElement.toolbar.divElement.offsetHeight + u.ConfirmReplaceElement.cancelButtonElement.offsetHeight + 8 + "px"
    });
    this.ConfirmReplaceDialog.selectedAction = "Cancel";
    this.ConfirmReplaceDialog.sameForAll = !1;
    this.ConfirmReplaceDialog.onClosed = function() {
        o(0, "");
        o(1, "");
        o(2, "");
        u.ConfirmReplaceElement.checkBoxSameForAll.checked = !1;
        u.ConfirmReplaceElement.style.display = "none";
        u.ElementControl.appendChild(u.ConfirmReplaceElement);
        setTimeout(function() {
            i(u.ConfirmReplaceDialog.selectedAction, u.ConfirmReplaceDialog.sameForAll)
        },
        0)
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onStatusDetailsAvailable = function(n, t) {
    var i = this;
    GleamTech.JavaScript.Util.AddEvent(n, "click",
    function() {
        i.onShowStatusDetails(t)
    });
    n.style.textDecoration = "underline";
    n.style.cursor = "pointer";
    n.title = this.Language.GetEntry("FileUploader.Label.ViewStatusReason")
};
GleamTech.JavaScript.UI.FileUploader.prototype.onShowStatusDetails = function(n) {
    var t = this,
    r, i;
    this.StatusDetailsElement || (this.StatusDetailsElement = document.createElement("div"), this.StatusDetailsElement.style.display = "none", this.StatusDetailsElement.style.padding = "8px", r = document.createElement("textarea"), r.style.width = "300px", r.style.height = "150px", r.style.resize = "none", r.readOnly = !0, this.StatusDetailsElement.appendChild(r), this.StatusDetailsElement.textareaElement = r, i = document.createElement("input"), i.type = "button", i.value = this.Language.GetEntry("FileUploader.Action.Close"), i.style.width = "80px", i.style.marginTop = "8px", i.style.cssFloat = "right", i.style.styleFloat = "right", this.StatusDetailsElement.appendChild(i), this.StatusDetailsElement.closeButtonElement = i, GleamTech.JavaScript.Util.AddEvent(i, "click",
    function() {
        t.ModalDialog.Close(t.StatusDetailsDialog)
    }), this.ElementControl.appendChild(this.StatusDetailsElement));
    this.StatusDetailsDialog = this.ModalDialog.ShowElement(this.StatusDetailsElement, this.Language.GetEntry("FileUploader.Label.StatusReason"),
    function() {
        t.StatusDetailsElement.textareaElement.value = n;
        t.StatusDetailsElement.style.display = "block";
        t.StatusDetailsElement.style.width = t.StatusDetailsElement.textareaElement.offsetWidth + "px";
        t.StatusDetailsElement.style.height = t.StatusDetailsElement.textareaElement.offsetHeight + t.StatusDetailsElement.closeButtonElement.offsetHeight + 8 + "px"
    });
    this.StatusDetailsDialog.onClosed = function() {
        t.StatusDetailsElement.firstChild.value = "";
        t.StatusDetailsElement.style.display = "none";
        t.ElementControl.appendChild(t.StatusDetailsElement)
    }
};
GleamTech.JavaScript.UI.FileUploader.prototype.onAction = function(n) {
    var t, i, r;
    switch (n.action) {
    case "SelectAll":
        this.GridView.SelectAllRows();
        break;
    case "InvertSelection":
        this.GridView.InvertSelectedRows();
        break;
    case "Remove":
        for (t = 0; t < this.GridView.selectedRowsArray.length; t++) i = this.GridView.selectedRowsArray[t],
        this.ActiveUploader.removeFile(i.GetCellValue(this.GridView.columns.FileHandle)),
        this.IsFileSizeSupported && (r = i.GetCellValue(this.GridView.columns.Size), this.TotalUploadSize -= r),
        this.GridView.RemoveRow(i),
        t--;
        this.onQueueChange();
        break;
    case "Clear":
        this.ActiveUploader.splice();
        this.GridView.RemoveAllRows();
        this.TotalUploadSize = 0;
        this.onQueueChange();
        break;
    case "Html4":
        this.LoadUploader(GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html4,
        function(n) {
            n.Success || alert("Can not set upload method to Html4!")
        });
        break;
    case "Flash":
        this.LoadUploader(GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Flash,
        function(n) {
            n.Success || alert("Can not set upload method to Flash!")
        });
        break;
    case "Silverlight":
        this.LoadUploader(GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Silverlight,
        function(n) {
            n.Success || alert("Can not set upload method to Silverlight!")
        });
        break;
    case "Html5":
        this.LoadUploader(GleamTech.JavaScript.UI.FileUploaderUploadMethodType.Html5,
        function(n) {
            n.Success || alert("Can not set upload method to Html5!")
        })
    }
};
GleamTech.JavaScript.UI.FileUploaderContextMenusData = {
    "ContextMenus": {
        "ContextMenu": [{
            "Item": [{
                "action": "Remove",
                "text": "FileUploader.Action.Remove"
            },
            {
                "action": "[Separator]"
            },
            {
                "action": "InvertSelection",
                "text": "Label.InvertSelection"
            }],
            "Name": "GridRows"
        },
        {
            "Item": [{
                "action": "Clear",
                "text": "FileUploader.Action.Clear"
            },
            {
                "action": "[Separator]"
            },
            {
                "action": "SelectAll",
                "text": "Label.SelectAll"
            },
            {
                "action": "[Separator]"
            },
            {
                "action": "UploadMethod",
                "ContextMenu": {
                    "Item": [{
                        "action": "Html4",
                        "icon": "active.png"
                    },
                    {
                        "action": "Flash",
                        "icon": "active.png"
                    },
                    {
                        "action": "Silverlight",
                        "icon": "active.png"
                    },
                    {
                        "action": "Html5",
                        "icon": "active.png"
                    }]
                },
                "text": "FileUploader.Action.UploadMethod"
            }],
            "Name": "GridMain"
        }]
    }
};