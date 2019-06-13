# Routing
```js
import {Router, Linkage, routing} from '@iosio/capsule/lib/routing';
```
Capsule exports a minimal HTML5 pushState routing api and Two components: Router, Linkage.

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
