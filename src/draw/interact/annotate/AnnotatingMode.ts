import { AnnotatingModeInterface } from './AnnotatingModeInterface';
import { FormFactory } from 'FormContainer';
import { App } from 'App';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import {
  handleMouseoverOnBase,
  handleMouseoutOnBase,
  handleMousedownOnBase,
  handleMousedownOnDrawing,
  handleDblclickOnDrawing,
  handleMouseup,
  select,
  clearSelection,
  refresh,
  reset,
} from './handlers';
import { AnnotatingForm } from './AnnotatingForm';

export class AnnotatingMode implements AnnotatingModeInterface {
  _app: App;

  hovered?: number;
  selected: Set<number>;
  selectingFrom?: number;

  deselectingOnDblclick?: boolean;

  _disabled: boolean;

  _onShouldPushUndo: (() => void)[];
  _onChange: (() => void)[];
  _onRequestToRenderForm?: (ff: FormFactory) => void;
  _closeForm?: () => void;

  constructor(app: App) {
    this._app = app;

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

  get strictDrawing() {
    return this._app.strictDrawing;
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

  handleDblclickOnDrawing() {
    handleDblclickOnDrawing(this);
  }

  select(ps: number[]) {
    select(this, ps);
  }

  clearSelection() {
    clearSelection(this);
  }

  refresh() {
    refresh(this);
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
      this._onRequestToRenderForm(props => {
        this._closeForm = props.unmount;
        return AnnotatingForm({
          app: this._app,
          mode: this,
          unmount: props.unmount,
        });
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
