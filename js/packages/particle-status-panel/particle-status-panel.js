define('particlestatuspanel',
  ['jquery',
    'text!./html/particle-status-panel.html',
    'particleexchange',
    'bootstrapgrowl'],
  function($, panelHtml) {
  ParticleStatusPanel = function(device_id, access_token) {
    var token = access_token;
    var exchange = new ParticleExchange();
    var id = device_id;
    var that = this;
    that.$particlestatuspanel = $('.particle-status-panel');

    function probeDevice(event, data) {
      if (data.params.deviceId === id) {
        that.$particlestatuspanel.find('[particle-status-panel="device_name"]').html(data.body.name);
        that.$particlestatuspanel.find('[particle-status-panel="device_id"]').val(data.body.id);
        that.$particlestatuspanel.find('[particle-status-panel="connected"]').html(data.body.connected ? "Online" : "Offline");
        that.$particlestatuspanel.find('[particle-status-panel="last_heard"]').val(data.body.last_heard);
        that.$particlestatuspanel.find('[particle-status-panel="status"]').val(data.body.status);
        that.$particlestatuspanel.find('[particle-status-panel="last_ip"]').val(data.body.last_ip_address);
      }
    }

    function clearPanel() {
      var panel = this.$particlestatuspanel.find('[particle-status-panel="variable_list"]');
      panel.html("");
    }

    function init() {
      that.$particlestatuspanel.html(panelHtml);
      $(document).on('particleexchange.getDevice.data', probeDevice);
      exchange.getDevice({deviceId : id, auth: token});

    }

    $('.particle-status-panel').addClass('panel panel-default');
    init();
  }

  ParticleStatusPanel.prototype = {
    constructor: ParticleStatusPanel,
  }
  return ParticleStatusPanel;
});
