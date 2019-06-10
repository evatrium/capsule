import {createStore} from "../src/createStore";
import {createActions} from "../src/createActions";
import {basicNestedCopy} from "../src/utils";


describe('createActions', () => {

    it('should create actions for the given state object', () => {

        const store = createStore();

        let actions = {};

        let initialState = {count: 0, loggedIn: false};

        let actionsName = 'myNamespace';

        store.attachState({[actionsName]: basicNestedCopy(initialState)});

        actions = createActions(actionsName, initialState, store, actions);

        expect(actions).toMatchObject({
            [actionsName]: {
                set: {
                    count: expect.any(Function),
                    loggedIn: expect.any(Function)
                },
                get: {
                    count: expect.any(Function),
                    loggedIn: expect.any(Function)
                },
                toggle: {
                    count: expect.any(Function),
                    loggedIn: expect.any(Function)
                },
                update: expect.any(Function),
                merge: expect.any(Function),
                getState: expect.any(Function)
            }
        });

    })

});


describe('createActions state manipulation', () => {

    const store = createStore();

    let actions = {};

    let initialState = {count: 0, loggedIn: false};

    let actionsName = 'namespace';

    store.attachState({[actionsName]: basicNestedCopy(initialState)});

    createActions(actionsName, initialState, store, actions);

    const {set, get, merge, update, toggle, getState} = actions[actionsName];

    it('action namespace should have getState() which only returns that namespace', () => {

        expect(getState()).toMatchObject(initialState);

    });

    it('should .set() a state value', () => {
        set.count(10);
        expect(get.count()).toBe(10);
        expect(get.loggedIn()).toBe(false);
    });

    it('should .get() the value', () => {

        expect(get.count()).toBe(10);
        expect(get.loggedIn()).toBe(false);
    });

    it('should .merge() properties to the state', () => {

        merge({count: 1, loggedIn: true});
        expect(get.count()).toBe(1);
        expect(get.loggedIn()).toBe(true);

    });

    it('should .update() the state', () => {
        update(state => ({
            ...state,
            count: 1,
            loggedIn: true
        }));

        expect(get.count()).toBe(1);
        expect(get.loggedIn()).toBe(true);

    });

    it('should .toggle() the state', () => {
        toggle.loggedIn();
        expect(get.loggedIn()).toBe(false);
        toggle.loggedIn();
        expect(get.loggedIn()).toBe(true);
    });

});


describe('ensure no mutations happen to the store state', () => {

    const store = createStore();

    let actions = {};

    let initialState = {count: 0, loggedIn: false, arr: ['a', 'b', 'c'], obj: {a: 1, b: 2, c: 3}};

    let actionsName = 'namespace';

    store.attachState({[actionsName]: basicNestedCopy(initialState)});

    createActions(actionsName, initialState, store, actions);

    const {set, get, merge, getState, update} = actions[actionsName];

    it('assigning a value to the initial state does not mutate the store state', () => {

        initialState.loggedIn = 'mutate!';

        initialState.obj.a = 'mutate!';

        expect(getState()).toMatchObject({count: 0, loggedIn: false, arr: ['a', 'b', 'c'], obj: {a: 1, b: 2, c: 3}});
    });

    it('assigning a value to the results from .getState() does not mutate the original state', () => {


        const state = getState();

        state.count = 'mutate!';

        state.arr[0] = 'mutate!';

        expect(getState()).toMatchObject({count: 0, loggedIn: false, arr: ['a', 'b', 'c'], obj: {a: 1, b: 2, c: 3}});

    });

    it('assigning a value to the results from .get() does not mutate the original state', () => {


        let count = get.count();

        count = 'mutate!';

        let arr = get.arr();

        arr[0] = 'mutate!!';


        expect(get.count()).toBe(0);

        expect(getState()).toMatchObject({count: 0, loggedIn: false, arr: ['a', 'b', 'c'], obj: {a: 1, b: 2, c: 3}});

    });


    it('changing a value previously set to state does not mutate the original state', () => {


        let count = 10;

        set.count(count);

        count = 'mutate!';

        expect(get.count()).toBe(10);

        expect(getState()).toMatchObject({count: 10, loggedIn: false, arr: ['a', 'b', 'c'], obj: {a: 1, b: 2, c: 3}});

    });


    it('mutating an array previously set to state does not mutate the original state', () => {

        let _newArr = ['d', 'e', 'f'];

        set.arr(_newArr);

        _newArr[0] = 'mutate!';

        _newArr.unshift();

        expect(get.arr()).toEqual(expect.arrayContaining(['d', 'e', 'f']));

    });



    it('mutating an object previously set to state does not mutate the original state', () => {

        let _newObj = {x: 'a', y: 'b', z: 'c'};

        set.obj(_newObj);

        _newObj.x = 'mutate!';

        expect(get.obj()).toMatchObject({x: 'a', y: 'b', z: 'c'});

    });


    it('mutating a nested object previously merged to state does not mutate the original state', () => {


        let _newNestedObj = {a: 1, b: 2, c: {x: 'm', y: 'u', z: 't'}};

        merge({
            obj: _newNestedObj
        });

        _newNestedObj.c.x = 'mutate!';


        expect(getState()).toMatchObject({
            count: 10,
            loggedIn: false,
            arr: ['d', 'e', 'f'],
            obj: {a: 1, b: 2, c: {x: 'm', y: 'u', z: 't'}}
        });

    });


    it('mutating many variables previously updated on state does not mutate the original state', () => {


        let _newNestedObj = {a: 'asdf', b: 2, c: {x: 'm', y: 'u', z: 't'}};

        let count = null;

        let loggedIn = true;


        update(state =>({
            ...state,
            obj: _newNestedObj,
            count,
            loggedIn,
        }));

        _newNestedObj.c.x = 'mutate!';

        count = 1000000;

        loggedIn = false;

        expect(getState()).toMatchObject({
            count: null,
            loggedIn: true,
            arr: ['d', 'e', 'f'],
            obj: {a: 'asdf', b: 2, c: {x: 'm', y: 'u', z: 't'}}
        });



    });



});










































































