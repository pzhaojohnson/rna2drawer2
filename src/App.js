import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Menu from './Menu';
import Infobar from './Infobar';

class App {
  constructor() {

    ReactDOM.render(<Menu />, document.getElementById('MenuContainer'));
    ReactDOM.render(<Infobar />, document.getElementById('InfobarContainer'));
  }
}

export default App;
