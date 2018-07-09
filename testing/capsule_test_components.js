import React from 'react';

export class TestMain extends React.Component{


    render(){
        return(
            <div>
                {JSON.stringify(this.props)}
            </div>
        );
    }
}

export class BaseComponent extends React.Component{
    render(){
        return(
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        )
    }
}