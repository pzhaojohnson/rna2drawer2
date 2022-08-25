import type { Partners } from 'Partners/Partners';
import { deepCopyPartners } from 'Partners/Partners';

import { treeify } from 'Partners/treeify';

import { isPaired } from 'Partners/isPaired';
import { unpair } from 'Partners/edit';

/**
 * Splits the partners array into secondary and tertiary partners arrays
 * specifying secondary and tertiary structures for the structure.
 *
 * The secondary structure produced will contain no pseudoknots and will
 * have a tree shape, though the tertiary structure produced may still
 * have pseudoknots.
 */
export function splitSecondaryAndTertiaryPairs(partners: Partners) {
  let secondaryPartners = treeify(deepCopyPartners(partners));

  let tertiaryPartners = deepCopyPartners(partners);
  for (let p = 1; p <= partners.length; p++) {
    if (isPaired(secondaryPartners, p)) {
      unpair(tertiaryPartners, p);
    }
  }

  return {
    secondaryPartners,
    tertiaryPartners,
  };
}
