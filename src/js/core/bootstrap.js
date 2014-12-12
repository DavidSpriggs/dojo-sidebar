//dojo configuration
(function() {
	var dojoConfig = {
		async: true,
		baseUrl: (typeof window !== 'undefined' && window.dojoConfig) ? '/dev' : './',
		packages: [{
			name: 'core',
			location: './js/core'
		}, {
			name: 'config',
			location: './js/config'
		}, {
			name: 'widgets',
			location: './js/widgets'
		}, {
			name: 'dojo',
			location: './js/dojo'
		}, {
			name: 'dijit',
			location: './js/dijit'
		}, {
			name: 'dojox',
			location: './js/dojox'
		}, {
			name: 'dgrid',
			location: './js/dgrid'
		}, {
			name: 'esri',
			location: './js/esri'
		}, {
			name: 'put-selector',
			location: './js/put-selector'
		}, {
			name: 'xstyle',
			location: './js/xstyle'
		}]
	};

	//config file param in url?
	// var config = 'config/viewer',
	// 	s = window.location.search,
	// 	q = s.match(/config=([^&]*)/i);
	// if (q && q.length > 0) {
	// 	config = q[1];
	// 	if (config.indexOf('/') < 0) {
	// 		config = 'config/' + config;
	// 	}
	// }

	//bootstarp our application controller
	/* jshint nonew: false */
	require(dojoConfig, ['core/Controller', 'config/viewer', 'dojo/domReady!'], function(Controller, config) {
		new Controller(config);
	});
})();