import { StrictDrawingInterface as StrictDrawing } from 'Draw/strict/StrictDrawingInterface';
import { Base } from 'Draw/bases/Base';
import { removeBases } from 'Draw/strict/removeBases';
import { SubsequenceProps } from 'Draw/sequences/remove/subsequence';

export function removeSubsequence(strictDrawing: StrictDrawing, props: SubsequenceProps) {
  let bs = props.parent.bases.slice(props.start - 1, props.end);

  // remove any falsy elements if present
  bs = bs.filter(b => b instanceof Base);

  removeBases(strictDrawing, bs);
}
