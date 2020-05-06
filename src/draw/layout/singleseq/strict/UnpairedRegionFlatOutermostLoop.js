import { FlatOutermostLoop } from './StemLayout';

/**
 * @param {UnpairdRegion} ur 
 * @param {StrictLayoutGeneralProps} generalProps 
 * @param {Array<StrictLayoutPerBaseProps>} perBaseProps 
 * 
 * @returns {Array<NormalizedBaseCoordinates>} 
 */
function baseCoordinatesFlatOutermostLoop(ur, generalProps, perBaseProps) {
  return FlatOutermostLoop.traverseUnpairedRegion53(ur, generalProps, perBaseProps);
}

export default baseCoordinatesFlatOutermostLoop;
