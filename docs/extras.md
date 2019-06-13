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
'collective' is a function that returns logic from all namespaces. I figured since state is shared, why not share a collection of logic from other capsules. **The caveat** is that the availability of the logic you are trying to access is dependent on the invocation order of your capsules.  
```js
Capsule({
    name: 'user',
    initialState: {loggedIn: false},
    logic: ({set}, {collective}) => { 
    
        const signIn = () => {
            set.loggedIn(true)
            
        };
        
        return { 
            signIn,
            //...
        };
    },
    ...
``` 
## use with caution
