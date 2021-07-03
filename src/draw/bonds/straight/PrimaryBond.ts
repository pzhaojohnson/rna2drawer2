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

  static create(svg: SVG.Svg, b1: Base, b2: Base): PrimaryBond {
    let cs = StraightBond._lineCoordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id();
    line.attr({ 'opacity': StraightBond._opacity(b1, b2, 8, 8) });
    let pb = new PrimaryBond(line, b1, b2);
    setValues(pb, PrimaryBond.recommendedDefaults);
    return pb;
  }

  get padding1(): number {
    return super.getPadding1();
  }

  set padding1(p: number) {
    super.setPadding1(p);
    PrimaryBond.recommendedDefaults.basePadding1 = p;
  }

  get padding2(): number {
    return super.getPadding2();
  }

  set padding2(p: number) {
    super.setPadding2(p);
    PrimaryBond.recommendedDefaults.basePadding2 = p;
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
