import { addSavedTertiaryBond } from './saved';
import Drawing from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { addTertiaryBond } from './add';
import { savableState } from './save';

function areSamePath(path1, path2) {
  return (
    path1.id() // check that ID is truthy
    && path1.id() == path2.id()
    && path1.svg() // check that SVG string is truthy
    && path1.svg() == path2.svg()
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
  drawing.appendSequenceOutOfView('QWER', 'QWERQWER');
  drawing.appendSequenceOutOfView('1234', '123456');
  drawing.appendSequenceOutOfView('zzzz', 'zzzzzzzzzzzzzz');

  [
    [1, 2],
    [12, 2],
    [16, 14],
    [8, 19],
    [17, 13],
    [12, 3],
    [18, 14],
    [7, 11],
  ].forEach(bis => {
    let base1 = drawing.bases()[bis[0]];
    let base2 = drawing.bases()[bis[1]];
    addTertiaryBond(drawing, base1, base2);
  });
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('addSavedTertiaryBond function', () => {
  it('finds path and bases 1 and 2', () => {
    let [tb1] = drawing.tertiaryBonds.splice(3, 1);
    expect(tb1).toBeTruthy();
    let saved = savableState(tb1);
    let tb2 = addSavedTertiaryBond(drawing, saved);
    expect(areSamePath(tb1.path, tb2.path)).toBeTruthy();
    expect(areSameBase(tb1.base1, tb2.base1)).toBeTruthy();
    expect(areSameBase(tb1.base2, tb2.base2)).toBeTruthy();
  });

  it('adds bond to tertiary bonds array', () => {
    let [tb1] = drawing.tertiaryBonds.splice(2, 1);
    expect(tb1).toBeTruthy();
    let saved = savableState(tb1);
    let tb2 = addSavedTertiaryBond(drawing, saved);
    expect(drawing.tertiaryBonds.includes(tb2)).toBeTruthy();
  });

  it('checks that saved state is for a quadratic bezier bond', () => {
    let [tb] = drawing.tertiaryBonds.splice(3, 1);
    expect(tb).toBeTruthy();
    let saved = savableState(tb);
    saved.className = 'QuadraticBezierBonde';
    expect(
      () => addSavedTertiaryBond(drawing, saved)
    ).toThrow();
  });

  it('throws if unable to find path', () => {
    let [tb] = drawing.tertiaryBonds.splice(1, 1);
    expect(tb).toBeTruthy();
    let saved = savableState(tb);
    saved.pathId = 'asdf';
    expect(
      () => addSavedTertiaryBond(drawing, saved)
    ).toThrow();
  });

  it('throws if unable to find base 1', () => {
    let [tb] = drawing.tertiaryBonds.splice(0, 1);
    expect(tb).toBeTruthy();
    let saved = savableState(tb);
    saved.baseId1 = 'qwer';
    expect(
      () => addSavedTertiaryBond(drawing, saved)
    ).toThrow();
  });

  it('throws if unable to find base 2', () => {
    let [tb] = drawing.tertiaryBonds.splice(2, 1);
    expect(tb).toBeTruthy();
    let saved = savableState(tb);
    saved.baseId2 = 'zxcv';
    expect(
      () => addSavedTertiaryBond(drawing, saved)
    ).toThrow();
  });
});
