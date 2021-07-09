import { QuadraticBezierBond } from './QuadraticBezierBond';
import { QuadraticBezierBondSavableState } from './QuadraticBezierBondInterface';
import {
  TertiaryBondInterface,
} from './TertiaryBondInterface';
import * as Svg from '@svgdotjs/svg.js';
import { BaseInterface as Base } from 'Draw/BaseInterface';
import { Values, values, setValues } from './values';

export class TertiaryBond extends QuadraticBezierBond implements TertiaryBondInterface {
  static recommendedDefaults: Values;

  static dashedStrokeDasharray: string;

  static fromSavedState(
    savedState: QuadraticBezierBondSavableState,
    svg: Svg.Svg,
    getBaseById: (id: string) => (Base | undefined),
  ): (TertiaryBond | never) {
    if (savedState.className !== 'QuadraticBezierBond') {
      throw new Error('Wrong class name.');
    }
    let p = svg.findOne('#' + savedState.pathId) as Svg.Path;
    let b1 = getBaseById(savedState.baseId1) as Base;
    let b2 = getBaseById(savedState.baseId2) as Base;
    let tb = new TertiaryBond(p, b1, b2);
    TertiaryBond.recommendedDefaults = values(tb);
    return tb;
  }

  static create(svg: Svg.Svg, b1: Base, b2: Base): TertiaryBond {
    let ch = 0.35 * b1.distanceBetweenCenters(b2);
    let d = QuadraticBezierBond._dPath(b1, b2, 6, 6, ch, -Math.PI / 2);
    let p = svg.path(d);
    let tb = new TertiaryBond(p, b1, b2);
    setValues(tb, TertiaryBond.recommendedDefaults);
    return tb;
  }

  get padding1(): number {
    return super.getPadding1();
  }

  set padding1(p: number) {
    super.setPadding1(p);
    TertiaryBond.recommendedDefaults.basePadding1 = p;
  }

  get padding2(): number {
    return super.getPadding2();
  }

  set padding2(p: number) {
    super.setPadding2(p);
    TertiaryBond.recommendedDefaults.basePadding2 = p;
  }

  get stroke(): string {
    return super.getStroke();
  }

  set stroke(s: string) {
    super.setStroke(s);
    TertiaryBond.recommendedDefaults.path['stroke'] = s;
  }

  get strokeWidth(): number {
    return super.getStrokeWidth();
  }

  set strokeWidth(sw: number) {
    super.setStrokeWidth(sw);
    TertiaryBond.recommendedDefaults.path['stroke-width'] = sw;
  }

  get strokeOpacity(): number {
    return super.getStrokeOpacity();
  }

  set strokeOpacity(so: number) {
    super.setStrokeOpacity(so);
    TertiaryBond.recommendedDefaults.path['stroke-opacity'] = so;
  }
}

TertiaryBond.dashedStrokeDasharray = '8 2';

TertiaryBond.recommendedDefaults = {
  path: {
    'stroke': '#63c5da',
    'stroke-width': 1.5,
    'stroke-opacity': 0.5,
    'stroke-dasharray': '',
  },
  basePadding1: 8,
  basePadding2: 8,
};
