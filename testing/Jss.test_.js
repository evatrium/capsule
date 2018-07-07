// import {MainComponent} from "../src/Jss";
// import React from 'react';
// import render from 'react-test-renderer';
// import withStyles from 'react-jss';
//
// import Enzyme from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
//
// Enzyme.configure({adapter: new Adapter()});
//
// import {mount, shallow} from 'enzyme';
//
// import {StoreModule} from "../src/redux-assist";
//
// const theme = {
//     color: {
//         light: '#93ccdc',
//         dark: '#252336'
//     }
// };
//
// const global_styles = () => ({
//     '@global': {
//         '*': {
//             boxSizing: 'border-box',
//         },
//     },
// });
//
// class App extends React.Component {
//
//     componentDidMount() {
//         // console.log(this.props);
//     }
//
//     render() {
//         const {classes, theme_type} = this.props;
//         return (
//             <div>
//                 <h1 className={classes[theme_type]}> Capsule App</h1>
//             </div>
//         )
//     }
// }
//
// App = withStyles((theme) => ({
//     light: {
//         color: theme.color.light,
//     },
//     dark: {
//         color: theme.color.dark
//     }
// }))(App);
//
//
// describe('MainComponent', () => {
//
//
//     describe('snapshots should match', () => {
//         const {reduxAssist, store, connect} = new StoreModule();
//
//         const state_ctrl = reduxAssist('color_theme', {theme_type: 'light'});
//
//         App = connect((state) => ({
//             theme_type: state.color_theme.theme_type
//         }), null)(App);
//
//
//         it('should match snapshot', () => {
//
//             const tree = render.create(
//                 <MainComponent
//                     theme={theme}
//                     global_styles={global_styles}
//                     store={store}
//                 >
//                     <App/>
//                 </MainComponent>
//             );
//
//             expect(tree).toMatchSnapshot();
//
//         });
//
//         it('should match snapshot after updating state', () => {
//
//             state_ctrl.color_theme.set.theme_type('dark');
//             const tree = render.create(
//                 <MainComponent
//                     theme={theme}
//                     global_styles={global_styles}
//                     store={store}
//                 >
//                     <App/>
//                 </MainComponent>
//             );
//
//             expect(tree).toMatchSnapshot();
//
//             state_ctrl.color_theme.set.theme_type('light');
//
//             expect(tree).toMatchSnapshot();
//
//         });
//     });
//
//
//     describe('redux should work as expected', () => {
//
//         const {reduxAssist, store, connect} = new StoreModule();
//
//         const state_ctrl = reduxAssist('color_theme', {theme_type: 'light'});
//
//         App = connect((state) => ({
//             theme_type: state.color_theme.theme_type
//         }), null)(App);
//
//         const component = mount(
//             <MainComponent
//                 theme={theme}
//                 global_styles={global_styles}
//                 store={store}
//             >
//                 <App/>
//             </MainComponent>
//         );
//
//         it('should have the them available as a prop', () => {
//
//             expect(component.instance().props.theme).toEqual({
//                 color: {
//                     light: '#93ccdc',
//                     dark: '#252336'
//                 }
//             });
//
//         });
//
//         it('should pass the expected props to the connected component', () => {
//             const props = component.find(App).instance().selector.props;
//             expect(props.theme_type).toBeTruthy();
//             // expect(props.classes).toBeTruthy();
//         });
//
//         it('should have the expected prop', () => {
//             expect(component.find(App).instance().selector.props.theme_type).toBe('light');
//         });
//
//         it('should have the expected prop after dispatching update', () => {
//
//             state_ctrl.color_theme.set.theme_type('dark');
//
//             expect(component.find(App).instance().selector.props.theme_type).toBe('dark');
//         });
//
//
//     })
//
//
// });