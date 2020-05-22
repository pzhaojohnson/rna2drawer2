import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import FiniteStack from './undo/FiniteStack';

import StrictDrawing from './draw/StrictDrawing';
import StrictDrawingInteraction from './draw/interact/StrictDrawingInteraction';

import createMenuForApp from './menu/createMenuForApp';
import createInfobarForApp from './infobar/createInfobarForApp';

import renderCreateNewDrawingInApp from './forms/renderCreateNewDrawingInApp';

import saveDrawingForApp from './export/saveDrawingForApp';

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
    this._initializeDrawingInteraction();
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

  _initializeDrawingInteraction() {
    this._strictDrawingInteraction = new StrictDrawingInteraction(
      this.strictDrawing
    );
    this._strictDrawingInteraction.onShouldPushUndo(() => {
      this.pushUndo();
    });
    this._strictDrawingInteraction.onChange(() => {
      this.renderPeripherals();
    });
  }

  get strictDrawingInteraction() {
    return this._strictDrawingInteraction;
  }

  renderPeripherals() {
    this.renderMenu();
    this.renderInfobar();
    if (this._currFormFactory) {
      this.renderForm(this._currFormFactory);
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

  renderForm(formFactory) {

    /* Seems to be necessary for user entered values (e.g. in input elements)
    to be updated in a currently rendered form. */
    this.unmountCurrForm();
    
    ReactDOM.render(
      formFactory(),
      this._getFormContainer(),
    );
    this._currFormFactory = formFactory;
  }

  unmountCurrForm() {
    this._currFormFactory = null;
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
    this.renderPeripherals();
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
    this.drawingChangedNotByInteraction();
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
    this.drawingChangedNotByInteraction();
  }

  drawingChangedNotByInteraction() {
    this._strictDrawingInteraction.reset();
    this.renderPeripherals();
  }

  save() {
    saveDrawingForApp(this);
  }
}

export default App;
