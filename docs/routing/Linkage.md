# Linkage
Wraps a component with an anchor tag, routing capabilities and provides render props of location data.
  
If niether of the props 'toPath' or 'toParams' are provided, it will default to the 'href' prop and behave as a normal anchor tag. 
  
If 'toPath' or 'toProps' is provided, the default behavior of the <a> tag is prevented (no browser refresh).

### props
#### toPath
The pathname or full url to route to.
#### toParams
a query string or object  
```js
toParams={{id:3}}
//or
toParams={'?id=3'}
```
#### href
the url you would like to pass to the default behaving <a> tag
  
**Example**
```js
<Linkage toPath='/' toParams={{id:3}}>
    {({url, pathname, search, params})=>(
         <span className={params && params.id === 3 ? 'active' : null}>
           Selection 3
         </span>
    )}
 </Linkage>
 ```
 
 **Reusable example**
 ```js
const Link = (props) =>(
  <Linkage {...props} style={{...myLinkStyles, ...props.style}}>
      {({url, pathname, search, params})=>(
           <span className={pathname === props.toPath ? 'active' : null}>
              {props.children}
           </span>
      )}
  </Linkage>
 );
 ```
