# IOSIO Capsule
<img src="https://img.shields.io/circleci/project/github/iosio/capsule.svg" />


<br/>

> Simple state, styles, and convenience tool for React.
 

Under the hood, Capsule is a wrapper around existing libraries
(currenty) which provides an abstracted api for features
such as state access and manipulation(via redux), maintaining 
styles (via css-in-js theming) and optional routing.
The features of this tool (collected from common patterns) reduce
verbose boilerplate code and can be used to promote a common
convention across your application.



#### Installation 

```sh
npm i -S @iosio/capsule
```



#### Basic Usage


Begin by configuring the CapsuleProvider at the most root level 
of your application.
(theme and global styles shown here for example )

**index.js**
```js
import React from 'react';//tested with react ^16.4.1
import {CapsuleProvider} from '@iosio/capsule';
import ReactDOM from 'react-dom';

import cx from 'classnames';// util to join classnames together

import {MyService} from 'MyService';

import {MyRootAppComponent} from './MyRootAppComponent';

/*
    Capsule comes pre-configured with JSS, jss-preset-default and react-jss.
    (all auto prefixing taken care of / no web pack configuration)
    Just define your theme object and global styles.
    you can reference the docs for more info on JSS syntax at:
    http://cssinjs.org
 */


/*
    define shared style variables, like typography, colors, breakpoints ..etc.
    They will be injected into the Capsule styles function
 */
export const myTheme = {
    color: {
        aqua: '#51ccbb',
        coral: '#c9544f'
    },
};

/*
    define styles to be applied globally here:
    (need to update this but a function is required)
 */
export const my_global_styles = () => ({
    '@global': {
        html: {
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            WebkitFontSmoothing: 'antialiased', // Antialiasing.
            MozOsxFontSmoothing: 'grayscale', // Antialiasing.
            fontFamily: '"Helvetica", "Arial", sans-serif',
            background: 'white',
            boxSizing: 'border-box',
        },
        '#root': {
            height: '100%',
            width: '100%'
        },
        body: {
            margin: 0,
            padding: 0,
            height: '100%',
            width: '100%',
            background: 'white'
        },
        '*, *::before, *::after': {
            boxSizing: 'inherit',
        },
    },
});


/*
    any utilities or services that require instantiation
    I like to put at the root level of my application
    and inject the instance via the provider

 */
const myService = new MyService();


const App = CapsuleProvider({
    theme: myTheme, // object
    global_styles: my_global_styles, //function

    provide_to_props: {
      /*
        values here will be passed to every component via the Component props
        just a nice convenience, instead of having to import commonly used utilities
        into each file
       */
        cx
    },
    provide_to_logic: {
        /*
            value here will be injected into the Capsule logic function 
            via the collective argument.
         */
        myService
    }

})(MyRootAppComponent); //wrap your root component here

ReactDOM.render(<App/>, document.getElementById('root'));
```

#### Use Capsule in many ways.

**myDataCapsule.js**

```js
import React from 'react';
import {Capsule} from '@iosio/capsule';
/*
    capsules may be used solely as factories or services if you choose
    without having to wrap a component
 */
export const myDataCapsule = Capsule({

    reducer_name: 'myDataState', // the namespace at which you can access and manipulate state with

    initial_state: {
        /*
            each will be available on the component you map it to
            and available to other capsules
            via its reducer namespace on the state.

            changes on these properties will trigger updates on subscriptions and components they are mapped to
         */

        fetchingData: false,
        fetchFail: false,
        data: [],
    },

    logic_name: 'myDataLogic', // the namespace where you can access logic returned from this capsule


    //here you have access to state, logic and dependencies you have injected
    //return the functions you want to make public
    logic: ({
                state: { // reducer_names will be available here

                    myDataState: {
                        get,
                        set,
                        update,
                        getState // will return all the state on this namespace. ex: {fetchingData, fetchFail, data}
                    }
                },

                store, //optionally use the redux store instance to access getState, subscribe ..etc

                collective // function to retrieve dependencies injected into the provider and logic returned from other capsules

            }) => {


        /*
            NOTE:
            the order that the capsules are invoked may effect the availability
            of state and injected dependencies in this scope
         */
        const getData = () => {

            /*
                RESOLUTION:
                best practice is to use the logic arguments in the scope of
                a returned function such as this one
             */

            set.fetchingData(true); // set the state to indicate to the user that a request is being made

            collective().myService.get('/someData')
                .then((res) => {

                    /*
                        use 'update' to update multiple properties on the state namespace
                        be sure to use the spread operator to return a copy of the object and the rest of the properties
                     */

                    update(state => ({
                        ...state,
                        data: res.data,
                        fetchingData: false,
                        fetchFail: false,
                    }));

                }).catch((err) => {

                console.log(err);

                update(state => ({
                    ...state,
                    fetchingData: false,
                    fetchFail: true,
                }));
            });


        };

        return {
            getData
        }


    },

})();/* <---- to use a capsule as a service (or make the returned logic available), you need to call the curried function () */
// or instead, optionally invoke it in a common_capsules index.js file somewhere:  myDataCapsule()
```

**MyRootComponent.js**

```js
import React from 'react';
import {Capsule} from '@iosio/capsule';

//in this case we must introduce the myDataCapsule somewhere 
import {myDataCapsule} from './mydataCapsule'

//invoke the capsule if you have not done so already:
myDataCapsule();
//for shared services/common logic, i typically have a directory and an index file where i invoke them all in one function
//and import something like commonCapsules();



/*
    I find that using decorators are pretty handy to have

    ex: @Capsule (decorator works on component classes only)

    install and implement this into your build to use decorators

    babel-plugin-transform-decorators-legacy

    or you can just pass your component to the second curried function

 */

const MyButtonComponent = Capsule({
    styles: (theme) => ({ //can be a function or object
        myButtonRoot: {
            height: 30, //jss defaults to px
            width: 100,
            color: 'white',
            background: theme.color.aqua // use the variables defined in the theme object
        }
    }),

})(({cx, classes, className, ...rest}) => { // stateless componenet
    return (
        <button className={cx(classes.myButtonRoot, className)}> Oh hey </button>
    );
});


/*
    many ways to use it...
 */
const buttonStyleCapsule = Capsule({
    styles: (theme) => ({
        //...
    }),

});

const AnotherButtonComponent = (props) => {
    return (
        <button  {...props}> Oh hey again </button>
    );
};

const MyButtonComponentWithStyles = buttonStyleCapsule(AnotherButtonComponent);




@Capsule({
    styles: ({color}) => ({
        randomStylesForLoadingIndicator: {
            border: '1px solid ' + color.aqua,
            height: 40,
            width: 40,
            borderRadius: '50%',
            background: 'red',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        dataItem: {
            height: 50,
            width: '50%',
            background: color.coral,
            color: 'white'
        }
    }),
    /*
        could optionally define the initial_state, reducer_name, logic and logic_name
        for the myDataCapsule here instead
    */

    //pluck the state properties off of a namespace that you want to pass to your component
    mapStateToProps: ({myDataState}) => ({
        fetchingData: myDataState.fetchingData,
        data: myDataState.data
    }),
    //returned logic namespaces will be available here
    //map the ones you want to make available to your component
    mapLogicToProps: ({myDataLogic}) => ({
        getData: myDataLogic.getData
    }),


})
export class MyRootAppComponent extends React.Component {


    componentDidMount() {
        this.props.getData();
    }

    refreshData = () => {
        this.props.getData();
    };

    render() {

        const {cx, classes, fetchingData, data} = this.props;


        return (
            <div style={{height: '100%', width: '100%'}}>

                <MyButtonComponent onClick={this.refreshData}/>

                {fetchingData && <div className={classes.randomStylesForLoadingIndicator}/>}


                {data && data.length > 0 && data.map((item, i) => (
                    <div className={classes.dataItem} key={i}>
                        {item.text}
                    </div>
                ))}

            </div>
        )
    }
}

```