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
- [Configure](https://github.com/iosio/capsule/blob/master/docs/basics/configure.md)
- [Connect](https://github.com/iosio/capsule/blob/master/docs/basics/connect.md)
