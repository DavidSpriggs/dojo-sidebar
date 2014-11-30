### Configuration and Model

A module returning a configuration object which becomes the properties of the application model using dojo [Stateful](http://dojotoolkit.org/reference-guide/1.10/dojo/Stateful.html).

#### Configuration and Reserved Properties/Methods

The application expects specific properties for configuration and will set other properties to extend the model. Being an instance of `dojo/Stateful` also means any properties or methods thereof should not be used.

| Property | Description |
| -------- | ----------- |
| `map` | Esri map [options](https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1). The map instance then becomes the `map` property in the model. |
| `layerInfos` | An array of layer configuration objects. |
| `widgetInfos` | An array of widget configuration objects. |
| `debug` | When `true` will assign Controller to `window.app`. |
| `_mapConfig` | Clone of original `map` config. |

| Method | Description |
| ------ | ----------- |
| `getLayerInfo(id)` | Returns LayerInfo by id (same as layer id). |
| `getWidgetInfo(id)` | Returns WidgetInfo by id (same as dijit id). |

#### LayerInfos

`type`, `url`, `options` are required. `preLoad()` and `onLoad()` methods can used to perform custom logic on the layer before and after it's loaded. The layer instance is set as `layer` property and the layer id is set as `id` property.

```javascript
{
    type: 'esri/layers/ArcGISDynamicMapServiceLayer', // esri layer class or custom layer
    url: 'http://sampleserver6.arcgisonline.com/arcgis/rest/services/DamageAssessment/MapServer', // service url
    options: { // layer options for layer type
        id: 'DamageAssessment',
        opacity: 1.0,
        visible: true
    },
    preLoad: function (layer) {
        // called after layer initialized before added to map
    },
    onLoad: function (r) {
        var layer = r.layer;
        // esri native layer on load callback
    },
    // custom properties and methods
    layerControlOptions: {
    	sublayers: false,
    	metadataUrl: 'http://example.com'
	},
	foo: 'bar'
}
```

#### WidgetInfos

Widgets can be placed in the map controls, the map itself or a tab in the sidebar. Non-widget classes can be loaded with `placeAt: 'none'`.

`type`, `placeAt` and `options` are required. `tabOptions` is required when `placeAt: 'tab'`. The widget instance is set as `widget` property and the widget id (dijit id) is set as `id` property.

```javascript
[{
    type: 'esri/dijit/Geocoder',
    placeAt: 'mapControls', // 'tab', 'mapControls', 'map', 'none'
    className: 'search', //class added to mapControls and map widgets for positioning
    options: { //widget constructor options
        map: true,
        autoComplete: true
    }
}, {
    type: 'esri/dijit/BasemapToggle',
    placeAt: 'map',
    className: 'basemapToggle',
    options: {
        map: true, //replaced by map instance
        basemap: 'hybrid'
    }
}, {
    type: 'esri/dijit/Directions',
    placeAt: 'tab',
    tabOptions: { //tab options
        tabIcon: 'fa-car', //icon for tab
        tabTitle: 'Directions' //optional title added above widget
    },
    options: {
        map: true,
        routeTaskUrl: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
        routeParams: {
            directionsLanguage: 'en-US',
            directionsLengthUnits: units.MILES
        }
    }
}]
```

The application model or portions thereof can be passed as widget constructor options.

```javascript
{
    type: 'widgets/MyWidget',
    placeAt: 'tab',
    tabOptions: {
        tabIcon: 'fa-heart'
    },
    options: {
        model: true, //entire app model
        map: true, //map instance
        layerInfos: true, //app model's layers array
        widgetInfos: true //app model's widgets array
    }
}
```

Alternatively create a `layerInfos` array with layer ids in place of layer instances and widget loader will replace ids with said layer instances. While including `layerInfos: true` as above will include the stateful `LayerInfos`, this method provides a quick and easy way to pass a custom `layerInfos` array to the widget.

```javascript
{
    type: 'esri/dijit/Legend',
    placeAt: 'tab',
    tabOptions: {
        tabIcon: 'fa-list',
        tabTitle: 'Legend'
    },
    options: {
        map: true,
        layerInfos: [{
            layer: 'DamageAssessment', //layer set as layer instance by id
            title: 'Yo...Damage Assessment'
        }]
    }
}
```
