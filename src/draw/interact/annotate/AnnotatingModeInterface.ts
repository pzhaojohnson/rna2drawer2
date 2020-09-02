import { DrawingInterface as Drawing } from "../../DrawingInterface";
import { BaseInterface as Base } from '../../BaseInterface';
import * as React from 'react';

export interface FormFactory {
  (close?: () => void): React.ReactElement;
}

export interface AnnotatingModeInterface {
  hovered?: number;
  selected: Set<number>;
  selectingFrom?: number;

  readonly className: string;

  readonly drawing: Drawing;

  handleMouseoverOnBase(b: Base): void;
  handleMouseoutOnBase(b: Base): void;
  handleMousedownOnBase(b: Base): void;
  handleMousedownOnDrawing(): void;
  select(ps: number[]): void;
  clearSelection(): void;
  reset(): void;

  disabled(): boolean;
  disable(): void;
  enabled(): boolean;
  enable(): void;

  onShouldPushUndo(f: () => void): void;
  fireShouldPushUndo(): void;
  onChange(f: () => void): void;
  fireChange(): void;
  onRequestToRenderForm(f: (ff: FormFactory) => void): void;
  requestToRenderForm(): void;
  closeForm(): void;
}

export default AnnotatingModeInterface;
