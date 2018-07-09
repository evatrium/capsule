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


// const CapProvide = (props) => {
//     const Component = props.component;
//     return (
//         <Provider>
//             <Jss theme={theme} global_styles={global_styles}>
//                 <Component/>
//             </Jss>
//         </Provider>
//     );
// };
//
// if (loadApp) {
//     const {duration, fadeSwitch_props, fader_props} = loading_options;
//     const AppComponent = asyncComponent(loadApp, loadingComponent, duration, fadeSwitch_props, fader_props);
//     return (<CapProvide component={AppComponent}/>);
//
// } else if (App) {
//
//     return (<CapProvide component={App}/>);
//
// } else {
//     return null;
// }

// import {Jss as _Jss, withStyles as _withStyles} from "@iosio/components/lib/Jss";
// import {asyncComponent as _asyncComponent} from "@iosio/components/lib/asyncComponent";
// export class CapsuleModule {
//     constructor() {
//         const {reduxAssist, store, connect, Provider} = new StoreModule();
//         this.reduxAssist = reduxAssist;
//         this.store = store;
//         this.connect = connect;
//         this.Provider = Provider;
//         this.provide_to_props = {};
//         this.provide_to_logic = {};
//         this.collective_logic = {};
//         this.Jss = _Jss;
//         this.withStyles = _withStyles;
//         this.asyncComponent = _asyncComponent;
//     }
//
//     CapsuleProvider = (
//         {
//             provide_to_logic,
//             provide_to_props,
//             theme,
//             global_styles,
//             loadApp,
//             App,
//             loadingComponent,
//             loading_options = {duration: undefined, fadeSwitch_props: {}, fader_props: {}}
//         }) => {
//
//         this.provide_to_props = provide_to_props;
//         this.provide_to_logic = provide_to_logic;
//
//         const WithCapsule = (props) => {
//             const Component = props.component;
//             const Provider = this.Provider;
//             return(
//                 <Provider>
//                     <Jss theme={theme} global_styles={global_styles}>
//                         <Component/>
//                     </Jss>
//                 </Provider>
//             );
//         };
//
//         if (loadApp) {
//             const {duration, fadeSwitch_props, fader_props} = loading_options;
//             const AppComponent = this.asyncComponent(loadApp, loadingComponent, duration, fadeSwitch_props, fader_props);
//             return(<WithCapsule component={AppComponent}/>);
//
//         } else if(App){
//
//             return(<WithCapsule component={App}/>);
//
//         }else{
//             return null;
//         }
//
//     };
//
//     Capsule = (
//         {
//             styles,
//             reducer_name,
//             logic_name,
//             initial_state,
//             logic,
//             mapStateToProps
//         }) => {
//
//
//         const state = reducer_name && initial_state ? this.reduxAssist(reducer_name, initial_state) : null;
//
//         let return_logic;
//
//         if (logic) {
//             return_logic = logic({
//                 state,
//                 store: this.store,
//                 ...this.provide_to_logic,
//                 provider: () => this.provide_to_logic,
//                 collective: () => this.collective_logic
//             });
//         }
//
//         if (logic_name) {
//             this.collective_logic = {...this.collective_logic, [logic_name]: return_logic};
//         }
//
//         // console.log(Object.keys(collective_logic));
//         return (Component) => {
//
//             if (Component && styles) {
//                 //wrap the component with jss styles
//                 Component = this.withStyles(styles)(Component);
//             }
//             if (Component) {
//
//                 const WithCapsule = (props) => <Component
//                     {...props}
//                     logic={return_logic}
//                     {...this.provide_to_props}
//                 />;
//
//                 return this.connect(mapStateToProps, null)(WithCapsule);
//
//             } else {
//                 return return_logic;
//             }
//
//         };
//
//     };
//
// }
//
// export const {
//     CapsuleProvider,
//     Capsule,
//     reduxAssist,
//     store,
//     connect,
//     Provider,
//     Jss,
//     withStyles,
//     asyncComponent
// } = new CapsuleModule();

// let _provide_to_props = {};
// let _provide_to_logic = {};
// let collective_logic = {};
// export const CapsuleProvider = (
//     {
//         provide_to_logic,
//         provide_to_props,
//         theme,
//         global_styles,
//         loadApp,
//         loadingComponent,
//         loading_options = {duration: undefined, fadeSwitch_props: {}, fader_props: {}}
//     }) => {
//
//     const {duration, fadeSwitch_props, fader_props} = loading_options;
//
//     const AppComponent = asyncComponent(loadApp, loadingComponent, duration, fadeSwitch_props, fader_props);
//
//     _provide_to_props = provide_to_props;
//     _provide_to_logic = provide_to_logic;
//     // console.log('returning Provider _provide_to_props: ', _provide_to_props, ' _provide_to_logic: ', _provide_to_logic)
//     return (props) =>  (
//         <Provider>
//             <Jss {...props} theme={theme} global_styles={global_styles}>
//                 <AppComponent {...props}/>
//             </Jss>
//         </Provider>
//     );
// };
//
//
// export const Capsule = (
//     {
//         styles,
//         reducer_name,
//         logic_name,
//         initial_state,
//         logic,
//         mapStateToProps
//     }) => {
//
//
//     const state = reducer_name && initial_state ? reduxAssist(reducer_name, initial_state) : null;
//
//     let return_logic;
//
//     if (logic) {
//         return_logic = logic({
//             state,
//             store,
//             ..._provide_to_logic,
//             collective: () => collective_logic
//         });
//     }
//
//
//     if (logic_name) {s
//         collective_logic = {...collective_logic, [logic_name]: return_logic};
//     }
//
//     // console.log(Object.keys(collective_logic));
//
//
//     return (Component) => {
//
//         if (Component && styles) {
//             //wrap the component with jss styles
//             Component = withStyles(styles)(Component);
//         }
//         if (Component) {
//
//             const WithCapsule = (props) => <Component
//                 {...props}
//                 logic={return_logic}
//                 {..._provide_to_props}
//             />;
//
//             // mapStateToProps
//             return connect(mapStateToProps, null)(WithCapsule);
//
//         } else {
//             return return_logic;
//         }
//
//     };
//
// };
