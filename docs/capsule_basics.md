## Basics
### Overview
The Capsule function is used to configure and connect state and logic.
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
        getState 
    }
}
```
#### logic
The 'logic' property is a function that is invoked immediately, injecting your newly created actions (based on what you defined on the initialState) via the selfActions argument. Here, you can conveniently orchestrate state manipulations, wrap them in functions and return them for shared use. More on the collections argument in the Advanced doc.
```js
Capsule({
    ...
    logic: (selfActions, extras) => {
        const signIn = () => {
            selfActions.set.loggedIn(true)
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
    logic: ({set, get}) => {
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
#### Actions via the selfActions argument
```js
    ...
    logic: ({set, get, merge, getState }) => { ...
    
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
'merge' is a function that accepts an object to merge multiple property values into the state, thus triggering a state update. 'merge' also accepts a callback function that passes the previous state into the argument.
```js
   console.log(getState()) 
   // logs: {loggedIn:true, password: 'xyz', username: 'skeezyJ', fizbuz: 'asdf'}
   
   merge({
       username: 'joe',
       fizbuz: 'baz'
   });
  
   console.log(getState()) 
   // logs: {loggedIn:true, password: 'xyz', username: 'joe', fizbuz: 'baz'}
   
   /* or use a function
    
    merge(state => ({
        count: state.count + 1
    })
   
   */
```
##### getState
'getState' as shown in previous examples.. returns the state object from the namespace 
```js
   console.log(getState()) 
   // logs: {loggedIn:true, password: 'xyz', username: 'skeezyJ', fizbuz: 'asdf'}
```


## Connect

If you arn't sure how involved this segment of your app is going to be yet, you can connect your component right along with your configuration. Just pass your component into the second curried function call.
```js
//foobar.js
Capsule({
    //----- configure ----- ... described in the configure doc
    //name,
    //initialState,
    //logic,
   //----- connect -----
   
    mapState,
    mapLogic,
    mapActions
   
})(MyAwesomeComponent);// <------ pass a component variable, functional component or even a React class

//--------- or this -----------

const MyAwesomeComponent = Capsule({
    mapState: {...},
    mapLogic: {...},
    mapActions: {...}
})((props)=>{ //using an anonymous functional component
    return(
      <div>
         Hello awesome component...
      </div>
    );
});

```

The following example may be achieved by using react hooks instead, however, it's just a simple example. As the number of state values increase, the need for better robust state management comes into play. You may also be in favor of separating your logic from the view. 

```js
//MyAwesomeComponent.js
import React from 'react';
import {Capsule} from '@iosio/capsule';
import './foobar.js' // exposing the configured foobar capsule from the example in configure.md

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
### Making Selections
You can select by using an object with comma separated values, where the properties of the object are the namespaces of the capsules, and the comma separated values are the properties on the state that you want.

Or you may use a callback where the entire state object is returned so that you can map them to a return object. 
```js
 ...
 //as always, you can use destructuring to simplify the selections
 mapState: ({access})=>({
    username: access.username,
    password: access.password
 }),
...
```
Or optionally pass everything from a namespace
```js
 ...
 mapState: ({access})=>({...access}),
...
```
##### mapState
Selects which properties of the state you want to pass to your component
```js
 ...
 mapState: {
    access: 'username,password'
},
...
```
##### mapLogic
Selects which logic functions you want to use from a capsule 
```js
 ...
 mapLogic: {
    access: 'login,logout,setUsername,setPassword',
    routing: 'route'
},
...
```
##### mapActions
Selects which actions you want to use from a capsule. 
```js
 ...
 mapActions: {
    onboardingForm: 'set',
},
...
```
