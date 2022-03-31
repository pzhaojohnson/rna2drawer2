import { App } from 'App';
import { DraggingTool } from 'Draw/interact/drag/DraggingTool';
import { BindingTool } from 'Draw/interact/bind/BindingTool';
import { FlippingTool } from 'Draw/interact/flip/FlippingTool';
import { FlatteningTool } from 'Draw/interact/flatten/FlatteningTool';
import { EditingTool } from 'Draw/interact/edit/EditingTool';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { Base } from 'Draw/bases/Base';
import * as SVG from '@svgdotjs/svg.js';

import { DrawingOverlay } from 'Draw/interact/DrawingOverlay';
import { OverlaidMessageContainer } from 'Draw/interact/OverlaidMessageContainer';

export type Options = {
  // for specifying alternatives to components of the SVG.js library
  // (useful for testing)
  SVG?: {
    // can specify an SVG function that generates SVG documents
    // compatible with Node.js
    SVG?: () => SVG.Svg;
  }
}

export type Tool = (
  DraggingTool
  | BindingTool
  | FlippingTool
  | FlatteningTool
  | EditingTool
);

export class StrictDrawingInteraction {
  readonly options?: Options;
  _app: App;

  readonly drawingOverlay: DrawingOverlay;
  readonly drawingUnderlay: DrawingOverlay;

  readonly overlaidMessageContainer: OverlaidMessageContainer;

  readonly draggingTool: DraggingTool;
  readonly bindingTool: BindingTool;
  readonly flippingTool: FlippingTool;
  readonly flatteningTool: FlatteningTool;
  readonly editingTool: EditingTool;
  _currentTool: Tool;

  constructor(app: App, options?: Options) {
    this.options = options;
    this._app = app;

    this.drawingOverlay = new DrawingOverlay({ SVG: options?.SVG });
    this.drawingOverlay.placeOver(this.strictDrawing.drawing);
    this.drawingUnderlay = new DrawingOverlay({ SVG: options?.SVG });
    this.drawingUnderlay.placeUnder(this.strictDrawing.drawing);

    this.overlaidMessageContainer = new OverlaidMessageContainer();
    this.overlaidMessageContainer.placeOver(this.strictDrawing.drawing);

    this._setBindings();

    this.draggingTool = new DraggingTool({
      app: app,
      strictDrawing: app.strictDrawing,
      drawingUnderlay: this.drawingUnderlay,
      overlaidMessageContainer: this.overlaidMessageContainer,
    });

    this.bindingTool = new BindingTool({
      app,
      strictDrawing: app.strictDrawing,
      drawingOverlay: this.drawingOverlay,
      drawingUnderlay: this.drawingUnderlay,
      overlaidMessageContainer: this.overlaidMessageContainer,
    });

    this.flippingTool = new FlippingTool({
      app: app,
      strictDrawing: app.strictDrawing,
      drawingUnderlay: this.drawingUnderlay,
      overlaidMessageContainer: this.overlaidMessageContainer,
    });

    this.flatteningTool = new FlatteningTool({
      app: app,
      strictDrawing: app.strictDrawing,
      drawingUnderlay: this.drawingUnderlay,
      overlaidMessageContainer: this.overlaidMessageContainer,
    });

    this.editingTool = new EditingTool({
      app: app,
      strictDrawing: app.strictDrawing,
      drawingOverlay: this.drawingOverlay,
      overlaidMessageContainer: this.overlaidMessageContainer,
      SVG: options?.SVG,
    });

    this._currentTool = this.draggingTool;
  }

  get strictDrawing(): StrictDrawing {
    return this._app.strictDrawing;
  }

  get currentTool(): Tool {
    return this._currentTool;
  }

  set currentTool(t: Tool) {
    if (t != this._currentTool) {
      this._currentTool.reset();
      this._currentTool = t;
      this._app.refresh();
    }
  }

  _setBindings() {
    this._bindMouseover();
    this._bindMouseout();
    this._bindMousedown();
    this._bindDblclick();
    this._bindMousemove();
    this._bindMouseup();
    this._bindKeyup();
  }

  _bindMouseover() {
    window.addEventListener('mouseover', event => {
      this.currentTool.handleMouseover(event);
    });
  }

  _bindMouseout() {
    window.addEventListener('mouseout', event => {
      this.currentTool.handleMouseout(event);
    });
  }

  _bindMousedown() {
    window.addEventListener('mousedown', event => {
      this.currentTool.handleMousedown(event);
    });
  }

  _bindDblclick() {
    window.addEventListener('dblclick', event => {
      this.currentTool.handleDblclick(event);
    });
  }

  _bindMousemove() {
    window.addEventListener('mousemove', event => {
      this.currentTool.handleMousemove(event);
    });
  }

  _bindMouseup() {
    window.addEventListener('mouseup', event => {
      this.currentTool.handleMouseup(event);
    });
  }

  _bindKeyup() {
    window.addEventListener('keyup', event => {
      this.currentTool.handleKeyup(event);
    });
  }

  reset() {
    this.currentTool.reset();
  }

  refresh() {
    this.currentTool.refresh();
  }
}
