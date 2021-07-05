import { SVGLineWrapper as Line } from 'Draw/svg/line';
import { BaseInterface as Base } from 'Draw/BaseInterface'

export interface StraightBondInterface {
  readonly line: Line;
  readonly base1: Base;
  readonly base2: Base;
  id: string;
  contains(b: Base): boolean;
  basePadding1: number;
  basePadding2: number;
  reposition(): void;
  bringToFront(): void;
  sendToBack(): void;
  refreshIds(): void;
}
