# routing

```js
import {routing} from '@iosio/capsule/lib/routing';
const {route, getParams, getLocation, listen, goBack, goForward, replace} = routing;

route('/detail', {id:3});
```

#### route
Use 'route' to change the url pathname and search. 
```js
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
//or just search/pathname
route({ search: {id:3} }); 
// passing only the search will use the current location.pathname and append the search
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
#### goBack
Goes to the previous url (just like back button in the browser)
```js
goBack();
```
#### goForward
Goes to the next url in history (just like forward button in the browser)
```js
goForward();
```
