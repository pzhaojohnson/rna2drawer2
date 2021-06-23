import { SVGTextWrapper as Text } from 'Draw/svg/text';
import { SVGLineWrapper as Line } from 'Draw/svg/line';
import { Point2D as Point } from 'Math/Point';

export type Repositioning = {
  baseCenter?: Point;
  basePadding?: number;
  lineAngle?: number;
  lineLength?: number;
}

export interface BaseNumberingInterface {
  readonly text: Text;
  readonly line: Line;
  readonly id: string;
  basePadding: number | undefined;
  lineAngle: number | undefined;
  lineLength: number | undefined;
  readonly textPadding: number;
  reposition(rp?: Repositioning): void;
  bringToFront(): void;
  sendToBack(): void;
  regenerateIds(): void;
}
