import { BaseInterface as Base } from 'Draw/bases/BaseInterface';
import {
  SavableState as SavableCircleAnnotationState,
  savableState as savableCircleAnnotationState,
} from 'Draw/bases/annotate/circle/save';
import {
  SavableState as SavableNumberingState,
  savableState as savableNumberingState,
} from 'Draw/bases/number/save';

export type SavableState = {
  className: 'Base';
  textId: string;
  highlighting?: SavableCircleAnnotationState;
  outline?: SavableCircleAnnotationState;
  numbering?: SavableNumberingState;
}

export function savableState(b: Base): SavableState {
  let saved: SavableState = {
    className: 'Base',
    textId: String(b.text.id()),
  };
  if (b.highlighting) {
    saved.highlighting = savableCircleAnnotationState(b.highlighting);
  }
  if (b.outline) {
    saved.outline = savableCircleAnnotationState(b.outline);
  }
  if (b.numbering) {
    saved.numbering = savableNumberingState(b.numbering);
  }
  return saved;
}
