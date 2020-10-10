import {
  PivotingModeInterface,
  Stem,
} from './PivotingModeInterface';
import { StrictDrawingInterface as StrictDrawing } from '../../StrictDrawingInterface';
import { BaseInterface as Base } from '../../BaseInterface';
import { addMousemoveListener } from '../listeners/addMousemoveListener';
import { addMouseupListener } from '../listeners/addMouseupListener';
import {
  handleMouseoverOnBase,
  handleMouseoutOnBase,
  handleMousedownOnBase,
  handleMousemove,
  handleMouseup,
  reset,
} from './handlers';

export class PivotingMode implements PivotingModeInterface {
  readonly strictDrawing: StrictDrawing;

  hovered?: Stem;
  selected?: Stem;

  pivoted?: boolean;

  _onlyAddStretch?: boolean;
  _disabled?: boolean;

  _onShouldPushUndo?: () => void;
  _onChange?: () => void;

  constructor(strictDrawing: StrictDrawing) {
    this.strictDrawing = strictDrawing;

    this._setBindings();
  }

  get className() {
    return 'PivotingMode';
  }

  _setBindings() {
    this._bindMousemove();
    this._bindMouseup();
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

  _bindMousemove() {
    addMousemoveListener((event, movement) => handleMousemove(this, event, movement));
  }

  _bindMouseup() {
    addMouseupListener(event => handleMouseup(this));
  }

  onlyAddStretch() {
    this._onlyAddStretch = true;
    this.fireChange();
  }

  onlyAddingStretch() {
    return this._onlyAddStretch ? true : false;
  }

  addAndRemoveStretch() {
    this._onlyAddStretch = false;
    this.fireChange();
  }

  addingAndRemovingStretch(): boolean {
    return !this.onlyAddingStretch();
  }

  reset() {
    reset(this);
  }

  disable() {
    this._disabled = true;
  }

  disabled() {
    return this._disabled ? true : false;
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

export default PivotingMode;
