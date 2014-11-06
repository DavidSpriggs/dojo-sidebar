define([
  'esri/map',
  'esri/dijit/HomeButton',
  'put-selector',
  'dojo/domReady!'
], function(
  Map, HomeButton, put
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

      this.home = new HomeButton({
        map: this.map
      }, put(this.map.root,'div.homeButton div'));
      this.home.startup();
    }
  };
});