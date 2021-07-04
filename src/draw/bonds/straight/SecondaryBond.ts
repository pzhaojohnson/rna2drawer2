import { StraightBond } from './StraightBond';
import {
  SecondaryBondInterface,
  SecondaryBondType,
} from './SecondaryBondInterface';
import { Values } from './values';

export class SecondaryBond extends StraightBond implements SecondaryBondInterface {
  static recommendedDefaults: {
    'AUT': Values,
    'GC': Values,
    'GUT': Values,
    'other': Values,
  }
  
  get type(): SecondaryBondType {
    let cs = [
      this.base1.character.toUpperCase(),
      this.base2.character.toUpperCase(),
    ];
    cs.sort();
    let t = cs.join('');
    if (t == 'AU' || t == 'AT') {
      return 'AUT';
    } else if (t == 'CG') {
      return 'GC';
    } else if (t == 'GU' || t == 'GT') {
      return 'GUT';
    } else {
      return 'other';
    }
  }
}

SecondaryBond.recommendedDefaults = {
  'AUT': {
    line: {
      'stroke': '#000000',
      'stroke-width': 2,
    },
    basePadding1: 6,
    basePadding2: 6,
  },
  'GC': {
    line: {
      'stroke': '#000000',
      'stroke-width': 2,
    },
    basePadding1: 6,
    basePadding2: 6,
  },
  'GUT': {
    line: {
      'stroke': '#000000',
      'stroke-width': 2,
    },
    basePadding1: 6,
    basePadding2: 6,
  },
  'other': {
    line: {
      'stroke': '#000000',
      'stroke-width': 2,
    },
    basePadding1: 6,
    basePadding2: 6,
  },
};
