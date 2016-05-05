require.config({
  baseUrl: "js",
  shim : {
        "bootstrap" : { "deps" :['jquery'] },
        "firebase" : { exports: 'Firebase' },
        "bootstrapgrowl" : { "deps" : ['jquery'] }
    },
  paths: {
      jquery: "libs/jquery-2.2.0.min",
      particlebase: "libs/ParticleBase",
      app: "app",
      "bootstrap" :  "libs/bootstrap.min",
      firebase : "libs/firebase",
      text: "libs/text",
      particle: "libs/particle.min",
      bootstrapgrowl : "libs/jquery.bootstrap-growl.min",
      particleexchange: "libs/particleexchange",
      destroyed : "libs/destroyed"
  },
  packages: [
    {
      name: "particleloginmodal",
      location: "packages/particle-login-modal",
      main: "particle-login-modal"
    },
    {
      name: "particledevicedropdown",
      location: "packages/particle-device-dropdown",
      main: "particle-device-dropdown"
    },
    {
      name: "particlevariablepanel",
      location: "packages/particle-variable-panel",
      main: "particle-variable-panel"
    },
    {
      name: "particlefunctionpanel",
      location: "packages/particle-function-panel",
      main: "particle-function-panel"
    },
    {
      name: "particlestatuspanel",
      location: "packages/particle-status-panel",
      main: "particle-status-panel"
    },
    {
      name: "particlepublishpanel",
      location: "packages/particle-publish-panel",
      main: "particle-publish-panel"
    }
  ]
});


require(['require'], function(require) {
  require(['jquery','app'], function($, App) {
      var a = new App();
  });
});
