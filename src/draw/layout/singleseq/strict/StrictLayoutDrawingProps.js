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
