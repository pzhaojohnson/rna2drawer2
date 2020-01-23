import createUUIDforSVG from './createUUIDforSVG';
import StrictLayoutBaseProps from './layout/singleseq/strict/StrictLayoutBaseProps';
import distanceBetween from './distanceBetween';
import angleBetween from './angleBetween';

class Base {

  /**
   * @param {SVG.Doc} svg The SVG document to draw the base on.
   * @param {string} letter The single character that represents the base.
   * @param {number} xCenter The center X coordinate for the base.
   * @param {number} yCenter The center Y coordinate for the base.
   * 
   * @returns {Base} The newly created base.
   */
  static create(svg, letter, xCenter, yCenter) {
    let text = svg.text((add) => add.tspan(letter));

    text.attr({
      'id': createUUIDforSVG(),
      'x': xCenter,
      'y': yCenter,
      'text-anchor': 'middle',
      'dy': '0.4em',
    });

    return new Base(text);
  }

  /**
   * @param {SVG.Text} text The SVG text object of this base.
   */
  constructor(text) {
    this._text = text;
    this._validateText();
    
    this._strictLayoutProps = new StrictLayoutBaseProps();

    this._highlighting = null;
    this._outline = null;
    this._numbering = null;
    this._annotations = [];
  }

  /**
   * The SVG text object must have a unique ID.
   * 
   * The text content must be a single character to help facilitate
   * searching for complementary sequences.
   * 
   * Setting text-anchor to middle and dy to 0.4em centers the text
   * of an SVG text object on its x and y properties.
   * 
   * @throws {Error} If the id property is not defined.
   * @throws {Error} If the text content is not a single character.
   * @throws {Error} If the text-anchor property is not middle.
   * @throws {Error} If the dy property is not 0.4em.
   */
  _validateText() {

    // just checks if the id property is defined
    if (typeof(this._text.attr('id')) !== 'string') {
      throw new Error('The SVG text object must have a unique ID.');
    }

    if (this._text.text().length !== 1) {
      throw new Error('The text content must be a single character.');
    }

    if (this._text.attr('text-anchor') !== 'middle') {
      throw new Error('The text-anchor property must be middle.');
    }

    if (this._text.attr('dy') !== '0.4em') {
      throw new Error('The dy property must be 0.4em.');
    }
  }

  /**
   * @returns {string} The ID of this base.
   */
  get id() {
    return this._text.attr('id');
  }

  /**
   * @returns {string} The single character that represents this base.
   */
  get letter() {
    return this._text.text();
  }

  /**
   * @returns {number} The X coordinate of the SVG text object of this base.
   */
  get xCenter() {
    return this._text.attr('x');
  }

  /**
   * @returns {number} The Y coordinate of the SVG text object of this base.
   */
  get yCenter() {
    return this._text.attr('y');
  }

  /**
   * Sets the X and Y coordinates of the center of this base to
   * the given coordinates.
   * 
   * @param {number} xCenter 
   * @param {number} yCenter 
   */
  move(xCenter, yCenter) {
    this._text.attr({
      'x': xCenter,
      'y': yCenter
    });
  }

  /**
   * @returns {StrictLayoutBaseProps} A copy of the strict layout properties of this base.
   */
  strictLayoutProps() {
    return { ...this._strictLayoutProps };
  }

  /**
   * @param {Base} other 
   * 
   * @returns {number} The distance between the centers of this base and another base.
   */
  distanceBetweenCenters(other) {
    return distanceBetween(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }

  /**
   * @param {Base} other 
   * 
   * @returns {number} The angle from the center of this base to the center of another base.
   */
  angleBetweenCenters(other) {
    return angleBetween(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }
}

export default Base;
