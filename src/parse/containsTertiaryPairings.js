/**
 * @param {string} dotBracket The dot-bracket notation input by the user.
 * 
 * @returns {boolean} True if any of the characters [ '['|']' | '{'|'}' | '<'|'>' ] are present.
 */
function containsTertiaryPairings(dotBracket) {
  for (let i = 0; i < dotBracket.length; i++) {
    let c = dotBracket.charAt(i);

    if (['[', ']', '{', '}', '<', '>'].includes(c)) {
      return true;
    }
  }

  return false;
}

export default containsTertiaryPairings;
