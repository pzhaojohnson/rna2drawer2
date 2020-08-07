import {
  DrawingInterface as Drawing,
  DrawingSavableState,
} from './DrawingInterface';
import * as Svg from '@svgdotjs/svg.js';
import {
  GeneralStrictLayoutProps as GeneralLayoutProps,
  GeneralStrictLayoutPropsSavableState as GeneralLayoutPropsSavableState,
} from './layout/singleseq/strict/GeneralStrictLayoutProps';
import {
  PerBaseStrictLayoutProps as PerBaseLayoutProps,
  PerBaseStrictLayoutPropsSavableState as PerBaseLayoutPropsSavableState
} from './layout/singleseq/strict/PerBaseStrictLayoutProps';
import StrictLayout from './layout/singleseq/strict/StrictLayout';
import { Structure } from './edit/appendStructureToStrictDrawing';

export interface StrictDrawingSavableState {
  className: string;
  drawing: DrawingSavableState;
  generalLayoutProps: GeneralLayoutPropsSavableState;
  perBaseLayoutProps: PerBaseLayoutPropsSavableState[];
  baseWidth: number;
  baseHeight: number;
}

export interface StrictDrawingInterface {
  readonly drawing: Drawing;
  addTo(container: Node, SVG: () => Svg.Svg): void;
  layoutPartners(): (number | null)[];
  generalLayoutProps(): GeneralLayoutProps;
  setGeneralLayoutProps(props: GeneralLayoutProps): void;
  perBaseLayoutProps(): PerBaseLayoutProps[];
  setPerBaseLayoutProps(props: PerBaseLayoutProps[]): void;
  baseWidth: number;
  baseHeight: number;
  layout(): StrictLayout | null;
  applyLayout(): void;
  hasFlatOutermostLoop(): boolean;
  flatOutermostLoop(): void;
  hasRoundOutermostLoop(): boolean;
  roundOutermostLoop(): void;
  savableState(): StrictDrawingSavableState;
  savableString: string;
  applySavedState(savedState: StrictDrawingSavableState): boolean;
  refreshIds(): void;
  zoom: number;
  isEmpty(): boolean;
  sequenceIds(): string[];
  appendSequence(id: string, characters: string): boolean;
  appendStructure(s: Structure): boolean;
  svgString: string;
}

export default StrictDrawingInterface;
