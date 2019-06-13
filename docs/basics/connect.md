
# Connect
Connect the state, logic, and actions you've configured with capsule.

---
Your app would eventually suffer from poor performance if it were re-rendering everytime some state changed. Therefore, you can select which state updates you want your component to listen to. In addition to state, Capsule connects your shared logic and actions the same way.

## Making Selections
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
