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

import { Preferences } from './Preferences';

import { Menu } from './menu/Menu';
import { FormContainer } from './FormContainer';
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
  readonly menuContainer: HTMLDivElement;
  readonly drawingContainer: HTMLDivElement;
  readonly formContainer: FormContainer;
  readonly infobarContainer: HTMLDivElement;

  _undoRedo: UndoRedo<StrictDrawingSavableState>;
  readonly strictDrawing: StrictDrawing;
  readonly strictDrawingInteraction: StrictDrawingInteraction;

  preferences: Preferences;

  drawingTitle: DrawingTitle;

  constructor(options?: Options) {
    this.node = document.createElement('div');
    this.node.className = styles.app;

    this.menuContainer = document.createElement('div');
    this.node.appendChild(this.menuContainer);

    let drawingAndFormContainer = document.createElement('div');
    drawingAndFormContainer.className = styles.drawingAndFormContainer;
    this.node.appendChild(drawingAndFormContainer);

    this.drawingContainer = document.createElement('div');
    this.drawingContainer.className = styles.drawingContainer;
    drawingAndFormContainer.appendChild(this.drawingContainer);

    this.formContainer = new FormContainer();
    this.formContainer.appendTo(drawingAndFormContainer);

    this.infobarContainer = document.createElement('div');
    this.node.appendChild(this.infobarContainer);

    this.strictDrawing = new StrictDrawing({ SVG: { SVG: options?.SVG?.SVG } });
    this.strictDrawing.appendTo(this.drawingContainer);
    this.drawingTitle = new DrawingTitle({ drawing: this.strictDrawing });
    this._undoRedo = new UndoRedo<StrictDrawingSavableState>();

    this.strictDrawingInteraction = new StrictDrawingInteraction({
      app: this,
      strictDrawing: this.strictDrawing,
      SVG: options?.SVG,
    });

    this.preferences = new Preferences();

    this.renderPeripherals();

    this.formContainer.renderForm(() => (
      <WelcomePage app={this} />
    ));
  }

  appendTo(container: Node) {
    container.appendChild(this.node);
  }

  remove() {
    this.node.remove();
  }

  get drawing() {
    return this.strictDrawing;
  }

  get undoRedo(): UndoRedo<StrictDrawingSavableState> {
    return this._undoRedo;
  }

  get drawingInteraction() {
    return this.strictDrawingInteraction;
  }

  renderPeripherals() {
    this.renderMenu();
    this.renderInfobar();
    this.formContainer.refresh();
    this.updateDocumentTitle();
  }

  renderMenu() {
    ReactDOM.render(<Menu app={this} />, this.menuContainer);
  }

  renderInfobar() {
    ReactDOM.render(<Infobar app={this} />, this.infobarContainer);
  }

  updateDocumentTitle() {
    document.title = this.drawing.isEmpty() ? 'RNA2Drawer' : this.drawingTitle.value;
  }

  refresh() {
    this.strictDrawingInteraction.refresh();
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
