define('particlemassflashpanel',
  ['jquery',
    'text!./html/particle-mass-flash-panel.html',
    'text!./html/particle-device-list.html',
    'destroyed',
    'particleexchange',
    'bootstrapgrowl'],
  function($, panelHtml, inputGroupHtml) {
  ParticleMassFlashPanel = function(device_id, access_token) {
    var token = access_token;
    var exchange = new ParticleExchange();
    var id = device_id
    var that = this;

    that.$particlemassflashpanel = $('.particle-mass-flash-panel');

    function init() {
    }

    $('.particle-mass-flash-panel').addClass('panel panel-default');
    init();
  }

  ParticleFunctionPanel.prototype = {
    constructor: ParticleMassFlashPanel,
  }
  return ParticleMassFlashPanel;
});
