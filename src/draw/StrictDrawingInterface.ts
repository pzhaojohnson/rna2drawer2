import {
  DrawingInterface as Drawing,
  DrawingSavableState,
} from './DrawingInterface';
import GeneralStrictLayoutProps from './layout/singleseq/strict/GeneralStrictLayoutProps';
import PerBaseStrictLayoutProps from './layout/singleseq/strict/PerBaseStrictLayoutProps';

interface GeneralLayoutPropsSavableState {}

interface PerBaseLayoutPropsSavableState {}

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
  layoutPartners: () => (number | null)[];
  generalLayoutProps: () => GeneralStrictLayoutProps;
  setGeneralLayoutProps: (props: GeneralStrictLayoutProps) => void;
  perBaseLayoutProps: () => PerBaseStrictLayoutProps[];
  setPerBaseLayoutProps: (props: PerBaseStrictLayoutProps[]) => void;
  baseWidth: number;
  baseHeight: number;

  isEmpty: () => boolean;

  applyLayout: () => void;

  savableState: () => StrictDrawingSavableState;
}

export default StrictDrawingInterface;
