import React from 'react';
import {createHistory, getPathnameFromString as gpfs, stringifyParams} from "@iosio/history";

export const createRouting = (Capsule) => {

    const history = createHistory();

    const routing = Capsule({
        name: 'routing',
        initialState: {
            ...history.getLocation(),
            accessible: {},
            lastUrl: history.getLocation().url
        },
        logic: ({actions: {routing: {set, get, merge, getState}}, events}) => {

            const LOCATION_CHANGE = '@router/location_change';
            const LOCATION_PATHNAME_CHANGE = '@router/location_pathname_change';
            const LOCATION_PARAMS_CHANGE = '@router/location_params_change';

            let {pathname, search, url} = history.getLocation();

            let last_url = url,
                last_search = search,
                last_pathname = pathname;

            history.listen((loc) => {
                if (loc.url !== last_url) {
                    merge({...loc, lastUrl: last_url});
                    events.emit(LOCATION_CHANGE, loc);
                    loc.pathname !== last_pathname
                    && events.emit(LOCATION_PATHNAME_CHANGE, loc.pathname);
                    loc.search !== last_search
                    && events.emit(LOCATION_PARAMS_CHANGE, loc.params)
                }

                last_url = loc.url;
                last_search = loc.search;
                last_pathname = loc.pathname;
            });

            const setAccessibleRoutes = (paths = {}) => set.accessible(paths);
            const canRoute = (place) => !!get.accessible()[place];
            const route = (path = window.location.pathname, params) => {
                setTimeout(() => {
                    canRoute(gpfs(path))
                    && history.setUrl(path, typeof params === 'object' ? stringifyParams(params) : params);
                });
            };

            return {
                ...history,
                LOCATION_PARAMS_CHANGE,
                LOCATION_PATHNAME_CHANGE,
                LOCATION_CHANGE,
                setAccessibleRoutes,
                route,
            }
        }
    })();


    const Router = Capsule({
        mapLogic: {routing: 'setAccessibleRoutes,replace'},
        mapState: {routing: 'url,pathname,search,params,lastUrl'},
        mapActions: {routing: 'get'}
    })(class RouterComponent extends React.Component {
        constructor(props) {
            super(props);
            props.setAccessibleRoutes(props.accessibleRoutes);
        }

        getCheckedRoute = () => {
            const {
                accessibleRoutes: acc, pathname: pn, get,
                noMatchRedirectTo: noMatch, replace
            } = this.props;
            let C = null, url = get.url(), lastUrl = get.lastUrl(), r = false;
            if (acc[pn]) {
                C = acc[pn];
            } else if (lastUrl !== url && acc[gpfs(lastUrl)]) {
                r = lastUrl;
                C = acc[gpfs(lastUrl)]
            } else if (noMatch && acc[noMatch]) {
                r = noMatch;
                C = acc[noMatch]
            }
            r && setTimeout(() => replace(r));
            return C ? <C/> : null;
        };

        componentDidUpdate(prevProps, prevState, snapshot) {
            const {accessibleRoutes, setAccessibleRoutes} = this.props;
            if (prevProps.accessibleRoutes !== accessibleRoutes) {
                setAccessibleRoutes(accessibleRoutes);
            }
        }

        render() {
            return this.getCheckedRoute()
        }
    });


    const Linkage = Capsule({
        mapState: {routing: 'pathname,search,params,url'},
        mapLogic: {routing: 'route,goTo,canRoute'}
    })(class WithRouting extends React.Component {
        render() {
            const {
                toPath, toParams, href, route,
                //ignore
                cn, pathname, goTo, search, params, url, canRoute, children,
                ...rest
            } = this.props;

            const place = toPath || href;

            return (
                <a href={place}
                   onClick={(e) => {
                       if (toPath) {
                           if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                           if (e.stopPropagation) e.stopPropagation();
                           route(toPath, toParams);
                           e.preventDefault();
                       }
                   }} {...rest}>

                    {this.props.children({...this.props})}
                </a>

            )
        }
    });

    return {
        routing,
        Router,
        Linkage
    }
};
