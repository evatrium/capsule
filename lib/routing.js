(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'react-router-dom', 'history', 'query-string', '@iosio/utils/lib/empty_checks', '@iosio/utils/lib/misc', './index'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('react-router-dom'), require('history'), require('query-string'), require('@iosio/utils/lib/empty_checks'), require('@iosio/utils/lib/misc'), require('./index'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.reactRouterDom, global.history, global.queryString, global.empty_checks, global.misc, global.index);
        global.routing = mod.exports;
    }
})(this, function (exports, _react, _reactRouterDom, _history, _queryString, _empty_checks, _misc, _index) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Redirect = exports.Switch = exports.Route = exports.routingLogic = exports.RouteFader = exports.Router = undefined;

    var _react2 = _interopRequireDefault(_react);

    var _queryString2 = _interopRequireDefault(_queryString);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _jsxFileName = 'src/routing.js';

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    function _possibleConstructorReturn(self, call) {
        if (!self) {
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }

        return call && (typeof call === "object" || typeof call === "function") ? call : self;
    }

    function _inherits(subClass, superClass) {
        if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
        }

        subClass.prototype = Object.create(superClass && superClass.prototype, {
            constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
    }

    /*
        can negate the need to use redux with routing
        if utilizing the same history object when pushing new paths or search params.
        so instead of using BrowserRouter, just use Router and provide the same history
     */
    var history = (0, _history.createBrowserHistory)();

    var routing = {
        reducer_name: 'routing',
        initial_state: {
            transitioning: false
        },
        logic_name: 'routing',
        logic: function logic(_ref) {
            var state = _ref.state,
                collective = _ref.collective;

            // console.log('collective logic in routing', Object.keys(collective()));
            var goTo = function goTo(path, search) {
                if (search && path) {
                    history.push({
                        search: _queryString2.default.stringify(search),
                        pathname: path

                    });
                } else if (path && !search) {
                    history.push({ pathname: path });
                } else if (search && !path) {
                    history.push({ search: _queryString2.default.stringify(search) });
                }
            };
            var getParams = function getParams(string) {
                if (!string) {
                    string = history.location.search;
                }
                var params = (0, _misc.deepClone)(_queryString2.default.parse(string)); //check and see if they fixed this
                return (0, _empty_checks.isEmpty)(params) ? false : params;
            };

            var transTo = function transTo(path, search) {
                var time = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 300;

                state.routing.set.transitioning(true);

                setTimeout(function () {
                    goTo(path, search);
                    state.routing.set.transitioning(false);
                }, time);
            };

            return {
                goTo: goTo,
                transTo: transTo,
                getParams: getParams,
                history: history
            };
        }
    };

    var routingLogic = (0, _index.Capsule)(routing)();

    // console.log('&&&&&&&&&&&&&&&& routingLogic', routingLogic)

    var router = function (_React$PureComponent) {
        _inherits(router, _React$PureComponent);

        function router() {
            _classCallCheck(this, router);

            return _possibleConstructorReturn(this, (router.__proto__ || Object.getPrototypeOf(router)).apply(this, arguments));
        }

        _createClass(router, [{
            key: 'render',
            value: function render() {
                return _react2.default.createElement(_reactRouterDom.Router, { history: this.props.logic.history, children: this.props.children, __source: {
                        fileName: _jsxFileName,
                        lineNumber: 71
                    },
                    __self: this
                });
            }
        }]);

        return router;
    }(_react2.default.PureComponent);

    var Router = (0, _index.Capsule)({ logic: function logic() {
            return { history: routingLogic.history };
        } })(router);

    var routeFader = function (_React$PureComponent2) {
        _inherits(routeFader, _React$PureComponent2);

        function routeFader() {
            _classCallCheck(this, routeFader);

            return _possibleConstructorReturn(this, (routeFader.__proto__ || Object.getPrototypeOf(routeFader)).apply(this, arguments));
        }

        _createClass(routeFader, [{
            key: 'render',
            value: function render() {
                var _props = this.props,
                    classes = _props.classes,
                    className = _props.className,
                    no_transition = _props.no_transition,
                    style = _props.style,
                    ms_delay = _props.ms_delay,
                    transitioning = _props.transitioning,
                    children = _props.children,
                    cx = _props.cx;

                return _react2.default.createElement(
                    'div',
                    {
                        className: cx(classes.root, transitioning && !no_transition ? null : classes.show, className),
                        style: Object.assign({}, style, {
                            transition: 'opacity ' + (ms_delay ? no_transition ? 0 : ms_delay : no_transition ? 0 : 300) + 'ms ease-in-out'
                        }), __source: {
                            fileName: _jsxFileName,
                            lineNumber: 82
                        },
                        __self: this
                    },
                    children
                );
            }
        }]);

        return routeFader;
    }(_react2.default.PureComponent);

    var RouteFader = (0, _index.Capsule)({
        styles: {
            root: {
                height: '100%',
                width: '100%',
                opacity: 0
            },
            show: {
                opacity: 1
            }
        },
        mapStateToProps: function mapStateToProps(state) {
            return {
                transitioning: state.routing.transitioning
            };
        }
    })(routeFader);

    exports.Router = Router;
    exports.RouteFader = RouteFader;
    exports.routingLogic = routingLogic;
    exports.Route = _reactRouterDom.Route;
    exports.Switch = _reactRouterDom.Switch;
    exports.Redirect = _reactRouterDom.Redirect;
});