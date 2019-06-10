import React, {useEffect} from 'react'
import {createCapsule} from "../src/createCapsule";
import {createRouting} from "../src/createRouting";


import {render, fireEvent, queryByAttribute, Simulate} from '@testing-library/react';

import ReactDom from 'react-dom/test-utils';



const {
    CapsuleProvider,
    Capsule,
    events,
    useCapsule,
    connectCapsule
} = createCapsule();

const {
    routing,
    Router,
    Linkage,
    pathSwitch,
} = createRouting(Capsule);


const Page = (props) => {
    useEffect(() => {
        events.emit('mounted')
    }, []);
    return (
        <div {...props}/>
    )
};


const Home = () => (<Page data-testid={'home'}/>);
const Detail = () => (<Page data-testid={'detail'}/>);
const Login = () => (<Page data-testid={'login'}>hhhhhhhheeeellllllllllllloooooooo</Page>);
const Admin = () => (<Page data-testid={'admin'}/>);
const AdminSettings = () => (<Page data-testid={'adminSettings'}/>);


export const mainCapsule = Capsule({
    name: 'main',
    initialState: {
        loggedIn: false,
    },
    logic: ({actions: {main: {set, get, update, merge, toggle, getState}}, collective}) => {

        const {routing: r} = collective();

        const login = () => {
            set.loggedIn(true);
            r.route('/admin')
        };

        const logout = () => {
            set.loggedIn(false);
            r.route('/login');
        };

        return {
            login,
            logout,
            getState,
        }
    }

});


const getById = queryByAttribute.bind(null, 'id');

const {getLocation} = routing;


const Link = ({toPath, toParams, name, id, ...rest}) => (
    <Linkage toPath={toPath} toParams={toParams} id={id} className={'link'} {...rest}>
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

            <Link toPath={'/'} data-testid={'homeLink'}/>
            <Link toPath={'/detail'} data-testid={'detailLink'}/>
            <Link toPath={'/login'} data-testid={'loginLink'}/>
            <Link toPath={'/admin'} data-testid={'adminLink'}/>
            <Link toPath={'/admin/settings'} data-testid={'adminSettingsLink'}/>

        </div>

        <div className={'flexRow'}>
            {loggedIn ?
                <button className={'btn'} data-testid="logoutBtn" onClick={logout}>Logout</button>
                : <button className={'btn'} data-testid="loginBtn" onClick={login}>login</button>
            }
            <button data-testid="toggleAdmin" className={'btn'} onClick={() => setAdmin()}>
                is Admin: {isAdmin ? "true" : "false"}
            </button>
        </div>

    </nav>
));


const PublicApp = () => {

    const pathMap = {
        '/': Home,
        '/detail': Detail,
        '/login': Login,

    };

    return (
        <Router
            noMatch={'/'}
            pathMap={pathMap}
        />
    )
};

const AdminApp = () => {

    const pathMap = {
        '/admin': Admin,
        '/admin/settings': AdminSettings,
    };

    return (
        <Router
            noMatch={'/admin'}
            pathMap={pathMap}
        />
    )
};


const App = Capsule({
    mapLogic: {main: 'login'},
    mapState: {main: 'loggedIn,isAdmin'},
})(({login, loggedIn, isAdmin}) => {


    let accessiblePaths = ['/', '/detail', '/login'];
    let adminPaths = ['/admin', '/admin/settings'];

    let pathMap = {
        '/': PublicApp,
    };

    if (loggedIn) {
        accessiblePaths = [...accessiblePaths, ...adminPaths];
        pathMap = {
            ...pathMap,
            '/admin': AdminApp
        }
    }

    return (
        <React.Fragment>

            <Nav/>

            <Router
                root
                accessiblePaths={accessiblePaths}
                noMatch={'/'}
                pathMap={pathMap}/>

        </React.Fragment>
    );
});




it('it renders the correct component when the location is changed by clicking Links and actions buttons', () => {

    let container, getByTestId;

    let ren = render(
        <CapsuleProvider>
            <App/>
        </CapsuleProvider>
    );
    container = ren.container;
    getByTestId = ren.getByTestId;


    expect(getLocation().url).toBe('/');

    expect(getByTestId('home')).toBeTruthy();

    ReactDom.act(() => {
        fireEvent.click(getByTestId('loginLink'))
    });

    expect(getByTestId('login')).toBeTruthy();
    expect(getLocation().url).toBe('/login');

    ReactDom.act(() => {
        fireEvent.click(getByTestId('detailLink'))
    });

    expect(getByTestId('detail')).toBeTruthy();
    expect(getLocation().url).toBe('/detail');

    ReactDom.act(() => {
        fireEvent.click(getByTestId('adminLink'))
    });

    expect(getByTestId('detail')).toBeTruthy();
    expect(getLocation().url).toBe('/detail');


    ReactDom.act(() => {
        fireEvent.click(getByTestId('loginBtn'))
    });

    expect(getByTestId('admin')).toBeTruthy();
    expect(getLocation().url).toBe('/admin');

    ReactDom.act(() => {
        fireEvent.click(getByTestId('adminSettingsLink'))
    });

    expect(getByTestId('adminSettings')).toBeTruthy();
    expect(getLocation().url).toBe('/admin/settings');


    ReactDom.act(() => {
        fireEvent.click(getByTestId('logoutBtn'))
    });

    expect(getByTestId('login')).toBeTruthy();
    expect(getLocation().url).toBe('/login');


    ReactDom.act(() => {
       routing.setUrl('/invalidPath')
    });

    expect(getByTestId('login')).toBeTruthy();
    expect(getLocation().url).toBe('/login');

});
