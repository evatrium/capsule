
import React from 'react';
// import {Capsule} from "@iosio/capsule";
// import {routingLogic} from "@iosio/capsule/lib/routing";

import {Capsule} from "../../../../../@iosio/capsule";

export const Nested = Capsule({
    reducer_name: 'nested',
    logic_name: 'nested',
    mapStateToProps: (state) =>({...state}),
    mapLogicToProps: (logic) => ({...logic}),
    logic: ({state, collective})=>({
        test: () => {
            console.log(state);
        }
    })
})((props)=>(
    <div onClick={props.nested.test}>
        Nested Component:
        {JSON.stringify(Object.keys(props))}
    </div>
));