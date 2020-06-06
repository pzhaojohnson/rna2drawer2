import {
  BaseInterface,
  BaseMostRecentProps,
  BaseSavableState,
} from './BaseInterface';
import {
  SvgInterface as Svg,
  SvgTextInterface as SvgText,
} from './SvgInterface';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import { CircleBaseAnnotation } from './BaseAnnotation';
import BaseNumbering from './BaseNumbering';
import { CircleBaseAnnotationSavableState } from './BaseAnnotationInterface';
import { BaseNumberingSavableState } from './BaseNumberingInterface';

class Base implements BaseInterface {
  static _mostRecentProps: BaseMostRecentProps;

  _text: SvgText;
  _highlighting?: CircleBaseAnnotation;
  _outline?: CircleBaseAnnotation;
  _numbering?: BaseNumbering;

  _xCenter: number;
  _yCenter: number;

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

  static fromSavedState(savedState: BaseSavableState, svg: Svg): (Base | never) {
    if (savedState.className !== 'Base') {
      throw new Error('Wrong class name.');
    }
    let text = svg.findOne('#' + savedState.textId) as SvgText;
    let b = new Base(text);
    if (savedState.highlighting) {
      b.addCircleHighlightingFromSavedState(savedState.highlighting);
    }
    if (savedState.outline) {
      b.addCircleOutlineFromSavedState(savedState.outline);
    }
    if (savedState.numbering) {
      b.addNumberingFromSavedState(savedState.numbering);
    }
    Base._copyPropsToMostRecent(b);
    return b;
  }

  static create(svg: Svg, character: string, xCenter: number, yCenter: number): (Base | never) {
    let text = svg.text((add) => add.tspan(character));
    text.id();
    let b = new Base(text);
    Base._applyMostRecentProps(b);
    b.moveTo(xCenter, yCenter);
    return b;
  }

  static createOutOfView(svg: Svg, character: string): (Base | never) {
    return Base.create(svg, character, 0, -200);
  }

  /**
   * Throws if the content of the text element is not a single character.
   */
  constructor(text: SvgText) {
    this._text = text;
    this._validateText();
    this._storeCenterCoordinates();
    
    this._highlighting = null;
    this._outline = null;
    this._numbering = null;
  }

  /**
   * Throws if the text element is not actually a text element.
   * 
   * Initializes the ID of the text if it is not already initialized.
   */
  _validateText() {
    if (this._text.type !== 'text') {
      throw new Error('Passed SVG element is not text.');
    }
    this._text.id();
    if (this._text.text().length !== 1) {
      throw new Error('Text content must be a single character.');
    }
  }

  _storeCenterCoordinates() {
    this._xCenter = this._text.cx();
    this._yCenter = this._text.cy();
  }

  get id(): string {
    return this._text.id();
  }

  get character(): string {
    return this._text.text();
  }

  /**
   * Has no effect if the given string is not a single character.
   */
  set character(c: string) {
    if (c.length !== 1) {
      return;
    }
    this._text.clear();
    this._text.tspan(c);
  }

  get xCenter(): number {
    return this._xCenter;
  }

  get yCenter(): number {
    return this._yCenter;
  }

  moveTo(xCenter: number, yCenter: number) {
    let xShift = xCenter - this._xCenter;
    let yShift = yCenter - this._yCenter;
    let x = this._text.attr('x') + xShift;
    let y = this._text.attr('y') + yShift;
    this._text.attr({ 'x': x, 'y': y });
    this._xCenter = xCenter;
    this._yCenter = yCenter;
    if (this.hasHighlighting()) {
      this._highlighting.reposition(xCenter, yCenter);
    }
    if (this.hasOutline()) {
      this._outline.reposition(xCenter, yCenter);
    }
    if (this.hasNumbering()) {
      this._numbering.reposition(xCenter, yCenter);
    }
  }

  distanceBetweenCenters(other: Base): number {
    return distanceBetween(
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
    return this._text.attr('font-family');
  }

  set fontFamily(ff: string) {
    this._text.attr({ 'font-family': ff });
    this._text.center(this._xCenter, this._yCenter);
    Base._mostRecentProps.fontFamily = ff;
  }

  get fontSize(): number {
    return this._text.attr('font-size');
  }

  set fontSize(fs: number) {
    this._text.attr({ 'font-size': fs });
    this._text.center(this._xCenter, this._yCenter);
    Base._mostRecentProps.fontSize = fs;
  }

  get fontWeight(): (string | number) {
    return this._text.attr('font-weight');
  }

  set fontWeight(fw: (string | number)) {
    this._text.attr({ 'font-weight': fw });
    this._text.center(this._xCenter, this._yCenter);
    Base._mostRecentProps.fontWeight = fw;
  }

  get fontStyle(): string {
    return this._text.attr('font-style');
  }

  set fontStyle(fs: string) {
    this._text.attr({ 'font-style': fs });
    this._text.center(this._xCenter, this._yCenter);
    Base._mostRecentProps.fontStyle = fs;
  }

  get fill(): string {
    return this._text.attr('fill');
  }

  set fill(f: string) {
    this._text.attr({ 'fill': f });
  }

  get cursor(): string {
    return this._text.css('cursor');
  }

  set cursor(c: string) {
    this._text.css({ 'cursor': c });
  }

  onMouseover(f: () => void) {
    this._text.mouseover(f);
  }

  onMouseout(f: () => void) {
    this._text.mouseout(f);
  }

  onMousedown(f: () => void) {
    this._text.mousedown(f);
  }

  onDblclick(f: () => void) {
    this._text.dblclick(f);
  }

  addCircleHighlighting(): CircleBaseAnnotation {
    this.removeHighlighting();
    this._highlighting = CircleBaseAnnotation.createNondisplaced(
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    this._highlighting.insertBefore(this._text);
    return this._highlighting;
  }

  addCircleHighlightingFromSavedState(
    savedState: CircleBaseAnnotationSavableState,
  ): (CircleBaseAnnotation | never) {
    this.removeHighlighting();
    this._highlighting = CircleBaseAnnotation.fromSavedState(
      savedState,
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    return this._highlighting;
  }

  hasHighlighting(): boolean {
    if (this._highlighting) {
      return true;
    }
    return false;
  }

  get highlighting(): (CircleBaseAnnotation | null) {
    return this._highlighting;
  }

  removeHighlighting() {
    if (this.hasHighlighting()) {
      this._highlighting.remove();
      this._highlighting = null;
    }
  }

  addCircleOutline(): CircleBaseAnnotation {
    this.removeOutline();
    this._outline = CircleBaseAnnotation.createNondisplaced(
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    return this._outline;
  }

  addCircleOutlineFromSavedState(
    savedState: CircleBaseAnnotationSavableState,
  ): (CircleBaseAnnotation | never) {
    this.removeOutline();
    this._outline = CircleBaseAnnotation.fromSavedState(
      savedState,
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    return this._outline;
  }

  hasOutline(): boolean {
    if (this._outline) {
      return true;
    }
    return false;
  }

  get outline(): (CircleBaseAnnotation | null) {
    return this._outline;
  }

  removeOutline() {
    if (this.hasOutline()) {
      this._outline.remove();
      this._outline = null;
    }
  }

  /**
   * Returns null if the given number is not accepted by the BaseNumbering class.
   */
  addNumbering(number: number): (BaseNumbering | null) {
    this.removeNumbering();
    try {
      this._numbering = BaseNumbering.create(
        this._text.root(),
        number,
        this.xCenter,
        this.yCenter,
      );
      return this._numbering;
    } catch (err) {
      console.error(err.toString());
      return null;
    }
  }

  addNumberingFromSavedState(
    savedState: BaseNumberingSavableState,
  ): (BaseNumbering | never) {
    this.removeNumbering();
    this._numbering = BaseNumbering.fromSavedState(
      savedState,
      this._text.root(),
      this.xCenter,
      this.yCenter,
    );
    return this._numbering;
  }

  hasNumbering(): boolean {
    if (this._numbering) {
      return true;
    }
    return false;
  }

  get numbering(): (BaseNumbering | null) {
    return this._numbering;
  }

  removeNumbering() {
    if (this.hasNumbering()) {
      this._numbering.remove();
      this._numbering = null;
    }
  }

  remove() {
    this.removeHighlighting();
    this.removeOutline();
    this.removeNumbering();
    this._text.remove();
  }

  savableState(): BaseSavableState {
    return {
      className: 'Base',
      textId: this._text.id(),
      highlighting: this.hasHighlighting() ? this.highlighting.savableState() : null,
      outline: this.hasOutline() ? this.outline.savableState() : null,
      numbering: this.hasNumbering() ? this.numbering.savableState() : null,
    };
  }

  refreshIds() {
    this._text.id(null);
    this._text.id();
    if (this.hasHighlighting()) {
      this.highlighting.refreshIds();
    }
    if (this.hasOutline()) {
      this.outline.refreshIds();
    }
    if (this.hasNumbering()) {
      this.numbering.refreshIds();
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
