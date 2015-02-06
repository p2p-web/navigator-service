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


(function() {
/*global DNSSD*/

var debug = 1 ? console.log.bind(console, '[service]') : function(){};
var service = {};

service.discover = function(name, callback) {
  DNSSD.addEventListener('discovered', (device) => {
    getOwnIp.then((ip) => {
      if (ip === device.address) { return; }
      var match = getMatchingService(name, device);
      if (match) callback(match);
    });
  });

  DNSSD.startDiscovery();
};

service.discover.stop = function() {
  DNSSD.stopDiscovery();
};

service.register = function(id) {
  var parts = ['_' + id, '_tcp', 'local'];
  getDeviceId().then(name => {
    parts.unshift(name);
    DNSSD.registerService(parts.join('.'));
  });
};

service.unregister = function(id) {
  DNSSD.unregisterService(id);
};

function getMatchingService(id, device) {
  for (var i = 0, l = device.services.length; i < l; i++) {
    var identifier = device.services[i];
    var parts = identifier.split('.');
    var deviceId = parts[0];
    var name = parts[1];
    var domain = parts[3];

    debug('check', name, '_' + id);

    if (name === '_' + id) {
      return {
        device: deviceId,
        name: name,
        domain: domain,
        address: device.address
      };
    }
  }
}

function getDeviceId() {
  return new Promise(resolve => {
    if (localStorage.deviceId) return resolve(localStorage.deviceId);
    if (!navigator.mozSettings) return resolve('unknown');

    navigator.mozSettings
      .createLock()
      .get('deviceinfo.hardware')
      .onsuccess = (e) => {
        var rand = Math.round(Math.random() * 100);
        var name = e.target.result['deviceinfo.hardware'];
        var id = name + '-' + rand;
        localStorage.deviceId = id;
        debug('got deviceinfo.hardware', id);
        resolve(id);
      };
  });
}

var getOwnIp = new Promise(resolve => {
  IPUtils.getAddresses(resolve);
});

// Bolt onto navigator
navigator.service = service;

})();

(function() {
/*global DNSSD*/

var debug = 1 ? console.log.bind(console, '[service]') : function(){};
var service = {};

service.discover = function(name, callback) {
  DNSSD.addEventListener('discovered', (device) => {
    getOwnIp.then((ip) => {
      if (ip === device.address) { return; }
      var match = getMatchingService(name, device);
      if (match) callback(match);
    });
  });

  DNSSD.startDiscovery();
};

service.discover.stop = function() {
  DNSSD.stopDiscovery();
};

service.register = function(id) {
  var parts = ['_' + id, '_tcp', 'local'];
  getDeviceId().then(name => {
    parts.unshift(name);
    DNSSD.registerService(parts.join('.'));
  });
};

service.unregister = function(id) {
  DNSSD.unregisterService(id);
};

function getMatchingService(id, device) {
  for (var i = 0, l = device.services.length; i < l; i++) {
    var identifier = device.services[i];
    var parts = identifier.split('.');
    var deviceId = parts[0];
    var name = parts[1];
    var domain = parts[3];

    debug('check', name, '_' + id);

    if (name === '_' + id) {
      return {
        device: deviceId,
        name: name,
        domain: domain,
        address: device.address
      };
    }
  }
}

function getDeviceId() {
  return new Promise(resolve => {
    if (localStorage.deviceId) return resolve(localStorage.deviceId);
    if (!navigator.mozSettings) return resolve('unknown');

    navigator.mozSettings
      .createLock()
      .get('deviceinfo.hardware')
      .onsuccess = (e) => {
        var rand = Math.round(Math.random() * 100);
        var name = e.target.result['deviceinfo.hardware'];
        var id = name + '-' + rand;
        localStorage.deviceId = id;
        debug('got deviceinfo.hardware', id);
        resolve(id);
      };
  });
}

var getOwnIp = new Promise(resolve => {
  IPUtils.getAddresses(resolve);
});

// Bolt onto navigator
navigator.service = service;

})();