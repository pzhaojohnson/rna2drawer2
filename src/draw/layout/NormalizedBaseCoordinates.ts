import distanceBetween from '../distanceBetween';
import angleBetween from '../angleBetween';

export class NormalizedBaseCoordinates {
  _xLeft: number;
  _yTop: number;

  constructor(xLeft: number, yTop: number) {
    this._xLeft = xLeft;
    this._yTop = yTop;
  }

  get xLeft(): number {
    return this._xLeft;
  }

  get xRight(): number {
    return this.xLeft + 1;
  }

  get xCenter(): number {
    return this.xLeft + 0.5;
  }

  get yTop(): number {
    return this._yTop;
  }

  get yBottom(): number {
    return this.yTop + 1;
  }

  get yCenter(): number {
    return this.yTop + 0.5;
  }

  distanceBetweenCenters(other: NormalizedBaseCoordinates): number {
    return distanceBetween(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }

  angleBetweenCenters(other: NormalizedBaseCoordinates): number {
    return angleBetween(
      this.xCenter,
      this.yCenter,
      other.xCenter,
      other.yCenter
    );
  }
}

export default NormalizedBaseCoordinates;
