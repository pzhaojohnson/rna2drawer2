import {
  DrawingInterface as Drawing,
  DrawingSavableState,
} from 'Draw/DrawingInterface';
import * as Svg from '@svgdotjs/svg.js';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { Partners } from 'Partners/Partners';
import {
  GeneralStrictLayoutProps as GeneralLayoutProps,
  GeneralStrictLayoutPropsSavableState as GeneralLayoutPropsSavableState,
} from 'Draw/strict/layout/GeneralStrictLayoutProps';
import {
  PerBaseStrictLayoutProps as PerBaseLayoutProps,
  PerBaseStrictLayoutPropsSavableState as PerBaseLayoutPropsSavableState
} from 'Draw/strict/layout/PerBaseStrictLayoutProps';
import { Options as UpdateLayoutOptions } from 'Draw/edit/updateLayout';
import { Structure } from 'Draw/edit/appendStructureToStrictDrawing';

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

  // Returns the sequence of all bases in the drawing
  // to which the strict layout is applied to.
  //
  // Is obtained by concatenating all sequences in the underlying drawing
  // in the order they are present in the underlying drawing.
  layoutSequence(): Sequence;
  
  layoutPartners(): Partners;
  generalLayoutProps: GeneralLayoutProps;
  perBaseLayoutProps(): PerBaseLayoutProps[];
  setPerBaseLayoutProps(props: PerBaseLayoutProps[]): void;
  baseWidth: number;
  baseHeight: number;
  updateLayout(options?: UpdateLayoutOptions): void;
  hasFlatOutermostLoop(): boolean;
  flatOutermostLoop(): void;
  hasRoundOutermostLoop(): boolean;
  roundOutermostLoop(): void;
  savableState(): StrictDrawingSavableState;
  savableString: string;
  applySavedState(savedState: StrictDrawingSavableState): boolean;
  isEmpty(): boolean;
  sequenceIds(): string[];
  appendSequence(id: string, characters: string): boolean;
  appendStructure(s: Structure): boolean;
  svgString: string;
}

export default StrictDrawingInterface;
