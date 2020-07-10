import {
  highlightTertiaryBond,
  dehighlightTertiaryBond,
} from './highlightTertiaryBond';
import areSameTertiaryBond from './areSameTertiaryBond';
import dragTertiaryBond from './dragTertiaryBond';
import removeTertiaryBondFromDrawing from './removeTertiaryBondFromDrawing';
import Drawing from '../../Drawing';
import { TertiaryBond } from '../../QuadraticBezierBond';

class TertiaryBondsInteraction {
  _drawing: Drawing;
  _hovered?: TertiaryBond | null;
  _selected?: TertiaryBond | null;
  _dragging?: boolean;
  _dragged?: boolean;

  _xMousePrev!: number;
  _yMousePrev!: number;

  _onShouldPushUndo?: () => void;
  _onChange?: () => void;

  constructor(drawing: Drawing) {
    this._drawing = drawing;

    this._setBindings();
  }

  get drawing() {
    return this._drawing;
  }

  _setBindings() {
    this._bindAllTertiaryBonds();
    this._bindAddTertiaryBond();
    this._bindMousedown();
    this._bindMousemove();
    this._bindMouseup();
    this._bindKeys();
  }

  _bindAllTertiaryBonds() {
    this.drawing.forEachTertiaryBond((tb: TertiaryBond) => {
      this._bindTertiaryBond(tb);
    });
  }

  _bindAddTertiaryBond() {
    this.drawing.onAddTertiaryBond(tb => {
      this._bindTertiaryBond(tb);
    });
  }

  _bindTertiaryBond(tb: TertiaryBond) {
    tb.cursor = 'pointer';
    dehighlightTertiaryBond(tb);
    tb.onMouseover(() => this._handleMouseoverOnTertiaryBond(tb));
    tb.onMouseout(() => this._handleMouseoutOnTertiaryBond(tb));
    tb.onMousedown(() => this._handleMousedownOnTertiaryBond(tb));
  }

  _handleMouseoverOnTertiaryBond(tb: TertiaryBond) {
    this._hovered = tb;
    if (!this._dragging) {
      highlightTertiaryBond(tb);
    }
  }

  _handleMouseoutOnTertiaryBond(tb: TertiaryBond) {
    this._hovered = null;
    if (!this._selected || !areSameTertiaryBond(tb, this._selected)) {
      dehighlightTertiaryBond(tb);
    }
  }

  get selected(): (TertiaryBond | null | undefined) {
    return this._selected;
  }

  _dehover() {
    if (this._hovered) {
      dehighlightTertiaryBond(this._hovered);
      this._hovered = null;
    }
  }

  _handleMousedownOnTertiaryBond(tb: TertiaryBond) {
    if (this._selected && !areSameTertiaryBond(tb, this._selected)) {
      this._deselect();
    }
    this._selected = tb;
    this._dragging = true;
    this._dragged = false;
    this.fireChange();
  }

  _deselect() {
    if (this._selected) {
      dehighlightTertiaryBond(this._selected);
      this._selected = null;
      this._dragging = false;
    }
  }

  _bindMousedown() {
    this.drawing.onMousedown(() => {
      if (!this._hovered && this._selected) {
        this._deselect();
        this.fireChange();
      }
    });
  }

  _bindMousemove() {
    this._xMousePrev = NaN;
    this._yMousePrev = NaN;
    window.addEventListener('mousemove', event => {
      this._handleMousemove(event);
    });
  }

  _handleMousemove(event: MouseEvent) {
    let xMove = event.screenX - this._xMousePrev;
    let yMove = event.screenY - this._yMousePrev;
    if (this._dragging) {
      if (Number.isFinite(xMove) && Number.isFinite(yMove)) {
        this._dragSelected(xMove, yMove);
      }
    }
    this._xMousePrev = event.screenX;
    this._yMousePrev = event.screenY;
  }

  _dragSelected(xMove: number, yMove: number) {
    if (!this._selected) {
      return;
    }
    if (!this._dragged) {
      this.fireShouldPushUndo();
    }
    let z = this.drawing.zoom;
    dragTertiaryBond(this._selected, xMove / z, yMove / z);
    this._dragged = true;
  }

  _bindMouseup() {
    window.addEventListener('mouseup', () => {
      this._dragging = false;
    });
  }

  _bindKeys() {
    window.addEventListener('keydown', event => {
      let k = event.key.toLowerCase();
      if (k == 'backspace' || k == 'delete') {
        if (document.activeElement?.tagName.toLowerCase() != 'input') {
          if (this._selected) {
            this._removeSelected();
            this.fireChange();
          }
        }
      }
    });
  }

  _removeSelected() {
    if (this._selected) {
      this.fireShouldPushUndo();
      let tb = this._selected;
      this._deselect();
      removeTertiaryBondFromDrawing(tb, this.drawing);
    }
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

  reset() {
    this._dehover();
    this._deselect();
  }
}

export default TertiaryBondsInteraction;
