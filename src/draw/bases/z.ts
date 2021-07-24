import { BaseInterface as Base } from './BaseInterface';
import {
  bringToFront as bringOutlineToFront,
  sendToBack as sendOutlineToBack,
} from 'Draw/bases/annotate/circle/z';

export function bringToFront(b: Base) {
  if (b.outline) {
    bringOutlineToFront(b.outline);
  }

  // keep text in front of outline
  b.text.front();
}

export function sendToBack(b: Base) {
  b.text.back();

  // keep outline behind text
  if (b.outline) {
    sendOutlineToBack(b.outline);
  }
}
