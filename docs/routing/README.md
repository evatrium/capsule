# Routing
Capsule exports a minimal HTML5 pushState routing api and Two components: Router, Linkage for all your basic navigation needs.
```js
import {routing, Router, Linkage} from '@iosio/capsule/lib/routing';
```
**Note:** *Hash routing is not supported*

### Setup
By including routing into your app, a 'routing' namespace will be injected and made available in Capsule. Make sure to import routing before any other capsules that depend on it (to be safe, in your entry file (index.js));

```js
//index.js
import '@iosio/capsule/lib/routing'; // <------ from /lib/routing
import React from 'react';
import {CapsuleProvider} from '@iosio/capsule';
import {render} from 'react-dom'
import {Root} from './Root';

 const App = () => (
    <CapsuleProvider>
        <Root/>
    </CapsuleProvider>
);

render(<App/>, document.querySelector('#root'));
```

### routing
*routing* shares a similar api as the npm module 'history' but with a slimmer bundle size and a few extra helpers;
```js
import {routing} from '@iosio/capsule/lib/routing';
const {route, getParams, getLocation, listen, goBack, goForward, replace} = routing;
```

#### route
Use 'route' to change the url pathname and search. 
```js
// use in multiple ways


// pass a pathname string

route('/list'); 


// pass a pathname string with a search query

route('/detail?id=3');  


// or pass the search query parameters as an object.

route('/detail', {id:3}); // navigates to: '/detail?id=3'


// pass an object like so

route({pathname: '/detail', search: '?id=3'});


// or optionally pass an object to search as well

route({pathname: '/detail', search: {id:3} });
```
#### getParams
Use 'getParams' to get the search/query string as an object. Returns false if non exist or it can't parse the string.
```js
//calling with no args grabs the current location.search from the url

const paramsObject = getParams(); 
console.log(paramsObject); 
//logs {id:3}

//you may also pass a query string
const paramsObject = getParams('?id=3'); 
console.log(paramsObject); 
//logs {id:3}
```
#### getLocation
'getLocation' is a helper that just returns the current location with additional props;
```js
//current url: '/detail?id=3
{
 pathname: '/detail',
 search: '?id=3', 
 params: {id:3}, //returned from 'getParams'
 url: '/detail?id=3'
}
```
#### listen
'listen' subscribes to url changes and triggers a callback function with 'getLocation' data. Returns a function to unlisten.
```js
const unlisten = listen((location)=>{
      console.log(location); // logs the results from 'getLocation'
  });
unlisten(); //unsubscribes 
```


