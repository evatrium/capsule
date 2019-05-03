import React from "react";

export default class Home extends React.Component {
    componentDidMount() {
        // console.log('mounted Home at this path: ', this.props.url);
    }

    componentWillUnmount() {
        // console.log('unmounted page')
    }

    getUrl = ()=>window.location.pathname;

    render() {
        return (
            <div className={'page'}>
                <h1>HOME PAGE</h1>
                <h1> you are here {this.getUrl()} </h1>
            </div>
        )
    }
}