import {Capsule} from "@iosio/capsule";
import {routingLogic} from "@iosio/capsule/lib/routing";


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
    logic: ({fakeApi, state}) => {

        const getTodo = (cb) => {
            let params = routingLogic().getParams();
            if (params.id) {
                state.current_todo.set.fetching(true);
                //delay 1000ms
                fakeApi.getItemById(params.id, 1000).then((response) => {
                    cb && cb(response.data);
                    state.current_todo.set.fetching(false);
                });
            }
        };

        const saveTodo = (todo) => {
            state.current_todo.set.fetching(true);
            //delay 100ms
            fakeApi.updateByItemById(todo, 100).then((response) => {
                routingLogic().transTo('/');
            });
        };
        const destroyTodo = (todo) => {
            state.current_todo.set.fetching(true);
            //delay 100ms
            fakeApi.deleteItemById(todo.id, 100).then((response) => {
                routingLogic().transTo('/');
            });
        };
        return {
            getTodo,
            saveTodo,
            destroyTodo
        }
    },
    mapStateToProps: (state) => ({
        item: state.current_todo.item,
        fetching: state.current_todo.fetching
    })

});