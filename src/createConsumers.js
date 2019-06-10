import {createElement, useContext, useReducer, useRef, useMemo, useEffect} from 'react';

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

export const createConsumers = (CapsuleContext) => {

    const useForceUpdate = () => useReducer(state => !state, false)[1];

    const useCapsule = ({mapState, mapActions, mapLogic}) => {
        const {store, getCollective, getActions} = useContext(CapsuleContext);
        let forceUpdate = useForceUpdate(),
            ignoreForce = useRef(false),
            hasMounted = useRef(false),
            update = useRef(() => null),
            state = useRef(store.getState()),
            mappedProps = useRef({});

        mappedProps.current = useMemo(() => {
            let m_props = {};
            if (mapLogic && getCollective) m_props = mapIt(mapLogic, getCollective());
            if (mapActions && getActions) m_props = {...m_props, ...mapIt(mapActions, getActions())};
            return m_props;

        }, []);

        const updater = useMemo(() => (_, initial) => {
            let mapped = mapIt(mapState, store.getState());
            for (let i in mapped) if (mapped[i] !== state.current[i]) {
                state.current = mapped;
                return !ignoreForce.current && !initial && forceUpdate()
            }
            for (let i in state.current) if (!(i in mapped)) {
                state.current = mapped;
                return !ignoreForce.current && !initial && forceUpdate()
            }

        }, []);

        if (!hasMounted.current && mapState) updater(null, true);

        useEffect(() => {
            hasMounted.current = true;
            if (mapState) {
                update.current = updater;
                update.current();
            }
            const unsub = store.subscribe(update.current);
            return () => {
                ignoreForce.current = true;
                unsub();
            }

        }, []);

        return [state.current, mappedProps.current]
    };

    const connectCapsule = ({mapState, mapActions, mapLogic}) => Child => props => {
        const [state, mappedProps] = useCapsule({mapState, mapActions, mapLogic});
        return createElement(Child, {...mappedProps, ...state, ...props});
    };

    return {
        useCapsule,
        connectCapsule,
    }
};
