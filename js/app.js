define(['jquery',
        'particle',
        'particleexchange',
        'particleloginmodal',
        'particledevicedropdown',
        'particlevariablepanel',
        'particlefunctionpanel',
        'particlestatuspanel',
        'particlepublishpanel',
        'bootstrapgrowl',
        'firebase', 'bootstrap'], function($, Particle) {
  function App() {
      var Firebase = require('firebase');
      this.particle = new Particle();
      $(document).ready(this.initialize.apply(this));

  };
  App.prototype = {
      constructor: App,

      deviceSelectListener: function(device_id) {
        if (this.particlevariablepanel) {
          $(this.particlevariablepanel).html("");
          $(this.particlefunctionpanel).html("");
          $(this.particlestatuspanel).html("");
          $(this.particlepublishpanel).html("");
        }
        if (device_id) {
          this.particlevariablepanel = new ParticleVariablePanel(device_id, this.token);
          this.particlefunctionpanel = new ParticleFunctionPanel(device_id, this.token);
          this.particlestatuspanel = new ParticleStatusPanel(device_id, this.token);
          this.particlestatuspanel = new ParticlePublishPanel(this.token);
        }
      },

      initialize: function() {
          this.exchange = new ParticleExchange();

          this.particleloginmodal = new ParticleLoginModal($.proxy(function(access_token) {
            if (access_token) {
              $.bootstrapGrowl("Login successful", {type : 'success'});
              $("#particle-signin-button").remove();
              this.token = access_token;
              this.particledevicedropdown = new ParticleDeviceDropdown(access_token, $.proxy(this.deviceSelectListener, this));
            } else {
              $.bootstrapGrowl("Login unsuccessful", {type : 'warning'});
            }
          }, this));

      }
  };
  return App;
});
