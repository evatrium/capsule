import React from 'react';

import {Capsule} from "@iosio/capsule";

import {access_logic} from "../../access";
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
    })
})
export default class LoginPage extends React.Component {

    render() {
        const {classes, requesting_login, cx} = this.props;


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
                  
                    <Btn onClick={() => access_logic().requestLogin()}>
                        Log Me In!!!
                    </Btn>
                </div>
                
            </div>
        );
    }
}
