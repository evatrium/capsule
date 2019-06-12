import {basicNestedCopy, convertArguments} from "../src/utils";

describe('basicNestedCopy', () => {

    it('should prevent mutations', () => {
        let initialState = {
            count: 0,
            loggedIn: false,
            arr: ['a', 'b', 'c'],
            obj: {a: 1, b: 2, c: {x: 'm', y: 'u', z: 't'}}
        };

        let copy = basicNestedCopy(initialState);

        initialState.arr[0] = 'mutate!!';

        initialState.obj.a = 'mutate!!';

        initialState.obj.c.z = 'mutate!!';

        expect(copy).toMatchObject({
            count: 0,
            loggedIn: false,
            arr: ['a', 'b', 'c'],
            obj: {a: 1, b: 2, c: {x: 'm', y: 'u', z: 't'}}
        });
    })

});


describe('convertArguments', () => {

    it('if the first argument is a string then it should map the arguments to full capsule config', () => {

        let results = convertArguments(
            'namespace',
            {iAm: 'initialState'},
            () => {
            },
            {iAm: 'mapState'},
            {iAm: 'mapLogic'},
            {iAm: 'mapActions'},
            {iAm: 'options'}
        );

        expect(results).toMatchObject({
            name: 'namespace',
            initialState: {iAm: 'initialState'},
            logic: expect.any(Function),
            mapState: {iAm: 'mapState'},
            mapLogic: {iAm: 'mapLogic'},
            mapActions: {iAm: 'mapActions'},
            options: {iAm: 'options'}
        });
    });

    it('if the first argument is an object then pass return it as is', () => {

        let results = convertArguments({
            name: 'namespace',
            initialState: {iAm: 'initialState'},
            logic: () => {
            },
            mapState: {iAm: 'mapState'},
            mapLogic: {iAm: 'mapLogic'},
            mapActions: {iAm: 'mapActions'},
            options: {iAm: 'options'}
        });

        expect(results).toMatchObject({
            name: 'namespace',
            initialState: {iAm: 'initialState'},
            logic: expect.any(Function),
            mapState: {iAm: 'mapState'},
            mapLogic: {iAm: 'mapLogic'},
            mapActions: {iAm: 'mapActions'},
            options: {iAm: 'options'}
        });
    });


    it('if the first argument is an array then pass back the map properties and options in the expected order', () => {

        let results = convertArguments([
            {iAm: 'mapState'},
            {iAm: 'mapLogic'},
            {iAm: 'mapActions'},
            {iAm: 'options'}
        ]);

        expect(results).toMatchObject({
            mapState: {iAm: 'mapState'},
            mapLogic: {iAm: 'mapLogic'},
            mapActions: {iAm: 'mapActions'},
            options: {iAm: 'options'}
        });
    });

    it('if there are no arguments then return an empty object', () => {

        let results = convertArguments();

        expect(results).toMatchObject({});
    })

});