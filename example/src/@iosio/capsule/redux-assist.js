import {createStore} from 'redux-dynamic-reducer';
import {applyMiddleware, combineReducers} from 'redux';

/*
    --------------------- SETTERS ---------------------
 */

/**
 * creates the action name for set
 * @param {String} reducer_name - name of reducer
 * @param {String} key - key of the state object
 * @returns {string} - returns the build string name
 */
export const createSetActionName = (reducer_name, key) => `@app/@${reducer_name}/set_${key}`;

/**
 * creates a setter function for setting a key value on the state
 * @param {Object} store - redux store
 * @param {String} reducer_name - name of reducer
 * @param {String} key - state key to set the value on
 * @returns {function(*): *} - function to be set as a state controller
 */
export const createSetter = (store, reducer_name, key) => {
    return (payload) => (store.dispatch({type: createSetActionName(reducer_name, key), payload}));
};


/**
 * creates a handler function for the key value setting on the reducer
 * @param {String} key - the key name on the state to set
 * @returns {function(*, *): {}}
 */
export const createSetHandler = (key) => {
    return (state, action) => ({...state, [key]: action.payload});
};

/**
 * applies the setters to the state controller object
 * @param {Object} store - redux store
 * @param {Object} initial_state - key values for state
 * @param {Object} state - state controller functions
 * @param {String} reducer_name - name to access controller
 * @returns {undefined} - returns nothing
 */
export const applySetters = (store, initial_state, state, reducer_name) => {
    state[reducer_name].set = {};
    Object.keys(initial_state).forEach((key) => {
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
export const applySetterHandlers = (reducer_name, initial_state, handlers) => {
    const new_handlers = {};
    Object.keys(initial_state).forEach((key) => {
        new_handlers[createSetActionName(reducer_name, key)] = createSetHandler(key);
    });
    return {...handlers, ...new_handlers}
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
export const createGetter = (store, reducer_name, key) => {
    return () => store.getState()[reducer_name][key];
};

/**
 * applies getter functions to state controller object
 * @param {Object} store - redux store
 * @param {Object} initial_state - key values for state
 * @param {Object} state - state controller functions
 * @param {String} reducer_name - name to access controller
 * @returns {Object} - state controller object
 */
export const applyGetters = (store, initial_state, state, reducer_name) => {
    state[reducer_name].get = {};
    Object.keys(initial_state).forEach((key) => {
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
export const createUpdaterActionName = (reducer_name) => `@app/@${reducer_name}/update`;


/**
 * creates the updater function to be set on the state controller object
 * @param {Object} store - redux store
 * @param {String} reducer_name - name to access controller
 * @returns {Function} - function to be added to the handler
 */
export const createUpdater = (store, reducer_name) => {
    return (cb) => {
        if (!cb) {
            console.error(`state.${reducer_name}.update requires a callback function`);
            return;
        }
        let new_state = cb(store.getState()[reducer_name]);
        store.dispatch({type: createUpdaterActionName(reducer_name), new_state});
    }
};
/**
 * applies an updater function to the state controller object
 * @param {Object} store - redux store
 * @param {Object} state - state controller functions
 * @param {String} reducer_name - name to access controller
 * @returns {Object} - state controller object
 */
export const applyUpdater = (store, state, reducer_name) => {
    state[reducer_name].update = createUpdater(store, reducer_name);
    return state;
};
/**
 * creates a function to update the state in the reducer
 * @returns {function(*, *): {}} - returns a function
 */
export const createUpdaterHandler = () => (state, action) => ({...action.new_state});

/**
 * for every key on the initial state, create a handler
 * @param {String} reducer_name - name of reducer
 * @param {Object} handlers - object of functions to be utilized inside of a reducer
 * @returns {Object} - the updated handlers object
 */
export const applyUpdaterHandler = (reducer_name, handlers) => {
    const new_handlers = {};
    new_handlers[createUpdaterActionName(reducer_name)] = createUpdaterHandler();
    return {...handlers,...new_handlers}
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
export const createGetState = (store, reducer_name) => {
    return () => store.getState()[reducer_name];
};
/**
 * applies the get state to the state controller object
 * @param {Object} store - redux store
 * @param {Object} state - state controller functions
 * @param {String} reducer_name - name of reducer
 * @returns {Object} - state controller object
 */
export const applyGetState = (store, state, reducer_name,) => {
    state[reducer_name].getState = createGetState(store,reducer_name);
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
export const addStateControllers = (reducer_name, initial_state, store, state) => {
    state[reducer_name] = {};
    state = applySetters(store, initial_state, state, reducer_name);
    state = applyGetters(store, initial_state, state, reducer_name);
    state = applyUpdater(store, state, reducer_name);
    state = applyGetState(store, state, reducer_name,);
    return state;
};
/**
 *  creates action handlers for the reducer
 * @param {String} reducer_name - name to access controller
 * @param {Object} initial_state - key values for state
 * @returns {Object} - action handler object
 */
export const createHandlers = (reducer_name, initial_state) => {
    let handlers = {};
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
export const createReducer = (initial_state, handlers) => {
    return (state = initial_state, action = {}) => {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state
        }
    }
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
export const storeCreator = (initial_reducers_object = {}, initial_state = {}, middleware_array = []) => {
    const DEFAULT_REDUCER = (state = {}) => state;
    const rootReducer = combineReducers({DEFAULT_REDUCER, ...initial_reducers_object});
    return createStore(rootReducer, initial_state, applyMiddleware(...middleware_array));
};

/**
 *
 */
export class StoreModule{
    /**
     * @constructor
     * @param {Object} initial_reducers_object - object containing initial reducer functions
     * @param {Object} initial_state - initial state object
     * @param {Array} middleware_array - array of middleware functions
     */
    constructor(initial_reducers_object = {}, initial_state = {}, middleware_array = []){
        this.store = storeCreator(initial_reducers_object, initial_state, middleware_array );
        this.state = {};
    }

    /**
     * creates state controllers
     * @param {String} reducer_name - name to access state by
     * @param {Object} initial_state - builds controller based on keys off of this object
     * @returns {Object} - returns state controller for a reducer
     */
    reduxAssist = (reducer_name, initial_state) =>{
        this.state = addStateControllers(reducer_name, initial_state, this.store, this.state);
        const handlers = createHandlers(reducer_name, initial_state);
        const reducer = createReducer(initial_state, handlers);
        this.store.attachReducers({[reducer_name]: reducer});
        return this.state;
    };



}