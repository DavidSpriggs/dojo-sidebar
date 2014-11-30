define(['dojo/_base/declare', 'dojo/Stateful', 'dojo/_base/array'], function (declare, Stateful, array) {
    return declare([Stateful], {
        map: null,
        _mapConfig: {},
        layerInfos: [],
        widgetInfos: [],
        debug: false,
        getLayerInfo: function (id) {
            array.some(this.layerInfos, function (layerInfo) {
                if (layerInfo.get('id') == id) {
                    return layerInfo;
                }
            }, this);
        },
        getWidgetInfo: function (id) {
            array.some(this.widgetInfos, function (widgetInfo) {
                if (widgetInfo.get('id') === id) {
                    return widgetInfo;
                }
            }, this);
        }
    });
});