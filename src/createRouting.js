import React, {createElement, useMemo} from 'react';
import {createHistory} from "./createHistory/createHistory";
//what routing adds to capsule: 1.28 KB
//routing bundle size by itself: 2.16 KB (probably cuz of umd/runtime/polyfill stuff
//capsule bundle size by itself: 2.35 KB
//capsule with routing bundle size: 3.63 //probably will be less cuz this is referencing the umd build

/** Determines what route to display
 * and how to handle edge cases.
 * For use in the Router Component*/
export const pathSwitch = ({root, pathMap, replace, pathname: pn, lastPathname: lastPn, lastUrl, noMatch}) => {
    let C;
    //const pathMap = { '/': HomePageComponent, '/profile': ProfilePageComponent };
    pathMap = pathMap || {};  // object for backup
    noMatch = noMatch || '/'; // very common to fallback to '/'
    /*if this is a root router
    use split('/').[1] to grab only base pathname -ex: "/home/detail" => "/home".
    check it against the pathMap with a fallback to the noMatch (most likely "/").
    and then return the component*/
    if (root) C = pathMap['/' + pn.split('/')[1]] || pathMap[noMatch];
    /*anything after is evaluating a child router or a single non-nested router.
     if it simply matches the pathMap, then return it...*/
    else if (pathMap[pn]) C = pathMap[pn];
    /* if not on the path map,
    check if the last pathname is different than the current
    and if the last pathname is valid.
    if so, then return the last component and replace the url with the lastUrl
    (using last url instead of pathname
    because we want to include any query string if they exist*/
    else if (lastPn !== pn && pathMap[lastPn]) {
        replace(lastUrl);
        C = pathMap[lastPn]
    }
    /*if the last path hasn't changed or doesn't exist on the pathMap
    lets try the noMatch fallback*/
    else if (noMatch && pathMap[noMatch]) {
        replace(noMatch);
        C = pathMap[noMatch]
    }
    return C
};


/**@param Capsule - inject capsule to inject routing into the same instance of its collective
 * @returns {{routing: function, Linkage: function, pathSwitch: function, Router: function}}*/
export const createRouting = (Capsule) => {
    let hist = createHistory(),
        initLoc = hist.getLocation();//{pathname,search,params,url}

    return {
        pathSwitch,
        routing: Capsule('routing',
            {...initLoc, lastUrl: initLoc.url, lastPathname: initLoc.pathname},
            ({merge}) => {
                let {url: lastUrl, pathname: lastPathname} = hist.getLocation(),
                    updateLocation = (loc) => {
                        merge({...loc, lastUrl, lastPathname});
                        lastUrl = loc.url;
                        lastPathname = loc.pathname;
                    };
                hist.listen((loc, type) => {
                    type === 'replace'
                        //wait till the router figures itself out during a history replace
                        ? setTimeout(() => {
                            updateLocation(loc)
                        }) : updateLocation(loc);
                });
                return hist//{ route, getLocation, listen, goBack, goForward, replace, getParams }
            }
        )(),
        /**
         * 1-2 level router
         * either a single level, or root and child routers per root route
         *
         * @example
         * // example of nesting
         *
         * //parent in src/root.js
         * <Router
         *    root
         *    noMatch={'/'}
         *    pathMap={pathMap}/>
         *
         * //child in src/divisions/public
         * <Router
         *    noMatch={'/'}
         *    pathMap={pathMap}/>
         *
         * //child in src/divisions/admin
         * <Router
         *    noMatch={'/admin'}
         *    pathMap={pathMap}/>
         *
         */
        Router: Capsule([
            {routing: 'pathname,lastPathname,lastUrl'},
            {routing: 'replace'},
        ])((props) => {
            //run the props through the pathSwitch and pass the component
            const C = pathSwitch(props);
            //only update the memo if the component changes
            return useMemo(() => C ? <C/> : null, [C])
        }),
        /**
         * @example
         * <Linkage>
         * {(locationData)=>(
         *     <MyLinkStuff/>
         * )}
         * </Linkage>
         */
        Linkage: Capsule([
            {routing: 'pathname,search,params,url'},
            {routing: 'route,getSearch'}
        ])((props) => {
            let {route, getSearch, toPath, toParams, href, onClick, children, ...others} = props,
                //ignore these and spread the rest
                {pathname, search, params, url, ...rest} = others,
                //if only href is provided then it will be behave as a normal link < a /> element
                linkProps = {
                    // if there are params, make sure to stringify them if its an object
                    href: toPath + (toParams ? getSearch(toParams) : '') || href,
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

/*The entire router...
const Router = Capsule({
    mapLogic: {routing: 'replace'},
    mapState: {routing: 'pathname,lastPathname,lastUrl'},
})(({root, pathMap, replace, pathname: pn, lastPathname: lastPn, lastUrl, noMatch}) => {
    let C;
    pathMap = pathMap || {};
    noMatch = noMatch || '/';
    if (root) C = pathMap['/' + pn.split('/')[1]] || pathMap[noMatch];
    else if (pathMap[pn]) C = pathMap[pn];
    else if (lastPn !== pn && pathMap[lastPn]) {
        replace(lastUrl);
        C = pathMap[lastPn]
    }
    else if (noMatch && pathMap[noMatch]) {
        replace(noMatch);
        C = pathMap[noMatch]
    }
    return useMemo(() => C ? <C/> : null, [C])
});*/