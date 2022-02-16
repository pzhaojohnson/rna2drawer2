import { AppInterface as App } from 'AppInterface';
import { DrawingInterface as Drawing } from 'Draw/DrawingInterface';

import { DrawingElementInterface as DrawingElement } from './DrawingElementInterface';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';

import { Base } from 'Draw/bases/Base';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import { straightBondIsInvisible } from './straightBondIsInvisible';

import { shiftControlPoint } from 'Draw/bonds/curved/drag';
import { zoom } from 'Draw/zoom';

import { DrawingOverlay } from 'Draw/interact/DrawingOverlay';
import { SelectingRect } from './SelectingRect';
import { ElementHighlighting } from './ElementHighlighting';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styles from './EditingTool.css';

import { OverlaidMessageContainer } from 'Draw/interact/OverlaidMessageContainer';
import { BasePositionDescription } from './BasePositionDescription';
import { SelectedElementsDescription } from './SelectedElementsDescription';
import { detectMacOS } from 'Utilities/detectMacOS';

import { removeTertiaryBondById } from 'Draw/bonds/curved/remove';
import { userIsTyping } from 'Utilities/userIsTyping';

import { EditingForm } from './EditingForm';
import { v4 as uuidv4 } from 'uuid';

import * as SVG from '@svgdotjs/svg.js';

export type Options = {

  // a reference to the whole app
  readonly app: App;

  // the drawing to edit
  readonly drawing: Drawing;

  // for specifying alternatives to components of the SVG.js library
  // (useful for meeting the compatibility requirements of Node.js)
  SVG?: {
    SVG?: () => SVG.Svg;
  }
}

type ElementId = string;

let formKeys = new Map<Function, string>();
formKeys.set(Base, uuidv4());
formKeys.set(BaseNumbering, uuidv4());
formKeys.set(PrimaryBond, uuidv4());
formKeys.set(SecondaryBond, uuidv4());
formKeys.set(TertiaryBond, uuidv4());

export class EditingTool {
  readonly options: Options;

  _editingType: Function;

  // track by element ID so that these are maintained on undo and redo
  _hovered?: ElementId;
  _activated?: ElementId;
  _selected: Set<ElementId>;

  // used to indicate if the selected elements have been dragged at all
  // since an element was activated
  _dragged?: boolean;

  // for the selecting rect and element highlightings to be drawn on
  readonly drawingOverlay: DrawingOverlay;

  selectingRect?: SelectingRect;

  // track by element object so that these are refreshed on undo and redo
  _elementHighlightings: Map<DrawingElement, ElementHighlighting>;

  readonly overlaidMessageContainer: OverlaidMessageContainer;

  constructor(options: Options) {
    this.options = options;

    this._editingType = Base; // edit bases by default

    this._selected = new Set<ElementId>();

    this.drawingOverlay = new DrawingOverlay({ SVG: options.SVG });
    this.drawingOverlay.placeOver(options.drawing);

    this._elementHighlightings = new Map<DrawingElement, ElementHighlighting>();

    this.overlaidMessageContainer = new OverlaidMessageContainer();
    this.overlaidMessageContainer.placeOver(options.drawing);
    this.overlaidMessageContainer.style.display = 'flex';
    this.overlaidMessageContainer.style.flexDirection = 'row';
  }

  // constructor function for the type of element currently being edited
  get editingType(): Function {
    return this._editingType;
  }

  set editingType(t: Function) {
    if (t != this._editingType) {
      this._selected.clear();
      this._editingType = t;
      this.refresh();
      this.options.app.refresh();
    }
  }

  // returns all drawing elements that may be edited with this tool
  drawingElements(): DrawingElement[] {
    let bases = this.options.drawing.bases();

    let baseNumberings: BaseNumberingInterface[] = [];
    bases.forEach(b => {
      if (b.numbering) {
        baseNumberings.push(b.numbering);
      }
    });

    return [
      ...bases,
      ...baseNumberings,
      ...this.options.drawing.primaryBonds,
      ...this.options.drawing.secondaryBonds,
      ...this.options.drawing.tertiaryBonds,
    ];
  }

  // returns the drawing element containing the given node
  // and undefined if no such drawing element can be found
  containingDrawingElement(node: Node): DrawingElement | undefined {
    return this.drawingElements().find(ele => {
      if (ele instanceof Base) {
        return ele.text.node.contains(node) || ele.outline?.contains(node);
      } else if (ele instanceof BaseNumbering) {
        return ele.text.node.contains(node) || ele.line.node.contains(node);
      } else if (ele instanceof PrimaryBond) {
        return ele.contains(node);
      } else if (ele instanceof SecondaryBond) {
        return ele.contains(node);
      } else if (ele instanceof TertiaryBond) {
        return ele.contains(node);
      } else {
        return false;
      }
    });
  }

  // the currently hovered element
  get hovered(): DrawingElement | undefined {
    if (this._hovered == undefined) {
      return undefined;
    } else {
      return this.drawingElements().find(ele => ele.id == this._hovered);
    }
  }

  // the element that is being clicked on
  // (similar to the CSS active pseudo-class)
  get activated(): DrawingElement | undefined {
    if (this._activated == undefined) {
      return undefined;
    } else {
      return this.drawingElements().find(ele => ele.id == this._activated);
    }
  }

  // the currently selected elements
  selected(): DrawingElement[] {
    return this.drawingElements().filter(ele => this._selected.has(ele.id));
  }

  isSelected(ele: DrawingElement): boolean {
    return this._selected.has(ele.id);
  }

  select(ele: DrawingElement) {
    this._selected.clear();
    this._selected.add(ele.id);
    this.renderForm();
    this.refresh();
    this.options.app.refresh();
  }

  addToSelected(eles: DrawingElement[] | DrawingElement) {
    if (Array.isArray(eles) && eles.length == 0) {
      return; // nothing to do
    }

    if (Array.isArray(eles)) {
      eles.forEach(ele => this._selected.add(ele.id));
    } else {
      this._selected.add(eles.id);
    }
    this.renderForm();
    this.refresh();
    this.options.app.refresh();
  }

  deselect(ele?: DrawingElement) {
    if (ele) {
      this._selected.delete(ele.id);
      if (ele.id == this._hovered) {
        this._hovered = undefined;
      }
    } else {
      this._selected.clear();
    }
    this.refresh();
    this.options.app.refresh();
  }

  handleMouseover(event: MouseEvent) {
    if (!(event.target instanceof Node)) {
      return;
    }

    let hovered = this.containingDrawingElement(event.target);

    if (hovered instanceof PrimaryBond || hovered instanceof SecondaryBond) {
      if (straightBondIsInvisible(hovered)) {
        return; // ignore invisible primary and secondary bonds
      }
    }

    if (hovered) {
      this._hovered = hovered.id;
      this.refresh();
    }
  }

  handleMouseout(event: MouseEvent) {
    if (!(event.target instanceof Node)) {
      return;
    }

    let dehovered = this.containingDrawingElement(event.target);
    if (dehovered && dehovered.id == this._hovered) {
      this._hovered = undefined;
      this.refresh();
    }
  }

  handleMousedown(event: MouseEvent) {
    if (!(event.target instanceof Node)) {
      return;
    } else if (!this.options.drawing.svg.node.contains(event.target)) {
      return; // ignore clicks outside of the drawing
    }

    let hovered = this.hovered;
    if (hovered) {
      this._handleMousedownWhenHovering(event);
    } else {
      this._handleMousedownWhenNotHovering(event);
    }
  }

  _handleMousedownWhenHovering(event: MouseEvent) {
    let hovered = this.hovered;
    if (!hovered) {
      console.error('No element is hovered.');
      return;
    }

    this._activated = hovered.id;
    this._dragged = false;

    if (!(hovered instanceof this.editingType)) {
      this.editingType = hovered.constructor;
      this.select(hovered);
    } else {
      if (event.shiftKey && this.isSelected(hovered)) {
        this.deselect(hovered);
      } else if (event.shiftKey && !this.isSelected(hovered)) {
        this.addToSelected(hovered);
      } else if (!event.shiftKey && !this.isSelected(hovered)) {
        this.select(hovered);
      } else {
        // nothing to do
      }
    }
  }

  _handleMousedownWhenNotHovering(event: MouseEvent) {
    if (this._hovered != undefined) {
      console.error('An element is hovered.');
      return;
    }

    if (!event.shiftKey) {
      this.deselect();
    }

    // in case there is a leftover selecting rect somehow
    if (this.selectingRect) {
      this.selectingRect.remove();
      this.selectingRect = undefined;
    }

    // create a new selecting rect
    let start = this.options.drawing.svg.point(event.pageX, event.pageY);
    this.selectingRect = new SelectingRect(start);
    this.selectingRect.appendTo(this.drawingOverlay.svg);
  }

  handleMousemove(event: MouseEvent) {
    if (this.selectingRect) {
      this._handleMousemoveWhenDraggingSelectingRect(event);
      return;
    }

    let activated = this.activated;
    if (activated instanceof TertiaryBond) {
      this._handleMousemoveWhenDraggingTertiaryBonds(event);
      return;
    }
  }

  _handleMousemoveWhenDraggingSelectingRect(event: MouseEvent) {
    if (!this.selectingRect) {
      console.error('No selecting rect is present.');
      return;
    }

    let end = this.options.drawing.svg.point(event.pageX, event.pageY);
    this.selectingRect.dragTo({ x: end.x, y: end.y });
    this.refresh();
  }

  _handleMousemoveWhenDraggingTertiaryBonds(event: MouseEvent) {
    let activated = this.activated;
    if (!(activated instanceof TertiaryBond)) {
      console.error('No tertiary bonds are currently being dragged.');
      return;
    }

    if (!this._dragged) {
      this.options.app.pushUndo();
    }

    let tbs = new Set<TertiaryBond>(); // the tertiary bonds to drag
    tbs.add(activated);
    this.selected().forEach(ele => {
      if (ele instanceof TertiaryBond) {
        tbs.add(ele);
      }
    });

    // drag the tertiary bonds
    let z = zoom(this.options.drawing) ?? 1;
    tbs.forEach(tb => {
      shiftControlPoint(tb, {
        x: 2 * event.movementX / z,
        y: 2 * event.movementY / z,
      });
    });

    this._dragged = true;

    this.refresh();
    this.options.app.refresh();
  }

  handleMouseup(event: MouseEvent) {
    if (this.selectingRect) {
      let encompassed = this.drawingElements().filter(ele => (
        ele instanceof this.editingType
        && this.selectingRect?.encompasses(ele)
      ));
      this.selectingRect.remove();
      this.selectingRect = undefined;
      if (encompassed.length > 0) {
        this.addToSelected(encompassed);
      }
    }

    if (this._activated != undefined) {
      this._activated = undefined;
      this.refresh();
    }
  }

  handleDblclick(event: MouseEvent) {
    // nothing to do
  }

  handleKeyup(event: KeyboardEvent) {
    if (userIsTyping()) {
      return;
    }

    let key = event.key.toLowerCase();
    if (key == 'delete' || key == 'backspace') {
      if (this.editingType == TertiaryBond && this._selected.size > 0) {
        this.options.app.pushUndo();
        this._selected.forEach(id => {
          removeTertiaryBondById(this.options.drawing, id);
          this._selected.delete(id);
        });
        this.refresh();
        this.options.app.refresh();
      }
    }
  }

  refresh() {
    this.drawingOverlay.fitTo(this.options.drawing);
    this.updateSelectingRectStrokeWidth();
    this.updateElementHighlightings();
    this.updateCursor();
    this.overlaidMessageContainer.placeOver(this.options.drawing);
    this.updateOverlaidMessage();
  }

  updateSelectingRectStrokeWidth() {
    if (this.selectingRect) {
      let z = zoom(this.options.drawing) ?? 1;
      this.selectingRect.rect.attr('stroke-width', 0.5 / z);
    }
  }

  shouldBeHighlighted(ele: DrawingElement): boolean {
    if (this.isSelected(ele)) {
      return true;
    }

    if (this.selectingRect) {
      if (ele instanceof this.editingType && this.selectingRect.encompasses(ele)) {
        return true;
      }
    }

    if (ele.id == this._hovered) {
      return (
        ele instanceof this.editingType
        && !this.selectingRect
        && !this._activated
      );
    }

    return false;
  }

  updateElementHighlightings() {

    // the elements to highlight
    let eles = new Set<DrawingElement>(
      this.drawingElements().filter(ele => this.shouldBeHighlighted(ele))
    );

    let elementHighlightings = new Map<DrawingElement, ElementHighlighting>();

    this._elementHighlightings.forEach(h => {
      if (eles.has(h.element)) {
        elementHighlightings.set(h.element, h);
        h.refit();
      } else {
        h.remove();
      }
    });

    eles.forEach(ele => {
      if (!elementHighlightings.has(ele)) {
        let h = new ElementHighlighting(ele);
        h.appendTo(this.drawingOverlay.svg);
        elementHighlightings.set(ele, h);
      }
    });

    this._elementHighlightings = elementHighlightings;
  }

  updateCursor() {
    let notDragging = !this.selectingRect && this._activated == undefined;
    let shouldBePointer = this._hovered != undefined && notDragging;
    this.options.drawing.svg.css({
      'cursor': shouldBePointer ? 'pointer' : 'auto',
    });
  }

  updateOverlaidMessage() {
    if (this._hovered == undefined) {
      this._updateOverlaidMessageWithSelected();
    } else if (this.selectingRect) {
      this._updateOverlaidMessageWithSelected();
    } else if (this._activated != undefined && this._dragged) {
      this._updateOverlaidMessageWithSelected();
    } else {
      this._updateOverlaidMessageWithHovered();
    }
  }

  // describe the hovered element and actions regarding it
  _updateOverlaidMessageWithHovered() {
    this.overlaidMessageContainer.clear();

    let hovered = this.hovered;
    if (!hovered) {
      console.error(`No element is hovered.`);
      return;
    }

    if (hovered instanceof Base) {
      let div = document.createElement('div');
      ReactDOM.render(
        <BasePositionDescription
          drawing={this.options.drawing}
          base={hovered}
          style={{ margin: '0px 4px 0px 0px' }}
        />,
        div,
      );
      this.overlaidMessageContainer.append(div);
    }

    if (this._activated == undefined) {
      let p = document.createElement('p');
      if (this.isSelected(hovered)) {
        p.textContent += `${detectMacOS() ? '⇧ ' : 'Shift+'}Click to remove from selected.`;
      } else {
        p.textContent = 'Click to select. ';
        p.textContent += `${detectMacOS() ? '⇧ ' : 'Shift+'}Click to add to selected.`;
      }
      p.className = styles.overlaidMessageActions;
      this.overlaidMessageContainer.append(p);
    }
  }

  // describe the selected elements and actions regarding them
  _updateOverlaidMessageWithSelected() {
    this.overlaidMessageContainer.clear();

    if (this._selected.size == 0) {
      return;
    }

    let div = document.createElement('div');
    ReactDOM.render(
      <SelectedElementsDescription
        editingType={this.editingType}
        selectedElements={this.selected()}
      />,
      div,
    );
    this.overlaidMessageContainer.append(div);

    if (this.editingType == TertiaryBond) {
      let p = document.createElement('p');
      p.textContent = 'Drag to move. Press Delete to remove.';
      p.className = styles.overlaidMessageActions;
      p.style.marginLeft = '4px';
      this.overlaidMessageContainer.append(p);
    }
  }

  reset() {
    this._hovered = undefined;
    this._activated = undefined;
    this._selected.clear();

    if (this.selectingRect) {
      this.selectingRect.remove();
      this.selectingRect = undefined;
    }

    this._dragged = false;

    this.refresh();
    this.options.app.refresh();
  }

  renderForm() {
    let editingType = this.editingType; // cache
    let key = formKeys.get(editingType);
    this.options.app.formContainer.renderForm(props => (
      <EditingForm
        {...props}
        app={this.options.app}
        editingType={editingType} // the cached editing type
        elements={this.selected()} // retrieves the currently selected elements
      />
    ), { key });
  }
}
