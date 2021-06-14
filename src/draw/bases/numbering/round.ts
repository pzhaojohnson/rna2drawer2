import { BaseNumberingInterface as BaseNumbering } from './BaseNumberingInterface';
import * as SVG from '@svgdotjs/svg.js';
import { round } from 'Math/round';

function roundTextNumbers(text: SVG.Text, places: number) {
  [
    'x',
    'y',
    'font-size',
    'font-weight',
  ].forEach(attr => {
    let value = text.attr(attr);
    if (typeof value == 'number') {
      text.attr({ attr: round(value, places) });
    }
  });
}

function roundLineNumbers(line: SVG.Line, places: number) {
  [
    'x1',
    'y1',
    'x2',
    'y2',
    'stroke-width',
  ].forEach(attr => {
    let value = line.attr(attr);
    if (typeof value == 'number') {
      line.attr({ attr: round(value, places) });
    }
  });
}

export function roundNumbers(bn: BaseNumbering, places=3) {
  roundTextNumbers(bn.text, places);
  roundLineNumbers(bn.line, places);
}
