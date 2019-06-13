/**
 * creates a store to store state, get and set state, attach new state properties and subscribe to updates
 * inspiration: https://github.com/developit/unistore/blob/master/src/index.js
 * @param {undefined|Object} state - the state object to hold all the namespaced state
 * @returns {{attachState: attachState, getState: (function(): *), unsubscribe: unsubscribe, subscribe: (function(*=): function(): void), setState: setState}}
 */
export const createStore = (state) => {
    /**
     * state object
     * @type {Object|{}} - holds state
     */
    state = state || {};
    /**
     * holds all teh subscription callback functions
     * @type {Array}
     */
    let subs = [];
    /**
     * removes the listener
     * @param {function} sub - named callback function to be removed from subs when unsubscribed
     * @returns {undefined} - returns nothing
     */
    let unsubscribe = (sub) => {
        let out = [];
        for (let i = 0; i < subs.length; i++)
            if (subs[i] === sub) sub = null;
            else out.push(subs[i]);
        subs = out;
    };

    return {
        /**
         * attaches new state to the state object without triggering an update
         * @param {object} new_state - stage object to be merged to existing state
         * @returns {undefined} - returns nothing
         */
        attachState: (new_state) =>
            state = {...state, ...new_state},

        unsubscribe,
        /**
         * gets the entire state object
         * @returns {Object} - the state object
         */
        getState: () => state,
        /**
         * merges new state to the existing state object unless overwrite is true, thus replaces the state.
         * triggers a state update, calling all listeners, passing the updated state to the callbacks
         * @param {Object} update - to be merged to state
         * @param {boolean} overwrite - replaces the existing state with the update if true
         * @returns {undefined} - returns nothing
         */
        setState: (update, overwrite) => {
            state = overwrite ? update : {...state, ...update};
            let current = subs;
            for (let i = 0; i < current.length; i++) current[i](state);
        },
        /**
         * pass a callback function to subscribe to state updates
         * @param {function} sub - callback function
         * @returns {function(): *} - call this function to unsubscribe this specific listener
         */
        subscribe: (sub) => {
            subs.push(sub);
            return () => unsubscribe(sub);
        },
    }
};
