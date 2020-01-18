import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import Menu from './Menu';
import Infobar from './Infobar';

import CreateNewDrawing from './forms/CreateNewDrawing';

import TrackedDrawing from './draw/TrackedDrawing';

class App {
  constructor() {
    this._render();
  }

  _render() {
    this._fillInBody();

    ReactDOM.render(<Menu />, document.getElementById('MenuContainer'));

    this._trackedDrawing = new TrackedDrawing(this._getDrawingContainer());

    ReactDOM.render(
      <CreateNewDrawing width={'100vw'} actionCallback={this.actionCallback()} />,
      document.getElementById('TaskPaneContainer')
    );
    
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
    //menuContainer.style.cssText = 'width: 100vw; height: 5vh;';
    outermostDiv.appendChild(menuContainer);

    let drawingAndTaskPaneDiv = document.createElement('div');
    drawingAndTaskPaneDiv.style.cssText = 'min-height: 0; flex-grow: 1; display: flex; flex-direction: row;';
    //drawingAndTaskPaneDiv.style.cssText = 'width: 100vw; height: 90vh; display: flex; flex-direction: row;';
    outermostDiv.appendChild(drawingAndTaskPaneDiv);

    let drawingContainer = document.createElement('div');
    drawingContainer.id = 'DrawingContainer';
    drawingContainer.style.cssText = 'flex-grow: 1; overflow: auto;';
    drawingAndTaskPaneDiv.appendChild(drawingContainer);

    let taskPaneContainer = document.createElement('div');
    taskPaneContainer.id = 'TaskPaneContainer';
    //taskPaneContainer.style.cssText = 'border-style: solid; border-width: 0px 0px 0px 0.75px; border-color: #bfbfbf;';
    drawingAndTaskPaneDiv.appendChild(taskPaneContainer);

    let infobarContainer = document.createElement('div');
    infobarContainer.id = 'InfobarContainer';
    //infobarContainer.style.cssText = 'width: 100vw; height: 5vh';
    outermostDiv.appendChild(infobarContainer);
  }

  infoCallback() {
    return query => {
      switch (query.type) {
        default:
          throw new Error('Unrecognized query type: ' + query.type + '.');
      }
    };
  }

  actionCallback() {
    return action => {
      switch (action.type) {
        case 'initializeDrawing':
          this._initializeDrawing();
          break;
        case 'addStructure':
          this._addStructure(action.sequenceId, action.sequence, action.partners);
          break;
        default:
          throw new Error('Unrecognized action type: ' + action.type + '.');
      }
    };
  }

  _getDrawingContainer() {
    return document.getElementById('DrawingContainer');
  }

  _getTaskPaneContainer() {
    return document.getElementById('TaskPaneContainer');
  }

  /**
   * @throws {Error} If the drawing is already initialized.
   */
  _initializeDrawing() {
    ReactDOM.unmountComponentAtNode(this._getTaskPaneContainer());
  }

  _addStructure(sequenceId, sequence, partners) {}
}

export default App;
