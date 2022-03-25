import type { CircleBaseAnnotation } from './CircleBaseAnnotation';

export function bringToFront(cba: CircleBaseAnnotation) {
  cba.circle.front();
}

export function sendToBack(cba: CircleBaseAnnotation) {
  cba.circle.back();
}
