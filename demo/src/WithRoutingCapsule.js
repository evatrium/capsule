import React from 'react';
import {Capsule} from '../../src';
import {routing} from "../../src/routing";

import {mainCapsule} from "./mainCapsule";

import {Router} from "../../src/routing";


class Page extends React.Component {
    componentDidMount() {
        console.log('mounted Home at this path: ', this.props.url);
    }
    componentWillUnmount() {
        console.log('unmounted page')
    }

    render() {
        return (
            <div className={'page'}>
                <h1> you are here {this.props.url} </h1>
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

    render() {
        return (
            <div className={'page'}>
                <h1> you are here {this.props.url} </h1>
            </div>
        )
    }
}


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
            </form>

            <button className={'btn'} onClick={onSubmitText}> go</button>

            {/*<Link to={'/detail'} params={{id: 3, user: "Joe Dirt"}} render={({pathname}) => (*/}
            {/*<span className={pathname === '/detail/' ? 'currPath' : null}>*/}
            {/*go to detail with params*/}
            {/*</span>*/}
            {/*)}/>*/}


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
            '/login':Page,

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