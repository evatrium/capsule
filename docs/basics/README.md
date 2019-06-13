## Basics
### Overview

Capsule keeps a global store of 3 collection objects. 
- state
- logic
- actions

When a capsule is configured, it allocates a namespace on each store;
```js
state = {foo: {/*foo state*/}};
logic = {foo: {/* foo logic}} //also refered to as collective
actions = {foo: {/* foo actions */},}
```
When the Capsule function is called, it configures a new namespace on each store, and allows you to connect to each store.
```js
//foobar.js
Capsule({

    //----- configure -----
    
    name, // namespace string
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
