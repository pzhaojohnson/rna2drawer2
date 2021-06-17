import { BaseNumberingInterface as BaseNumbering } from './BaseNumberingInterface';

export type Values = {
  text: {
    'font-family'?: string;
    'font-size'?: number;
    'font-weight'?: string | number;
    'fill'?: string;
  }
  line: {
    'stroke'?: string;
    'stroke-width'?: number;
  }
  basePadding?: number;
  lineLength?: number;
}

export function values(bn: BaseNumbering): Values {
  let textAttrs = {
    'font-family': bn.text.attr('font-family'),
    'font-size': bn.text.attr('font-size'),
    'font-weight': bn.text.attr('font-weight'),
    'fill': bn.text.attr('fill'),
  };
  let lineAttrs = {
    'stroke': bn.line.attr('stroke'),
    'stroke-width': bn.line.attr('stroke-width'),
  };
  let vs: Values = {
    text: {},
    line: {},
  };
  if (typeof textAttrs['font-family'] == 'string') {
    vs.text['font-family'] = textAttrs['font-family'];
  }
  if (typeof textAttrs['font-size'] == 'number') {
    vs.text['font-size'] = textAttrs['font-size'];
  }
  if (typeof textAttrs['font-weight'] == 'string' || typeof textAttrs['font-weight'] == 'number') {
    vs.text['font-weight'] = textAttrs['font-weight'];
  }
  if (typeof textAttrs['fill'] == 'string') {
    vs.text['fill'] = textAttrs['fill'];
  }
  if (typeof lineAttrs['stroke'] == 'string') {
    vs.line['stroke'] = lineAttrs['stroke'];
  }
  if (typeof lineAttrs['stroke-width'] == 'number') {
    vs.line['stroke-width'] = lineAttrs['stroke-width'];
  }
  vs.basePadding = bn.basePadding;
  vs.lineLength = bn.lineLength;
  return vs;
}

export function setValues(bn: BaseNumbering, vs: Values) {
  if (vs.text) {
    if (typeof vs.text['font-family'] == 'string') {
      bn.text.attr({ 'font-family': vs.text['font-family'] });
    }
    if (typeof vs.text['font-size'] == 'number') {
      bn.text.attr({ 'font-size': vs.text['font-size'] });
    }
    if (typeof vs.text['font-weight'] == 'string' || typeof vs.text['font-weight'] == 'number') {
      bn.text.attr({ 'font-weight': vs.text['font-weight'] });
    }
    if (typeof vs.text['fill'] == 'string') {
      bn.text.attr({ 'fill': vs.text['fill'] });
    }
  }
  if (vs.line) {
    if (typeof vs.line['stroke'] == 'string') {
      bn.line.attr({ 'stroke': vs.line['stroke'] });
    }
    if (typeof vs.line['stroke-width'] == 'number') {
      bn.line.attr({ 'stroke-width': vs.line['stroke-width'] });
    }
  }
  if (typeof vs.basePadding == 'number') {
    bn.basePadding = vs.basePadding;
  }
  if (typeof vs.lineLength == 'number') {
    bn.lineLength = vs.lineLength;
  }
}
