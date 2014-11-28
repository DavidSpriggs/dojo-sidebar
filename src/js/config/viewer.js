define([
    'dojo/_base/lang',
    'esri/config',
    'esri/tasks/GeometryService',
    'esri/layers/ImageParameters',
    'esri/InfoTemplate',
    'esri/Color',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/renderers/SimpleRenderer'
], function (
    lang,
    esriConfig,
    GeometryService,
    ImageParameters,
    InfoTemplate,
    Color,
    SimpleMarkerSymbol,
    SimpleRenderer
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
        layers: [{
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
            }
        }, {
            type: 'esri/layers/CSVLayer',
            url: './js/config/data/lasar_sites.csv',
            options: {
                id: 'LasarSites',
                opacity: 1.0,
                visible: true,
                latitudeFieldName: 'Decimal_Lat',
                longitudeFieldName: 'Decimal_long',
                infoTemplate: new InfoTemplate()
            },
            //preLoad: function (layer) {
                //
            //},
            onLoad: function (r) {
                var layer = r.layer;
                var orangeRed = new Color([238, 69, 0, 0.5]);
                var marker = new SimpleMarkerSymbol('solid', 15, null, orangeRed);
                var renderer = new SimpleRenderer(marker);
                layer.setRenderer(renderer);
            }
        }]
    };
});