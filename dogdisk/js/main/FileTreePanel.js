FileTreePanel = Ext.extend(Ext.tree.TreePanel, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		FileTreePanel.superclass.constructor.call(this, {
			region : 'center',
			split : true,
			margins : '-1 -1 2 -1',
			autoScroll : true,
			lines : true,
			loader : new Ext.tree.TreeLoader({
				dataUrl : 'getDirectories.action'
			}),
			root : new Ext.tree.AsyncTreeNode({
				id : '*',
				iconCls : 'db-icn-world',
				text : '根目录'
			})
		});
	}
});

