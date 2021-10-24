import { PrimaryBondInterface } from './PrimaryBondInterface';
import { StraightBond } from './StraightBond';
import { Values } from './values';

export class PrimaryBond extends StraightBond implements PrimaryBondInterface {
  static recommendedDefaults: Values;
}

PrimaryBond.recommendedDefaults = {
  line: {
    'stroke': '#808080',
    'stroke-width': 1,
    'stroke-opacity': 1,
  },
  basePadding1: 8,
  basePadding2: 8,
};
