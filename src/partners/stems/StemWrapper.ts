import type { Stem } from 'Partners/Stem';
import { PairWrapper } from 'Partners/pairs/PairWrapper';

import { bottomPair } from 'Partners/Stem';
import { topPair } from 'Partners/Stem';

export class StemWrapper {
  /**
   * The wrapped stem.
   */
  readonly stem: Stem;

  constructor(stem: Stem) {
    this.stem = stem;
  }

  bottomPair(): PairWrapper {
    return new PairWrapper(bottomPair(this.stem));
  }

  topPair(): PairWrapper {
    return new PairWrapper(topPair(this.stem));
  }

  get numPairs() {
    return this.stem.size;
  }
}
