import type { StrungElement } from 'Draw/bonds/strung/StrungElement';

import { deepCopyPoint2D as deepCopyVector } from 'Math/points/Point';

export function toSpecification(ele: StrungElement) {
  let spec: { [key: string]: unknown } = {};

  spec.type = ele.type;

  if (ele.type == 'StrungText') {
    spec.textId = ele.text.id();
  } else if (ele.type == 'StrungCircle') {
    spec.circleId = ele.circle.id();
  } else {
    spec.pathId = ele.path.id();
  }

  // allows for variable property access
  let entries: { [key: string]: unknown } = ele;
  [
    'width',
    'height',
    'tailsHeight',
    'borderRadius',
    'rotation',
    'displacementFromCenter',
  ].forEach(key => {
    if (key in entries) {
      spec[key] = entries[key];
    }
  });

  spec.displacementFromCurve = deepCopyVector(ele.displacementFromCurve);

  return spec;
}

export function toSpecifications(eles: StrungElement[]) {
  return eles.map(ele => toSpecification(ele));
}
