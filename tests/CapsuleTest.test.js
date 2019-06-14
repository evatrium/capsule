import React from 'react';
import {createCapsule} from "../src/createCapsule";

import renderer from "react-test-renderer";
import {render, fireEvent, cleanup, queryByAttribute} from '@testing-library/react';

import {getById} from "./_test_utils";
import 'jest-dom/extend-expect'
import {Capsule} from "../src";


it(`
provides the expected arguments to logic: actions, store, collective, events.

returns logic when nothing is passed to the second curried function call

can map state, logic and actions to a component 

component updates with the correct values when logic and action functions are fired 

    `, () => {


    const {Capsule, CapsuleProvider} = createCapsule();


    const myStateLogic = Capsule({
        name: 'myCap1',
        initialState: {
            count: 0,
            value: 'initial',
            foobar: ''
        },
        logic: (this_actions, collection) => {

            expect(this_actions).toMatchObject({
                set: {
                    count: expect.any(Function),
                    value: expect.any(Function),
                    foobar: expect.any(Function),
                },
                get: {
                    count: expect.any(Function),
                    value: expect.any(Function),
                    foobar: expect.any(Function),
                },
                merge: expect.any(Function),
                getState: expect.any(Function)
            });

            expect(collection).toMatchObject({
                actions: {
                    myCap1: {
                        set: {
                            count: expect.any(Function),
                            value: expect.any(Function),
                            foobar: expect.any(Function),
                        },
                        get: {
                            count: expect.any(Function),
                            value: expect.any(Function),
                            foobar: expect.any(Function),
                        },
                        merge: expect.any(Function),
                        getState: expect.any(Function)
                    },
                },
                store: {
                    setState: expect.any(Function),
                    getState: expect.any(Function),
                    subscribe: expect.any(Function),
                    unsubscribe: expect.any(Function),
                    attachState: expect.any(Function)
                },
                events: {
                    on: expect.any(Function),
                    off: expect.any(Function),
                    once: expect.any(Function),
                    emit: expect.any(Function),
                    destroy: expect.any(Function)
                },
                collective: expect.any(Function)
            });

            return {
                componentReady: () => {
                    this_actions.set.foobar('baz')
                },
                logicTest: (val) => {
                    this_actions.set.value(val)
                }
            }

        }

    })();

    expect(myStateLogic).toMatchObject({
        logicTest: expect.any(Function)
    });


    class MyComponent extends React.Component {
        componentDidMount() {
            this.props.componentReady();
        }

        render() {
            const {props} = this;
            expect(props).toMatchObject({
                set: {
                    count: expect.any(Function),
                    value: expect.any(Function)
                },
                logicTest: expect.any(Function),
                count: expect.any(Number),
                value: expect.any(String),
                foobar: expect.any(String)
            });

            return (
                <div>
                    <button id={'setValue'} onClick={() => {
                        props.logicTest('updated')
                    }}>
                        {props.value}
                    </button>

                    <button id={'setCount'} onClick={() => {
                        props.set.count(props.count + 1)
                    }}>
                        {props.count}
                    </button>

                    <div id={'foobar'}>
                        {props.foobar}
                    </div>

                    {JSON.stringify(props, null, 4)}
                </div>
            );
        }
    }


    const MyStateLogicComponent = Capsule({
        mapState: {myCap1: 'count,value,foobar'},
        mapLogic: {myCap1: 'logicTest,componentReady'},
        //or optionally use function
        mapActions: ({myCap1}) => ({set: myCap1.set})
    })(MyComponent);


    const App = () => {

        return (
            <CapsuleProvider>
                <MyStateLogicComponent/>
                Hello
            </CapsuleProvider>
        )
    };


    const {container} = render(<App/>);

    const setValueBtn = () => getById(container, 'setValue');
    const setCountBtn = () => getById(container, 'setCount');

    const foobar = () => getById(container, 'foobar');

    expect(foobar()).toHaveTextContent('baz');

    expect(setValueBtn()).toHaveTextContent('initial');

    expect(setCountBtn()).toHaveTextContent('0');

    fireEvent.click(setValueBtn());

    expect(setValueBtn()).toHaveTextContent('updated');

    fireEvent.click(setCountBtn());

    expect(setCountBtn()).toHaveTextContent('1');

    fireEvent.click(setCountBtn());

    expect(setCountBtn()).toHaveTextContent('2');

    expect(setValueBtn()).toHaveTextContent('updated');


    const tree = renderer.create(<App/>);

    expect(tree).toMatchSnapshot()

});

it('returns actions if only name and initial state is provided', () => {

    const {Capsule} = createCapsule();


    const userActions = Capsule('user', {
        active: false,
        first_name: '',
        last_name: '',
    })();

    expect(userActions).toMatchObject({
        set: {
            active: expect.any(Function),
            first_name: expect.any(Function),
            last_name: expect.any(Function),
        },
        get: {
            active: expect.any(Function),
            first_name: expect.any(Function),
            last_name: expect.any(Function),
        },
        merge: expect.any(Function),
        getState: expect.any(Function)
    });

});