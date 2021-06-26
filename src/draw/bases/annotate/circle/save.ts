import { CircleBaseAnnotationInterface } from './CircleBaseAnnotationInterface';
import { CircleBaseAnnotation } from './CircleBaseAnnotation';

export type SavableState = {
  className: 'CircleBaseAnnotation';
  circleId: string;
}

export function savableState(cba: CircleBaseAnnotationInterface): SavableState {
  return {
    className: 'CircleBaseAnnotation',
    circleId: String(cba.circle.id()),
  };
}
