# Extras
As referenced to in the [configure](https://github.com/iosio/capsule/blob/master/docs/basics/configure.md) doc, the 'extras' argument in the logic function provides some extra goodies. Some are experimental and you should *[use with caution](#use-with-caution)* however, they may be handy to you.

```js
Capsule({
    ...
    logic: ({get,set,merge,getState}, extras) => { // <--- second argument in logic
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
*destructured*
```js
    ...
    logic: (selfActions, { actions, events, store, collective }) => { 
    ...
``` 
### actions
'actions' is the collection of actions from all capsules. You can use them to manipulate state defined in other capsules.
```js
Capsule({
    name: 'user',
    initialState: {loggedIn: false},
    logic: (selfActions, {actions:{someOtherNamespace}}) => { 
    
        const signIn = () => {
            selfActions.set.loggedIn(true)
            someOtherNamespace.set.status('ONLINE');
        };
        
        return { 
            signIn,
            //...
        };
    },
    ...
``` 
### events
'events' is a synthetic event handler. Can simply be used as another way to communicate between capsules. Inspired by [mitt](https://github.com/developit/mitt/blob/master/src/index.js). You can check out my version of it [here](https://github.com/iosio/utils/blob/master/src/eventer.js) and read the comments for more info.
```js

Capsule({
    name: 'data',
    initialState: {list: []}
    logic: ({set}, {events) => { 
        events.on('USER_STATE_CHANGE',(loggedIn)=>{
            loggedIn && client.getData()
                .then((data)=>{
                    set.list(data);
                })
        });
    },
    ...
  }); 
  
// ---- another capsule

Capsule({
    name: 'user',
    initialState: {loggedIn: false},
    logic: (selfActions, {events}) => { 
    
        const signIn = () => {
            selfActions.set.loggedIn(true)
            events.emit('USER_STATE_CHANGE', true);
        };
        
        return { 
            signIn,
            //...
        };
    },
    ...
``` 
### store
'store' is the most root level accessor of state.
inpired by another one of [developit](https://github.com/developit)'s micro libraries [unistore](https://github.com/developit/unistore/blob/master/src/index.js). You can view my, only slightly differnt, implementation of it [Here](https://github.com/iosio/capsule/blob/master/src/createStore.js) for more info in the comments. 

```js
Capsule({
    ...
    logic: (selfActions, {store}) => { 
        const consoleLogMyAppState = () => {
            console.log(store.getState())
        };
        ...
    },
    ...
``` 
### collective 
'collective' is a function that returns logic from all namespaces. I figured since state is shared, why not share a collection of logic from other capsules. 
```js
Capsule({
    name: 'foo',
    logic: (selfActions, {collective}) => { 
    
        // collective().user.doSomethingElse(); // this wont work because user hasn't been created yet
        
        const xyz = ()=>{
            // this will work after user has been created 
            collective().user.doSomethingElse(); 
        }
        
        const doSomething = () => {
            ...
        };
        
        return { 
            doSomething,
            xyz
            //...
        };
    },
    ...

Capsule({
    name: 'user',
    initialState: {loggedIn: false},
    logic: ({set}, {collective}) => { 
   
        collective().foo.doSomething() // this will work because foo exists in collective
        
        const signIn = () => {
            set.loggedIn(true)
           
        };
        
        const doSomethingElse = ()=> {
            console.log('asdf');
        };
        
        return { 
            signIn,
            doSomethingElse
            //...
        };
    },
    ...
``` 
### use with caution

The **caveat** is that the availability of the logic (or any other collection) you are trying to access is dependent on the invocation order of your capsules. Like I mentioned in the beginning of the doc, its experimental (... probably not that useful), but it can work if your capsules are invoked in a hierarchical order that insures that the predecessor can provide dependencies to the successor.
 
## **OR DON'T MAKE THINGS COMPLICATED**
**and just call the second curried function. This will store the logic into a variable that you can import like any other regular function**

```js
//user.js

export const userLogic = Capsule({
    name: 'user',
    initialState: {loggedIn: false},
    logic: ({set}) => { 

        const signIn = () => {
            set.loggedIn(true)
        };
          
        const doIt = ()=> {
            console.log('asdf');
        };
        
        return { 
            signIn,
            doIt
        };
    },
})(); //<-- this will return your logic



//foo.js

import {userLogic} from './user';

const fooLogic = Capsule({
    name: 'foo',
    logic: () => { 
    
        const doSomething = () => {
            ...
        };
        
        const xyz = ()=>{
            doSomething();
            userLogic.doIt(); //<- bam
        }
        
        return { 
            doSomething,
            xyz
        };
    },
})();
 
``` 
