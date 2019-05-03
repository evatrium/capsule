// import React from 'react';
// import {createHistory, getPathnameFromString as gpfs, stringifyParams} from "@iosio/history";
//
//
// const getRankedMatch = (url, pathNames) => {
//     let match = false;
//     const upUntilAsterisk = (path) =>
//         path.indexOf('*') > -1 ? path.match(/.+?(?=\*)/)[0] : path;
//     const urlParts = url.split('/');
//     urlParts.shift();
//     for (let i = 0; i < urlParts.length; i++) {
//         for (let k = 0; k < pathNames.length; k++) {
//             if (pathNames[k].indexOf('*') > -1) {
//                 const matchParts = upUntilAsterisk(pathNames[k]).split('/');
//                 matchParts.shift();
//                 for (let j = 0; j < matchParts.length; j++){
//                     if (urlParts[i] === matchParts[j]){
//                         match = pathNames[k];
//                     }else{
//                         console.log('parts not matching',urlParts[i] , matchParts[j])
//                     }
//                 }
//
//             }
//         }
//     }
//     return match;
// };
//
//
// export const createRouting = (Capsule) => {
//
//     const history = createHistory();
//
//     const routing = Capsule({
//         name: 'routing',
//         initialState: {
//             ...history.getLocation(),
//             accessible: [],
//             lastUrl: history.getLocation().url,
//             specials: {}
//         },
//         logic: ({actions: {routing: {set, get, merge, getState}}, events}) => {
//
//             const LOCATION_CHANGE = '@router/location_change';
//             const LOCATION_PATHNAME_CHANGE = '@router/location_pathname_change';
//             const LOCATION_PARAMS_CHANGE = '@router/location_params_change';
//
//             let {pathname, search, url} = history.getLocation();
//
//             let last_url = url,
//                 last_search = search,
//                 last_pathname = pathname;
//
//             history.listen((loc) => {
//                 if (loc.url !== last_url) {
//                     merge({...loc, lastUrl: last_url});
//                     events.emit(LOCATION_CHANGE, loc);
//                     loc.pathname !== last_pathname
//                     && events.emit(LOCATION_PATHNAME_CHANGE, loc.pathname);
//                     loc.search !== last_search
//                     && events.emit(LOCATION_PARAMS_CHANGE, loc.params)
//                 }
//
//                 last_url = loc.url;
//                 last_search = loc.search;
//                 last_pathname = loc.pathname;
//             });
//
//             const canRoute = (place) => {
//                 console.log(place, Object.keys(get.specials()), getRankedMatch(place, get.specials()));
//
//                 return get.accessible().includes(place) || getRankedMatch(place, Object.keys(get.specials()));
//             };
//
//             const route = (path, params) => {
//                 setTimeout(() => {
//                     const can = canRoute(gpfs(path))
//                     console.log('can route,', can);
//                     can && history.setUrl(
//                         path || window.location.pathname,
//                         typeof params === 'object' ? stringifyParams(params) : params
//                     );
//                 });
//             };
//
//             const setSpecials = (specials) => {
//                 set.specials({...get.specials(), ...specials})
//             };
//
//             return {
//                 ...history,
//                 LOCATION_PARAMS_CHANGE,
//                 LOCATION_PATHNAME_CHANGE,
//                 LOCATION_CHANGE,
//                 route,
//                 setSpecials
//             }
//         }
//
//     })();
//
//
//     const Router = Capsule({
//         mapLogic: {routing: 'setAccessibleRoutes,replace,setSpecials'},
//         mapState: {routing: 'url,pathname,search,params,lastUrl'},
//         mapActions: {routing: 'get,set'}
//     })(class RouterComponent extends React.Component {
//
//         constructor(props) {
//             super(props);
//             const {root, accessiblePaths, set, pathMap, setSpecials} = props;
//             if (Array.isArray(accessiblePaths)) {
//                 set.accessible(accessiblePaths);
//             }
//             if (root && pathMap) {
//                 setSpecials(pathMap)
//             }
//         }
//
//         componentDidMount() {
//             console.log('component did mount')
//             const {accessiblePaths, pathMap, set, root, setSpecials} = this.props;
//
//             accessiblePaths && set.accessible(accessiblePaths);
//             root && pathMap && setSpecials(pathMap)
//         }
//
//         getCheckedRoute = () => {
//             const {
//                 accessiblePaths,
//                 pathMap: acc,
//                 pathname: pn,
//                 get,
//                 noMatchRedirectTo: noMatch,
//                 replace,
//             } = this.props;
//
//             let C = null, url = get.url(), lastUrl = get.lastUrl(), r = false;
//
//             const special = getRankedMatch(pn, Object.keys(acc));
//             console.log('special?', special)
//
//             if (special && acc[special]) {
//                 C = acc[special];
//             } else if (acc[pn]) {
//                 C = acc[pn];
//             } else if (lastUrl !== url && acc[gpfs(lastUrl)]) {
//                 r = lastUrl;
//                 C = acc[gpfs(lastUrl)]
//             } else if (noMatch && acc[noMatch]) {
//                 r = noMatch;
//                 C = acc[noMatch]
//             }
//             r && setTimeout(() => replace(r));
//             return C ? <C/> : null;
//         };
//
//         componentDidUpdate(prevProps, prevState, snapshot) {
//             const {accessiblePaths, set, pathMap, setSpecials} = this.props;
//             if (!Array.isArray(accessiblePaths)) return;
//             if (prevProps.accessiblePaths !== accessiblePaths) {
//                 set.accessible(accessiblePaths);
//             }
//
//             if (prevProps.pathMap !== pathMap) {
//                 setSpecials(pathMap)
//             }
//         }
//
//         render() {
//             return this.getCheckedRoute()
//         }
//
//     });
//
//
//     const Linkage = Capsule({
//         mapState: {routing: 'pathname,search,params,url'},
//         mapLogic: {routing: 'route,goTo,canRoute'}
//     })(class WithRouting extends React.Component {
//         render() {
//             const {
//                 toPath, toParams, href, route,
//                 //ignore
//                 cn, pathname, goTo, search, params, url, canRoute, children,
//                 ...rest
//             } = this.props;
//
//             const place = toPath || href;
//
//             return (
//                 <a href={place}
//                    onClick={(e) => {
//                        if (toPath) {
//                            if (e.stopImmediatePropagation) e.stopImmediatePropagation();
//                            if (e.stopPropagation) e.stopPropagation();
//                            route(toPath, toParams);
//                            e.preventDefault();
//                        }
//                    }} {...rest}>
//
//                     {this.props.children({...this.props})}
//                 </a>
//
//             )
//         }
//     });
//
//     return {
//         routing,
//         Router,
//         Linkage
//     }
// };
