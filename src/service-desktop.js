(function() {
/*global DNSSD*/

var debug = 1 ? console.log.bind(console, '[service]') : function(){};
var service = {};

if (window.P2PENV !== 'desktop') {
  return;
}

service.discover = function(name, callback) {
  navigator.sd.registerListener('discovered', (service) => {
    var service = service.split(':');
    service = {
      device: service[1],
      name: service[0],
      address: service[2]
    };
    getOwnIp.then((ip) => {
      if (ip === service.address) { return; }
      //var match = getMatchingService(name, device);
      //if (match) callback(match);
      callback(service);
    });
  });

  navigator.sd.startDiscovery('_http._tcp.local');
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
  for (var i = 0; i < device.services.length; i++) {
    return device.services[i];
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
