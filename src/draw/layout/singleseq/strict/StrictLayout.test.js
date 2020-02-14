import StrictLayout from './StrictLayout';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import { knotlessCases, knottedCases } from '../../../../parse/isKnotless.test';

it('_validatePartners', () => {

  // empty
  expect(() => new StrictLayout([], new StrictLayoutGeneralProps(), [])).toThrow();

  knotlessCases.forEach(cs => {
    if (cs.length > 0) {
      let dps = new StrictLayoutGeneralProps();
      let bps = [];
      cs.forEach(position => bps.push(new StrictLayoutBaseProps()));
      expect(() => new StrictLayout(cs, dps, bps)).not.toThrow();
    }
  });

  knottedCases.forEach(cs => {
    let dps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.forEach(position => bps.push(new StrictLayoutBaseProps()));
    expect(() => new StrictLayout(cs, dps, bps)).toThrow();
  })
});
