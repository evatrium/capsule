import React from 'react'
import {render} from 'react-dom'
import './styles.css';

import {CapsuleProvider} from '../../src'

const App = CapsuleProvider({
    loadApp: ()=>import('./App')
})();


render(<App/>, document.querySelector('#demo'));
