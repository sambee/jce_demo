
FileGridPanel = Ext.extend(Ext.grid.GridPanel, {
	sm : null,
	ds : null,
	currentPath : '',//保存当前浏览的文件路径
	actions : null,
	gridContextMenu : null,
	constructor : function() {
		this.actions = [
			new Ext.Action({
				text : '向上',
				iconCls : 'db-icn-back',
				handler : function() {
					this.listParentFiles();
				},
				scope : this
			}),
			new Ext.Action({
				text : '根目录',
				iconCls : 'db-icn-world',
				handler : function() {
					this.listRootFiles();
				},
				scope : this
			}),
			new Ext.Action({
				text : '新建文件夹',
				iconCls : 'db-icn-folder-new',
				handler : function(){
					this.createFolder();
				},
				scope : this
			}),
			new Ext.Action({
				text : '删除',
				iconCls : 'db-icn-delete',
				handler : function(){
					this.deleteFiles();
				},
				scope : this
			}),
			new Ext.Action({
				text : '压缩',
				iconCls : 'db-icn-folder-zip',
				handler : function(){
					this.compressionFiles();
				},
				scope : this
			}),
			new Ext.Action({
				text : '解压缩',
				handler : function(){
					this.decompressionFiles();
				},
				scope : this
			}),
			new Ext.Action({
				text : '刷新',
				iconCls : 'db-icn-refresh',
				handler : function(){
					this.refresh();
				},
				scope : this
			}),
			new Ext.Action({
				text : '上传',
				iconCls : 'db-icn-upload',
				handler : function() {
					this.showUploadDialog();
				},
				scope : this
			}),
			new Ext.Action({
				text : '下载',
				iconCls : 'db-icn-download',
				handler : function(){
					this.download();
				},
				scope : this
			}),
			new Ext.Action({
				text : '剪切',
				iconCls : 'db-icn-cut',
				handler : function(){
					Ext.Msg.alert('温馨提示','此功能暂不开放!');
				},
				scope : this
			}),
			new Ext.Action({
				text : '复制',
				iconCls : 'db-icn-copy',
				handler : function(){
					Ext.Msg.alert('温馨提示','此功能暂不开放!');
				},
				scope : this
			}),
			new Ext.Action({
				text : '粘贴',
				iconCls : 'db-icn-paste',
				handler : function(){
					Ext.Msg.alert('温馨提示','此功能暂不开放!');
				},
				scope : this
			}),
			new Ext.Action({//index = 12
				text : '重命名',
				iconCls : 'db-icn-rename',
				handler : function(){
					Ext.Msg.alert('温馨提示','此功能暂不开放!');
				},
				scope : this
			})
		];
		this.gridContextMenu = new Ext.menu.Menu({
			items : [
				this.actions[2],this.actions[8],'-',
				this.actions[4],this.actions[5],'-',
				this.actions[9],this.actions[10],this.actions[11],'-',
				this.actions[3],this.actions[12]
			]
		});
		this.sm = new Ext.grid.CheckboxSelectionModel(), 
		this.ds = new Ext.data.Store({
			url : 'getFiles.action',
			reader : new Ext.data.JsonReader({totalProperty : 'totalProperty',root : 'root'}, 
				 [{name : 'id',type : 'string'},
			 	 {name : 'fileName',type : 'string'}, 
			 	 {name : 'lastModifyDate'}, 
			     {name : 'leaf',type : 'bool'}, 
				 {name : 'fileSize',type : 'string'}]
			),
			sortInfo : { 
				field : 'fileSize'
			}
		}), FileGridPanel.superclass.constructor.call(this, {
			title : '文件管理',
			loadMask : {
				msg : '列表加载中...'
			},
			columns : [this.sm, {
				header : '类型',
				width : 70,
				dataIndex : 'fileName',
				menuDisabled : true,
				resizable : false,
				renderer : this.formatIcon
			}, {
				header : '名称',
				width : 150,
				dataIndex : 'fileName',
				id : 'fileName',
				sortable : true
			}, {
				header : '修改日期',
				width : 150,
				dataIndex : 'lastModifyDate',
				sortable : true,
				renderer : this.formatDate
			}, {
				header : '大小',
				width : 150,
				dataIndex : 'fileSize',
				sortable : true
			}],
			autoExpandColumn : 'fileName',
			ds : this.ds,
			sm : this.sm,
//			bbar : new Ext.PagingToolbar({
//				pageSize : 20,
//				store : this.ds,
//				displayInfo : true,
//				displayMsg : '第 {0} - {1} 条  共 {2} 条',
//				emptyMsg : "没有记录"
//			}),
			tbar : [
				this.actions[0],this.actions[1],this.actions[6],'-',
				this.actions[3],this.actions[9],this.actions[10],this.actions[11],'-',
				this.actions[7],this.actions[8],'-',{
					xtype : 'textfield',
					emptyText : '关键字查询',
					listeners : {
						'specialkey' : this.onEnterForSearch,
						scope : this
					}
				}
			],
			listeners : {
				'rowclick' : this.onRowClick,
				'rowdblclick' : this.onRowDblClick,
				'rowcontextmenu' : this.onRowContextMenu,
				'contextmenu' : function(e){e.stopEvent();},
				scope : this
			}
		});
	},
	download : function(){
		var records = this.getSelectionModel().getSelections();
		if(records.length <= 0){
			Ext.Msg.alert('操作提示','至少选择一个文件或者文件夹');
		}else{
			if(records.length == 1 && records[0].data.leaf){
				window.location = encodeURI('download.action?path=' + this.currentPath.substring(1) + '&name=' + records[0].data.fileName);
			}else{
				Ext.Msg.alert("温馨提示","此功能尚未开发");
				return;
				Ext.Msg.confirm('操作提示','是否打包下载?',function(){
					var paths = [];
					for(var i = 0; i < records.length; i++){
						paths.push(records[i].data.id);
					}
					window.location = 'downloadAll.action?paths=' + paths + '&path=' + this.currentPath;
//					alert(paths);
//					var mask = new Ext.LoadMask(this.el, {msg:"下载中,请稍等..."});
//					mask.show();
					
//					Ext.Ajax.request({
//						url : 'downloadAll.action',
//						callback : function(options,success,response){
//							var result = Ext.util.JSON.decode(response.responseText);
//							if(!result.success){
//								
//							}
//							mask.hide();								
//						}
//					});
				},this);
			}
		}
	},
	compressionFiles : function(){
		var records = this.getSelectionModel().getSelections();
		if(records.length <= 0){
			Ext.Msg.alert('操作提示','至少选择一个文件！');
		}else{
			var paths = [];
			for(var i = 0; i < records.length; i++){
				paths.push(records[i].data.id);	
			}
			var mask = new Ext.LoadMask(this.el, {msg:"压缩中,请稍等..."});
			mask.show();
			Ext.Ajax.request({
				timeout : 60000,
				url : 'compressionFiles.action',
				callback : function(options,success,response){
					var result = Ext.util.JSON.decode(response.responseText);
					if(!result.success){
						Ext.Msg.show({
							title : '错误提示',
							msg : '文件压缩错误!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});		
					}else{
						this.refresh();
					}
					mask.hide();
				},
				params : {
					paths : paths,
					path : this.currentPath
				},
				scope : this
			});
		}
	},
	decompressionFiles : function(){
		var records = this.getSelectionModel().getSelections();
		if(records.length <= 0){
			Ext.Msg.alert('操作提示','至少选择一个文件!',function(){
				return;
			});	
		}else{
			var paths = [];
			for(var i = 0; i< records.length; i++){
				paths.push(records[i].data.id);	
			}
			var mask = new Ext.LoadMask(this.el, {msg:"解压缩中,请稍等..."});
			mask.show();
			Ext.Ajax.request({
				url : 'decompressionFiles.action',
				callback : function(options,success,response){
					var result = Ext.util.JSON.decode(response.responseText);
					if(!result.success){
						Ext.Msg.show({
							title : '错误提示',
							msg : '文件解压缩错误!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});		
					}else{
						this.refresh();
					}
					mask.hide();
				},
				params : {
					paths : paths,
					path : this.currentPath
				},
				scope : this
			});
		}
	},
	deleteFiles : function(){
		var records = this.getSelectionModel().getSelections();
		if(records.length <= 0){
			Ext.Msg.alert('操作提示','至少选择一个文件或者文件夹！',function(){
				return;
			});
		}else{
			Ext.Msg.confirm('操作确认','您确实要删除这些文件?',function(btn){
				if(btn == 'yes'){
					var paths = [];
					for(var i = 0; i < records.length; i++){
						paths.push(records[i].data.id);	
					}
					var mask = new Ext.LoadMask(this.el, {msg:"文件删除中,请稍等..."});
					mask.show();
					Ext.Ajax.request({
						url : 'deleteFiles.action',
						callback : function(options,success,response){
							var result = Ext.util.JSON.decode(response.responseText);
							if(!result.success){
								Ext.Msg.show({
									title : '错误提示',
									msg : '删除文件错误!',
									buttons : Ext.Msg.OK,
									icon : Ext.Msg.ERROR
								});	
							}
							if(success){
								this.refresh();	
							}
							mask.hide();
						},
						params : {
							paths : paths
						},
						scope : this
					});
				}
			},this);
		}
	},
	createFolder : function(){
		Ext.Msg.prompt('新建文件夹','请输入文件夹名称',function(btn, text){
		    if (btn == 'ok'){
				Ext.Ajax.request({
					url : 'createFolder.action',
					callback : function(options, success, response) {
						var result = Ext.util.JSON.decode(response.responseText);
						if (result.success) {
							this.refresh();
						} else {
							Ext.Msg.show({
							   title:'错误提示',
							   msg: '新建文件夹操作失败. 请重试!',
							   buttons: Ext.Msg.OK,
							   icon: Ext.Msg.ERROR
							});
						}
					},
					params : {
						path : this.currentPath,
						name : text
					},
					scope : this
				});
		    }
		},this);
	},
	showUploadDialog : function(){
		var dialog = new UploadDialog({
			uploadUrl : 'uploadFiles.action',
			filePostName : 'myUpload', //这里很重要，默认值为'fileData',这里匹配action中的setMyUpload 属性
			flashUrl : 'js/swfupload.swf',
			fileSize : '500 MB', 
			fileTypes : '*.*',
			fileTypesDescription : '所有文件',
			scope : this
		})
		dialog.show();
	},
	refresh : function(){
		this.getStore().reload();
	},
	listRootFiles : function() { // 根目录
		this.listFiles();
	},
	listParentFiles : function() { // 向上目录
		if (this.getStore().getCount() > 0) {// 有记录才继续
			var orgPath = this.getStore().getAt(0).data.id
			var path = '\\' + orgPath;// 获得路径
			var index = -1;
			for (var i = 0; i < 2; i++) {
				index = path.lastIndexOf('\\');
				if (index != -1) {
					path = path.substring(0, index);
				}
			}
			index = orgPath.lastIndexOf('\\');
			if (index != -1) {
				this.listFiles(path);// 获得上一级文件夹名称
			}
		} else {// 如果是空文件夹
			if (this.currentPath.length > 0) {
				var index = this.currentPath.lastIndexOf('\\');
				if (index != -1) {
					this.currentPath = this.currentPath.substring(0, index);
					this.listFiles(this.currentPath);
				} else {
					this.listFiles();
				}
			}
		}
	},
	listFiles : function(_node) { // 获得文件夹中文件列表
		this.currentPath = '/' + (Ext.isEmpty(_node) ? '' : _node);
		this.getStore().load({
			params : {
				'node' : _node
			}
		});
	},
	formatIcon : function(_v, cellmeta, record){
		if(!record.data.leaf){
			return '<div class="db-icn-folder-collapsed" style="height: 16px;background-repeat: no-repeat;"/>' +
					'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;文件夹</div>';
		}
		var extensionName = '';
		var returnValue = '';
		var index = _v.lastIndexOf('.');
		if(index == -1){
			return '<div class="db-ft-unknown-small" style="height: 16px;background-repeat: no-repeat;"/>' +
					'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + extensionName.toUpperCase() + '</div>';
		}else{
			extensionName = _v.substring(index + 1);
			extensionName = extensionName == "html" ? "htm" : extensionName;
			extensionName = extensionName == "php" ? "htm" : extensionName;
			extensionName = extensionName == "jsp" ? "htm" : extensionName;
			var css = '.db-ft-' + extensionName.toLowerCase() + '-small';
			if(Ext.isEmpty(Ext.util.CSS.getRule(css),true)){
				returnValue = '<div class="db-ft-unknown-small" style="height: 16px;background-repeat: no-repeat;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' 
								+ extensionName.toUpperCase() + '</div>';
			}else{
				returnValue = '<div class="db-ft-' + extensionName.toLowerCase() + '-small" style="height: 16px;background-repeat: no-repeat;"/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' 
								+ extensionName.toUpperCase();	+ '</div>';
			}
			return returnValue;	
		}
	},
	formatDate : function(_v) {
		return _v.replace(/T/g, ' ');
	},
	onEnterForSearch : function() {
		Ext.Msg.alert('温馨提示','此功能暂不开放!');
	},
	onRowClick : function(grid,rowIndex,e){
		
	},
	onRowDblClick : function(grid, rowIndex) {
		if (!grid.getStore().getAt(rowIndex).data.leaf) {// 如果文件夹才获访问
			grid.listFiles(grid.getStore().getAt(rowIndex).data.id);
		}
	},
	onRowContextMenu : function(grid, index, e){
		e.stopEvent();
		if (this.getSelectionModel().isSelected(index) !== true) {
			this.getSelectionModel().clearSelections();
			this.getSelectionModel().selectRow(index);
			this.fireEvent('rowclick',grid,index,e);
		}
		this.gridContextMenu.showAt(e.getXY());
	}
});

