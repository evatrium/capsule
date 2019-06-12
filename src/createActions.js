import {basicNestedCopy} from "./utils";

/**Creates actions for every key on the initial state
 * @param {string} actionsName - the namespace
 * @param {Object} initialState - the initial state object
 * @param {Object} store - to set and get the state
 * @param {Object} actions - the shared actions object
 * @param {Object} options - options to dismiss the extra copying
 * @returns {Object} - actions object*/
export const createActions = (actionsName, initialState, store, actions, options) => {

    let noCopy = options && options.noAdditionalImmutability;
    initialState = basicNestedCopy(initialState, noCopy);
    //set up the placeholders for the nested actions on the namespace
    actions[actionsName] = {set: {}, get: {}};
    actions[actionsName].merge = (obj_or_cb, skipCopy) => {
        let state = store.getState();
        state[actionsName] = {
            ...state[actionsName],
            ...basicNestedCopy(
                typeof obj_or_cb === 'function'
                    ? obj_or_cb({...state[actionsName]})
                    : obj_or_cb, noCopy || skipCopy)
        };
        store.setState(state);
    };
    //return the namespace state
    actions[actionsName].getState = (skipCopy) =>
        basicNestedCopy(
            store.getState()[actionsName],
            noCopy || skipCopy
        );
    //for every key in the state
    //set the value as the function name of the action type
    //{foo:1} ... namespace.set.foo(2);
    Object.keys(initialState).forEach(key => {
        //set a single value onto the namespace
        actions[actionsName].set[key] = (newValue, skipCopy) => {
            let state = store.getState();
            state[actionsName] = {
                ...state[actionsName],
                [key]: basicNestedCopy(newValue, noCopy || skipCopy)
            };
            store.setState(state);
        };
        //get a single value from the namespace
        actions[actionsName].get[key] = (skipCopy) => {
            return basicNestedCopy(
                store.getState()[actionsName][key],
                noCopy || skipCopy
            );
        };
    });
    return actions;
};