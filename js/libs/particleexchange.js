define('particleexchange',
  ['jquery', 'particle'],
  function($, Particle) {


  ParticleExchange = function() {
    if (ParticleExchange.instance) {
      return ParticleExchange.instance;
    }
    ParticleExchange.instance = this;

    var token = null;
    var particle = new Particle();
    var callList = Array();

    function equals(a, b) {
        function check(a, b) {
            for (var attr in a) {
                if (a.hasOwnProperty(attr) && b.hasOwnProperty(attr)) {
                    if (a[attr] != b[attr]) {
                        switch (a[attr].constructor) {
                            case Object:
                                return equals(a[attr], b[attr]);
                            case Function:
                                if (a[attr].toString() != b[attr].toString()) {
                                    return false;
                                }
                                break;
                            default:
                                return false;
                        }
                    }
                } else {
                    return false;
                }
            }
            return true;
        };
        return check(a, b) && check(b, a);
    };

    function init() {
    }

    function addCall(call, params) {
      callList.push(json);
    }

    function callExists(call, params) {
      json = { call : call, params : params };
      for (key in callList) {
        if (equals(callList[key], json)) {
          return true;
        }
      }
      return false;
    }

    function removeCall(call, params) {
      json = { call : call, params : params };
      for (key in callList) {
        if (equals(callList[key], json)) {
          callList.splice(key, 1);
          return true;
        }
      }
      return false;
    }

    function dispatch(call, params, data, error) {
      var eventname = "particleexchange." + call + (data ? ".data" : ".error");
      $(document).trigger(eventname, { params : params, body : data.body, error: error });
    }

    function callWrap(call, params) {
      if (callExists(call, params)) {
        return false;
      }
      addCall(call, params);
      var promise = particle[call](params);
      promise.then(
        function(data) {
          dispatch(call, params, data, null);
          removeCall(call, params);
        },
        function(error) {
          dispatch(call, params, null, data);
          removeCall(call, params);
        }
      )
    }

    this.getEventStream = function(params) {
      if (callExists("getEventStream", params)) {
        return false;
      }
      addCall("getEventStream", params);
      var promise = particle.getEventStream(params);
      promise.then(
        function(stream) {
          stream.on('event', function(data) {
            $(document).trigger("particleexchange.getEventStream.event", { params : params, body : data, error: null });
          });
        }
      )
    }

    this.getDevice = function(params) {
      callWrap("getDevice", params);
    }

    this.getVariable = function(params) {
      callWrap("getVariable", params);
    }

    this.callFunction = function(params) {
      callWrap("callFunction", params);
    }

    this.publishEvent = function(params) {
      callWrap("publishEvent", params);
    }

    init.apply(this);
  }

  ParticleExchange.prototype = {
    constructor: ParticleExchange,
  }
  return ParticleExchange;
});
