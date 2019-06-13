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
*routing* shares a similar api as the npm module 'history' but with a slimmer bundle size and includes aditional helpers like what you'd get from 'query-string';
```js
import {routing} from '@iosio/capsule/lib/routing';
const {route, getLocation, listen, goBack, goForward, replace, getParams} = routing;
```

#### route
Use route to change the url pathname and search. 
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
