### Configuration and Model

A module returning a configuration object which becomes the properties of the application Model using dojo [Stateful](http://dojotoolkit.org/reference-guide/1.10/dojo/Stateful.html).

#### Configuration and Reserved Properties

The application expects specific properties for configuration and will set other properties to extend the Model. Being an instance of `dojo/Stateful` also means any properties or methods thereof should not be used.

| Property | Description |
| -------- | ----------- |
| `map` | Esri map [options](https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1). The map instance then becomes the `map` property in the Model. |
| `layers` | An array of layer configuration objects. |
| `debug` | When `true` will assign Controller to `window.app`. |

#### Layers

The layer instance is set as `layer` property.

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
    layerControlOptions: { // widget or custom options
    	sublayers: false,
    	metadataUrl: 'http://example.com'
	}
}
```
