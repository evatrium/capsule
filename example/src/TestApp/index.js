import React from 'react';
import ReactDOM from "react-dom";
import {theme, global_styles} from "../theme";
import cx from 'classnames';
import {FakeApi} from "./fakeApi";
import {Loading} from "./App/components/Loading";

// import {CapsuleProvider} from "@iosio/capsule";
import {CapsuleProvider} from "../@iosio/capsule/index";

const fakeApi = new FakeApi('fake_url.com/api', {some: 'fake options'});

const App = CapsuleProvider({
    provide_to_logic: {fakeApi},
    provide_to_props: {cx},
    theme,
    global_styles,
    loadApp: () => import('./App/Main'),
    loadingComponent: Loading,
    loading_options: {
        duration: 300
    }
});

ReactDOM.render(<App/>, document.getElementById('root'));


Capsule({

    styles: (theme) => ({
        row: {
            width: '100%'
        }
    }),
    reducer_name: 'view',
    initial_state: {
        root_active: false,
        show: 'messenger',
        current_convo: false,
    },
    logic_name: 'view',
    logic: ({state}) => {

        const goToMessenger = () => {
            state.view.set.show('messenger');
        }

    },
    mapStateToProps: (state) => ({...state})
});


class Capsy {


}


class view extends Capsy {

    constructor() {
        super();
    }

    styles = (theme) => ({
        row: {
            width: '100%'
        }
    });

    reducer_name = 'view';

    initial_state = {
        root_active: false,
        show: 'messenger',
        current_convo: false,
    };

    logic = ({state}) => {

        const goToMessenger = () => {
            state.view.set.show('messenger');
        }

    };




    mapStateToProps = (state) => ({...state});


}