import * as ReactDOM from 'react-dom';
import { ReactElement } from 'react';
import './App.css';

import UndoRedo from './undo/UndoRedo';

import StrictDrawing from './draw/StrictDrawing';
import StrictDrawingInteraction from './draw/interact/StrictDrawingInteraction';

import createMenuForApp from './menu/createMenuForApp';
import createInfobarForApp from './infobar/createInfobarForApp';

import renderCreateNewDrawingInApp from './forms/renderCreateNewDrawingInApp';

import saveDrawingForApp from './export/saveDrawingForApp';

interface Svg {
  addTo: () => Svg;
}

class App {
  _SVG: () => Svg;
  _undoRedo: UndoRedo<object>;
  _strictDrawing: StrictDrawing;
  _strictDrawingInteraction: StrictDrawingInteraction;
  _currFormFactory: () => ReactElement;

  constructor(SVG: () => Svg) {
    this._SVG = SVG;

    this._undoRedo = new UndoRedo();

    this._fillInBody();
    this._initializeDrawing();
    this._initializeDrawingInteraction();
    this.renderPeripherals();

    this._setKeyBindings();
    
    renderCreateNewDrawingInApp(this);
  }

  get SVG(): () => Svg {
    return this._SVG;
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

  get _menuContainerId(): string {
    return 'MenuContainer';
  }
  
  get _drawingContainerId(): string {
    return 'DrawingContainer';
  }

  get _formContainerId(): string {
    return 'FormContainer';
  }

  get _infobarContainerId(): string {
    return 'InfobarContainer';
  }

  _getMenuContainer(): Element {
    return document.getElementById(this._menuContainerId);
  }

  _getDrawingContainer(): Element {
    return document.getElementById(this._drawingContainerId);
  }

  _getFormContainer(): Element {
    return document.getElementById(this._formContainerId);
  }

  _getInfobarContainer(): Element {
    return document.getElementById(this._infobarContainerId);
  }

  _initializeDrawing() {
    this._strictDrawing = new StrictDrawing();
    let container = this._getDrawingContainer();
    this._strictDrawing.addTo(container, () => this.SVG());
  }

  get strictDrawing(): StrictDrawing {
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

  get strictDrawingInteraction(): StrictDrawingInteraction {
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

  renderForm(formFactory: () => ReactElement) {

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

  pushUndo() {
    this._undoRedo.pushUndo(
      this.strictDrawing.savableState()
    );
    this.renderPeripherals();
  }

  canUndo(): boolean {
    return this._undoRedo.canUndo();
  }

  undo() {
    if (!this.canUndo()) {
      return;
    }
    let currState = this.strictDrawing.savableState();
    this.strictDrawing.applySavedState(
      this._undoRedo.undo(currState)
    );
    this.drawingChangedNotByInteraction();
  }

  canRedo(): boolean {
    return this._undoRedo.canRedo();
  }

  redo() {
    if (!this.canRedo()) {
      return;
    }
    let currState = this.strictDrawing.savableState();
    this.strictDrawing.applySavedState(
      this._undoRedo.redo(currState)
    );
    this.drawingChangedNotByInteraction();
  }

  drawingChangedNotByInteraction() {
    this._strictDrawingInteraction.reset();
    this.renderPeripherals();
  }

  _setKeyBindings() {
    document.addEventListener('keydown', event => {
      let k = event.key.toUpperCase();
      if (event.ctrlKey && event.shiftKey && k == 'Z') {
        this.redo();
      } else if (event.ctrlKey && k == 'Z') {
        this.undo();
      }
    });
  }

  updateDocumentTitle() {
    if (this.strictDrawing.isEmpty()) {
      document.title = 'RNA2Drawer 2';
      return;
    }
    document.title = this.strictDrawing.sequenceIds().join(', ');
  }

  save() {
    saveDrawingForApp(this);
  }
}

export default App;
