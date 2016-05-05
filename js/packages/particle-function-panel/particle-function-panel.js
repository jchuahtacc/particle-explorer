define('particlefunctionpanel',
  ['jquery',
    'text!./html/particle-function-panel.html',
    'text!./html/particle-function-input-group.html',
    'destroyed',
    'particleexchange',
    'bootstrapgrowl'],
  function($, panelHtml, inputGroupHtml) {
  ParticleFunctionPanel = function(device_id, access_token) {
    var token = access_token;
    var exchange = new ParticleExchange();
    var id = device_id
    var that = this;

    that.$particlefunctionpanel = $('.particle-function-panel');

    function callFunction(eventSource) {
      var group = $(eventSource.target).parents('[particle-function-input-group="group"]');
      var functionname = group.find('[particle-function-input-group="function"]').html();
      var param = group.find('[particle-function-input-group="parameter"]').val();
      var fnPr = exchange.callFunction({ deviceId: id, name: functionname, argument: param, auth: token});
    }

    function probeDevice(event, data) {
      clearPanel();
      if (data.params.deviceId === id) {
        if (data.body.functions) {
          var panel = that.$particlefunctionpanel.find('[particle-function-panel="function_list"]');
          var functions = data.body.functions;
          that.$particlefunctionpanel.find('[particle-function-panel="status"]').html(functions.length + " functions found");
          for (var key in functions) {
            var inputGroup = $($(inputGroupHtml));
            inputGroup.attr('particle-function-funcname', key);
            inputGroup.find('[particle-function-input-group="function"]').html(functions[key]);
            inputGroup.find('[particle-function-input-group="call"]').click(callFunction);
            panel.append(inputGroup);
          }
        } else {
          that.$particlefunctionpanel.find('[particle-function-panel="status"]').html("No functions");
        }
      }
    }

    function clearPanel() {
      var panel = that.$particlefunctionpanel.find('[particle-function-panel="function_list"]');
      panel.html("");
    }

    function online(event, data) {
      if (data.params.deviceId === id) {
        if (data.body.data === "online") {
          exchange.getDevice({deviceId : id, auth: token});
        }
        if (data.body.data === "offline") {
          clearPanel();
          that.$particlefunctionpanel.find('[particle-function-panel="status"]').html("Offline");
        }
      }
    }

    function callFunctionSuccess(event, data) {
      if (data.params.deviceId === id) {
        $.bootstrapGrowl(data.params.name + " returned " + data.body.return_value, { type : "success"} );
      }
    }

    function callFunctionFail(event, data) {
      if (data.params.deviceId === id) {
        $.bootstrapGrowl(data.params.name + " was unsuccessful");
      }
    }

    function init() {
      that.$particlefunctionpanel.html(panelHtml);
      $(document).on('particleexchange.getDevice.data', probeDevice);
      $(document).on('particleexchange.callFunction.data', callFunctionSuccess);
      $(document).on('particleexchange.callFunction.error', callFunctionFail);
      $(document).on('particleexchange.getEventStream.event', online);
      that.$particlefunctionpanel.find('.panel-body').on('destroyed', function() {
        $(document).off('particleexchange.getDevice.data', probeDevice);
        $(document).off('particleexchange.callFunction.data', callFunctionSuccess);
        $(document).off('particleexchange.callFunction.error', callFunctionFail);
        $(document).off('particleexchange.getEventStream.event', online);
      });
      exchange.getDevice({deviceId : id, auth: token});
      exchange.getEventStream({deviceId : id, auth: token});
    }

    $('.particle-function-panel').addClass('panel panel-default');
    init();
  }

  ParticleFunctionPanel.prototype = {
    constructor: ParticleFunctionPanel,
  }
  return ParticleFunctionPanel;
});
