import { Side } from './Side';

/**
 * Converts a side to a motif string. Returns undefined if the text
 * content of any of the bases is not a single character.
 *
 * It is not firmly defined what should be returned for a side that
 * contains no bases.
 */
export function sideToMotif(side: Side): string | undefined {
  if (side.some(base => base.text.text().length != 1)) {
    return undefined;
  } else {
    return side.map(base => base.text.text()).join('');
  }
}
