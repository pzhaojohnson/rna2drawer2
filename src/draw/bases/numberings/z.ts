import type { BaseNumbering } from 'Draw/bases/numberings/BaseNumbering';

export function bringToFront(bn: BaseNumbering) {
  bn.line.front();
  bn.text.front(); // text above line
}

export function sendToBack(bn: BaseNumbering) {
  bn.text.back();
  bn.line.back(); // line below text
}
