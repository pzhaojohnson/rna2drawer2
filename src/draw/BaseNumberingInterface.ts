export interface BaseNumberingMostRecentProps {
  basePadding: number;
  lineLength: number;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  color: string;
  lineStrokeWidth: number;
}

export interface BaseNumberingSavableState {
  className: string;
  textId: string;
  lineId: string;
}

export interface BaseNumberingInterface {}

export default BaseNumberingInterface;
