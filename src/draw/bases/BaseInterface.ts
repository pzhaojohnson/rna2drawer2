import * as Svg from '@svgdotjs/svg.js';
import {
  CircleBaseAnnotationInterface as CircleBaseAnnotation,
} from "Draw/bases/annotate/circle/CircleBaseAnnotationInterface";
import { SavableState as SavableCircleAnnotationState } from 'Draw/bases/annotate/circle/save';
import { BaseNumberingInterface as BaseNumbering } from "Draw/bases/number/BaseNumberingInterface";
import { SavableState as SavableBaseNumberingState } from 'Draw/bases/number/save';

export interface BaseMostRecentProps {
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle: string;
}

export interface BaseSavableState {
  className: string;
  textId: string;
  highlighting?: SavableCircleAnnotationState;
  outline?: SavableCircleAnnotationState;
  numbering?: SavableBaseNumberingState;
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

  addCircleHighlighting(): CircleBaseAnnotation | undefined;
  addCircleHighlightingFromSavedState(s: SavableCircleAnnotationState): CircleBaseAnnotation | undefined | never;
  hasHighlighting(): boolean;
  highlighting?: CircleBaseAnnotation;
  removeHighlighting(): void;

  addCircleOutline(): CircleBaseAnnotation | undefined;
  addCircleOutlineFromSavedState(s: SavableCircleAnnotationState): CircleBaseAnnotation | undefined | never;
  hasOutline(): boolean;
  outline?: CircleBaseAnnotation;
  removeOutline(): void;

  addNumbering(n: number): BaseNumbering | undefined;
  addNumberingFromSavedState(s: SavableBaseNumberingState): BaseNumbering | undefined | never;
  hasNumbering(): boolean;
  numbering?: BaseNumbering;
  removeNumbering(): void;

  remove(): void;
  savableState(): BaseSavableState;
  refreshIds(): void;
}

export default BaseInterface;
