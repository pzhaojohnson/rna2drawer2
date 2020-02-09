import VirtualBaseCoordinates from '../../VirtualBaseCoordinates';
import polarizeLength from './polarizeLength';

/**
 * @param {UnpairedRegion} ur 
 * 
 * @returns {Array<VirtualBaseCoordinates>} The base coordinates of all positions in the given unpaired region
 *  as a hairpin loop.
 */
function baseCoordinatesHairpin(ur) {
  let coordinates = [];
  
  let circumference = ur.polarLength + ur.boundingStem5.polarWidth;
  let radius = circumference / (2 * Math.PI);
  
  let cbp5 = ur.baseCoordinatesBounding5();
  let cbp3 = ur.baseCoordinatesBounding3();
  let o = cbp5.distanceBetweenCenters(cbp3) / 2;
  let angle = ur.boundingStem5.angle + Math.asin(o / radius);

  let xCenter;
  let yCenter;

  // the width of the stem is too big for the radius of the hairpin
  if (isNaN(angle)) {
    xCenter = (cbp5.xCenter + cbp3.xCenter) / 2;
    yCenter = (cbp5.yCenter + cbp3.yCenter) / 2;
  } else {
    xCenter = cbp5.xCenter + (radius * Math.cos(angle));
    yCenter = cbp5.yBottom + (radius * Math.sin(angle));
  }

  angle = ur.boundingStem5.angle + Math.PI;
  angle += (2 * Math.PI) * ((ur.boundingStem5.polarWidth / 2) / circumference);
  angle += (2 * Math.PI) * (polarizeLength(0.5) / circumference);

  for (let p = ur.boundingPosition5 + 1; p < ur.boundingPosition3; p++) {
    coordinates.push(new VirtualBaseCoordinates(
      xCenter + (radius * Math.cos(angle)) - 0.5,
      yCenter + (radius * Math.sin(angle)) - 1
    ));

    angle += (2 * Math.PI) * (polarizeLength(1) / circumference);
  }
  
  return coordinates;
}

export default baseCoordinatesHairpin;
