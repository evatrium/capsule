import React from 'react';
import {Capsule} from './index';
import {createHistory, getPathnameFromString as gpfs} from "@iosio/history";

const history = createHistory();

export const routing = Capsule({
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

        let last_url = url;
        let last_search = search;
        let last_pathname = pathname;

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
        const route = (path, params) => {
            setTimeout(() => {
                canRoute(gpfs(path))
                && history.setUrl(path, params)
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
});


export const Router = Capsule({
    mapLogic: {routing: 'setAccessibleRoutes,replace'},
    mapState: {routing: 'url,pathname,search,params,lastUrl'},
    mapActions: {routing: 'get'}
})(class Router extends React.Component {
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
        return C ? <C url={get.url()}/> : null;
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