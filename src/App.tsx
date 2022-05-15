import styles from './App.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import UndoRedo from './undo/UndoRedo';
import { pushUndo, undo, redo } from './undo/undo';

import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { StrictDrawingSavableState } from 'Draw/strict/StrictDrawing';
import * as SVG from '@svgdotjs/svg.js';
import { DrawingTitle } from './DrawingTitle';
import { StrictDrawingInteraction } from './draw/interact/StrictDrawingInteraction';

import { Preferences } from 'Preferences';

import { Menu } from './menu/Menu';
import { FormContainer } from 'FormContainer';
import { Infobar } from './infobar/Infobar';

import { WelcomePage } from './forms/welcome/WelcomePage';

export type Options = {
  // for specifying alternatives to components of the SVG.js library
  SVG?: {
    // will be used to generate the SVG document of the drawing if specified
    // (useful for testing on Node.js, which requires SVG documents be specially compatible)
    SVG?: () => SVG.Svg;
  }
}

export class App {
  readonly node: HTMLDivElement;
  _menuContainer: HTMLDivElement;
  _drawingContainer: HTMLDivElement;
  readonly formContainer: FormContainer;
  _infobarContainer: HTMLDivElement;

  _undoRedo: UndoRedo<StrictDrawingSavableState>;
  _strictDrawing: StrictDrawing;
  _strictDrawingInteraction: StrictDrawingInteraction;

  preferences: Preferences;

  drawingTitle: DrawingTitle;

  constructor(options?: Options) {
    this.node = document.createElement('div');
    this._menuContainer = document.createElement('div');
    this._drawingContainer = document.createElement('div');
    this.formContainer = new FormContainer();
    this._infobarContainer = document.createElement('div');
    this._appendContainers();
    this._disableDragAndDrop();
    this._preventDblclickDefaultWhenNotTyping();

    this._strictDrawing = new StrictDrawing({ SVG: { SVG: options?.SVG?.SVG } });
    this._initializeDrawing();
    this.drawingTitle = new DrawingTitle({ drawing: this._strictDrawing });
    this._undoRedo = new UndoRedo<StrictDrawingSavableState>();

    this._strictDrawingInteraction = new StrictDrawingInteraction({
      app: this,
      strictDrawing: this._strictDrawing,
      SVG: options?.SVG,
    });

    this.preferences = new Preferences();

    this.renderPeripherals();

    this._setBindings();

    this.formContainer.renderForm(() => (
      <WelcomePage app={this} />
    ));
  }

  _appendContainers() {
    this.node.className = styles.app;
    document.body.appendChild(this.node);
    this.node.appendChild(this._menuContainer);
    let drawingAndFormContainer = document.createElement('div');
    drawingAndFormContainer.className = styles.drawingAndFormContainer;
    this.node.appendChild(drawingAndFormContainer);
    this._drawingContainer.className = styles.drawingContainer;
    drawingAndFormContainer.appendChild(this._drawingContainer);
    this.formContainer.appendTo(drawingAndFormContainer);
    this.node.appendChild(this._infobarContainer);
  }

  appendTo(container: Node) {
    container.appendChild(this.node);
  }

  remove() {
    this.node.remove();
  }

  _disableDragAndDrop() {
    document.body.ondragstart = () => false;
    document.body.ondrop = () => false;
  }

  _preventDblclickDefaultWhenNotTyping() {
    document.addEventListener('mousedown', event => {
      if (event.detail > 1) { // clicked more than once
        let tn = document.activeElement?.tagName.toLowerCase();
        if (tn != 'input' && tn != 'textarea') {
          event.preventDefault();
        }
      }
    }, false);
  }

  _initializeDrawing() {
    this._strictDrawing.appendTo(this._drawingContainer);
  }

  get strictDrawing(): StrictDrawing {
    return this._strictDrawing;
  }

  get drawing() {
    return this.strictDrawing;
  }

  get undoRedo(): UndoRedo<StrictDrawingSavableState> {
    return this._undoRedo;
  }

  get strictDrawingInteraction(): StrictDrawingInteraction {
    return this._strictDrawingInteraction;
  }

  get drawingInteraction() {
    return this.strictDrawingInteraction;
  }

  _setBindings() {
    window.addEventListener('beforeunload', event => {
      let preference = this.preferences.askBeforeLeaving;
      if (preference != undefined && !preference) {
        return;
      } else if (this.strictDrawing.isEmpty()) {
        return;
      } else {
        let confirmationMessage = 'Are you sure?';
        (event || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    });
  }

  renderPeripherals() {
    this.renderMenu();
    this.renderInfobar();
    this.formContainer.refresh();
    this.updateDocumentTitle();
  }

  renderMenu() {
    ReactDOM.render(<Menu app={this} />, this._menuContainer);
  }

  renderInfobar() {
    ReactDOM.render(<Infobar app={this} />, this._infobarContainer);
  }

  updateDocumentTitle() {
    document.title = this.drawing.isEmpty() ? 'RNA2Drawer' : this.drawingTitle.value;
  }

  refresh() {
    this._strictDrawingInteraction.refresh();
    this.renderPeripherals();
  }

  pushUndo() {
    pushUndo(this);
  }

  canUndo(): boolean {
    return this._undoRedo.canUndo();
  }

  undo() {
    undo(this);
  }

  canRedo(): boolean {
    return this._undoRedo.canRedo();
  }

  redo() {
    redo(this);
  }
}
