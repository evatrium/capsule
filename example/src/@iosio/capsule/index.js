import React from 'react';
import {StoreModule} from './redux-assist'
import {MainComponent} from "./MainComponent";
import {connect} from 'react-redux';
import withStyles from 'react-jss';
import {asyncComponent} from "@iosio/components/lib/asyncComponent";

const {reduxAssist, store} = new StoreModule();

let _provide_to_props = {};
let _provide_to_logic = {};
let collective_logic = {};

export const CapsuleProvider = (
    {provide_to_logic, provide_to_props, theme, global_styles, loadApp, loadingComponent}) => {


    const AppComponent = asyncComponent(loadApp, loadingComponent);
    _provide_to_props = provide_to_props;
    _provide_to_logic = provide_to_logic;
    // console.log('returning Provider _provide_to_props: ', _provide_to_props, ' _provide_to_logic: ', _provide_to_logic)
    return class WithProvider extends React.PureComponent {
        constructor(props) {
            super(props);
            // console.log('provider being constructed')
        }

        render() {
            const props = this.props;
            return (
                <MainComponent {...props} theme={theme} global_styles={global_styles} store={store}>
                    <AppComponent {...props}/>
                </MainComponent>
            );
        }
    }


};

export const Capsule = ({styles, reducer_name, logic_name, initial_state, logic, mapStateToProps}) => {


    const state = reducer_name && initial_state ? reduxAssist(reducer_name, initial_state) : null;


    let return_logic = logic && logic({state, store, ..._provide_to_logic, collective: ()=>collective_logic});

    if(logic_name){
        collective_logic = {...collective_logic, [logic_name]:return_logic};
    }

    // console.log(Object.keys(collective_logic));


    return (Component) => {

        if (Component && styles) {
            //wrap the component with jss styles
            Component = withStyles(styles)(Component);
        }
        if (Component) {

            class WithCapsule extends React.Component {
                constructor() {
                    super();
                    // console.log('capsule being constructed')
                }

                render() {
                    const props = this.props;
                    return (
                        //pass the logic and any other provided props
                        <Component
                            {...props}
                            logic={return_logic}
                            {..._provide_to_props}
                        />
                    );
                }
            }

            // mapStateToProps
            return connect(mapStateToProps, null)(WithCapsule);

        } else {
            return return_logic;
        }

    };

};
