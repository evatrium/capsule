//---- test helpers
import {typeOf} from '@iosio/utils/lib/type_checks';
import {isShape} from '@iosio/utils/lib/isShape';


//----- redux assist
import {
    createSetActionName,
    createSetter,
    createGetter,
    createSetHandler,
    applySetters,
    applySetterHandlers,
    applyGetters,
    createUpdaterActionName,
    createUpdater,
    applyUpdater,
    createUpdaterHandler,
    applyUpdaterHandler,
    createGetState,
    applyGetState,
    addStateControllers,
    createHandlers,
    createReducer,
    storeCreator,
    StoreModule,
} from "../src/redux-assist"


/*
    tests smaller functions
    followed by more integrated tests towards the end of this pager
 */

describe('redux_assist', () => {

    const staticReducer1 = (state = 0) => state
    const dynamicReducer1 = (state = {integer: 0, string: "test"}) => state;
    const dynamicReducer2 = (state = [0, "test"]) => state;

    const initial_state = {logged_in: false};


    const setter_name = `@app/@access/set_logged_in`;

    const updater_name = `@app/@access/update`;

    const reducer_name = 'access';

    const access = (state = initial_state, action) => {
        if (action.type === setter_name) {
            return {...state, logged_in: action.payload}
        } else {
            return state
        }
    };


    /*
        --------------------- SETTERS ---------------------
     */

    describe('setters', () => {


        it('createSetActionName should create the set action name', () => {
            expect(createSetActionName('access', 'logged_in')).toEqual(setter_name);
        });


        const store = storeCreator({access});
        const setter = createSetter(store, 'access', 'logged_in');
        it('setter should return a function', () => {
            expect(typeOf(setter)).toBe('function');
        });
        it('setter should set the state', () => {
            setter(true);
            expect(store.getState().access.logged_in).toBe(true);
        });

        describe('createSetHandler', () => {

            const handler = createSetHandler('user');

            let state = {user: 'asdf'};

            it('createSetHandler', () => {
                expect(typeOf(handler)).toBe('function');
            });


            it('should modify the state', () => {
                state = handler(state, {payload: 'derp'});
                expect(state).toEqual({user: 'derp'});
            });

        });

        describe('applySetters', () => {

            const store = storeCreator({access});
            let state = {};

            state[reducer_name] = {};

            state = applySetters(store, {logged_in: false}, state, reducer_name);

            it('should return a state controller object with this shape', () => {
                expect(isShape(state, {
                        access: {
                            required: true,
                            type: 'object',
                            shape: {
                                set: {
                                    required: true,
                                    type: 'object',
                                    shape: {
                                        logged_in: {
                                            required: true,
                                            type: 'function'
                                        }

                                    }
                                }
                            }
                        }
                    }
                ).ok).toEqual(true)
            });

            it('setter should modify the state', () => {

                expect(store.getState().access.logged_in).toBe(false);

                state.access.set.logged_in(true);

                expect(store.getState().access.logged_in).toBe(true);
            })

        });


        describe('applySetterHandlers', () => {

            let handlers = {};

            handlers = applySetterHandlers(reducer_name, initial_state, handlers);

            it('should return a handlers object with this shape', () => {
                expect(isShape(handlers, {
                        [setter_name]: {
                            required: true,
                            type: 'function',
                        }
                    }
                ).ok).toEqual(true)
            });


            it('should modify the state', () => {
                let state = handlers[setter_name](initial_state, {payload: false});
                expect(state).toEqual({logged_in: false});
            });

        });


    });


    /*
        -------------- GETTERS ----------------------
     */


    describe('getters', () => {
        const store = storeCreator({access});

        const getter = createGetter(store, 'access', 'logged_in');


        it('getter should return a function', () => {
            expect(typeOf(getter)).toBe('function');
        });

        it('getter should get the state', () => {
            expect(getter()).toBe(false);
        });


        describe('applyGetters', () => {

            const store = storeCreator({access});
            let state = {};

            state[reducer_name] = {};

            state = applyGetters(store, {logged_in: false}, state, reducer_name);

            it('should return a state controller object with this shape', () => {
                expect(isShape(state, {
                        access: {
                            type: 'object',
                            shape: {
                                get: {
                                    type: 'object',
                                    shape: {
                                        logged_in: {
                                            type: 'function'
                                        }

                                    }
                                }
                            }
                        }
                    }
                ).ok).toEqual(true)
            });

            it('setter should get the state', () => {

                expect(state[reducer_name].get.logged_in()).toBe(false);
            })

        });

    });


    /*
        --------------- UPDATER --------------------
     */


    describe('updater', () => {

        it('createUpdaterActionName should create the set action name', () => {
            expect(createUpdaterActionName('access')).toEqual(updater_name);
        });


        let initial = {logged_in: false, name: 'asdf'};
        let action_name = createUpdaterActionName('user');
        const user = (state = initial, action) => {
            if (action.type === setter_name) {
                return {...state, logged_in: action.payload}
            } else {
                return state
            }
        };

        const store = storeCreator({user});

        let state = {};
        state.user = {};


        it('createUpdater should return state in callback function', () => {

            const updater = createUpdater(store, 'user');

            updater((state) => {

                expect(state).toEqual(initial);

                return {
                    ...state,
                    logged_in: true, name: 'derp'
                }
            });

        });


        it('applyUpdater should return object in this shape', () => {

            state = applyUpdater(store, state, 'user');

            expect(isShape(state, {
                user: {
                    type: 'object',
                    update: {
                        type: 'function'
                    }
                }
            }).ok).toEqual(true);

        });


        it('createUpdaterHandler should return type function', () => {
            const handler = createUpdaterHandler();
            expect(typeOf(handler)).toBe('function');
        });


        it('createUpdaterHandler should override the state', () => {
            const handler = createUpdaterHandler();
            let new_state = {asdf: '456'};
            let update = handler(null, {new_state});
            expect(update).toEqual(new_state);
        });


        it('should return a handlers object with this shape', () => {

            let handlers = {};

            handlers = applyUpdaterHandler(reducer_name, handlers);

            expect(isShape(handlers, {
                    [reducer_name]: {
                        type: 'function',
                    }
                }
            ).ok).toEqual(true)


        });


    });


    /*
    -------------- GET STATE ----------------------
 */


    describe('get state', () => {

        const store = storeCreator({staticReducer1}, {zxcv: true});

        let state = {};
        state['staticReducer1'] = {};

        it('createGetState should return a function to get the state', () => {
            const getState = createGetState(store, 'staticReducer1');
            expect(getState()).toBe(0);
        });


        it('applyGetState should return a state controller object and return the state when called', () => {
            state = applyGetState(store, state, 'staticReducer1');
            expect(state['staticReducer1'].getState()).toBe(0);
        });


    });


    /*
        ------------ FINAL COMBINERS  &  CREATE REDUCER -----------------
     */


    describe('final combiners', () => {
        let initial = {logged_in: false, name: 'asdf'};
        const user = (state = initial, action) => {
            if (action.type === setter_name) {
                return {...state, logged_in: action.payload}
            } else {
                return state
            }
        };
        const store = storeCreator({user});

        let state = {};

        state = addStateControllers('user', initial, store, state);

        let handlers = createHandlers('user', initial);

        describe('addStateControllers should work properly', () => {


            it('addStateControllers should return state controller object of this shape', () => {

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

            });

            it('get.logged_in  should show logged in to be false', () => {
                expect(state.user.get.logged_in()).toBe(false);

            });

        });


        describe('createHandlers should work properly', () => {


            it('should return the correct shape', () => {
                expect(isShape(handlers, {
                    '@app/@user/set_logged_in': {
                        type: 'function',
                        required: true,
                    },
                    '@app/@user/set_name': {
                        type: 'function',
                        required: true,
                    },
                    '@app/@user/update': {
                        type: 'function',
                        required: true,
                    },
                }).ok).toBe(true);

            });

        });


        describe('create reducer', () => {

            it('should return an updated state object', () => {

                const reducer = createReducer(initial, handlers);


                let new_state = reducer(initial, {
                    type: '@app/@user/set_logged_in',
                    payload: 'I am now a string'
                });

                expect(new_state).toEqual({
                    logged_in: 'I am now a string',
                    name: 'asdf'
                });


                new_state = reducer(new_state, {
                    type: '@app/@user/update',
                    new_state: {
                        logged_in: 'er mer gherd',
                        name: 'i lerk ghersburmps'
                    }
                });

                expect(new_state).toEqual({
                    logged_in: 'er mer gherd',
                    name: 'i lerk ghersburmps'
                });


            });


        });


    });


    /*
    ---------- STORE CREATION & REDUX ASSIST------------
 */


    describe('STORE CREATION & REDUX ASSIST', () => {

        const staticReducer1 = (state = 0) => state
        const staticReducer2 = (state = 'test') => state
        const dynamicReducer1 = (state = {integer: 0, string: "test"}) => state;
        const dynamicReducer2 = (state = [0, "test"]) => state;


        describe('storeCreator', () => {


            it('should create store object with correct properties', () => {
                const store = storeCreator();
                expect(Object.keys(store)).toEqual(
                    expect.arrayContaining([
                        'dispatch',
                        'subscribe',
                        'getState',
                        'replaceReducer',
                        'attachReducers',
                    ])
                );
            });


            it('should create store with default reducer', () => {
                const store = storeCreator();
                const state = store.getState();
                expect(state).toEqual({"DEFAULT_REDUCER": {}});
            });

            it('should create store with static reducers', () => {

                const store = storeCreator({staticReducer1, staticReducer2});

                const state = store.getState();

                expect(state.staticReducer1).toEqual(0)
                expect(state.staticReducer2).toEqual("test")
            });


            it('should create store with initial state', () => {
                const store = storeCreator({staticReducer1}, {staticReducer1: 1});
                const state = store.getState();

                expect(state.staticReducer1).toEqual(1);
            });


            it('should create store with middleware', () => {
                let called = false;
                const middleware = () => next => action => {
                    called = true;
                    return next(action)
                };

                const store = storeCreator({staticReducer1}, {}, [middleware]);

                store.dispatch({type: "TEST"});

                expect(called).toBe(true);
            });


            it('should create store with initial state and middleware', () => {
                let called = false;
                const middleware = () => next => action => {
                    called = true;
                    return next(action)
                };

                const store = storeCreator({staticReducer1}, {staticReducer1: 1}, [middleware]);
                const state = store.getState();
                store.dispatch({type: "TEST"});

                expect(state.staticReducer1).toEqual(1);

                expect(called).toBe(true);
            });

        });


        describe('new StoreModule', () => {


            const storeModule = new StoreModule();

            it('should have the following members available ', () => {

                expect(Object.keys(storeModule)).toEqual(
                    expect.arrayContaining([
                        'reduxAssist',
                        'store',
                        'state',
                        'connect',
                        'Provider'
                    ])
                )
            });

            const {reduxAssist, store} = storeModule;


            it('should attach dynamic reducer', () => {


                store.attachReducers({'dynamicReducer1':dynamicReducer1});

                const state = store.getState();


                expect(state.dynamicReducer1.integer).toEqual(0);
                expect(state.dynamicReducer1.string).toEqual("test")

            });


            it('should attach multiple dynamic reducers', () => {


                store.attachReducers({'dynamicReducer1': dynamicReducer1});
                store.attachReducers({'dynamicReducer2': dynamicReducer2});


                const state = store.getState();

                expect(state.dynamicReducer1.integer).toEqual(0);
                expect(state.dynamicReducer1.string).toEqual("test");
                expect(state.dynamicReducer2[0]).toEqual(0);
                expect(state.dynamicReducer2[1]).toEqual("test");
            });



            let state_controller = reduxAssist('user', {logged_in: false, name: 'derp'});

            it('redux asssist should create valid state controller', () => {


                expect(isShape(state_controller, {
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


            });



            it('should get and set state', () => {

                expect(state_controller.user.get.name()).toBe('derp');
                state_controller.user.set.name('hello')
                expect(state_controller.user.get.name()).toBe('hello');

            });


            it('should get and update state', () => {

                expect(state_controller.user.getState()).toEqual({logged_in: false, name: 'hello'});
                state_controller.user.update((state)=>({
                    ...state,
                    name: 'foo',
                    logged_in: 'bar'
                }));

                expect(state_controller.user.getState()).toEqual({
                    name: 'foo',
                    logged_in: 'bar'
                });

            });








        });


    });




});

