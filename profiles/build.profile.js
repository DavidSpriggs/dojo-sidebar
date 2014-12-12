/*jshint unused:false */

// Useful for tagging packages such as proj4 as AMD
// to help the build system work with them better.
var amdTag = function(filename, mid) {
    return (/.*\.js$/).test(filename);
};

var profile = {
    basePath: '../src',
    action: 'release',
    cssOptimize: 'comments',
    mini: true,
    optimize: 'uglify',
    layerOptimize: 'uglify',
    stripConsole: 'all',
    selectorEngine: 'acme',
    layers: {
        'dojo/dojo': {
            include: [
                'dojo/i18n',
                'dojo/domReady',
                'core/Controller',
                'core/bootstrap',
                'config/viewer',
                'dojox/gfx/path',
                'dojox/gfx/svg',
                'dojox/gfx/shape'
            ],
            includeLocales: ['en-us'],
            customBase: true,
            boot: true
        }
    },
    staticHasFeatures: {
        // The trace & log APIs are used for debugging the loader, so we don’t need them in the build
        'dojo-trace-api': 0,
        'dojo-log-api': 0,

        // This causes normally private loader data to be exposed for debugging, so we don’t need that either
        'dojo-publish-privates': 0,

        // We’re fully async, so get rid of the legacy loader
        'dojo-sync-loader': 0,

        // dojo-xhr-factory relies on dojo-sync-loader
        'dojo-xhr-factory': 0,

        // We aren’t loading tests in production
        'dojo-test-sniff': 0
    },
    // packages: [{
    //     name: 'esri',
    //     resourceTags: amdTag
    // }],
    // this is to make sure that the widget templates get built into the layer file.
    userConfig: {
        packages: ['core', 'dijit', 'dojox', 'config', 'widgets', 'esri', 'dgrid', 'xstyle', 'put-selector']
    }
};