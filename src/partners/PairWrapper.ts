import type { Pair } from 'Partners/Pair';
import { upstreamPartner } from 'Partners/Pair';
import { downstreamPartner } from 'Partners/Pair';
import { pairsAreEqual } from 'Partners/pairsAreEqual';

export class PairWrapper {
  /**
   * The wrapped pair.
   */
  readonly pair: Pair;

  constructor(pair: Pair) {
    this.pair = pair;
  }

  get upstreamPartner() {
    return upstreamPartner(this.pair);
  }

  get downstreamPartner() {
    return downstreamPartner(this.pair);
  }

  equals(other: Pair) {
    return pairsAreEqual(this.pair, other);
  }
}

export {
  PairWrapper as Pair,
};
