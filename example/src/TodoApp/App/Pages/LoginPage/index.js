import React from 'react';

// import {Capsule} from "@iosio/capsule";
import {Capsule} from "../../../../@iosio/capsule";

import {Loading} from "../../components/Loading/index";
import {Btn} from "../../components/Btn";

@Capsule({
    styles: (theme) => ({
        root: {
            height: 500,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    }),
    mapStateToProps: (state) => ({
        requesting_login: state.access.requesting_login
    }),

    logic:()=>({collective })=>{

    },
    mapLogicToProps: (logic)=>({
        requestLogin: logic.access.requestLogin
    })
})
export default class LoginPage extends React.Component {

    componentDidMount(){
        console.log('login page mounted')
    }
    render() {
        const {classes, requesting_login, cx, requestLogin} = this.props;


        return (
            <div className={cx(
                classes.root,
            )}>
                <div style={{height: 600}}>
                    {requesting_login &&

                    <Loading style={{marginTop: 100}}/>

                    }
                </div>
                <div style={{height: 500}}>
                  
                    <Btn onClick={() => requestLogin()}>
                        Log Me In!!!
                    </Btn>
                </div>
                
            </div>
        );
    }
}
