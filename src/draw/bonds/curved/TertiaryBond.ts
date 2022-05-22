import { QuadraticBezierBond } from './QuadraticBezierBond';
import { Values } from './values';

export class TertiaryBond extends QuadraticBezierBond {
  static recommendedDefaults: Values;

  static dashedStrokeDasharray: string;
}

TertiaryBond.dashedStrokeDasharray = '8 2';

TertiaryBond.recommendedDefaults = {
  path: {
    'stroke': '#8cd4e8',
    'stroke-width': 1.5,
    'stroke-opacity': 1,
    'stroke-dasharray': '',
    'fill': 'none',
    style: {
      'cursor': '',
    },
  },
  basePadding1: 8,
  basePadding2: 8,
};
