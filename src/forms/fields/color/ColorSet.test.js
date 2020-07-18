import ColorSet from './ColorSet';

it('is case insensitive', () => {
  let cs = new ColorSet([
    '#aabbcc',
    '#112233',
    '#aABbcc', // an uppercase duplicate
    '#6654aa',
    '#7709B1',
    '#6654aa', // a same case duplicate
    '#112300',
    '#aafdc1',
    '#7709b1', // a lowercase duplicate
    '#FEDBCA',
  ]);
  expect(cs.toArray().toString()).toBe([
    '#aabbcc',
    '#112233',
    '#6654aa',
    '#7709b1',
    '#112300',
    '#aafdc1',
    '#fedbca',
  ].toString());
});

it('size getter', () => {
  let cs1 = new ColorSet(['#aabbcc', '#123456', '#bbcc12']);
  expect(cs1.size).toBe(3);

  // has a duplicate
  let cs2 = new ColorSet(['#AB3321', '#5561aa', '#ddf321', '#5561AA', '#aaffee']);
  expect(cs2.size).toBe(4);
});

it('has method', () => {
  let cs = new ColorSet([
    '#123456',
    '#226612',
    '#bbcadd',
    '#GCA12F',
    '#cc3345',
    '#56bca1',
  ]);
  expect(cs.has('#654321')).toBeFalsy(); // does not have
  expect(cs.has('#226612')).toBeTruthy(); // all numbers
  expect(cs.has('#BBCADD')).toBeTruthy(); // must be decapitalized
  expect(cs.has('#gca12f')).toBeTruthy(); // must be capitalized
  expect(cs.has('#cc3345')).toBeTruthy(); // same case
});
