import React from 'react';
import ReactDOM from 'react-dom';
import './_custom.scss';
import 'bootstrap';

import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();



//Archived

//import express, { static } from 'express';
//import { join } from 'path';
//const app = express();
//app.use(static(join(__dirname, 'build')));
//app.get('/', function(req, res) {
//    res.sendFile(join(__dirname, 'build', 'index.html'));
//});
//app.listen(3002);