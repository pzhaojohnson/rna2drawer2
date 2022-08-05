import { removePrimaryBondById, removeSecondaryBondById } from './remove';
import Drawing from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { addPrimaryBond, addSecondaryBond } from './add';

import { createStrungText } from 'Draw/bonds/strung/create';
import { createStrungCircle } from 'Draw/bonds/strung/create';
import { createStrungTriangle } from 'Draw/bonds/strung/create';
import { createStrungRectangle } from 'Draw/bonds/strung/create';
import { addStrungElementToBond } from 'Draw/bonds/strung/addToBond';

import { curveOfBond } from 'Draw/bonds/strung/curveOfBond';
import { curveLengthOfBond } from 'Draw/bonds/strung/curveLengthOfBond';

function lineWasRemoved(line) {
  return line.root() ? false : true;
}

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing({ SVG: { SVG: NodeSVG } });
  drawing.appendTo(container);

  // test with multiple sequences
  drawing.appendSequence('seq1', 'asdfQWER');
  drawing.appendSequence('seq2', 'QQwwzz');
  drawing.appendSequence('seq3', '12345678asdf');

  let bases = drawing.bases();
  for (let i = 0; i < bases.length - 1; i++) {
    addPrimaryBond(drawing, bases[i], bases[i + 1]);
  }
  for (let i = 0; i < bases.length; i += 2) {
    addSecondaryBond(drawing, bases[i], bases[bases.length - i - 1]);
  }
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('removePrimaryBondById function', () => {
  it('removes line', () => {
    let pb = drawing.primaryBonds[4];
    expect(lineWasRemoved(pb.line)).toBeFalsy();
    removePrimaryBondById(drawing, pb.id);
    expect(lineWasRemoved(pb.line)).toBeTruthy();
  });

  it('removes strung elements', () => {
    let pb = drawing.primaryBonds[0];
    let curve = curveOfBond(pb);
    let curveLength = curveLengthOfBond(pb);
    let strungText = createStrungText({ text: 'W', curve, curveLength });
    let strungTriangle = createStrungTriangle({ curve, curveLength });
    addStrungElementToBond({ bond: pb, strungElement: strungText });
    addStrungElementToBond({ bond: pb, strungElement: strungTriangle });

    expect(strungText.text.root()).toBe(drawing.svg);
    expect(strungTriangle.path.root()).toBe(drawing.svg);
    removePrimaryBondById(drawing, pb.id);
    expect(strungText.text.root()).toBeFalsy(); // was removed
    expect(strungTriangle.path.root()).toBeFalsy(); // was removed
  });

  it('removes from primary bonds array', () => {
    expect(drawing.primaryBonds.length).toBeGreaterThanOrEqual(6);
    let n = drawing.primaryBonds.length;
    [
      drawing.primaryBonds.length - 1, // at the end
      2, // in the middle
      0, // at the beginning
    ].forEach(i => {
      let pb = drawing.primaryBonds[i];
      expect(drawing.primaryBonds.includes(pb)).toBeTruthy();
      removePrimaryBondById(drawing, pb.id);
      expect(drawing.primaryBonds.includes(pb)).toBeFalsy();
      n--;
      expect(drawing.primaryBonds.length).toBe(n);
    });
  });

  it('handles no primary bond having the given ID', () => {
    let n = drawing.primaryBonds.length;
    expect(
      () => removePrimaryBondById(drawing, 'asdf')
    ).not.toThrow();
    // didn't remove any primary bonds
    expect(drawing.primaryBonds.length).toBe(n);
  });
});

describe('removeSecondaryBondById function', () => {
  it('removes line', () => {
    let sb = drawing.secondaryBonds[3];
    expect(lineWasRemoved(sb.line)).toBeFalsy();
    removeSecondaryBondById(drawing, sb.id);
    expect(lineWasRemoved(sb.line)).toBeTruthy();
  });

  it('removes strung elements', () => {
    let sb = drawing.secondaryBonds[0];
    let curve = curveOfBond(sb);
    let curveLength = curveLengthOfBond(sb);
    let strungCircle = createStrungCircle({ curve, curveLength });
    let strungRectangle = createStrungRectangle({ curve, curveLength });
    addStrungElementToBond({ bond: sb, strungElement: strungCircle });
    addStrungElementToBond({ bond: sb, strungElement: strungRectangle });

    expect(strungCircle.circle.root()).toBe(drawing.svg);
    expect(strungRectangle.path.root()).toBe(drawing.svg);
    removeSecondaryBondById(drawing, sb.id);
    expect(strungCircle.circle.root()).toBeFalsy(); // was removed
    expect(strungRectangle.path.root()).toBeFalsy(); // was removed
  });

  it('removes from secondary bonds array', () => {
    expect(drawing.secondaryBonds.length).toBeGreaterThanOrEqual(6);
    let n = drawing.secondaryBonds.length;
    [
      drawing.secondaryBonds.length - 1, // at the end
      2, // in the middle
      0, // at the beginning
    ].forEach(i => {
      let sb = drawing.secondaryBonds[i];
      expect(drawing.secondaryBonds.includes(sb)).toBeTruthy();
      removeSecondaryBondById(drawing, sb.id);
      expect(drawing.secondaryBonds.includes(sb)).toBeFalsy();
      n--;
      expect(drawing.secondaryBonds.length).toBe(n);
    });
  });

  it('handles no secondary bond having the given ID', () => {
    let n = drawing.secondaryBonds.length;
    expect(
      () => removeSecondaryBondById(drawing, 'asdf')
    ).not.toThrow();
    // didn't remove any secondary bonds
    expect(drawing.secondaryBonds.length).toBe(n);
  });
});
