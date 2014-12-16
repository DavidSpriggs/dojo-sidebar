define([
    'dojo/_base/declare',
    'dojo/Stateful',
    'dojo/_base/lang',
    'dojo/_base/array'
], function (
    declare, Stateful, lang, array
) {
    var model = {
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
            return filter[0];
        },
        getWidgetInfo: function (id) {
            var filter = array.filter(this.widgetInfos, function (widgetInfo) {
                return widgetInfo.id === id;
            });
            return filter[0];
        }
    });

    if (!_instance) {
        var _instance = new SingletonClass();
    }
    return _instance;
});