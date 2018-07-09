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
    exports.Redirect = exports.Switch = exports.Route = exports.RouteFader = exports.Router = exports.routingLogic = exports.history = undefined;

    var _react2 = _interopRequireDefault(_react);

    var _queryString2 = _interopRequireDefault(_queryString);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _jsxFileName = 'src/routing.js';


    /*
        can negate the need to use redux with routing
        by utilizing the same history object when pushing new paths or search params.
        so instead of using BrowserRouter,
        just use Router and provide it the same history you use to navigate with
     */
    var history = exports.history = (0, _history.createBrowserHistory)();

    var routingLogic = exports.routingLogic = (0, _index.Capsule)({
        reducer_name: 'routing',
        initial_state: { transitioning: false },
        logic_name: 'routing',
        logic: function logic(_ref) {
            var state = _ref.state;

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
            var getPathName = function getPathName() {
                return history.location.pathname;
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
                getPathName: getPathName,
                history: history
            };
        }
    })();

    var Router = exports.Router = function Router(props) {
        return _react2.default.createElement(_reactRouterDom.Router, { history: history, children: props.children, __source: {
                fileName: _jsxFileName,
                lineNumber: 61
            },
            __self: undefined
        });
    };

    var routeFader = function routeFader(props) {
        var className = props.className,
            no_transition = props.no_transition,
            style = props.style,
            ms_delay = props.ms_delay,
            transitioning = props.transitioning,
            children = props.children;

        return _react2.default.createElement(
            'div',
            { className: className,
                style: Object.assign({}, style, {
                    height: '100%',
                    width: '100%',
                    opacity: transitioning && !no_transition ? 0 : 1,
                    transition: 'opacity ' + (ms_delay || ms_delay === 0 ? no_transition ? 0 : ms_delay : no_transition ? 0 : 300) + 'ms ease-in-out'
                }), __source: {
                    fileName: _jsxFileName,
                    lineNumber: 66
                },
                __self: undefined
            },
            children
        );
    };

    var RouteFader = exports.RouteFader = (0, _index.Capsule)({
        mapStateToProps: function mapStateToProps(state) {
            return {
                transitioning: state.routing.transitioning
            };
        }
    })(routeFader);

    exports.Route = _reactRouterDom.Route;
    exports.Switch = _reactRouterDom.Switch;
    exports.Redirect = _reactRouterDom.Redirect;
});