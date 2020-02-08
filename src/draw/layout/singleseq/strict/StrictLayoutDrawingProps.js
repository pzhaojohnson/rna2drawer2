/**
 * Since instances of this class have no object properties,
 * they can be deep copied using the spread operator.
 * 
 * Instances of this class can also be converted to and parsed from
 * a JSON string via the JSON.stringify and JSON.parse methods, respectively.
 */
class StrictLayoutDrawingProps {
  constructor() {
    this.flatOutermostLoop = false;
    this.rotation = 0.0;

    this.watsonCrickBondLength = 1.2;

    // the virtual distance between the 5' and 3' termini with a round outermost loop
    this.terminiGap = 4;

    this.maxTriangleLoopAngle = 0.8 * Math.PI;
  }
}

export default StrictLayoutDrawingProps;
