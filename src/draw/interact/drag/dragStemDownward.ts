import { StrictLayoutSpecification } from './StrictLayoutSpecification';
import { atPosition } from 'Array/at';
import { initializeAtPosition } from 'Draw/strict/layout/PerBaseStrictLayoutProps';

import { Stem } from 'Partners/stems/Stem';
import { bottomPair } from 'Partners/stems/Stem';
import { upstreamPartner } from 'Partners/pairs/Pair';
import { nearestStemEnclosingPosition } from './nearestStemEnclosingPosition';
import { hasTriangleLoop } from './triangleLoops';

export type Options = {

  // the strict layout specification to modify
  strictLayoutSpecification: StrictLayoutSpecification;

  // the stem to drag
  stem: Stem;

  // the amount to drag the stem by
  amount: number;
};

// drags the stem downward in reference to its nearest enclosing stem
// (requires that the stem being dragged be in a triangle loop)
export function dragStemDownward(options: Options) {
  let spec = options.strictLayoutSpecification;
  let stem = options.stem;
  let amount = options.amount;

  let enclosingStem = nearestStemEnclosingPosition(spec.partners, upstreamPartner(bottomPair(stem)));
  if (!enclosingStem) {
    console.error('No stem encloses the given stem.');
    return;
  } else if (!hasTriangleLoop(spec, enclosingStem)) {
    console.error('The given stem is not in a triangle loop.');
    return;
  }

  let p = upstreamPartner(bottomPair(enclosingStem));
  let props = atPosition(spec.perBasePropsArray, p) ?? initializeAtPosition(spec.perBasePropsArray, p);

  props.triangleLoopHeight = Math.max(
    props.triangleLoopHeight - amount,
    1,
  );
}
