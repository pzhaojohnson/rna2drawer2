import { BaseInterface as Base } from './BaseInterface';

export function bringToFront(b: Base) {
  if (b.outline) {
    b.outline.bringToFront();
  }

  // keep text in front of outline
  b.text.front();
}

export function sendToBack(b: Base) {
  b.text.back();

  // keep outline behind text
  if (b.outline) {
    b.outline.sendToBack();
  }
}
