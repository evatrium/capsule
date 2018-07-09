import React from 'react';
import renderer from 'react-test-renderer';
import {isShape} from '@iosio/utils/lib/isShape';


import {CapsuleModule} from "../src";

import {TestMain, BaseComponent} from "./capsule_test_components";


const theme = {
    color: {
        light: '#93ccdc',
        dark: '#252336'
    }
};

const global_styles = () => ({
    '@global': {
        '*': {
            boxSizing: 'border-box',
        },
    },
});


describe('CapsuleModule', () => {


    describe('Capsule', () => {


        describe('logic', () => {


            it('logic should return logic_data from called capsule if no component is passed', () => {

                const {CapsuleProvider, Capsule} = new CapsuleModule();

                CapsuleProvider()(TestMain);

                const capsule_logic = Capsule({
                    reducer_name: 'user',
                    initial_state: {
                        logged_in: false,
                        name: 'asdf'
                    },
                    logic: () => ({
                        test: () => 'value'
                    })

                })();//called with no component

                expect(capsule_logic.test()).toEqual('value');

            });


            it(`
            when assigned logic_name (namespace),
            logic should be accessible via collective in other capsules`, () => {

                const {CapsuleProvider, Capsule} = new CapsuleModule();

                CapsuleProvider()(TestMain);

                const capsule_logic1 = Capsule({
                    logic_name: 'tester1_namespace',
                    logic: ({collective}) => ({
                        test1_collective: () => {
                            const results = collective().tester2_namespace.test2();
                            // console.log(results)
                            expect(results).toBe('test2-value')
                        },
                        test1_func: () => {
                            return 'test1-value'
                        }
                    })

                })();

                const capsule_logic2 = Capsule({
                    logic_name: 'tester2_namespace',
                    logic: ({collective}) => ({
                        test2_collective: () => {
                            const results = collective().tester1_namespace.test1_func();
                            // console.log(results)
                            expect(results).toBe('test1-value')
                        },
                        test2: () => {
                            return 'test2-value'
                        }
                    })
                })();

                capsule_logic1.test1_collective();
                capsule_logic2.test2_collective();

            });


            it('verify that logic can be mapped to props. (must provide logic_name namespace)', () => {

                const {CapsuleProvider, Capsule} = new CapsuleModule();


                let Component = (props) => (
                    <div>
                        {Object.keys(props).map((prop, i) => (
                            <p key={i}> prop:{prop}</p>
                        ))}
                    </div>
                );

                let CapsuleWrappedComponent = Capsule({
                    reducer_name: 'user',
                    initial_state: {
                        logged_in: false,
                        name: null
                    },
                    logic_name: 'user',
                    logic: ({state}) => ({
                        login: () => {
                            //setting individually just for example
                            state.user.set.logged_in(true);
                            state.user.set.name('Joe Dirt')
                        },
                        logout: () => {
                            state.user.update((state) => ({
                                ...state,
                                logged_in: false,
                                name: null
                            }))
                        }
                    }),
                    mapLogicToProps: (logic) => ({
                        login: logic.user.login,
                        logout: logic.user.logout
                    })
                })(Component);


                const Main = (props) => (
                    <BaseComponent {...props}>
                        <CapsuleWrappedComponent/>
                    </BaseComponent>
                );

                const CapsuleProvidedApp = CapsuleProvider()(Main);

                const tree = renderer.create(
                    <CapsuleProvidedApp/>
                );

                expect(tree).toMatchSnapshot();


                //end Capsule
            });


        });//end describe logic


        describe(`
        redux-assist itself has already been tested.
        Validate that it works in this context.
        `, () => {


            it('should return state controller object of this shape inside of logic', () => {

                const {CapsuleProvider, Capsule} = new CapsuleModule();

                CapsuleProvider()(TestMain);

                Capsule({
                    reducer_name: 'user',
                    initial_state: {
                        logged_in: false,
                        name: 'asdf'
                    },
                    logic: ({state}) => {

                        expect(isShape(state, {
                            user: {
                                type: 'object',
                                required: true,
                                shape: {
                                    set: {
                                        required: true,
                                        type: 'object',
                                        shape: {
                                            logged_in: {
                                                required: true,
                                                type: 'function'
                                            },
                                            name: {
                                                required: true,
                                                type: 'function'
                                            }
                                        }
                                    },
                                    get: {
                                        required: true,
                                        type: 'object',
                                        shape: {
                                            logged_in: {
                                                required: true,
                                                type: 'function'
                                            },
                                            name: {
                                                required: true,
                                                type: 'function'
                                            }
                                        }
                                    },
                                    update: {
                                        required: true,
                                        type: 'function'
                                    }
                                }
                            }
                        }).ok).toBe(true);
                    }

                });
                //end Capsule
            });


            it('verify that state updates on the component and that state is mapped to props', () => {

                const {CapsuleProvider, Capsule} = new CapsuleModule();

                CapsuleProvider()(TestMain);

                let Component = (props) => (
                    <div>
                        {JSON.stringify(props, null, 4)}
                    </div>
                );

                let user_logic = Capsule({
                    reducer_name: 'user',
                    initial_state: {
                        logged_in: false,
                        name: null
                    },
                    logic: ({state}) => ({
                        login: () => {
                            //setting individually just for example
                            state.user.set.logged_in(true);
                            state.user.set.name('Joe Dirt')
                        },
                        logout: () => {
                            state.user.update((state) => ({
                                ...state,
                                logged_in: false,
                                name: null
                            }))
                        }
                    })
                })();

                let ConnectedComponent = Capsule({

                    mapStateToProps: (state) => ({
                        name: state.user.name,
                        logged_in: state.user.logged_in
                    })
                })(Component);

                const Main = (props) => (
                    <BaseComponent {...props}>
                        <ConnectedComponent/>
                    </BaseComponent>
                );

                const CapsuleProvidedApp = CapsuleProvider()(Main);

                const tree = renderer.create(
                    <CapsuleProvidedApp/>
                );

                expect(tree).toMatchSnapshot();

                user_logic.login();

                expect(tree).toMatchSnapshot();

                user_logic.logout();

                expect(tree).toMatchSnapshot();

                //end Capsule
            });


        });//end describe redux-assist


    });//end describe Capsule


    describe('CapsuleProvider', () => {

        it('should should render without crashing. no config, should still pass props', () => {

            const {CapsuleProvider, Capsule} = new CapsuleModule();

            const CapsuleProvidedApp = CapsuleProvider()(TestMain);

            const tree = renderer.create(
                <CapsuleProvidedApp test={"no config"}/>
            );

            expect(tree).toMatchSnapshot();


        });


        it('should provide to props.', () => {

            const {CapsuleProvider, Capsule} = new CapsuleModule();

            const CapsuleProvidedApp = CapsuleProvider({
                provide_to_props: {provide_to_props: 'asdf'}
            })(TestMain);

            const tree = renderer.create(
                <CapsuleProvidedApp/>
            );

            expect(tree).toMatchSnapshot();

        });


        it('should provide theme', () => {

            const {CapsuleProvider, Capsule} = new CapsuleModule();


            let ThemedComponent = (props) => (
                <div className={props}>
                    hello
                </div>
            );

            ThemedComponent = Capsule({
                styles: (theme) => ({
                    title: {
                        color: theme.color.light
                    }
                })
            })(ThemedComponent);

            const Main = (props) => (
                <BaseComponent {...props}>
                    <ThemedComponent/>
                </BaseComponent>
            );

            const CapsuleProvidedApp = CapsuleProvider({
                theme,
            })(Main);

            const tree = renderer.create(
                <CapsuleProvidedApp/>
            );


            expect(tree).toMatchSnapshot();

        });


        it('should provide test_logic to logic via collective ', () => {

            const {CapsuleProvider, Capsule} = new CapsuleModule();


            const CapsuleProvidedApp = CapsuleProvider({
                provide_to_logic: {
                    test_logic: 'test_value'
                }
            })(TestMain);


            let logic_provided_capsule = Capsule({
                logic: ({collective}) => ({
                    get_test_logic: () => {
                        return collective().test_logic
                    }
                })
            })();

            const value = logic_provided_capsule.get_test_logic();
            // console.log('value: ', value)

            expect(value).toEqual('test_value')

        });

    });


});
