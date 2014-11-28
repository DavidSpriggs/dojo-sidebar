/*jshint unused:false*/
define([
  'esri/map',
  'esri/dijit/HomeButton',
  'esri/dijit/LocateButton',
  'esri/dijit/Geocoder',
  'esri/dijit/BasemapToggle',
  'esri/dijit/Directions',
  'esri/IdentityManager',
  'esri/units',

  'put-selector/put',

  'dojo/_base/declare',
  'dojo/Stateful',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/on',

  'widgets/Sidebar'
], function (
  Map, HomeButton, LocateButton, Geocoder, BasemapToggle, Directions, IdentityManager, units,

  put,

  declare, Stateful, lang, array, on,

  Sidebar
) {
  return declare(null, {
    constructor: function (config) {
      //create the application Model
      var Model = declare(Stateful);
      this.model = new Model(config);
      //enable debugging
      if (this.model.debug === true) {
        window.app = this;
      }
      //start w/ the map
      this.initMap();
    },
    initMap: function () {
      //clone map config
      this.model._mapConfig = lang.clone(this.model.map);
      //create a div in the body, create an esri map in it and set `map` property
      this.model.set('map', new Map(put(document.body, 'div.map'), this.model.map || {})); 
      //wait until the map is loaded before continuing
      this.model.map.on('load', lang.hitch(this, 'initLayers'));
    },
    initLayers: function () {
      if (this.model.layers && this.model.layers.length > 0) {
        this.layers = [];
        //build array of layer types, require them, create layers and add to map
        var modules = [];
        array.forEach(this.model.layers, function (layer) {
          modules.push(layer.type);
        });
        require(modules, lang.hitch(this, function () {
          array.forEach(this.model.layers, function (layer) {
            require([layer.type], lang.hitch(this, 'initLayer', layer));
          }, this);
          on.once(this.model.map, 'layers-add-result', lang.hitch(this, 'initWidgets'));
          this.model.map.addLayers(this.layers);
        }));
      } else {
        this.initWidgets();
      }
    },
    initLayer: function (layer, Layer) {
      //create layer
      var l = new Layer(layer.url, layer.options);
      //pre and on load methods
      if (layer.preLoad) {
        layer.preLoad(l);
      }
      if (layer.onLoad) {
        l.on('load', lang.hitch(l, layer.onLoad));
      }
      //add layer to layer config in the model
      layer.layer = l;
      //unshift instead of push to keep layer ordering on map intact
      this.layers.unshift(l);
    },
    initWidgets: function () {
      //create controls div
      this.mapControlsNode = put(this.model.map.root, 'div.mapControls.sidebar-map');
      //move the slider into the controls div
      put(this.mapControlsNode, '>', this.model.map._slider);

      //create the sidebar widget
      this.sideBar = new Sidebar({
        collapseSyncNode: this.mapControlsNode
      }, put(this.model.map.root, 'div'));
      this.sideBar.startup();

      //add tabs to sidebar
      var tab1 = this.sideBar.createTab({
        tabIcon: 'fa-bars'
      });
      tab1.containerNode.innerHTML = '<h1>Dojo Sidebar</h1><div>A responsive sidebar for Esri Mapping apps.</div>';

      var tab2 = this.sideBar.createTab({
        tabIcon: 'fa-user'
      });
      tab2.containerNode.innerHTML = '<h1>User</h1>';

      var tab3 = this.sideBar.createTab({
        tabIcon: 'fa-car'
      });

      this.directions = new Directions({
        map: this.model.map,
        routeTaskUrl: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
        routeParams: {
          directionsLanguage: 'en-US',
          directionsLengthUnits: units.MILES
        }
      }, put(tab3.containerNode, 'h1 $ < div', 'Directions'));
      this.directions.startup();

      //this.sideBar.openTab(tab1);

      //create other map widgets
      this.search = new Geocoder({
        map: this.model.map,
        autoComplete: true
      }, put(this.mapControlsNode, 'div.search div')); //create the search bar in the controls div
      this.search.startup();

      this.home = new HomeButton({
        map: this.model.map
      }, put(this.mapControlsNode, 'div.homeButton div')); //create the home button in the controls div
      this.home.startup();

      this.geoLocate = new LocateButton({
        map: this.model.map,
        useTracking: false
      }, put(this.mapControlsNode, 'div.locateButton div')); //create the locate button in the controls div
      this.geoLocate.startup();

      this.basemaToggle = new BasemapToggle({
        map: this.model.map,
        basemap: 'hybrid'
      }, put(this.model.map.root, 'div.basemapToggle div'));
      this.basemaToggle.startup();
    }
  });
});