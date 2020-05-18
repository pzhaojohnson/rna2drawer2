class TertiaryBondsInteraction {
  constructor(drawing) {
    this._drawing = drawing;

    this._setBindings();
  }

  get drawing() {
    return this._drawing;
  }

  _setBindings() {
    this._bindAllTertiaryBondsInDrawing();
    this._bindAddTertiaryBond();
    this._bindMousedown();
    this._bindMousemove();
    this._bindMouseup();
    this._bindKeys();
  }

  _bindAllTertiaryBondsInDrawing() {
    this.drawing.forEachTertiaryBond(tb => {
      this._bindTertiaryBond(tb);
    });
  }

  _bindAddTertiaryBond() {
    this.drawing.onAddTertiaryBond(tb => {
      this._bindTertiaryBond(tb);
    });
  }

  _bindTertiaryBond(tb) {
    tb.cursor = 'pointer';
    tb.fill = 'none';
    tb.onMouseover(() => this._handleMouseoverOnTertiaryBond(tb));
    tb.onMouseout(() => this._handleMouseoutOnTertiaryBond(tb));
    tb.onMousedown(() => this._handleMousedownOnTertiaryBond(tb));
  }

  _handleMouseoverOnTertiaryBond(tb) {
    this._hovered = tb;
    if (!this._dragging) {
      tb.fill = tb.stroke;
      tb.fillOpacity = 0.1;
    }
  }

  _handleMouseoutOnTertiaryBond(tb) {
    this._hovered = null;
    if (!this._selected || tb.id !== this._selected.id) {
      tb.fill = 'none';
    }
  }

  _handleMousedownOnTertiaryBond(tb) {
    if (this._selected && this._selected.id !== tb.id) {
      this._unselect();
    }
    this._selected = tb;
    this._dragging = true;
    this._dragged = false;
  }

  _unselect() {
    if (this._selected) {
      this._selected.fill = 'none';
      this._selected = null;
    }
  }

  _bindMousedown() {
    window.addEventListener('mousedown', () => {
      if (!this._hovered) {
        this._unselect();
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

  _handleMousemove(event) {
    let xMove = 0;
    let yMove = 0;
    if (isFinite(this._xMousePrev) && isFinite(this._yMousePrev)) {
      xMove = event.clientX - this._xMousePrev;
      yMove = event.clientY - this._yMousePrev;
    }
    if (this._dragging) {
      this._drag(xMove, yMove);
    }
    this._xMousePrev = event.clientX;
    this._yMousePrev = event.clientY;
  }

  _drag(xMove, yMove) {
    if (!this._selected || !this._dragging) {
      return;
    }
    if (!this._dragged) {
      this.fireShouldPushUndo();
    }
    let z = this.drawing.zoom;
    let xShift = (2 * xMove) / z;
    let yShift = (2 * yMove) / z;
    this._selected.shiftControl(xShift, yShift);
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
        if (this._selected) {
          this.fireShouldPushUndo();
          let id = this._selected.id;
          this._unselect();
          this.drawing.removeTertiaryBondById(id);
        }
      }
    });
  }

  onShouldPushUndo(cb) {
    this._onShouldPushUndo = cb;
  }

  fireShouldPushUndo() {
    if (this._onShouldPushUndo) {
      this._onShouldPushUndo();
    }
  }

  onChange(cb) {
    this._onChange = cb;
  }

  fireChange() {
    if (this._onChange) {
      this._onChange();
    }
  }
}

export default TertiaryBondsInteraction;
