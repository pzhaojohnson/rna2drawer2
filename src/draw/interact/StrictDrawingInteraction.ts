import PivotingMode from './pivot/PivotingMode';
import FoldingMode from './fold/FoldingMode';
import { TriangularizingMode } from './triangularize/TriangularizingMode';
import AnnotatingMode from './annotate/AnnotatingMode';
import { FormFactory } from 'FormContainer';
import { RenderFormOptions } from 'FormContainer';
import { App } from 'App';
import { FlippingTool } from 'Draw/interact/flip/FlippingTool';
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

type Mode = PivotingMode | FoldingMode | TriangularizingMode | AnnotatingMode;

export type Tool = (
  FlippingTool
  | EditingTool
);

class StrictDrawingInteraction {
  readonly options?: Options;
  _app: App;

  readonly drawingOverlay: DrawingOverlay;
  readonly drawingUnderlay: DrawingOverlay;

  readonly overlaidMessageContainer: OverlaidMessageContainer;

  readonly flippingTool: FlippingTool;
  readonly editingTool: EditingTool;
  _currentTool: Tool;

  _pivotingMode!: PivotingMode;
  _foldingMode!: FoldingMode;
  _triangularizingMode!: TriangularizingMode;
  _annotatingMode!: AnnotatingMode;
  _currMode: Mode;

  _mouseoveredBase?: Base;

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
    this._initializePivotingMode();
    this._initializeFoldingMode();
    this._initializeTriangularizingMode();
    this._initializeAnnotatingMode();

    this.flippingTool = new FlippingTool({
      app: app,
      strictDrawing: app.strictDrawing,
      drawingUnderlay: this.drawingUnderlay,
      overlaidMessageContainer: this.overlaidMessageContainer,
    });

    this.editingTool = new EditingTool({
      app: app,
      drawing: app.strictDrawing.drawing,
      drawingOverlay: this.drawingOverlay,
      overlaidMessageContainer: this.overlaidMessageContainer,
      SVG: options?.SVG,
    });

    this._currentTool = this.flippingTool;

    this._currMode = this._pivotingMode;
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
      let mouseoveredBase: Base | undefined = undefined;
      this.strictDrawing.drawing.bases().forEach(b => {
        if (event.target instanceof Node && b.text.node.contains(event.target)) {
          mouseoveredBase = b;
        }
      });
      if (mouseoveredBase) {
        this._mouseoveredBase = mouseoveredBase;
        //this._handleMouseoverOnBase(mouseoveredBase);
      }

      this.currentTool.handleMouseover(event);
    });
  }

  _bindMouseout() {
    window.addEventListener('mouseout', event => {
      if (this._mouseoveredBase) {
        //this._handleMouseoutOnBase(this._mouseoveredBase);
        this._mouseoveredBase = undefined;
      }

      this.currentTool.handleMouseout(event);
    });
  }

  _bindMousedown() {
    window.addEventListener('mousedown', event => {
      if (this._mouseoveredBase) {
        //this._handleMousedownOnBase(this._mouseoveredBase);
      } else if (event.target == this.strictDrawing.drawing.svg.node) {
        //this._handleMousedownOnDrawing();
      }

      this.currentTool.handleMousedown(event);
    });
  }

  _bindDblclick() {
    window.addEventListener('dblclick', event => {
      if (!this._mouseoveredBase && event.target == this.strictDrawing.drawing.svg.node) {
        //this._handleDblclickOnDrawing();
      }

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

  _handleMousedownOnDrawing() {
    this._currMode.handleMousedownOnDrawing();
  }

  _handleDblclickOnDrawing() {
    if (this._currMode == this._foldingMode) {
      this._foldingMode.handleDblclickOnDrawing();
    } else if (this._currMode == this._annotatingMode) {
      this._annotatingMode.handleDblclickOnDrawing();
    }
  }

  _handleMouseoverOnBase(b: Base) {
    this._currMode.handleMouseoverOnBase(b);
  }

  _handleMouseoutOnBase(b: Base) {
    this._currMode.handleMouseoutOnBase(b);
  }

  _handleMousedownOnBase(b: Base) {
    this._currMode.handleMousedownOnBase(b);
  }

  _initializePivotingMode() {
    this._pivotingMode = new PivotingMode(this.strictDrawing);
    this._pivotingMode.onShouldPushUndo(() => this.fireShouldPushUndo());
    this._pivotingMode.onChange(() => this.fireChange());
    this._pivotingMode.enable();
  }

  _initializeFoldingMode() {
    this._foldingMode = new FoldingMode(this.strictDrawing);
    this._foldingMode.onShouldPushUndo(() => this.fireShouldPushUndo());
    this._foldingMode.onChange(() => this.fireChange());
    this._foldingMode.disable();
  }

  _initializeTriangularizingMode() {
    this._triangularizingMode = new TriangularizingMode(this.strictDrawing);
    this._triangularizingMode.onShouldPushUndo(() => this.fireShouldPushUndo());
    this._triangularizingMode.onChange(() => this.fireChange());
    this._triangularizingMode.disable();
  }

  _initializeAnnotatingMode() {
    this._annotatingMode = new AnnotatingMode(this._app);
    this._annotatingMode.onShouldPushUndo(() => this.fireShouldPushUndo());
    this._annotatingMode.onChange(() => this.fireChange());
    this._annotatingMode.onRequestToRenderForm(
      (ff, options) => this.requestToRenderForm(ff, options)
    );
    this._annotatingMode.disable();
  }

  reset() {
    this._currMode.reset();
  }

  refresh() {
    if (this._currMode == this._annotatingMode) {
      this._annotatingMode.refresh();
    } else if (this._currMode == this._foldingMode) {
      this._foldingMode.refresh();
    } else {
      this._currMode.reset();
    }
    this.currentTool.refresh();
    this.fireChange();
  }

  fireShouldPushUndo() {
    this._app.pushUndo();
  }

  fireChange() {
    this._app.renderPeripherals();
  }

  requestToRenderForm(ff: FormFactory, options?: RenderFormOptions) {
    this._app.formContainer.renderForm(ff, options);
  }

  get pivotingMode(): PivotingMode {
    return this._pivotingMode;
  }

  get foldingMode(): FoldingMode {
    return this._foldingMode;
  }

  get triangularizingMode(): TriangularizingMode {
    return this._triangularizingMode;
  }

  get annotatingMode(): AnnotatingMode {
    return this._annotatingMode;
  }

  pivoting(): boolean {
    return this._currMode.className == 'PivotingMode';
  }

  folding(): boolean {
    return this._currMode.className == 'FoldingMode';
  }

  flipping(): boolean {
    return this._currMode.className == 'FlippingMode';
  }

  triangularizing(): boolean {
    return this._currMode.className == 'TriangularizingMode';
  }

  annotating(): boolean {
    return this._currMode.className == 'AnnotatingMode';
  }

  _start(mode: Mode) {
    if (this._currMode != mode) {
      this._currMode.reset();
      if (this._currMode == this._annotatingMode) {
        this._annotatingMode.closeForm();
      }
      this._currMode.disable();
      mode.enable();
      mode.reset();
      if (mode == this._annotatingMode) {
        this._annotatingMode.requestToRenderForm();
      }
      this._currMode = mode;
      this.fireChange();
    }

    this._currMode.disable();
  }

  startPivoting() {
    this._start(this._pivotingMode);
  }

  startFolding() {
    this._start(this._foldingMode);
  }

  startTriangularizing() {
    this._start(this._triangularizingMode);
  }

  startAnnotating() {
    this._start(this._annotatingMode);
  }
}

export default StrictDrawingInteraction;
