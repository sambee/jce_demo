ThemePicker = Ext.extend(Ext.ColorPalette, {
	constructor : function(_cfg) {
		Ext.apply(this, _cfg);
		ThemePicker.superclass.constructor.call(this, {
			autoShow : true,
			colors : ['000000', '545554', 'ABADAF', 'D8D8D8', '424370', '52567E', '5E7189', 'BDD3EF', 'D1C5FF',
					'9ACD68', '9CD4C1', 'FC6161', 'E2B4D5', 'C49E92', 'FFB5B5', 'FF8C37','C72929'],
			listeners : {
				'select' : function(palette, selColor) {
					switch (selColor) {
						case '000000' : // 黑色（光滑的）
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-slickness.css");
							break;
						case '545554' : // 黑色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-black.css");
							break;
						case 'ABADAF' : // 深灰色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-darkgray.css");
							break;
						case 'D8D8D8' : // 灰色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-gray.css");
							break;
						case '424370' : // 深紫蓝色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-midnight.css");
							break;
						case '52567E' : // 紫蓝色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-indigo.css");
							break;
						case '5E7189' : // 暗蓝灰色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-slate.css");
							break;
						case 'BDD3EF' : // 淡蓝色（默认）
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext-all.css");
							break;
						case 'D1C5FF' : // 紫色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-purple.css");
							break;
						case '9ACD68' : // 橄榄色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-olive.css");
							break;
						case '9CD4C1' : // 绿色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-green.css");
							break;
						case 'FC6161' : // 红色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-red5.css");
							break;
						case 'FFB5B5' : // 薄荷红
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-peppermint.css");
							break;
						case 'E2B4D5' : // 粉红色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-pink.css");
							break;
						case 'C49E92' : // 咖啡色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-chocolate.css");
							break;
						case 'FF8C37' : // 橙色
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-orange.css");
							break;
						case 'C72929' : // 红间灰
							Ext.util.CSS.swapStyleSheet("theme", "resources/css/ext/xtheme-silverCherry.css");
							break;
					}
				}
			}
		});
	}
});

Ext.ux.ColorField = Ext.extend(Ext.form.TriggerField, {
	invalidText : "'{0}' is not a valid color - it must be in a the hex format (# followed by 3 or 6 letters/numbers 0-9 A-F)",
	triggerClass : 'x-form-color-trigger',
	defaultAutoCreate : {
		tag : "input",
		type : "text",
		size : "10",
		maxlength : "7",
		autocomplete : "off"
	},
	maskRe : /[#a-f0-9]/i,
	initComponent : function() {
		Ext.form.ComboBox.superclass.initComponent.call(this);
		this.addEvents('colorchange');
	},
	validateValue : function(value) {
		if (!Ext.ux.ColorField.superclass.validateValue.call(this, value)) {
			return false;
		}
		if (value.length < 1) {
			this.setColor('');
			return true;
		}
		var parseOK = this.parseColor(value);
		if (!value || (parseOK == false)) {
			this.markInvalid(String.format(this.invalidText, value));
			return false;
		}
		this.setColor(value);
		return true;
	},
	setColor : function(color) {
		if (color == '' || color == undefined) {
			if (this.emptyText != '' && this.parseColor(this.emptyText))
				color = this.emptyText;
			else
				color = 'transparent';
		}
		if (this.trigger)
			this.trigger.setStyle({
				'background-color' : color
			});
		else {
			this.on('render', function() {
				this.setColor(color)
			}, this);
		}
	},
	validateBlur : function() {
		return !this.menu || !this.menu.isVisible();
	},
	getValue : function() {
		return Ext.ux.ColorField.superclass.getValue.call(this) || "";
	},
	setValue : function(color) {
		Ext.ux.ColorField.superclass.setValue.call(this, this
				.formatColor(color));
		this.setColor(this.formatColor(color));
	},
	parseColor : function(value) {
		return (!value || (value.substring(0, 1) != '#'))
				? false
				: (value.length == 4 || value.length == 7);
	},
	formatColor : function(value) {
		if (!value || this.parseColor(value))
			return value;
		if (value.length == 3 || value.length == 6) {
			return '#' + value;
		}
		return '';
	},
	menuListeners : {
		select : function(e, c) {
			this.setValue(c);
			this.fireEvent('colorchange', e, c);
		},
		show : function() {
			this.onFocus();
		},
		hide : function() {
			this.focus.defer(10, this);
			var ml = this.menuListeners;
			this.menu.un("select", ml.select, this);
			this.menu.un("show", ml.show, this);
			this.menu.un("hide", ml.hide, this);
		}
	},
	onTriggerClick : function() {
		if (this.disabled) {
			return;
		}
		if (this.menu == null) {
			this.menu = new Ext.menu.ColorMenu();
		}
		this.menu.on(Ext.apply({}, this.menuListeners, {
			scope : this
		}));
		this.menu.show(this.el, "tl-bl?");
	}
});
Ext.reg('colorfield', Ext.ux.ColorField);