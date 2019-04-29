import React from 'react';
import {Page} from "./PageComponent";

export default class Detail extends React.Component{
    render(){
        return(<Page name={'Detail'} {...this.props}/>)
    }
}