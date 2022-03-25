import type { BaseNumbering } from './BaseNumbering';

export function bringToFront(bn: BaseNumbering) {
  bn.line.front();
  bn.text.front();
}

export function sendToBack(bn: BaseNumbering) {
  bn.text.back();
  bn.line.back();
}
