import React from 'react';
import {Capsule, Router} from '../../../src';
import {lazyLoader} from "./utils/lazyLoader";


const PublicMain = lazyLoader(() => import('./PublicApp/Main'));
const AdminApp = lazyLoader(() => import('./AdminApp/Main'));


const Tester = ()=><h5>tester</h5>;


const App = Capsule({
    mapLogic: {main: 'login'},
    mapState: {main: 'loggedIn,isAdmin,accessiblePaths'},
})(class App extends React.Component {
    render() {

        const {loggedIn, isAdmin} = this.props;

        let accessiblePaths = ['/', '/detail', '/login', '/tester', '/todos'],
            authenticatedPaths = ['/myProfile'],
            adminPaths = ['/admin', '/admin/users', '/admin/analytics'];

        if (loggedIn) {
            accessiblePaths = [...accessiblePaths, ...authenticatedPaths];
            if (isAdmin) {
                accessiblePaths = [...accessiblePaths, ...adminPaths];
            }
        }

        const pathMap = {
            '/':PublicMain,
            '/admin':AdminApp,
            '/tester':Tester
        };

        return (
            <Router
                root
                noMatch={'/'}
                pathMap={pathMap}
                accessiblePaths={accessiblePaths}
            />
        );
    }
});
export default App;