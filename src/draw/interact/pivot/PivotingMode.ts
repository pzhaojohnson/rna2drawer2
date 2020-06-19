import PivotingModeInterface from './PivotingModeInterface';
import handleMouseoverOnBase from './handleMouseoverOnBase';
import handleMouseoutOnBase from './handleMouseoutOnBase';
import handleMousedownOnBase from './handleMousedownOnBase';
import handleMousemove from './handleMousemove';
import handleMouseup from './handleMouseup';
import removeAllBaseHighlightings from '../highlight/removeAllBaseHighlightings';
import StrictDrawing from '../../StrictDrawing';
import Base from '../../Base';

export class PivotingMode implements PivotingModeInterface {
  _strictDrawing: StrictDrawing;
  selectedPosition: number | null;
  pivoted: boolean;
  _onlyAddStretch: boolean;
  
  _disabled: boolean;

  _onShouldPushUndo?: () => void;
  _onChange?: () => void;

  constructor(strictDrawing: StrictDrawing) {
    this._strictDrawing = strictDrawing;
    this.selectedPosition = null;
    this.pivoted = false;
    this._onlyAddStretch = false;
    this._disabled = false;

    this._setBindings();
  }

  get className() {
    return 'PivotingMode';
  }

  get strictDrawing() {
    return this._strictDrawing;
  }

  _setBindings() {
    this._bindMousemove();
    this._bindMouseup();
    this._bindKeys();
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
    window.addEventListener('mousemove', event => {
      handleMousemove(this, event);
    });
  }

  _bindMouseup() {
    window.addEventListener('mouseup', () => {
      handleMouseup(this);
    });
  }

  _bindKeys() {
    window.addEventListener('keydown', event => {
      let k = event.key.toLowerCase();
      if (k == 'shift') {
        this.onlyAddStretch();
      }
    });
  }

  onlyAddStretch() {
    this._onlyAddStretch = true;
  }

  onlyAddingStretch() {
    return this._onlyAddStretch;
  }

  addAndRemoveStretch() {
    this._onlyAddStretch = false;
  }

  reset() {
    this.selectedPosition = null;
    removeAllBaseHighlightings(this.strictDrawing.drawing);
  }

  disable() {
    this._disabled = true;
  }
  
  disabled() {
    return this._disabled;
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
