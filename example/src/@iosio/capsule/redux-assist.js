import {createStore} from 'redux-dynamic-reducer'
import {applyMiddleware, combineReducers} from 'redux'
import dynamicMiddlewares, {addMiddleware} from 'redux-dynamic-middlewares'
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
export const reduxAssist = (reducer_name, state_initial, store, state) => {

    // const state = {}; // this object will contain the functions used to manipulate the store

    state[reducer_name] = {}; //ex: state.user

    state[reducer_name].set = {}; // keys of the initial state will be set here

    state[reducer_name].get = {};

    const handlers = {}; // this will house functions similar to the switch statements in the reducer

    //for each key in the initial state, provide a "set" function to update the single value
    let keys = Object.keys(state_initial);

    keys.forEach((key) => {

        const ACTION = `@app/@${reducer_name}/set_${key}`; // action type
        //user will execute: state.user.set.logged_in(true)
        state[reducer_name].set[key] = (payload) => (store.dispatch({type: ACTION, payload}));
        state[reducer_name].get[key] = ()=> store.getState()[reducer_name][key];
        //instead of a switch statement, the reducer will switch on handlers[action.type]
        //and they key on the store will be updated with the payload that is dispatched
        handlers[ACTION] = (state, action) => ({...state, [key]: action.payload});
    });


    const UPDATE_ACTION = `@app/@${reducer_name}/update`;
    //state.user.update returns the entire state object in a callback
    //so that the user can update the entire state or select properties and apply them using the spread operator
    state[reducer_name].update = (cb) => {

        if (!cb) {
            console.error(`state.${reducer_name}.update requires a callback function`);
            return;
        }
        let new_state = cb(store.getState()[reducer_name]);
        store.dispatch({type: UPDATE_ACTION, new_state});
    };

    handlers[UPDATE_ACTION] = (state, action) => ({...action.new_state});

    state[reducer_name].getState = ()=> store.getState()[reducer_name];

    //creater a reducer that switches on the handlers object
    const createReducer = (initialState, handlers) => {
        return (state = initialState, action = {}) => {
            if (handlers.hasOwnProperty(action.type)) {
                return handlers[action.type](state, action)
            } else {
                return state
            }
        }
    };
    const reducer = createReducer(state_initial, handlers);



    return {state, reducer}
};

/**
 * creates the initial store and provides reduxAssist to create reducers that
 * dynamically attach to the global store
 */
export class StoreModule {
    constructor() {
        const DEFAULT_REDUCER = (state = {}) => state;
        const rootReducer = combineReducers({DEFAULT_REDUCER});

        this.store = createStore(
            rootReducer,
            applyMiddleware(
                // ... other static middlewares
                dynamicMiddlewares
            )
        );

        const logger = store => next => action => {
            // console.log('dispatching', action)
            let result = next(action)
            // console.log('next state', store.getState())
            return result
        };

        addMiddleware(logger);

        this.attachReducers = (reducer) => this.store.attachReducers(reducer);

        this.state = {};
        this.state.getState = ()=>this.store.getState();
    }

    /**
     * creates redux functions that update the state as well as a reducer
     * that subsequently attaches to the global state object allowing for dynamic loading
     * of modules. useful when developing modules that may need to work in isolation
     * from the rest of the application or code splitting is implemented in the application.
     * @param {String} reducer_name - to be applied to the generated reducer and state function object
     * @param {Object} state_initial - used for redux assist
     * @returns {{function}} - returns an object of functions used to manipulate the state
     */

    reduxAssist = (reducer_name, state_initial) => {
        const {state, reducer} = reduxAssist(reducer_name, state_initial, this.store, this.state);

        this.store.attachReducers({[reducer_name]: reducer});
        return state;
    }
}