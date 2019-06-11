import {createElement, createContext} from "react";
import {Eventer} from "@iosio/utils/lib/eventer";
import {createStore} from "./createStore";
import {createConsumers} from "./createConsumers";
import {createActions} from "./createActions";
import {basicNestedCopy} from "./utils";


/**
 * factory function to create capsule instances for testing
 * @returns {Object} - CapsuleProvider, Capsule, connectCapsule, useCapsule, events
 */
export const createCapsule = () => {
    let store = createStore(),
        collective = {},//namespaced function objects returned from logic
        actions = {},//namespaced state controls, each containing {set,get,update,merge,toggle,getState}
        events = Eventer(),//small synthetic event handler - https://github.com/iosio/utils/blob/master/src/eventer.js
        providerContextValue = {
            store,
            getCollective: () => collective,
            getActions: () => actions
        },
        CapsuleContext = createContext(),
        {useCapsule, connectCapsule} = createConsumers(CapsuleContext);

    return {
        events,
        useCapsule,
        connectCapsule,
        /**
         * Capsule Context Provider
         * @param props
         * @returns {function} - the Provider component
         */
        CapsuleProvider: (props) =>
            createElement(
                CapsuleContext.Provider,
                {value: providerContextValue},
                props.children
            ),

        /**
         * Capsule Context Consumer HOC
         * @param {Object} config - configuration object
         * @returns {function|Object} - returns a connected component or a logic object
         */
        Capsule: (config) => {
            config = config || {};
            let {
                name, //namespace to store state and logic
                initialState, //state object
                logic,//a function that accepts a logicCollection object
                mapState, //object or function used to map props to the component
                mapActions, //object or function used to map props to the component
                mapLogic,//object or function used to map props to the component,
                noAdditionalImmutability, // set to true if dealing with large data sets is
            } = config;                  //too expensive or unnecessary to copy every nested property.

            //if there is a name and initial state
            //then attach the state to the namespace
            //and create the actions:
            if (name && initialState) {
                store.attachState({[name]: basicNestedCopy(initialState)});
                actions = createActions(name, initialState, store, actions, noAdditionalImmutability);
            }

            //to be consumed by logic
            const logicCollection = {
                actions,// access state namespaces and controls - logic: ({actions:{data:{set,get}}})=>
                events,// the synthetic events instance
                collective: () => collective,//experimental collective getter. to access logic created by other capsules
                store//for any reason one may need access to the entire app state at once, they may access it here
            };

            // if there is a name and logic function,
            // pass the logicCollection to logic
            // and store the results onto the collective logic namespace
            if (name && logic) collective[name] = logic(logicCollection);

            //if there is a child
            return (Child) => Child // then connect the child and return the component
                ? connectCapsule({mapState, mapLogic, mapActions})(Child)
                : collective[name]; // else return the collective namespace that was returned from logic
        },

    }
};

