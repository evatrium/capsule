export const createStore = (state) => {
    state = state || {};
    let listeners = [],
        unsubscribe = (listener) => {
            let out = [];
            for (let i = 0; i < listeners.length; i++)
                if (listeners[i] === listener) listener = null;
                else out.push(listeners[i]);
            listeners = out;
        };
    return {
        unsubscribe,
        getState: () => state,
        setState: (update, overwrite) => {
            state = overwrite ? update : {...state, ...update};
            let current = listeners;
            for (let i = 0; i < current.length; i++) current[i](state);
        },
        subscribe: (listener) => {
            listeners.push(listener);
            return () => unsubscribe(listener);
        },
        attachState: (new_state) => {
            state = {...state, ...new_state};
        }
    }
};