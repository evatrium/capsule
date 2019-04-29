import React from 'react';
import {Capsule, Router, Linkage} from '../../src';

import {mainCapsule} from "./mainCapsule";


class Page extends React.Component {
    componentDidMount() {
        console.log('mounted Home at this path: ', this.props.url);
    }

    componentWillUnmount() {
        console.log('unmounted page')
    }

    getUrl = ()=>window.location.pathname;

    render() {
        return (
            <div className={'page'}>
                <h1> you are here {this.getUrl()} </h1>
            </div>
        )
    }
}

class Detail extends React.Component {
    componentDidMount() {
        console.log('mounted detail at this path: ', this.props.url);
    }

    componentWillUnmount() {
        console.log('unmounted page')
    }

    getUrl = ()=>window.location.pathname;

    render() {
        return (
            <div className={'page'}>
                <h1> you are here {this.getUrl()} </h1>
            </div>
        )
    }
}


const Link = ({toPath, toParams, name}) => (
    <Linkage toPath={toPath} toParams={toParams} className={'link'}>
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
    mapLogic: {main: 'onSubmitText,setAdmin,logout, login'},
    mapState: {main: 'loggedIn,isAdmin,text'},
    mapActions: {main: 'set'}
})(({onSubmitText, text, set, loggedIn, logout, setAdmin, login, isAdmin}) => (
    <nav className={'nav'}>

        <div className={'flexRow'}>

            <form onSubmit={(e) => {
                e.preventDefault();
                onSubmitText();
            }}>
                <input value={text} onChange={({target}) => set.text(target.value)}/>
                <button className={'btn'} onClick={onSubmitText}> go</button>
            </form>

            <Link toPath={'/'} name={'home'}/>
            <Link toPath={'/detail'} name={'detail'}/>
            <Link toPath={'/authOnly'} name={'authOnly'}/>
            <Link toPath={'/restricted'} name={'restricted'}/>

        </div>

        <div className={'flexRow'}>
            {loggedIn ?
                <button className={'btn'} onClick={logout}>Logout</button>
                : <button className={'btn'} onClick={login}>login</button>
            }
            <button className={'btn'} onClick={() => setAdmin()}>
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
            '/': Page,
            '/detail': Detail,
            '/login': Page,

        };

        const protectedRoutes = {
            '/authOnly': Page,
            '/restricted': Page,
        };

        let accessibleRoutes = {
            ...publicRouts
        };

        if (loggedIn) {
            accessibleRoutes = {
                ...publicRouts,
                ...protectedRoutes
            }
        }


        return (
            <React.Fragment>

                <Nav/>

                <Router
                    noMatchRedirectTo={'/'}
                    accessibleRoutes={accessibleRoutes}/>


            </React.Fragment>
        );
    }
});
export default WithRoutingCapsule;

/*
  {(location) => {
                        const Route = accessibleRoutes[location.pathname];
                        return Route ? <Route url={location.url}/> : null;
                    }}
 */