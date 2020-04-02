import {
  parseDotBracket,
  hasUnmatchedUpPartner,
  hasUnmatchedDownPartner,
  _isDotBracketChar,
  _removeNonDotBracketChars,
  _isUpChar,
  _isDownChar,
  _isTertiaryChar,
  _correspondingUpChar,
  _traverseDotBracket,
} from './parseDotBracket';
import validatePartners from './validatePartners';

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

let validCases = [

  // empty
  {
    dotBracket: '',
    secondaryPartners: [],
    tertiaryPartners: [],
  },

  // unstructured
  {
    dotBracket: '....',
    secondaryPartners: [null, null, null, null],
    tertiaryPartners: [null, null, null, null],
  },

  // a hairpin
  {
    dotBracket: '((((....))))',
    secondaryPartners: [12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1],
    tertiaryPartners: unstructuredPartners(12),
  },

  // an internal loop
  {
    dotBracket: '.(((..((...))))).',
    secondaryPartners: [null, 16, 15, 14, null, null, 13, 12, null, null, null, 8, 7, 4, 3, 2, null],
    tertiaryPartners: unstructuredPartners(17),
  },

  // a multibranch loop
  {
    dotBracket: '((..(((..)))..((....)))).',
    secondaryPartners: [24, 23, null, null, 12, 11, 10, null, null, 7, 6, 5, null, null, 22, 21, null, null, null, null, 16, 15, 2, 1, null],
    tertiaryPartners: unstructuredPartners(25),
  },

  // pseudoknots
  {
    dotBracket: '((([[[)))]]]',
    secondaryPartners: [9, 8, 7, null, null, null, 3, 2, 1, null, null, null],
    tertiaryPartners: [null, null, null, 12, 11, 10, null, null, null, 6, 5, 4],
  },
  {
    dotBracket: '((({{{)))}}}',
    secondaryPartners: [9, 8, 7, null, null, null, 3, 2, 1, null, null, null],
    tertiaryPartners: [null, null, null, 12, 11, 10, null, null, null, 6, 5, 4],
  },
  {
    dotBracket: '(((<<<)))>>>',
    secondaryPartners: [9, 8, 7, null, null, null, 3, 2, 1, null, null, null],
    tertiaryPartners: [null, null, null, 12, 11, 10, null, null, null, 6, 5, 4],
  },

  // knotted pseudoknots
  {
    dotBracket: '(((.[[[.))).{{{.]]].}}}.',
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },
  {
    dotBracket: '(((.[[[.))).<<<.]]].>>>.',
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },
  {
    dotBracket: '(((.<<<.))).{{{.>>>.}}}.',
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },

  // ignore whitespace
  {
    dotBracket: ' ((\t\t((. \n\r\t ..\t.))))',
    secondaryPartners: [12, 11, 10, 9, null, null, null, null, 4, 3, 2, 1],
    tertiaryPartners: unstructuredPartners(12),
  },
  {
    dotBracket: '(((.  \t\t<<<\r\n  \r.))).{{{.\t\t>>>.}}}.',
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },

  // ignore non-dot-bracket characters
  {
    dotBracket: '.  #$%^&(((.queyweytqi.((...kon!@#))))).',
    secondaryPartners: [null, 16, 15, 14, null, null, 13, 12, null, null, null, 8, 7, 4, 3, 2, null],
    tertiaryPartners: unstructuredPartners(17),
  },
  {
    dotBracket: '(((.<<aa<.))weofk).{{{!@#$%.>>>.}}}.',
    secondaryPartners: [11, 10, 9, null, null, null, null, null, 3, 2, 1, null, null, null, null, null, null, null, null, null, null, null, null, null],
    tertiaryPartners: [null, null, null, null, 19, 18, 17, null, null, null, null, null, 23, 22, 21, null, 7, 6, 5, null, 15, 14, 13, null],
  },
];

let unmatchedPartnersCases = [
  
  // unmatched downstream partners
  { dotBracket: '((((....)))))' },
  { dotBracket: '((((....))))}' },
  { dotBracket: '(<((....))>))' },
  { dotBracket: '((..(((..))))..((....)))).' },
  { dotBracket: '((..(((..)))]..((....)))).' },
  { dotBracket: '(({[(((}.)))..((]]..)))).' },

  // unmatched upstream partners
  { dotBracket: '(((((....))))' },
  { dotBracket: '<((((....))))' },
  { dotBracket: '((..(((..)))..(((....)))).' },
  { dotBracket: '([..(((..)))..(((....)))).' },
];

it('valid cases', () => {
  validCases.forEach(cs => {
    let parsed = parseDotBracket(cs.dotBracket);

    // validate manually typed in partners notation
    validatePartners(cs.secondaryPartners);
    validatePartners(cs.tertiaryPartners);
    expect(cs.tertiaryPartners.length).toBe(cs.secondaryPartners.length);

    for (let p = 1; p <= cs.secondaryPartners.length; p++) {
      expect(parsed.secondaryPartners[p - 1]).toBe(cs.secondaryPartners[p - 1]);
      expect(parsed.tertiaryPartners[p - 1]).toBe(cs.tertiaryPartners[p - 1]);
    }
  });
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
  expect(parsed.secondaryPartners.length).toBe(traversed.secondaryPartners.length);
  expect(parsed.tertiaryPartners.length).toBe(traversed.tertiaryPartners.length);
  expect(parsed.secondaryPartners.length).toBe(parsed.tertiaryPartners.length);
  for (let i = 0; i < traversed.secondaryPartners.length; i++) {
    expect(parsed.secondaryPartners[i]).toBe(traversed.secondaryPartners[i]);
    expect(parsed.tertiaryPartners[i]).toBe(traversed.tertiaryPartners[i]);
  }
});

it('unmatched partners cases', () => {
  unmatchedPartnersCases.forEach(cs => {
    expect(parseDotBracket(cs.dotBracket)).toBe(null);
  });
});

it('hasUnmatchedUpPartner - true case', () => {
  expect(hasUnmatchedUpPartner('((((...)))')).toBeTruthy();
});

it('hasUnmatchedUpPartner - false case', () => {
  expect(hasUnmatchedUpPartner('(((...)))')).toBeFalsy();
});

it('hasUnmatchedDownPartner - true case', () => {
  expect(hasUnmatchedDownPartner('(((...))))')).toBeTruthy();
});

it('hasUnmatchedDownPartner - false case', () => {
  expect(hasUnmatchedDownPartner('(((...)))')).toBeFalsy();
});
