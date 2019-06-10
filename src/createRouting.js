import {createElement, useMemo,} from 'react';
import {createHistory} from "./createHistory/createHistory";


/**
 * For use in the Router Component
 * @param {boolean} root
 * @param {object} pathMap
 * @param {function} replace
 * @param {string} pathname
 * @param {string} lastPn
 * @param {string} lastUrl
 * @param {string} noMatch
 * @returns {*} - Component if path match
 */
export const pathSwitch = ({root, pathMap, replace, pathname: pn, lastPathname: lastPn, lastUrl, noMatch}) => {
    let C;
    /*
        const pathMap = { '/': HomePageComponent, '/profile': ProfilePageComponent };
    */
    pathMap = pathMap || {};  // object for backup
    /*
        if this is a root router
        use split('/').[1] to grab only base pathname -ex: "/home/detail" => "/home".
        check it against the pathMap with a fallback to the noMatch (most likely "/").
        and then return the component
     */
    if (root) C = pathMap['/' + pn.split('/')[1]] || pathMap[noMatch];
    /*
        anything after is evaluating a child router or a single non-nested router.
        if it simply matches the pathMap, then return it...
     */
    else if (pathMap[pn]) C = pathMap[pn];
    /*
        if not on the path map,
        check if the last pathname is different than the current
        and if the last pathname is valid.
        if so, then return the last component and replace the url with the lastUrl
        (using last url because we want to include any query string if they exist
     */
    else if (lastPn !== pn && pathMap[lastPn]) {
        replace(lastUrl);
        C = pathMap[lastPn]
    }
    /*
        if the last path hasn't changed or doesn't exist on the pathMap
        lets try the noMatch fallback
     */
    else if (noMatch && pathMap[noMatch]) {
        replace(noMatch);
        C = pathMap[noMatch]
    }
    return C
};


/**
 * @param Capsule - inject capsule to inject routing into the same instance of its collective
 * @returns {{routing: function, Linkage: function, pathSwitch: function, Router: function}}
 */
export const createRouting = (Capsule) => {

    let hist = createHistory(),

        initLoc = hist.getLocation(),//{pathname,search,params,url}

        routing = Capsule({
            name: 'routing',
            initialState: {
                ...initLoc,
                accessible: [],
                lastUrl: initLoc.url,//use the initial as the last
                lastPathname: initLoc.pathname//use the initial as the last
            },
            logic: ({actions: {routing: {set, get, merge}}}) => {
                let {url: lastUrl, pathname: lastPathname} = hist.getLocation();
                hist.listen((loc) => {
                    //if the url has changed, then update the state
                    if (loc.url !== lastUrl) merge({...loc, lastUrl, lastPathname});
                    lastUrl = loc.url;
                    lastPathname = loc.pathname;
                });
                return {
                    ...hist,//{ setUrl, getLocation, listen, goBack, goForward, replace, getParams }
                    route: hist.setUrl
                }
            }
        })();


    return {

        pathSwitch,
        routing,

        Router: Capsule({
            mapLogic: {routing: 'replace'},
            mapState: {routing: 'pathname,lastPathname,lastUrl'},
            mapActions: {routing: 'set'}
        })(({accessiblePaths: ap, set, ...rest}) => {
            //run the props through the pathSwitch and pass the component
            const C = pathSwitch(rest);
            //only update the memo if the component changes
            return useMemo(() => C ? C() : null, [C])
        }),


        Linkage: Capsule({
            mapState: {routing: 'pathname,search,params,url'},
            mapLogic: {routing: 'route,goTo,canRoute'}
        })((props) => {
            let {toPath, toParams, href, route, onClick, children, ...others} = props,
                {pathname, goTo, search, params, url, canRoute, ...rest} = others,
                //if only href is provided then it will be behave as a normal link <a/> element
                linkProps = {
                    href: toPath || href,
                    onClick: (e) => {
                        if (toPath) {
                            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                            if (e.stopPropagation) e.stopPropagation();
                            route(toPath, toParams);
                            e.preventDefault();
                        }
                        onClick && onClick()
                    },
                    ...rest
                };

            return createElement('a', linkProps, children(props))
        })

    };
};

