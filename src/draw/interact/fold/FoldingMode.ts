import FoldingModeInterface from './FoldingModeInterface';
import StrictDrawing from '../../StrictDrawing';
import Base from '../../Base';
import {
  handleMouseoverOnBase,
  handleMouseoutOnBase,
  handleMousedownOnBase,
  handleMousedownOnDrawing,
  handleMouseup,
  reset,
} from './handlers';

enum SubMode {
  pairingComplements,
  forcePairing,
  onlyAddingTertiaryBonds,
}

class FoldingMode implements FoldingModeInterface {
  _strictDrawing: StrictDrawing;

  _subMode: SubMode;

  hovered?: number | null;
  selected?: {
    tightEnd: number,
    looseEnd: number
  } | null;
  selecting?: boolean;

  _includeGUT: boolean;
  _allowedMismatch: number;
  
  _disabled?: boolean;
  
  _onShouldPushUndo?: () => void;
  _onChange?: () => void;

  constructor(strictDrawing: StrictDrawing) {
    this._strictDrawing = strictDrawing;
    this._subMode = SubMode.pairingComplements;

    this._includeGUT = true;
    this._allowedMismatch = 0;

    this._setBindings();
  }

  get className(): string {
    return 'FoldingMode';
  }

  get strictDrawing(): StrictDrawing {
    return this._strictDrawing;
  }

  get includeGUT(): boolean {
    return this._includeGUT;
  }

  set includeGUT(b: boolean) {
    this._includeGUT = b;
    this.fireChange();
  }

  get allowedMismatch(): number {
    return this._allowedMismatch;
  }

  set allowedMismatch(am: number) {
    this._allowedMismatch = am;
    this.fireChange();
  }

  handleMouseoverOnBase(b: Base) {
    handleMouseoverOnBase(this, b);
  }

  handleMouseoutOnBase(b: Base) {
    handleMouseoutOnBase(this, b);
  }

  handleMousedownOnBase(b: Base) {
    handleMousedownOnBase(this, b);
  }

  handleMousedownOnDrawing() {  
    handleMousedownOnDrawing(this);
  }

  _setBindings() {
    window.addEventListener('mouseup', () => {
      handleMouseup(this);
    });
  }

  reset() {
    reset(this);
  }

  pairComplements() {
    if (!this.pairingComplements()) {
      this._subMode = SubMode.pairingComplements;
      this.fireChange();
    }
  }

  pairingComplements(): boolean {
    return this._subMode == SubMode.pairingComplements;
  }

  forcePair() {
    if (!this.forcePairing()) {
      this._subMode = SubMode.forcePairing;
      this.fireChange();
    }
  }

  forcePairing(): boolean {
    return this._subMode == SubMode.forcePairing;
  }

  onlyAddTertiaryBonds() {
    if (!this.onlyAddingTertiaryBonds()) {
      this._subMode = SubMode.onlyAddingTertiaryBonds;
      this.fireChange();
    }
  }

  onlyAddingTertiaryBonds(): boolean {
    return this._subMode == SubMode.onlyAddingTertiaryBonds;
  }

  disable() {
    this._disabled = true;
  }

  disabled(): boolean {
    if (this._disabled) {
      return true;
    }
    return false;
  }

  enable() {
    this._disabled = false;
  }

  enabled() {
    return !this.disabled();
  }

  onShouldPushUndo(f: () => void) {
    this._onShouldPushUndo = f;
  }

  fireShouldPushUndo() {
    if (this._onShouldPushUndo) {
      this._onShouldPushUndo();
    }
  }

  onChange(f: () => void) {
    this._onChange = f;
  }

  fireChange() {
    if (this._onChange) {
      this._onChange();
    }
  }
}

export default FoldingMode;
