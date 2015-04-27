Ext.define("GleamTech.UI.SearchField", {
    extend: "Ext.form.field.Text",
    triggers: {
        search: {
            cls: "x-form-trigger-search"
        },
        clear: {
            cls: "x-form-trigger-clear",
            hidden: !0,
            handler: function(n) {
                n.reset()
            }
        }
    },
    initComponent: function() {
        this.callParent();
        this.on("change", this.updateTriggerUI, this, {
            priority: 1
        });
        this.addCls("x-no-ms-clear")
    },
    updateTriggerUI: function(n, t) {
        t.length == 0 ? (this.triggers.clear.setHidden(!0), this.triggers.search.setHidden(!1)) : (this.triggers.search.setHidden(!0), this.triggers.clear.setHidden(!1))
    },
    reset: function(n) {
        n && this.suspendCheckChange++;
        this.callParent();
        n && (this.suspendCheckChange--, this.triggers.clear.setHidden(!0), this.triggers.search.setHidden(!1))
    }
});