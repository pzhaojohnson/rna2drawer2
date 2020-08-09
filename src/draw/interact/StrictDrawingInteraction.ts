import PivotingMode from './pivot/PivotingMode';
import FoldingMode from './fold/FoldingMode';
import AnnotatingMode from './annotate/AnnotatingMode';
import { FormFactory } from './annotate/AnnotatingModeInterface';
import TertiaryBondsInteraction from './tertiaryBonds/TertiaryBondsInteraction';
import StrictDrawing from '../StrictDrawing';
import Sequence from '../Sequence';
import Base from '../Base';

type Mode = PivotingMode | FoldingMode | AnnotatingMode;

class StrictDrawingInteraction {
  _strictDrawing: StrictDrawing;

  _tertiaryBondsInteraction!: TertiaryBondsInteraction;

  _pivotingMode!: PivotingMode;
  _foldingMode!: FoldingMode;
  _annotatingMode!: AnnotatingMode;
  _currMode: Mode;

  _onShouldPushUndo?: () => void;
  _onChange?: () => void;
  _onRequestToRenderForm?: (ff: FormFactory) => void;

  constructor(strictDrawing: StrictDrawing) {
    this._strictDrawing = strictDrawing;

    this._setBindings();
    this._initializePivotingMode();
    this._initializeFoldingMode();
    this._initializeAnnotatingMode();
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

  _initializeAnnotatingMode() {
    this._annotatingMode = new AnnotatingMode(this.strictDrawing.drawing);
    this._annotatingMode.onShouldPushUndo(() => this.fireShouldPushUndo());
    this._annotatingMode.onChange(() => this.fireChange());
    this._annotatingMode.onRequestToRenderForm(ff => this.requestToRenderForm(ff));
    this._annotatingMode.disable();
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

  onRequestToRenderForm(f: (ff: FormFactory) => void) {
    this._onRequestToRenderForm = f;
  }

  requestToRenderForm(ff: FormFactory) {
    if (this._onRequestToRenderForm) {
      this._onRequestToRenderForm(ff);
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

  get annotatingMode(): AnnotatingMode {
    return this._annotatingMode;
  }

  pivoting(): boolean {
    return this._currMode.className == 'PivotingMode';
  }

  folding(): boolean {
    return this._currMode.className == 'FoldingMode';
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

  startAnnotating() {
    this._start(this._annotatingMode);
  }
}

export default StrictDrawingInteraction;
