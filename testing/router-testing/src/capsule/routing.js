import React from 'react';
import {Router as ReactRouter, Route, Switch, Redirect} from 'react-router-dom'
import {createBrowserHistory} from "history";
import qs from 'query-string';
import {isEmpty} from "@iosio/utils/lib/empty_checks";
import {deepClone} from "@iosio/utils/lib/misc";
import {Capsule} from "./index";

/*
    can negate the need to use redux with routing
    by utilizing the same history object when pushing new paths or search params.
    so instead of using BrowserRouter,
    just use Router and provide it the same history you use to navigate with
 */
export const history = createBrowserHistory();

export const routingLogic = Capsule({
    reducer_name: 'routing',
    initial_state: {transitioning: false},
    logic_name: 'routing',
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
})();

export const Router = (props) => <ReactRouter history={history} children={props.children}/>;

const routeFader = (props) => {
    const {className, no_transition, style, ms_delay, transitioning, children} = props;
    return (
        <div className={className}
             style={{
                 ...style,
                 height: '100%',
                 width: '100%',
                 opacity: transitioning && !no_transition ? 0 : 1,
                 transition: `opacity ${
                     ms_delay || ms_delay === 0
                         ? (no_transition ? 0 : ms_delay)
                         : (no_transition ? 0 : 300)}ms ease-in-out`,
             }}>
            {children}
        </div>
    );

};

export const RouteFader = Capsule({
    mapStateToProps: (state) => ({
        transitioning: state.routing.transitioning
    })
})(routeFader);

export { Route, Switch, Redirect};