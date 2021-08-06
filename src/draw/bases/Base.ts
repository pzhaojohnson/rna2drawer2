import { BaseInterface } from './BaseInterface';
import * as Svg from '@svgdotjs/svg.js';
import { SVGTextWrapper as TextWrapper } from 'Draw/svg/text';
import { assignUuid } from 'Draw/svg/id';
import { distance2D as distance } from 'Math/distance';
import angleBetween from 'Draw/angleBetween';
import { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { removeNumbering } from 'Draw/bases/number/add';
import { addSavedNumbering, savableState as savableNumberingState } from 'Draw/bases/number/save';
import {
  addCircleHighlighting,
  removeCircleHighlighting,
  addCircleOutline,
  removeCircleOutline,
} from 'Draw/bases/annotate/circle/add';
import {
  SavableState as SavableCircleAnnotationState,
  savableState as savableCircleAnnotationState,
  addSavedCircleHighlighting,
  addSavedCircleOutline,
} from 'Draw/bases/annotate/circle/save';
import { areClose } from 'Draw/areClose';
import { Values, values, setValues } from './values';

export class Base implements BaseInterface {
  static recommendedDefaults: Values;
  
  readonly text: Svg.Text;
  highlighting?: CircleBaseAnnotation;
  outline?: CircleBaseAnnotation;
  numbering?: BaseNumbering;

  _xCenter!: number;
  _yCenter!: number;

  static create(svg: Svg.Svg, character: string, xCenter: number, yCenter: number): (Base | never) {
    let text = svg.text((add) => add.tspan(character));
    text.id();
    let b = new Base(text);
    setValues(b, Base.recommendedDefaults);
    b.moveTo(xCenter, yCenter);
    return b;
  }

  static createOutOfView(svg: Svg.Svg, character: string): (Base | never) {
    return Base.create(svg, character, 0, -200);
  }

  /**
   * Throws if the content of the text element is not a single character.
   */
  constructor(text: Svg.Text) {
    this.text = text;
    this._validateText();
    this._storeCenterCoordinates();
  }

  /**
   * Throws if the text element is not actually a text element.
   *
   * Initializes the ID of the text if it is not already initialized.
   */
  _validateText() {
    if (this.text.type !== 'text') {
      throw new Error('Passed SVG element is not text.');
    }

    // use the attr method to check if the ID is already initialized
    // since the id method itself will initialize the ID (to a non-UUID)
    if (!this.text.attr('id')) {
      assignUuid(new TextWrapper(this.text));
    }
    
    if (this.text.text().length !== 1) {
      throw new Error('Text content must be a single character.');
    }
  }

  _storeCenterCoordinates() {
    this._xCenter = this.text.cx();
    this._yCenter = this.text.cy();
  }

  get id(): string {
    return this.text.id();
  }

  get character(): string {
    return this.text.text();
  }

  /**
   * Has no effect if the given string is not a single character.
   */
  set character(c: string) {
    if (c.length !== 1) {
      return;
    }
    this.text.clear();
    this.text.tspan(c);
    this.text.center(this._xCenter, this._yCenter);
  }

  center(): { x: unknown, y: unknown } {
    let bbox = this.text.bbox();
    return { x: bbox.cx, y: bbox.cy };
  }

  get xCenter(): number {
    return this._xCenter;
  }

  get yCenter(): number {
    return this._yCenter;
  }

  recenter(p: { x: number, y: number }) {
    this.moveTo(p.x, p.y);
  }

  moveTo(xCenter: number, yCenter: number) {
    this.text.center(xCenter, yCenter);
    this._xCenter = xCenter;
    this._yCenter = yCenter;
    if (this.highlighting) {
      this.highlighting.reposition({ baseCenter: { x: xCenter, y: yCenter } });
    }
    if (this.outline) {
      this.outline.reposition({ baseCenter: { x: xCenter, y: yCenter } });
    }
    if (this.numbering) {
      this.numbering.reposition({ baseCenter: { x: xCenter, y: yCenter } });
    }
  }

  distanceBetweenCenters(other: Base): number {
    return distance(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }

  angleBetweenCenters(other: Base): number {
    return angleBetween(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }
}

Base.recommendedDefaults = {
  text: {
    'font-family': 'Arial',
    'font-size': 9,
    'font-weight': 'bold',
    'font-style': 'normal',
  },
};

export default Base;
