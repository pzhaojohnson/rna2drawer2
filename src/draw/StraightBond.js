import SingleBond from './SingleBond';
import distanceBetween from './distanceBetween';
import createUUIDforSVG from './createUUIDforSVG';

class StraightBond extends SingleBond {

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * @param {numbering} padding1 
   * @param {numbering} padding2 
   * 
   * @returns {object} The coordinates for the SVG line object of a straight bond
   *  given the two bases it connects and their paddings.
   */
  static coordinates(b1, b2, padding1, padding2) {
    let angle1 = b1.angleBetweenCenters(b2);
    let x1 = b1.xCenter + (padding1 * Math.cos(angle1));
    let y1 = b1.yCenter + (padding1 * Math.sin(angle1));

    let angle2 = b2.angleBetweenCenters(b1);
    let x2 = b2.xCenter + (padding2 * Math.cos(angle2));
    let y2 = b2.yCenter + (padding2 * Math.sin(angle2));

    return { x1: x1, y1: y1, x2: x2, y2: y2 };
  }

  /**
   * @param {Base} b1 
   * @param {Base} b2 
   * @param {number} padding1 
   * @param {number} padding2 
   * 
   * @returns {number} The opacity for a straight bond given its bases and paddings.
   */
  static opacity(b1, b2, padding1, padding2) {
    if (padding1 + padding2 >= b1.distanceBetweenCenters(b2)) {
      return 0;
    } else {
      return 1;
    }
  }

  /**
   * Creates a straight bond styled as a strand bond.
   * 
   * @param {SVG.Doc} svg The SVG document to draw the straight bond on.
   * @param {Base} b1 
   * @param {Base} b2 
   * @param {object} drawingDefaults The defaults property of the drawing that the straight bond is part of.
   * 
   * @returns {StraightBond} The newly created straight bond.
   */
  static createStrand(svg, b1, b2, drawingDefaults) {
    let styles = {
      padding1: drawingDefaults.strandBondPadding,
      padding2: drawingDefaults.strandBondPadding,
      stroke: drawingDefaults.strandBondStroke,
      strokeWidth: drawingDefaults.strandBondStrokeWidth
    };

    return StraightBond.create(svg, b1, b2, styles);
  };

  /**
   * Creates a straight bond styled as a Watson Crick bond.
   * 
   * @param {SVG.Doc} svg The SVG document to draw the straight bond on.
   * @param {Base} b1 
   * @param {Base} b2 
   * @param {object} drawingDefaults The defaults property of the drawing that the straight bond is part of.
   * 
   * @returns {StraightBond} The newly created straight bond.
   */
  static createWatsonCrick(svg, b1, b2, drawingDefaults) {
    let letters = b1.letter.toUpperCase() + b2.letter.toUpperCase();
    let stroke;

    if (['AU', 'UA', 'AT', 'TA'].includes(letters)) {
      stroke = drawingDefaults.watsonCrickAUTBondStroke;
    } else if (['GC', 'CG'].includes(letters)) {
      stroke = drawingDefaults.watsonCrickGCBondStroke;
    } else if (['GU', 'UG', 'GT', 'TG'].includes(letters)) {
      stroke = drawingDefaults.watsonCrickGUTBondStroke;
    } else {
      stroke = drawingDefaults.watsonCrickOtherBondStroke;
    }

    let styles = {
      padding1: drawingDefaults.watsonCrickBondPadding,
      padding2: drawingDefaults.watsonCrickBondPadding,
      stroke: stroke,
      strokeWidth: drawingDefaults.watsonCrickBondStrokeWidth
    };

    return StraightBond.create(svg, b1, b2, styles);
  };

  /**
   * The padding1, padding2, stroke, strokeWidth, and opacity properties can be
   * specified via the optional styles argument.
   * 
   * @param {SVG.Doc} svg The SVG document to draw the straight bond on.
   * @param {Base} b1 
   * @param {Base} b2 
   * @param {object} [styles={}] Optional stylings of the straight bond.
   * 
   * @returns {StraightBond} The newly created straight bond.
   */
  static create(svg, b1, b2, styles={}) {
    let padding1 = styles.padding1 === undefined ? 0 : styles.padding1;
    let padding2 = styles.padding2 === undefined ? 0 : styles.padding2;
    let cs = StraightBond.coordinates(b1, b2, padding1, padding2);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    
    let stroke = styles.stroke === undefined ? '#000000' : styles.stroke;
    let strokeWidth = styles.strokeWidth === undefined ? 1 : styles.strokeWidth;
    let opacity = StraightBond.opacity(b1, b2, padding1, padding2);
    
    line.attr({
      'id': createUUIDforSVG(),
      'stroke': stroke,
      'stroke-width': strokeWidth,
      'opacity': opacity
    });
    
    return new StraightBond(line, b1, b2);
  }

  /**
   * The end of the SVG line object (defined by the x1 and y1 properties)
   * is attached to base b1, and the other end (defined by the x2 and y2
   * properties) is attached to base b2.
   * 
   * @param {SVG.Line} line The SVG line object of the straight bond.
   * @param {Base} b1 One base of the straight bond.
   * @param {Base} b2 The other base of the straight bond.
   */
  constructor(line, b1, b2) {
    super(b1, b2);

    this._line = line;
    this._validateLine();
    this._initializePaddings();
  }

  /**
   * Validates the SVG line object of this straight bond.
   * 
   * @throws {Error} If the id property is not defined.
   */
  _validateLine() {

    // just checks that the id property is defined
    if (typeof(this._line.attr('id')) !== 'string') {
      throw new Error('The SVG line object of a straight bond must have a unique ID.');
    }
  }

  /**
   * Initializes the _padding1 and _padding2 properties, which store the paddings
   * for bases 1 and 2, respectively.
   * 
   * The _padding1 and _padding2 properties are necessary for the reposition method
   * to work.
   */
  _initializePaddings() {
    this._padding1 = distanceBetween(
      this.base1.xCenter,
      this.base1.yCenter,
      this._line.attr('x1'),
      this._line.attr('y1')
    );

    this._padding2 = distanceBetween(
      this.base2.xCenter,
      this.base2.yCenter,
      this._line.attr('x2'),
      this._line.attr('y2')
    );
  }

  get id() {
    return this._line.attr('id');
  }

  /**
   * @returns {number} The distance between the center of base 1 and its end of the line.
   */
  get padding1() {
    return this._padding1;
  }

  /**
   * @param {number} pdg The new padding.
   */
  set padding1(pdg) {
    this._padding1 = pdg;
    this.reposition();
  }

  /**
   * @returns {number} The distance between the center of base 2 and its end of the line.
   */
  get padding2() {
    return this._padding2;
  }

  /**
   * @param {number} pdg The new padding.
   */
  set padding2(pdg) {
    this._padding2 = pdg;
    this.reposition();
  }

  /**
   * Repositions the SVG line object of this straight bond based on
   * the current positions of the two bases of this bond and the padding
   * properties of this bond.
   */
  reposition() {
    let cs = StraightBond.coordinates(this.base1, this.base2, this.padding1, this.padding2);
    let opacity = StraightBond.opacity(this.base1, this.base2, this.padding1, this.padding2);
    
    this._line.attr({
      'x1': cs.x1,
      'y1': cs.y1,
      'x2': cs.x2,
      'y2': cs.y2,
      'opacity': opacity
    });
  }

  /**
   * @returns {string} The stroke color of the SVG line object of this straight bond.
   */
  get stroke() {
    return this._line.attr('stroke');
  }

  set stroke(s) {
    this._line.attr({ 'stroke': s });
  }

  /**
   * @returns {number} The stroke width of the SVG line object of this straight bond.
   */
  get strokeWidth() {
    return this._line.attr('stroke-width');
  }

  set strokeWidth(sw) {
    this._line.attr({ 'stroke-width': sw });
  }

  /**
   * @returns {number} The opacity of the SVG line object of this straight bond.
   */
  get opacity() {
    return this._line.attr('opacity');
  }
}

export default StraightBond;
