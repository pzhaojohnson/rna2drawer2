import { FlatOutermostLoop } from './StemLayout';

/**
 * @param {UnpairdRegion} ur 
 * @param {GeneralStrictLayoutProps} generalProps 
 * @param {Array<PerBaseStrictLayoutProps>} perBaseProps 
 * 
 * @returns {Array<NormalizedBaseCoordinates>} 
 */
function baseCoordinatesFlatOutermostLoop(ur, generalProps, perBaseProps) {
  return FlatOutermostLoop.traverseUnpairedRegion53(ur, generalProps, perBaseProps);
}

export default baseCoordinatesFlatOutermostLoop;
