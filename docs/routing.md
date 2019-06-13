
# Routing

Capsule provides a super simple and easy to use router that works for most page per route apps. By including routing into your app, it becomes available in collective (second argument in logic). Make sure to import routing before any other capsules that depend on it, to be safe, your entry file (index.js);

```js
//index.js
import '@iosio/capsule/lib/routing; // <---------------- import from /lib/routing
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

Routes are simply defined by a pathMap. It will automatically match to the pathname that you assign to in the key. When the user goes to a pathname that is not defined in the pathmap, it will replace history to the last visited route. If the last visited route is also invalid, it will then fall back to '/' or whatever you pass to the noMatch prop.

```js
//Root.js
import React from 'react';
import {CapsuleProvider} from '@iosio/capsule';
import {Router} from '@iosio/capsule/lib/routing';

import {HomePage} from './Home';
import {ProfilePage} from './Profile';
import {SettingsPage from './Settings';

const pathMap = {
  '/': HomePage,
  '/profile': ProfilePage,
  '/settings: SettingsPage
}

export const Root = () =>(
   <Router
      noMatch={'/'}
      pathMap={pathMap}/>
);

```
If you would like to have parent/child routs, include the 'root' prop onto the parent router to get the desired behavior.


```js
//Root.js
import React from 'react';
import {CapsuleProvider} from '@iosio/capsule';
import {Router} from '@iosio/capsule/lib/routing';

import {PublicApp} from './devisions/PublicApp';
import {AdminApp} from './devisions/AdminApp';

const pathMap = {
  '/': PublicApp,
  '/admin': AdminApp
}

export const Root = () =>(
   <Router
      noMatch={'/'}
      pathMap={pathMap}/>
);

```

...docs to be continued












