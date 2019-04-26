import React from 'react';
import {CreateCapsule} from "../src/CreateCapsule";
import renderer from "react-test-renderer";
import {render, fireEvent, cleanup, queryByAttribute} from 'react-testing-library';

import {getById} from "./_test_utils";
import 'jest-dom/extend-expect'

const Printer = (props) => {
    return (
        <div>
            {JSON.stringify(props, null, 4)}
        </div>
    );
};


it(`
provides the expected arguments to logic: actions, store, collective, events.

routing actions and logic are provided to collective by default

returns logic when nothing is passed to the second curried function call

can map state, logic and actions to a component 

component updates with the correct values when logic and action functions are fired 

    `, () => {


    const {Capsule, CapsuleProvider} = CreateCapsule();


    const myStateLogic = Capsule({
        name: 'myCap1',
        initialState: {
            count: 0,
            value: 'initial'
        },
        logic: (logicArguments) => {

            expect(logicArguments).toMatchObject({
                actions: {
                    myCap1: {
                        set: {
                            count: expect.any(Function),
                            value: expect.any(Function),
                        },
                        get: {
                            count: expect.any(Function),
                            value: expect.any(Function),
                        },
                        toggle: {
                            count: expect.any(Function),
                            value: expect.any(Function),
                        },
                        update: expect.any(Function),
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
                logicTest: (val) => {
                    logicArguments.actions.myCap1.set.value(val)
                }
            }

        }

    })();

    expect(myStateLogic).toMatchObject({
        logicTest: expect.any(Function)
    });


    const MyComponent = (props) => {

        expect(props).toMatchObject({
            set: {
                count: expect.any(Function),
                value: expect.any(Function)
            },
            logicTest: expect.any(Function),
            count: expect.any(Number),
            value: expect.any(String),
            cn: expect.any(Function),
            theme: {},
            classes: null
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


                {JSON.stringify(props, null, 4)}
            </div>
        );
    };


    const MyStateLogicComponent = Capsule({
        mapLogic: {myCap1: 'logicTest'},
        mapState: {myCap1: 'count,value'},
        //or optionally use function
        mapActions: ({myCap1}) => ({set: myCap1.set})
    })(MyComponent);


    const App = CapsuleProvider()(({children}) => {

        return (
            <div>
                <MyStateLogicComponent/>
                Hello
            </div>
        )
    });


    const {container} = render(<App/>);

    const setValueBtn = () => getById(container, 'setValue');
    const setCountBtn = () => getById(container, 'setCount');

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
