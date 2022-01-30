import PivotingMode from './pivot/PivotingMode';
import FoldingMode from './fold/FoldingMode';
import { FlippingMode } from './flip/FlippingMode';
import { TriangularizingMode } from './triangularize/TriangularizingMode';
import AnnotatingMode from './annotate/AnnotatingMode';
import { FormFactory } from 'FormContainer';
import { RenderFormOptions } from 'FormContainer';
import { App } from 'App';
import { TertiaryBondsInteraction } from 'Draw/interact/bonds/tertiary/TertiaryBondsInteraction';
import { StrictDrawing } from 'Draw/strict/StrictDrawing';
import { Base } from 'Draw/bases/Base';

type Mode = PivotingMode | FoldingMode | FlippingMode | TriangularizingMode | AnnotatingMode;

class StrictDrawingInteraction {
  _app: App;

  readonly tertiaryBondsInteraction: TertiaryBondsInteraction;

  _pivotingMode!: PivotingMode;
  _foldingMode!: FoldingMode;
  _flippingMode!: FlippingMode;
  _triangularizingMode!: TriangularizingMode;
  _annotatingMode!: AnnotatingMode;
  _currMode: Mode;

  _mouseoveredBase?: Base;

  constructor(app: App) {
    this._app = app;

    this._setBindings();
    this._initializePivotingMode();
    this._initializeFoldingMode();
    this._initializeFlippingMode();
    this._initializeTriangularizingMode();
    this._initializeAnnotatingMode();

    this.tertiaryBondsInteraction = new TertiaryBondsInteraction({
      app: app,
      drawing: app.strictDrawing.drawing,
    });

    this._currMode = this._pivotingMode;
  }

  get strictDrawing(): StrictDrawing {
    return this._app.strictDrawing;
  }

  _setBindings() {
    this._bindMouseover();
    this._bindMouseout();
    this._bindMousedown();
    this._bindDblclick();
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
        this._handleMouseoverOnBase(mouseoveredBase);
      }
    });
  }

  _bindMouseout() {
    window.addEventListener('mouseout', () => {
      if (this._mouseoveredBase) {
        this._handleMouseoutOnBase(this._mouseoveredBase);
        this._mouseoveredBase = undefined;
      }
    });
  }

  _bindMousedown() {
    window.addEventListener('mousedown', event => {
      if (this._mouseoveredBase) {
        this._handleMousedownOnBase(this._mouseoveredBase);
      } else if (event.target == this.strictDrawing.drawing.svg.node) {
        this._handleMousedownOnDrawing();
      }
    });
  }

  _bindDblclick() {
    window.addEventListener('dblclick', event => {
      if (!this._mouseoveredBase && event.target == this.strictDrawing.drawing.svg.node) {
        this._handleDblclickOnDrawing();
      }
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

  _initializeFlippingMode() {
    this._flippingMode = new FlippingMode(this.strictDrawing);
    this._flippingMode.onShouldPushUndo(() => this.fireShouldPushUndo());
    this._flippingMode.onChange(() => this.fireChange());
    this._flippingMode.disable();
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
    this.tertiaryBondsInteraction.reset();
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
    this.tertiaryBondsInteraction.refresh();
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

  get flippingMode(): FlippingMode {
    return this._flippingMode;
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
  }

  startPivoting() {
    this._start(this._pivotingMode);
  }

  startFolding() {
    this._start(this._foldingMode);
  }

  startFlipping() {
    this._start(this._flippingMode);
  }

  startTriangularizing() {
    this._start(this._triangularizingMode);
  }

  startAnnotating() {
    this._start(this._annotatingMode);
  }
}

export default StrictDrawingInteraction;
