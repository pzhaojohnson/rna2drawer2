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

  static create(svg: SVG.Svg, b1: Base, b2: Base): SecondaryBond {
    let cs = StraightBond._lineCoordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id();
    line.attr({ 'opacity': StraightBond._opacity(b1, b2, 8, 8) });
    let sb = new SecondaryBond(line, b1, b2);
    setValues(sb, SecondaryBond.recommendedDefaults[sb.type]);
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

  isAUT(): boolean {
    let l1 = this.base1.character.toUpperCase();
    let l2 = this.base2.character.toUpperCase();
    if (l1 === 'A') {
      return l2 === 'U' || l2 === 'T';
    } else if (l1 === 'U' || l1 === 'T') {
      return l2 === 'A';
    }
    return false;
  }

  isGC(): boolean {
    let l1 = this.base1.character.toUpperCase();
    let l2 = this.base2.character.toUpperCase();
    if (l1 === 'G') {
      return l2 === 'C';
    } else if (l1 === 'C') {
      return l2 === 'G';
    }
    return false;
  }

  isGUT(): boolean {
    let l1 = this.base1.character.toUpperCase();
    let l2 = this.base2.character.toUpperCase();
    if (l1 === 'G') {
      return l2 === 'U' || l2 === 'T';
    } else if (l1 === 'U' || l1 === 'T') {
      return l2 === 'G';
    }
    return false;
  }

  get padding1(): number {
    return super.getPadding1();
  }

  set padding1(p: number) {
    super.setPadding1(p);
    Object.values(SecondaryBond.recommendedDefaults).forEach(vs => vs.basePadding1 = p);
  }

  get padding2(): number {
    return super.getPadding2();
  }

  set padding2(p: number) {
    super.setPadding2(p);
    Object.values(SecondaryBond.recommendedDefaults).forEach(vs => vs.basePadding2 = p);
  }

  get stroke(): string {
    return super.getStroke();
  }

  set stroke(s: string) {
    super.setStroke(s);
    SecondaryBond.recommendedDefaults[this.type].line['stroke'] = s;
  }

  get strokeWidth(): number {
    return super.getStrokeWidth();
  }

  set strokeWidth(sw: number) {
    super.setStrokeWidth(sw);
    Object.values(SecondaryBond.recommendedDefaults).forEach(vs => vs.line['stroke-width'] = sw);
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
