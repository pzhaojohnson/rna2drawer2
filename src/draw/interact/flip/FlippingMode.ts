import { FlippingModeInterface } from './FlippingModeInterface';
import { StrictDrawingInterface as StrictDrawing } from '../../StrictDrawingInterface';
import { BaseInterface as Base } from '../../BaseInterface';
import {
  handleMouseoverOnBase,
  handleMouseoutOnBase,
  handleMousedownOnBase,
  refresh,
  reset,
} from './handlers';

export class FlippingMode implements FlippingModeInterface {
  readonly className: 'FlippingMode';

  readonly strictDrawing: StrictDrawing;

  hovered?: number;

  _onChange?: () => void;
  _onShouldPushUndo?: () => void;

  constructor(strictDrawing: StrictDrawing) {
    this.className = 'FlippingMode';

    this.strictDrawing = strictDrawing;
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

  handleMousedownOnDrawing() {}

  handleMouseup() {}

  refresh() {
    refresh(this);
  }

  reset() {
    reset(this);
  }

  disable() {}

  enable() {}

  onChange(f: () => void) {
    this._onChange = f;
  }

  fireChange() {
    if (this._onChange) {
      this._onChange();
    }
  }

  onShouldPushUndo(f: () => void) {
    this._onShouldPushUndo = f;
  }

  fireShouldPushUndo() {
    if (this._onShouldPushUndo) {
      this._onShouldPushUndo();
    }
  }
}
