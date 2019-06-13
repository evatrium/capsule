## Basics
### Overview

Capsule keeps a shared store of 3 collection objects. 
- state
- logic
- actions

When the Capsule function is called, it **configure**s a new namespace on each store, and allows you to **connect** to each collection.
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
