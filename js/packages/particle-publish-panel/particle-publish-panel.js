define('particlepublishpanel',
  ['jquery',
    'text!./html/particle-publish-panel.html',
    'particleexchange',
    'destroyed',
    'bootstrapgrowl'],
  function($, panelHtml, inputGroupHtml) {
  ParticlePublishPanel = function(access_token) {
    var token = access_token;
    var exchange = new ParticleExchange();
    var that = this;

    that.$particlepublishpanel = $('.particle-publish-panel');

    function publishSuccess(event, data) {
      $.bootstrapGrowl(data.params.name + " published", { type : "success" });
    }

    function publishFail(event, data) {
      $.bootstrapGrowl(data.params.name + " was not published", { type : "warning" });
    }

    function init() {
      that.$particlepublishpanel.html(panelHtml);
      that.$particlepublishpanel.find('[particle-publish-panel="publish"]').click($.proxy(publish, this));
      $(document).on('particleexchange.publishEvent.data', publishSuccess);
      $(document).on('particleexchange.publishEvent.error', publishFail);
      that.$particlepublishpanel.find('.panel-body').on('destroyed', function() {
        $(document).off('particleexchange.publishEvent.data', publishSuccess);
        $(document).off('particleexchange.publishEvent.error', publishFail);
      });
    }

    function publish() {
      var eventname = that.$particlepublishpanel.find('[particle-publish-panel="event"]').val();
      var datatext = that.$particlepublishpanel.find('[particle-publish-panel="data"]').val();
      var data = { };
      var ok = true;
      if (!(eventname && eventname.length > 0)) {
        ok = false;
      }
      if (datatext && datatext.length > 0) {
        try {
          data = JSON.parse(datatext);
        } catch(e) {
          $.bootstrapGrowl("Invalid JSON data", {type : "warning"});
          ok = false;
        }
      }
      if (ok) {
        exchange.publishEvent({ name : eventname, data : data, auth: token });
      }
    }

    $('.particle-publish-panel').addClass('panel panel-default');
    init();
  }

  ParticlePublishPanel.prototype = {
    constructor: ParticlePublishPanel,
  }
  return ParticlePublishPanel;
});
