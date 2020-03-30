/* jshint node: true */
'use strict';

var os = require('os');

var lib = {};

function parallel(tasks, done) {
    var results = [];
    var errs = [];
    var length = 0;
    var doneLength = 0;
    function doneIt(ix, err, result) {
        if (err) {
            errs[ix] = err;
        } else {
            results[ix] = result;
        }
        doneLength += 1;
        if (doneLength >= length) {
            done(errs.length > 0 ? errs : errs, results);
        }
    }
    Object.keys(tasks).forEach(function (key) {
        length += 1;
        var task = tasks[key];
        (process.nextTick || global.setImmediate || global.setTimeout)(function () {
            task(doneIt.bind(null, key), 1);
        });
    });
}

lib.networkInterfaces = function () {
    var allAddresses = {};

    try {
        var ifaces = os.networkInterfaces();
    } catch (e) {
      // At October 2016 WSL does not support os.networkInterfaces() and throws
      // Return empty object as if no interfaces were found
      // https://github.com/Microsoft/BashOnWindows/issues/468
        if (e.syscall === 'uv_interface_addresses') {
            return allAddresses;
        } else {
            throw e;
        };
    };

    Object.keys(ifaces).forEach(function (iface) {
        var addresses = {};
        var hasAddresses = false;
        ifaces[iface].forEach(function (address) {
            if (!address.internal) {
                addresses[(address.family || "").toLowerCase()] = address.address;
                hasAddresses = true;
                if (address.mac) {
                    addresses.mac = address.mac;
                }
            }
        });
        if (hasAddresses) {
            allAddresses[iface] = addresses;
        }
    });
    return allAddresses;
};

var _getMacAddress;
switch (os.platform()) {

    case 'win32':
        _getMacAddress = require('./lib/windows.js');
        break;

    case 'linux':
        _getMacAddress = require('./lib/linux.js');
        break;

    case 'darwin':
    case 'sunos':
    case 'freebsd':
        _getMacAddress = require('./lib/unix.js');
        break;

    default:
        console.warn("node-macaddress: Unknown os.platform(), defaulting to 'unix'.");
        _getMacAddress = require('./lib/unix.js');
        break;

}

lib.one = function (iface, callback) {
    if (typeof iface === 'function') {
        callback = iface;

        var ifaces = lib.networkInterfaces();
        var alleged = [ 'eth0', 'eth1', 'en0', 'en1' ];
        iface = Object.keys(ifaces)[0];
        for (var i = 0; i < alleged.length; i++) {
            if (ifaces[alleged[i]]) {
                iface = alleged[i];
                break;
            }
        }
        if (!ifaces[iface]) {
            if (typeof callback === 'function') {
                process.nextTick(function() {
                    callback(new Error("no interfaces found"), null);
                });
            }
            return null;
        }
        if (ifaces[iface].mac) {
            if (typeof callback === 'function') {
                process.nextTick(function() {
                    callback(null, ifaces[iface].mac);
                });
            }
            return ifaces[iface].mac;
        }
    }
    if (typeof callback === 'function') {
        _getMacAddress(iface, callback);
    }
    return null;
};

lib.all = function (callback) {

    var ifaces = lib.networkInterfaces();
    var resolve = {};

    Object.keys(ifaces).forEach(function (iface) {
        if (!ifaces[iface].mac) {
            resolve[iface] = _getMacAddress.bind(null, iface);
        }
    });

    if (Object.keys(resolve).length === 0) {
        if (typeof callback === 'function') {
            process.nextTick(function(){
                callback(null, ifaces);
            });
        }
        return ifaces;
    }

    parallel(resolve, function (err, result) {
        Object.keys(result).forEach(function (iface) {
            ifaces[iface].mac = result[iface];
        });
        if (typeof callback === 'function') {
            callback(null, ifaces);
        }
    });
    return null;
};

module.exports = lib;
