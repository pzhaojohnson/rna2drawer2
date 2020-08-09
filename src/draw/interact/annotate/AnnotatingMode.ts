import { AnnotatingModeInterface, FormFactory } from './AnnotatingModeInterface';
import { DrawingInterface as Drawing } from '../../DrawingInterface';
import { BaseInterface as Base } from '../../BaseInterface';
import {
  handleMouseoverOnBase,
  handleMouseoutOnBase,
  handleMousedownOnBase,
  handleMousedownOnDrawing,
  handleMouseup,
  reset,
} from './handlers';
import AnnotateBasesBySelection from '../../../forms/annotate/bases/AnnotateBasesBySelection';

export class AnnotatingMode implements AnnotatingModeInterface {
  _drawing: Drawing;

  hovered?: number;
  selected: Set<number>;
  selectingFrom?: number;

  _disabled: boolean;

  _onShouldPushUndo: (() => void)[];
  _onChange: (() => void)[];
  _onRequestToRenderForm?: (ff: FormFactory) => void;
  _closeForm?: () => void;

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
      handleMouseup(this);
    });
  }

  get className(): string {
    return 'AnnotatingMode';
  }

  get drawing(): Drawing {
    return this._drawing;
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

  reset() {
    reset(this);
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

  onRequestToRenderForm(f: (ff: FormFactory) => void) {
    this._onRequestToRenderForm = f;
  }

  requestToRenderForm() {
    if (this._onRequestToRenderForm) {
      this._onRequestToRenderForm(close => {
        this._closeForm = close;
        return AnnotateBasesBySelection(this, close);
      });
    }
  }

  closeForm() {
    if (this._closeForm) {
      this._closeForm();
      this._closeForm = undefined;
    }
  }
}

export default AnnotatingMode;
