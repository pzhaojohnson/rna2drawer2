import { SVGCircleWrapper as Circle } from 'Draw/svg/SVGCircleWrapper';
import { Point2D as Point } from 'Math/points/Point';

export type Repositioning = {
  baseCenter?: Point;
}

export interface CircleBaseAnnotationInterface {
  readonly circle: Circle;
  readonly id: string;
  reposition(rp?: Repositioning): void;
}
