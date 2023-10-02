define(["jquery"], function($) {
  var Util;
  return Util = (function() {
    function Util(options) {
      this.options = options;
      this.isMobile();
    }

    Util.prototype.isMobile = function() {
      var $html;
      $html = $("html");
      if (/iPod|iPad|iPhone|Blackberry|Android|Windows Phone/i.test(navigator.userAgent)) {
        return $html.addClass("is-mobile");
      }
    };

    return Util;

  })();
});
