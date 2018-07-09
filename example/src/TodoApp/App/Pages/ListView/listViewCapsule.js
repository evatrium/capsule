import React from 'react';
// import {Capsule} from "@iosio/capsule";
// import {routingLogic} from "@iosio/capsule/lib/routing";

import {Capsule} from "../../../../@iosio/capsule";


export const ListViewCapsule = Capsule({
    reducer_name: 'todos',
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
    logic_name: 'list_view',
    logic: ({fakeApi, state, collective}) => ({

        getTodos: () => {
            state.todos.set.fetching_todos(true);
            //delay 1000ms
            collective().fakeApi.getData(1000).then((response) => {
                state.todos.set.fetching_todos(false);
                state.todos.set.list(response.data);
            });
        },
        editTodo: (id) => {
            collective().routing.transTo('/detail', {id});
        }

    }),
    mapStateToProps: (state) => ({
        todos: state.todos.list,
        fetching: state.todos.fetching_todos
    }),
    mapLogicToProps:
        (logic) => ({
            getTodos: logic.list_view.getTodos,
            editTodo: logic.list_view.editTodo
        })

});