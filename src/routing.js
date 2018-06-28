import React from 'react';
import {Router as ReactRouter, Route, Switch, Redirect} from 'react-router-dom'
import {createBrowserHistory} from "history";
import qs from 'query-string';
import {isEmpty} from "@iosio/utils/lib/empty_checks";
import {deepClone} from "@iosio/utils/lib/misc";
import {Capsule} from "./index";

/*
    can negate the need to use redux with routing
    if utilizing the same history object when pushing new paths or search params.
    so instead of using BrowserRouter, just use Router and provide the same history
 */
const history = createBrowserHistory();

const routing = {
    reducer_name: 'routing',
    initial_state: {
        transitioning: false,
    },
    logic: ({state}) => {

        const goTo = (path, search) => {
            if (search && path) {
                history.push({
                    search: qs.stringify(search),
                    pathname: path
                });
            } else if (path && !search) {
                history.push({pathname: path});
            } else if (search && !path) {
                history.push({search: qs.stringify(search)});
            }
        };
        const getParams = (string) => {
            if (!string) {
                string = history.location.search;
            }
            let params = deepClone(qs.parse(string));//check and see if they fixed this
            return isEmpty(params) ? false : params;
        };

        const transTo = (path, search, time = 300) => {
            state.routing.set.transitioning(true);
            setTimeout(() => {
                goTo(path, search);
                state.routing.set.transitioning(false);
            }, time);
        };

        return {
            goTo,
            transTo,
            getParams,
            history,
        }
    }
};

let routingLogic = Capsule(routing);

class router extends React.PureComponent {
    render() {
        return (
            <ReactRouter history={this.props.logic.history} children={this.props.children}/>
        );
    }
}

const Router = Capsule({logic: () => ({history: routingLogic().history})})(router);

class routeFader extends React.PureComponent {
    render() {
        const {classes, className, no_transition, style, ms_delay, transitioning, children, cx} = this.props;
        return (
            <div
                className={cx(
                    classes.root,
                    transitioning && !no_transition ? null : classes.show,
                    className
                )}
                style={{...style, transition: `opacity ${ms_delay ? (no_transition ? 0 : ms_delay ) : (no_transition ? 0 : 300)}ms ease-in-out`,}}>
                {children}
            </div>
        );
    }
}
const RouteFader = Capsule({
    styles: {
        root: {
            height: '100%',
            width: '100%',
            opacity: 0,
        },
        show: {
            opacity: 1,
        },
    },
    mapStateToProps: (state) => ({
        transitioning: state.routing.transitioning
    })
})(routeFader);

export {Router, RouteFader, routingLogic, Route, Switch, Redirect};