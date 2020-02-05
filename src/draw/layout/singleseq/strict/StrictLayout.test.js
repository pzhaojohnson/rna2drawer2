import StrictLayout from './StrictLayout';
import StrictLayoutDrawingProps from './StrictLayoutDrawingProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import { knotlessCases, knottedCases } from '../../../../parse/isKnotless.test';

it('_validatePartners', () => {

  // empty
  expect(() => new StrictLayout([], new StrictLayoutDrawingProps(), [])).toThrow();

  knotlessCases.forEach(cs => {
    if (cs.length > 0) {
      let dps = new StrictLayoutDrawingProps();
      let bps = [];
      cs.forEach(position => bps.push(new StrictLayoutBaseProps()));
      expect(() => new StrictLayout(cs, dps, bps)).not.toThrow();
    }
  });

  knottedCases.forEach(cs => {
    let dps = new StrictLayoutDrawingProps();
    let bps = [];
    cs.forEach(position => bps.push(new StrictLayoutBaseProps()));
    expect(() => new StrictLayout(cs, dps, bps)).toThrow();
  })
});
