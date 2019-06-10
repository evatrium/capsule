import React from 'react';
import {Capsule, Router} from '../../../src';
import {lazyLoader} from "./utils/lazyLoader";


const PublicMain = lazyLoader(() => import('./PublicApp/Main'));
const AdminApp = lazyLoader(() => import('./AdminApp/Main'));


const Tester = () => <h5>tester</h5>;


const App = Capsule({
    mapLogic: {main: 'login'},
    mapState: {main: 'loggedIn,isAdmin,accessiblePaths'},
})(class App extends React.Component {
    render() {

        const {loggedIn, isAdmin} = this.props;

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
    }
});
export default App;