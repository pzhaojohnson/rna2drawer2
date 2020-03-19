import { FlatOutermostLoop } from './StemLayout';

/**
 * @param {UnpairdRegion} ur 
 * @param {Array<StrictLayoutBaseProps>} baseProps 
 * 
 * @returns {Array<VirtualBaseCoordinates>} 
 */
function baseCoordinatesFlatOutermostLoop(ur, baseProps) {
  return FlatOutermostLoop.traverseUnpairedRegion53(ur, baseProps);
}

export default baseCoordinatesFlatOutermostLoop;
