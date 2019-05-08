import React from 'react';
import {createHistory, getPathnameFromString as gpfs, stringifyParams} from "@iosio/history";

export const createRouting = (Capsule) => {

    const history = createHistory();

    const routing = Capsule({
        name: 'routing',
        initialState: {
            ...history.getLocation(),
            accessible: [],
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

            const setAccessiblePaths = (paths) => set.accessible(paths);

            const canRoute = (path) => !!get.accessible().includes(path);

            const route = (path = window.location.pathname, params) => {
                const validPath = canRoute(gpfs(path));

                setTimeout(() => {
                    validPath &&
                    history.setUrl(path, params ? (typeof params === 'object' ? stringifyParams(params) : params) : '');
                });
                return validPath;
            };

            return {
                ...history,
                LOCATION_PARAMS_CHANGE,
                LOCATION_PATHNAME_CHANGE,
                LOCATION_CHANGE,
                setAccessiblePaths,
                route,
            }
        }
    })();

    const Router = Capsule({
        mapLogic: {routing: 'setAccessiblePaths,replace'},
        mapState: {routing: 'url,pathname,search,params,lastUrl'},
        mapActions: {routing: 'get'}
    })(class RouterComponent extends React.Component {
        constructor(props) {
            super();
            const {setAccessiblePaths, accessiblePaths} = props;
            accessiblePaths && setAccessiblePaths(accessiblePaths);
        }

        getChecked = () => {
            let {
                pathMap, pathname: pn, get,
                noMatch, replace, root
            } = this.props;
            let C = null, url = get.url(), lastUrl = get.lastUrl(), r = false;
            if (root) {
                let bp = '/' + gpfs(url).split('/')[1];
                C = pathMap[bp] || pathMap[noMatch];
            } else {
                if (pathMap[pn]) {
                    C = pathMap[pn];
                } else if (lastUrl !== url && pathMap[gpfs(lastUrl)]) {
                    r = lastUrl;
                    C = pathMap[gpfs(lastUrl)]
                } else if (noMatch && pathMap[noMatch]) {
                    r = noMatch;
                    C = pathMap[noMatch]
                }
            }
            r && setTimeout(() => replace(r));
            return C ? <C/> : null;
        };

        componentDidUpdate(prevProps, prevState, snapshot) {
            const {setAccessiblePaths, accessiblePaths} = this.props;
            accessiblePaths && (prevProps.accessiblePaths !== accessiblePaths)
            && setAccessiblePaths(accessiblePaths);
        }

        render() {
            return this.getChecked()
        }
    });


    const Linkage = Capsule({
        mapState: {routing: 'pathname,search,params,url'},
        mapLogic: {routing: 'route,goTo,canRoute'}
    })(class Linkage extends React.Component {
        render() {
            const {
                toPath, toParams, href, route, onClick,
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
                       onClick && onClick()
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