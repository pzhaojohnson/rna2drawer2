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

  /**
   * Fills in the body element of the app with permanent elements.
   * 
   * It is preferrable to specify these elements here rather than in dist/index.html
   * since using an HTML file with the Jest testing framework does not seem very
   * straightforward... and this allows rendering of the app in testing.
   * 
   * The body element in dist/index.html is otherwise empty except for the script tag
   * to bundle.js. This method assumes that the body element is empty prior to its calling.
   * 
   * Use of document.body.innerHTML is also discouraged given its association with
   * XSS attacks.
   */
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
