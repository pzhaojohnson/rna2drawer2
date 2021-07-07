import { QuadraticBezierBond } from './QuadraticBezierBond';
import { QuadraticBezierBondSavableState } from './QuadraticBezierBondInterface';
import {
  TertiaryBondInterface,
  TertiaryBondMostRecentProps,
} from './TertiaryBondInterface';
import * as Svg from '@svgdotjs/svg.js';
import { BaseInterface as Base } from 'Draw/BaseInterface';

export class TertiaryBond extends QuadraticBezierBond implements TertiaryBondInterface {
  static _mostRecentProps: TertiaryBondMostRecentProps;
  static dashedStrokeDasharray: string;

  static mostRecentProps(): TertiaryBondMostRecentProps {
    return { ...TertiaryBond._mostRecentProps };
  }

  static _applyMostRecentProps(tb: TertiaryBond) {
    let mrps = TertiaryBond.mostRecentProps();
    tb.padding1 = mrps.padding1;
    tb.padding2 = mrps.padding2;
    tb.stroke = mrps.stroke;
    tb.strokeWidth = mrps.strokeWidth;
    tb.strokeOpacity = mrps.strokeOpacity;
    tb.strokeDasharray = mrps.strokeDasharray;
  }

  static _copyPropsToMostRecent(tb: TertiaryBond) {
    TertiaryBond._mostRecentProps.padding1 = tb.padding1;
    TertiaryBond._mostRecentProps.padding2 = tb.padding2;
    TertiaryBond._mostRecentProps.stroke = tb.stroke;
    TertiaryBond._mostRecentProps.strokeWidth = tb.strokeWidth;
    TertiaryBond._mostRecentProps.strokeOpacity = tb.strokeOpacity;
    TertiaryBond._mostRecentProps.strokeDasharray = tb.strokeDasharray;
  }

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
    TertiaryBond._copyPropsToMostRecent(tb);
    return tb;
  }

  static create(svg: Svg.Svg, b1: Base, b2: Base): TertiaryBond {
    let ch = 0.35 * b1.distanceBetweenCenters(b2);
    let d = QuadraticBezierBond._dPath(b1, b2, 6, 6, ch, -Math.PI / 2);
    let p = svg.path(d);
    let tb = new TertiaryBond(p, b1, b2);
    TertiaryBond._applyMostRecentProps(tb);
    return tb;
  }

  get padding1(): number {
    return super.getPadding1();
  }

  set padding1(p: number) {
    super.setPadding1(p);
    TertiaryBond._mostRecentProps.padding1 = p;
  }

  get padding2(): number {
    return super.getPadding2();
  }

  set padding2(p: number) {
    super.setPadding2(p);
    TertiaryBond._mostRecentProps.padding2 = p;
  }

  get stroke(): string {
    return super.getStroke();
  }

  set stroke(s: string) {
    super.setStroke(s);
    TertiaryBond._mostRecentProps.stroke = s;
  }

  get strokeWidth(): number {
    return super.getStrokeWidth();
  }

  set strokeWidth(sw: number) {
    super.setStrokeWidth(sw);
    TertiaryBond._mostRecentProps.strokeWidth = sw;
  }

  get strokeOpacity(): number {
    return super.getStrokeOpacity();
  }

  set strokeOpacity(so: number) {
    super.setStrokeOpacity(so);
    TertiaryBond._mostRecentProps.strokeOpacity = so;
  }

  get strokeDasharray(): string {
    return super.getStrokeDasharray();
  }

  set strokeDasharray(sd: string) {
    super.setStrokeDasharray(sd);
    TertiaryBond._mostRecentProps.strokeDasharray = sd;
  }
}

TertiaryBond.dashedStrokeDasharray = '8 2';

TertiaryBond._mostRecentProps = {
  padding1: 8,
  padding2: 8,
  stroke: '#63c5da',
  strokeWidth: 1.5,
  strokeOpacity: 0.5,
  strokeDasharray: '',
};
