"use strict";

exports.__esModule = true;
exports.Routing = exports.routingCapsule = exports.lazyLoader = exports.events = exports.Capsule = exports.CapsuleProvider = undefined;

var _CreateCapsule = require("./CreateCapsule");

var cap = (0, _CreateCapsule.CreateCapsule)();

var CapsuleProvider = exports.CapsuleProvider = cap.CapsuleProvider;
var Capsule = exports.Capsule = cap.Capsule;
var events = exports.events = cap.events;
var lazyLoader = exports.lazyLoader = cap.lazyLoader;
var routingCapsule = exports.routingCapsule = cap.routingCapsule;
var Routing = exports.Routing = cap.Routing;