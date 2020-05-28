import PivotingMode from './pivot/PivotingMode';
import FoldingMode from './fold/FoldingMode';
import TertiaryBondsInteraction from './tertiaryBonds/TertiaryBondsInteraction';

class StrictDrawingInteraction {
  constructor(strictDrawing) {
    this._strictDrawing = strictDrawing;

    this._setBindings();
    this._initializePivotingMode();
    this._initializeFoldingMode();
    this._initializeTertiaryBondsInteraction();

    this._currMode = this._pivotingMode;
  }

  get strictDrawing() {
    return this._strictDrawing;
  }

  _setBindings() {
    let drawing = this.strictDrawing.drawing;
    this._bindDrawing(drawing);
  }

  _bindDrawing() {
    let drawing = this.strictDrawing.drawing;
    drawing.onMousedown(() => this._handleMousedownOnDrawing());
    drawing.forEachSequence(seq => this._bindSequence(seq));
    drawing.onAddSequence(seq => this._bindSequence(seq));
  }

  _handleMousedownOnDrawing() {
    this._currMode.handleMousedownOnDrawing();
  }

  _bindSequence(seq) {
    seq.forEachBase(b => this._bindBase(b));
    seq.onAddBase(b => this._bindBase(b));
  }

  _bindBase(b) {
    b.onMouseover(event => this._handleMouseoverOnBase(b, event));
    b.onMouseout(event => this._handleMouseoutOnBase(b, event));
    b.onMousedown(event => this._handleMousedownOnBase(b, event));
  }

  _handleMouseoverOnBase(b, event) {
    this._currMode.handleMouseoverOnBase(b, event);
  }

  _handleMouseoutOnBase(b, event) {
    this._currMode.handleMouseoutOnBase(b, event);
  }

  _handleMousedownOnBase(b, event) {
    this._currMode.handleMousedownOnBase(b, event);
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

  _initializeTertiaryBondsInteraction() {
    this._tertiaryBondsInteraction = new TertiaryBondsInteraction(
      this.strictDrawing.drawing
    );
    this._tertiaryBondsInteraction.onShouldPushUndo(() => {
      this.fireShouldPushUndo();
    });
    this._tertiaryBondsInteraction.onChange(() => {
      this.fireChange();
    });
  }

  reset() {
    this._currMode.reset();
  }

  onShouldPushUndo(cb) {
    this._onShouldPushUndo = cb;
  }

  fireShouldPushUndo() {
    if (this._onShouldPushUndo) {
      this._onShouldPushUndo();
    }
  }

  onChange(cb) {
    this._onChange = cb;
  }

  fireChange() {
    if (this._onChange) {
      this._onChange();
    }
  }

  pivoting() {
    return this._currMode.className == 'PivotingMode';
  }

  folding() {
    return this._currMode.className == 'FoldingMode';
  }

  startPivoting() {
    if (this.pivoting()) {
      return;
    }
    this._currMode.reset();
    this._currMode.disable();
    this._pivotingMode.enable();
    this._pivotingMode.reset();
    this._currMode = this._pivotingMode;
    this.fireChange();
  }

  startFolding() {
    if (this.folding()) {
      return;
    }
    this._currMode.reset();
    this._currMode.disable();
    this._foldingMode.enable();
    this._foldingMode.reset();
    this._currMode = this._foldingMode;
    this.fireChange();
  }
}

export default StrictDrawingInteraction;
