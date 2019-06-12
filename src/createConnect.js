import React, {Component, createElement} from 'react';
import {convertArguments} from "./utils";

/**
 * selects the values off of the state
 * accepts a function to map props like this:
 * (state) => ({mySingleProp: state.namespace.prop});
 * or with comma separated values on an object like this:
 * {namespace:'prop,someOtherProp', someOtherNameSpace: 'foo,bar'}
 * @param {function|Object} mapper - plucks the keys off of the state
 * @param {Object} source - the state
 * @returns {Object} - the selected state
 */
export const mapIt = (mapper, source) => {
    if (typeof mapper === 'function') return mapper(source);
    if (typeof mapper === 'object') {
        let selected = {};
        let keys = Object.keys(mapper);
        for (let i = 0; i < keys.length; i++) {
            const namespace = keys[i];
            if (!source[namespace]) break;
            let props = mapper[namespace];
            if (typeof props === 'string') props = props.split(/\s*,\s*/);
            for (let i = 0; i < props.length; i++) selected[props[i]] = source[namespace][props[i]];
        }
        return selected;
    }
    return {};
};

/*** Wire a component up to the store. Passes state as props, re-renders on change.
 * inspiration: https://github.com/developit/unistore/blob/master/src/integrations/react.js
 * @param CapsuleContext
 * @returns {function}*/
export const createConnect = (CapsuleContext) => (...args) => Child => {

    const {mapState, mapActions, mapLogic} = convertArguments(...args);

    function Connected(props, context) {
        Component.call(this, props, context);
        context = context || {};
        const {store, getCollective, getActions} = context;

        let mappedProps = {}, state = {},
            getState = () => store && store.getState ? store.getState() : {},
            update = () => {
            }, sub, unsub;

        //map the collections to props
        if (mapLogic && getCollective) mappedProps = mapIt(mapLogic, getCollective());
        if (mapActions && getActions) mappedProps = {...mappedProps, ...mapIt(mapActions, getActions())};
        if (mapState) { //skip if there is no mapState in case we are just mapping logic or actions
            state = mapIt(mapState, getState()); //first run-through, map the state
            update = () => {
                let mapped = mapIt(mapState, getState()); //get the plucked state values onto an object
                for (let i in mapped) if (mapped[i] !== state[i]) {//and compare each value with the last
                    state = mapped; // if there is a change then update the state
                    //we can dip out at this point. check if mounted so we dont update after unmounting
                    return this.mounted && this.forceUpdate();//simulate setState on the wrapped component
                }// if there aren't any updates then check to see if any new properties have been added
                for (let i in state) if (!(i in mapped)) {
                    state = mapped;
                    return this.mounted && this.forceUpdate();
                }
            }; //subscribe the update function to be called whenever store.setState is called
            sub = () => store && store.subscribe(update);
            unsub = () => store && store.unsubscribe(update);
        }

        this.componentDidMount = () => {
            this.mounted = true;
            update(); //need to call update here
            //in case the component (that this wraps) triggers an update
            //prior to subscribing to the store.
            sub && sub();
        };
        this.componentWillUnmount = () => {
            this.mounted = false;
            unsub && unsub();
        };
        this.render = () =>
            createElement(Child, {...mappedProps, ...state, ...this.props});
    }

    const ConnectedCapsule = (Connected.prototype = new Component()).constructor = Connected;
    ConnectedCapsule.contextType = CapsuleContext;
    return ConnectedCapsule;
};
