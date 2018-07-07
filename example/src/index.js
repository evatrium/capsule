import React from 'react';
import ReactDOM from "react-dom";
import {theme, global_styles} from "./theme";
import cx from 'classnames';
import {FakeApi} from "./fakeApi";
import {Loading} from "./App/components/Loading";

// import {CapsuleProvider} from "@iosio/capsule";
import {CapsuleProvider} from "./@iosio/capsule";

const fakeApi = new FakeApi('fake_url.com/api', {some: 'fake options'});

const App = CapsuleProvider({
    provide_to_logic: {fakeApi},
    provide_to_props: {cx},
    theme,
    global_styles,
    loadApp: ()=>import('./App/Main'),
    loadingComponent: Loading,
    loading_options: {
        duration: 300
    }
});

ReactDOM.render(<App/>, document.getElementById('root'));
