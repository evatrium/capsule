import React, {Component} from 'react';
import {Capsule} from "./capsule";

import {Router, routingLogic, history, RouteFader, Redirect, Route, Switch} from "./capsule/routing";


let ListPage = (props) => (
    <div>
        <span>List Page</span>
        {Object.keys(props).map((prop, i) => (
            <p key={i}> prop:{prop}</p>
        ))}
    </div>
);

let DetailPage = (props) => (
    <div>
        <span>Detail Page</span>
        {Object.keys(props).map((prop, i) => (
            <p key={i}> prop:{prop}</p>
        ))}
    </div>
);


class AppRouter extends Component {
    render() {
        return (
            <Router>
                <RouteFader>
                    <Switch>
                        <Route exact path={'/'} component={ListPage}/>
                        <Route path={'/detail/:id?'} component={DetailPage}/>
                        <Redirect to={'/'}/>
                    </Switch>
                </RouteFader>
            </Router>
        );
    }
}


class Main extends Component {
    render() {
        return (
            <React.Fragment>

            </React.Fragment>
        );
    }
}

export default Main;
