import * as SVG from '@svgdotjs/svg.js';
import { SequenceInterface as Sequence } from 'Draw/sequences/SequenceInterface';
import { SavableState as SavableSequenceState } from 'Draw/sequences/save';
import type { Base } from 'Draw/bases/Base';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import {
  SavableState as SavableStraightBondState,
} from 'Draw/bonds/straight/save';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
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
  readonly svg: SVG.Svg;
  readonly svgContainer: HTMLElement;

  // the outermost node of the drawing containing all elements of the drawing
  // (add as a child to a container to add the drawing as a child to the container)
  readonly node: Node;

  appendTo(container: Node): void;
  scrollLeft: number;
  readonly scrollWidth: number;
  scrollTop: number;
  readonly scrollHeight: number;

  width: number;
  height: number;

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
