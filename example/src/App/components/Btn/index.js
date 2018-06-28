import React from 'react';
import {Capsule} from "@iosio/capsule";

export const Btn = Capsule({
    styles:(theme)=>({
        btn: {
            height: 35,
            width: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            background: theme.colors[1],
            cursor: 'pointer'
        }

    })
})((props) => (
    <div className={props.classes.btn} onClick={props.onClick}>
        <div>
            {props.children}
        </div>

    </div>
));
