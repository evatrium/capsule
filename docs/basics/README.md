## Basics
### Overview

Capsule keeps a global store of 3 collection objects. 
- state
- logic
- actions

When a capsule is configured, it allocates a namespace on each store;
```js
state = {
    foo: {/*foo state*/},
    bar: {/*bar state*/},
};
logic = { //also refered to as collective
    foo: {/* foo logic},
    bar: {/* bar logic}
}
actions = {
    foo: {/* foo actions */},
    bar: {/* bar actions */},
}
```

The Capsule function is used to configure and connect state, logic and actions.
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
- [Configure](https://github.com/iosio/capsule/blob/master/docs/basics/configure.md)
- [Connect](https://github.com/iosio/capsule/blob/master/docs/basics/connect.md)
