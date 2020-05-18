import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import FiniteStack from './undo/FiniteStack';

import StrictDrawing from './draw/StrictDrawing';

import createMenuForApp from './menu/createMenuForApp';
import createInfobarForApp from './infobar/createInfobarForApp';

import renderCreateNewDrawingInApp from './forms/renderCreateNewDrawingInApp';

import offerFileForDownload from './export/offerFileForDownload';

class App {

  /**
   * @callback App~SVG 
   * 
   * @returns {SVG.Svg} 
   */

  /**
   * @param {App~SVG} SVG
   */
  constructor(SVG) {
    this._SVG = SVG;

    this._undoStack = new FiniteStack();
    this._redoStack = new FiniteStack();
    
    this._fillInBody();
    this._initializeDrawing();
    this.renderPeripherals();

    this._setBindings();
    
    renderCreateNewDrawingInApp(this);
  }

  /**
   * @returns {App~SVG} 
   */
  get SVG() {
    return this._SVG;
  }

  _setBindings() {
    document.addEventListener('keydown', event => {
      let k = event.key.toUpperCase();
      if (event.ctrlKey && event.shiftKey && k == 'Z') {
        this.redo();
      } else if (event.ctrlKey && k == 'Z') {
        this.undo();
      }
    });
  }

  _fillInBody() {
    let outermostDiv = document.createElement('div');
    outermostDiv.style.cssText = 'height: 100vh; display: flex; flex-direction: column;';
    document.body.appendChild(outermostDiv);

    let menuContainer = document.createElement('div');
    menuContainer.id = this._menuContainerId;
    outermostDiv.appendChild(menuContainer);

    let drawingAndFormDiv = document.createElement('div');
    drawingAndFormDiv.style.cssText = 'min-height: 0px; flex-grow: 1; display: flex; flex-direction: row;';
    outermostDiv.appendChild(drawingAndFormDiv);

    let drawingContainer = document.createElement('div');
    drawingContainer.id = this._drawingContainerId;
    drawingContainer.style.cssText = 'flex-grow: 1; overflow: auto;';
    drawingAndFormDiv.appendChild(drawingContainer);

    let formContainer = document.createElement('div');
    formContainer.id = this._formContainerId;
    drawingAndFormDiv.appendChild(formContainer);

    let infobarContainer = document.createElement('div');
    infobarContainer.id = this._infobarContainerId;
    outermostDiv.appendChild(infobarContainer);
  }

  get _menuContainerId() {
    return 'MenuContainer';
  }
  
  get _drawingContainerId() {
    return 'DrawingContainer';
  }

  get _formContainerId() {
    return 'FormContainer';
  }

  get _infobarContainerId() {
    return 'InfobarContainer';
  }

  _getMenuContainer() {
    return document.getElementById(this._menuContainerId);
  }

  _getDrawingContainer() {
    return document.getElementById(this._drawingContainerId);
  }

  _getFormContainer() {
    return document.getElementById(this._formContainerId);
  }

  _getInfobarContainer() {
    return document.getElementById(this._infobarContainerId);
  }

  _initializeDrawing() {
    this._strictDrawing = new StrictDrawing();
    let container = this._getDrawingContainer();
    this._strictDrawing.addTo(container, () => this._SVG());
  }

  /**
   * @returns {StrictDrawing} 
   */
  get strictDrawing() {
    return this._strictDrawing;
  }

  renderPeripherals() {
    this.renderMenu();
    this.renderInfobar();
    if (this._currForm) {
      this._currForm.forceUpdate();
    }
  }

  renderMenu() {
    ReactDOM.render(
      createMenuForApp(this),
      this._getMenuContainer(),
    );
  }

  renderInfobar() {
    ReactDOM.render(
      createInfobarForApp(this),
      this._getInfobarContainer(),
    );
  }

  /**
   * @param {React.Element} formElement 
   */
  renderForm(formElement) {
    this.unmountCurrForm();
    this._currForm = ReactDOM.render(
      formElement,
      this._getFormContainer()
    );
  }

  unmountCurrForm() {
    this._currForm = null;
    ReactDOM.unmountComponentAtNode(
      this._getFormContainer()
    );
  }

  updateDocumentTitle() {
    if (this.strictDrawing.isEmpty()) {
      document.title = 'RNA2Drawer 2';
      return;
    }
    document.title = this.strictDrawing.sequenceIds().join(', ');
  }

  pushUndo() {
    this._undoStack.push(
      this.strictDrawing.savableState()
    );
    this._redoStack.clear();
  }

  canUndo() {
    return !this._undoStack.isEmpty();
  }

  undo() {
    if (!this.canUndo()) {
      return;
    }
    this._redoStack.push(
      this.strictDrawing.savableState()
    );
    this.strictDrawing.applySavedState(
      this._undoStack.pop()
    );
    this.renderPeripherals();
  }

  canRedo() {
    return !this._redoStack.isEmpty();
  }

  redo() {
    if (!this.canRedo()) {
      return;
    }
    this._undoStack.push(
      this.strictDrawing.savableState()
    );
    this.strictDrawing.applySavedState(
      this._redoStack.pop()
    );
    this.renderPeripherals();
  }

  save() {
    offerFileForDownload({
      name: document.title + '.rna2drawer2',
      type: 'text/plain',
      contents: this.strictDrawing.savableString,
    });
  }
}

export default App;
