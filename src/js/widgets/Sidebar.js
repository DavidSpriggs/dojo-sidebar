define([
	'dojo/_base/declare',
	'dojo/text!./templates/Sidebar.html',

	'dijit/_WidgetBase',
	'dijit/_TemplatedMixin',

	'xstyle/css!./css/Sidebar.css'
], function(
	declare, template,

	_WidgetBase, _TemplatedMixin
) {

	return declare([_WidgetBase, _TemplatedMixin], {
		templateString: template,
		baseClass: 'sidebar',
		postCreate: function() {
			this.inherited(arguments);
			this.init();
		},
		init: function() {

		}
	});
});