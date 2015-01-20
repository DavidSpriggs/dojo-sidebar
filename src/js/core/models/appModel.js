define([
    'dojo/_base/declare',
    'dojo/Stateful',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/aspect'
], function(
    declare, Stateful, lang, array, aspect
) {
    var model = {
        debug: false,
        mapConfig: null,
        mapExtent: null,
        mapLod: null,
        map: null,
        mapControlsNode: null,
        sidebar: null,
        viewPadding: {
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        },
        layerInfos: [],
        widgetInfos: []
    };

    var SingletonClass = declare([Stateful], {
        constructor: function() {
            lang.mixin(this, model);
        },
        _mapSetter: function(map) {
            this.map = map;
            this.map.on('resize', function(evt) {
                var pnt = evt.target.extent.getCenter();
                setTimeout(function() {
                    evt.target.centerAt(pnt);
                }, 100);
            });
        },
        // wire up model map events
        mapLoad: function(r) {
            var map = r.map;
            //wire up extent change handler and defaults
            map.on('extent-change', lang.hitch(this, '_mapExtentChangeHandler'));
            this.set('mapExtent', map.extent);
            this.set('mapLod', map.getLevel());
            //wire up before setExtent()
            aspect.before(map, 'setExtent', lang.hitch(this, '_viewPaddingHandler'));
        },
        // return view padded extent
        _viewPaddingHandler: function(extent) {
            var map = this.map,
                vp = this.viewPadding,
                w = map.width - vp.left - vp.right,
                h = map.height - vp.top - vp.bottom,
                res = Math.max(extent.getWidth() / w, extent.getHeight() / h),
                center = extent.getCenter(),
                result = map.extent.expand(res / (map.extent.getWidth() / map.width));
            result = result.centerAt({
                x: center.x - (vp.left - vp.right) * 0.5 * res,
                y: center.y - (vp.top - vp.bottom) * 0.5 * res
            });
            return [result];
        },
        _mapExtentChangeHandler: function(evt) {
            this.set('mapExtent', evt.extent);
            this.set('mapLod', evt.lod);
        },
        // get layerInfo by layer id
        getLayerInfo: function(id) {
            var filter = array.filter(this.layerInfos, function(layerInfo) {
                return layerInfo.id === id;
            });
            if (filter[0]) {
                return filter[0];
            } else {
                return null;
            }
        },
        // get widgetInfo by widget (dijit) id
        getWidgetInfo: function(id) {
            var filter = array.filter(this.widgetInfos, function(widgetInfo) {
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