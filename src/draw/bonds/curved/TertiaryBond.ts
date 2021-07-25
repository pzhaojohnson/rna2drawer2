import { QuadraticBezierBond } from './QuadraticBezierBond';
import { TertiaryBondInterface } from './TertiaryBondInterface';
import { Values } from './values';

export class TertiaryBond extends QuadraticBezierBond implements TertiaryBondInterface {
  static recommendedDefaults: Values;

  static dashedStrokeDasharray: string;
}

TertiaryBond.dashedStrokeDasharray = '8 2';

TertiaryBond.recommendedDefaults = {
  path: {
    'stroke': '#63c5da',
    'stroke-width': 1.5,
    'stroke-opacity': 0.5,
    'stroke-dasharray': '',
    'fill': 'none',
    'cursor': 'pointer',
  },
  basePadding1: 8,
  basePadding2: 8,
};
