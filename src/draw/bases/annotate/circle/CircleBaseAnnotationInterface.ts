import { SVGCircleWrapper as Circle } from 'Draw/svg/circle';
import { Point2D as Point } from 'Math/Point';

export type Repositioning = {
  baseCenter?: Point;
}

export interface CircleBaseAnnotationInterface {
  readonly circle: Circle;
  readonly id: string;
  reposition(rp?: Repositioning): void;
}
