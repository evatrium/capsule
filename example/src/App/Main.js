import React from "react";
import {Router, RouteFader, Route, Switch, Redirect} from "@iosio/capsule/lib/routing";
import Loadable from 'react-loadable';

import {AppAccess} from "./access/index";
import {Nav} from "./components/Nav";

/*
    -------- LOGIN PAGE ------------
 */

const LoginPage = Loadable({
    loader: () => import('./Pages/LoginPage'),
    loading() {
        return <div>Loading...</div>
    }
});


/*
    -------- APP ROUTES ------------
 */

const DetailView = Loadable({
    loader: () => import('./Pages/DetailView'),
    loading() {
        return <div>Loading...</div>
    }
});

const ListView = Loadable({
    loader: () => import('./Pages/ListView'),
    loading() {
        return <div>Loading...</div>
    }
});


/*
    ----------- LOGGED IN APP ROUTER ------------
 */


class AppRouter extends React.Component {

    render() {
        return (
            <React.Fragment>
                <Nav/>

                <RouteFader >
                    <Switch>

                        <Route exact path={'/'} render={(props) => <ListView {...props}/>}/>
                        <Route path={'/detail/:id?'} render={(props) => <DetailView {...props}/>}/>
                        <Redirect to={'/'}/>

                    </Switch>

                </RouteFader>
            </React.Fragment>
        );
    }
}



export class Main extends React.Component {
    render() {

        return (

            <Router>
                <Switch>

                    <Route path={'/'} render={() =>

                        <AppAccess
                            App={<AppRouter/>}
                            LoginPage={<LoginPage/>}/>
                    }/>

                    {/*  perhaps a product page or about page could go here  */}

                </Switch>
            </Router>

        );
    }
}
