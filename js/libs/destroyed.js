define('destroyed',
  ['jquery'],
  function($) {
    (
      function($) {
        $.event.special.destroyed = {
          remove: function(o) {
            if (o.handler) {
              o.handler()
            }
          }
        }
      }
    )(jQuery);
  }
);
