import React from 'react';
import {render} from "react-dom";
import {theme, global_styles} from "../theme";
import cx from 'classnames';
import {FakeApi} from "./fakeApi";
// import {CapsuleProvider} from "@iosio/capsule";
import Main from './App/Main';
import {CapsuleProvider} from "../@iosio/capsule/index";

const fakeApi = new FakeApi('fake_url.com/api', {some: 'fake options'});


const App = CapsuleProvider({
    provide_to_logic: {fakeApi},
    provide_to_props: {cx},
    theme,
    global_styles,
})(Main);

render(<App/>, document.getElementById('root'));


