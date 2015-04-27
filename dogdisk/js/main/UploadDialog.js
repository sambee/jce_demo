Date.prototype.getElapsed = function(A) {
	return Math.abs((A || new Date()).getTime() - this.getTime())
};

UploadDialog = Ext.extend(Ext.Window, {
	fileList : null,
	swfupload : null,
	progressBar : null,
	progressInfo : null,
	uploadInfoPanel : null,
	constructor : function(config) {
		this.progressInfo = {
			filesTotal : 0,
			filesUploaded : 0,
			bytesTotal : 0,
			bytesUploaded : 0,
			currentCompleteBytes : 0,
			lastBytes : 0,
			lastElapsed : 1,
			lastUpdate : null,
			timeElapsed : 1
		};
		this.uploadInfoPanel = new Ext.Panel({
			region : 'north',
			height : 65,
			baseCls : '',
			collapseMode:'mini',
			split : true,
			border : false
		});
		this.progressBar = new Ext.ProgressBar({text:'等待中 0 %'});
		var autoExpandColumnId = Ext.id('fileName');
		this.fileList = new Ext.grid.GridPanel({
			//region : 'center',
			border : false,
			enableColumnMove : false,
			enableHdMenu : false,
			columns : [new Ext.grid.RowNumberer(),
		        {header: '文件名',width : 100,dataIndex : 'fileName',sortable:false,fixed : true,renderer : this.formatFileName,id : autoExpandColumnId},
		        {header: '大小', width : 80,dataIndex:'fileSize',sortable:false,fixed : true,renderer : this.formatFileSize,align:'right'},
		        {header: '类型', width : 60,dataIndex : 'fileType',sortable:false,fixed : true,renderer : this.formatIcon,align:'center'},
		        {header: '进度', width : 100,dataIndex : '',sortable : false,fixed : true,renderer : this.formatProgressBar,align:'center'},
		        {
		        	header: '&nbsp;',
		        	width : 28,
		        	dataIndex : 'fileState',
		        	renderer : this.formatState,
		        	sortable:false,
		        	fixed : true,
		        	align:'center'
		        }
			],
			autoExpandColumn : autoExpandColumnId,
			ds : new Ext.data.SimpleStore({fields: ['fileId','fileName', 'fileSize','fileType','fileState']}),
			tbar : new Ext.Toolbar(),
			bbar : []
		});
		this.uploadInfoPanel.on('render',function(){
			this.getProgressTemplate().overwrite(this.uploadInfoPanel.body,{
				filesUploaded : 0,
				filesTotal : 0,
				bytesUploaded : '0 bytes',
				bytesTotal : '0 bytes',
				timeElapsed : '00:00:00',
				timeLeft : '00:00:00',
				speedLast : '0 bytes/s',
				speedAverage : '0 bytes/s'
			});
		},this);
		this.fileList.on('cellclick',function(grid, rowIndex, columnIndex, e){
			if(columnIndex == 5){
				var record = grid.getSelectionModel().getSelected();
				var fileId = record.data.fileId;
				var file = this.swfupload.getFile(fileId);
				if(file){
					if(file.filestatus != SWFUpload.FILE_STATUS.CANCELLED){
						this.swfupload.cancelUpload(fileId);
						if(record.data.fileState != SWFUpload.FILE_STATUS.CANCELLED){
							record.set('fileState',SWFUpload.FILE_STATUS.CANCELLED);
							record.commit();
							this.onCancelQueue(fileId);
						}
					}
				}
			}
		},this);
		this.fileList.on('render',function(){
			this.fileList.getBottomToolbar().add(this.progressBar);
			var tb = this.fileList.getTopToolbar();
			tb.add({
				text : '添加文件',
				iconCls : 'db-icn-add'
			});
			tb.add({
				text : '开始上传',
				iconCls : 'db-icn-upload_',
				//disabled : true,
				handler : this.startUpload,
				scope : this
			});
			tb.add({
				text : '停止上传',
				iconCls : 'db-icn-stop',
				handler : this.stopUpload,
				scope : this
			});
			tb.add({
				text : '取消队列',
				iconCls : 'db-icn-cross',
				handler : this.cancelQueue,
				scope : this
			});
			tb.add({
				text : '清空列表',
				iconCls : 'db-icn-trash',
				handler : this.clearList,
				scope : this
			});
			var em = this.fileList.getTopToolbar().items.first().el.child('em');
            var placeHolderId = Ext.id();
            em.setStyle({
                position: 'relative',
                display: 'block'
            });
            em.createChild({
                tag: 'div',
                id: placeHolderId
            });
			var settings = {
				upload_url : this.uploadUrl,
				post_params : Ext.isEmpty(this.postParams) ? {}:this.postParams,
				flash_url : Ext.isEmpty(this.flashUrl) ? 'http://www.swfupload.org/swfupload.swf' : this.flashUrl, 
				file_post_name : Ext.isEmpty(this.filePostName) ? 'myUpload' : this.filePostName,
				file_size_limit : Ext.isEmpty(this.fileSize) ? '100 MB' : this.fileSize,
				file_types : Ext.isEmpty(this.fileTypes) ? '*.*' : this.fileTypes,
				file_types_description : this.fileTypesDescription,
				use_query_string:true,
				debug : false,
				button_width : '73',
				button_height : '20',
				button_placeholder_id : placeHolderId,
				button_window_mode : SWFUpload.WINDOW_MODE.TRANSPARENT,
				button_cursor : SWFUpload.CURSOR.HAND,
				custom_settings : {
					scope_handler : this
				},
				file_queued_handler : this.onFileQueued,
				file_queue_error_handler : this.onFileQueueError,
				file_dialog_complete_handler : this.onFileDialogComplete,
				upload_start_handler : this.onUploadStart,
				upload_progress_handler : this.onUploadProgress,
				upload_error_handler : this.onUploadError,
				upload_success_handler : this.onUploadSuccess,
				upload_complete_handler : this.onUploadComplete
			};
			this.swfupload = new SWFUpload(settings);
			this.swfupload.uploadStopped = false;
			Ext.get(this.swfupload.movieName).setStyle({
                position: 'absolute', 
                top: 0,
                left: -2
            });
            this.resizeProgressBar();
            this.on('resize', this.resizeProgressBar, this);
		},this);
		UploadDialog.superclass.constructor.call(this, Ext.applyIf(config || {},{
			title : '文件上传',
			closeAction : 'close',
			layout : 'border',
			iconCls : 'db-icn-upload-local',
			//modal : true,
			width : 500,
			height : 500,
			minWidth : 450,
			minHeight : 500,
			split : true,
			buttons : [{text : '关闭',handler : this.onClose,scope : this}],
			items : [this.uploadInfoPanel,{
				region : 'center',
				layout:'fit',
				margins : '0 -1 0 -1',
				items : [this.fileList]
			}]}
		));
	},
	resizeProgressBar: function() {
        this.progressBar.setWidth(this.el.getWidth() - 18);
    },
	startUpload : function() {
		if (this.swfupload) {
			this.swfupload.uploadStopped = false;
			var post_params = this.swfupload.settings.post_params;
			post_params.path = encodeURI(this.scope.currentPath + '\\');
			this.swfupload.setPostParams(post_params);
			this.swfupload.startUpload();
		}
	},
	stopUpload : function(){
		if (this.swfupload) {
			this.swfupload.uploadStopped = true;
			this.swfupload.stopUpload();
		}
	},
	cancelQueue : function() {
		if (this.swfupload) {
			this.swfupload.stopUpload();
			var stats = this.swfupload.getStats();
			while (stats.files_queued > 0) {
				this.swfupload.cancelUpload();
				stats = this.swfupload.getStats();
			}
			this.fileList.getStore().each(function(record){
				switch(record.data.fileState){
					case SWFUpload.FILE_STATUS.QUEUED:
					case SWFUpload.FILE_STATUS.IN_PROGRESS:
						record.set('fileState',SWFUpload.FILE_STATUS.CANCELLED);
						record.commit();
						this.onCancelQueue(record.data.fileId);
						break;
					default : 
						break;
				}
			},this);
		}
	},
	clearList : function() {
		var store = this.fileList.getStore();
		store.each(function(record){
			if(record.data.fileState != SWFUpload.FILE_STATUS.QUEUED && record.data.fileState != SWFUpload.FILE_STATUS.IN_PROGRESS){
				store.remove(record);
			}
		});
	},
	getProgressTemplate : function(){
		var tpl = new Ext.Template(
				'<table class="upload-progress-table"><tbody>',
				'<tr><td class="upload-progress-label"><nobr>已上传数:</nobr></td>',
				'<td class="upload-progress-value"><nobr>{filesUploaded} / {filesTotal}</nobr></td>',
				'<td class="upload-progress-label"><nobr>上传状态:</nobr></td>',
				'<td class="upload-progress-value"><nobr>{bytesUploaded} / {bytesTotal}</nobr></td></tr>',
				'<tr><td class="upload-progress-label"><nobr>已用时间:</nobr></td>',
				'<td class="upload-progress-value"><nobr>{timeElapsed}</nobr></td>',
				'<td class="upload-progress-label"><nobr>剩余时间:</nobr></td>',
				'<td class="upload-progress-value"><nobr>{timeLeft}</nobr></td></tr>',
				'<tr><td class="upload-progress-label"><nobr>当前速度:</nobr></td>',
				'<td class="upload-progress-value"><nobr>{speedLast}</nobr></td>',
				'<td class="upload-progress-label"><nobr>平均速度:</nobr></td>',
				'<td class="upload-progress-value"><nobr>{speedAverage}</nobr></td></tr>',
				'</tbody></table>');
		tpl.compile();
		return tpl;
	},
	updateProgressInfo : function(){
		this.getProgressTemplate().overwrite(this.uploadInfoPanel.body,this.formatProgress(this.progressInfo));
	},
	formatProgress : function(info) {
		var r = {};
		r.filesUploaded = String.leftPad(info.filesUploaded, 3, '&nbsp;');
		r.filesTotal = info.filesTotal;
		r.bytesUploaded = String.leftPad(Ext.util.Format.fileSize(info.bytesUploaded), 6, '&#160;');
		r.bytesTotal = Ext.util.Format.fileSize(info.bytesTotal);
		r.timeElapsed = this.formatTime(info.timeElapsed);
		r.speedAverage = Ext.util.Format.fileSize(Math.ceil(1000 * info.bytesUploaded / info.timeElapsed)) + '/s';
		r.timeLeft = this.formatTime((info.bytesUploaded === 0) ? 0 : info.timeElapsed * (info.bytesTotal - info.bytesUploaded) / info.bytesUploaded);
		var caleSpeed = 1000 * info.lastBytes / info.lastElapsed;
		r.speedLast = Ext.util.Format.fileSize(caleSpeed < 0 ? 0:caleSpeed) + '/s';
		var p = info.bytesUploaded / info.bytesTotal;
		p = p || 0;
		this.progressBar.updateProgress(p, "上传中 " + Math.ceil(p * 100) + " %");
		return r;
	},
	formatTime : function(milliseconds) {
		var seconds = parseInt(milliseconds / 1000, 10);
		var s = 0;
		var m = 0;
		var h = 0;
		if (3599 < seconds) {
			h = parseInt(seconds / 3600, 10);
			seconds -= h * 3600;
		}
		if (59 < seconds) {
			m = parseInt(seconds / 60, 10);
			seconds -= m * 60;
		}
		m = String.leftPad(m, 2, '0');
		h = String.leftPad(h, 2, '0');
		s = String.leftPad(seconds, 2, '0');
		return h + ':' + m + ':' + s;
	},
	formatFileSize : function(_v,celmeta,record){
		return '<div id="fileSize_' + record.data.fileId + '">' + Ext.util.Format.fileSize(_v) + '</div>';
	},
	formatFileName : function(_v, cellmeta, record){
		return '<div id="fileName_' + record.data.fileId + '">' + _v + '</div>';
	},
	formatIcon : function(_v, cellmeta, record){
		var returnValue = '';
		var extensionName = _v.substring(1);
		var fileId = record.data.fileId;
		if(_v){
			var css = '.db-ft-' + extensionName.toLowerCase() + '-small';
			if(Ext.isEmpty(Ext.util.CSS.getRule(css),true)){ //判断样式是否存在
				returnValue = '<div id="fileType_' + fileId + '" class="db-ft-unknown-small" style="height: 16px;background-repeat: no-repeat;">'
							  	+ '&nbsp;&nbsp;&nbsp;&nbsp;' + extensionName.toUpperCase() + '</div>';
			}else{
				returnValue = '<div id="fileType_' + fileId + '" class="db-ft-' + extensionName.toLowerCase() 
								+ '-small" style="height: 16px;background-repeat: no-repeat;"/>&nbsp;&nbsp;&nbsp;&nbsp;' 
								+ extensionName.toUpperCase();	+ '</div>';
			}
			return returnValue;	
		}
		return '<div id="fileType_' + fileId + '" class="db-ft-unknown-small" style="height: 16px;background-repeat: no-repeat;"/>&nbsp;&nbsp;&nbsp;&nbsp;' 
				+ extensionName.toUpperCase() + '</div>';	
	},
	formatProgressBar : function(_v, cellmeta, record){
		var returnValue = '';
		switch(record.data.fileState){
			case SWFUpload.FILE_STATUS.COMPLETE:
				if(Ext.isIE){
					returnValue = 
						'<div class="x-progress-wrap" style="height: 18px">' +
							'<div class="x-progress-inner">' +
								'<div style="width: 100%;" class="x-progress-bar x-progress-text">' + '100 %'
								'</div>' +
							'</div>' +
						'</div>';
				}else{
					returnValue = 
						'<div class="x-progress-wrap" style="height: 18px">' +
							'<div class="x-progress-inner">' +
								'<div id="progressBar_' + record.data.fileId + '" style="width: 100%;" class="x-progress-bar">' +
								'</div>' +
								'<div id="progressText_' + record.data.fileId + '" style="width: 100%;" class="x-progress-text x-progress-text-back" />100 %</div>'
							'</div>' +
						'</div>';
				}
				break;
			default : 
				returnValue = 
					'<div class="x-progress-wrap" style="height: 18px">' +
						'<div class="x-progress-inner">' +
							'<div id="progressBar_' + record.data.fileId + '" style="width: 0%;" class="x-progress-bar">' +
							'</div>' +
							'<div id="progressText_' + record.data.fileId + '" style="width: 100%;" class="x-progress-text x-progress-text-back" />0 %</div>'
						'</div>' +
					'</div>';
				break;
		}
		return returnValue;
	},
	formatState : function(_v, cellmeta, record){
		var returnValue = '';
		switch(_v){
			case SWFUpload.FILE_STATUS.QUEUED:
				returnValue = '<span id="' + record.id + '"><div id="fileId_' + record.data.fileId + '" class="ux-cell-icon-delete"/></span>';
				break;
			case SWFUpload.FILE_STATUS.CANCELLED:
				returnValue = '<span id="' + record.id + '"><div id="fileId_' + record.data.fileId + '" class="ux-cell-icon-clear"/></span>';
				break;
			case SWFUpload.FILE_STATUS.COMPLETE:
				returnValue = '<span id="' + record.id + '"><div id="fileId_' + record.data.fileId + '" class="ux-cell-icon-completed"/></span>';
				break;
			default : 
				alert('没有设置图表状态');
				break;
		}
		return returnValue;
	},
	onClose : function(){
		this.close();
	},
	onCancelQueue : function(fileId){
		Ext.getDom('fileName_' + fileId).className = 'ux-cell-color-gray';//设置文字颜色为灰色
		Ext.getDom('fileSize_' + fileId).className = 'ux-cell-color-gray';
		Ext.DomHelper.applyStyles('fileType_' + fileId,'font-style:italic;text-decoration: line-through;color:gray');
	},
	onFileQueued : function(file){
		var thiz = this.customSettings.scope_handler;
		thiz.fileList.getStore().add(new UploadDialog.FileRecord({
			fileId : file.id,
			fileName : file.name,
			fileSize : file.size,
			fileType : file.type,
			fileState : file.filestatus
		}));
		thiz.progressInfo.filesTotal += 1;
		thiz.progressInfo.bytesTotal += file.size;
		thiz.updateProgressInfo();
	},
	onQueueError : function(file, errorCode, message){
		var thiz = this.customSettings.scope_handler;
		//var process_info = this.customSettings.process_info;
		try {
			if (errorCode != SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED) {
				//process_info.filesTotal -= 1;
				//process_info.bytesTotal -= file.size;
				thiz.progressInfo.filesTotal -= 1;
				thiz.progressInfo.bytesTotal -= file.size;
			}
			thiz.progressInfo.bytesUploaded -= fpg.getBytesCompleted();
			thiz.updateProgressInfo();
//			if (errorCode === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
//				alert("你尝试添加太多的文件进入队列.\n" + (message === 0 ? "你已经超出上传限定范围." : "你只可以选择 " + (message > 1 ? "上传 " + message + " 文件." : "一个文件.")));
//				return;
//			}
//			switch (errorCode) {
//			case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
//				//progress.setStatus("文件尺寸超出限制.");
//				alert("错误码: 文件太大, 文件名: " + file.name + ", 文件尺寸: " + file.size + ", 消息: " + message);
//				break;
//			case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
//				//progress.setStatus("不能上传 0 字节的文件.");
//				alert("错误码: 0 字节文件, 文件名: " + file.name + ", 文件尺寸: " + file.size + ", 消息: " + message);
//				break;
//			case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
//				//progress.setStatus("无效的文件类型.");
//				alert("错误码: 无效文件类型, 文件名: " + file.name + ", 文件尺寸: " + file.size + ", 消息: " + message);
//				break;
//			case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
//				alert("你选择文件数量太多.  " +  (message > 1 ? "你只能添加 " +  message + " 更多的文件" : "你不能添加更多的文件."));
//				break;
//			default:
//				if (file !== null) {
//					//progress.setStatus("未经处理过的错误");
//				}
//				alert("错误码: " + errorCode + ", 文件名: " + file.name + ", 文件尺寸: " + file.size + ", 消息: " + message);
//				break;
//			}
		} catch (ex) {
	        this.debug(ex);
	    }
	},
	onFileDialogComplete : function(selectedFilesCount, queuedFilesCount){
		//alert("selectedFilesCount:" + selectedFilesCount + "  queuedFilesCount:" + queuedFilesCount );
	},
	onUploadStart : function(file){},
	onUploadProgress : function(file, completeBytes, bytesTotal){
		var percent = Math.ceil((completeBytes / bytesTotal) * 100);
		Ext.getDom('progressBar_' + file.id).style.width = percent + "%";
		Ext.getDom('progressText_' + file.id).innerHTML = percent + " %";
		
		var thiz = this.customSettings.scope_handler;
		var bytes_added = completeBytes - thiz.progressInfo.currentCompleteBytes;
		thiz.progressInfo.bytesUploaded += Math.abs(bytes_added < 0 ? 0 : bytes_added);
		thiz.progressInfo.currentCompleteBytes = completeBytes;
		if (thiz.progressInfo.lastUpdate) {
			thiz.progressInfo.lastElapsed = thiz.progressInfo.lastUpdate.getElapsed();
			thiz.progressInfo.timeElapsed += thiz.progressInfo.lastElapsed;
		}
		thiz.progressInfo.lastBytes = bytes_added;
		thiz.progressInfo.lastUpdate = new Date();
		thiz.updateProgressInfo();
	},
	onUploadError : function(file, errorCode, message){
		var thiz = this.customSettings.scope_handler;
		switch(errorCode){
			case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
				thiz.progressInfo.filesTotal -= 1;
				thiz.progressInfo.bytesTotal -= file.size;
				thiz.updateProgressInfo();
				break;
			case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
		}
		//alert('onUploadError,errorCode:' + errorCode + ",message:" + message  + ",file.filestatus:" + file.filestatus);
	},
	onUploadSuccess : function(file, serverData){
		var thiz = this.customSettings.scope_handler;
		if(Ext.util.JSON.decode(serverData).success){
			var record = thiz.fileList.getStore().getById(Ext.getDom('fileId_' + file.id).parentNode.id);
			record.set('fileState',file.filestatus);
			record.commit();
		}
		thiz.progressInfo.filesUploaded += 1;
		thiz.updateProgressInfo();
	},
	onUploadComplete : function(file){
		if (this.getStats().files_queued > 0 && this.uploadStopped == false) {
			this.startUpload();
		} 
	}
});

UploadDialog.FileRecord = Ext.data.Record.create([
	{name : 'fileId'},
  	{name : 'fileName'},
  	{name : 'fileSize'},
  	{name : 'fileType'},
  	{name : 'fileState'}
]);

/*var msg,c =0;
		for(var a in cellmeta){
			c ++;
			msg += a + "\t";
			if(c == 10){
				msg += "\n";
				c = 0;
			}
		}
		alert(msg);*/