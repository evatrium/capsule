<p align="center">

<img src="https://raw.githubusercontent.com/iosio/capsule/master/capsuleLogo.svg?sanitize=true"/>
</p>

<br/>

# @iosio/capsule

<img src="https://img.shields.io/circleci/project/github/iosio/capsule.svg?style=flat-square" /><img src="https://img.shields.io/npm/v/@iosio/capsule.svg?style=flat-square" /><img src="https://img.shields.io/bundlephobia/minzip/@iosio/capsule@3.1.5.svg?style=flat-square" />

> Simple global state, routing and convenience tool for React.


<br/>


The features of this tool (collected from common patterns) reduce
verbose boilerplate code and can be used to promote a common
convention across your application. All for about ~3KB minified + gzipped.

## Key Features

- Shared centralized state and logic. 
- Similar to Redux-like libraries but without all the verbose boilerplate code (No dispatching and no reducers!). Uses familiar provider and connect pattern.
- Automatic action creators provide an easy api to access and manipulate state ( via: get, set, update, merge, toggle, getState ) with fast (opt-out) immutability* out of the box.
- As a bonus includes a simple, ultra light, 1-2 level nested Router component, Link component and a slim routing/history API.

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
    logic: ({actions: {myTodos: {set, merge}}}) => {

        const getSetTodoList = () => {
            set.fetching(true);
            client.getTodos()
                .then((list) =>
                    merge({
                        list,
                        fetching: false
                    }));
        };
        

        return {
            getSetTodoList
        }
    }
})(); 

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
        this.props.getSetList();
    }

    render() {
        const {list, fetching} = this.props;
        return (
            <div>
                {fetching ?
                    <LoadingIndicator/>
                    :
                    <ul>
                        {list.map((item) => (
                            <li key={item.id}>
                                {item.name}
                            </li>
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
        getSetList: myTodos.getSetTodosList
    })
})(AppComponent);

```

## Capsule API

### Overview
The Capsule function is used to configure and connect state.
```js
//foobar.js
Capsule({

    //----- configure -----
    
    name, // string
    initialState, // object
    logic, // function
    
    //----- connect -----
    
    mapState, // object or function
    mapLogic, // object or function
    mapActions, // object or function
    
})(Component); // optional component - depending on use case
```
## Configure

#### name
The 'name' property is a string value used to identify the namespace at which the state, logic and action groups are stored and retrieved from. 
Required if defining initialState or logic.
```js
Capsule({
    name: 'foobar', 
    ...
```
#### initialState
The 'initialState' property is an object that defines the initial values of the state. The root level object keys are used to automatically generate actions with. 
```js
Capsule({
    ...
    initialState: {
        username: '',
        password: '',
        loggedIn: false,
        fizbuz: ''
    }, 
    ...
```
For example, the initialState example above will be used to generate the following actions object on the 'foobar' namespace:
```js
/*generated actions*/
{
    foobar: { 
        get, // { username, password, loggedIn, fizbuz, } functions
        set, // { username, password, loggedIn, fizbuz } functions
// We will cover how each of these can be used to retrieve and manipulate the state in more detail.
        merge, 
        update, 
        getState 
    }
}
```
#### logic
The 'logic' property is a function that is invoked immediately, injecting current and your newly created actions (based on what you defined on the initialState) via the logicCollection argument. Here, you can conveniently orchestrate state manipulations, wrap them in functions and return them for shared use.
```js
Capsule({
    ...
    logic: (logicCollection) => {
        const signIn = () => {
            logicCollection.actions.foobar.set.loggedIn(true)
        };
        //...
        return { 
            signIn,
            //...
        };
    },
    ...
``` 
Destructuring works nicely here:
```js
Capsule({
    ...
    logic: ({actions: {foobar: {set,get}}}) => {
        const signIn = () => {
            set.loggedIn(true)
        };
         const alertSomething = () =>{
            alert(get.fizbuz());
        };
        const setFizbuz = (value) =>{
            set.fizbuz(value);
        };
        return {
            signIn,
            alertSomething,
            setFizbuz
        };
    },
    ...
```
#### Actions via the logicCollection argument
```js
    ...
    logic: ({actions: {foobar: {set, get, merge, update, getState }}}) => { ...
    
```
##### set
'set' contains a setters object that reflects the shape of the initialState object, where each property is a function to set a single value on the state, thus triggering a state update.
```js
    set.loggedIn(true);
    set.password('xyz');
    set.username('skeezyJ');
    set.fizbuz('asdf');
```
##### get
'get' contains a getters object that reflects the shape of the initialState object, where each property is a function that retrieves a single value from the state.
```js
    get.loggedIn();// returns true
    get.password();// returns 'xyz'
    get.username();// returns 'skeezyJ'
    get.fizbuz();// returns 'asdf'
```
##### merge
'merge' is a function that accepts an object to merge multiple property values into the state, thus triggering a state update.
```js
   console.log(getState()) 
   // logs: {loggedIn:true, password: 'xyz', username: 'skeezyJ', fizbuz: 'asdf'}
   merge({
       username: 'joe',
       fizbuz: 'baz'
   });
   console.log(getState()) 
   // logs: {loggedIn:true, password: 'xyz', username: 'joe', fizbuz: 'baz'}
```
##### update
'update' is a function that accepts a callback function that passes the previous state as an argument.

The previous state must be spread back onto the returned state update.
```js
   console.log(getState()) 
   // logs: {loggedIn:true, password: 'xyz', username: 'joe', fizbuz: 'baz'}
   update( prevState =>({
       ...prevState,
       username: 'skeezyJ',
       fizbuz: 'asdf'
   }));
   console.log(getState()) 
   // logs: {loggedIn:true, password: 'xyz', username: 'skeezyJ', fizbuz: 'asdf'}
```
##### getState
'getState' as shown in previous examples.. returns the state object from the namespace 
```js
   console.log(getState()) 
   // logs: {loggedIn:true, password: 'xyz', username: 'skeezyJ', fizbuz: 'asdf'}
```

## Connect

Capsule is pretty flexible in that there are many ways to consume the state, logic and actions. Above we've configured our capsule and now lets test the most straight forward approches to connecting to it to our components. 

If you arn't sure how involved this segment of your app is going to be yet, you can connect your component right along with your configuration. Just pass your component into the second curried function call.
```js
//foobar.js
Capsule({

    //----- configure ----- ... described above
    name,
    initialState,
    logic,
   //----- connect -----
    mapState,
    mapLogic,
    mapActions
   
})(MyAwesomeComponent);// <------ pass a component variable, class, or functional component here

//--------- or alternatively do this -----------


const MyAwesomeComponent = Capsule({

.../*config and connect mappings*/

})((props)=>{
    return(
      <div>
         Hello awesome component...
      </div>
    );
});

```

Or define your capsule logic in a dedicated logic directory and expose the capsule to scope by importing it into your component file or your app entry file.

The following example can be achieved by only using react hooks, however, it is a simple example. As the number of state values increase, the need for better robust state management comes into play. You may also be in favor of separating your logic from the view. 

```js
//MyAwesomeComponent.js
import React from 'react';
import {Capsule} from '@iosio/capsule';
import './foobar.js'

export const MyAwesomeComponent = Capsule({
    // you may use comma separated values to make selections 
    mapState: {foobar: 'fizbuz,loggedIn'},
    // or use a function and return an object
    mapLogic: ({foobar}) => ({
        setFizBuz: foobar.setFizbuz,
        alertSomething: foobar.alertSomething,
    }),
    /*
        alternatively map the 'set' action to update the fizbuz value
       
        mapActions: {foobar: 'set'}
        
    */
})(({loggedIn, alertSomething, fizbuz, setFizbuz}) => {

    return (
        <div>
            {loggedIn ? <span>I AM LOGGED IN!</span> : null}
            
            {/* 
                as stated above, you can map 'set' from actions
                and use: set.fizbuz(e.target.value) 
            */}
            
            <input value={fizbuz} onChange={(e)=>setFizbuz(e.target.value)}/>
            
            <button onClick={alertSomething}>Alert the value!</button>

        </div>
    );
});
```
.... documentation still in work.. to be continued ...
##### mapState
##### mapLogic
##### mapActions
