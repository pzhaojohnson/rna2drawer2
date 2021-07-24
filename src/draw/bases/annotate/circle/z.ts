import { CircleBaseAnnotationInterface as CircleBaseAnnotation } from './CircleBaseAnnotationInterface';

export function bringToFront(cba: CircleBaseAnnotation) {
  cba.circle.front();
}

export function sendToBack(cba: CircleBaseAnnotation) {
  cba.circle.back();
}
