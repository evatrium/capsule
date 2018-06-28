import React from 'react';
import {StoreModule} from "./StoreModule";
import {MainComponent} from "./MainComponent";
import {connect} from 'react-redux';
import withStyles from 'react-jss';

const {reduxAssist, store} = new StoreModule();

let _provide_to_props = {};
let _provide_to_logic = {};

export const CapsuleProvider = ({provide_to_logic, provide_to_props, theme, global_styles}) => {

    _provide_to_props = provide_to_props;
    _provide_to_logic = provide_to_logic;

    return (ComposedComponent) => {
        console.log('returning Provider _provide_to_props: ', _provide_to_props, ' _provide_to_logic: ', _provide_to_logic)
        return class WithProvider extends React.PureComponent {
            constructor(props) {
                super(props);
                console.log('provider being constructed')
            }
            render() {
                const props = this.props;
                return (
                    <MainComponent {...props} theme={theme} global_styles={global_styles} store={store}>
                        <ComposedComponent {...props}/>
                    </MainComponent>
                );
            }
        }
    };

};

export const Capsule = ({styles, reducer_name, initial_state, logic, mapStateToProps}) => {

    const state = reducer_name && initial_state ? reduxAssist(reducer_name, initial_state) : null;

    const getLogic = ()=> logic && logic({state, store, ..._provide_to_logic});

    return (ComposedComponent) => {

        if (ComposedComponent && styles) {
            //wrap the component with jss styles
            ComposedComponent = withStyles(styles)(ComposedComponent);
        }
        if (ComposedComponent) {

            class WithCapsule extends React.Component {
                constructor(){
                    super();
                    console.log('capsule being constructed')
                }
                render() {
                    const props = this.props;
                    return (
                        //pass the logic and any other provided props
                        <ComposedComponent
                            {...props}
                            logic={getLogic()}
                            {..._provide_to_props}
                        />
                    );
                }
            }
            // mapStateToProps
            return connect(mapStateToProps, null)(WithCapsule);
        } else {
            return getLogic();
        }

    };

};


