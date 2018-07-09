import React from 'react';

import './styles.css';

export const Loading = (props) => {

        const {staticContext, ...rest} = props;

        return (

            <div className='loader' {...rest}>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
                <div className='circle'></div>
            </div>
        )
}

