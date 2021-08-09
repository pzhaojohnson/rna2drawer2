import { BaseInterface } from './BaseInterface';
import * as Svg from '@svgdotjs/svg.js';
import { SVGTextWrapper as TextWrapper } from 'Draw/svg/text';
import { assignUuid } from 'Draw/svg/id';
import { CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotation';
import { BaseNumbering } from 'Draw/bases/number/BaseNumbering';
import { Values, setValues } from './values';
import { Point2D as Point } from 'Math/Point';

export class Base implements BaseInterface {
  static recommendedDefaults: Values;
  
  readonly text: Svg.Text;
  highlighting?: CircleBaseAnnotation;
  outline?: CircleBaseAnnotation;
  numbering?: BaseNumbering;

  _center: Point;

  static create(svg: Svg.Svg, character: string, xCenter: number, yCenter: number): (Base | never) {
    let text = svg.text((add) => add.tspan(character));
    text.id();
    let b = new Base(text);
    setValues(b, Base.recommendedDefaults);
    b.recenter({ x: xCenter, y: yCenter });
    return b;
  }

  /**
   * Throws if the content of the text element is not a single character.
   */
  constructor(text: Svg.Text) {
    this.text = text;
    this._validateText();
    
    let bbox = text.bbox();
    this._center = { x: bbox.cx, y: bbox.cy };
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
    let bbox = this.text.bbox();
    let center = { x: bbox.cx, y: bbox.cy };
    this.text.clear();
    this.text.tspan(c);
    this.text.center(center.x, center.y);
  }

  center(): { x: unknown, y: unknown } {
    return { ...this._center };
  }

  get xCenter(): number {
    return this._center.x;
  }

  get yCenter(): number {
    return this._center.y;
  }

  recenter(p: { x: number, y: number }) {
    this.text.center(p.x, p.y);
    this._center = { ...p };
    if (this.highlighting) {
      this.highlighting.reposition({ baseCenter: p });
    }
    if (this.outline) {
      this.outline.reposition({ baseCenter: p });
    }
    if (this.numbering) {
      this.numbering.reposition({ baseCenter: p });
    }
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
