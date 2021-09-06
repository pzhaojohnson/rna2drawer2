import * as Svg from '@svgdotjs/svg.js';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { SavableState as SavableSequenceState } from 'Draw/sequences/save';
import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import { PrimaryBondInterface as PrimaryBond } from 'Draw/bonds/straight/PrimaryBondInterface';
import { SecondaryBondInterface as SecondaryBond } from 'Draw/bonds/straight/SecondaryBondInterface';
import {
  SavableState as SavableStraightBondState,
} from 'Draw/bonds/straight/save';
import { TertiaryBondInterface as TertiaryBond } from 'Draw/bonds/curved/TertiaryBondInterface';
import {
  SavableState as SavableTertiaryBondState,
} from 'Draw/bonds/curved/save';

export interface DrawingSavableState {
  className: string;
  svg: string;
  sequences: SavableSequenceState[];
  primaryBonds: SavableStraightBondState[];
  secondaryBonds: SavableStraightBondState[];
  tertiaryBonds: SavableTertiaryBondState[];
}

export interface DrawingInterface {
  readonly svg: Svg.Svg;
  addTo(container: Node, SVG: () => Svg.Svg): void;
  scrollLeft: number;
  readonly scrollWidth: number;
  scrollTop: number;
  readonly scrollHeight: number;

  width: number;
  height: number;
  setWidthAndHeight(w: number, h: number): void;
  zoom: number;

  readonly sequences: Sequence[];
  numSequences: number;
  isEmpty(): boolean;
  getSequenceById(id: string): Sequence | undefined;
  getSequenceAtIndex(i: number): Sequence | undefined;
  forEachSequence(f: (seq: Sequence) => void): void;
  sequenceIds(): string[];
  sequenceIdIsTaken(id: string): boolean;
  overallCharacters: string;
  appendSequence(id: string, characters: string): Sequence | null;

  numBases: number;
  getBaseById(id: string): Base | null;
  getBaseAtOverallPosition(p: number): Base | undefined;
  overallPositionOfBase(b: Base): number;
  forEachBase(f: (b: Base, position: number) => void): void;
  bases(): Base[];
  baseIds(): string[];
  sequenceOfBase(b: Base): Sequence | undefined;
  createBases(characters: string): Base[];

  readonly primaryBonds: PrimaryBond[];
  readonly secondaryBonds: SecondaryBond[];
  readonly tertiaryBonds: TertiaryBond[];

  repositionBonds(): void;
  clear(): void;
  svgString: string;
  savableState(): DrawingSavableState;
  applySavedState(savedState: DrawingSavableState): boolean;
}

export default DrawingInterface;
