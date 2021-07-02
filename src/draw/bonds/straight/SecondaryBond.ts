import { StraightBond } from './StraightBond';
import {
  SecondaryBondInterface,
  SecondaryBondMostRecentProps,
  SecondaryBondType,
} from './SecondaryBondInterface';
import { StraightBondSavableState } from './StraightBondInterface';
import * as SVG from '@svgdotjs/svg.js';
import Base from 'Draw/Base';

export class SecondaryBond extends StraightBond implements SecondaryBondInterface {
  static _mostRecentProps: SecondaryBondMostRecentProps;

  static mostRecentProps(): SecondaryBondMostRecentProps {
    return { ...SecondaryBond._mostRecentProps };
  }

  static _applyMostRecentProps(sb: SecondaryBond) {
    let mrps = SecondaryBond.mostRecentProps();
    sb.padding1 = mrps.padding1;
    sb.padding2 = mrps.padding2;
    sb.strokeWidth = mrps.strokeWidth;
    if (sb.isAUT()) {
      sb.stroke = mrps.autStroke;
    } else if (sb.isGC()) {
      sb.stroke = mrps.gcStroke;
    } else if (sb.isGUT()) {
      sb.stroke = mrps.gutStroke;
    } else {
      sb.stroke = mrps.otherStroke;
    }
  }

  static _copyPropsToMostRecent(sb: SecondaryBond) {
    SecondaryBond._mostRecentProps.padding1 = sb.padding1;
    SecondaryBond._mostRecentProps.padding2 = sb.padding2;
    SecondaryBond._mostRecentProps.strokeWidth = sb.strokeWidth;
    if (sb.isAUT()) {
      SecondaryBond._mostRecentProps.autStroke = sb.stroke;
    } else if (sb.isGC()) {
      SecondaryBond._mostRecentProps.gcStroke = sb.stroke;
    } else if (sb.isGUT()) {
      SecondaryBond._mostRecentProps.gutStroke = sb.stroke;
    } else {
      SecondaryBond._mostRecentProps.otherStroke = sb.stroke;
    }
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
    SecondaryBond._copyPropsToMostRecent(sb);
    return sb;
  }

  static create(svg: SVG.Svg, b1: Base, b2: Base): SecondaryBond {
    let cs = StraightBond._lineCoordinates(b1, b2, 8, 8);
    let line = svg.line(cs.x1, cs.y1, cs.x2, cs.y2);
    line.id();
    line.attr({ 'opacity': StraightBond._opacity(b1, b2, 8, 8) });
    let sb = new SecondaryBond(line, b1, b2);
    SecondaryBond._applyMostRecentProps(sb);
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
    SecondaryBond._mostRecentProps.padding1 = p;
  }

  get padding2(): number {
    return super.getPadding2();
  }

  set padding2(p: number) {
    super.setPadding2(p);
    SecondaryBond._mostRecentProps.padding2 = p;
  }

  get stroke(): string {
    return super.getStroke();
  }

  set stroke(s: string) {
    super.setStroke(s);
    if (this.isAUT()) {
      SecondaryBond._mostRecentProps.autStroke = s;
    } else if (this.isGC()) {
      SecondaryBond._mostRecentProps.gcStroke = s;
    } else if (this.isGUT()) {
      SecondaryBond._mostRecentProps.gutStroke = s;
    } else {
      SecondaryBond._mostRecentProps.otherStroke = s;
    }
  }

  get strokeWidth(): number {
    return super.getStrokeWidth();
  }

  set strokeWidth(sw: number) {
    super.setStrokeWidth(sw);
    SecondaryBond._mostRecentProps.strokeWidth = sw;
  }
}

SecondaryBond._mostRecentProps = {
  padding1: 6,
  padding2: 6,
  autStroke: '#000000',
  gcStroke: '#000000',
  gutStroke: '#000000',
  otherStroke: '#000000',
  strokeWidth: 2,
};
