import * as Svg from '@svgdotjs/svg.js';
import {
  SequenceInterface as Sequence,
  SequenceSavableState,
} from './SequenceInterface';
import { BaseInterface as Base } from './BaseInterface';
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
  sequences: SequenceSavableState[];
  primaryBonds: SavableStraightBondState[];
  secondaryBonds: SavableStraightBondState[];
  tertiaryBonds: SavableTertiaryBondState[];
}

export interface DrawingInterface {
  readonly svg: Svg.Svg;
  addTo(container: Node, SVG: () => Svg.Svg): void;
  centerView: () => void;
  scrollLeft: number;
  scrollTop: number;

  width: number;
  height: number;
  setWidthAndHeight(w: number, h: number): void;
  zoom: number;

  numSequences: number;
  isEmpty(): boolean;
  getSequenceById(id: string): Sequence | undefined;
  getSequenceAtIndex(i: number): Sequence | undefined;
  forEachSequence(f: (seq: Sequence) => void): void;
  sequenceIds(): string[];
  sequenceIdIsTaken(id: string): boolean;
  overallCharacters: string;
  appendSequenceOutOfView(id: string, characters: string): Sequence | null;
  onAddSequence(f: (seq: Sequence) => void): void;
  fireAddSequence(seq: Sequence): void;

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
  numPrimaryBonds: number;
  getPrimaryBondById(id: string): PrimaryBond | undefined;
  forEachPrimaryBond(f: (pb: PrimaryBond) => void): void;
  addPrimaryBond(b1: Base, b2: Base): PrimaryBond;
  removePrimaryBondById(id: string): void;

  readonly secondaryBonds: SecondaryBond[];
  numSecondaryBonds: number;
  getSecondaryBondById(id: string): SecondaryBond | undefined;
  forEachSecondaryBond(f: (sb: SecondaryBond) => void): void;
  addSecondaryBond(b1: Base, b2: Base): SecondaryBond;
  removeSecondaryBondById(id: string): void;

  readonly tertiaryBonds: TertiaryBond[];
  numTertiaryBonds: number;
  getTertiaryBondById(id: string): TertiaryBond | undefined;
  getTertiaryBondsByIds(ids: Set<string>): TertiaryBond[];
  forEachTertiaryBond(f: (tb: TertiaryBond) => void): void;
  addTertiaryBond(b1: Base, b2: Base): TertiaryBond;
  onAddTertiaryBond(f: (tb: TertiaryBond) => void): void;
  fireAddTertiaryBond(tb: TertiaryBond): void;
  removeTertiaryBondById(id: string): void;

  repositionBonds(): void;
  adjustNumberingLineAngles(): void;
  adjustBaseNumbering(): void;
  onMousedown(f: () => void): void;
  onDblclick(f: () => void): void;
  clear(): void;
  svgString: string;
  savableState(): DrawingSavableState;
  applySavedState(savedState: DrawingSavableState): boolean;
  refreshIds(): void;
}

export default DrawingInterface;
