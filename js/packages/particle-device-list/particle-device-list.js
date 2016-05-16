define('particledevicelist',
  ['jquery',
    'text!./html/particle-device-list.html',
    'text!./html/particle-device-listitem.html',
    'destroyed',
    'bootstrapgrowl'],
  function($, panelHtml, listItemHTML) {
  ParticleDeviceList = function() {
    var that = this;

    that.$particledevicelist = $('.particle-device-list');
    function fileSelectCallback(e) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var ok = true;
        var contents = e.target.result;
        try {
          data = JSON.parse(contents);
        } catch(e) {
          $.bootstrapGrowl("Invalid JSON data", {type : "warning"});
          ok = false;
        }

        if (ok) {
          $.bootstrapGrowl("JSON data loaded", {type : "success"});
          if (data.devices) {
            for (var key in data.devices) {
              var device = data.devices[key];
              if (device && device.deviceId && device.accessToken) {
                var newDevice = $(listItemHTML);
                newDevice.find('[particle-device-listitem="description"]').html(device.deviceId + " <i>(" + device.accessToken + ")</i>" );
                newDevice.appendTo('[particle-device-list="deviceList"]');
              }
            }
          }
          // load list from file
        }
      }
      reader.readAsText(e.target.files[0]);
    }

    function init() {
      that.$particledevicelist.html(panelHtml);
      $('[particle-device-list="json"]').on('change', fileSelectCallback);
    }

    $('.particle-device-list').addClass('panel panel-default');
    init();
  }

  ParticleDeviceList.prototype = {
    constructor: ParticleDeviceList,
  }
  return ParticleDeviceList;
});
