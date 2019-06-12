import React from "react";
import {Capsule} from "../../../../../src";

const Detail = Capsule({
    mapState: ({data}) => ({
        test1: data.test1,
        test2: data.test2
    }),
    mapLogic: {data: 'detailPageReady'}
})(class Detail extends React.Component {
    componentDidMount() {
        // console.log('mounted detail at this path: ', this.props.url);
        this.props.detailPageReady();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillUnmount() {
        // console.log('unmounted page')
    }

    getUrl = () => window.location.pathname;

    render() {

        const {test1, test2} = this.props;


        return (
            <div className={'page'}>
                <h1>DETAIL PAGE</h1>
                <h1> you are here {this.getUrl()} </h1>


                {JSON.stringify(test1, null, 4)}

                <br/>

                {JSON.stringify(test2, null, 4)}


                <br/>

            </div>
        )
    }
});

export default Detail;