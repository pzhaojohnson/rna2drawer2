import { StraightBond } from './StraightBond';
import {
  SecondaryBondInterface,
  SecondaryBondType,
  secondaryBondTypes,
} from './SecondaryBondInterface';
import { StraightBondSavableState } from './StraightBondInterface';
import * as SVG from '@svgdotjs/svg.js';
import Base from 'Draw/Base';
import { Values, values, setValues } from './values';

export class SecondaryBond extends StraightBond implements SecondaryBondInterface {
  static recommendedDefaults: {
    'AUT': Values,
    'GC': Values,
    'GUT': Values,
    'other': Values,
  }
  
  static fromSavedState(
    savedState: StraightBondSavableState,
    svg: SVG.Svg,
    getBaseById: (id: string) => (Base | undefined),
  ): (SecondaryBond | never) {
    if (savedState.className !== 'StraightBond') {
      throw new Error('Wrong class name.');
    }
    let line = svg.findOne('#' + savedState.lineId);
    let b1 = getBaseById(savedState.baseId1) as Base;
    let b2 = getBaseById(savedState.baseId2) as Base;
    let sb = new SecondaryBond(line as SVG.Line, b1, b2);
    let sbt = sb.type;
    let sbvs = values(sb);
    secondaryBondTypes.forEach(t => {
      if (t == sbt) {
        SecondaryBond.recommendedDefaults[t] = sbvs;
      } else {
        let vs = SecondaryBond.recommendedDefaults[t];
        SecondaryBond.recommendedDefaults[t] = {
          ...sbvs,
          line: {
            ...sbvs.line,
            stroke: vs.line.stroke,
          },
        };
      }
    });
    return sb;
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
