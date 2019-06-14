import './styles.css';
import React from 'react'
import {render} from 'react-dom';
import "./mainCapsule";
import {CapsuleProvider, Capsule, Router} from '../../../src'

import {lazyLoader} from "./utils/lazyLoader";

const PublicMain = lazyLoader(() => import('./PublicApp/Main'));
const AdminApp = lazyLoader(() => import('./AdminApp/Main'));
const Tester = () => <h5>tester</h5>;


const App = Capsule({
    mapState: {main: 'loggedIn'},
})(({loggedIn}) => {

    let pathMap = {
        '/': PublicMain,
        '/tester': Tester
    };

    if (loggedIn) {
        pathMap = {
            ...pathMap,
            '/admin': AdminApp,
        }
    }

    return (
        <Router
            root
            noMatch={'/'}
            pathMap={pathMap}
        />
    );
});

export const Root = () => (
    <CapsuleProvider>
        <App/>
    </CapsuleProvider>
);

render(<Root/>, document.querySelector('#demo'));