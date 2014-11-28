### Configuration and Model

A module returning a configuration object which becomes the properties of the application Model using dojo [Stateful](http://dojotoolkit.org/reference-guide/1.10/dojo/Stateful.html).

#### Configuration and Reserved Properties

The application expects specific properties for configuration and will set other properties to extend the Model. Being an instance of `dojo/Stateful` also means any properties or methods thereof should not be used.

| Property | Description |
| -------- | ----------- |
| `map` | Esri map [options](https://developers.arcgis.com/javascript/jsapi/map-amd.html#map1). The map instance then becomes the `map` property in the Model. |
| `layers` | An array of layer configuration objects. The layer instance is set as the `layer` property in the Model. |
| `debug` | When `true` will assign Controller to `window.app`. |