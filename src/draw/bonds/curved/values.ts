import { QuadraticBezierBondInterface as QuadraticBezierBond } from './QuadraticBezierBondInterface';

export type Values = {
  path: {
    'stroke'?: string;
    'stroke-width'?: number;
    'stroke-opacity'?: number;
    'stroke-dasharray'?: string;
  }
  basePadding1?: number;
  basePadding2?: number;
}

export function values(bond: QuadraticBezierBond): Values {
  let vs: Values = {
    path: {},
  };
  let pathAttrs = {
    'stroke': bond.path.attr('stroke'),
    'stroke-width': bond.path.attr('stroke-width'),
    'stroke-opacity': bond.path.attr('stroke-opacity'),
    'stroke-dasharray': bond.path.attr('stroke-dasharray'),
  };
  if (typeof pathAttrs['stroke'] == 'string') {
    vs.path['stroke'] = pathAttrs['stroke'];
  }
  if (typeof pathAttrs['stroke-width'] == 'number') {
    vs.path['stroke-width'] = pathAttrs['stroke-width'];
  }
  if (typeof pathAttrs['stroke-opacity'] == 'number') {
    vs.path['stroke-opacity'] = pathAttrs['stroke-opacity'];
  }
  if (typeof pathAttrs['stroke-dasharray'] == 'string') {
    vs.path['stroke-dasharray'] = pathAttrs['stroke-dasharray'];
  }
  vs.basePadding1 = bond.getPadding1();
  vs.basePadding2 = bond.getPadding2();
  return vs;
}

export function setValues(bond: QuadraticBezierBond, vs: Values) {
  if (vs.path) {
    if (typeof vs.path['stroke'] == 'string') {
      bond.path.attr({ 'stroke': vs.path['stroke'] });
    }
    if (typeof vs.path['stroke-width'] == 'number') {
      bond.path.attr({ 'stroke-width': vs.path['stroke-width'] });
    }
    if (typeof vs.path['stroke-opacity'] == 'number') {
      bond.path.attr({ 'stroke-opacity': vs.path['stroke-opacity'] });
    }
    if (typeof vs.path['stroke-dasharray'] == 'string') {
      bond.path.attr({ 'stroke-dasharray': vs.path['stroke-dasharray'] });
    }
  }
  if (typeof vs.basePadding1 == 'number') {
    bond.setPadding1(vs.basePadding1);
  }
  if (typeof vs.basePadding2 == 'number') {
    bond.setPadding2(vs.basePadding2);
  }
}
