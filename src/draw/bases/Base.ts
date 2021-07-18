import {
  BaseInterface,
  BaseMostRecentProps,
  BaseSavableState,
} from './BaseInterface';
import * as Svg from '@svgdotjs/svg.js';
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

export class Base implements BaseInterface {
  static _mostRecentProps: BaseMostRecentProps;

  readonly text: Svg.Text;
  highlighting?: CircleBaseAnnotation;
  outline?: CircleBaseAnnotation;
  numbering?: BaseNumbering;

  _xCenter!: number;
  _yCenter!: number;

  static mostRecentProps(): BaseMostRecentProps {
    return { ...Base._mostRecentProps };
  }

  static _applyMostRecentProps(b: Base) {
    let props = Base.mostRecentProps();
    b.fontFamily = props.fontFamily;
    b.fontSize = props.fontSize;
    b.fontWeight = props.fontWeight;
    b.fontStyle = props.fontStyle;
  }

  static _copyPropsToMostRecent(b: Base) {
    Base._mostRecentProps.fontFamily = b.fontFamily;
    Base._mostRecentProps.fontSize = b.fontSize;
    Base._mostRecentProps.fontWeight = b.fontWeight;
    Base._mostRecentProps.fontStyle = b.fontStyle;
  }

  static fromSavedState(savedState: BaseSavableState, svg: Svg.Svg): (Base | never) {
    if (savedState.className !== 'Base') {
      throw new Error('Wrong class name.');
    }
    let text = svg.findOne('#' + savedState.textId) as Svg.Text;
    let b = new Base(text);
    if (savedState.highlighting) {
      addSavedCircleHighlighting(b, savedState.highlighting);
    }
    if (savedState.outline) {
      addSavedCircleOutline(b, savedState.outline);
    }
    if (savedState.numbering) {
      addSavedNumbering(b, savedState.numbering);
    }
    Base._copyPropsToMostRecent(b);
    return b;
  }

  static create(svg: Svg.Svg, character: string, xCenter: number, yCenter: number): (Base | never) {
    let text = svg.text((add) => add.tspan(character));
    text.id();
    let b = new Base(text);
    Base._applyMostRecentProps(b);
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
    this.text.id();
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

  get xCenter(): number {
    return this._xCenter;
  }

  get yCenter(): number {
    return this._yCenter;
  }

  moveTo(xCenter: number, yCenter: number) {
    if (!areClose(xCenter, this.xCenter) || !areClose(yCenter, this.yCenter)) {
      let xShift = xCenter - this._xCenter;
      let yShift = yCenter - this._yCenter;
      let x = this.text.attr('x') + xShift;
      let y = this.text.attr('y') + yShift;
      this.text.attr({ 'x': x, 'y': y });
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

  get fontFamily(): string {
    return this.text.attr('font-family');
  }

  set fontFamily(ff: string) {
    this.text.attr({ 'font-family': ff });
    this.text.center(this._xCenter, this._yCenter);
    Base._mostRecentProps.fontFamily = ff;
  }

  get fontSize(): number {
    return this.text.attr('font-size');
  }

  set fontSize(fs: number) {
    this.text.attr({ 'font-size': fs });
    this.text.center(this._xCenter, this._yCenter);
    Base._mostRecentProps.fontSize = fs;
  }

  get fontWeight(): (string | number) {
    return this.text.attr('font-weight');
  }

  set fontWeight(fw: (string | number)) {
    this.text.attr({ 'font-weight': fw });
    this.text.center(this._xCenter, this._yCenter);
    Base._mostRecentProps.fontWeight = fw;
  }

  get fontStyle(): string {
    return this.text.attr('font-style');
  }

  set fontStyle(fs: string) {
    this.text.attr({ 'font-style': fs });
    this.text.center(this._xCenter, this._yCenter);
    Base._mostRecentProps.fontStyle = fs;
  }

  get fill(): string {
    return this.text.attr('fill');
  }

  set fill(f: string) {
    this.text.attr({ 'fill': f });
  }

  get fillOpacity(): number {
    return this.text.attr('fill-opacity');
  }

  set fillOpacity(fo: number) {
    this.text.attr({ 'fill-opacity': fo });
  }

  get cursor(): string {
    return this.text.css('cursor');
  }

  set cursor(c: string) {
    this.text.css('cursor', c);
  }

  bringToFront() {
    if (this.outline) {
      this.outline.bringToFront();
    }
    this.text.front();
  }

  sendToBack() {
    this.text.back();
    if (this.outline) {
      this.outline.sendToBack();
    }
  }

  remove() {
    removeCircleHighlighting(this);
    removeCircleOutline(this);
    removeNumbering(this);
    this.text.remove();
  }

  savableState(): BaseSavableState {
    return {
      className: 'Base',
      textId: this.text.id(),
      highlighting: this.highlighting ? savableCircleAnnotationState(this.highlighting) : undefined,
      outline: this.outline ? savableCircleAnnotationState(this.outline) : undefined,
      numbering: this.numbering ? savableNumberingState(this.numbering) : undefined,
    };
  }

  refreshIds() {
    this.text.id('');
    this.text.id();
    if (this.highlighting) {
      this.highlighting.refreshIds();
    }
    if (this.outline) {
      this.outline.refreshIds();
    }
    if (this.numbering) {
      this.numbering.regenerateIds();
    }
  }
}

Base._mostRecentProps = {
  fontFamily: 'Arial',
  fontSize: 9,
  fontWeight: 'bold',
  fontStyle: 'normal',
};

export default Base;
