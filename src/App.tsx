import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './App.css';
import { AppInterface, FormFactory } from './AppInterface';

import UndoRedo from './undo/UndoRedo';
import { pushUndo, undo, redo } from './undo/undo';

import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { StrictDrawingSavableState } from 'Draw/strict/StrictDrawingInterface';
import * as SVG from '@svgdotjs/svg.js';
import StrictDrawingInteraction from './draw/interact/StrictDrawingInteraction';

import { Menu } from './menu/Menu';
import { Infobar } from './infobar/Infobar';

import { HomePage } from './forms/home/HomePage';

export type Options = {
  // for specifying alternatives to components of the SVG.js library
  SVG?: {
    // will be used to generate the SVG document of the drawing if specified
    // (useful for testing on Node.js, which requires SVG documents be specially compatible)
    SVG?: () => SVG.Svg;
  }
}

export class App implements AppInterface {
  readonly node: HTMLDivElement;
  _menuContainer: HTMLDivElement;
  _drawingContainer: HTMLDivElement;
  _formContainer: HTMLDivElement;
  _infobarContainer: HTMLDivElement;

  _undoRedo: UndoRedo<StrictDrawingSavableState>;
  _strictDrawing: StrictDrawing;
  _strictDrawingInteraction: StrictDrawingInteraction;
  _formFactory?: FormFactory;

  _specifiedDrawingTitle?: string;

  constructor(options?: Options) {
    this.node = document.createElement('div');
    this._menuContainer = document.createElement('div');
    this._drawingContainer = document.createElement('div');
    this._formContainer = document.createElement('div');
    this._infobarContainer = document.createElement('div');
    this._appendContainers();
    this._disableDragAndDrop();
    this._preventDblclickDefaultWhenNotTyping();

    this._strictDrawing = new StrictDrawing({ SVG: { SVG: options?.SVG?.SVG } });
    this._initializeDrawing();
    this._undoRedo = new UndoRedo<StrictDrawingSavableState>();
    this._strictDrawingInteraction = new StrictDrawingInteraction(this);
    this.renderPeripherals();

    this._setBindings();

    this.renderForm(close => (
      <HomePage app={this} />
    ));
  }

  _appendContainers() {
    this.node.style.cssText = 'width: 100vw; height: 100vh; display: flex; flex-direction: column;';
    document.body.appendChild(this.node);
    this.node.appendChild(this._menuContainer);
    let div2 = document.createElement('div');
    div2.style.cssText = 'min-height: 0px; flex-grow: 1; display: flex; flex-direction: row;';
    this.node.appendChild(div2);
    this._drawingContainer.style.cssText = 'flex-grow: 1; overflow: auto;';
    div2.appendChild(this._drawingContainer);
    div2.appendChild(this._formContainer);
    this.node.appendChild(this._infobarContainer);
  }

  appendTo(container: Node) {
    container.appendChild(this.node);
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

  get undoRedo(): UndoRedo<StrictDrawingSavableState> {
    return this._undoRedo;
  }

  get strictDrawingInteraction(): StrictDrawingInteraction {
    return this._strictDrawingInteraction;
  }

  _setBindings() {
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
    if (this._formFactory) {
      this.renderForm(this._formFactory);
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

    // allows a form to be refreshed
    ReactDOM.unmountComponentAtNode(this._formContainer);

    ReactDOM.render(
      formFactory(() => {
        if (formFactory == this._formFactory) {
          this.unmountForm();
        }
      }),
      this._formContainer,
    );

    this._formFactory = formFactory;
  }

  unmountForm() {
    this._formFactory = undefined;
    ReactDOM.unmountComponentAtNode(this._formContainer);
  }

  unspecifiedDrawingTitle(): string {
    let seqs = this.strictDrawing.drawing.sequences;
    return seqs.map(seq => seq.id).join(', ');
  }

  get drawingTitle(): string {
    if (this._specifiedDrawingTitle) {
      return this._specifiedDrawingTitle;
    } else {
      return this.unspecifiedDrawingTitle();
    }
  }

  set drawingTitle(title: string) {
    this._specifiedDrawingTitle = title;
    this.refresh();
  }

  unspecifyDrawingTitle() {
    this._specifiedDrawingTitle = undefined;
    this.refresh();
  }

  updateDocumentTitle() {
    let title = this.drawingTitle;
    document.title = title ? title : 'RNA2Drawer';
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

export default App;
