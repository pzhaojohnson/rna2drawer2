import type { Stem } from 'Partners/Stem';
import { PairWrapper } from 'Partners/pairs/PairWrapper';

import { pairs as pairsInStem } from 'Partners/Stem';
import { bottomPair } from 'Partners/Stem';
import { topPair } from 'Partners/Stem';

import { upstreamSideOfStem } from 'Partners/upstreamSideOfStem';
import { downstreamSideOfStem } from 'Partners/downstreamSideOfStem';

import { stemsAreEqual } from 'Partners/stemsAreEqual';

import { contains as stemContainsPosition } from 'Partners/Stem';
import { stemEnclosesPosition } from 'Partners/stemEnclosesPosition';

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
