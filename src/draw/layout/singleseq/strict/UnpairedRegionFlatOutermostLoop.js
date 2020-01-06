import { FlatOutermostLoop } from './StemLayout';

/**
 * @param {UnpairdRegion} ur 
 * @param {Array<StrictLayoutBaseProps>} baseProps The base properties of the layout.
 * 
 * @returns {Array<VirtualBaseCoordinates>} The base coordinates of all positions in the given unpaired region
 *  as part of a flat outermost loop.
 */
function baseCoordinatesFlatOutermostLoop(ur, baseProps) {
  if (ur.isDangling5()) {
    return FlatOutermostLoop.traverseUnpairedRegion35(ur, baseProps);
  } else {
    return FlatOutermostLoop.traverseUnpairedRegion53(ur, baseProps);
  }
}

export default baseCoordinatesFlatOutermostLoop;
