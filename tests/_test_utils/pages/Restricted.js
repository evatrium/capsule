import React from 'react';
import {Page} from "./PageComponent";

export default class Restricted extends React.Component{
    render(){
        return(<Page name={'Restricted'} {...this.props}/>)
    }
}