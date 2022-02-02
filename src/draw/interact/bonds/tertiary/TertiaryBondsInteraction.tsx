import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';

import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';

import { shiftControlPoint } from 'Draw/bonds/curved/drag';
import { zoom } from 'Draw/zoom';

import { removeTertiaryBondById } from 'Draw/bonds/curved/remove';
import { userIsTyping } from 'Utilities/userIsTyping';

import { DrawingOverlay } from 'Draw/interact/DrawingOverlay';
import { TertiaryBondHighlighting } from './TertiaryBondHighlighting';

import * as React from 'react';
import { EditTertiaryBonds } from 'Forms/edit/bonds/tertiary/EditTertiaryBonds';
import { v4 as uuidv4 } from 'uuid';

import * as SVG from '@svgdotjs/svg.js';

export type Options = {

  // a reference to the whole app
  readonly app: App;

  // the drawing of the app
  readonly drawing: Drawing;

  // for specifying alternatives to components of the SVG.js library
  // (useful for testing)
  SVG?: {
    // can specify an SVG function that generates SVG documents
    // compatible with Node.js
    SVG?: () => SVG.Svg;
  }
}

type TertiaryBondId = string;

const formKey = uuidv4();

export class TertiaryBondsInteraction {
  readonly options: Options;

  // the ID of the hovered tertiary bond
  _hovered?: TertiaryBondId;

  // IDs of the selected tertiary bonds
  _selected: Set<TertiaryBondId>;

  readonly drawingOverlay: DrawingOverlay;
  _highlightings: Map<TertiaryBondId, TertiaryBondHighlighting>;

  // indicates if currently dragging the selected tertiary bonds
  _dragging?: boolean;

  // indicates if the selected tertiary bonds have been moved at all
  // since dragging started
  _dragged?: boolean;

  constructor(options: Options) {
    this.options = options;

    this._selected = new Set<TertiaryBondId>();

    this.drawingOverlay = new DrawingOverlay({ SVG: options.SVG });
    this.drawingOverlay.placeOver(options.drawing);

    this._highlightings = new Map<TertiaryBondId, TertiaryBondHighlighting>();

    window.addEventListener('mouseover', event => this.handleMouseover(event));
    window.addEventListener('mouseout', event => this.handleMouseout(event));
    window.addEventListener('mousedown', event => this.handleMousedown(event));
    window.addEventListener('mousemove', event => this.handleMousemove(event));
    window.addEventListener('mouseup', event => this.handleMouseup(event));
    window.addEventListener('dblclick', event => this.handleDblclick(event));
    window.addEventListener('keyup', event => this.handleKeyup(event));
  }

  get hovered(): TertiaryBond | undefined {
    if (this._hovered == undefined) {
      return undefined;
    } else {
      let tbs = this.options.drawing.tertiaryBonds;
      return tbs.find(tb => tb.id == this._hovered);
    }
  }

  select(tb: TertiaryBond) {
    this._selected.clear();
    this._selected.add(tb.id);
    this.refresh();
    this.options.app.refresh();
  }

  selected(): TertiaryBond[] {
    let tbs = this.options.drawing.tertiaryBonds;
    return tbs.filter(tb => this._selected.has(tb.id));
  }

  isSelected(tb: TertiaryBond): boolean {
    return this._selected.has(tb.id);
  }

  addToSelected(tb: TertiaryBond) {
    this._selected.add(tb.id);
    this.refresh();
    this.options.app.refresh();
  }

  deselect(tb?: TertiaryBond) {
    if (tb) {
      this._selected.delete(tb.id);
    } else {
      this._selected.clear();
    }
    this.refresh();
    this.options.app.refresh();
  }

  refresh() {
    this.drawingOverlay.fitTo(this.options.drawing);

    // the tertiary bonds that are being interacted with
    let tbs = this.selected();
    let hovered = this.hovered;
    if (hovered) {
      tbs.push(hovered);
    }

    // the IDs of the tertiary bonds that are being interacted with
    let ids = new Set<TertiaryBondId>();
    tbs.forEach(tb => ids.add(tb.id));

    let highlightings = new Map<TertiaryBondId, TertiaryBondHighlighting>();

    this._highlightings.forEach(h => {
      if (ids.has(h.tertiaryBond.id)) {
        highlightings.set(h.tertiaryBond.id, h);
      } else {
        h.remove();
      }
    });

    tbs.forEach(tb => {
      if (!highlightings.has(tb.id)) {
        let h = new TertiaryBondHighlighting(tb);
        h.appendTo(this.drawingOverlay.svg);
        highlightings.set(tb.id, h);
      }
    });

    highlightings.forEach(h => h.refit());
    this._highlightings = highlightings;
  }

  reset() {
    this._hovered = undefined;
    this._selected.clear();
    this._dragging = false;
    this._dragged = false;
    this.refresh();
    this.options.app.refresh();
  }

  renderForm() {
    this.options.app.formContainer.renderForm(props => (
      <EditTertiaryBonds
        {...props}
        app={this.options.app}
        tertiaryBonds={this.selected()}
      />
    ), { key: formKey });
  }

  handleMouseover(event: MouseEvent) {
    if (this._dragging) {
      return;
    }

    let tbs = this.options.drawing.tertiaryBonds;

    let hovered = tbs.find(tb => (
      event.target instanceof Node
      && tb.path.wrapped.node.contains(event.target)
    ));

    if (hovered) {
      this._hovered = hovered.id;
      this.refresh();
    }
  }

  handleMouseout(event: MouseEvent) {
    let hovered = this.hovered;
    if (hovered && event.target == hovered.path.wrapped.node) {
      this._hovered = undefined;
      this.refresh();
    }
  }

  handleMousedown(event: MouseEvent) {
    if (!(event.target instanceof Node)) {
      // should always be a Node
      return;
    }

    let drawing = this.options.drawing;
    if (!drawing.svg.node.contains(event.target)) {
      // ignore mouse clicks that are outside of the drawing
      return;
    }

    let hovered = this.hovered;
    if (!hovered) {
      if (this._selected.size > 0) {
        // only if there are tertiary bonds to deselect
        // since this will refresh the app
        this.deselect();
      }
      return;
    }

    if (this.isSelected(hovered)) {
      // nothing to do
    } else if (event.shiftKey) {
      this.addToSelected(hovered);
    } else {
      this.select(hovered);
    }
    this._dragging = true;
    this._dragged = false;
  }

  handleMousemove(event: MouseEvent) {
    let selected = this.selected();
    if (selected.length == 0 || !this._dragging) {
      return;
    }

    let z = zoom(this.options.drawing) ?? 1;
    let shift = {
      x: 2 * event.movementX / z,
      y: 2 * event.movementY / z,
    };

    if (!this._dragged) {
      this.options.app.pushUndo();
    }
    selected.forEach(tb => {
      shiftControlPoint(tb, shift);
    });
    this._dragged = true;
    this.refresh();
    this.options.app.refresh();
  }

  handleMouseup(event: MouseEvent) {
    this._dragging = false;
    this._dragged = false;
  }

  handleDblclick(event: MouseEvent) {
    if (this.hovered) {
      this.renderForm();
    }
  }

  handleKeyup(event: KeyboardEvent) {
    if (userIsTyping()) {
      return;
    }

    let key = event.key.toLowerCase();
    if (key == 'delete' || key == 'backspace') {
      if (this._selected.size > 0) {
        this.options.app.pushUndo();
        this._selected.forEach(id => {
          removeTertiaryBondById(this.options.drawing, id);
        });
        this._selected.clear();
        this.refresh();
        this.options.app.refresh();
      }
    }
  }
}
