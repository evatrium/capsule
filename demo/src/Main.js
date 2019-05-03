import React from 'react';
import {Capsule, lazyLoader, Router} from '../../src';
import {getPathnameFromString as gpfs} from "@iosio/history";

const PublicMain = lazyLoader(() => import('./PublicApp/Main'));
const AdminApp = lazyLoader(() => import('./AdminApp/Main'));


const Tester = ()=><h5>tester</h5>;


const Main = Capsule({
    mapLogic: {main: 'login'},
    mapState: {main: 'loggedIn,isAdmin,accessiblePaths'},
})(class WithRoutingCapsule extends React.Component {

    render() {

        const {loggedIn, isAdmin} = this.props;

        let accessiblePaths = ['/', '/detail', '/login', '/tester'],
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
export default Main;

/*
  {(location) => {
                        const Route = accessibleRoutes[location.pathname];
                        return Route ? <Route url={location.url}/> : null;
                    }}
 */