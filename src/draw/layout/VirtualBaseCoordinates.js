import distanceBetween from '../distanceBetween';
import angleBetween from '../angleBetween';

class VirtualBaseCoordinates {
  constructor(xLeft, yTop) {
    this._xLeft = xLeft;
    this._yTop = yTop;
  }

  get xLeft() {
    return this._xLeft;
  }

  get xRight() {
    return this.xLeft + 1;
  }

  get xCenter() {
    return this.xLeft + 0.5;
  }

  get yTop() {
    return this._yTop;
  }

  get yBottom() {
    return this.yTop + 1;
  }

  get yCenter() {
    return this.yTop + 0.5;
  }

  /**
   * @param {VirtualBaseCoordinates} other 
   * 
   * @returns {number} The distance between the center points of two sets of base coordinates.
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
   * @param {VirtualBaseCoordinates} other 
   * 
   * @returns {number} The angle from the center of this set of base coordinates
   *  to the center of another set of base coordinates.
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

export default VirtualBaseCoordinates;
