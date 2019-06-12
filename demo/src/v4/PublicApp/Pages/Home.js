import React from "react";
import {Capsule} from "../../../../../src";


const Home = Capsule({
    mapState:({main})=>({
        testObj: main.testObj,
        testArr: main.testArr
    })
})(class Home extends React.Component {
    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log('home page updated')
    }

    componentWillUnmount() {
        // console.log('unmounted page')
    }

    getUrl = ()=>window.location.pathname;

    render() {

        const {testObj, testArr} = this.props;

        return (
            <div className={'page'}>
                <h1>HOME PAGE</h1>
                <h1> you are here {this.getUrl()} </h1>

                {JSON.stringify(testObj, null, 4)}

                <br/>

                {JSON.stringify(testArr, null, 4)}
            </div>
        )
    }
});


export default Home