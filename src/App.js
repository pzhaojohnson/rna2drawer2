import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Menu from './Menu';
import Infobar from './Infobar';

import CreateNewDrawing from './forms/CreateNewDrawing';

class App {
  constructor() {

    ReactDOM.render(<Menu />, document.getElementById('MenuContainer'));
    ReactDOM.render(<CreateNewDrawing />, document.getElementById('DrawingContainer'));
    //ReactDOM.render(<Infobar />, document.getElementById('InfobarContainer'));
  }
}

export default App;
