import React from 'react';
import {Capsule} from '@iosio/capsule';


/*
    I find that using decorators are pretty handy to have

    ex: @Capsule (works on component classes)

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

})(({cx, classes, className, ...rest}) => {
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