import {
  StraightBondInterface,
  PrimaryBondInterface,
  SecondaryBondInterface,
  StraightBondSavableState,
  PrimaryBondMostRecentProps,
  SecondaryBondMostRecentProps,
} from './StraightBondInterface';
import Base from './Base';
import {
  SvgInterface as Svg,
  SvgLineInterface as SvgLine,
  SvgElementInterface as SvgElement,
} from './SvgInterface';
import distanceBetween from './distanceBetween';

interface LineCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

class StraightBond implements StraightBondInterface {
  _line: SvgLine;
  _base1: Base;
  _base2: Base;

  _padding1: number;
  _padding2: number;

  static _lineCoordinates(b1: Base, b2: Base, padding1: number, padding2: number): LineCoordinates {
    let angle = b1.angleBetweenCenters(b2);
    return {
      x1: b1.xCenter + (padding1 * Math.cos(angle)),
      y1: b1.yCenter + (padding1 * Math.sin(angle)),
      x2: b2.xCenter - (padding2 * Math.cos(angle)),
      y2: b2.yCenter - (padding2 * Math.sin(angle)),
    };
  }

  static _opacity(b1: Base, b2: Base, padding1: number, padding2: number): number {
    if (padding1 + padding2 > b1.distanceBetweenCenters(b2)) {
      return 0;
    }
    return 1;
  }

  constructor(line: SvgLine, b1: Base, b2: Base) {
    this._base1 = b1;
    this._base2 = b2;
    
    this._line = line;
    this._validateLine();

    this._storePaddings();
  }

  /**
   * Initializes the ID of the line if it is not already initialized.
   */
  _validateLine() {
    this._line.id();
  }

  get id(): string {
    return this._line.attr('id');
  }

  get base1(): Base {
    return this._base1;
  }

  get base2(): Base {
    return this._base2;
  }

  get x1(): number {
    return this._line.attr('x1');
  }

  get y1(): number {
    return this._line.attr('y1');
  }

  get x2(): number {
    return this._line.attr('x2');
  }

  get y2(): number {
    return this._line.attr('y2');
  }

  /**
   * Sets the _padding1 and _padding2 properties.
   */
  _storePaddings() {
    this._padding1 = distanceBetween(
      this.base1.xCenter,
      this.base1.yCenter,
      this._line.attr('x1'),
      this._line.attr('y1'),
    );
    this._padding2 = distanceBetween(
      this.base2.xCenter,
      this.base2.yCenter,
      this._line.attr('x2'),
      this._line.attr('y2'),
    );
  }

  get padding1(): number {
    return this.getPadding1();
  }

  getPadding1(): number {
    return this._padding1;
  }

  set padding1(p: number) {
    this.setPadding1(p);
  }

  setPadding1(p: number) {
    this._reposition(p, this.padding2);
  }

  get padding2(): number {
    return this.getPadding2();
  }

  getPadding2(): number {
    return this._padding2;
  }

  set padding2(p: number) {
    this.setPadding2(p);
  }

  setPadding2(p: number) {
    this._reposition(this.padding1, p);
  }

  /**
   * Repositions this straight bond based on the current positions of its bases.
   */
  reposition() {
    this._reposition(this.padding1, this.padding2);
  }

  _reposition(padding1: number, padding2: number) {
    let cs = StraightBond._lineCoordinates(this.base1, this.base2, padding1, padding2);
    this._line.attr({
      'x1': cs.x1,
      'y1': cs.y1,
      'x2': cs.x2,
      'y2': cs.y2,
    });
    this._setOpacity(
      StraightBond._opacity(this.base1, this.base2, padding1, padding2)
    );
    this._storePaddings();
  }

  insertBefore(ele: SvgElement) {
    this._line.insertBefore(ele);
  }

  insertAfter(ele: SvgElement) {
    this._line.insertAfter(ele);
  }

  get stroke(): string {
    return this.getStroke();
  }

  getStroke(): string {
    return this._line.attr('stroke');
  }

  set stroke(s: string) {
    this.setStroke(s);
  }

  setStroke(s: string) {
    this._line.attr({ 'stroke': s });
  }

  get strokeWidth(): number {
    return this.getStrokeWidth();
  }

  getStrokeWidth(): number {
    return this._line.attr('stroke-width');
  }

  set strokeWidth(sw: number) {
    this.setStrokeWidth(sw);
  }

  setStrokeWidth(sw: number) {
    this._line.attr({ 'stroke-width': sw });
  }

  get opacity(): number {
    return this._line.attr('opacity');
  }

  _setOpacity(o: number) {
    this._line.attr({ 'opacity': o });
  }

  remove() {
    this._line.remove();
  }

  savableState(): StraightBondSavableState {
    return {
      className: 'StraightBond',
      lineId: this._line.id(),
      baseId1: this.base1.id,
      baseId2: this.base2.id,
    };
  }

  refreshIds() {
    this._line.id(null);
    this._line.id();
  }
}

class PrimaryBond extends StraightBond implements PrimaryBondInterface {
  static _mostRecentProps: PrimaryBondMostRecentProps;

  static mostRecentProps(): PrimaryBondMostRecentProps {
    return { ...PrimaryBond._mostRecentProps };
  }

  static _applyMostRecentProps(pb: PrimaryBond) {
    let mrps = PrimaryBond.mostRecentProps();
    pb.padding1 = mrps.padding1;
    pb.padding2 = mrps.padding2;
    pb.stroke = mrps.stroke;
    pb.strokeWidth = mrps.strokeWidth;
  }

  static _copyPropsToMostRecent(pb: PrimaryBond) {
    PrimaryBond._mostRecentProps.padding1 = pb.padding1;
    PrimaryBond._mostRecentProps.padding2 = pb.padding2;
    PrimaryBond._mostRecentProps.stroke = pb.stroke;
    PrimaryBond._mostRecentProps.strokeWidth = pb.strokeWidth;
  }

  static fromSavedState(
    savedState: StraightBondSavableState,
    svg: Svg,
    getBaseById: (id: string) => Base,
  ): (PrimaryBond | never) {
    if (savedState.className !== 'StraightBond') {
      throw new Error('Wrong class name.');
    }
    let line = svg.findOne('#' + savedState.lineId);
    let b1 = getBaseById(savedState.baseId1);
    let b2 = getBaseById(savedState.baseId2);
    let pb = new PrimaryBond(line, b1, b2);
    PrimaryBond._copyPropsToMostRecent(pb);
    return pb;
  }

  static create(svg: Svg, b1: Base, b2: Base): PrimaryBond {
    let cs = StraightBond._lineCoordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id();
    let pb = new PrimaryBond(line, b1, b2);
    PrimaryBond._applyMostRecentProps(pb);
    return pb;
  }

  get padding1(): number {
    return super.getPadding1();
  }

  set padding1(p: number) {
    super.setPadding1(p);
    PrimaryBond._mostRecentProps.padding1 = p;
  }

  get padding2(): number {
    return super.getPadding2();
  }

  set padding2(p: number) {
    super.setPadding2(p);
    PrimaryBond._mostRecentProps.padding2 = p;
  }

  get stroke(): string {
    return super.getStroke();
  }

  set stroke(s: string) {
    super.setStroke(s);
    PrimaryBond._mostRecentProps.stroke = s;
  }

  get strokeWidth(): number {
    return super.getStrokeWidth();
  }

  set strokeWidth(sw: number) {
    super.setStrokeWidth(sw);
    PrimaryBond._mostRecentProps.strokeWidth = sw;
  }
}

PrimaryBond._mostRecentProps = {
  padding1: 8,
  padding2: 8,
  stroke: '#808080',
  strokeWidth: 1,
};

class SecondaryBond extends StraightBond implements SecondaryBondInterface {
  static _mostRecentProps: SecondaryBondMostRecentProps;

  static mostRecentProps(): SecondaryBondMostRecentProps {
    return { ...SecondaryBond._mostRecentProps };
  }

  static _applyMostRecentProps(sb: SecondaryBond) {
    let mrps = SecondaryBond.mostRecentProps();
    sb.padding1 = mrps.padding1;
    sb.padding2 = mrps.padding2;
    sb.strokeWidth = mrps.strokeWidth;
    if (sb.isAUT()) {
      sb.stroke = mrps.autStroke;
    } else if (sb.isGC()) {
      sb.stroke = mrps.gcStroke;
    } else if (sb.isGUT()) {
      sb.stroke = mrps.gutStroke;
    } else {
      sb.stroke = mrps.otherStroke;
    }
  }

  static _copyPropsToMostRecent(sb: SecondaryBond) {
    SecondaryBond._mostRecentProps.padding1 = sb.padding1;
    SecondaryBond._mostRecentProps.padding2 = sb.padding2;
    SecondaryBond._mostRecentProps.strokeWidth = sb.strokeWidth;
    if (sb.isAUT()) {
      SecondaryBond._mostRecentProps.autStroke = sb.stroke;
    } else if (sb.isGC()) {
      SecondaryBond._mostRecentProps.gcStroke = sb.stroke;
    } else if (sb.isGUT()) {
      SecondaryBond._mostRecentProps.gutStroke = sb.stroke;
    } else {
      SecondaryBond._mostRecentProps.otherStroke = sb.stroke;
    }
  }

  /**
   * Returns null if the saved state is invalid.
   */
  static fromSavedState(
    savedState: StraightBondSavableState,
    svg: Svg,
    getBaseById: (id: string) => Base,
  ): (SecondaryBond | null) {
    let sb = null;
    try {
      let line = svg.findOne('#' + savedState.lineId);
      let b1 = getBaseById(savedState.baseId1);
      let b2 = getBaseById(savedState.baseId2);
      sb = new SecondaryBond(line, b1, b2);
    } catch (err) {
      console.error('Unable to create secondary bond from saved state.');
      return null;
    }
    SecondaryBond._copyPropsToMostRecent(sb);
    return sb;
  }

  static create(svg: Svg, b1: Base, b2: Base): SecondaryBond {
    let cs = StraightBond._lineCoordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id();
    let sb = new SecondaryBond(line, b1, b2);
    SecondaryBond._applyMostRecentProps(sb);
    return sb;
  }

  isAUT(): boolean {
    let l1 = this.base1.character.toUpperCase();
    let l2 = this.base2.character.toUpperCase();
    if (l1 === 'A') {
      return l2 === 'U' || l2 === 'T';
    } else if (l1 === 'U' || l1 === 'T') {
      return l2 === 'A';
    }
    return false;
  }

  isGC(): boolean {
    let l1 = this.base1.character.toUpperCase();
    let l2 = this.base2.character.toUpperCase();
    if (l1 === 'G') {
      return l2 === 'C';
    } else if (l1 === 'C') {
      return l2 === 'G';
    }
    return false;
  }

  isGUT(): boolean {
    let l1 = this.base1.character.toUpperCase();
    let l2 = this.base2.character.toUpperCase();
    if (l1 === 'G') {
      return l2 === 'U' || l2 === 'T';
    } else if (l1 === 'U' || l1 === 'T') {
      return l2 === 'G';
    }
    return false;
  }

  get padding1(): number {
    return super.getPadding1();
  }

  set padding1(p: number) {
    super.setPadding1(p);
    SecondaryBond._mostRecentProps.padding1 = p;
  }

  get padding2(): number {
    return super.getPadding2();
  }

  set padding2(p: number) {
    super.setPadding2(p);
    SecondaryBond._mostRecentProps.padding2 = p;
  }

  get stroke(): string {
    return super.getStroke();
  }

  set stroke(s: string) {
    super.setStroke(s);
    if (this.isAUT()) {
      SecondaryBond._mostRecentProps.autStroke = s;
    } else if (this.isGC()) {
      SecondaryBond._mostRecentProps.gcStroke = s;
    } else if (this.isGUT()) {
      SecondaryBond._mostRecentProps.gutStroke = s;
    } else {
      SecondaryBond._mostRecentProps.otherStroke = s;
    }
  }

  get strokeWidth(): number {
    return super.getStrokeWidth();
  }

  set strokeWidth(sw: number) {
    super.setStrokeWidth(sw);
    SecondaryBond._mostRecentProps.strokeWidth = sw;
  }
}

SecondaryBond._mostRecentProps = {
  padding1: 6,
  padding2: 6,
  autStroke: '#000000',
  gcStroke: '#000000',
  gutStroke: '#808080',
  otherStroke: '#808080',
  strokeWidth: 2,
};

export {
  StraightBond,
  PrimaryBond,
  SecondaryBond,
};
