import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { Base } from 'Draw/bases/Base';
import { FormFactory } from 'FormContainer';

export interface AnnotatingModeInterface {
  hovered?: number;
  selected: Set<number>;
  selectingFrom?: number;

  deselectingOnDblclick?: boolean;

  readonly className: string;

  readonly strictDrawing: StrictDrawing;

  handleMouseoverOnBase(b: Base): void;
  handleMouseoutOnBase(b: Base): void;
  handleMousedownOnBase(b: Base): void;
  handleMousedownOnDrawing(): void;
  handleDblclickOnDrawing(): void;
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
