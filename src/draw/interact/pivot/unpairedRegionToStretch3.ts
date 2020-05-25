import positionIsInStem from '../../../parse/positionIsInStem';
import stemOfPosition from '../../../parse/stemOfPosition';
import unpairedRegionOfPosition from '../../../parse/unpairedRegionOfPosition';

interface UnpairedRegion {
  boundingPosition5: number;
  boundingPosition3: number;
}

function unpairedRegionToStretch3(p: number, partners: [number, null]): (UnpairedRegion | null) {
  if (!p || !partners) {
    return null;
  }
  if (!positionIsInStem(p, partners)) {
    return null;
  }
  let st = stemOfPosition(p, partners);
  let p33 = st.position3 + 1;
  if (p33 <= partners.length && !partners[p33 - 1]) {
    return unpairedRegionOfPosition(p33, partners);
  }
  return {
    boundingPosition5: st.position3,
    boundingPosition3: p33,
  };
}

export default unpairedRegionToStretch3;
