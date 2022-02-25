import { AppInterface as App } from 'AppInterface';

import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { initializeAtPosition } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

import { BaseInterface } from 'Draw/bases/BaseInterface';
import { Base } from 'Draw/bases/Base';

import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { BaseNumberingInterface } from 'Draw/bases/number/BaseNumberingInterface';

import { PrimaryBondInterface } from 'Draw/bonds/straight/PrimaryBondInterface';
import { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';

import { SecondaryBondInterface } from 'Draw/bonds/straight/SecondaryBondInterface';
import { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';

import { isInvisible as straightBondIsInvisible } from 'Draw/bonds/straight/isInvisible';

import { TertiaryBondInterface } from 'Draw/bonds/curved/TertiaryBondInterface';
import { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';

import { shiftControlPoint } from 'Draw/bonds/curved/drag';
import { zoom } from 'Draw/zoom';

import { sortNumbers } from 'Array/sortNumbers';
import { compareNumbers } from 'Array/sort';

import { Stem } from 'Partners/Stem';
import { pairs } from 'Partners/Stem';
import { bottomPair } from 'Partners/Stem';
import { topPair } from 'Partners/Stem';
import { upstreamPartner } from 'Partners/Pair';

import { stemOfBase } from 'Draw/strict/stemOfBase';
import { stemOfStraightBond } from 'Draw/strict/stemOfStraightBond';

import { stems as stemsOfPartners } from 'Partners/stems';
import { stemEnclosesPosition } from 'Partners/stemEnclosesPosition';

import { traverseLoopDownstream } from 'Partners/traverseLoopDownstream';

import { DrawingOverlay } from 'Draw/interact/DrawingOverlay';
import { BasesHighlighting } from './BasesHighlighting';

import { OverlaidMessageContainer } from 'Draw/interact/OverlaidMessageContainer';
import styles from './FlippingTool.css';

type DrawingElement = (
  BaseInterface
  | BaseNumberingInterface
  | PrimaryBondInterface
  | SecondaryBondInterface
  | TertiaryBondInterface
);

type ElementId = string;

function elementContainsNode(ele: DrawingElement, node: Node): boolean {
  if (ele instanceof Base) {
    return (
      ele.text.node.contains(node)
      || (ele.outline?.contains(node) ?? false)
    );
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
}

export type Options = {

  // a reference to the whole app
  readonly app: App;

  // the drawing to edit
  readonly strictDrawing: StrictDrawing;

  // for highlighting elements of the drawing
  readonly drawingUnderlay: DrawingOverlay;

  // for showing overlaid messages in
  readonly overlaidMessageContainer: OverlaidMessageContainer;
}

export class FlippingTool {
  readonly options: Options;

  _hovered?: ElementId;
  _activated?: ElementId;

  // used to indicate if the activated element has been dragged
  // since being activated
  _dragged?: boolean;

  basesHighlighting?: BasesHighlighting;

  constructor(options: Options) {
    this.options = options;
  }

  // the elements that this tool responds to interaction with
  watchedElements(): DrawingElement[] {
    let bases = this.options.strictDrawing.drawing.bases();

    let baseNumberings: BaseNumberingInterface[] = [];
    bases.forEach(b => {
      if (b.numbering) {
        baseNumberings.push(b.numbering);
      }
    });

    return [
      ...bases,
      ...baseNumberings,
      ...this.options.strictDrawing.drawing.primaryBonds,
      ...this.options.strictDrawing.drawing.secondaryBonds,
      ...this.options.strictDrawing.drawing.tertiaryBonds,
    ];
  }

  get hovered(): DrawingElement | undefined {
    if (this._hovered == undefined) {
      return undefined;
    } else {
      return this.watchedElements().find(ele => ele.id == this._hovered);
    }
  }

  // the element currently being clicked on
  // (similar to the CSS active pseudo-class)
  get activated(): DrawingElement | undefined {
    if (this._activated == undefined) {
      return undefined;
    } else {
      return this.watchedElements().find(ele => ele.id == this._activated);
    }
  }

  // returns the stem containing the hovered element
  // or undefined if no stem contains the hovered element
  // or if no element is hovered
  stemContainingHovered(): Stem | undefined {
    let hovered = this.hovered;
    if (!hovered) {
      return undefined;
    }

    if (hovered instanceof Base) {
      return stemOfBase(this.options.strictDrawing, hovered);
    } else if (hovered instanceof PrimaryBond) {
      return stemOfStraightBond(this.options.strictDrawing, hovered);
    } else if (hovered instanceof SecondaryBond) {
      return stemOfStraightBond(this.options.strictDrawing, hovered);
    } else {
      return undefined;
    }
  }

  nearestStemEnclosingBase(base: Base): Stem | undefined {
    let seq = this.options.strictDrawing.layoutSequence();
    let p = seq.positionOf(base);

    let partners = this.options.strictDrawing.layoutPartners();
    let stems = stemsOfPartners(partners);
    let enclosing = stems.filter(stem => stemEnclosesPosition(stem, p));

    enclosing.sort((a, b) => compareNumbers(
      Math.abs(upstreamPartner(topPair(a)) - p),
      Math.abs(upstreamPartner(topPair(b)) - p),
    ));

    return enclosing[0];
  }

  nearestStemEnclosingStraightBond(straightBond: PrimaryBond | SecondaryBond): Stem | undefined {
    let seq = this.options.strictDrawing.layoutSequence();
    let p1 = seq.positionOf(straightBond.base1);
    let p2 = seq.positionOf(straightBond.base2);

    let partners = this.options.strictDrawing.layoutPartners();
    let stems = stemsOfPartners(partners);
    let enclosing = stems.filter(stem => (
      stemEnclosesPosition(stem, p1) || stemEnclosesPosition(stem, p2)
    ));

    enclosing.sort((a, b) => compareNumbers(
      Math.abs(upstreamPartner(topPair(a)) - p1),
      Math.abs(upstreamPartner(topPair(b)) - p1),
    ));

    return enclosing[0];
  }

  // returns the nearest stem enclosing the hovered element
  // or undefined if no stem encloses the hovered element
  // or if no element is hovered
  nearestStemEnclosingHovered(): Stem | undefined {
    let hovered = this.hovered;
    if (!hovered) {
      return undefined;
    }

    if (hovered instanceof Base) {
      return this.nearestStemEnclosingBase(hovered);
    } else if (hovered instanceof PrimaryBond) {
      return this.nearestStemEnclosingStraightBond(hovered);
    } else if (hovered instanceof SecondaryBond) {
      return this.nearestStemEnclosingStraightBond(hovered);
    } else {
      return undefined;
    }
  }

  handleMouseover(event: MouseEvent) {
    let hovered = this.watchedElements().find(ele => (
      event.target instanceof Node
      && elementContainsNode(ele, event.target)
    ));

    if (!hovered) {
      return;
    } else if (hovered instanceof PrimaryBond && straightBondIsInvisible(hovered)) {
      return; // ignore invisible primary bonds
    } else if (hovered instanceof SecondaryBond && straightBondIsInvisible(hovered)) {
      return; // ignore invisible secondary bonds
    }

    this._hovered = hovered.id;
    this.refresh();
  }

  handleMouseout(event: MouseEvent) {
    let dehovered = this.watchedElements().find(ele => (
      event.target instanceof Node
      && elementContainsNode(ele, event.target)
    ));

    if (dehovered && dehovered.id == this._hovered) {
      this._hovered = undefined;
      this.refresh();
    }
  }

  handleMousedown(event: MouseEvent) {
    let hovered = this.hovered;
    if (!hovered) {
      return;
    }

    this._activated = hovered.id;
    this._dragged = false;

    let canFlip = (
      hovered instanceof Base
      || hovered instanceof PrimaryBond
      || hovered instanceof SecondaryBond
    );

    if (canFlip) {
      let stem = this.stemContainingHovered();
      if (!stem) {
        stem = this.nearestStemEnclosingHovered();
      }

      this.options.app.pushUndo();
      if (stem) {
        let p = upstreamPartner(bottomPair(stem));
        let perBaseProps = this.options.strictDrawing.perBaseLayoutProps();
        let props = perBaseProps[p - 1] ?? initializeAtPosition(perBaseProps, p);
        props.flipStem = !props.flipStem;
        this.options.strictDrawing.setPerBaseLayoutProps(perBaseProps);
      } else {
        this.options.strictDrawing.generalLayoutProps.rotation += Math.PI;
      }
      this.options.strictDrawing.updateLayout();
    }

    this.options.app.refresh();
  }

  handleMousemove(event: MouseEvent) {
    let activated = this.activated;
    if (activated instanceof TertiaryBond) {
      if (!this._dragged) {
        this.options.app.pushUndo();
        this._dragged = true;
      }
      let z = zoom(this.options.strictDrawing.drawing) ?? 1;
      shiftControlPoint(activated, {
        x: 2 * event.movementX / z,
        y: 2 * event.movementY / z,
      });
    }
  }

  handleMouseup(event: MouseEvent) {
    this._activated = undefined;
    this.refresh();
  }

  handleDblclick(event: MouseEvent) {
    let hovered = this.hovered;
    if (!hovered) {
      return;
    }

    this.reset();
    let strictDrawingInteraction = this.options.app.strictDrawingInteraction;
    strictDrawingInteraction.currentTool = strictDrawingInteraction.editingTool;
    strictDrawingInteraction.editingTool.editingType = hovered.constructor;
    strictDrawingInteraction.editingTool.select(hovered);
  }

  handleKeyup(event: KeyboardEvent) {
    // nothing to do
  }

  reset() {
    this._hovered = undefined;
    this._activated = undefined;
    this._dragged = false;
    this.refresh();
    this.options.app.refresh();
  }

  refresh() {
    this.options.drawingUnderlay.fitTo(this.options.strictDrawing.drawing);
    this.updateBasesHighlighting();
    this.updateCursor();
    this.options.overlaidMessageContainer.placeOver(this.options.strictDrawing.drawing);
    this.updateOverlaidMessage();
  }

  updateBasesHighlighting() {
    if (this.basesHighlighting) {
      this.basesHighlighting.remove();
    }

    let hovered = this.hovered;
    if (!hovered) {
      return;
    } else if (hovered instanceof BaseNumbering) {
      return;
    } else if (hovered instanceof TertiaryBond) {
      return;
    } else if (this._activated != undefined) {
      return;
    }

    let stem = this.stemContainingHovered();
    if (!stem) {
      stem = this.nearestStemEnclosingHovered();
    }

    let partners = this.options.strictDrawing.layoutPartners();
    let traversed = traverseLoopDownstream(partners, stem);
    let ps = traversed.positions;
    if (stem) {
      ps.push(...pairs(stem).flat());
    }
    ps = Array.from(new Set(ps));
    sortNumbers(ps);

    let seq = this.options.strictDrawing.layoutSequence();
    let bases: BaseInterface[] = [];
    ps.forEach(p => {
      let b = seq.atPosition(p);
      if (b) {
        bases.push(b);
      }
    });

    this.basesHighlighting = new BasesHighlighting({ bases });
    this.basesHighlighting.appendTo(this.options.drawingUnderlay.svg);
  }

  updateCursor() {
    let cursor = 'auto';
    if (this._hovered != undefined) {
      cursor = 'pointer';
    } else if (this._activated != undefined) {
      cursor = 'pointer';
    }
    this.options.strictDrawing.drawing.svg.css('cursor', cursor);
  }

  updateOverlaidMessage() {
    let hovered = this.hovered;
    let activated = this.activated;

    let canFlip = (
      hovered instanceof Base
      || hovered instanceof PrimaryBond
      || hovered instanceof SecondaryBond
    );

    this.options.overlaidMessageContainer.clear();
    let p = document.createElement('p');
    if (activated instanceof TertiaryBond) {
      p.textContent = 'Drag to move. Double-click to edit.';
    } else if (activated != undefined) {
      // no text content
    } else if (hovered instanceof TertiaryBond) {
      p.textContent = 'Drag to move. Double-click to edit.';
    } else if (hovered instanceof BaseNumbering) {
      p.textContent = 'Double-click to edit.';
    } else if (canFlip) {
      p.textContent = 'Click to flip.';
    } else {
      // no text content
    }
    p.className = styles.overlaidMessageActions;
    this.options.overlaidMessageContainer.append(p);
  }
}