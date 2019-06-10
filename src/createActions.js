import {basicNestedCopy} from "./utils";

export const createActions = (actionsName, initialState, store, actions, noAdditionalImmutability) => {
    initialState = basicNestedCopy(initialState, noAdditionalImmutability);
    //set up the placeholders for all the actions on the namespace
    actions[actionsName] = {set: {}, get: {}, toggle: {}, update: () => null, merge: () => null};

    actions[actionsName].update = (cb, skipCopy) => {
        let state = store.getState();
        // pass the namespace state to the callback,
        // and assign the returned value to the namespace
        store.setState({
            ...state,
            [actionsName]: basicNestedCopy(cb({...state[actionsName]}), noAdditionalImmutability || skipCopy)
        });
    };

    actions[actionsName].merge = (propsToMerge, skipCopy) => {
        let state = store.getState();
        //spread the propsToMerge and assign to the namespace
        store.setState({
            ...state,
            [actionsName]: {
                ...state[actionsName],
                ...basicNestedCopy(propsToMerge, noAdditionalImmutability || skipCopy)
            }
        });
    };

    //return the namespace state
    actions[actionsName].getState = (skipCopy) =>
        basicNestedCopy(store.getState()[actionsName], noAdditionalImmutability || skipCopy);

    //for every key in the state
    //set the value as the function name of the action type
    //{foo:1} ... namespace.set.foo(2);
    Object.keys(initialState).forEach(key => {

        //set a single value onto the namespace
        actions[actionsName].set[key] = (newValue, skipCopy) => {
            let state = store.getState();
            store.setState({
                ...state,
                [actionsName]: {
                    ...state[actionsName],
                    [key]: basicNestedCopy(newValue, noAdditionalImmutability || skipCopy)
                }
            });
        };

        //get a single value from the namespace
        actions[actionsName].get[key] = (skipCopy) => {
            return basicNestedCopy(store.getState()[actionsName][key], noAdditionalImmutability || skipCopy);
        };

        //toggle a single value on a namespace to its inverse
        actions[actionsName].toggle[key] = () => {
            actions[actionsName].set[key](!actions[actionsName].get[key]())
        };
    });

    return actions;
};
