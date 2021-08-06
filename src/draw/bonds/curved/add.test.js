import { addTertiaryBond } from './add';
import Drawing from 'Draw/Drawing';
import { NodeSVG } from 'Draw/svg/NodeSVG';
import { position } from './position';
import { TertiaryBond } from './TertiaryBond';

let container = null;
let drawing = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  drawing = new Drawing();
  drawing.addTo(container, () => NodeSVG());

  // test with multiple sequences
  drawing.appendSequence('asdf', 'asdfqwerzxcv');
  drawing.appendSequence('qwer', 'qwerasdfzxcv');
});

afterEach(() => {
  drawing.clear();
  drawing = null;

  container.remove();
  container = null;
});

describe('addTertiaryBond function', () => {
  it('creates bond with given bases 1 and 2', () => {
    expect(drawing.bases().length).toBeGreaterThanOrEqual(24);
    let base1 = drawing.bases()[5];
    let base2 = drawing.bases()[10];
    let tb = addTertiaryBond(drawing, base1, base2);
    expect(tb.base1).toBe(base1);
    expect(tb.base2).toBe(base2);
    // double-check that bases are defined
    expect(base1).toBeTruthy();
    expect(base2).toBeTruthy();
  });

  it('adds bond to tertiary bonds array', () => {
    expect(drawing.bases().length).toBeGreaterThanOrEqual(24);
    [
      [2, 8],
      [12, 7],
      [16, 18],
    ].forEach(bis => {
      let base1 = drawing.bases()[bis[0]];
      let base2 = drawing.bases()[bis[1]];
      let tb = addTertiaryBond(drawing, base1, base2);
      expect(drawing.tertiaryBonds.includes(tb)).toBeTruthy();
    });
  });

  it('positions the added bond with default base paddings', () => {
    expect(drawing.bases().length).toBeGreaterThanOrEqual(24);
    let base1 = drawing.bases()[7];
    let base2 = drawing.bases()[10];
    base1.moveTo(200 * Math.random(), 500 * Math.random());
    base2.moveTo(300 * Math.random(), 100 * Math.random());
    let tb = addTertiaryBond(drawing, base1, base2);
    let d1 = tb.path.attr('d');
    position(tb, {
      basePadding1: TertiaryBond.recommendedDefaults.basePadding1,
      basePadding2: TertiaryBond.recommendedDefaults.basePadding2,
      controlPointDisplacement: tb.controlPointDisplacement(),
    });
    let d2 = tb.path.attr('d');
    expect(d1).toBe(d2);
  });
});
