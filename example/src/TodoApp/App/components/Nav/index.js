import React from 'react';
// import {Capsule} from "@iosio/capsule";
import {Capsule} from "../../../../@iosio/capsule";

import {Btn} from "../Btn";

@Capsule({
    mapLogicToProps: (logic)=>({
        logout: logic.access.logout
    }),
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
        const {classes, className, style, children, cx, logout} = this.props;

        return (
            <div className={cx(classes.root, className)} style={{...style}}>
                <Btn onClick={logout}>
                    Logout
                </Btn>
            </div>
        );
    };
}
