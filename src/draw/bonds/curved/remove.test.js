import { removeTertiaryBondById } from './remove';
import Drawing from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { addTertiaryBond } from './add';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungTriangle } from 'Draw/bonds/strung/create';
import { addStrungElementToBond } from 'Draw/bonds/strung/addToBond';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

function pathWasRemoved(tb) {
  return tb.path.root() ? false : true;
}

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(container);

  // test with multiple sequences
  drawing.appendSequence('asdf', 'asdfASDF');
  drawing.appendSequence('qwer', 'QWER');
  drawing.appendSequence('zxcv', 'zxcvzxcvzxcv');

  let bases = drawing.bases();
  [
    [0, 1],
    [5, 19],
    [18, 3],
    [10, 8],
    [22, 16],
    [20, 20],
    [6, 2],
  ].forEach(bis => {
    addTertiaryBond(drawing, bases[bis[0]], bases[bis[1]]);
  });
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('removeTertiaryBondById function', () => {
  it('removes path', () => {
    let tb = drawing.tertiaryBonds[2];
    expect(tb).toBeTruthy();
    expect(pathWasRemoved(tb)).toBeFalsy();
    removeTertiaryBondById(drawing, tb.id);
    expect(pathWasRemoved(tb)).toBeTruthy();
  });

  it('removes strung elements', () => {
    let tb = drawing.tertiaryBonds[0];
    let curve = curveOfBond(tb);
    let curveLength = curveLengthOfBond(tb);
    let strungText = createStrungText({ text: 'B', curve, curveLength });
    let strungTriangle = createStrungTriangle({ curve, curveLength });
    addStrungElementToBond({ bond: tb, strungElement: strungText });
    addStrungElementToBond({ bond: tb, strungElement: strungTriangle });

    expect(strungText.text.root()).toBe(drawing.svg);
    expect(strungTriangle.path.root()).toBe(drawing.svg);
    removeTertiaryBondById(drawing, tb.id);
    expect(strungText.text.root()).toBeFalsy(); // was removed
    expect(strungTriangle.path.root()).toBeFalsy(); // was removed
  });

  it('removes from tertiary bonds array', () => {
    expect(drawing.tertiaryBonds.length).toBeGreaterThanOrEqual(5);
    [
      drawing.tertiaryBonds.length - 1, // at end
      2, // in the middle
      0, // at the beginning
    ].forEach(i => {
      let tb = drawing.tertiaryBonds[i];
      expect(drawing.tertiaryBonds.includes(tb)).toBeTruthy();
      removeTertiaryBondById(drawing, tb.id);
      expect(drawing.tertiaryBonds.includes(tb)).toBeFalsy();
    });
  });

  it('handles no tertiary bond having the given ID', () => {
    let n = drawing.tertiaryBonds.length;
    expect(
      () => removeTertiaryBondById(drawing, 'asdf')
    ).not.toThrow();
    // didn't remove any tertiary bonds
    expect(drawing.tertiaryBonds.length).toBe(n);
  });
});
