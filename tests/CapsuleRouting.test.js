import React, {useEffect} from 'react'
import {createCapsule} from "../src/createCapsule";
import {createRouting} from "../src/createRouting";

import {render, fireEvent} from '@testing-library/react';
import ReactDom from 'react-dom/test-utils';



const {
    CapsuleProvider,
    Capsule,
    events,
    connect
} = createCapsule();

const {
    routing,
    Router,
    Linkage,
    pathSwitch,
} = createRouting(Capsule);


const {getLocation} = routing;


const Page = (props) => {
    useEffect(() => {
        events.emit('mounted')
    }, []);
    return (
        <div {...props}/>
    )
};

const Home = () => (<Page data-testid={'home'}><h1>Home</h1></Page>);
const Detail = () => (<Page data-testid={'detail'}><h1>Detail</h1></Page>);
const Login = () => (<Page data-testid={'login'}><h1>login</h1></Page>);
const Admin = () => (<Page data-testid={'admin'}><h1>Admin</h1></Page>);
const AdminSettings = () => (<Page data-testid={'adminSettings'}><h1>Admin settings</h1></Page>);

export const mainCapsule = Capsule({
    name: 'main',
    initialState: {
        loggedIn: false,
    },
    logic: ({set, merge, getState}, {collective}) => {
        const {routing: r} = collective();
        const login = () => {
            merge({loggedIn: true, admin: true});
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


const Link = ({toPath, toParams, children, id, ...rest}) => (
    <Linkage toPath={toPath} toParams={toParams} id={id} className={'link'} {...rest}>
        {({pathname}) => {

            return (
                <div style={{color: toPath === pathname ? 'red' : 'blue'}}>
                    {children}
                </div>
            );
        }}
    </Linkage>
);


const Nav = Capsule({
    mapLogic: {main: 'logout,login'},
    mapState: {main: 'loggedIn,isAdmin'},
})(({onSubmitText, text, loggedIn, logout, setAdmin, login, isAdmin}) => (
    <nav className={'nav'}>

        <div style={{display: 'flex', justifyContent: 'space-between', padding: 20}}>
            <Link toPath={'/'} data-testid={'homeLink'}>
                goHome
            </Link>
            <Link toPath={'/detail'} data-testid={'detailLink'}>
                goDetail
            </Link>
            <Link toPath={'/login'} data-testid={'loginLink'}>
                goLogin
            </Link>
            <Link toPath={'/admin'} data-testid={'adminLink'}>
                goAdmin
            </Link>
            <Link toPath={'/admin/settings'} data-testid={'adminSettingsLink'}>
                goAdminSetting
            </Link>
        </div>

        <div className={'flexRow'}>
            {loggedIn ?
                <button className={'btn'} data-testid="logoutBtn" onClick={logout}>Logout</button>
                : <button className={'btn'} data-testid="loginBtn" onClick={login}>login</button>
            }

            is Admin: {isAdmin ? "true" : "false"}
        </div>

    </nav>
));


const PublicApp = () => {
    const pathMap = {'/': Home, '/detail': Detail, '/login': Login,};
    return (<Router noMatch={'/'} pathMap={pathMap}/>)
};

const AdminApp = () => {
    const pathMap = {'/admin': Admin, '/admin/settings': AdminSettings,};
    return (<Router noMatch={'/admin'} pathMap={pathMap}/>)
};


const App = Capsule({
    mapState: {main: 'loggedIn'},
})(class App extends React.Component{
    render(){
        const {loggedIn} = this.props;

        let publicPathMap = {
            '/': PublicApp,
        };

        let loggedInPathMap =  {
            ...publicPathMap,
            '/admin': AdminApp
        };

        let pathMap = {};

        if (loggedIn) {
            pathMap = loggedInPathMap
        }else{
            pathMap = publicPathMap;
        }

        return (
            <React.Fragment>
                <Nav/>
                <Router
                    root
                    noMatch={'/'}
                    pathMap={{...pathMap}}/>

            </React.Fragment>
        );
    }
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
