import React from 'react';
import ReactDOM from 'react-dom'


// import {isShape, isFunction ...etc } from "../@iosio/utils";
// ^ eventually sanitize constructors and arguments with checkers

import {StoreModule} from "./StoreModule";
import {MainComponent} from "./MainComponent";
import {connect} from 'react-redux';
import withStyles from 'react-jss';

export class IosioModule {
    constructor({styles, provide_to_logic, provide_to_props}) {

        this.provide_to_logic = provide_to_logic;
        this.provide_to_props = provide_to_props;

        //expose the newly created store and the redux assist module
        const {st, store} = new StoreModule();
        this.reduxAssist = reduxAssist;
        this.store = store;

        const {theme, global_styles} = styles;
        this.apply_to_root = {store, theme, global_styles};
        //apply these to the main component
        // which houses the Redux Store Provider, and ThemeProvider components
    }

    /**
     * wrap the app component with the MainComponent and mount it to the dom
     * @param AppComponent
     */
    mount(AppComponent) {
        ReactDOM.render(
            <MainComponent {...this.apply_to_root}>
                <AppComponent/>
            </MainComponent>
            , document.getElementById('root'));
    }


    /**
     * HIGHER ORDER FUNCTION
     * @param {String} name - name of the reducer
     * @param {Object|Function} styles - jss styles
     * @param {Object} redux - initial state for the reducer
     * @param {Function} logic - optionally consumes redux, store and any other global providers
     * @param {Function} connectRedux - mapStateToProps to connect redux state to component
     * @returns {Function|Object} - returns a wrapped component if provided a component
     * otherwise returns whatever is returned from the logic function
     */
    link = ({name, styles, redux, logic, connectRedux,}) => {


        //build the redux
        const redux_build = name && redux ? this.reduxAssist(name, redux) : null;


        const provide_to_logic = this.provide_to_logic ? this.provide_to_logic : {};

        const provide_to_props = this.provide_to_props ? this.provide_to_props : {};

        const logic_build = logic && logic({
            redux: redux_build,
            store: this.store,
            ...provide_to_logic
        });

        return (ComposedComponent) => {

            if (ComposedComponent && styles) {
                //wrap the component with jss styles
                ComposedComponent = withStyles(styles)(ComposedComponent);
            }

            if (ComposedComponent) {

                class iosioLinked extends React.Component {

                    render() {
                        const props = this.props;
                        return (
                            //pass the logic and any other provided props
                            <ComposedComponent {...props} logic={logic_build} {...provide_to_props}/>
                        );
                    }
                }

                // mapStateToProps
                return connect(connectRedux, null)(iosioLinked);

            } else {
                return logic_build;
            }

        };


    }


}



