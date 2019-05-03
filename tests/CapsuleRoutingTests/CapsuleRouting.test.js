import React from 'react'
import {CapsuleProvider, Capsule, Router, Linkage, lazyLoader, routing, events} from '../../src';
import renderer from 'react-test-renderer';
import {render, fireEvent, queryByAttribute} from 'react-testing-library';
import {Till} from "../_test_utils";
import {mainCapsule} from "./mainCapsule";
import Home from '../_test_utils/pages/Home';
import Detail from '../_test_utils/pages/Detail';
import AuthOnly from '../_test_utils/pages/AuthOnly';
import Restricted from '../_test_utils/pages/Restricted';
import Login from '../_test_utils/pages/Login';

const authControls = mainCapsule();


const till = Till(events);

const getById = queryByAttribute.bind(null, 'id');

const {goTo, getLocation} = routing;


// const Detail = lazyLoader(() => import('../_test_utils/pages/Detail'));
// const AuthOnly = lazyLoader(() => import('../_test_utils/pages/AuthOnly'));
// const Restricted = lazyLoader(() => import('../_test_utils/pages/Restricted'));
// const Login = lazyLoader(() => import('../_test_utils/pages/Login'));

const Link = ({toPath, toParams, name, id}) => (
    <Linkage toPath={toPath} toParams={toParams} id={id} className={'link'}>
        {({pathname}) => {
            const activeClass = toPath === pathname ? 'currPath' : null;
            return (
                <div className={activeClass}>
                    {name}
                </div>
            );
        }}
    </Linkage>
);



const Nav = Capsule({
    mapLogic: {main: 'setAdmin,logout,login'},
    mapState: {main: 'loggedIn,isAdmin'},
})(({onSubmitText, text, loggedIn, logout, setAdmin, login, isAdmin}) => (
    <nav className={'nav'}>

        <div className={'flexRow'}>

            <Link toPath={'/'} id={'home'} name={'home'}/>
            <Link toPath={'/detail'} id={'detail'} name={'detail'}/>
            <Link toPath={'/authOnly'} id={'authOnly'} name={'authOnly'}/>
            <Link toPath={'/restricted'} onClick={() => {
                cosole.log('restricted clicked')
            }} id={'restricted'} name={'restricted'}/>

        </div>

        <div className={'flexRow'}>
            {loggedIn ?
                <button className={'btn'} id="logout" onClick={logout}>Logout</button>
                : <button className={'btn'} id="login" onClick={login}>login</button>
            }
            <button id="toggleAdmin" className={'btn'} onClick={() => setAdmin()}>
                is Admin: {isAdmin ? "true" : "false"}
            </button>
        </div>

    </nav>
));


const WithRoutingCapsule = Capsule({
    mapLogic: {main: 'login'},
    mapState: {main: 'loggedIn,isAdmin'},
})(class WithRoutingCapsule extends React.Component {

    render() {

        const {login, loggedIn, isAdmin} = this.props;

        const publicRouts = {
            '/': Home,
            '/detail': Detail,
            '/login': Login,

        };

        const protectedRoutes = {
            '/authOnly': AuthOnly,
            '/restricted': Restricted,
        };

        let pathMap = {
            ...publicRouts
        };

        if (loggedIn) {
            pathMap = {
                ...publicRouts,
                ...protectedRoutes
            }
        }

        const accessiblePaths = Object.keys(pathMap);

        return (
            <React.Fragment>

                <Nav/>

                <Router
                    accessiblePaths={accessiblePaths}
                    noMatch={'/'}
                    pathMap={pathMap}/>

            </React.Fragment>
        );
    }
});

const createApp = () => CapsuleProvider()(WithRoutingCapsule);

describe("routing with react test renderer", () => {

    it('renders without crashing', () => {


        const App = createApp();

        const tree = renderer.create(<App/>);

        expect(tree).toMatchSnapshot();


    });

});


describe('it renders the correct component when the location is changed', () => {


    const App = createApp();

    const {container} = render(<App/>);

    const clickIt = (id) => {
        fireEvent.click(getById(container, id));
    };

    const runTest = ({click, startUrl, expected = {}, cb}) =>
        new Promise(resolve => {
            const {endUrl, endName} = expected;


            if (click === 'restricted') {
                // console.log(getLocation().url)
            }


            startUrl && expect(getLocation().url).toBe(startUrl);


            let resolved = false;


            let timeout

            const callback = ({name}) => {
                if (!resolved) {
                    setTimeout()
                    console.log(name)
                    expect(name).toBe(endName);
                    expect(getLocation().url).toBe(endUrl);
                    resolve();
                    cb && cb()
                    resolved = true;
                }
                events.off('mounted', callback);
                clearTimeout(timeout);
            };

            events.on('mounted', callback);

            click && clickIt(click);

            if (!resolved) {

                timeout = setTimeout(() => {
                    if (!resolved) {
                        resolve();
                        expect(getLocation().url).toBe(endUrl);
                    }
                    events.off('mounted', callback);
                }, 1000);

            }

        });


    it('renders the correct route when routed to', () => {

        return runTest({
            startUrl: '/',
            click: 'detail',
            expected: {
                endUrl: '/detail',
                endName: 'Detail'
            }
        });

    });


    it('it does not go to a protected route when routed to', () => {

        // expect.assertions(3);
        return runTest({
            startUrl: '/detail',
            click: 'authOnly',
            expected: {
                endUrl: '/detail',
            }
        });

    });


    // it('it allows a protected route to be accessible upon login', () => {
    //
    //     // expect.assertions(3);
    //     return runTest({
    //         startUrl: '/',
    //         click: 'login',
    //         expected: {
    //             endName: 'AuthOnly',
    //             endUrl: '/authOnly',
    //         }
    //     })
    // });


    // it('it allows another protected route to be accessible when logged in', () => {
    //
    //     // expect(authControls.getLoggedIn()).toBe(true);
    //
    //
    //     return new Promise((resolve=>{
    //
    //         return runTest({
    //             click: 'restricted',
    //             startUrl: '/authOnly',
    //             cb: resolve,
    //             expected: {
    //                 endName: 'Restricted',
    //                 endUrl: '/restricted',
    //             }
    //         });
    //     }))
    // });


    // it('it can navigate back home', () => {
    //     return runTest({
    //         startUrl: '/authOnly',
    //         click: 'home',
    //         expected: {
    //             endName: 'Home',
    //             endUrl: '/',
    //         }
    //     });
    // });
    //
    //
    // it('it can navigate back to the login page when logout is clicked', () => {
    //     return runTest({
    //         startUrl: '/',
    //         click: 'logout',
    //         expected: {
    //             endName: 'Login',
    //             endUrl: '/login',
    //         }
    //     }).then(() => {
    //             expect(authControls.getState().loggedIn).toBe(false);
    //             return runTest({
    //                 startUrl: '/login',
    //                 click: 'authOnly',
    //                 expected: {
    //                     endUrl: '/login',
    //                 }
    //             })
    //         }
    //     );
    //
    // });

});