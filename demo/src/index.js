import React from 'react'
import {render} from 'react-dom'
import './styles.css';
import {mainCapsule} from "./mainCapsule";
import {createHistory, getPathnameFromString as gpfs, stringifyParams} from "@iosio/history";

import {CapsuleProvider} from '../../src'

const App = CapsuleProvider({
    loadApp: () => import('./Main')
})();
// const App = ()=><h1>hello</h1>

render(<App/>, document.querySelector('#demo'));