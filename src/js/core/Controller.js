/*jshint unused:false*/
define([
    'esri/map',

    'put-selector/put',

    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/on',

    'core/models/appModel',
    'core/models/layerModel',
    'core/models/widgetModel',

    'widgets/Sidebar'
], function (
    Map,

    put,

    declare, lang, array, on,

    appModel, LayerModel, WidgetModel,

    Sidebar
) {
    return declare(null, {
        _layers: [], //temp array for layer loading
        constructor: function (config) {
            config = config || {};
            //create the application Model
            this.model = appModel;
            //enable debugging
            if (config.debug === true) {
                window.app = this;
            }
            //start w/ the map
            this.initMap(config);
        },
        initMap: function (config) {
            //clone map config
            this.model.set('mapConfig', lang.clone(config.map));
            //create a div in the body, create an esri map in it and set `map` property
            var map = new Map(put(document.body, 'div.map'), config.map || {});
            this.model.set('map', map);
            //wait until the map is loaded before continuing
            map.on('load', lang.hitch(this, 'initLayers', config, map));
            //map events
            map.on('extent-change', lang.hitch(this, 'mapExtentChangeHandler'));
        },
        initLayers: function (config, map) {
            if (config.layerInfos && config.layerInfos.length > 0) {
                //build array of layer types, require them, create layers and add to map
                var modules = [];
                array.forEach(config.layerInfos, function (layer) {
                    modules.push(layer.type);
                });
                require(modules, lang.hitch(this, function () {
                    array.forEach(config.layerInfos, function (layer, i) {
                        require([layer.type], lang.hitch(this, 'initLayer', layer, i));
                    }, this);
                    on.once(map, 'layers-add-result', lang.hitch(this, 'initUI', config, map));
                    map.addLayers(this._layers);
                }));
            } else {
                this.initUI(config, map);
            }
        },
        initLayer: function (layer, i, Layer) {
            //create layer Model
            layer = new LayerModel(layer);
            //create layer
            var l = new Layer(layer.url, layer.options);
            //pre and on load methods
            if (layer.preLoad) {
                layer.preLoad(l);
            }
            if (layer.onLoad) {
                l.on('load', lang.hitch(l, layer.onLoad));
            }
            //set as `layer` property
            layer.set('layer', l);
            //set layer info `id` property same as layer id
            layer.set('id', l.id);
            //layer model back to array at i
            this.model.layerInfos[i] = layer;
            //unshift instead of push to keep layer ordering on map intact
            this._layers.unshift(l);
        },
        initUI: function (config, map) {
            //create controls div
            this.model.mapControlsNode = put(map.root, 'div.mapControls.sidebar-map');
            //move the slider into the controls div
            put(this.model.mapControlsNode, '>', map._slider);
            //create sidebar
            this.model.sidebar = new Sidebar({
                collapseSyncNode: this.model.mapControlsNode
            }, put(map.root, 'div'));
            this.model.sidebar.startup();
            // init widgets
            this.initWidgets(config, map);
        },
        initWidgets: function (config, map) {
            if (config.widgetInfos && config.widgetInfos.length > 0) {
                //build array of widget types, require them, create widgets and add to map
                var modules = [];
                array.forEach(config.widgetInfos, function (widget) {
                    modules.push(widget.type);
                });
                require(modules, lang.hitch(this, function () {
                    array.forEach(config.widgetInfos, function (widget, i) {
                        require([widget.type], lang.hitch(this, 'initWidget', widget, i));
                    }, this);
                }));
            }
        },
        initWidget: function (widget, i, Widget) {
            //replace model properties in config if true
            if (widget.options.model === true) {
                widget.options.model = this.model;
            }
            if (widget.options.map === true) {
                widget.options.map = this.model.map;
            }
            if (widget.options.layerInfos === true) {
                widget.options.layerInfos = this.model.layerInfos;
            } else if (widget.options.layerInfos && widget.options.layerInfos.length) {
                //replace layer ids with layers if custom layerInfos
                array.forEach(widget.options.layerInfos, function (info) {
                    if (info.layer && this.model.map.getLayer(info.layer)) {
                        info.layer = this.model.map.getLayer(info.layer);
                    }
                }, this);
            }
            if (widget.options.widgetInfos === true) {
                widget.options.widgetInfos = this.model.widgetInfos;
            }
            //create widget model
            widget = new WidgetModel(widget);
            //default to tab
            if (!widget.get('placeAt')) {
                widget.set('placeAt', 'tab');
            }
            //create widget and place appropriately
            //var w = new Widget(widget.options); //this doesn't work with some esri widgets like Legend which require srcNodeRef when constructing :/
            var w;
            switch (widget.get('placeAt')) {
            case 'mapControls':
                w = new Widget(widget.options, put(this.model.mapControlsNode, 'div.' + (widget.get('className') || 'widget') + ' div'));
                break;
            case 'map':
                w = new Widget(widget.options, put(this.model.map.root, 'div.' + (widget.get('className') || 'widget') + ' div'));
                break;
            case 'tab':
                var tabOptions = widget.get('tabOptions') || {};
                var tab = this.model.sidebar.createTab(tabOptions);
                if (tabOptions.tabTitle) {
                    w = new Widget(widget.options, put(tab.containerNode, 'div.sidebar-pane-title $ < div', tabOptions.tabTitle));
                } else {
                    w = new Widget(widget.options, put(tab.containerNode, 'div'));
                }
                break;
            case 'none':
                w = new Widget(widget.options);
                break;
            default:
                break;
            }
            //start it
            w.startup();
            //set as `widget` property
            widget.set('widget', w);
            //set widget info `id` property same as widget id
            widget.set('id', w.id);
            //widget model back to array at i
            this.model.widgetInfos[i] = widget;
        },
        mapExtentChangeHandler: function (evt) {
            appModel.set('mapExtent', evt.extent);
            appModel.set('mapLod', evt.lod);
        }
    });
});