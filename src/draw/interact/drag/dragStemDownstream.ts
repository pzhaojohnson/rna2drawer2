import { StrictLayoutSpecification } from './StrictLayoutSpecification';

import { Stem } from 'Partners/stems/Stem';

import { upstreamBoundingPosition } from 'Partners/linkers/Linker';
import { numPositionsInLinker as sizeOfLinker } from 'Partners/linkers/Linker';
import { linkersAreEqual } from 'Partners/linkers/linkersAreEqual';

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

  // the stem to drag downstream
  stem: Stem;

  // the amount to drag the stem by
  amount: number;

  // whether to condense the trailing linker when dragging the stem
  // (the trailing linker is condensed if left unspecified)
  condenseTrailingLinker?: boolean;
}

export function dragStemDownstream(options: Options) {
  let spec = options.strictLayoutSpecification;
  let stem = options.stem;
  let amount = options.amount;

  let leadingLinker = leadingLinkerOfStem(spec.partners, stem);
  let trailingLinker = trailingLinkerOfStem(spec.partners, stem);

  // it is not possible to expand a 5' most leading linker of size zero
  if (upstreamBoundingPosition(leadingLinker) == 0 && sizeOfLinker(leadingLinker) == 0) {
    leadingLinker = lastLinker(spec.partners); // so expand the last linker instead
  }

  let shouldCondenseTrailingLinker = (
    (options.condenseTrailingLinker ?? true)
    && !isLastLinkerInTriangleLoop(spec, trailingLinker)
  );

  if (shouldCondenseTrailingLinker) {
    let stretch = stretchOfLinker(spec, trailingLinker);
    if (stretch > 0) {
      let change = Math.min(stretch, amount);
      stretch -= change;
      amount -= change;
      setStretchOfLinker(spec, trailingLinker, stretch);
    }
  }

  let shouldExpandLeadingLinker = (
    !isFirstLinkerInTriangleLoop(spec, leadingLinker)
    && !linkersAreEqual(leadingLinker, trailingLinker)
  );

  if (shouldExpandLeadingLinker) {
    let stretch = stretchOfLinker(spec, leadingLinker);
    stretch += amount;
    amount = 0;
    setStretchOfLinker(spec, leadingLinker, stretch);
  }
}
