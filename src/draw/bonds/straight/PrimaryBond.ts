import { StraightBond } from './StraightBond';
import { Values } from './values';

export class PrimaryBond extends StraightBond {
  static recommendedDefaults: Values;
}

PrimaryBond.recommendedDefaults = {
  line: {
    'stroke': '#808080',
    'stroke-width': 1,
    'stroke-opacity': 1,
    'stroke-linecap': 'butt',
  },
  basePadding1: 8,
  basePadding2: 8,
};
