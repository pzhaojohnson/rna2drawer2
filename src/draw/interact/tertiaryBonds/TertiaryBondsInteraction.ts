import { DrawingInterface as Drawing } from '../../DrawingInterface';
import { TertiaryBondInterface as TertiaryBond } from '../../QuadraticBezierBondInterface';
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

class TertiaryBondsInteraction {
  _drawing: Drawing;

  hovered?: string;
  selected: Set<string>;

  dragging: boolean;
  dragged: boolean;

  _onShouldPushUndo?: () => void;
  _onChange?: () => void;

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
    tb.cursor = 'pointer';
    tb.onMouseover(() => handleMouseoverOnTertiaryBond(this, tb));
    tb.onMouseout(() => handleMouseoutOnTertiaryBond(this, tb));
    tb.onMousedown(() => handleMousedownOnTertiaryBond(this, tb));
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
}

export default TertiaryBondsInteraction;
