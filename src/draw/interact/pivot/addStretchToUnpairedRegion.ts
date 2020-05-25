interface UnpairedRegion {
  boundingPosition5: number;
  boundingPosition3: number;
}

interface PerBaseProps {
  stretch3: number;
}

function addStretchToUnpairedRegion(
  stretch: number,
  ur: UnpairedRegion,
  perBaseProps: [PerBaseProps],
) {
  let size = ur.boundingPosition3 - ur.boundingPosition5;
  if (ur.boundingPosition5 == 0) {
    size--;
  }
  if (size == 0) {
    return;
  }
  let s3 = stretch / size;
  for (let p = ur.boundingPosition5; p < ur.boundingPosition3; p++) {
    if (p > 0) {
      let props = perBaseProps[p - 1];
      if (props) {
        props.stretch3 += s3;
      }
    }
  }
}

export default addStretchToUnpairedRegion;
