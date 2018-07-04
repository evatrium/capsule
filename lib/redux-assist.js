(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'redux-dynamic-reducer', 'redux', 'redux-dynamic-middlewares'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('redux-dynamic-reducer'), require('redux'), require('redux-dynamic-middlewares'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.reduxDynamicReducer, global.redux, global.reduxDynamicMiddlewares);
        global.reduxAssist = mod.exports;
    }
})(this, function (exports, _reduxDynamicReducer, _redux, _reduxDynamicMiddlewares) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StoreModule = exports.reduxAssist = undefined;

    var _reduxDynamicMiddlewares2 = _interopRequireDefault(_reduxDynamicMiddlewares);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
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

    /*
    import {composeWithDevTools} from 'redux-devtools-extension';
    in order to use redux dev tools, will need to configure it similarly to the following link
    https://github.com/ioof-holdings/redux-dynamic-reducer/blob/master/examples/real-world/src/root/store/configureStore.dev.js#L10
    */
    //Greatly reduces the amount of boilerplate code needed to set up redux
    /**
     * REDUX ASSIST
     * Used in conjunction with the StoreModule
     * The goal of redux-assist is to greatly reduce the amount of boilerplate code needed to set-up redux.
     * ...by a lot... ;)
     * It is opinionated and may not meet every use case, however, it works perfectly for what I need
     * and saves having to write hundreds of lines of code.
     *
     * @param {String} reducer_name - what you want to call the reducer and name you will access the functions by
     * @param {Object} state_initial - redux-assist uses this to build actions, creators and dispatchers for you
     * @param {Object} store - a store object created by createStore() (provided by redux-dynamic-reducer)
     * @returns {{state: {function}, reducer: function}} -
     * - state: object containing functions used to manipulate the state
     * - reducer: a single reducer function (state,action)=>state
     */
    var reduxAssist = exports.reduxAssist = function reduxAssist(reducer_name, state_initial, store, state) {

        // const state = {}; // this object will contain the functions used to manipulate the store

        state[reducer_name] = {}; //ex: state.user

        state[reducer_name].set = {}; // keys of the initial state will be set here

        state[reducer_name].get = {};

        var handlers = {}; // this will house functions similar to the switch statements in the reducer

        //for each key in the initial state, provide a "set" function to update the single value
        var keys = Object.keys(state_initial);

        keys.forEach(function (key) {

            var ACTION = '@app/@' + reducer_name + '/set_' + key; // action type
            //user will execute: state.user.set.logged_in(true)
            state[reducer_name].set[key] = function (payload) {
                return store.dispatch({ type: ACTION, payload: payload });
            };
            state[reducer_name].get[key] = function () {
                return store.getState()[reducer_name][key];
            };
            //instead of a switch statement, the reducer will switch on handlers[action.type]
            //and they key on the store will be updated with the payload that is dispatched
            handlers[ACTION] = function (state, action) {
                return Object.assign({}, state, _defineProperty({}, key, action.payload));
            };
        });

        var UPDATE_ACTION = '@app/@' + reducer_name + '/update';
        //state.user.update returns the entire state object in a callback
        //so that the user can update the entire state or select properties and apply them using the spread operator
        state[reducer_name].update = function (cb) {

            if (!cb) {
                console.error('state.' + reducer_name + '.update requires a callback function');
                return;
            }
            var new_state = cb(store.getState()[reducer_name]);
            store.dispatch({ type: UPDATE_ACTION, new_state: new_state });
        };

        handlers[UPDATE_ACTION] = function (state, action) {
            return Object.assign({}, action.new_state);
        };

        state[reducer_name].getState = function () {
            return store.getState()[reducer_name];
        };

        //creater a reducer that switches on the handlers object
        var createReducer = function createReducer(initialState, handlers) {
            return function () {
                var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
                var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                if (handlers.hasOwnProperty(action.type)) {
                    return handlers[action.type](state, action);
                } else {
                    return state;
                }
            };
        };
        var reducer = createReducer(state_initial, handlers);

        return { state: state, reducer: reducer };
    };

    /**
     * creates the initial store and provides reduxAssist to create reducers that
     * dynamically attach to the global store
     */

    var StoreModule = exports.StoreModule = function StoreModule() {
        var _this = this;

        _classCallCheck(this, StoreModule);

        this.reduxAssist = function (reducer_name, state_initial) {
            var _reduxAssist = reduxAssist(reducer_name, state_initial, _this.store, _this.state),
                state = _reduxAssist.state,
                reducer = _reduxAssist.reducer;

            _this.store.attachReducers(_defineProperty({}, reducer_name, reducer));
            return state;
        };

        var DEFAULT_REDUCER = function DEFAULT_REDUCER() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return state;
        };
        var rootReducer = (0, _redux.combineReducers)({ DEFAULT_REDUCER: DEFAULT_REDUCER });

        this.store = (0, _reduxDynamicReducer.createStore)(rootReducer, (0, _redux.applyMiddleware)(
        // ... other static middlewares
        _reduxDynamicMiddlewares2.default));

        var logger = function logger(store) {
            return function (next) {
                return function (action) {
                    // console.log('dispatching', action)
                    var result = next(action);
                    // console.log('next state', store.getState())
                    return result;
                };
            };
        };

        (0, _reduxDynamicMiddlewares.addMiddleware)(logger);

        this.attachReducers = function (reducer) {
            return _this.store.attachReducers(reducer);
        };

        this.state = {};
        this.state.getState = function () {
            return _this.store.getState();
        };
    };
});