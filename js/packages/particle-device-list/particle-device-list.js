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
        var contents = e.target.result;
        console.log(contents);
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
