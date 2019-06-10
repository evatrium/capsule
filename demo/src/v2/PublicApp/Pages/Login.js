import React from "react";

export default class Login extends React.Component {
    componentDidMount() {
        // console.log('mounted Home at this path: ', this.props.url);
        console.log('login page mounted')
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('login page updated')
    }

    componentWillUnmount() {
        // console.log('unmounted page')
    }

    getUrl = ()=>window.location.pathname;

    render() {
        return (
            <div className={'page'}>
                <h1>LOGIN PAGE</h1>
                <h1> you are here {this.getUrl()} </h1>
            </div>
        )
    }
}