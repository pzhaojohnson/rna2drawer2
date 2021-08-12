import { addSavedPrimaryBonds, addSavedSecondaryBonds } from './saved';
import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addPrimaryBond, addSecondaryBond } from './add';
import { savableState } from './save';

function areSameLine(line1, line2) {
  return (
    line1.id() // check that ID is truthy
    && line1.id() == line2.id()
    && line1.svg() // check that SVG string is truthy
    && line1.svg() == line2.svg()
  );
}

function areSameBase(base1, base2) {
  return (
    base1.id // check that ID is truthy
    && base1.id == base2.id
  );
}

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());

  // test with multiple sequences
  appendSequence(drawing, { id: 'ASDF', characters: 'ASDF' });
  appendSequence(drawing, { id: 'qwer', characters: 'qwerqwer' });
  appendSequence(drawing, { id: 'zxcv', characters: 'ZXCVzx' });

  let bases = drawing.bases();
  for (let i = 0; i < bases.length - 1; i++) {
    addPrimaryBond(drawing, bases[i], bases[i + 1]);
  }
  for (let i = 0; i < bases.length; i++) {
    addSecondaryBond(drawing, bases[i], bases[bases.length - i - 1]);
  }
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe.each`
  f                         | arrayName
  ${addSavedPrimaryBonds}   | ${'primaryBonds'}
  ${addSavedSecondaryBonds} | ${'secondaryBonds'}
`('$f', ({ f, arrayName }) => {
  it('finds lines and bases 1 and 2', () => {
    let bonds1 = drawing[arrayName].splice(2, 3);
    let saveds = bonds1.map(bond1 => savableState(bond1));
    let bonds2 = f(drawing, saveds);
    expect(bonds2.length).toBe(bonds1.length);
    bonds1.forEach((bond1, i) => {
      let bond2 = bonds2[i];
      expect(areSameLine(bond1.line, bond2.line)).toBeTruthy();
      expect(areSameBase(bond1.base1, bond2.base1)).toBeTruthy();
      expect(areSameBase(bond1.base2, bond2.base2)).toBeTruthy();
    });
  });

  it('adds recreated bonds to bonds array', () => {
    let bonds1 = drawing[arrayName].splice(1, 3);
    let saveds = bonds1.map(bond1 => savableState(bond1));
    let bonds2 = f(drawing, saveds);
    expect(bonds2.length).toBe(bonds1.length);
    bonds2.forEach(bond2 => {
      expect(drawing[arrayName].includes(bond2)).toBeTruthy();
    });
  });

  it('checks that saved states are for straight bonds', () => {
    let [bond1] = drawing[arrayName].splice(0, 1);
    let saved = savableState(bond1);
    saved.className = 'StraightBnd';
    expect(
      () => f(drawing, [saved])
    ).toThrow();
  });

  it('throws if unable to find line', () => {
    let [bond1] = drawing[arrayName].splice(1, 1);
    let saved = savableState(bond1);
    saved.lineId = 'asdf';
    expect(
      () => f(drawing, [saved])
    ).toThrow();
  });

  it('throws if unable to find base 1', () => {
    let [bond1] = drawing[arrayName].splice(0, 1);
    let saved = savableState(bond1);
    saved.baseId1 = 'asdf';
    expect(
      () => f(drawing, [saved])
    ).toThrow();
  });

  it('throws if unable to find base 2', () => {
    let [bond1] = drawing[arrayName].splice(0, 1);
    let saved = savableState(bond1);
    saved.baseId2 = 'asdf';
    expect(
      () => f(drawing, [saved])
    ).toThrow();
  });
});
