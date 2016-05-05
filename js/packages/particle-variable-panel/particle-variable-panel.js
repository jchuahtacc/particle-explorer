define('particlevariablepanel',
  ['jquery',
    'text!./html/particle-variable-panel.html',
    'text!./html/particle-variable-input-group.html',
    'particleexchange',
    'destroyed',
    'bootstrapgrowl'],
  function($, panelHtml, inputGroupHtml) {
  ParticleVariablePanel = function(device_id, access_token) {
    var token = access_token;
    var exchange = new ParticleExchange();
    var id = device_id
    var that = this;
    that.$particlevariablepanel = $('.particle-variable-panel');

    function requestVariable(eventSource) {

      var group = $(eventSource.target).parents('[particle-variable-input-group="group"]');
      var varname = group.find('[particle-variable-input-group="variable"]').html();
      var value = group.find('[particle-variable-input-group="value"]');
      exchange.getVariable({ deviceId: id, name: varname, auth: token});

    }

    function refreshVariable(event, data) {
      if (data.params.deviceId === id) {
        var group = that.$particlevariablepanel.find('[particle-variable-varname="' + data.body.name + '"]');
        if (group) {
          $(group).find('[particle-variable-input-group="value"]').val(data.body.result);
        }
      }
    }

    function probeDevice(event, data) {
      clearPanel();
      if (data.params.deviceId === id) {
        if (data.body.variables) {
          var panel = that.$particlevariablepanel.find('[particle-variable-panel="variable_list"]');
          var variables = data.body.variables;
          var keycount = 0;
          for (var key in variables) {
            var inputGroup = $($(inputGroupHtml));
            inputGroup.attr('particle-variable-varname', key);
            inputGroup.find('[particle-variable-input-group="variable"]').html(key);
            inputGroup.find('[particle-variable-input-group="refresh"]').click(requestVariable);
            panel.append(inputGroup);
            keycount++;
          }
          that.$particlevariablepanel.find('[particle-variable-panel="status"]').html(keycount + " variables found");

        } else {
          that.$particlevariablepanel.find('[particle-variable-panel="status"]').html("No variables");
        }
      }
    }

    function online(event, data) {
      if (data.params.deviceId === id) {
        if (data.body.data === "online") {
          exchange.getDevice({deviceId : id, auth: token});
        }
        if (data.body.data === "offline") {
          clearPanel();
          that.$particlefunctionpanel.find('[particle-variable-panel="status"]').html("Offline");
        }
      }
    }

    function clearPanel() {
      var panel = that.$particlevariablepanel.find('[particle-variable-panel="variable_list"]');
      panel.html("");
    }

    function init() {
      that.$particlevariablepanel.html(panelHtml);
      $(document).on('particleexchange.getDevice.data', probeDevice);
      $(document).on('particleexchange.getVariable.data', refreshVariable);
      $(document).on('particleexchange.getEventStream.event', online);
      that.$particlevariablepanel.find('.panel-body').on('destroyed', function() {
        $(document).off('particleexchange.getDevice.data', probeDevice);
        $(document).off('particleexchange.getVariable.data', refreshVariable);
        $(document).off('particleexchange.getEventStream.event', online);
      });
      exchange.getDevice({deviceId : id, auth: token});
      exchange.getEventStream({deviceId : id, auth: token});
    }

    $('.particle-variable-panel').addClass('panel panel-default');
    init();
  }

  ParticleVariablePanel.prototype = {
    constructor: ParticleVariablePanel,
  }
  return ParticleVariablePanel;
});
