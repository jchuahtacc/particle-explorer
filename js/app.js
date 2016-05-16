define(['jquery',
        'particle',
        'particledevicelist',
        'bootstrapgrowl',
        'firebase', 'bootstrap'], function($, Particle) {
  function App() {
      var Firebase = require('firebase');
      this.particle = new Particle();
      $(document).ready(this.initialize.apply(this));

  };
  App.prototype = {
      constructor: App,

      initialize: function() {
        this.devicelist = new ParticleDeviceList();
      }
  };
  return App;
});
