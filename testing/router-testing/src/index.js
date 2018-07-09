import React from 'react';
import ReactDOM from 'react-dom';

import Main from './Main';
import registerServiceWorker from './registerServiceWorker';
import {CapsuleProvider} from "./capsule";
import {test} from "./test_sequence";

test();

const App = CapsuleProvider()(Main);



ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
