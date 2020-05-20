import PivotingMode from './PivotingMode';
import TertiaryBondsInteraction from './TertiaryBondsInteraction';

class StrictDrawingInteraction {
  constructor(strictDrawing) {
    this._strictDrawing = strictDrawing;

    this._setBindings();
    this._initializePivotingMode();
    this._initializeTertiaryBondsInteraction();
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
    drawing.forEachSequence(seq => this._bindSequence(seq));
    drawing.onAddSequence(seq => this._bindSequence(seq));
  }

  _bindSequence(seq) {
    seq.forEachBase(b => this._bindBase(b));
    seq.onAddBase(b => this._bindBase(b));
  }

  _bindBase(b) {
    b.cursor = 'pointer';
    b.onMouseover(() => this._handleMouseoverOnBase(b));
    b.onMouseout(() => this._handleMouseoutOnBase(b));
    b.onMousedown(() => this._handleMousedownOnBase(b));
  }

  _handleMouseoverOnBase(b) {
    this._pivotingMode.handleMouseoverOnBase(b);
  }

  _handleMouseoutOnBase(b) {
    this._pivotingMode.handleMouseoutOnBase(b);
  }

  _handleMousedownOnBase(b) {
    this._pivotingMode.handleMousedownOnBase(b);
  }

  _initializePivotingMode() {
    this._pivotingMode = new PivotingMode(this.strictDrawing);
    this._pivotingMode.onShouldPushUndo(() => this.fireShouldPushUndo());
    this._pivotingMode.onChange(() => this.fireChange());
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
    this._pivotingMode.reset();
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
}

export default StrictDrawingInteraction;
