import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';
import normalizeAngle from './normalizeAngle';

class QuadraticBezierBond {

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * @param {number} padding1 
   * @param {number} padding2 
   * @param {number} controlHeight 
   * @param {number} controlAngle 
   * 
   * @returns {string} 
   */
  static _dPath(b1, b2, padding1, padding2, controlHeight, controlAngle) {
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
   * @param {SVG.Path} path 
   * @param {Base} b1 
   * @param {Base} b2 
   */
  constructor(path, b1, b2) {
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
   * @throws {Error} If the path is not composed of an M and Q segment.
   */
  _validatePath() {
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

  /**
   * @returns {string} 
   */
  get id() {
    return this._path.id();
  }

  /**
   * @returns {Base} 
   */
  get base1() {
    return this._base1;
  }

  /**
   * @returns {Base} 
   */
  get base2() {
    return this._base2;
  }

  /**
   * @returns {number} 
   */
  get x1() {
    let pa = this._path.array();
    let m = pa[0];
    return m[1];
  }

  /**
   * @returns {number} 
   */
  get y1() {
    let pa = this._path.array();
    let m = pa[0];
    return m[2];
  }

  /**
   * @returns {number} 
   */
  get x2() {
    let pa = this._path.array();
    let q = pa[1];
    return q[3];
  }

  /**
   * @returns {number} 
   */
  get y2() {
    let pa = this._path.array();
    let q = pa[1];
    return q[4];
  }

  /**
   * @returns {number} 
   */
  get xControl() {
    let pa = this._path.array();
    let q = pa[1];
    return q[1];
  }

  /**
   * @returns {number} 
   */
  get yControl() {
    let pa = this._path.array();
    let q = pa[1];
    return q[2];
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

  /**
   * @returns {number} 
   */
  get padding1() {
    return this._padding1;
  }

  /**
   * @param {number} p 
   */
  set padding1(p) {
    this._reposition(
      p,
      this.padding2,
      this._controlHeight,
      this._controlAngle,
    );
  }

  /**
   * @returns {number} 
   */
  get padding2() {
    return this._padding2;
  }

  /**
   * @param {number} p 
   */
  set padding2(p) {
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

  /**
   * @param {number} xShift 
   * @param {number} yShift 
   */
  shiftControl(xShift, yShift) {
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

  /**
   * @param {number} padding1 
   * @param {number} padding2 
   */
  _reposition(padding1, padding2, controlHeight, controlAngle) {
    this._path.plot(
      QuadraticBezierBond._dPath(
        this.base1,
        this.base2,
        padding1,
        padding2,
        controlHeight,
        controlAngle,
      )
    );
    this._storePaddings();
    this._storeControlHeightAndAngle();
  }

  /**
   * @returns {string} 
   */
  get stroke() {
    return this._path.attr('stroke');
  }

  /**
   * @param {string} s 
   */
  set stroke(s) {
    this._path.attr({ 'stroke': s });
  }

  /**
   * @returns {number} 
   */
  get strokeWidth() {
    return this._path.attr('stroke-width');
  }

  /**
   * @param {number} sw 
   */
  set strokeWidth(sw) {
    return this._path.attr({ 'stroke-width': sw });
  }

  /**
   * @returns {string} 
   */
  get strokeDasharray() {
    return this._path.attr('stroke-dasharray');
  }

  /**
   * @param {string} sd 
   */
  set strokeDasharray(sd) {
    this._path.attr({ 'stroke-dasharray': sd });
  }

  /**
   * @returns {string} 
   */
  get cursor() {
    return this._path.css('cursor');
  }

  /**
   * @param {string} c 
   */
  set cursor(c) {
    this._path.css({ 'cursor': c });
  }

  /**
   * @param {function} cb 
   */
  bindMousedown(cb) {
    this._path.mousedown(cb);
  }

  /**
   * @param {function} cb 
   */
  bindDlbclick(cb) {
    this._path.dblclick(cb);
  }

  remove() {
    this._path.remove();
  }

  /**
   * @typedef {Object} QuadaraticBezierBond~SavableState 
   * @property {string} className 
   * @property {string} path 
   * @property {string} base1 
   * @property {string} base2 
   */

  /**
   * @returns {QuadraticBezierBond~SavableState} 
   */
  savableState() {
    return {
      className: 'QuadraticBezierBond',
      path: this._path.id(),
      base1: this.base1.id,
      base2: this.base2.id,
    };
  }
}

class TertiaryBond extends QuadraticBezierBond {

  /**
   * @typedef {Object} TertiaryBond~MostRecentProps 
   * @property {number} padding1 
   * @property {number} padding2 
   * @property {string} stroke 
   * @property {number} strokeWidth 
   * @property {string} strokeDasharray 
   */

  /**
   * @returns {TertiaryBond~MostRecentProps} 
   */
  static mostRecentProps() {
    return { ...TertiaryBond._mostRecentProps };
  }

  /**
   * @param {TertiaryBond} tb 
   */
  static _applyMostRecentProps(tb) {
    let mrps = TertiaryBond.mostRecentProps();
    tb.padding1 = mrps.padding1;
    tb.padding2 = mrps.padding2;
    tb.stroke = mrps.stroke;
    tb.strokeWidth = mrps.strokeWidth;
    tb.strokeDasharray = mrps.strokeDasharray;
  }

  /**
   * @param {TertiaryBond} tb 
   */
  static _copyPropsToMostRecent(tb) {
    TertiaryBond._mostRecentProps.padding1 = tb.padding1;
    TertiaryBond._mostRecentProps.padding2 = tb.padding2;
    TertiaryBond._mostRecentProps.stroke = tb.stroke;
    TertiaryBond._mostRecentProps.strokeWidth = tb.strokeWidth;
    TertiaryBond._mostRecentProps.strokeDasharray = tb.strokeDasharray;
  }

  /**
   * @callback TertiaryBond~getBaseById 
   * @param {string} id 
   * 
   * @returns {Base} 
   */

  /**
   * Returns null if the saved state is invalid.
   * 
   * @param {QuadraticBezierBond~SavableState} savedState 
   * @param {SVG.Svg} svg 
   * @param {TertiaryBond~getBaseById} getBaseById 
   * 
   * @returns {TertiaryBond|null} 
   */
  static fromSavedState(savedState, svg, getBaseById) {
    if (savedState.className !== 'QuadraticBezierBond') {
      return null;
    }
    let p = svg.findOne('#' + savedState.path);
    let b1 = getBaseById(savedState.base1);
    let b2 = getBaseById(savedState.base2);
    let tb = null;
    try {
      tb = new TertiaryBond(p, b1, b2);
    } catch (err) {
      return null;
    }
    TertiaryBond._copyPropsToMostRecent(tb);
    return tb;
  }

  /**
   * @param {SVG.Svg} svg 
   * @param {Base} b1 
   * @param {Base} b2 
   * 
   * @returns {TertiaryBond} 
   */
  static create(svg, b1, b2) {
    let p = svg.path(
      QuadraticBezierBond._dPath(b1, b2, 8, 8, 20, -Math.PI)
    );
    let tb = new TertiaryBond(p, b1, b2);
    TertiaryBond._applyMostRecentProps(tb);
    return tb;
  }

  /**
   * @returns {number} 
   */
  get padding1() {
    return super.padding1;
  }

  /**
   * @param {number} p 
   */
  set padding1(p) {
    super.padding1 = p;
    TertiaryBond._mostRecentProps.padding1 = p;
  }

  /**
   * @returns {number} 
   */
  get padding2() {
    return super.padding2;
  }

  /**
   * @param {number} p 
   */
  set padding2(p) {
    super.padding2 = p;
    TertiaryBond._mostRecentProps.padding2 = p;
  }

  /**
   * @returns {string} 
   */
  get stroke() {
    return super.stroke;
  }

  /**
   * @param {string} s 
   */
  set stroke(s) {
    super.stroke = s;
    TertiaryBond._mostRecentProps.stroke = s;
  }

  /**
   * @returns {number} 
   */
  get strokeWidth() {
    return super.strokeWidth;
  }

  /**
   * @param {number} sw 
   */
  set strokeWidth(sw) {
    super.strokeWidth = sw;
    TertiaryBond._mostRecentProps.strokeWidth = sw;
  }

  /**
   * @returns {string} 
   */
  get strokeDasharray() {
    return super.strokeDasharray;
  }

  /**
   * @param {string} sd 
   */
  set strokeDasharray(sd) {
    super.strokeDasharray = sd;
    TertiaryBond._mostRecentProps.strokeDasharray = sd;
  }
}

TertiaryBond._mostRecentProps = {
  padding1: 8,
  padding2: 8,
  stroke: '#0000ff',
  strokeWidth: 1,
  strokeDasharray: '3 1',
};

export {
  QuadraticBezierBond,
  TertiaryBond,
};
