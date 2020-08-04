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

class FoldingMode implements FoldingModeInterface {
  _strictDrawing: StrictDrawing;

  hovered?: number | null;
  selected?: {
    tightEnd: number,
    looseEnd: number
  } | null;
  selecting?: boolean;
  
  _disabled?: boolean;
  
  _onShouldPushUndo?: () => void;
  _onChange?: () => void;

  constructor(strictDrawing: StrictDrawing) {
    this._strictDrawing = strictDrawing;

    this._setBindings();
  }

  get className(): string {
    return 'FoldingMode';
  }

  get strictDrawing(): StrictDrawing {
    return this._strictDrawing;
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
