import unpairedRegionOfPosition from './unpairedRegionOfPosition';

function positionIsInUnpairedRegion(p: number, partners: [number, null]): boolean {
  if (unpairedRegionOfPosition(p, partners)) {
    return true;
  }
  return false;
}

export default positionIsInUnpairedRegion;
