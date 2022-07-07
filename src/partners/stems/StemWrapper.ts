import type { Stem } from 'Partners/stems/Stem';
import { PairWrapper } from 'Partners/pairs/PairWrapper';

import { pairsInStem } from 'Partners/stems/Stem';
import { bottomPair } from 'Partners/stems/Stem';
import { topPair } from 'Partners/stems/Stem';

import { upstreamSideOfStem } from 'Partners/stems/upstreamSideOfStem';
import { downstreamSideOfStem } from 'Partners/stems/downstreamSideOfStem';

import { stemsAreEqual } from 'Partners/stems/stemsAreEqual';

import { stemContainsPosition } from 'Partners/stems/stemContainsPosition';
import { stemEnclosesPosition } from 'Partners/stems/stemEnclosesPosition';

export class StemWrapper {
  /**
   * The wrapped stem.
   */
  readonly stem: Stem;

  constructor(stem: Stem) {
    this.stem = stem;
  }

  pairs(): PairWrapper[] {
    let pairs = pairsInStem(this.stem);
    return pairs.map(pair => new PairWrapper(pair));
  }

  get numPairs() {
    return this.stem.size;
  }

  bottomPair(): PairWrapper {
    return new PairWrapper(bottomPair(this.stem));
  }

  topPair(): PairWrapper {
    return new PairWrapper(topPair(this.stem));
  }

  upstreamSide() {
    return upstreamSideOfStem(this.stem);
  }

  downstreamSide() {
    return downstreamSideOfStem(this.stem);
  }

  equals(other: Stem | StemWrapper) {
    let otherStem = other instanceof StemWrapper ? other.stem : other;
    return stemsAreEqual(this.stem, otherStem);
  }

  containsPosition(p: number) {
    return stemContainsPosition(this.stem, p);
  }

  enclosesPosition(p: number) {
    return stemEnclosesPosition(this.stem, p);
  }
}

export {
  StemWrapper as Stem,
};
