(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', '@iosio/utils/rando'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('@iosio/utils/rando'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.rando);
        global.index = mod.exports;
    }
})(this, function (exports, _rando) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.tester = undefined;


    var log_this = '';
    var log = function log(it) {
        var val = void 0;
        if (typeof it !== 'string') {
            val = JSON.stringify(it, null, 4);
        } else {
            val = it;
        }
        log_this = '\n' + log_this + '\n' + val + '\n';
    };

    var tester = exports.tester = function tester() {
        return new Promise(function (resolve, reject) {
            console.log(log_this);

            console.log('working');

            console.log((0, _rando.getRandomName)());

            resolve();
        });
    };
});