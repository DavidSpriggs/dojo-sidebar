define([
    'dojo/_base/lang',
    'esri/config',
    'esri/tasks/GeometryService',
    'esri/layers/ImageParameters',
    'esri/InfoTemplate',
    'esri/units'
], function(
    lang,
    esriConfig,
    GeometryService,
    ImageParameters,
    InfoTemplate,
    units
) {

    //esri config
    esriConfig.defaults.io.proxyUrl = 'proxy/proxy.ashx';
    esriConfig.defaults.io.alwaysUseProxy = false;
    esriConfig.defaults.geometryService = new GeometryService('http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer');

    var imageParams = lang.mixin(new ImageParameters(), {
        format: 'png32'
    });

    return {
        debug: true,
        map: {
            basemap: 'streets',
            center: [-98.579404, 39.828127],
            zoom: 5,
            sliderStyle: 'small'
        },
        layerInfos: [{
            type: 'esri/layers/FeatureLayer',
            url: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/SanFrancisco/311Incidents/FeatureServer/0',
            options: {
                id: 'sf311Incidents',
                opacity: 1.0,
                visible: true,
                outFields: ['*'],
                mode: 0,
                infoTemplate: new InfoTemplate()
            }
        }, {
            type: 'esri/layers/ArcGISDynamicMapServiceLayer',
            url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer',
            options: {
                id: 'DamageAssessment',
                opacity: 1.0,
                visible: true,
                imageParameters: imageParams
            } //,
            //preLoad: function (layer) {
            //    //called after layer init but before added to map
            //    console.log(layer);
            //},
            //onLoad: function (r) {
            //    //native esri layer on load callback
            //    var layer = r.layer;
            //    console.log(layer);
            //},
            //foo: 'bar' //any custom props obj fnc etc to be mixed into layer model
        }],
        widgetInfos: [{
            type: 'esri/dijit/Geocoder',
            placeAt: 'mapControls',
            className: 'search',
            options: {
                map: true,
                autoComplete: true
            }
        }, {
            type: 'esri/dijit/HomeButton',
            placeAt: 'mapControls',
            className: 'homeButton',
            options: {
                map: true
            }
        }, {
            type: 'esri/dijit/LocateButton',
            placeAt: 'mapControls',
            className: 'locateButton',
            options: {
                map: true
            }
        }, {
            type: 'esri/dijit/BasemapToggle',
            placeAt: 'map',
            className: 'basemapToggle',
            options: {
                map: true,
                basemap: 'hybrid'
            }
        }, {
            type: 'dijit/layout/ContentPane',
            placeAt: 'tab',
            tabOptions: {
                tabIcon: 'fa-bars',
                tabTitle: 'Dojo Sidebar'
            },
            options: {
                content: '<div>A responsive sidebar for Esri Mapping apps.</div>'
            }
        }, {
            type: 'esri/dijit/Directions',
            placeAt: 'tab',
            tabOptions: {
                tabIcon: 'fa-car',
                tabTitle: 'Directions'
            },
            options: {
                map: true,
                routeTaskUrl: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
                routeParams: {
                    directionsLanguage: 'en-US',
                    directionsLengthUnits: units.MILES
                },
                active: false //for 3.12, starts active by default
            }
        }, {
            type: 'esri/dijit/Legend',
            placeAt: 'tab',
            tabOptions: {
                tabIcon: 'fa-list',
                tabTitle: 'Legend'
            },
            options: {
                map: true,
                layerInfos: [{
                    layer: 'DamageAssessment',
                    title: 'Damage Assessment'
                }]
            }
        }]
    };
});