import positionIsInStem from '../../../parse/positionIsInStem';
import stemOfPosition from '../../../parse/stemOfPosition';
import unpairedRegionOfPosition from '../../../parse/unpairedRegionOfPosition';

interface UnpairedRegion {
  boundingPosition5: number;
  boundingPosition3: number;
}

function unpairedRegionToStretch5(p: number, partners: [number, null]): (UnpairedRegion | null) {
  if (!p || !partners) {
    return null;
  }
  if (!positionIsInStem(p, partners)) {
    return null;
  }
  let st = stemOfPosition(p, partners);
  let p55 = st.position5 - 1;
  if (p55 > 0 && !partners[p55 - 1]) {
    return unpairedRegionOfPosition(p55, partners);
  }
  return {
    boundingPosition5: p55,
    boundingPosition3: st.position5,
  };
}

export default unpairedRegionToStretch5;
