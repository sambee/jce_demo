Application = Ext.extend(Ext.Viewport, {
	themePicker : null,// 主题选择器
	fileGridPanel : null, // 文件类表
	fileTreePanel : null, // 树导航
	constructor : function(_cfg) {
		this.themePicker = new ThemePicker({
			renderTo : _cfg.themePickerEL
		});
		this.fileGridPanel = new FileGridPanel();
		this.fileTreePanel = new FileTreePanel();
		this.fileTreePanel.on('click', function(_node) {
			this.fileGridPanel.listFiles(_node.id); // 左边树单击右边网格同步
		}, this);
		Application.superclass.constructor.call(this, {
			layout : 'border',
			items : [{
				xtype : 'box',
				region : 'north',
				applyTo : 'header',
				height : 80
			}, {
				title : '文件目录',
				region : 'west',
				layout : 'border',
				margins : '2 0 5 5',
				width : 275,
				minSize : 200,
				maxSize : 350,
				collapsible : true,
				split : true,
				items : [this.fileTreePanel, {
					region : 'south',
					title : '文件信息',
					autoScroll : true,
					collapsible : true,
					collapseMode:'mini',
					collapsed:true,
					split : true,
					margins : '-1',
					cmargins : '2 2 2 2',
					height : 220,
					html : '未开发...'
				}]
			}, {
				region : 'center',
				layout : 'card',
				margins : '2 5 5 0',
				activeItem : 0,
				border : false,
				items : [this.fileGridPanel]
			}]

		});
	}
});

Ext.onReady(function() {
	Ext.BLANK_IMAGE_URL = 'resources/images/default/s.gif';
	Ext.QuickTips.init();
	new Application({
		themePickerEL : 'color'
	});
});
