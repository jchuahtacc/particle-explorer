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
      }
    }

    function init() {
      that.$particlefirmware.html(panelHtml);
      $('[particle-firmware="bin"]').on('change', fileSelectCallback);
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
