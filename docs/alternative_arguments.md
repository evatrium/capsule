# Alternative arguments.

The full configure and connect setup for a capsule looks like this

```js
Capsule({
    name: 'foobar', 
    initialState: { count: 0, asdf: 'xyz' },
    logic : ({merge})=>({ increment: merge( state =>({ count: state.count + 1 }) }),
    mapState: {foobar: 'count'},
    mapLogic: {foobar:'increment'}
    mapActions: {foobar: 'set'}
})(MyComponent); 

```

Alternatively, you may choose to pass each property value as its own argument. 

Capsule will see that the first argument is of type string 
and then will assume each following argument to be in the required order as its defined above

```js
Capsule('foobar', //name
  { count: 0, asdf: 'xyz' }, //initial state
  ({ merge })=>({ increment: merge(state=>({ count: state.count+1 }) }), //logic
  {foobar: 'count'}, //map state
  {foobar:'increment'}, //map logic
  {foobar: 'set'} // map actions
)(MyComponent); 
```
Not every argument is required. Especially if you are just configuring. But the order is still crucial
```js
Capsule('foobar', 
  { count: 0, asdf: 'xyz' },
  ({merge})=>({ increment: merge(state=>({ count: state.count+1 }) }), 
)(MyComponent); 
```

If an array is passed as the first argument, capsule will assume you are connecting and will accept each argument 
in the following order: mapState, mapLogic, mapActions

```js
Capsule(
  [{foobar: 'count'}, {foobar:'increment'}, {foobar: 'set'}]
)(MyComponent);
```
And the order is important as you should pass a falsy value in place if omitting an argument.
```js
Capsule(
  [{foobar: 'count'}, null , {foobar: 'set'}]
)(MyComponent);
//or if just connecting state
Capsule([{foobar: 'count'}])(MyComponent);
```



