import BaseNumbering from "./BaseNumbering";

export interface BaseSavableState {}

export interface BaseInterface {
  readonly id: string;
  character: string;

  xCenter: number;
  yCenter: number;

  distanceBetweenCenters(b: BaseInterface): number;
  angleBetweenCenters(b: BaseInterface): number;

  hasNumbering(): boolean;
  readonly numbering: BaseNumbering;
}

export default BaseInterface;
