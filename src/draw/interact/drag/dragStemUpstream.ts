import { StrictLayoutSpecification } from './StrictLayoutSpecification';

import { Stem } from 'Partners/Stem';

import { upstreamBoundingPosition } from 'Partners/Linker';
import { size as sizeOfLinker } from 'Partners/UnpairedRegion';
import { linkersAreEqual } from 'Partners/linkersAreEqual';

import { leadingLinker as leadingLinkerOfStem } from './neighboringLinkers';
import { trailingLinker as trailingLinkerOfStem } from './neighboringLinkers';
import { lastLinker } from './lastLinker';

import { isFirstLinkerInTriangleLoop } from './triangleLoops';
import { isLastLinkerInTriangleLoop } from './triangleLoops';

import { stretchOfLinker } from './stretchOfLinker';
import { setStretchOfLinker } from './stretchOfLinker';

export type Options = {

  // the strict layout specification to modify
  strictLayoutSpecification: StrictLayoutSpecification;

  // the stem to drag upstream
  stem: Stem;

  // the amount to drag the stem by
  amount: number;

  // whether to condense the leading linker when dragging the stem
  // (the leading linker is condensed if left unspecified)
  condenseLeadingLinker?: boolean;
}

export function dragStemUpstream(options: Options) {
  let spec = options.strictLayoutSpecification;
  let stem = options.stem;
  let amount = options.amount;

  let leadingLinker = leadingLinkerOfStem(spec.partners, stem);
  let trailingLinker = trailingLinkerOfStem(spec.partners, stem);

  // cannot condense a 5' most leading linker of size zero
  if (upstreamBoundingPosition(leadingLinker) == 0 && sizeOfLinker(leadingLinker) == 0) {
    leadingLinker = lastLinker(spec.partners); // so condense the last linker instead
  }

  let shouldCondenseLeadingLinker = (
    (options.condenseLeadingLinker ?? true)
    && !isFirstLinkerInTriangleLoop(spec, leadingLinker)
    && !linkersAreEqual(leadingLinker, trailingLinker)
  );

  if (shouldCondenseLeadingLinker) {
    let stretch = stretchOfLinker(spec, leadingLinker);
    if (stretch > 0) {
      let change = Math.min(stretch, amount);
      stretch -= change;
      amount -= change;
      setStretchOfLinker(spec, leadingLinker, stretch);
    }
  }

  if (!isLastLinkerInTriangleLoop(spec, trailingLinker)) {
    let stretch = stretchOfLinker(spec, trailingLinker);
    stretch += amount;
    amount = 0;
    setStretchOfLinker(spec, trailingLinker, stretch);
  }
}
