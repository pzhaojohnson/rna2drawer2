import { QuadraticBezierBondInterface } from './QuadraticBezierBondInterface';

export interface TertiaryBondMostRecentProps {
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
  strokeDasharray: string;
}

export interface TertiaryBondInterface extends QuadraticBezierBondInterface {
  padding1: number;
  padding2: number;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
  strokeDasharray: string;
}
