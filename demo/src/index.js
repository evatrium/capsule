import React from 'react'
import {render} from 'react-dom'
import './styles.css';

import {CapsuleProvider} from '../../src'

const App = CapsuleProvider({
    experimentalMergeLogic: true,
    loadApp: ()=>import('./WithRoutingCapsule')
})();


render(<App/>, document.querySelector('#demo'));
