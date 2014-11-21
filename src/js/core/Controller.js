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

  'dojo/_base/lang',

  'widgets/Sidebar',

  'dojo/domReady!'
], function(
  Map, HomeButton, LocateButton, Geocoder, BasemapToggle, Directions, IdentityManager, units,
  put,
  lang,
  Sidebar
) {
  return {
    startup: function(config) {
      this.config = config;
      if (this.config.debug) {
        window.app = this;
      }
      this.initMap();
    },
    initMap: function() {
      this.map = new Map(put(document.body, 'div.map'), { //create a div in the body and create an esri map in it
        center: [-56.049, 38.485],
        zoom: 3,
        basemap: 'streets'
      });
      this.map.on('load', lang.hitch(this, 'initWidgets')); //waint untill the map is loaded before creating
      //this.initWidgets();
    },
    initWidgets: function() {
      //create controls div
      //this.controlsNode = put(this.map.root, 'div.topLeftControls div.sideBar+div.topLeftMapControls+div.clear<');
      //this.controlsNode = put(this.map.root, 'div.topLeftControls');
      //this.sideBarNode = put(this.map.root, 'div.sideBar div.tabs<');
      this.mapControlsNode = put(this.map.root, 'div.mapControls.sidebar-map');
      // put(this.controlsNode, 'div.clear');
      //move the slider into the controls div
      put(this.mapControlsNode, '>', this.map._slider);

      //create the sidebar widget
      this.sideBar = new Sidebar({
        collapseSyncNode: this.mapControlsNode
      }, put(this.map.root, 'div'));
      this.sideBar.startup();

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
      //tab3.containerNode.innerHTML = '<h1>Settings</h1>';
      this.directions = new Directions({
        map: this.map,
        routeTaskUrl: 'http://sampleserver3.arcgisonline.com/ArcGIS/rest/services/Network/USA/NAServer/Route',
        routeParams: {
          directionsLanguage: 'en-US',
          directionsLengthUnits: units.MILES
        }
      }, put(tab3.containerNode, 'h1 $ < div', 'Directions'));
      this.directions.startup();

      //this.sideBar.openTab(tab1);

      this.search = new Geocoder({
        map: this.map,
        autoComplete: true
      }, put(this.mapControlsNode, 'div.search div')); //create the search bar in the controls div
      this.search.startup();

      this.home = new HomeButton({
        map: this.map
      }, put(this.mapControlsNode, 'div.homeButton div')); //create the home button in the controls div
      this.home.startup();

      this.geoLocate = new LocateButton({
        map: this.map,
        useTracking: false
      }, put(this.mapControlsNode, 'div.locateButton div')); //create the locate button in the controls div
      this.geoLocate.startup();

      this.basemaToggle = new BasemapToggle({
        map: this.map,
        basemap: 'hybrid'
      }, put(this.map.root, 'div.basemapToggle div'));
      this.basemaToggle.startup();
    }
  };
});