import React from 'react';
import {Page} from "./PageComponent";

export default class Login extends React.Component{
    render(){
        return(<Page name={'Login'} {...this.props}/>)
    }
}