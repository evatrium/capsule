import React from 'react';
import {Page} from "./PageComponent";

export default class Home extends React.Component{
    render(){
        return(<Page name={'Home'} {...this.props}/>)
    }
}