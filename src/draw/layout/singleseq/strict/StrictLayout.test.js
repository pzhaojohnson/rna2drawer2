import StrictLayout from './StrictLayout';
import StrictLayoutGeneralProps from './StrictLayoutGeneralProps';
import StrictLayoutBaseProps from './StrictLayoutBaseProps';
import { knotlessCases, knottedCases } from '../../../../parse/isKnotless.test';

it('_validatePartners', () => {

  knotlessCases.forEach(cs => {
    if (cs.length > 0) {
      let gps = new StrictLayoutGeneralProps();
      let bps = [];
      cs.forEach(position => bps.push(new StrictLayoutBaseProps()));
      expect(() => new StrictLayout(cs, gps, bps)).not.toThrow();
    }
  });

  knottedCases.forEach(cs => {
    let gps = new StrictLayoutGeneralProps();
    let bps = [];
    cs.forEach(position => bps.push(new StrictLayoutBaseProps()));
    expect(() => new StrictLayout(cs, gps, bps)).toThrow();
  })
});
