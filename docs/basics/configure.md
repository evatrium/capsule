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




### See [Connect](https://github.com/iosio/capsule/blob/master/docs/basics/connect.md) to conenct your components
