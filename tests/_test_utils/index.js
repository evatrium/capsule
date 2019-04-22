import React from 'react'
import {render, fireEvent, cleanup, queryByAttribute} from 'react-testing-library';

export const getById = queryByAttribute.bind(null, 'id');


export const Till = (events) => (it_happened) => {
    return new Promise((resolve, reject) => {
        events.on(it_happened, (data) => {
            data === 'fail' ? reject(it_happened + ' failed') : resolve(data);
        })
    });
};