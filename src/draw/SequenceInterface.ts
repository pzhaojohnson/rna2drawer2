import { BaseSavableState } from './BaseInterface';

export interface SequenceMostRecentProps {
  numberingAnchor: number;
  numberingIncrement: number;
}

export interface SequenceSavableState {
  id: string;
  bases: BaseSavableState[];
  numberingOffset: number;
  numberingAnchor: number;
  numberingIncrement: number;
}

export interface SequenceInterface {}

export default SequenceInterface;
