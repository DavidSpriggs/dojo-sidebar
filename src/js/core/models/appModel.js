define([
    'dojo/_base/declare',
    'dojo/Stateful',
    'dojo/_base/lang',
    'dojo/_base/array'
], function (
    declare, Stateful, lang, array
) {
    var model = {
        debug: false,
        mapConfig: null,
        mapExtent: null,
        mapLod: null,
        map: null,
        mapControlsNode: null,
        sidebar: null,
        layerInfos: [],
        widgetInfos: []
    };

    var SingletonClass = declare([Stateful], {
        constructor: function () {
            lang.mixin(this, model);
        },
        getLayerInfo: function (id) {
            var filter = array.filter(this.layerInfos, function (layerInfo) {
                return layerInfo.id === id;
            });
            if (filter[0]) {
                return filter[0];
            } else {
                return null;
            }
        },
        getWidgetInfo: function (id) {
            var filter = array.filter(this.widgetInfos, function (widgetInfo) {
                return widgetInfo.id === id;
            });
            if (filter[0]) {
                return filter[0];
            } else {
                return null;
            }
        }
    });

    if (!_instance) {
        var _instance = new SingletonClass();
    }
    return _instance;
});