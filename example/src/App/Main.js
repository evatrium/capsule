import React from "react";
// import {Router, RouteFader, Route, Switch, Redirect} from "@iosio/capsule/lib/routing";
import {AppAccess} from "./access/index";
import {Router, RouteFader, Route, Switch, Redirect} from "../@iosio/capsule/routing";
import {asyncComponent} from "@iosio/components/lib/asyncComponent";
import {Capsule} from '../@iosio/capsule';
// import ListPage from './Pages/ListView';
// import DetailPage from './Pages/DetailView';


import {Nav} from "./components/Nav";
import {Loading} from "./components/Loading";

/*
    ----------- LOGGED IN APP ROUTER ------------
 */

const ListPage = asyncComponent(() => import('./Pages/ListView'), Loading);
const DetailPage = asyncComponent(() => import('./Pages/DetailView'), Loading);
const LoginPage = asyncComponent(() => import('./Pages/LoginPage'), Loading, 0);

class AppRouter extends React.Component {

    componentDidMount() {
        console.log('app router mounted')
    }

    render() {
        return (
            <React.Fragment>
                <Nav/>

                <RouteFader>
                    <Switch>

                        <Route exact path={'/'} component={ListPage}/>

                        <Route path={'/detail/:id?'} component={DetailPage}/>
                        <Redirect to={'/'}/>

                    </Switch>

                </RouteFader>
            </React.Fragment>
        );
    }
}

@Capsule({
    mapStateToProps: (state)=>({
        logged_in: state.access.logged_in
    })
})
export default class Main extends React.PureComponent{

    componentDidMount() {
        console.log('Main mounted')
        console.log('main componenet logged in ', this.props.logged_in);
    }

    render() {
        console.log('main componenet logged in ', this.props.logged_in);

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

