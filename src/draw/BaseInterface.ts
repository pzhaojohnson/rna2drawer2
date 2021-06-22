import * as Svg from '@svgdotjs/svg.js';
import {
  BaseAnnotationInterface as BaseAnnotation,
  CircleBaseAnnotationInterface as CircleBaseAnnotation,
  CircleBaseAnnotationSavableState,
} from "./BaseAnnotationInterface";
import { BaseNumberingInterface as BaseNumbering } from "Draw/bases/number/BaseNumberingInterface";
import { SavableState as BaseNumberingSavableState } from 'Draw/bases/number/save';

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
  readonly text: Svg.Text;
  readonly id: string;
  character: string;
  xCenter: number;
  yCenter: number;
  moveTo(xCenter: number, yCenter: number): void;
  distanceBetweenCenters(b: BaseInterface): number;
  angleBetweenCenters(b: BaseInterface): number;

  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle: string;
  fill: string;
  fillOpacity: number;
  cursor: string;

  bringToFront(): void;
  sendToBack(): void;

  onMouseover(f: () => void): void;
  onMouseout(f: () => void): void;
  onMousedown(f: () => void): void;
  onDblclick(f: () => void): void;

  addCircleHighlighting(): CircleBaseAnnotation;
  addCircleHighlightingFromSavedState(s: CircleBaseAnnotationSavableState): CircleBaseAnnotation | never;
  hasHighlighting(): boolean;
  readonly highlighting: CircleBaseAnnotation | null;
  removeHighlighting(): void;

  addCircleOutline(): CircleBaseAnnotation;
  addCircleOutlineFromSavedState(s: CircleBaseAnnotationSavableState): CircleBaseAnnotation | never;
  hasOutline(): boolean;
  readonly outline: CircleBaseAnnotation | null;
  removeOutline(): void;

  addNumbering(n: number): BaseNumbering | undefined;
  addNumberingFromSavedState(s: BaseNumberingSavableState): BaseNumbering | undefined | never;
  hasNumbering(): boolean;
  numbering?: BaseNumbering;
  removeNumbering(): void;

  remove(): void;
  savableState(): BaseSavableState;
  refreshIds(): void;
}

export default BaseInterface;
