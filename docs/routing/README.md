# Routing


### Setup
By including routing into your app, a 'routing' namespace will be injected and made available in Capsule. Make sure to import routing before any other capsules that depend on it, to be safe, your entry file (index.js);

 **Note:** *Uses HTML5 pushstate. Hash routing is not supported*

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
