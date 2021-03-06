import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import { AppInterface, FormFactory } from './AppInterface';

import UndoRedo from './undo/UndoRedo';
import { pushUndo, undo, redo } from './undo/undo';

import StrictDrawing from './draw/StrictDrawing';
import { StrictDrawingSavableState } from './draw/StrictDrawingInterface';
import * as Svg from '@svgdotjs/svg.js';
import StrictDrawingInteraction from './draw/interact/StrictDrawingInteraction';

import { Menu } from './menu/Menu';
import { Infobar } from './infobar/Infobar';

import { HomePage } from './forms/home/HomePage';

import { save } from './export/save';

class App implements AppInterface {
  _SVG: () => Svg.Svg;

  _menuContainer: HTMLDivElement;
  _drawingContainer: HTMLDivElement;
  _formContainer: HTMLDivElement;
  _infobarContainer: HTMLDivElement;

  _undoRedo: UndoRedo<StrictDrawingSavableState>;
  _strictDrawing: StrictDrawing;
  _strictDrawingInteraction: StrictDrawingInteraction;
  _currFormFactory?: FormFactory;
  _drawingTitle?: string;

  constructor(SVG: () => Svg.Svg) {
    this._SVG = SVG;

    this._menuContainer = document.createElement('div');
    this._drawingContainer = document.createElement('div');
    this._formContainer = document.createElement('div');
    this._infobarContainer = document.createElement('div');
    this._appendContainers();
    this._disableDragAndDrop();
    this._preventDblclickDefaultWhenNotTyping();

    this._strictDrawing = new StrictDrawing();
    this._initializeDrawing();
    this._undoRedo = new UndoRedo<StrictDrawingSavableState>();
    this._strictDrawingInteraction = new StrictDrawingInteraction(this.strictDrawing);
    this._initializeDrawingInteraction();
    this.renderPeripherals();

    this._setBindings();

    this.renderForm(close => (
      <HomePage app={this} />
    ));
  }

  get SVG(): () => Svg.Svg {
    return this._SVG;
  }

  _appendContainers() {
    let div1 = document.createElement('div');
    div1.style.cssText = 'height: 100vh; display: flex; flex-direction: column;';
    document.body.appendChild(div1);
    div1.appendChild(this._menuContainer);
    let div2 = document.createElement('div');
    div2.style.cssText = 'min-height: 0px; flex-grow: 1; display: flex; flex-direction: row;';
    div1.appendChild(div2);
    this._drawingContainer.style.cssText = 'flex-grow: 1; overflow: auto;';
    div2.appendChild(this._drawingContainer);
    div2.appendChild(this._formContainer);
    div1.appendChild(this._infobarContainer);
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
    this._strictDrawing.addTo(this._drawingContainer, () => this.SVG());
  }

  get strictDrawing(): StrictDrawing {
    return this._strictDrawing;
  }

  get undoRedo(): UndoRedo<StrictDrawingSavableState> {
    return this._undoRedo;
  }

  _initializeDrawingInteraction() {
    this._strictDrawingInteraction.onShouldPushUndo(() => {
      this.pushUndo();
    });
    this._strictDrawingInteraction.onChange(() => {
      this.renderPeripherals();
    });
    this._strictDrawingInteraction.onRequestToRenderForm(ff => {
      this.renderForm(close => ff(close));
    });
  }

  get strictDrawingInteraction(): StrictDrawingInteraction {
    return this._strictDrawingInteraction;
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
    window.addEventListener('beforeunload', event => {
      if (!this.strictDrawing.isEmpty() || this.canUndo() || this.canRedo()) {
        (event || window.event).returnValue = 'Are you sure?';
        return 'Are you sure?';
      }
    });
  }

  renderPeripherals() {
    this.renderMenu();
    this.renderInfobar();
    if (this._currFormFactory) {
      this.renderForm(this._currFormFactory);
    }
    this.updateDocumentTitle();
  }

  renderMenu() {
    ReactDOM.render(<Menu app={this} />, this._menuContainer);
  }

  renderInfobar() {
    ReactDOM.render(<Infobar app={this} />, this._infobarContainer);
  }

  renderForm(formFactory: FormFactory) {

    /* Seems to be necessary for user entered values (e.g. in input elements)
    to be updated in a currently rendered form. */
    this.unmountCurrForm();

    let close = () => {
      if (this._currFormFactory == formFactory) {
        this.unmountCurrForm();
      }
    }
    ReactDOM.render(formFactory(close), this._formContainer);
    this._currFormFactory = formFactory;
  }

  unmountCurrForm() {
    this._currFormFactory = undefined;
    ReactDOM.unmountComponentAtNode(this._formContainer);
  }

  get drawingTitle(): string {
    if (this._drawingTitle) {
      return this._drawingTitle;
    } else {
      let ids = this.strictDrawing.drawing.sequenceIds();
      return ids.join(', ');
    }
  }

  set drawingTitle(title: string) {
    this._drawingTitle = title;
    this.drawingChangedNotByInteraction();
  }

  unspecifyDrawingTitle() {
    this._drawingTitle = undefined;
    this.drawingChangedNotByInteraction();
  }

  updateDocumentTitle() {
    let title = this.drawingTitle;
    document.title = title ? title : 'RNA2Drawer';
  }

  drawingChangedNotByInteraction() {
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

  save() {
    save(this);
  }
}

export default App;
