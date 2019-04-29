import React from 'react';
import {Page} from "./PageComponent";

export default class AuthOnly extends React.Component{
    render(){
        return(<Page name={'AuthOnly'} {...this.props}/>)
    }
}

