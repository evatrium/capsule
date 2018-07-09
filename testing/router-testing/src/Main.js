import React, {Component} from 'react';
import {Capsule} from "./capsule";

import {Router, routingLogic, history, RouteFader, Redirect, Route, Switch} from "./capsule/routing";

import {typeOf} from '@iosio/utils/lib/type_checks';

import {logic} from "./test_sequence";

@Capsule({
    mapLogicToProps: ({test}) => ({
        getParams: test.getParams,
        set_cur_page: test.set_cur_page
    })
})
class ListPage extends React.Component {

    componentDidMount() {
        const {getParams, set_cur_page} = this.props;
        set_cur_page({page: 'list', params: getParams()})
    }

    render() {
        const {getParams} = this.props;
        return (
            <div>
                <h3>Get Params: {JSON.stringify(getParams())}</h3>
                <h1>List Page</h1>

                <h2>Props</h2>

                {this.props && Object.keys(this.props).map((key, i) => {


                    if (typeOf(this.props[key]) === 'function') {
                        return (<div key={i}>
                            <h4>{key}</h4>
                            {this.props[key].toString()}
                        </div>)
                    }
                    if (typeOf(this.props[key]) === 'object') {
                        return (<div key={i}>
                            <h4>{key}</h4>
                            {JSON.stringify(this.props[key], null, 4)}
                        </div>)
                    }

                })}

            </div>
        )
    }
}

@Capsule({
    mapLogicToProps: ({test}) => ({
        getParams: test.getParams,
        set_cur_page: test.set_cur_page
    })
})
class DetailPage extends React.Component {
    componentDidMount() {
        const {getParams, set_cur_page} = this.props;
        set_cur_page({page: 'detail', params: getParams()})
    }

    render() {
        const {getParams} = this.props;
        return (
            <div>
                <h1>Detail Page</h1>
                <h3>Get Params: {JSON.stringify(getParams())}</h3>
                {Object.keys(this.props).map((key, i) => {

                        if (typeOf(this.props[key]) === 'function') {
                            {
                                this.props[key].toString()
                            }
                        }
                    }
                )}
            </div>
        );
    }
}

@Capsule({
    mapStateToProps: ({test}) => ({
        ms_delay: test.ms_delay,
        no_fade: test.no_fade
    })
})
class AppRouter extends Component {
    render() {
        return (
            <RouteFader no_transition={this.props.no_fade} ms_delay={this.props.ms_delay}>
                <Router>

                    <Switch>
                        <Route exact path={'/'} component={ListPage}/>
                        <Route path={'/detail/:id?'} component={DetailPage}/>
                        <Redirect to={'/'}/>
                    </Switch>

                </Router>
            </RouteFader>
        );
    }
}

@Capsule({
    mapStateToProps: ({test}) => ({...test}),
    mapLogicToProps: ({test}) => ({...test})
})
class Main extends Component {

    state = {
        mount: true,
        detail_id: 123,
        with_transition: true,
    };

    render() {

        const {

            //state
            mount,
            detail_id,
            with_transition,
            ms_delay,

            //logic
            set_mount,
            set_id,
            set_trans,
            set_delay,

            transTo,
            goTo,

        } = this.props;

        const go = with_transition ? transTo : goTo;

        return (
            <React.Fragment>


                <button onClick={() => set_mount(!mount)}>
                    mount
                </button>

                <button onClick={() => set_trans(!with_transition)}>
                    with transition
                </button>

                <button onClick={() => go('/detail', {id: detail_id})}>
                    go to detail
                </button>

                <button onClick={() => go('/')}>
                    go to list
                </button>

                {' '} Detail id : {' '}
                <input value={this.state.detail_id} onChange={(e) => {
                    set_id(e.target.value);
                }}/>
                {' '} Transition delay : {' '}
                <input value={ms_delay} onChange={(e) => {
                    set_delay(e.target.value);
                }}/>


                {mount && <AppRouter/>}

            </React.Fragment>
        );
    }
}

export default Main;



