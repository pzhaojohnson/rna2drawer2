import {
  QuadraticBezierBondInterface,
  TertiaryBondInterface,
  QuadraticBezierBondSavableState,
  TertiaryBondMostRecentProps,
} from './QuadraticBezierBondInterface';
import {
  SvgInterface as Svg,
  SvgPathInterface as SvgPath,
} from './SvgInterface';
import { BaseInterface as Base } from './BaseInterface';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class QuadraticBezierBond implements QuadraticBezierBondInterface {
  _path: SvgPath;
  _base1: Base;
  _base2: Base;

  _padding1: number;
  _padding2: number;
  _controlHeight: number;
  _controlAngle: number;

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

  constructor(path: SvgPath, b1: Base, b2: Base) {
    this._base1 = b1;
    this._base2 = b2;

    this._path = path;
    this._validatePath();

    this._storePaddings();
    this._storeControlHeightAndAngle();
  }

  /**
   * Initializes the ID of the path if it is not already initialized.
   * 
   * Sets fill-opacity to zero.
   * 
   * Throws if the path is not composed of an M and Q segment.
   */
  _validatePath(): (void | never) {
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
    this._reposition(
      p,
      this.padding2,
      this._controlHeight,
      this._controlAngle,
    );
  }

  get padding2() {
    return this.getPadding2();
  }

  getPadding2(): number {
    return this._padding2;
  }

  set padding2(p: number) {
    this.setPadding2(p);
  }

  setPadding2(p: number) {
    this._reposition(
      this.padding1,
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
    this._reposition(this.padding1, this.padding2, controlHeight, controlAngle);
  }

  reposition() {
    this._reposition(
      this.padding1,
      this.padding2,
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

  get stroke(): string {
    return this.getStroke();
  }

  getStroke(): string {
    return this._path.attr('stroke');
  }

  set stroke(s: string) {
    this.setStroke(s);
  }

  setStroke(s: string) {
    this._path.attr({ 'stroke': s });
  }

  get strokeWidth(): number {
    return this.getStrokeWidth();
  }

  getStrokeWidth(): number {
    return this._path.attr('stroke-width');
  }

  set strokeWidth(sw: number) {
    this.setStrokeWidth(sw);
  }

  setStrokeWidth(sw: number) {
    return this._path.attr({ 'stroke-width': sw });
  }

  get strokeDasharray(): string {
    return this.getStrokeDasharray();
  }

  getStrokeDasharray(): string {
    return this._path.attr('stroke-dasharray');
  }

  set strokeDasharray(sd: string) {
    this.setStrokeDasharray(sd);
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
    this._path.css({ 'cursor': c });
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
    this._path.id(null);
    this._path.id();
  }
}

class TertiaryBond extends QuadraticBezierBond implements TertiaryBondInterface {
  static _mostRecentProps: TertiaryBondMostRecentProps;

  static mostRecentProps(): TertiaryBondMostRecentProps {
    return { ...TertiaryBond._mostRecentProps };
  }

  static _applyMostRecentProps(tb: TertiaryBond) {
    let mrps = TertiaryBond.mostRecentProps();
    tb.padding1 = mrps.padding1;
    tb.padding2 = mrps.padding2;
    tb.stroke = mrps.stroke;
    tb.strokeWidth = mrps.strokeWidth;
    tb.strokeDasharray = mrps.strokeDasharray;
  }

  static _copyPropsToMostRecent(tb: TertiaryBond) {
    TertiaryBond._mostRecentProps.padding1 = tb.padding1;
    TertiaryBond._mostRecentProps.padding2 = tb.padding2;
    TertiaryBond._mostRecentProps.stroke = tb.stroke;
    TertiaryBond._mostRecentProps.strokeWidth = tb.strokeWidth;
    TertiaryBond._mostRecentProps.strokeDasharray = tb.strokeDasharray;
  }

  static fromSavedState(
    savedState: QuadraticBezierBondSavableState,
    svg: Svg,
    getBaseById: (id: string) => Base,
  ): (TertiaryBond | never) {
    if (savedState.className !== 'QuadraticBezierBond') {
      throw new Error('Wrong class name.');
    }
    let p = svg.findOne('#' + savedState.pathId) as SvgPath;
    let b1 = getBaseById(savedState.baseId1);
    let b2 = getBaseById(savedState.baseId2);
    let tb = new TertiaryBond(p, b1, b2);
    TertiaryBond._copyPropsToMostRecent(tb);
    return tb;
  }

  static create(svg: Svg, b1: Base, b2: Base): TertiaryBond {
    let d = QuadraticBezierBond._dPath(b1, b2, 6, 6, 100, -Math.PI / 2);
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

  get strokeDasharray(): string {
    return super.getStrokeDasharray();
  }

  set strokeDasharray(sd: string) {
    super.setStrokeDasharray(sd);
    TertiaryBond._mostRecentProps.strokeDasharray = sd;
  }
}

TertiaryBond._mostRecentProps = {
  padding1: 8,
  padding2: 8,
  stroke: '#0000ff',
  strokeWidth: 1,
  strokeDasharray: '8 2',
};

export {
  QuadraticBezierBond,
  TertiaryBond,
};
