
# Connect
Connect the state, logic, and actions you've [configured](https://github.com/iosio/capsule/blob/master/docs/basics/configure.md) with capsule.

---
Select which state updates you want your component to listen to. In addition to state, Capsule connects your shared logic and actions the same way.

## Making Selections
You can select by using an object with comma separated values, where the keys of the object are the namespaces of the capsules, and the comma separated values are the properties on the collection that you want.
```js
 ...
 mapState: { access: 'username,password'},
...
```
Or you may use a callback where the entire collection object is passed to the argument so that you can map them to a return object. 
```js
 ...
 //as always, you can use destructuring to simplify the selections
 mapState: ({access})=>({ username: access.username, password: access.password }),
...
```
##### mapState
Selects which properties of the state you want to pass to your component
```js
 ...
 mapState: {access: 'username,password'},
...
```
##### mapLogic
Selects which logic functions you want to use from a capsule 
```js
 ...
 mapLogic: { access: 'login,logout,setUsername,setPassword', routing: 'route'},
...
```
##### mapActions
Selects which actions you want to use from a capsule. 
```js
 ...
 mapActions: { onboardingForm: 'set'},
...
```
## Connecting to the Component
If you arn't sure how involved this segment of your app is going to be yet, you can connect your component right along with your configuration. Just pass your component into the second curried function call.
```js
//foobar.js

Capsule({
    mapState: {...},
    mapLogic: {...},
    mapActions: {...}
})(MyAwesomeComponent);// <- pass a component variable, functional component or even a React class

```

Conect example

```js
//MyAwesomeComponent.js
import React from 'react';
import {Capsule} from '@iosio/capsule';
import './foobar.js' // exposing the configured foobar capsule from the example in configure.md

export const MyAwesomeComponent = Capsule({
    mapState: {foobar: 'fizbuz,loggedIn'},
    mapLogic: ({foobar}) => ({
        setFizBuz: foobar.setFizbuz,
        alertSomething: foobar.alertSomething,
    }),
})(({loggedIn, alertSomething, fizbuz, setFizbuz}) => (
    <div>
        {loggedIn ? <span>I AM LOGGED IN!</span> : null}
        <input value={fizbuz} onChange={(e)=>setFizbuz(e.target.value)}/>
        <button onClick={alertSomething}>Alert the value!</button>
    </div>
));
```
