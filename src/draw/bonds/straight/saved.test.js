import { addSavedPrimaryBond, addSavedSecondaryBond } from './saved';
import Drawing from 'Draw/Drawing';
import { NodeSVG } from 'Draw/NodeSVG';
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
  drawing.appendSequenceOutOfView('ASDF', 'ASDF');
  drawing.appendSequenceOutOfView('qwer', 'qwerqwer');
  drawing.appendSequenceOutOfView('zxcv', 'ZXCVzx');

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

describe('addSavedPrimaryBond function', () => {
  it('finds line and bases 1 and 2', () => {
    let [pb1] = drawing.primaryBonds.splice(2, 1);
    let saved = savableState(pb1);
    let pb2 = addSavedPrimaryBond(drawing, saved);
    expect(areSameLine(pb1.line, pb2.line)).toBeTruthy();
    expect(areSameBase(pb1.base1, pb2.base1)).toBeTruthy();
    expect(areSameBase(pb1.base2, pb2.base2)).toBeTruthy();
  });

  it('adds to primary bonds array', () => {
    let [pb1] = drawing.primaryBonds.splice(4, 1);
    let saved = savableState(pb1);
    let pb2 = addSavedPrimaryBond(drawing, saved);
    expect(drawing.primaryBonds.includes(pb2)).toBeTruthy();
  });

  it('checks that saved state is for a primary bond', () => {
    let [pb] = drawing.primaryBonds.splice(0, 1);
    let saved = savableState(pb);
    saved.className = 'StraightBnd';
    expect(
      () => addSavedPrimaryBond(drawing, saved)
    ).toThrow();
  });

  it('throws if unable to find line', () => {
    let [pb] = drawing.primaryBonds.splice(1, 1);
    let saved = savableState(pb);
    saved.lineId = 'asdf';
    expect(
      () => addSavedPrimaryBond(drawing, saved)
    ).toThrow();
  });

  it('throws if unable to find base 1', () => {
    let [pb] = drawing.primaryBonds.splice(0, 1);
    let saved = savableState(pb);
    saved.baseId1 = 'asdf';
    expect(
      () => addSavedPrimaryBond(drawing, saved)
    ).toThrow();
  });

  it('throws if unable to find base 2', () => {
    let [pb] = drawing.primaryBonds.splice(0, 1);
    let saved = savableState(pb);
    saved.baseId2 = 'asdf';
    expect(
      () => addSavedPrimaryBond(drawing, saved)
    ).toThrow();
  });
});

describe('addSavedSecondaryBond function', () => {
  it('finds line and bases 1 and 2', () => {
    let [sb1] = drawing.secondaryBonds.splice(3, 1);
    let saved = savableState(sb1);
    let sb2 = addSavedSecondaryBond(drawing, saved);
    expect(areSameLine(sb1.line, sb2.line)).toBeTruthy();
    expect(areSameBase(sb1.base1, sb2.base1)).toBeTruthy();
    expect(areSameBase(sb1.base2, sb2.base2)).toBeTruthy();
  });

  it('adds to secondary bonds array', () => {
    let [sb1] = drawing.secondaryBonds.splice(2, 1);
    let saved = savableState(sb1);
    let sb2 = addSavedSecondaryBond(drawing, saved);
    expect(drawing.secondaryBonds.includes(sb2)).toBeTruthy();
  });

  it('checks that saved state is for a straight bond', () => {
    let [sb] = drawing.secondaryBonds.splice(1, 1);
    let saved = savableState(sb);
    saved.className = 'StraiightBond';
    expect(
      () => addSavedSecondaryBond(drawing, saved)
    ).toThrow();
  });

  it('throws if unable to find line', () => {
    let [sb] = drawing.secondaryBonds.splice(0, 1);
    let saved = savableState(sb);
    saved.lineId = 'asdf';
    expect(
      () => addSavedSecondaryBond(drawing, saved)
    ).toThrow();
  });

  it('throws if unable to find base 1', () => {
    let [sb] = drawing.secondaryBonds.splice(0, 1);
    let saved = savableState(sb);
    saved.baseId1 = 'asdf';
    expect(
      () => addSavedSecondaryBond(drawing, saved)
    ).toThrow();
  });

  it('throws if unable to find base 2', () => {
    let [sb] = drawing.secondaryBonds.splice(0, 1);
    let saved = savableState(sb);
    saved.baseId2 = 'asdf';
    expect(
      () => addSavedSecondaryBond(drawing, saved)
    ).toThrow();
  });
});
