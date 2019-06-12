<p align="center">

<img src="https://raw.githubusercontent.com/iosio/capsule/master/capsuleLogo.svg?sanitize=true"/>
</p>

<br/>

# @iosio/capsule

<img src="https://img.shields.io/circleci/project/github/iosio/capsule.svg?style=flat-square" /><img src="https://img.shields.io/npm/v/@iosio/capsule.svg?style=flat-square" /><img src="https://img.shields.io/bundlephobia/minzip/@iosio/capsule@3.1.5.svg?style=flat-square" />

> Simple global state and convenience tool for React.

## Key Features

- Shared centralized state and logic. 
- No dispatching and no reducers! Uses familiar provider and select-connect pattern.
- Easy api to access and manipulate state (via: get, set, merge, getState) with (opt-out) immutability*.
- As a bonus, capsule exports a simple, ultra light, 1-2 level nested Router component, Link component and a slim navigation API for an extra 1.28KB


## Installation 

```sh
npm install @iosio/capsule --save
```

## Basic Usage

##### Start by including the CapsuleProvider at the root of your app

```js
//index.js
import React from 'react';
import {CapsuleProvider} from '@iosio/capsule';
import {render} from 'react-dom'
import {App} from './App';

 const Root = () => (
    <CapsuleProvider>
        <App/>
    </CapsuleProvider>
);

render(<Root/>, document.querySelector('#root'));

```

##### Use Capsule to create portable logic and state

```js
//logic.js
import {Capsule} from '@iosio/capsule';
import {client} from './client';

export const myTodoLogic = Capsule({
    name: 'myTodos',
    initialState: {
        fetching: false,
        list: [],
    },
    logic: ({set, merge}) => {
        const getSetTodoList = () => {
            set.fetching(true);
            client.getTodos()
                .then((list) =>
                    merge({
                        list,
                        fetching: false
                    }));
        };
        return {getSetTodoList};
    }
})();//<- optionally call the second curried function  
     // if youd like to use the returned logic manually 
     // console.log(myTodoLogic} //logs: {getSetTodoList}
```

##### And use Capsule to connect state and logic to your components.

```js
import React from 'react';
//make sure your isolated logic capsules 
//are in scope somewhere near the root of your app
import './logic'; // <- as in here, a dedicated capsule index, or the app index.js file
import {Capsule} from '@iosio/capsule'
import {LoadingIndicator} from './components/LoadingIndicator';

class AppComponent extends React.Component {
    componentDidMount() {
        this.props.getSetTodosList();
    }
    render() {
        const {list, fetching} = this.props;
        return (
            <div>
                {fetching ?
                    <LoadingIndicator/> :
                    <ul>
                        {list.map((item) => (
                            <li key={item.id}>{item.name}</li>
                        ))}
                    </ul>
                }
            </div>
        )
    }
}
export const App = Capsule({
    // optionally pluck the values off of the namespace with comma separated values
    mapState: {myTodos: 'fetching,list'},
    // or map them with a function
    mapLogic: ({myTodos}) => ({
        getSetTodosList: myTodos.getSetTodosList
    })
})(AppComponent);
```
