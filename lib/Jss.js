(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'react', 'react-jss', 'jss-preset-default', 'jss', 'react-jss/lib/JssProvider'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('react'), require('react-jss'), require('jss-preset-default'), require('jss'), require('react-jss/lib/JssProvider'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.react, global.reactJss, global.jssPresetDefault, global.jss, global.JssProvider);
        global.Jss = mod.exports;
    }
})(this, function (exports, _react, _reactJss, _jssPresetDefault, _jss, _JssProvider) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Jss = undefined;

    var _react2 = _interopRequireDefault(_react);

    var _reactJss2 = _interopRequireDefault(_reactJss);

    var _jssPresetDefault2 = _interopRequireDefault(_jssPresetDefault);

    var _JssProvider2 = _interopRequireDefault(_JssProvider);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _jsxFileName = 'src/Jss.js';

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

    var jss = (0, _jss.create)((0, _jssPresetDefault2.default)());

    var Jss = exports.Jss = function (_React$PureComponent) {
        _inherits(Jss, _React$PureComponent);

        function Jss() {
            _classCallCheck(this, Jss);

            return _possibleConstructorReturn(this, (Jss.__proto__ || Object.getPrototypeOf(Jss)).apply(this, arguments));
        }

        _createClass(Jss, [{
            key: 'render',
            value: function render() {
                var _props = this.props,
                    children = _props.children,
                    global_styles = _props.global_styles,
                    theme = _props.theme;

                var GlobalStylesWrapper = function GlobalStylesWrapper(props) {
                    return props.children;
                };
                var gs = global_styles ? global_styles : function () {
                    return {};
                };
                GlobalStylesWrapper = (0, _reactJss2.default)(global_styles)(GlobalStylesWrapper);
                return _react2.default.createElement(
                    _JssProvider2.default,
                    { jss: jss, __source: {
                            fileName: _jsxFileName,
                            lineNumber: 23
                        },
                        __self: this
                    },
                    _react2.default.createElement(
                        _reactJss.ThemeProvider,
                        { theme: theme ? theme : {}, __source: {
                                fileName: _jsxFileName,
                                lineNumber: 24
                            },
                            __self: this
                        },
                        _react2.default.createElement(
                            GlobalStylesWrapper,
                            {
                                __source: {
                                    fileName: _jsxFileName,
                                    lineNumber: 25
                                },
                                __self: this
                            },
                            children
                        )
                    )
                );
            }
        }]);

        return Jss;
    }(_react2.default.PureComponent);
});