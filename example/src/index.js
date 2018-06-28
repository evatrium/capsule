import React from 'react';
import {Main} from "./App/Main";
import ReactDOM from "react-dom";
import {theme, global_styles} from "./theme";
import cx from 'classnames';
import {FakeApi} from "./fakeApi";

import {CapsuleProvider} from "@iosio/capsule";


const fakeApi = new FakeApi('fake_url.com/api', {some: 'fake options'});

@CapsuleProvider({
    provide_to_logic: {fakeApi},
    provide_to_props: {cx},
    theme,
    global_styles
})
class App extends React.PureComponent {

    render() {
        return (

            <Main/>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));
