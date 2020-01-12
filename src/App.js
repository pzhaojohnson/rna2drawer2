import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Menu from './Menu';
import Infobar from './Infobar';

import CreateNewDrawing from './forms/CreateNewDrawing';

class App {
  constructor() {
    this._render();
  }

  _render() {
    this._fillInBody();

    ReactDOM.render(<Menu />, document.getElementById('MenuContainer'));
    ReactDOM.render(<CreateNewDrawing />, document.getElementById('DrawingContainer'));
    //ReactDOM.render(<Infobar />, document.getElementById('InfobarContainer'));
  }

  _fillInBody() {
    let outermostDiv = document.createElement('div');
    outermostDiv.style.cssText = 'height: 100vh; display: flex; flex-direction: column;';
    document.body.appendChild(outermostDiv);

    let menuContainer = document.createElement('div');
    menuContainer.id = 'MenuContainer';
    outermostDiv.appendChild(menuContainer);

    let drawingAndTaskPaneDiv = document.createElement('div');
    drawingAndTaskPaneDiv.style.cssText = 'flex-grow: 1; display: flex; flex-direction: row;';
    outermostDiv.appendChild(drawingAndTaskPaneDiv);

    let drawingContainer = document.createElement('div');
    drawingContainer.id = 'DrawingContainer';
    drawingContainer.style.cssText = 'flex-grow: 1; overflow: auto;';
    drawingAndTaskPaneDiv.appendChild(drawingContainer);

    let taskPaneContainer = document.createElement('div');
    taskPaneContainer.id = 'TaskPaneContainer';
    drawingAndTaskPaneDiv.appendChild(taskPaneContainer);

    let infobarContainer = document.createElement('div');
    infobarContainer.id = 'InfobarContainer';
    outermostDiv.appendChild(infobarContainer);
  }
}

export default App;
