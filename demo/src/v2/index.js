import React from 'react'
import './styles.css';
import "./mainCapsule";
import App from './App'
import {CapsuleProvider} from '../../../src'


export const Root = () => (
    <CapsuleProvider>
        <App/>
    </CapsuleProvider>
);