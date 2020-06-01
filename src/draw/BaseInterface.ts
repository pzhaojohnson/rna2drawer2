import BaseNumbering from "./BaseNumbering";
import { CircleBaseAnnotationSavableState } from "./BaseAnnotationInterface";
import { BaseNumberingSavableState } from "./BaseNumberingInterface";

export interface BaseMostRecentProps {
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle: string;
}

export interface BaseSavableState {
  className: string;
  textId: string;
  highlighting?: CircleBaseAnnotationSavableState;
  outline?: CircleBaseAnnotationSavableState;
  numbering?: BaseNumberingSavableState;
}

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
