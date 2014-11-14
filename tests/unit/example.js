define([
	'intern!object',
	'intern/chai!assert',
	'../../src/js/config/viewer',
	'../../src/js/core/Controller'
], function(
	registerSuite, assert,
	config,
	Controller
) {
	var controller;
	registerSuite({
		name: 'constructor',
		setup: function() {
			controller = new Controller(config);
		},
		config_debug: function() {
			assert.strictEqual(controller.config.debug, true, 'Default debug it true');
		}
	});
});