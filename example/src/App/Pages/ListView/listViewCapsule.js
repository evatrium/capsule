import React from 'react';
import {Capsule} from "@iosio/capsule";
import {routingLogic} from "@iosio/capsule/lib/routing";

export const ListViewCapsule = Capsule({
    reducer_name: 'todos',
    styles: (theme) => ({
        root: {
            paddingTop: theme.nav.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection:'column'
        },
        todo:{
            background: '#19121e',
            padding: 10,
            margin: 10,
            cursor: 'pointer'
        }

    }),

    initial_state: {
        list: [],
        fetching_todos: false
    },

    logic: ({fakeApi, state}) => {

        const getTodos = () => {
            state.todos.set.fetching_todos(true);
            //delay 1000ms
            fakeApi.getData(1000).then((response) => {
                state.todos.set.fetching_todos(false);
                state.todos.set.list(response.data);
            });
        };

        const editTodo = (id)=>{
            routingLogic().transTo('/detail', {id});
        };


        return {
            getTodos,
            editTodo,
        }
    },
    mapStateToProps: (state) => ({
        todos: state.todos.list,
        fetching: state.todos.fetching_todos
    })

});