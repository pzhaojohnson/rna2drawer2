import { addSavedTertiaryBonds } from './saved';
import { Drawing } from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { appendSequence } from 'Draw/sequences/add/sequence';
import { addTertiaryBond } from './add';
import { savableState } from './save';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle } from 'Draw/bonds/strung/create';
import { addStrungElementToBond } from 'Draw/bonds/strung/addToBond';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

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

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(container);

  // test with multiple sequences
  appendSequence(drawing, { id: 'QWER', characters: 'QWERQWER' });
  appendSequence(drawing, { id: '1234', characters: '123456' });
  appendSequence(drawing, { id: 'zzzz', characters: 'zzzzzzzzzzzzzz' });

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

describe('addSavedTertiaryBonds function', () => {
  it('finds paths and bases 1 and 2', () => {
    let tbs1 = drawing.tertiaryBonds.splice(2, 3);
    let saveds = tbs1.map(tb1 => savableState(tb1));
    let tbs2 = addSavedTertiaryBonds(drawing, saveds);
    expect(tbs2.length).toBe(tbs1.length);
    tbs1.forEach((tb1, i) => {
      let tb2 = tbs2[i];
      expect(areSamePath(tb1.path, tb2.path)).toBeTruthy();
      expect(areSameBase(tb1.base1, tb2.base1)).toBeTruthy();
      expect(areSameBase(tb1.base2, tb2.base2)).toBeTruthy();
    });
  });

  it('recreates saved strung elements', () => {
    let [tb1] = drawing.tertiaryBonds.splice(0, 1);
    let curve = curveOfBond(tb1);
    let curveLength = curveLengthOfBond(tb1);
    let strungText = createStrungText({ text: 'A', curve, curveLength });
    let strungCircle = createStrungCircle({ curve, curveLength });
    addStrungElementToBond({ bond: tb1, strungElement: strungText });
    addStrungElementToBond({ bond: tb1, strungElement: strungCircle });
    let saved = savableState(tb1);
    let [tb2] = addSavedTertiaryBonds(drawing, [saved]);
    // recreated the strung elements
    expect(tb2.strungElements).toEqual([strungText, strungCircle]);
  });

  it('adds recreated bonds to tertiary bonds array', () => {
    let tbs1 = drawing.tertiaryBonds.splice(1, 3);
    let saveds = tbs1.map(tb1 => savableState(tb1));
    let tbs2 = addSavedTertiaryBonds(drawing, saveds);
    expect(tbs2.length).toBe(tbs1.length);
    tbs2.forEach(tb2 => {
      expect(drawing.tertiaryBonds.includes(tb2)).toBeTruthy();
    });
  });

  it('checks that saved states are for quadratic bezier bonds', () => {
    let [tb] = drawing.tertiaryBonds.splice(3, 1);
    let saved = savableState(tb);
    saved.className = 'QuadraticBezierBonde';
    expect(
      () => addSavedTertiaryBonds(drawing, [saved])
    ).toThrow();
  });

  it('throws if unable to find path', () => {
    let [tb] = drawing.tertiaryBonds.splice(1, 1);
    let saved = savableState(tb);
    saved.pathId = 'asdf';
    expect(
      () => addSavedTertiaryBonds(drawing, [saved])
    ).toThrow();
  });

  it('throws if unable to find base 1', () => {
    let [tb] = drawing.tertiaryBonds.splice(0, 1);
    let saved = savableState(tb);
    saved.baseId1 = 'qwer';
    expect(
      () => addSavedTertiaryBonds(drawing, [saved])
    ).toThrow();
  });

  it('throws if unable to find base 2', () => {
    let [tb] = drawing.tertiaryBonds.splice(2, 1);
    let saved = savableState(tb);
    saved.baseId2 = 'zxcv';
    expect(
      () => addSavedTertiaryBonds(drawing, [saved])
    ).toThrow();
  });
});
