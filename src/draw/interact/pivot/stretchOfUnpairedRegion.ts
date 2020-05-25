interface UnpairedRegion {
  boundingPosition5: number;
  boundingPosition3: number;
}

interface PerBaseProps {
  stretch3: number;
}

function stretchOfUnpairedRegion(ur: UnpairedRegion, perBaseProps: [PerBaseProps]): number {
  let s = 0;
  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
    if (p > 0) {
      let props = perBaseProps[p - 1];
      if (props) {
        s += props.stretch3;
      }
    }
  }
  return s;
}

export default stretchOfUnpairedRegion;
