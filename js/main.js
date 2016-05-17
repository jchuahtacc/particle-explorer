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
      destroyed : "libs/destroyed"
  },
  packages: [
    {
      name: "particledevicelist",
      location: "packages/particle-device-list",
      main: "particle-device-list"
    },
    {
      name: "particlefirmware",
      location: "packages/particle-firmware",
      main: "particle-firmware"
    }
  ]
});


require(['require'], function(require) {
  require(['jquery','app'], function($, App) {
      var a = new App();
  });
});
