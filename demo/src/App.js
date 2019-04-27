import React from 'react';
import {Capsule} from '../../src';
import {Router, goTo, Link} from '@iosio/routing';


import {mainCapsule} from "./mainCapsule";





const Page = (props) => {
    return (
        <div className={'page'}>
            <h1>{props.name} </h1>
            {props.aux && props.aux()}
            <br/>
            <br/>
            props: {JSON.stringify(props, null, 4)}

        </div>
    )
};


const App = Capsule({
    mapLogic: {main: 'onSubmitText,setAdmin,login,logout'},
    mapState:{main: 'loggedIn,isAdmin,text'},
    mapActions:{main:'set'}
})(({onSubmitText,setAdmin,login,logout,loggedIn,isAdmin,text, set}) => {


    const LoginButton = () => (
        <button className={'btn'} onClick={login}>
            Login
        </button>
    );

    const routes = [
        {
            path: '/',
            Component: Page,
            name: 'Home Page'
        },
        {
            path: '/detail',
            Component: Page,
            name: 'Detail'
        },
        {
            path: '/authOnly',
            Component: Page,
            authOnly: true,
            name: 'Authenticated only!'
        },
        {
            path: '/restricted',
            Component: Page,
            authOnly: true,
            restricted: {canView: isAdmin},
            name: 'Admin only!'
        },
        {
            path: '/login',
            Component: Page,
            notAuth: true,
            name: 'Login Page',
            aux: () => <LoginButton/>
        }
    ];

    const renderRoutes = () => routes.map(({Component, ...rest}, i) => (
        <Component key={i} {...rest}/>
    ));

    const renderLinks = () => routes.map(({path, name}, i) => (
        <Link to={path} className={'btn'} key={i}>{name}</Link>
    ));

    return (
        <React.Fragment>
            <nav className={'nav'}>

                <div className={'flexRow'}>

                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        onSubmitText();
                    }}>
                        <input value={text} onChange={({target}) => set.text(target.value)}/>
                    </form>

                    <button className={'btn'} onClick={onSubmitText}> go</button>

                    <Link to={'/detail'} params={{id: 3, user: "Joe Dirt"}} render={({pathname}) => (
                        <span className={pathname === '/detail/' ? 'currPath' : null}>
                            go to detail with params
                        </span>
                    )}/>

                    {renderLinks()}

                </div>

                <div className={'flexRow'}>
                    {loggedIn &&
                    <button className={'btn'} onClick={logout}>Logout</button>
                    }
                    <button className={'btn'} onClick={() => setAdmin()}>
                        is Admin: {isAdmin ? "true" : "false"}
                    </button>
                </div>

            </nav>

            <Router
                isAuthenticated={loggedIn}
                onLogoutPath={'/login'}
                onLoginPath={'/authOnly'}
                userChange={isAdmin}
                onUserChangePath={'/'}>

                {renderRoutes()}

            </Router>


        </React.Fragment>
    );
});
export default App;
