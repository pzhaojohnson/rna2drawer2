import {
  TertiaryBondsInteractionInterface,
  FormFactory,
} from './TertiaryBondsInteractionInterface';
import { DrawingInterface as Drawing } from '../../DrawingInterface';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import {
  handleMouseoverOnTertiaryBond,
  handleMouseoutOnTertiaryBond,
  handleMousedownOnTertiaryBond,
  handleMousedownOnDrawing,
  handleMousemove,
  handleMouseup,removeSelected,
  refresh,
  reset,
} from './handlers';
import { addMousemoveListener } from '../listeners/addMousemoveListener';
import { addMouseupListener } from '../listeners/addMouseupListener';
import * as React from 'react';
import { EditTertiaryBonds } from '../../../forms/edit/tertiaryBonds/EditTertiaryBonds';

class TertiaryBondsInteraction implements TertiaryBondsInteractionInterface {
  _drawing: Drawing;

  hovered?: string;
  selected: Set<string>;

  dragging: boolean;
  dragged: boolean;

  _onShouldPushUndo?: () => void;
  _onChange?: () => void;

  _onRequestToRenderForm?: (ff: FormFactory) => void;

  constructor(drawing: Drawing) {
    this._drawing = drawing;

    this.selected = new Set<string>();

    this.dragging = false;
    this.dragged = false;

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
    this.drawing.forEachTertiaryBond(tb => {
      this._bindTertiaryBond(tb);
    });
  }

  _bindAddTertiaryBond() {
    this.drawing.onAddTertiaryBond(tb => {
      this._bindTertiaryBond(tb);
    });
  }

  _bindTertiaryBond(tb: TertiaryBond) {
    tb.path.wrapped.css('cursor', 'pointer');
    tb.path.mouseover(() => handleMouseoverOnTertiaryBond(this, tb));
    tb.path.mouseout(() => handleMouseoutOnTertiaryBond(this, tb));
    tb.path.mousedown(() => handleMousedownOnTertiaryBond(this, tb));
    tb.path.dblclick(() => this.requestToRenderForm());
  }

  _bindMousedown() {
    this.drawing.onMousedown(() => handleMousedownOnDrawing(this));
  }

  _bindMousemove() {
    addMousemoveListener((event, movement) => handleMousemove(this, event, movement));
  }

  _bindMouseup() {
    addMouseupListener(event => handleMouseup(this));
  }

  _bindKeys() {
    window.addEventListener('keydown', event => {
      let k = event.key.toLowerCase();
      if (k == 'backspace' || k == 'delete') {
        if (document.activeElement?.tagName.toLowerCase() != 'input') {
          removeSelected(this);
        }
      }
    });
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

  refresh() {
    refresh(this);
  }

  reset() {
    reset(this);
  }

  onRequestToRenderForm(f: (ff: FormFactory) => void) {
    this._onRequestToRenderForm = f;
  }

  requestToRenderForm() {
    if (this._onRequestToRenderForm) {
      this._onRequestToRenderForm(close => (
        <EditTertiaryBonds
          getTertiaryBonds={() => this.drawing.getTertiaryBondsByIds(this.selected)}
          pushUndo={() => this.fireShouldPushUndo()}
          changed={() => this.fireChange()}
          close={close ? close : () => {}}
        />
      ));
    }
  }
}

export default TertiaryBondsInteraction;
