import type { StrictDrawing } from 'Draw/strict/StrictDrawing';
import type { Base } from 'Draw/bases/Base';
import { unpair } from 'Draw/strict/unpair';
import { compareNumbersDescending } from 'Array/sort';
import { removeBases as removeBasesFromDrawing } from 'Draw/sequences/remove/bases';

function isNumber(v: unknown): v is number {
  return typeof v == 'number';
}

function removePerBaseLayoutProps(strictDrawing: StrictDrawing, bs: Base[]) {
  let seq = strictDrawing.layoutSequence();
  let basesToPositions = seq.basesToPositions();

  // the base positions to remove
  let ps = bs.map(b => basesToPositions.get(b)).filter(isNumber);

  // splicing must be done in descending order by position to be correct
  ps.sort(compareNumbersDescending);

  let perBaseLayoutProps = strictDrawing.perBaseLayoutProps();
  ps.forEach(p => {
    perBaseLayoutProps.splice(p - 1, 1);
  });
  strictDrawing.setPerBaseLayoutProps(perBaseLayoutProps);
}

export function removeBases(strictDrawing: StrictDrawing, bs: Base[]) {
  unpair(strictDrawing, bs, { updateLayout: false });
  removePerBaseLayoutProps(strictDrawing, bs);
  removeBasesFromDrawing(strictDrawing.drawing, bs);
  strictDrawing.updateLayout();
}
