import React from 'react';
import renderer from 'react-test-renderer';

import {CapsuleProvider, events} from "./_test_utils/cap1/exports";

import {Till} from "./_test_utils";

const theme = {
    color: {
        primary: 'red',
    },
    mixins: {
        centerize: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        all100: {
            height: '100%',
            width: '100%'
        }
    }
};

const till = Till(events);

describe('CapsuleProvider', () => {


    it(`
asynchronously loads the app without crashing.
verify that:
    theme is passed
    classes are created
    toProps passes data to props
    toLogic passes logic to logic
    routing is available from collective in logic
    `, async () => {

        const App = CapsuleProvider({
            loadApp: () => import('./_test_utils/cap1/LazyLoaded'),
            theme,
            toProps: {propsTest: 'props from provider'},
            toLogic: {toLogicTest: 'logic from provider'},
        })();

        const tree = renderer.create(<App/>);

        await till('mounted').then((data) => {
            expect(data.cn).toBeDefined();
            expect(data.theme.color.primary).toBe('red');
            expect(data.propsTest).toBe('props from provider');
            expect(data.toLogicTest).toBe('logic from provider');
            expect(data.routing).toBeInstanceOf(Object)
        });

        expect(tree).toMatchSnapshot();

    });


});
