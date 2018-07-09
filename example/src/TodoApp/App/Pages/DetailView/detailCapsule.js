// import {Capsule} from "@iosio/capsule";
// import {routingLogic} from "@iosio/capsule/lib/routing";

import {Capsule} from "../../../../@iosio/capsule";

export const DetailCapsule = Capsule({
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
            cursor: 'pointer'
        },
    }),
    reducer_name: 'current_todo',
    initial_state: {
        fetching: false
    },
    logic_name: 'detail_view',
    logic: ({ state, collective}) => ({
        getTodo: (cb) => {
            let params = collective().routing.getParams();
            if (params.id) {
                state.current_todo.set.fetching(true);
                //delay 1000ms
                collective().fakeApi.getItemById(params.id, 1000).then((response) => {
                    cb && cb(response.data);
                    state.current_todo.set.fetching(false);
                });
            }
        },
        saveTodo: (todo) => {
            state.current_todo.set.fetching(true);
            //delay 100ms
            collective().fakeApi.updateByItemById(todo, 100).then((response) => {
                collective().routing.transTo('/');
            });
        },
        destroyTodo: (todo) => {
            state.current_todo.set.fetching(true);
            //delay 100ms
            collective().fakeApi.deleteItemById(todo.id, 100).then((response) => {
                collective().routing.transTo('/');
            });
        }
    }),
    mapStateToProps: (state) => ({
        item: state.current_todo.item,
        fetching: state.current_todo.fetching
    }),
    mapLogicToProps: (logic) => ({
        getTodo: logic.detail_view.getTodo,
        saveTodo: logic.detail_view.saveTodo,
        destroyTodo: logic.detail_view.destroyTodo,
    })

});