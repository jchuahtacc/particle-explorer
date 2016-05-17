define('particledevicelist',
  ['jquery',
    'text!./html/particle-device-list.html',
    'text!./html/particle-device-listitem.html',
    'particlefirmware',
    'destroyed',
    'bootstrapgrowl'],
  function($, panelHtml, listItemHTML) {
  ParticleDeviceList = function() {
    var that = this;
    var firmwarePanel;

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
                newDevice.attr('deviceId', device.deviceId);
                newDevice.find('[particle-device-listitem="description"]').html(device.deviceId);
                newDevice.appendTo('[particle-device-list="deviceList"]');
              }
            }
            firmwarePanel = new ParticleFirmware(data.devices, function(deviceId, status) {
              var listItem = that.$particledevicelist.find('[deviceId="' + deviceId + '"]');
              var iconSpan = listItem.find('[particle-device-listitem="glyphicon"]');
              iconSpan.removeClass("glyphicon-pause");
              iconSpan.removeClass("glyphicon-play");
              var statusCaught = false;
              if (status === "sending") {
                iconSpan.addClass("glyphicon-play");
                statusCaught = true;
              }
              if (status === 200) {
                iconSpan.addClass("glyphicon-ok");
                statusCaught = true;
              }
              if (status === 401) {
                iconSpan.addClass("glyphicon-remove");
                statusCaught = true;
              }
              if (!statusCaught) {
                iconSpan.addClass("glyphicon-warning-sign");
              }
            });
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
