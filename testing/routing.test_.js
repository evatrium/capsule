// import React from 'react';
// import renderer from 'react-test-renderer';
// import {isShape} from '@iosio/utils/lib/isShape';
//
// import {CapsuleProvider, Capsule} from "../src";
//
// import {TestMain, BaseComponent} from "./capsule_test_components";
//
// import {history, routingLogic, Router, RouteFader, Route, Switch, Redirect} from "../src/routing";
//
//
//
//
//
// let ListPage = (props) => (
//     <div>
//         <span>List Page</span>
//         {Object.keys(props).map((prop, i) => (
//             <p key={i}> prop:{prop}</p>
//         ))}
//     </div>
// );
//
// let DetailPage = (props) => (
//     <div>
//         <span>Detail Page</span>
//         {Object.keys(props).map((prop, i) => (
//             <p key={i}> prop:{prop}</p>
//         ))}
//     </div>
// );
//
//
//
// class AppRouter extends React.Component {
//
//     render() {
//         return (
//             <Router>
//                 <RouteFader>
//                     <Switch>
//
//                         <Route exact path={'/'} component={ListPage}/>
//                         <Route path={'/detail/:id?'} component={DetailPage}/>
//                         <Redirect to={'/'}/>
//
//                     </Switch>
//
//                 </RouteFader>
//             </Router>
//         );
//     }
// }
//
// describe('Routing', () => {
//
//
//     it('it renders without crashing', () => {
//
//
//         const Main = (props) => (
//             <BaseComponent {...props}>
//             </BaseComponent>
//         );
//
//         const CapsuleProvidedApp = CapsuleProvider()(Main);
//
//         const tree = renderer.create(
//             <CapsuleProvidedApp/>
//         );
//
//
//         expect(tree).toMatchSnapshot();
//
//
//     });
// });
