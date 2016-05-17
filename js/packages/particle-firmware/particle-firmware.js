define('particlefirmware',
  ['jquery',
    'text!./html/particle-firmware.html',
    'destroyed',
    'bootstrapgrowl'],
  function($, panelHtml) {
  ParticleFirmware = function(devices, callback) {
    var that = this;
    var list = devices;
    var keys;
    var currentKey = -1;
    var cb = callback;
    var formData = new FormData();

    that.$particlefirmware = $('.particle-firmware');
    function fileSelectCallback(e) {
      formData.append('file', e.target.files[0]);
      formData.append('file_type', 'binary');
      $('[particle-firmware="flashall"]').removeClass('disabled');
    }

    function flashAll() {
      $('[particle-firmware="flashall"]').addClass('disabled');
      $('[particle-firmware="flashall"]').html('Flashing');

      nextUpload();
    }

    function nextUpload(prevId, status) {
      if (prevId && status) {
        callback(prevId, status);
      }
      currentKey++;
      if (currentKey < keys.length) {
        var currentPair = list[keys[currentKey]];
        if (currentPair.deviceId && currentPair.accessToken) {
          var deviceId = currentPair.deviceId;
          var accessToken = currentPair.accessToken;
          var xhr = new XMLHttpRequest();
          xhr.open('PUT', 'https://api.particle.io/v1/devices/' + deviceId + "?access_token=" + accessToken, true);
          xhr.onload = function() {
            nextUpload(deviceId, xhr.status);
          }
          callback(deviceId, "sending");
          xhr.send(formData);
        }
      } else {
        $.bootstrapGrowl("Firmware pushed to all devices", { type : "success" });
        $('[particle-firmware="flashall"]').html('Done flashing');
      }
    }

    function init() {
      that.$particlefirmware.html(panelHtml);
      $('[particle-firmware="bin"]').on('change', fileSelectCallback);
      $('[particle-firmware="flashall"]').click(flashAll);
      keys = Object.keys(list);
    }

    $('.particle-firmware').addClass('panel panel-default');
    init();
  }

  ParticleFirmware.prototype = {
    constructor: ParticleFirmware,
  }
  return ParticleFirmware;
});
