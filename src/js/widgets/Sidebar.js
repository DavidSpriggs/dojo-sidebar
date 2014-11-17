define([
	'dojo/_base/declare',
	'dojo/text!./templates/Sidebar.html',
	'dojo/_base/lang',
	'dojo/_base/array',
	'dojo/dom-class',
	'dojo/on',

	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',

	'put-selector/put',

	'xstyle/css!./css/Sidebar.css'
], function(
	declare, template, lang, array, domClass, on,

	_WidgetBase, _TemplatedMixin,

	put
) {
	return declare([_WidgetBase, _TemplatedMixin], {
		templateString: template,
		baseClass: 'sidebar',
		defaultTabParams: {
			tabIcon: 'fa-bars'
		},
		collapseSyncNode: null,
		postCreate: function() {
			this.inherited(arguments);
			this.init();
		},
		init: function() {
			this.tabs = [];
			if (this.collapseSyncNode && domClass.contains(this.domNode, 'collapsed')) {
				put(this.collapseSyncNode, '.collapsed');
			}
		},
		createTab: function(params) {
			params = params || this.defaultTabParams;
			var tab = {
				buttonNode: null,
				containerNode: null
			};
			//create and place dom elements for the tab button and pane
			tab.buttonNode = put(this.tabsButtonNode, 'li a[role=tab] i.fa.' + params.tabIcon + '<<');
			tab.containerNode = put(this.tabsContainerNode, 'div.' + this.baseClass + '-pane');
			// listen for the tab button click
			on(tab.buttonNode, 'click', lang.hitch(this, 'tabClickHandler', tab));
			//keep a refrence to this tab
			this.tabs.push(tab);
			//return the tabs pane node
			return tab;
		},
		tabClickHandler: function(tab) {
			if (domClass.contains(tab.buttonNode, 'active')) {
				this.closeTab(tab);
			} else {
				this.openTab(tab);
			}
		},
		openTab: function(tab) {
			array.forEach(this.tabs, function(tab) {
				put(tab.buttonNode, '!active');
				put(tab.containerNode, '!active');
			});
			put(tab.buttonNode, '.active');
			put(tab.containerNode, '.active');
			put(this.domNode, '!collapsed');
			if (this.collapseSyncNode) {
				put(this.collapseSyncNode, '!collapsed');
			}
		},
		closeTab: function() {
			array.forEach(this.tabs, function(tab) {
				put(tab.buttonNode, '!active');
				put(tab.containerNode, '!active');
			});
			put(this.domNode, '.collapsed');
			if (this.collapseSyncNode) {
				put(this.collapseSyncNode, '.collapsed');
			}
		}
	});
});