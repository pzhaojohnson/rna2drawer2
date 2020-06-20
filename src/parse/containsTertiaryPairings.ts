/**
 * Returns true if the given dot-bracket notation contains any
 * of the characters [ '['|']' | '{'|'}' | '<'|'>' ].
 */
function containsTertiaryPairings(dotBracket: string): boolean {
  for (let i = 0; i < dotBracket.length; i++) {
    let c = dotBracket.charAt(i);

    if (['[', ']', '{', '}', '<', '>'].includes(c)) {
      return true;
    }
  }

  return false;
}

export default containsTertiaryPairings;
