import { removePrimaryBondById, removeSecondaryBondById } from './remove';
import Drawing from 'Draw/Drawing';
import { NodeSVG } from 'Draw/NodeSVG';
import { addPrimaryBond, addSecondaryBond } from './add';

function lineWasRemoved(line) {
  return line.wrapped.root() ? false : true;
}

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());

  // test with multiple sequences
  drawing.appendSequenceOutOfView('seq1', 'asdfQWER');
  drawing.appendSequenceOutOfView('seq2', 'QQwwzz');
  drawing.appendSequenceOutOfView('seq3', '12345678asdf');

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
