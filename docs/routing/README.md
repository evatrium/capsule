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

route('/detail', {id:3});

```
Read the [doc](https://github.com/iosio/capsule/blob/master/docs/routing/routing_api.md) for more detail.

### Router
```js
...
import {Router} from '@iosio/capsule/lib/routing';

const pathMap = {
  '/': ListPageComponent,          
  '/detail': DetailPageComponent
}

export const Root = () =>(
<CapsuleProvider>
   <Router
      noMatch={'/'}
      pathMap={pathMap}/>
</CapsuleProvider>
);
```
