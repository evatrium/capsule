import React from 'react';
// import {Capsule} from "@iosio/capsule";
// import {routingLogic} from "@iosio/capsule/lib/routing";

import {Capsule} from "../../../../@iosio/capsule";


export const ListViewCapsule = Capsule({
    reducer_name: 'list_view_state',
    styles: (theme) => ({
        root: {
            paddingTop: theme.nav.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column'
        },
        todo: {
            background: '#19121e',
            padding: 10,
            margin: 10,
            cursor: 'pointer',
            color: 'white'
        }
    }),
    initial_state: {
        list: [],
        fetching_todos: false
    },
    logic_name: 'list_view_logic',
    logic: ({fakeApi, state, collective}) => ({

        getTodos: () => {
            state.list_view_state.set.fetching_todos(true);
            //delay 1000ms
            collective().fakeApi.getData(1000).then((response) => {
                state.list_view_state.set.fetching_todos(false);
                state.list_view_state.set.list(response.data);
            });
        },
        editTodo: (id) => {
            collective().routing.transTo('/detail', {id});
        }

    }),
    mapStateToProps: (state) => ({
        todos: state.list_view_state.list,
        fetching: state.list_view_state.fetching_todos
    }),
    mapLogicToProps:
        (logic) => ({
            getTodos: logic.list_view_logic.getTodos,
            editTodo: logic.list_view_logic.editTodo
        })

});