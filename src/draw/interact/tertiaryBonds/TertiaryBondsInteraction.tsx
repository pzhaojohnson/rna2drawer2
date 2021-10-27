import {
  TertiaryBondsInteractionInterface,
  FormFactory,
} from './TertiaryBondsInteractionInterface';
import { App } from 'App';
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
  _app: App;
  
  hovered?: string;
  selected: Set<string>;

  dragging: boolean;
  dragged: boolean;

  _onShouldPushUndo?: () => void;
  _onChange?: () => void;

  _onRequestToRenderForm?: (ff: FormFactory) => void;

  constructor(app: App) {
    this._app = app;
    
    this.selected = new Set<string>();

    this.dragging = false;
    this.dragged = false;

    this._setBindings();
  }

  get drawing() {
    return this._app.strictDrawing.drawing;
  }

  _setBindings() {
    this._bindMouseover();
    this._bindMouseout();
    this._bindMousedown();
    this._bindDblclick();
    this._bindMousemove();
    this._bindMouseup();
    this._bindKeys();
  }

  _bindMouseover() {
    window.addEventListener('mouseover', event => {
      let mouseovered: TertiaryBond | undefined = undefined;
      this.drawing.tertiaryBonds.forEach(tb => {
        if (event.target instanceof Node && tb.path.wrapped.node.contains(event.target)) {
          mouseovered = tb;
        }
      });
      if (mouseovered) {
        handleMouseoverOnTertiaryBond(this, mouseovered);
      }
    });
  }

  _bindMouseout() {
    window.addEventListener('mouseout', () => {
      if (typeof this.hovered == 'string') {
        let mouseouted = this.drawing.tertiaryBonds.find(tb => tb.id == this.hovered);
        if (mouseouted) {
          handleMouseoutOnTertiaryBond(this, mouseouted);
        }
      }
    });
  }

  _bindMousedown() {
    window.addEventListener('mousedown', event => {
      if (typeof this.hovered == 'string') {
        let mousedowned = this.drawing.tertiaryBonds.find(tb => tb.id == this.hovered);
        if (mousedowned) {
          handleMousedownOnTertiaryBond(this, mousedowned);
        }
      } else if (event.target == this.drawing.svg.node) {
        handleMousedownOnDrawing(this);
      }
    });
  }

  _bindDblclick() {
    window.addEventListener('dblclick', () => {
      if (typeof this.hovered == 'string') {
        this.requestToRenderForm();
      }
    });
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
          app={this._app}
          drawing={this.drawing}
          getTertiaryBonds={
            () => this.drawing.tertiaryBonds.filter(tb => this.selected.has(tb.id))
          }
          pushUndo={() => this.fireShouldPushUndo()}
          changed={() => this.fireChange()}
          close={close ? close : () => {}}
        />
      ));
    }
  }
}

export default TertiaryBondsInteraction;
