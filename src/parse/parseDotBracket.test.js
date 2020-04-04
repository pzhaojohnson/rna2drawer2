import {
  parseDotBracket,
  hasUnmatchedUpPartner,
  lastUnmatchedUpPartner,
  hasUnmatchedDownPartner,
  lastUnmatchedDownPartner,
  _isDotBracketChar,
  _removeNonDotBracketChars,
  _isUpChar,
  _isDownChar,
  _isTertiaryChar,
  _correspondingUpChar,
  _traverseDotBracket,
} from './parseDotBracket';

it('_isDotBracketChar', () => {
  ['.', '(', ')', '[', ']', '{', '}', '<', '>'].forEach(c => {
    expect(_isDotBracketChar(c)).toBeTruthy();
  });
  [' ', 'a', 'asdf', '\t', 'q'].forEach(c => {
    expect(_isDotBracketChar(c)).toBeFalsy();
  });
});

it('_removeNonDotBracketChars - empty string', () => {
  expect(_removeNonDotBracketChars('')).toBe('');
});

it('_removeNonDotBracketChars - nothing to remove', () => {
  expect(_removeNonDotBracketChars('(((...)))')).toBe('(((...)))');
});

it('_removeNonDotBracketChars - removes correct characters', () => {
  expect(
    _removeNonDotBracketChars('.. \t\n ..aasd((/))[<>\n]q')
  ).toBe('....(())[<>]');
});

it('_isUpChar', () => {
  ['(', '[', '{', '<'].forEach(c => {
    expect(_isUpChar(c)).toBeTruthy();
  });
  ['.', ')', ']', '}', '>'].forEach(c => {
    expect(_isUpChar(c)).toBeFalsy();
  });
});

it('_isDownChar', () => {
  [')', ']', '}', '>'].forEach(c => {
    expect(_isDownChar(c)).toBeTruthy();
  });
  ['.', '(', '[', '{', '<'].forEach(c => {
    expect(_isDownChar(c)).toBeFalsy();
  });
});

it('_isTertiaryChar', () => {
  ['[', ']', '{', '}', '<', '>'].forEach(c => {
    expect(_isTertiaryChar(c)).toBeTruthy();
  });
  ['.', '(', ')'].forEach(c => {
    expect(_isTertiaryChar(c)).toBeFalsy();
  });
});

it('_correspondingUpChar', () => {
  expect(_correspondingUpChar(')')).toBe('(');
  expect(_correspondingUpChar(']')).toBe('[');
  expect(_correspondingUpChar('}')).toBe('{');
  expect(_correspondingUpChar('>')).toBe('<');
});

function unstructuredPartners(length) {
  let partners = [];
  for (let i = 0; i < length; i++) {
    partners.push(null);
  }
  return partners;
}

function checkPartners(partners, expectedPartners) {
  expect(partners.length).toBe(expectedPartners.length);
  for (let i = 0; i < expectedPartners.length; i++) {
    expect(partners[i]).toBe(expectedPartners[i]);
  }
}

it('_traverseDotBracket - empty string', () => {
  let traversed = _traverseDotBracket('');
  expect(traversed.secondaryPartners.length).toBe(0);
  expect(traversed.tertiaryPartners.length).toBe(0);
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - ignores non-dot-bracket characters', () => {
  let traversed = _traverseDotBracket('( ((.<<aa<.))weo\t\n  fk).{{{!@#  \n$%.\r\n>>>.}}}.');
  checkPartners(
    traversed.secondaryPartners,
    [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
  );
  checkPartners(
    traversed.tertiaryPartners,
    [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - unstructured', () => {
  let traversed = _traverseDotBracket('....');
  checkPartners(
    traversed.secondaryPartners,
    [null, null, null, null],
  );
  checkPartners(
    traversed.tertiaryPartners,
    [null, null, null, null],
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - secondary hairpin', () => {
  let traversed = _traverseDotBracket('(((...)))');
  checkPartners(
    traversed.secondaryPartners,
    [9, 8, 7, null, null, null, 3, 2, 1],
  );
  checkPartners(
    traversed.tertiaryPartners,
    unstructuredPartners(9),
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - tertiary hairpin with square brackets', () => {
  let traversed = _traverseDotBracket('[[[...]]]');
  checkPartners(
    traversed.secondaryPartners,
    unstructuredPartners(9),
  );
  checkPartners(
    traversed.tertiaryPartners,
    [9, 8, 7, null, null, null, 3, 2, 1],
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - tertiary hairpin with curly brackets', () => {
  let traversed = _traverseDotBracket('{{{...}}}');
  checkPartners(
    traversed.secondaryPartners,
    unstructuredPartners(9),
  );
  checkPartners(
    traversed.tertiaryPartners,
    [9, 8, 7, null, null, null, 3, 2, 1],
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - tertiary hairpin with angle brackets', () => {
  let traversed = _traverseDotBracket('<<<...>>>');
  checkPartners(
    traversed.secondaryPartners,
    unstructuredPartners(9),
  );
  checkPartners(
    traversed.tertiaryPartners,
    [9, 8, 7, null, null, null, 3, 2, 1],
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - hairpin with empty loop', () => {
  let traversed = _traverseDotBracket('((()))');
  checkPartners(
    traversed.secondaryPartners,
    [6, 5, 4, 3, 2, 1],
  );
  checkPartners(
    traversed.tertiaryPartners,
    unstructuredPartners(6),
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - an internal loop', () => {
  let traversed = _traverseDotBracket('.(((..((...))))).');
  checkPartners(
    traversed.secondaryPartners,
    [null, 16, 15, 14, null, null, 13, 12, null, null, null, 8, 7, 4, 3, 2, null],
  );
  checkPartners(
    traversed.tertiaryPartners,
    unstructuredPartners(17),
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - a multibranch loop', () => {
  let traversed = _traverseDotBracket('((..(((..)))..((....)))).');
  checkPartners(
    traversed.secondaryPartners,
    [24, 23, null, null, 12, 11, 10, null, null, 7, 6, 5, null, null, 22, 21, null, null, null, null, 16, 15, 2, 1, null],
  );
  checkPartners(
    traversed.tertiaryPartners,
    unstructuredPartners(25),
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - a pseudoknot', () => {
  let traversed = _traverseDotBracket('((([[[)))]]]');
  checkPartners(
    traversed.secondaryPartners,
    [9, 8, 7, null, null, null, 3, 2, 1, null, null, null],
  );
  checkPartners(
    traversed.tertiaryPartners,
    [null, null, null, 12, 11, 10, null, null, null, 6, 5, 4],
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - knotted pseudoknots', () => {
  let traversed = _traverseDotBracket('(((.[[[.))).<<<.]]].>>>.');
  checkPartners(
    traversed.secondaryPartners,
    [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
  );
  checkPartners(
    traversed.tertiaryPartners,
    [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - more knotted pseudoknots', () => {
  let traversed = _traverseDotBracket('(((.<<<.))).{{{.>>>.}}}.');
  checkPartners(
    traversed.secondaryPartners,
    [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
  );
  checkPartners(
    traversed.tertiaryPartners,
    [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  );
  expect(traversed.lastUnmatchedUpPartner).toBe(null);
  expect(traversed.lastUnmatchedDownPartner).toBe(null);
});

it('_traverseDotBracket - unmatched (', () => {
  let traversed = _traverseDotBracket('(((((....))))');
  expect(traversed.lastUnmatchedUpPartner).toBe('(');
});

it('_traverseDotBracket - unmatched [', () => {
  let traversed = _traverseDotBracket('([..(((..)))..(((....)))).');
  expect(traversed.lastUnmatchedUpPartner).toBe('[');
});

it('_traverseDotBracket - unmatched {', () => {
  let traversed = _traverseDotBracket('(({..))');
  expect(traversed.lastUnmatchedUpPartner).toBe('{');
});

it('_traverseDotBracket - unmatched <', () => {
  let traversed = _traverseDotBracket('(((..<((..))..)))');
  expect(traversed.lastUnmatchedUpPartner).toBe('<');
});

it('_traverseDotBracket - unmatched )', () => {
  let traversed = _traverseDotBracket('((((....)))))');
  expect(traversed.lastUnmatchedDownPartner).toBe(')');
});

it('_traverseDotBracket - unmatched ]', () => {
  let traversed = _traverseDotBracket('((..(((..)))]..((....)))).');
  expect(traversed.lastUnmatchedDownPartner).toBe(']');
});

it('_traverseDotBracket - unmatched }', () => {
  let traversed = _traverseDotBracket('((((....))))}');
  expect(traversed.lastUnmatchedDownPartner).toBe('}');
});

it('_traverseDotBracket - unmatched >', () => {
  let traversed = _traverseDotBracket('((((.....))>))');
  expect(traversed.lastUnmatchedDownPartner).toBe('>');
});

it('parseDotBracket - unmatched upstream partner', () => {
  expect(parseDotBracket('(((...))...')).toBe(null);
});

it('parseDotBracket - unmatched downstream partner', () => {
  expect(parseDotBracket('...((....)))..')).toBe(null);
});

it('parseDotBracket - valid dot-bracket notation', () => {
  let dotBracket = '..(((.[[[..)))..]]]..';
  let parsed = parseDotBracket(dotBracket);
  let traversed = _traverseDotBracket(dotBracket);
  checkPartners(parsed.secondaryPartners, traversed.secondaryPartners);
  checkPartners(parsed.tertiaryPartners, traversed.tertiaryPartners);
});

it('hasUnmatchedUpPartner - true case', () => {
  expect(hasUnmatchedUpPartner('((((...)))')).toBeTruthy();
});

it('hasUnmatchedUpPartner - false case', () => {
  expect(hasUnmatchedUpPartner('(((...)))')).toBeFalsy();
});

it('lastUnmatchedUpPartner - no unmatched upstream partners', () => {
  expect(lastUnmatchedUpPartner('.....')).toBe(null);
});

it('lastUnmatchedUpPartner - unmatched (', () => {
  expect(lastUnmatchedUpPartner('.((((...)))')).toBe('(');
});

it('hasUnmatchedDownPartner - true case', () => {
  expect(hasUnmatchedDownPartner('(((...))))')).toBeTruthy();
});

it('hasUnmatchedDownPartner - false case', () => {
  expect(hasUnmatchedDownPartner('(((...)))')).toBeFalsy();
});

it('lastUnmatchedDownPartner - no unmatched downstream partners', () => {
  expect(lastUnmatchedDownPartner('..(((...))).')).toBe(null);
});

it('lastUnmatchedDownPartner - unmatched ]', () => {
  expect(lastUnmatchedDownPartner('<<<..>>>]')).toBe(']');
});
