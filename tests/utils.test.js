import {basicNestedCopy} from "../src/utils";

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