export interface QuadraticBezierBondSavableState {
  className: string;
  pathId: string;
  baseId1: string;
  baseId2: string;
}

export interface QuadraticBezierBondInterface {}

export interface TertiaryBondMostRecentProps {
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
  strokeDasharray: string;
}

export interface TertiaryBondInterface extends QuadraticBezierBondInterface {}

export default QuadraticBezierBondInterface;
