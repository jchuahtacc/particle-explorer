define('particledevicedropdown',
  ['jquery',
    'particle',
    'text!./html/particle-device-dropdown.html',
    'text!./html/particle-device-li.html',
    'bootstrapgrowl'],
  function($, Particle, dropdownHtml, liHtml) {
  ParticleDeviceDropdown = function(access_token, callback) {
    var particle = new Particle();
    var token = access_token;
    var cb = callback;
    this.$particledevicedropdown = $('.particle-device-dropdown');
    function init() {
      this.$particledevicedropdown.html(dropdownHtml);
      populate();
    }

    function select_device(source) {
      var id = $(source.target).attr('device_id');
      var device_name = $(source.target).html();
      $('[device-dropdown="current_device"]').text(device_name);
      if (cb) {
        cb(id);
      }
    }

    function populate() {
      var devicesPr = particle.listDevices({ auth: token });
      devicesPr.then(
        function(data) {
          if (data) {
            $('[device-dropdown="device-controller"]').removeClass('disabled');
            var first = true;
            for (key in data.body) {
              var device = data.body[key];
              li = $($(liHtml));
              if (!device.name || device.name.length == 0) {
                device.name = "Unnamed Device";
              }
              li.find('a').text(device.name);
              li.find('a').attr('device_id', device.id);
              li.find('a').click(select_device);
              $('[device-dropdown="device-dropdown"]').prepend(li);
              if (first) {
                first = false;
                li.find('a').click();
              }
            }
          }
        },
        function(error) {

        }
      );
    }

    $('.particle-device-dropdown').addClass('dropdown');
    init.apply(this);
  }

  ParticleDeviceDropdown.prototype = {
    constructor: ParticleDeviceDropdown,
  }
  return ParticleDeviceDropdown;
});
