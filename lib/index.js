(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', './redux-assist', './MainComponent', 'react-redux', 'react-jss', '@iosio/components/lib/asyncComponent'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('./redux-assist'), require('./MainComponent'), require('react-redux'), require('react-jss'), require('@iosio/components/lib/asyncComponent'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.reduxAssist, global.MainComponent, global.reactRedux, global.reactJss, global.asyncComponent);
        global.index = mod.exports;
    }
})(this, function (exports, _react, _reduxAssist, _MainComponent, _reactRedux, _reactJss, _asyncComponent) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Capsule = exports.CapsuleProvider = undefined;

    var _react2 = _interopRequireDefault(_react);

    var _reactJss2 = _interopRequireDefault(_reactJss);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _defineProperty(obj, key, value) {
        if (key in obj) {
            Object.defineProperty(obj, key, {
                value: value,
                enumerable: true,
                configurable: true,
                writable: true
            });
        } else {
            obj[key] = value;
        }

        return obj;
    }

    var _jsxFileName = 'src/index.js';

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

    var _ref = new _reduxAssist.StoreModule(),
        reduxAssist = _ref.reduxAssist,
        store = _ref.store;

    var _provide_to_props = {};
    var _provide_to_logic = {};
    var collective_logic = {};

    var CapsuleProvider = exports.CapsuleProvider = function CapsuleProvider(_ref2) {
        var provide_to_logic = _ref2.provide_to_logic,
            provide_to_props = _ref2.provide_to_props,
            theme = _ref2.theme,
            global_styles = _ref2.global_styles,
            loadApp = _ref2.loadApp,
            loadingComponent = _ref2.loadingComponent;


        var AppComponent = (0, _asyncComponent.asyncComponent)(loadApp, loadingComponent);
        _provide_to_props = provide_to_props;
        _provide_to_logic = provide_to_logic;
        // console.log('returning Provider _provide_to_props: ', _provide_to_props, ' _provide_to_logic: ', _provide_to_logic)
        return function (_React$PureComponent) {
            _inherits(WithProvider, _React$PureComponent);

            function WithProvider(props) {
                _classCallCheck(this, WithProvider);

                return _possibleConstructorReturn(this, (WithProvider.__proto__ || Object.getPrototypeOf(WithProvider)).call(this, props));
                // console.log('provider being constructed')
            }

            _createClass(WithProvider, [{
                key: 'render',
                value: function render() {
                    var props = this.props;
                    return _react2.default.createElement(
                        _MainComponent.MainComponent,
                        Object.assign({}, props, { theme: theme, global_styles: global_styles, store: store, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 31
                            },
                            __self: this
                        }),
                        _react2.default.createElement(AppComponent, Object.assign({}, props, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 32
                            },
                            __self: this
                        }))
                    );
                }
            }]);

            return WithProvider;
        }(_react2.default.PureComponent);
    };

    var Capsule = exports.Capsule = function Capsule(_ref3) {
        var styles = _ref3.styles,
            reducer_name = _ref3.reducer_name,
            logic_name = _ref3.logic_name,
            initial_state = _ref3.initial_state,
            logic = _ref3.logic,
            mapStateToProps = _ref3.mapStateToProps;


        var state = reducer_name && initial_state ? reduxAssist(reducer_name, initial_state) : null;

        var return_logic = logic && logic(Object.assign({ state: state, store: store }, _provide_to_logic, { collective: function collective() {
                return collective_logic;
            } }));

        if (logic_name) {
            collective_logic = Object.assign({}, collective_logic, _defineProperty({}, logic_name, return_logic));
        }

        // console.log(Object.keys(collective_logic));


        return function (Component) {

            if (Component && styles) {
                //wrap the component with jss styles
                Component = (0, _reactJss2.default)(styles)(Component);
            }
            if (Component) {
                var WithCapsule = function (_React$Component) {
                    _inherits(WithCapsule, _React$Component);

                    function WithCapsule() {
                        _classCallCheck(this, WithCapsule);

                        return _possibleConstructorReturn(this, (WithCapsule.__proto__ || Object.getPrototypeOf(WithCapsule)).call(this));
                        // console.log('capsule being constructed')
                    }

                    _createClass(WithCapsule, [{
                        key: 'render',
                        value: function render() {
                            var props = this.props;
                            return (
                                //pass the logic and any other provided props
                                _react2.default.createElement(Component, Object.assign({}, props, {
                                    logic: return_logic
                                }, _provide_to_props, {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 74
                                    },
                                    __self: this
                                }))
                            );
                        }
                    }]);

                    return WithCapsule;
                }(_react2.default.Component);

                // mapStateToProps


                return (0, _reactRedux.connect)(mapStateToProps, null)(WithCapsule);
            } else {
                return return_logic;
            }
        };
    };
});