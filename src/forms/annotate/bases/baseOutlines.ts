import { BaseInterface as Base } from '../../../draw/BaseInterface';
import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from 'Draw/bases/annotate/circle/CircleBaseAnnotationInterface';

export function baseOutlines(bs: Base[]): CircleBaseAnnotation[] {
  let outlines = [] as CircleBaseAnnotation[];
  bs.forEach(b => {
    if (b.outline) {
      outlines.push(b.outline);
    }
  });
  return outlines;
}

export default baseOutlines;
