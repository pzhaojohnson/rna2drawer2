import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { PrimaryBond } from 'Draw/bonds/straight/PrimaryBond';
import type { SecondaryBond } from 'Draw/bonds/straight/SecondaryBond';
import { isSecondaryBond } from './isSecondaryBond';
import type { TertiaryBond } from 'Draw/bonds/curved/TertiaryBond';
import { isTertiaryBond } from './isTertiaryBond';
import { Side } from './Side';
import { bondBindsSide } from './bondBindsSide';

export type Bond = (
  PrimaryBond
  | SecondaryBond
  | TertiaryBond
);

// returns all bonds binding the given side in the strict drawing
export function bondsBindingSide(strictDrawing: StrictDrawing, side: Side): Bond[] {
  return [
    ...strictDrawing.drawing.primaryBonds,
    ...strictDrawing.drawing.secondaryBonds,
    ...strictDrawing.drawing.tertiaryBonds,
  ].filter(bond => bondBindsSide(bond, side));
}

export function secondaryBondsBindingSide(strictDrawing: StrictDrawing, side: Side): SecondaryBond[] {
  return bondsBindingSide(strictDrawing, side).filter(
    (bond): bond is SecondaryBond => isSecondaryBond(bond)
  );
}

export function tertiaryBondsBindingSide(strictDrawing: StrictDrawing, side: Side): TertiaryBond[] {
  return bondsBindingSide(strictDrawing, side).filter(
    (bond): bond is TertiaryBond => isTertiaryBond(bond)
  );
}
