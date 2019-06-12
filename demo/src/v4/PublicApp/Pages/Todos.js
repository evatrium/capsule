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

export default Capsule({
    name: 'todos',
    initialState: {
        list: initialTodos,
        displayList: initialTodos,
        todoName: '',
        searchValue: '',
        testValue: ''
    },
    logic: ({get, set, merge, getState}) => {

        const removeTodo = (id) => {

            let list = get.list();

            let updatedList = removeItemFromObjArrById(list, 'id', id);

            let searchValue = get.searchValue();

            let displayList = searchValue.length === 0
                ? updatedList
                : filterObjArrByProp(updatedList, 'name', searchValue);

            merge({
                list: updatedList,
                displayList
            });

            set.list(updatedList);
        };

        const setSearchValue = (value) => {
            merge({
                searchValue: value,
                displayList: value.length === 0 ? get.list()
                    : filterObjArrByProp(get.list(), 'name', value)
            });
        };

        const addTodo = (e) => {
            e && e.preventDefault();

            const {list, todoName} = getState();

            list.push({name: todoName, id: count++, completed: false});

            merge({
                list,
                searchValue: '',
                todoName: '',
                displayList: list,
            });
        };

        const captureEnter = (e) => {
            let code = e.keyCode ? e.keyCode : e.which;
            if (code === 13) {
                addTodo()
            }
        };

        return {
            removeTodo,
            setSearchValue,
            captureEnter,
            addTodo
        }

    },
    mapState: {todos: 'displayList,todoName,searchValue,testValue'},
    mapLogic: {todos: 'addTodo,removeTodo,setSearchValue,captureEnter'},
    mapActions: {todos: 'set'},
})(({displayList, todoName, addTodo, removeTodo, setSearchValue, set, searchValue, captureEnter}) => {


    return (
        <div style={{width: '100%', height: '100%', padding: 40, display: 'flex', flexDirection: 'column'}}>


            <Row>
                <input onKeyPress={captureEnter} placeholder="todo name" value={todoName}
                       onChange={(e) => set.todoName(e.target.value)}/>

                <button onClick={addTodo}>Add todo</button>


                <input style={{marginLeft: 20}}
                       placeholder="search todos" value={searchValue}
                       onChange={(e) => setSearchValue(e.target.value)}/>
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
});

