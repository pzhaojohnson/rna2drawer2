export interface BaseSavableState {}

export interface BaseInterface {
  readonly id: string;
  character: string;

  xCenter: number;
  yCenter: number;

  distanceBetweenCenters(b: BaseInterface): number;
  angleBetweenCenters(b: BaseInterface): number;
}

export default BaseInterface;
