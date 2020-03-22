import { FlatOutermostLoop } from './StemLayout';

/**
 * @param {UnpairdRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * @param {Array<StrictLayoutBaseProps>} baseProps 
 * 
 * @returns {Array<VirtualBaseCoordinates>} 
 */
function baseCoordinatesFlatOutermostLoop(ur, generalProps, baseProps) {
  return FlatOutermostLoop.traverseUnpairedRegion53(ur, generalProps, baseProps);
}

export default baseCoordinatesFlatOutermostLoop;
