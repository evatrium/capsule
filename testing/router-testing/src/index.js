import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';
import registerServiceWorker from './registerServiceWorker';
import {CapsuleProvider} from "./capsule";

const App = CapsuleProvider()(Main);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
