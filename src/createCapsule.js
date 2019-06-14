import {createElement, createContext} from "react";
import {Eventer} from "@iosio/utils/lib/eventer";
import {createStore} from "./createStore";
import {createConnect} from "./createConnect";
import {createActions} from "./createActions";
import {basicNestedCopy} from "./utils";
import {convertArguments} from "./utils";

/** factory function to create capsule instances for testing
 * @returns {{Capsule: (function(Object): function(*=): *), CapsuleProvider: (function(*): (React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> | React.DetailedReactHTMLElement<{value: {getCollective: (function()), getActions: (function()), store: {attachState, getState, unsubscribe, subscribe, setState}}}, HTMLElement> | React.ReactSVGElement | React.DOMElement<{value: {getCollective: (function()), getActions: (function()), store: {attachState, getState, unsubscribe, subscribe, setState}}}, Element> | React.SFCElement<{value: {getCollective: (function()), getActions: (function()), store: {attachState, getState, unsubscribe, subscribe, setState}}}> | React.CElement<React.ProviderProps<any>, React.ClassicComponent<React.ProviderProps<any>, React.ComponentState>> | React.CElement<React.ProviderProps<any>, React.Component<React.ProviderProps<any>, React.ComponentState>> | React.ReactElement<React.ProviderProps<any>>)), events: {on: on, off: off, emit: emit}, connect: *}}
 */
export const createCapsule = () => {

    let store = createStore(),
        collective = {},//namespaced function objects returned from logic
        actions = {},//namespaced state controls, each containing {set,get,update,merge,toggle,getState}
        events = Eventer(),//small synthetic event handler - https://github.com/iosio/utils/blob/master/src/eventer.js
        providerContextValue = {store, getCollective: () => collective, getActions: () => actions},
        CapsuleContext = createContext(),
        connect = createConnect(CapsuleContext);

    return {

        events,// return the events instance
        connect,// in case you want to just use the connect instead of Capsule

        /*** Capsule Context Provider
         * @param props
         * @returns {function} - the Provider component*/
        CapsuleProvider: (props) =>
            createElement(CapsuleContext.Provider,
                {value: providerContextValue},
                props.children),

        /**Capsule Context Consumer HOC
         * @param {Object} config - configuration object
         * @returns {function|Object} - returns a connected component or a logic object*/
        Capsule: (...config) => {

            let {
                name,//namespace to store state and logic
                initialState,//state object
                logic,//a function that accepts a logicCollection object
                mapState,//object or function used to map props to the component
                mapActions,//object or function used to map props to the component
                mapLogic,//object or function used to map props to the component,
                options, // set options.noAdditionalImmutability to disable copying
            } = convertArguments(...config);

            //if there is a name and initial state
            //then attach the state to the namespace
            //and create the actions:
            if (name && initialState) store.attachState({[name]: basicNestedCopy(initialState)})
            && createActions(name, initialState, store, actions, options);

            // if there is a name and logic function,
            // pass the logicCollection to logic
            // and store the results onto the collective logic namespace
            /* --- previous way ---logic({actions,events, collective: () => collective, store}); */
            if (name && logic) collective[name] = logic(actions[name], {
                actions,//provide all actions in second argument
                events, collective: () => collective, store
            });

            //if there is a child
            return (Child) => Child // then connect the child and return the component
                ? connect([mapState, mapLogic, mapActions])(Child)
                // if logic return the collective namespace else return the actions namespace
                : (logic ? collective[name] : actions[name]);
        },
    }
};