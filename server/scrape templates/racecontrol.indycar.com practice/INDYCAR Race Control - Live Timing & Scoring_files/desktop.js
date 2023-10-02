require.config({
  baseUrl: "/scripts/indycar",
  waitSeconds: 1000,
  paths: {
      jquery: "//ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min",
    "jquery.mobile.events": "vendor/jquery.mobile.events",
    "slick": "//cdn.jsdelivr.net/jquery.slick/1.5.0/slick.min",
    "fastclick": "//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.6/fastclick.min",
    "svg4everybody": "vendor/svg4everybody.min",
    "onscreen": "vendor/on.screen.min",
    "modernizr": "https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min"
  },
  shim: {
    "jquery.mobile.events": {
      deps: ["jquery"]
    },
    "onscreen": {
      deps: ["jquery"]
    },
    "slick": {
      deps: ["jquery"]
    },
    "vendor/highcharts-custom": {
      deps: ["jquery"]
    },
    "vendor/jquery.sharrre.min": {
      deps: ["jquery"]
    }
  }
});

require(["base/init"]);
