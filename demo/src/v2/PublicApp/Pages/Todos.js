import React from 'react';
import {Capsule, useCapsule} from "../../../../../src";
import {removeItemFromObjArrById} from "@iosio/utils/lib/removeItemFromObjArrById";
import {filterObjArrByProp} from "@iosio/utils/lib/filterObjArrByProp";

const todoStubs = ['Make sweet library', 'make cool apps', 'test library', 'go buy dog food', 'register vehicles'];


const Row = ({style, ...rest}) => <div
    style={{display: 'flex', alignItems: 'center', padding: 20, ...style}} {...rest} />;

let count = 0;
const makeTodos = () => {
    return todoStubs.map((name) => ({
        id: count++,
        name,
        completed: false,
    }))
};
const initialTodos = makeTodos();

Capsule({
    name: 'todos',
    initialState: {
        list: initialTodos,
        displayList: initialTodos,
        todoName: '',
        searchValue: '',
        showCompleted: false,
    },
    logic: ({actions: {todos: {get, set, merge, getState}}}) => ({
        removeTodo: (id) => {
            let list = get.list();
            let updatedList = removeItemFromObjArrById(list, 'id', id);

            let searchValue = get.searchValue();

            let displayList = searchValue.length === 0 ? updatedList : filterObjArrByProp(updatedList, 'name', searchValue);

            merge({
                list: updatedList,
                displayList
            });

            set.list(updatedList);
        },
        setSearchValue: (value) => {
            set.searchValue(value);
            let list = get.list();
            const update = filterObjArrByProp(list, 'name', value);
            set.displayList(value.length === 0 ? get.list() : update);
        },
        addTodo: (e) => {
            e && e.preventDefault();

            const {list, todoName} = getState();

            list.push({name: todoName, id: count++, completed: false});

            merge({
                list,
                searchValue: '',
                todoName: '',
                displayList: list,
            });
        }

    }),
});

export default () => {
    /**
     *  when using "useCapsule" versus "Capsule",
     *  mapping all the state and props will happen every time the component mounts.
     *
     *  Ideally, mappings will be created once, prior to the component mounting when using Capsule.
     */
    const [{displayList, searchValue, todoName}, {setSearchValue, removeTodo, addTodo, set}] = useCapsule({
        mapState: {todos: 'displayList,todoName,showCompleted'},
        mapLogic: {todos: 'addTodo,removeTodo,setSearchValue'},
        mapActions: {todos: 'set'}
    });

    return (
        <div style={{width: '100%', height: '100%', padding: 40, display: 'flex', flexDirection: 'column'}}>

            <Row>
                <form onSubmit={addTodo}>
                    <input placeholder="todo name" value={todoName} onChange={(e) => set.todoName(e.target.value)}/>
                    <button onClick={addTodo}>Add todo</button>
                </form>

                <input style={{marginLeft: 20}}
                       placeholder="search todos" value={searchValue} onChange={(e) => setSearchValue(e.target.value)}/>

            </Row>

            {displayList.map((todo) => (
                <Row style={{justifyContent: 'space-between'}} key={todo.id}>
                    <div>{todo.name}</div>
                    <div>{todo.compoleted ? 'completed' : ''}</div>
                    <button onClick={() => removeTodo(todo.id)}>Remove!</button>
                </Row>
            ))}

        </div>
    )
}