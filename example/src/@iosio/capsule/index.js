import React from 'react';
import {StoreModule} from './redux-assist'
import {Jss, withStyles} from "@iosio/components/lib/Jss";


export class CapsuleModule {
    constructor() {

        const {reduxAssist, store, connect, Provider} = new StoreModule();

        let _provide_to_props = {};
        let collective_logic = {};

        const CapsuleProvider = (config) => { //provide_to_props, provide_to_logic, theme, global_styles
            if (config && config.provide_to_props) {
                _provide_to_props = config.provide_to_props;
            }

            if (config && config.provide_to_logic) {
                collective_logic = {...collective_logic, ...config.provide_to_logic};
            }

            return (App) => {
                if(!App){return null}
                return class CapsuleProvided extends React.Component {

                    render() {
                        return (
                            <Provider>
                                <Jss
                                    theme={
                                        config && config.theme ? config.theme : {}
                                    }
                                    global_styles={
                                        config && config.global_styles ? config.global_styles : () => ({})
                                    }>
                                    <App {...this.props} {..._provide_to_props}/>
                                </Jss>
                            </Provider>
                        );
                    }
                }
            };
        };

        const Capsule = (
            {
                styles,
                reducer_name,
                initial_state,
                mapStateToProps,
                logic_name,
                logic,
                mapLogicToProps
            }) => {

            let state;

            if (reducer_name && initial_state) {
                state = reduxAssist(reducer_name, initial_state)
            }

            let return_logic;

            if (logic) {
                return_logic = logic({
                    state,
                    store,
                    collective: () => ({...collective_logic})
                });
            }

            if (logic_name && return_logic) {
                collective_logic = {...collective_logic, [logic_name]: return_logic};
            }

            return (Component) => {

                let logic_props = {};
                if (mapLogicToProps) {
                    logic_props = mapLogicToProps(collective_logic);
                }

                if (Component && styles) {
                    Component = withStyles(styles)(Component);
                }

                if (Component) {

                    const WithCapsule = (props) => (
                        <Component
                            {...props}
                            {...logic_props}
                            {..._provide_to_props}
                        />
                    );

                    if(mapStateToProps){
                        return connect(mapStateToProps, null)(WithCapsule);
                    }else{
                        return WithCapsule
                    }


                } else {
                    return return_logic;
                }

            };

        };

        return {CapsuleProvider, Capsule}
    }
}

export const {CapsuleProvider, Capsule} = new CapsuleModule();