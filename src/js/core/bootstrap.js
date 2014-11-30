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
			location: './js/libs/dojo'
		}, {
			name: 'dijit',
			location: './js/libs/dijit'
		}, {
			name: 'dojox',
			location: './js/libs/dojox'
		}, {
			name: 'dgrid',
			location: './js/libs/dgrid'
		}, {
			name: 'esri',
			location: './js/libs/esri'
		}, {
			name: 'put-selector',
			location: './js/libs/put-selector'
		}, {
			name: 'xstyle',
			location: './js/libs/xstyle'
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

	//bootstrap our application controller
	/* jshint nonew: false */
	require(dojoConfig, ['core/Controller', 'config/viewer', 'dojo/domReady!'], function(Controller, config) {
		new Controller(config);
	});
})();