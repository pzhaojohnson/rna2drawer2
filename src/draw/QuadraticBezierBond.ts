import {
  QuadraticBezierBondInterface,
  TertiaryBondInterface,
  QuadraticBezierBondSavableState,
  TertiaryBondMostRecentProps,
} from './QuadraticBezierBondInterface';
import * as Svg from '@svgdotjs/svg.js';
import { BaseInterface as Base } from './BaseInterface';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class QuadraticBezierBond implements QuadraticBezierBondInterface {
  _path: Svg.Path;
  _base1: Base;
  _base2: Base;

  _padding1!: number;
  _padding2!: number;
  _controlHeight!: number;
  _controlAngle!: number;

  static _dPath(
    b1: Base,
    b2: Base,
    padding1: number,
    padding2: number,
    controlHeight: number,
    controlAngle: number,
  ): string {
    let xMiddle = (b1.xCenter + b2.xCenter) / 2;
    let yMiddle = (b1.yCenter + b2.yCenter) / 2;
    let ca = b1.angleBetweenCenters(b2) + controlAngle;
    let xControl = xMiddle + (controlHeight * Math.cos(ca));
    let yControl = yMiddle + (controlHeight * Math.sin(ca));
    let a1 = angleBetween(b1.xCenter, b1.yCenter, xControl, yControl);
    let x1 = b1.xCenter + (padding1 * Math.cos(a1));
    let y1 = b1.yCenter + (padding1 * Math.sin(a1));
    let a2 = angleBetween(b2.xCenter, b2.yCenter, xControl, yControl);
    let x2 = b2.xCenter + (padding2 * Math.cos(a2));
    let y2 = b2.yCenter + (padding2 * Math.sin(a2));
    return ['M', x1, y1, 'Q', xControl, yControl, x2, y2].join(' ');
  }

  /**
   * Throws if the path element is not actually a path element.
   * 
   * Initializes the ID of the path if it is not already initialized.
   * 
   * Sets fill-opacity to zero.
   * 
   * Throws if the path is not composed of an M and Q segment.
   */
  constructor(path: Svg.Path, b1: Base, b2: Base) {
    this._base1 = b1;
    this._base2 = b2;

    this._path = path;
    this._validatePath();

    this._storePaddings();
    this._storeControlHeightAndAngle();
  }

  _validatePath(): (void | never) {
    if (this._path.type !== 'path') {
      throw new Error('The given element is not a path element.');
    }
    this._path.id();
    this._path.attr({ 'fill-opacity': 0 });
    let pa = this._path.array();
    if (pa.length !== 2) {
      throw new Error('Invalid path.');
    }
    let m = pa[0];
    let q = pa[1];
    if (m[0] !== 'M' || q[0] !== 'Q') {
      throw new Error('Invalid path.');
    }
  }

  get id(): string {
    return this._path.id();
  }

  get base1(): Base {
    return this._base1;
  }

  get base2(): Base {
    return this._base2;
  }

  get x1(): number {
    let pa = this._path.array();
    let m = pa[0];
    return m[1] as number;
  }

  get y1(): number {
    let pa = this._path.array();
    let m = pa[0];
    return m[2] as number;
  }

  get x2(): number {
    let pa = this._path.array();
    let q = pa[1];
    return q[3] as number;
  }

  get y2(): number {
    let pa = this._path.array();
    let q = pa[1];
    return q[4] as number;
  }

  get xControl(): number {
    let pa = this._path.array();
    let q = pa[1];
    return q[1] as number;
  }

  get yControl(): number {
    let pa = this._path.array();
    let q = pa[1];
    return q[2] as number;
  }

  /**
   * Sets the _padding1 and _padding2 properties.
   */
  _storePaddings() {
    this._padding1 = distanceBetween(
      this.base1.xCenter,
      this.base1.yCenter,
      this.x1,
      this.y1,
    );
    this._padding2 = distanceBetween(
      this.base2.xCenter,
      this.base2.yCenter,
      this.x2,
      this.y2,
    );
  }

  getPadding1(): number {
    return this._padding1;
  }

  setPadding1(p: number) {
    this._reposition(
      p,
      this.getPadding2(),
      this._controlHeight,
      this._controlAngle,
    );
  }

  getPadding2(): number {
    return this._padding2;
  }

  setPadding2(p: number) {
    this._reposition(
      this.getPadding1(),
      p,
      this._controlHeight,
      this._controlAngle,
    );
  }

  /**
   * Sets the _controlHeight and _controlAngle properties.
   */
  _storeControlHeightAndAngle() {
    let xMiddle = (this.base1.xCenter + this.base2.xCenter) / 2;
    let yMiddle = (this.base1.yCenter + this.base2.yCenter) / 2;
    this._controlHeight = distanceBetween(
      xMiddle,
      yMiddle,
      this.xControl,
      this.yControl,
    );
    let a12 = this.base1.angleBetweenCenters(this.base2);
    let ca = angleBetween(
      xMiddle,
      yMiddle,
      this.xControl,
      this.yControl,
    );
    this._controlAngle = normalizeAngle(ca, a12) - a12;
  }

  shiftControl(xShift: number, yShift: number) {
    let xMiddle = (this.base1.xCenter + this.base2.xCenter) / 2;
    let yMiddle = (this.base1.yCenter + this.base2.yCenter) / 2;
    let xControl = this.xControl + xShift;
    let yControl = this.yControl + yShift;
    let controlHeight = distanceBetween(xMiddle, yMiddle, xControl, yControl);
    let ca = angleBetween(xMiddle, yMiddle, xControl, yControl);
    let a12 = this.base1.angleBetweenCenters(this.base2);
    let controlAngle = normalizeAngle(ca, a12) - a12;
    this._reposition(this.getPadding1(), this.getPadding2(), controlHeight, controlAngle);
  }

  reposition() {
    this._reposition(
      this.getPadding1(),
      this.getPadding2(),
      this._controlHeight,
      this._controlAngle
    );
  }

  _reposition(padding1: number, padding2: number, controlHeight: number, controlAngle: number) {
    this._path.plot(
      QuadraticBezierBond._dPath(
        this.base1,
        this.base2,
        padding1,
        padding2,
        controlHeight,
        controlAngle,
      ),
    );
    this._storePaddings();
    this._storeControlHeightAndAngle();
  }

  getStroke(): string {
    return this._path.attr('stroke');
  }

  setStroke(s: string) {
    this._path.attr({ 'stroke': s });
  }

  getStrokeWidth(): number {
    return this._path.attr('stroke-width');
  }

  setStrokeWidth(sw: number) {
    this._path.attr({ 'stroke-width': sw });
  }

  getStrokeOpacity(): number {
    return this._path.attr('stroke-opacity');
  }

  setStrokeOpacity(so: number) {
    this._path.attr({ 'stroke-opacity': so });
  }

  getStrokeDasharray(): string {
    return this._path.attr('stroke-dasharray');
  }

  setStrokeDasharray(sd: string) {
    this._path.attr({ 'stroke-dasharray': sd });
  }

  get fill(): string {
    return this._path.attr('fill');
  }

  set fill(f: string) {
    this._path.attr({ 'fill': f });
  }

  get fillOpacity(): number {
    return this._path.attr('fill-opacity');
  }

  set fillOpacity(fo: number) {
    this._path.attr({ 'fill-opacity': fo });
  }

  get cursor(): string {
    return this._path.css('cursor');
  }

  set cursor(c: string) {
    this._path.css('cursor', c);
  }

  onMouseover(f: () => void) {
    this._path.mouseover(f);
  }

  onMouseout(f: () => void) {
    this._path.mouseout(f);
  }

  onMousedown(f: () => void) {
    this._path.mousedown(f);
  }

  onDblclick(f: () => void) {
    this._path.dblclick(f);
  }

  remove() {
    this._path.remove();
  }

  hasBeenRemoved() {
    return !this._path.root();
  }

  savableState(): QuadraticBezierBondSavableState {
    return {
      className: 'QuadraticBezierBond',
      pathId: this._path.id(),
      baseId1: this.base1.id,
      baseId2: this.base2.id,
    };
  }

  refreshIds() {
    this._path.id('');
    this._path.id();
  }
}

class TertiaryBond extends QuadraticBezierBond implements TertiaryBondInterface {
  static _mostRecentProps: TertiaryBondMostRecentProps;
  static dashedStrokeDasharray: string;

  static mostRecentProps(): TertiaryBondMostRecentProps {
    return { ...TertiaryBond._mostRecentProps };
  }

  static _applyMostRecentProps(tb: TertiaryBond) {
    let mrps = TertiaryBond.mostRecentProps();
    tb.padding1 = mrps.padding1;
    tb.padding2 = mrps.padding2;
    tb.stroke = mrps.stroke;
    tb.strokeWidth = mrps.strokeWidth;
    tb.strokeOpacity = mrps.strokeOpacity;
    tb.strokeDasharray = mrps.strokeDasharray;
  }

  static _copyPropsToMostRecent(tb: TertiaryBond) {
    TertiaryBond._mostRecentProps.padding1 = tb.padding1;
    TertiaryBond._mostRecentProps.padding2 = tb.padding2;
    TertiaryBond._mostRecentProps.stroke = tb.stroke;
    TertiaryBond._mostRecentProps.strokeWidth = tb.strokeWidth;
    TertiaryBond._mostRecentProps.strokeOpacity = tb.strokeOpacity;
    TertiaryBond._mostRecentProps.strokeDasharray = tb.strokeDasharray;
  }

  static fromSavedState(
    savedState: QuadraticBezierBondSavableState,
    svg: Svg.Svg,
    getBaseById: (id: string) => (Base | null),
  ): (TertiaryBond | never) {
    if (savedState.className !== 'QuadraticBezierBond') {
      throw new Error('Wrong class name.');
    }
    let p = svg.findOne('#' + savedState.pathId) as Svg.Path;
    let b1 = getBaseById(savedState.baseId1) as Base;
    let b2 = getBaseById(savedState.baseId2) as Base;
    let tb = new TertiaryBond(p, b1, b2);
    TertiaryBond._copyPropsToMostRecent(tb);
    return tb;
  }

  static create(svg: Svg.Svg, b1: Base, b2: Base): TertiaryBond {
    let ch = 0.35 * b1.distanceBetweenCenters(b2);
    let d = QuadraticBezierBond._dPath(b1, b2, 6, 6, ch, -Math.PI / 2);
    let p = svg.path(d);
    let tb = new TertiaryBond(p, b1, b2);
    TertiaryBond._applyMostRecentProps(tb);
    return tb;
  }

  get padding1(): number {
    return super.getPadding1();
  }

  set padding1(p: number) {
    super.setPadding1(p);
    TertiaryBond._mostRecentProps.padding1 = p;
  }

  get padding2(): number {
    return super.getPadding2();
  }

  set padding2(p: number) {
    super.setPadding2(p);
    TertiaryBond._mostRecentProps.padding2 = p;
  }

  get stroke(): string {
    return super.getStroke();
  }

  set stroke(s: string) {
    super.setStroke(s);
    TertiaryBond._mostRecentProps.stroke = s;
  }

  get strokeWidth(): number {
    return super.getStrokeWidth();
  }

  set strokeWidth(sw: number) {
    super.setStrokeWidth(sw);
    TertiaryBond._mostRecentProps.strokeWidth = sw;
  }

  get strokeOpacity(): number {
    return super.getStrokeOpacity();
  }

  set strokeOpacity(so: number) {
    super.setStrokeOpacity(so);
    TertiaryBond._mostRecentProps.strokeOpacity = so;
  }

  get strokeDasharray(): string {
    return super.getStrokeDasharray();
  }

  set strokeDasharray(sd: string) {
    super.setStrokeDasharray(sd);
    TertiaryBond._mostRecentProps.strokeDasharray = sd;
  }
}

TertiaryBond.dashedStrokeDasharray = '8 2';

TertiaryBond._mostRecentProps = {
  padding1: 8,
  padding2: 8,
  stroke: '#4a90e2',
  strokeWidth: 1.25,
  strokeOpacity: 1,
  strokeDasharray: '',
};

export {
  QuadraticBezierBond,
  TertiaryBond,
};
