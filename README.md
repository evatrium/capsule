<p align="center">

<img src="https://raw.githubusercontent.com/iosio/capsule/master/capsuleLogo.svg?sanitize=true"/>
</p>

<br/>

# @iosio/capsule

<img src="https://img.shields.io/circleci/project/github/iosio/capsule.svg?style=flat-square" /><img src="https://img.shields.io/npm/v/@iosio/capsule.svg?style=flat-square" /><img src="https://img.shields.io/bundlephobia/minzip/@iosio/capsule@4.0.0.svg?style=flat-square" />

> Simple global state and convenience tool for React.

## Key Features

- Shared centralized state and logic.
- 2KB minified + gzipped.
- No dispatching and no reducers!
- As a bonus, capsule exports a simple, ultra light, 1-2 level nested Router component, Link component and a slim routing API for an extra 1.28KB. See the [routing docs](https://github.com/iosio/capsule/blob/master/docs/routing/README.md) for more info.

## Installation 

```sh
npm install @iosio/capsule --save
```

## Basic Usage

###### *For more info, check out the [docs](https://github.com/iosio/capsule/tree/master/docs) or view the [demo code](https://github.com/iosio/capsule/tree/master/demo/src)*

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
    logic: ({set, merge}) => ({
        getSetTodos: async () => {
            set.fetching(true);
            const list = await client.getTodos();
            merge({fetching: false, list});
        }
    })
})();//<-optionally call curried function to store logic to variable
```

##### And use Capsule to connect state and logic to your components.

```js
//App.js
import React from 'react';
//make sure your isolated logic capsules 
//are in scope somewhere near the root of your app
import './logic'; // <- as in here, a dedicated capsule index, or the app index.js file
import {Capsule} from '@iosio/capsule'
import {LoadingIndicator} from './components/LoadingIndicator';

// make selections by using comma separated values or functions
export const App = Capsule({
    mapState: {myTodos: 'fetching,list'}, 
    mapLogic: ({myTodos}) => ({ getSetTodos: myTodos.getSetTodos })
})(({list, fetching, getSetTodos}) => (
    <div>
        <Button onClick={getSetTodos} text={'GET MY TODOS!'}/>
            {fetching ?
                <LoadingIndicator/> :
                <ul>
                    {list.map((item) => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            }
    </div>
));
```

##### Capsule if flexible 
```js
//demonstrating returned actions if logic property is omitted
const myTodoActions = Capsule({
    name: 'myTodos',
    initialState: {
        fetching: false,
        list: [],
    }
})();

const getSetTodos = async () => {
  const {set, merge} = myTodoActions;
  set.fetching(true);
  const list = await client.getTodos();
  merge({fetching: false, list});
}
```
##### Alternative arguments 
See [Alternative Arguments](https://github.com/iosio/capsule/blob/master/docs/alternative_arguments.md) for more info.
```js
export const myTodoLogic = Capsule('myTodos',
    {fetching: false, list: []},
    ({set, merge}) => ({
        getSetTodos: async () => {
            set.fetching(true);
            const list = await client.getTodos();
            merge({fetching: false, list});
        }
    })
)();
```
### License

[MIT]

[MIT]: https://choosealicense.com/licenses/mit/
