(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports', 'redux-dynamic-reducer', 'redux'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require('redux-dynamic-reducer'), require('redux'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.reduxDynamicReducer, global.redux);
        global.reduxAssist = mod.exports;
    }
})(this, function (exports, _reduxDynamicReducer, _redux) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.StoreModule = exports.storeCreator = exports.createReducer = exports.createHandlers = exports.addStateControllers = exports.applyGetState = exports.createGetState = exports.applyUpdaterHandler = exports.createUpdaterHandler = exports.applyUpdater = exports.createUpdater = exports.createUpdaterActionName = exports.applyGetters = exports.createGetter = exports.applySetterHandlers = exports.applySetters = exports.createSetHandler = exports.createSetter = exports.createSetActionName = undefined;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
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
        --------------------- SETTERS ---------------------
     */

    /**
     * creates the action name for set
     * @param {String} reducer_name - name of reducer
     * @param {String} key - key of the state object
     * @returns {string} - returns the build string name
     */
    var createSetActionName = exports.createSetActionName = function createSetActionName(reducer_name, key) {
        return '@app/@' + reducer_name + '/set_' + key;
    };

    /**
     * creates a setter function for setting a key value on the state
     * @param {Object} store - redux store
     * @param {String} reducer_name - name of reducer
     * @param {String} key - state key to set the value on
     * @returns {function(*): *} - function to be set as a state controller
     */
    var createSetter = exports.createSetter = function createSetter(store, reducer_name, key) {
        return function (payload) {
            return store.dispatch({ type: createSetActionName(reducer_name, key), payload: payload });
        };
    };

    /**
     * creates a handler function for the key value setting on the reducer
     * @param {String} key - the key name on the state to set
     * @returns {function(*, *): {}}
     */
    var createSetHandler = exports.createSetHandler = function createSetHandler(key) {
        return function (state, action) {
            return Object.assign({}, state, _defineProperty({}, key, action.payload));
        };
    };

    /**
     * applies the setters to the state controller object
     * @param {Object} store - redux store
     * @param {Object} initial_state - key values for state
     * @param {Object} state - state controller functions
     * @param {String} reducer_name - name to access controller
     * @returns {undefined} - returns nothing
     */
    var applySetters = exports.applySetters = function applySetters(store, initial_state, state, reducer_name) {
        state[reducer_name].set = {};
        Object.keys(initial_state).forEach(function (key) {
            state[reducer_name].set[key] = createSetter(store, reducer_name, key);
        });
        return state;
    };

    /**
     * for every key on the initial state, create a setter and handler
     * @param {String} reducer_name - name of reducer
     * @param {Object} initial_state - key values for state
     * @param {Object} handlers - object of functions to be utilized inside of a reducer
     * @returns {Object} - the updated handlers object
     */
    var applySetterHandlers = exports.applySetterHandlers = function applySetterHandlers(reducer_name, initial_state, handlers) {
        var new_handlers = {};
        Object.keys(initial_state).forEach(function (key) {
            new_handlers[createSetActionName(reducer_name, key)] = createSetHandler(key);
        });
        return Object.assign({}, handlers, new_handlers);
    };

    /*
        -------------- GETTERS ----------------------
     */

    /**
     * create a getter function for the key value on the state object
     * @param {Object} store - redux store
     * @param {String} reducer_name - name of reducer
     * @param {String} key - state key to get the value on
     * @returns {function(): *} - function to be set as a state controller
     */
    var createGetter = exports.createGetter = function createGetter(store, reducer_name, key) {
        return function () {
            return store.getState()[reducer_name][key];
        };
    };

    /**
     * applies getter functions to state controller object
     * @param {Object} store - redux store
     * @param {Object} initial_state - key values for state
     * @param {Object} state - state controller functions
     * @param {String} reducer_name - name to access controller
     * @returns {Object} - state controller object
     */
    var applyGetters = exports.applyGetters = function applyGetters(store, initial_state, state, reducer_name) {
        state[reducer_name].get = {};
        Object.keys(initial_state).forEach(function (key) {
            state[reducer_name].get[key] = createGetter(store, reducer_name, key);
        });
        return state;
    };

    /*
        --------------- UPDATER --------------------
     */

    /**
     * creates the action name for update
     * @param {String} reducer_name - name of reducer
     * @returns {string} - returns the build string name
     */
    var createUpdaterActionName = exports.createUpdaterActionName = function createUpdaterActionName(reducer_name) {
        return '@app/@' + reducer_name + '/update';
    };

    /**
     * creates the updater function to be set on the state controller object
     * @param {Object} store - redux store
     * @param {String} reducer_name - name to access controller
     * @returns {Function} - function to be added to the handler
     */
    var createUpdater = exports.createUpdater = function createUpdater(store, reducer_name) {
        return function (cb) {
            if (!cb) {
                console.error('state.' + reducer_name + '.update requires a callback function');
                return;
            }
            var new_state = cb(store.getState()[reducer_name]);
            store.dispatch({ type: createUpdaterActionName(reducer_name), new_state: new_state });
        };
    };
    /**
     * applies an updater function to the state controller object
     * @param {Object} store - redux store
     * @param {Object} state - state controller functions
     * @param {String} reducer_name - name to access controller
     * @returns {Object} - state controller object
     */
    var applyUpdater = exports.applyUpdater = function applyUpdater(store, state, reducer_name) {
        state[reducer_name].update = createUpdater(store, reducer_name);
        return state;
    };
    /**
     * creates a function to update the state in the reducer
     * @returns {function(*, *): {}} - returns a function
     */
    var createUpdaterHandler = exports.createUpdaterHandler = function createUpdaterHandler() {
        return function (state, action) {
            return Object.assign({}, action.new_state);
        };
    };

    /**
     * for every key on the initial state, create a handler
     * @param {String} reducer_name - name of reducer
     * @param {Object} handlers - object of functions to be utilized inside of a reducer
     * @returns {Object} - the updated handlers object
     */
    var applyUpdaterHandler = exports.applyUpdaterHandler = function applyUpdaterHandler(reducer_name, handlers) {
        var new_handlers = {};
        new_handlers[createUpdaterActionName(reducer_name)] = createUpdaterHandler();
        return Object.assign({}, handlers, new_handlers);
    };

    /*
        -------------- GET STATE ----------------------
     */

    /**
     * creates a function for retrieving the state on a key of the store
     * @param {Object} store - redux store
     * @param {String} reducer_name - name of reducer
     * @returns {function(): *} - function to set
     */
    var createGetState = exports.createGetState = function createGetState(store, reducer_name) {
        return function () {
            return store.getState()[reducer_name];
        };
    };
    /**
     * applies the get state to the state controller object
     * @param {Object} store - redux store
     * @param {Object} state - state controller functions
     * @param {String} reducer_name - name of reducer
     * @returns {Object} - state controller object
     */
    var applyGetState = exports.applyGetState = function applyGetState(store, state, reducer_name) {
        state[reducer_name].getState = createGetState(store, reducer_name);
        return state;
    };

    /*
        ------------ FINAL COMBINERS & CREATE REDUCER -----------------
     */

    /**
     * adds functions to state controller object
     * @param {String} reducer_name - name to access controller
     * @param {Object} initial_state - key values for state
     * @param {Object} store - redux store
     * @param {Object} state - state controller functions
     * @returns {Object|*} - state controller functions object
     */
    var addStateControllers = exports.addStateControllers = function addStateControllers(reducer_name, initial_state, store, state) {
        state[reducer_name] = {};
        state = applySetters(store, initial_state, state, reducer_name);
        state = applyGetters(store, initial_state, state, reducer_name);
        state = applyUpdater(store, state, reducer_name);
        state = applyGetState(store, state, reducer_name);
        return state;
    };
    /**
     *  creates action handlers for the reducer
     * @param {String} reducer_name - name to access controller
     * @param {Object} initial_state - key values for state
     * @returns {Object} - action handler object
     */
    var createHandlers = exports.createHandlers = function createHandlers(reducer_name, initial_state) {
        var handlers = {};
        handlers = applySetterHandlers(reducer_name, initial_state, handlers);
        handlers = applyUpdaterHandler(reducer_name, handlers);
        return handlers;
    };

    /**
     *  creates a reducer function
     * @param {Object} initial_state - key values for state
     * @param {Object} handlers - action handler object
     * @returns {Function} - reducer function
     */
    var createReducer = exports.createReducer = function createReducer(initial_state, handlers) {
        return function () {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initial_state;
            var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            if (handlers.hasOwnProperty(action.type)) {
                return handlers[action.type](state, action);
            } else {
                return state;
            }
        };
    };

    /*
        ---------- STORE MODULE & REDUX ASSIST------------
     */

    /**
     * creates the store with all the defaults and options
     * @param {Object} initial_reducers_object - object of initial reducer functions - automatically combines*
     * @param {Object} initial_state - initial global state
     * @param {Array} middleware_array - array of middleware functions to apply
     * @returns {Store<{dispatch: any}>} - returns the store object
     */
    var storeCreator = exports.storeCreator = function storeCreator() {
        var initial_reducers_object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var initial_state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var middleware_array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        var DEFAULT_REDUCER = function DEFAULT_REDUCER() {
            var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            return state;
        };
        var rootReducer = (0, _redux.combineReducers)(Object.assign({ DEFAULT_REDUCER: DEFAULT_REDUCER }, initial_reducers_object));
        return (0, _reduxDynamicReducer.createStore)(rootReducer, initial_state, _redux.applyMiddleware.apply(undefined, _toConsumableArray(middleware_array)));
    };

    /**
     *  for use with Capsule
     */

    var StoreModule = exports.StoreModule = function StoreModule() {
        var initial_reducers_object = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var initial_state = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var middleware_array = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

        _classCallCheck(this, StoreModule);

        _initialiseProps.call(this);

        this.store = storeCreator(initial_reducers_object, initial_state, middleware_array);
        this.state = {};
    };

    var _initialiseProps = function _initialiseProps() {
        var _this = this;

        this.reduxAssist = function (reducer_name, initial_state) {
            _this.state = addStateControllers(reducer_name, initial_state, _this.store, _this.state);
            var handlers = createHandlers(reducer_name, initial_state);
            var reducer = createReducer(initial_state, handlers);
            _this.store.attachReducers(_defineProperty({}, reducer_name, reducer));
            return _this.state;
        };
    };
});