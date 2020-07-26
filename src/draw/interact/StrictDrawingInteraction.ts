import PivotingMode from './pivot/PivotingMode';
import FoldingMode from './fold/FoldingMode';
import TertiaryBondsInteraction from './tertiaryBonds/TertiaryBondsInteraction';
import StrictDrawing from '../StrictDrawing';
import Sequence from '../Sequence';
import Base from '../Base';

class StrictDrawingInteraction {
  _strictDrawing: StrictDrawing;

  _tertiaryBondsInteraction!: TertiaryBondsInteraction;

  _pivotingMode!: PivotingMode;
  _foldingMode!: FoldingMode;
  _currMode: PivotingMode | FoldingMode;

  _onShouldPushUndo?: () => void;
  _onChange?: () => void;

  constructor(strictDrawing: StrictDrawing) {
    this._strictDrawing = strictDrawing;

    this._setBindings();
    this._initializePivotingMode();
    this._initializeFoldingMode();
    this._initializeTertiaryBondsInteraction();

    this._currMode = this._pivotingMode;
  }

  get strictDrawing(): StrictDrawing {
    return this._strictDrawing;
  }

  _setBindings() {
    let drawing = this.strictDrawing.drawing;
    this._bindDrawing();
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

  _bindSequence(seq: Sequence) {
    seq.forEachBase(b => this._bindBase(b));
    seq.onAddBase(b => this._bindBase(b));
  }

  _bindBase(b: Base) {
    b.onMouseover(() => this._handleMouseoverOnBase(b));
    b.onMouseout(() => this._handleMouseoutOnBase(b));
    b.onMousedown(() => this._handleMousedownOnBase(b));
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
    this.tertiaryBondsInteraction.reset();
    this._currMode.reset();
  }

  refresh() {
    this.tertiaryBondsInteraction.refresh();
    this._currMode.reset();
    this.fireChange();
  }

  onShouldPushUndo(cb: () => void) {
    this._onShouldPushUndo = cb;
  }

  fireShouldPushUndo() {
    if (this._onShouldPushUndo) {
      this._onShouldPushUndo();
    }
  }

  onChange(cb: () => void) {
    this._onChange = cb;
  }

  fireChange() {
    if (this._onChange) {
      this._onChange();
    }
  }

  get tertiaryBondsInteraction(): TertiaryBondsInteraction {
    return this._tertiaryBondsInteraction;
  }

  get pivotingMode(): PivotingMode {
    return this._pivotingMode;
  }

  get foldingMode(): FoldingMode {
    return this._foldingMode;
  }

  pivoting(): boolean {
    return this._currMode.className == 'PivotingMode';
  }

  folding(): boolean {
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
