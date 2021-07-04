import { PrimaryBondInterface} from './PrimaryBondInterface';
import { StraightBond } from './StraightBond';
import { StraightBondSavableState } from './StraightBondInterface';
import { Values, values, setValues } from './values';
import * as SVG from '@svgdotjs/svg.js';
import Base from 'Draw/Base';

export class PrimaryBond extends StraightBond implements PrimaryBondInterface {
  static recommendedDefaults: Values;

  static fromSavedState(
    savedState: StraightBondSavableState,
    svg: SVG.Svg,
    getBaseById: (id: string) => (Base | undefined),
  ): (PrimaryBond | never) {
    if (savedState.className !== 'StraightBond') {
      throw new Error('Wrong class name.');
    }
    let line = svg.findOne('#' + savedState.lineId);
    let b1 = getBaseById(savedState.baseId1) as Base;
    let b2 = getBaseById(savedState.baseId2) as Base;
    let pb = new PrimaryBond(line as SVG.Line, b1, b2);
    PrimaryBond.recommendedDefaults = values(pb);
    return pb;
  }
}

PrimaryBond.recommendedDefaults = {
  line: {
    'stroke': '#808080',
    'stroke-width': 1,
  },
  basePadding1: 8,
  basePadding2: 8,
};
