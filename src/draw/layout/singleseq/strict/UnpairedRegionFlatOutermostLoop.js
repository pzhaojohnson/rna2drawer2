import { FlatOutermostLoop } from './StemLayout';

/**
 * @param {UnpairdRegion} ur 
 * @param {Array<StrictLayoutBaseProps>} baseProps 
 * 
 * @returns {Array<VirtualBaseCoordinates>} 
 */
function baseCoordinatesFlatOutermostLoop(ur, baseProps) {
  if (ur.isDangling5()) {
    return FlatOutermostLoop.traverseUnpairedRegion35(ur, baseProps);
  } else {
    return FlatOutermostLoop.traverseUnpairedRegion53(ur, baseProps);
  }
}

export default baseCoordinatesFlatOutermostLoop;
