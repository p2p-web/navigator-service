(function() {
/*global P2PENV*/

// Mobile User Agent: "Mozilla/5.0 (Mobile; rv:38.0) Gecko/38.0 Firefox/38.0"
// Desktop User Agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0"

var userAgent = navigator.userAgent;
var env = 'desktop';

if (userAgent.indexOf("Mobile") > -1) {
  env = 'mobile';
}

window.P2PENV = env;

});

