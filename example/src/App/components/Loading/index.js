import React from 'react';

import './styles.css';

export const Loading = (props) => (
    <div className='loader' {...props}>
        <div className='circle'></div>
        <div className='circle'></div>
        <div className='circle'></div>
        <div className='circle'></div>
        <div className='circle'></div>
    </div>
);
