/**
 * Since instances of this class have no object properties,
 * they can be deep copied using the spread operator.
 * 
 * Instances of this class can also be converted to and parsed from
 * a JSON string via the JSON.stringify and JSON.parse methods, respectively.
 */
class StrictLayoutBaseProps {
  constructor() {
    this.stretch3 = 0;
    this.flatOutermostLoopAngle3 = 0;
    this.flipStem = false;
    this.loopShape = 'round';
  }
}

export default StrictLayoutBaseProps;
