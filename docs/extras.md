# Extras
As referenced to in the [configure](https://github.com/iosio/capsule/blob/master/docs/basics/configure.md) doc, the 'extras' argument in the logic function provides some extra goodies. Some are experimental and you should *[use with caution](#use-with-caution)*, some quite useful.

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
    logic: (selfActions, { actions, events, collective, store }) => { 
    ...
``` 

### use with caution
