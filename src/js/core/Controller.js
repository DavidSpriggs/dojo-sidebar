define([
  'esri/map',
  'esri/dijit/HomeButton',

  'put-selector',

  'dojo/_base/lang',
  'dojo/domReady!'
], function(
  Map, HomeButton,

  put,

  lang
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
      this.map = new Map(put(document.body, 'div.map'), {
        center: [-56.049, 38.485],
        zoom: 3,
        basemap: 'streets'
      });
      this.map.on('load', lang.hitch(this, 'initWidgets'));
    },
    initWidgets: function() {
      //create controls div
      this.controlsNode = put(this.map.root, 'div.topLeftControls');
      //move the slider into the controls div
      put(this.controlsNode, '>', this.map._slider);

      this.home = new HomeButton({
        map: this.map
      }, put(this.controlsNode,'div.homeButton div')); //create the home button in the controls div
      this.home.startup();
    }
  };
});