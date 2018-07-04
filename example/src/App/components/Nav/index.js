import React from 'react';
// import {Capsule} from "@iosio/capsule";
import {Capsule} from "../../../@iosio/capsule";


import {access_logic} from "../../access";
import {Btn} from "../Btn";

@Capsule({
    styles: theme => ({
        root: {
            width: '100%',
            background: '#373452',
            position: 'fixed',
            top: 0,
            zIndex: 1000,
            height: theme.nav.height,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
    }),

})
export class Nav extends React.Component {
    render() {
        const { classes, className, style,children, cx} = this.props;

        return (
            <div className={cx(classes.root, className)} style={{...style }}>
                <Btn onClick={()=>access_logic.logout()}>
                    Logout
                </Btn>
            </div>
        );
    };
}
