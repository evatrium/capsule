
# Routing

Capsule provides a super simple and easy to use router that works for most page per route apps. By including routing into your app, it becomes available in collective (second argument in logic). Make sure to import routing before any other capsules that depend on it, to be safe, your entry file (index.js);

```js
//index.js
import React from 'react';
import '@iosio/capsule/lib/routing; // <---------------- import from /lib/routing
import {CapsuleProvider} from '@iosio/capsule';
import {render} from 'react-dom'
import {App} from './App';

render(<App/>, document.querySelector('#root'));

```
