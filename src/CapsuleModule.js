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

let aliases = {
    name: 'name',
    styles: 'styles',
    css: 'css',
    initialState: 'initialState',
    actionsName: 'actionsName',
    mapState: 'mapState',

    logicName: 'logicName',
    logic: 'logic',
    mapLogic: 'mapLogic',
    mapActions: 'mapActions',

    //logic arguments
    actions: 'actions',
    collective: 'collective',
    cn: 'cn'
};


export const CapsuleModule = ({createStore, actionsCreator, classNames, asyncHOC, connect, Provider, jssProcessor, events}) => {
    const store = createStore();
    const cn = classNames;
    let collective = {};
    let actions = {};
    let theme = {};
    let propsFromProvider = {};
    let logicFromProvider = {};
    let insertStyleSheet;
    let _jssProcessor = jssProcessor;
    let stylesHOC;
    let RootComponent;

    let doAliasing = false;


    const CapsuleProvider = (config = {}) => {
        if (config.aliases) {
            doAliasing = true;
            aliases = {...aliases, ...config.aliases};
        }

        theme = config.theme || {};
        propsFromProvider = config.toProps || {};
        logicFromProvider = config.toLogic || {};
        _jssProcessor = config.stylesHOC ? false : config.jssProcessor || jssProcessor;
        stylesHOC = config.stylesHOC;
        RootComponent = config.RootComponent || Root;
        collective = {...collective, ...config.toCollective};
        insertStyleSheet = config.insertStyleSheet;


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
            [aliases.actions]: actions,
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

    const withTheme = (source) => typeof source === 'function' ? source(theme) : source;

    const makeClassesFromStyles = (styles) => {
        if (!styles || !_jssProcessor) return null;
        return _jssProcessor(withTheme(styles));
    };

    const makeCSS = (css) => {
        if (insertStyleSheet && css) {
            insertStyleSheet(withTheme(css));
        }
    };

    const makeAliases = (c) => {
        if (!doAliasing) return c;
        const a = aliases;
        let ali = {};
        Object.keys(a).forEach(key => {
            ali[key] = c[key] ? c[key] : c[a[key]]
        });
        return ali;
    };

    const Capsule = (c = {}) => {

        let {
            name,
            styles,
            css,
            initialState,
            actionsName,
            mapState,
            mapActions,
            logicName,
            logic,
            mapLogic,
        } = makeAliases(c);

        if (name) {
            if (!actionsName) actionsName = name;
            if (!logicName) logicName = name;
        }

        makeActionsAndAttachState(initialState, actionsName);

        let returnLogic = makeLogic(logic);

        updateCollective(logicName, returnLogic);

        let classes = makeClassesFromStyles(styles);

        makeCSS(css);

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
                    [aliases.cn]: cn,
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
