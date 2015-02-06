(function() {
/*global DNSSD*/

var debug = 1 ? console.log.bind(console, '[service]') : function(){};
var service = {};

if (window.P2PENV !== 'desktop') {
  return;
}

service.discover = function(name, callback) {
  navigator.sd.registerListener('discovered', (device) => {
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
