import React, {Component} from "react";

class Root extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}

export const CapsuleModule = ({createStore, actionsCreator, classNames, asyncHOC, connect, Provider, jssProcessor, events}) => {

    const store = createStore();
    const cn = classNames;
    let collective = {};
    let actions = {};
    let theme = {};
    let propsFromProvider = {};
    let logicFromProvider = {};
    let _jssProcessor = jssProcessor;
    let stylesHOC;
    let RootComponent;

    const CapsuleProvider = (config = {}) => {

        theme = config.theme || {};
        propsFromProvider = config.toProps || {};
        logicFromProvider = config.toLogic || {};
        _jssProcessor = config.stylesHOC ? false : config.jssProcessor || jssProcessor;
        stylesHOC = config.stylesHOC;
        RootComponent = config.RootComponent || Root;
        collective = {...collective, ...config.toCollective};


        return (Child = null) => {

            const AC = asyncHOC && config.loadApp ? asyncHOC(config.loadApp) : null;

            const App = AC || Child;

            return () => (
                <Provider
                    store={store}
                    collective={{getCollective: () => collective}}
                    actions={{getActions: () => actions}}>
                    <RootComponent>
                        <App/>
                    </RootComponent>
                </Provider>
            );
        }
    };

    const makeActionsAndAttachState = (initialState, actionsName) => {
        if (!initialState || !actionsName) return;
        store.attachState({[actionsName]: initialState});
        actions = actionsCreator(actionsName, initialState, store, actions);
    };

    const makeLogic = (logic) => {
        if (!logic) return {};
        return logic({
            ...logicFromProvider,
            events,
            actions,
            store,
            collective: () => collective
        })
    };

    const updateCollective = (logicName, returnLogic) => {
        if (!logicName) return;
        collective = {
            ...collective,
            [logicName]: returnLogic
        }
    };

    const makeClassesFromStyles = (styles) => {
        if (!styles || !_jssProcessor) return null;
        return _jssProcessor(typeof styles === 'function' ? styles(theme) : styles);
    };

    const Capsule = (c = {}) => {

        let {
            name,
            styles,
            initialState,
            actionsName,
            mapState,
            mapActions,
            logicName,
            logic,
            mapLogic,
        } = c;

        if (name) {
            if (!actionsName) actionsName = name;
            if (!logicName) logicName = name;
        }

        makeActionsAndAttachState(initialState, actionsName);

        let returnLogic = makeLogic(logic);

        updateCollective(logicName, returnLogic);

        let classes = makeClassesFromStyles(styles);

        return (Child) => {
            if (!Child) return returnLogic;

            if (styles && stylesHOC) {
                Child = stylesHOC(styles)(Child);
            }

            return connect({
                mapState,
                mapActions,
                mapLogic,
                additionalProps: {
                    cn,
                    theme,
                    ...propsFromProvider,
                    classes
                }
            })(Child)
        };
    };

    return {
        CapsuleProvider,
        Capsule,
    }

};
