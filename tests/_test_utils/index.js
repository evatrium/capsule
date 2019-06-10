import React from 'react'
import { queryByAttribute} from '@testing-library/react';

export const getById = queryByAttribute.bind(null, 'id');


export const Till = (events) => (it_happened, cb) => {
    return new Promise((resolve, reject) => {
        events.on(it_happened, (data) => {
            cb(data, resolve);
        })
    });
};