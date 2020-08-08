import AnnotatingModeInterface from './AnnotatingModeInterface';
import { DrawingInterface as Drawing } from '../../DrawingInterface';

export class AnnotatingMode implements AnnotatingModeInterface {
  _drawing: Drawing;

  hovered?: number;
  selected: Set<number>;
  selectingFrom?: number;

  _disabled: boolean;

  _onShouldPushUndo: (() => void)[];
  _onChange: (() => void)[];

  constructor(drawing: Drawing) {
    this._drawing = drawing;

    this.selected = new Set<number>();

    this._disabled = true;

    this._onShouldPushUndo = [];
    this._onChange = [];

    this._setBindings();
  }

  _setBindings() {
    window.addEventListener('mouseup', () => {

    });
  }

  get drawing(): Drawing {
    return this._drawing;
  }

  disabled(): boolean {
    return this._disabled;
  }

  disable() {
    this._disabled = true;
  }

  enabled(): boolean {
    return !this.disabled();
  }

  enable() {
    this._disabled = false;
  }

  onShouldPushUndo(f: () => void) {
    this._onShouldPushUndo.push(f);
  }

  fireShouldPushUndo() {
    this._onShouldPushUndo.forEach(f => f());
  }

  onChange(f: () => void) {
    this._onChange.push(f);
  }

  fireChange() {
    this._onChange.forEach(f => f());
  }
}

export default AnnotatingMode;
