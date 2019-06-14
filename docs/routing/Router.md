
# Router 

In order to maintain simplicity and small bundle size, **this Router is location.pathname based only**, meaning that location.search (ex: ?id=3) changes in the url are ignored. However, you may still utilize location.search for other means.

Routes are simply defined by a key:value pathMap object, where the key is a string pathname and the value is the Component to render. It will automatically match the Component to the pathname in the url. When the user goes to a pathname that is not defined in the pathmap, it will replace history to the last visited url. If the last visited pathname is not a valid key in the pathMap, it will then fall back to '/' (default) or whatever you pass to the noMatch prop.

```js
//Root.js
import React from 'react';
import {CapsuleProvider, Router} from '@iosio/capsule';

import {HomePage} from './Home';
import {ProfilePage} from './Profile';
import {SettingsPage} from './Settings';

const pathMap = {
  '/': HomePage,           // www.myApp.com
  '/profile': ProfilePage, // www.myApp.com/profile
  '/profile/settings': SettingsPage // www.myApp.com/profile/settings
}

export const Root = () =>(
   <Router
      noMatch={'/'}
      pathMap={pathMap}/>
);
```

## Nested Router
This Router will support nested routing, given some rules and constraints to adhere to ( only tested with 2 levels ).

There may be cases where you would like to have parent/child routes, for example, having two seperate apps that you'd like to code split (like a public and an admin app). We'll use the public and admin idea for demonstration. 
You can also just check out a simple example in the [demo code](https://github.com/iosio/capsule/tree/master/demo/src);

Lets start by defining our Public App

```js
//PublicApp.js
...
import {HomePage} from './pages/Home';
import {ProfilePage} from './pages/Profile';
import {SettingsPage} from './pages/Settings';

const pathMap = {
  '/': HomePage,                
  '/profile': ProfilePage, 
  '/profile/settings': SettingsPage
}

export const PublicApp = () =>(
   <Router
      noMatch={'/'}
      pathMap={pathMap}/>
);
```

And then our AdminApp.

**Note:** notice that the pathname keys are all prepended with '/admin'. The noMatch props is also set to '/admin' (to insure that an invalid url will return the user back to '/admin' while on the admin app.

```js
//AdminApp.js
...
import {AdminHome} from './pages/AdminHome';
import {AdminSettings} from './pages/AdminSettings';
import {AdminUsers} from './pages/AdminUsers';

const pathMap = {
  '/admin': HomePage,
  '/admin/settings': AdminSettings,
  '/admin/users': AdminUsers
}

export const AdminApp = () =>(
   <Router
      noMatch={'/admin'}
      pathMap={pathMap}/>
);
```

Finally, create the root Router. Be sure to include the 'root' prop on the Router component:

```js
//Root.js
import React from 'react';
import {Router} from '@iosio/capsule';

import {PublicApp} from './devisions/PublicApp';
import {AdminApp} from './devisions/AdminApp';

const pathMap = {
  '/': PublicApp,
  '/admin': AdminApp,
}

export const Root = () => {
 return (
     <Router
        root
        noMatch={'/'}
        pathMap={pathMap}/>
  );
};

```
What happens behind the scenes with the root Router is that it only extracts and checks against the base pathname or first segment of the pathname in the url (ex: '/admin/settings' => '/admin') and renders the coresponding component for '/admin', then the router for 'AdminApp' will make the next route decission accordingly. 









