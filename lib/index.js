(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', './redux-assist', '@iosio/components/lib/Jss'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('./redux-assist'), require('@iosio/components/lib/Jss'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.reduxAssist, global.Jss);
        global.index = mod.exports;
    }
})(this, function (exports, _react, _reduxAssist, _Jss) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Capsule = exports.CapsuleProvider = exports.CapsuleModule = undefined;

    var _react2 = _interopRequireDefault(_react);

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

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var CapsuleModule = exports.CapsuleModule = function CapsuleModule() {
        var _this2 = this;

        _classCallCheck(this, CapsuleModule);

        var _ref = new _reduxAssist.StoreModule(),
            reduxAssist = _ref.reduxAssist,
            store = _ref.store,
            connect = _ref.connect,
            Provider = _ref.Provider;

        var _provide_to_props = {};
        var collective_logic = {};
        var state = {};

        var CapsuleProvider = function CapsuleProvider(config) {
            //provide_to_props, provide_to_logic, theme, global_styles
            if (config && config.provide_to_props) {
                _provide_to_props = config.provide_to_props;
            }

            if (config && config.provide_to_logic) {
                collective_logic = Object.assign({}, collective_logic, config.provide_to_logic);
            }

            return function (App) {
                if (!App) {
                    return null;
                }
                return function (_React$Component) {
                    _inherits(CapsuleProvided, _React$Component);

                    function CapsuleProvided() {
                        _classCallCheck(this, CapsuleProvided);

                        return _possibleConstructorReturn(this, (CapsuleProvided.__proto__ || Object.getPrototypeOf(CapsuleProvided)).apply(this, arguments));
                    }

                    _createClass(CapsuleProvided, [{
                        key: 'render',
                        value: function render() {
                            return _react2.default.createElement(
                                Provider,
                                {
                                    __source: {
                                        fileName: _jsxFileName,
                                        lineNumber: 30
                                    },
                                    __self: this
                                },
                                _react2.default.createElement(
                                    _Jss.Jss,
                                    {
                                        theme: config && config.theme ? config.theme : {},
                                        global_styles: config && config.global_styles ? config.global_styles : function () {
                                            return {};
                                        }, __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 31
                                        },
                                        __self: this
                                    },
                                    _react2.default.createElement(App, Object.assign({}, this.props, _provide_to_props, {
                                        __source: {
                                            fileName: _jsxFileName,
                                            lineNumber: 38
                                        },
                                        __self: this
                                    }))
                                )
                            );
                        }
                    }]);

                    return CapsuleProvided;
                }(_react2.default.Component);
            };
        };

        var Capsule = function Capsule(_ref2) {
            var styles = _ref2.styles,
                reducer_name = _ref2.reducer_name,
                initial_state = _ref2.initial_state,
                mapStateToProps = _ref2.mapStateToProps,
                logic_name = _ref2.logic_name,
                logic = _ref2.logic,
                mapLogicToProps = _ref2.mapLogicToProps;


            if (reducer_name && initial_state) {
                state = reduxAssist(reducer_name, initial_state);
            }

            var return_logic = void 0;

            if (logic) {
                return_logic = logic({
                    state: state,
                    store: store,
                    collective: function collective() {
                        return Object.assign({}, collective_logic);
                    }
                });
            }

            if (logic_name && return_logic) {
                collective_logic = Object.assign({}, collective_logic, _defineProperty({}, logic_name, return_logic));
            }

            return function (Component) {

                var logic_props = {};
                if (mapLogicToProps) {
                    logic_props = mapLogicToProps(collective_logic);
                }

                if (Component && styles) {
                    Component = (0, _Jss.withStyles)(styles)(Component);
                }

                if (Component) {

                    var WithCapsule = function WithCapsule(props) {
                        return _react2.default.createElement(Component, Object.assign({}, props, logic_props, _provide_to_props, {
                            __source: {
                                fileName: _jsxFileName,
                                lineNumber: 91
                            },
                            __self: _this2
                        }));
                    };

                    if (mapStateToProps) {
                        return connect(mapStateToProps, null)(WithCapsule);
                    } else {
                        return WithCapsule;
                    }
                } else {
                    return return_logic;
                }
            };
        };

        return { CapsuleProvider: CapsuleProvider, Capsule: Capsule };
    };

    var _ref3 = new CapsuleModule();

    var CapsuleProvider = _ref3.CapsuleProvider,
        Capsule = _ref3.Capsule;
    exports.CapsuleProvider = CapsuleProvider;
    exports.Capsule = Capsule;
});